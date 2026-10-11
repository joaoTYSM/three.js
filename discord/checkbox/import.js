/*
  Checkbox discord reads HTML/CSS checkboxes (size, colors, rounded corners,
  transforms, and animations) and redraws them using three.js over the original element,
  preserving the original click functionality and JavaScript. Upon import, it automatically
  processes every `.checkbox` on the page, except those with the `data-css` attribute..
*/
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';

const PAD = 2;

const VERTEX = `
uniform vec2 uQuad;
varying vec2 vPos;
void main() {
  vPos = position.xy * uQuad;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const FRAGMENT = `
uniform vec2 uSize;
uniform vec4 uRadii;
uniform vec3 uColor;
uniform float uAlpha;
uniform float uPx;
varying vec2 vPos;

float roundedBox(vec2 p, vec2 b, vec4 r) {
  r.xy = p.x > 0.0 ? r.xy : r.zw;
  r.x = p.y > 0.0 ? r.x : r.y;
  vec2 q = abs(p) - b + r.x;
  return min(max(q.x, q.y), 0.0) + length(max(q, 0.0)) - r.x;
}

void main() {
  float d = roundedBox(vPos, uSize * 0.5, uRadii);
  float a = clamp(0.5 - d * uPx, 0.0, 1.0);
  if (a <= 0.0) discard;
  gl_FragColor = vec4(uColor, uAlpha * a);
}
`;

const geometry = new THREE.PlaneGeometry(1, 1);
const IDENTITY = new THREE.Matrix4();
const m4a = new THREE.Matrix4();
const m4b = new THREE.Matrix4();
const m4c = new THREE.Matrix4();

const probe = document.createElement('canvas');
probe.width = 1;
probe.height = 1;
const probeCtx = probe.getContext('2d', { willReadFrequently: true });
const colorCache = new Map();

const active = new Set();
let frame = 0;
let shared = null;

const px = (value) => parseFloat(value) || 0;

function parseColor(value) {
  let color = colorCache.get(value);
  if (color) return color;
  const match = value.match(/^rgba?\(\s*([\d.]+)[\s,]+([\d.]+)[\s,]+([\d.]+)(?:\s*[,/]\s*([\d.]+)(%?))?\s*\)$/);
  if (match) {
    const alpha = match[4] === undefined ? 1 : match[5] ? match[4] / 100 : +match[4];
    color = [match[1] / 255, match[2] / 255, match[3] / 255, alpha];
  } else {
    probeCtx.clearRect(0, 0, 1, 1);
    probeCtx.fillStyle = '#000';
    probeCtx.fillStyle = value;
    probeCtx.fillRect(0, 0, 1, 1);
    const d = probeCtx.getImageData(0, 0, 1, 1).data;
    color = [d[0] / 255, d[1] / 255, d[2] / 255, d[3] / 255];
  }
  if (colorCache.size > 512) colorCache.clear();
  colorCache.set(value, color);
  return color;
}

function radius(value, width) {
  const token = value.split(' ')[0];
  const n = parseFloat(token) || 0;
  return token.endsWith('%') ? (n / 100) * width : n;
}

function readTransform(value, out) {
  if (!value || value === 'none') return out.identity();
  const v = value.slice(value.indexOf('(') + 1, value.lastIndexOf(')')).split(',').map(Number);
  if (value.startsWith('matrix3d')) {
    return out.set(v[0], v[4], v[8], v[12], v[1], v[5], v[9], v[13], v[2], v[6], v[10], v[14], v[3], v[7], v[11], v[15]);
  }
  return out.set(v[0], v[2], 0, v[4], v[1], v[3], 0, v[5], 0, 0, 1, 0, 0, 0, 0, 1);
}

function getShared() {
  if (!shared) {
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false, premultipliedAlpha: true });
    renderer.setClearColor(0x000000, 0);
    shared = { renderer, w: 0, h: 0, k: 0 };
  }
  return shared;
}

function createNode(el, root, scene, order) {
  const material = new THREE.ShaderMaterial({
    vertexShader: VERTEX,
    fragmentShader: FRAGMENT,
    uniforms: {
      uQuad: { value: new THREE.Vector2() },
      uSize: { value: new THREE.Vector2() },
      uRadii: { value: new THREE.Vector4() },
      uColor: { value: new THREE.Vector3() },
      uAlpha: { value: 1 },
      uPx: { value: 1 }
    },
    transparent: true,
    depthTest: false,
    depthWrite: false,
    side: THREE.DoubleSide
  });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.frustumCulled = false;
  mesh.matrixAutoUpdate = false;
  mesh.renderOrder = order.n++;
  scene.add(mesh);
  const node = {
    el,
    root,
    mesh,
    material,
    w: 0,
    h: 0,
    world: new THREE.Matrix4(),
    inner: new THREE.Matrix4(),
    kids: []
  };
  for (const child of el.children) {
    if (child.hasAttribute('data-checkbox3d')) continue;
    node.kids.push(createNode(child, false, scene, order));
  }
  return node;
}

function hideNode(node) {
  node.mesh.visible = false;
  for (const kid of node.kids) hideNode(kid);
}

function disposeNode(node) {
  node.material.dispose();
  for (const kid of node.kids) disposeNode(kid);
}

function updateNode(node, parentMatrix, parentOpacity, k, sig) {
  const el = node.el;
  const cs = getComputedStyle(el);
  if (cs.display === 'none') {
    hideNode(node);
    return;
  }

  let w = parseFloat(cs.width);
  let h = parseFloat(cs.height);
  if (Number.isNaN(w)) {
    w = el.offsetWidth;
  } else if (cs.boxSizing === 'content-box') {
    w += px(cs.paddingLeft) + px(cs.paddingRight) + px(cs.borderLeftWidth) + px(cs.borderRightWidth);
  }
  if (Number.isNaN(h)) {
    h = el.offsetHeight;
  } else if (cs.boxSizing === 'content-box') {
    h += px(cs.paddingTop) + px(cs.paddingBottom) + px(cs.borderTopWidth) + px(cs.borderBottomWidth);
  }
  node.w = w;
  node.h = h;

  let x = 0;
  let y = 0;
  if (!node.root) {
    x = cs.position === 'absolute' ? parseFloat(cs.left) : NaN;
    y = cs.position === 'absolute' ? parseFloat(cs.top) : NaN;
    if (Number.isNaN(x)) x = el.offsetLeft;
    if (Number.isNaN(y)) y = el.offsetTop;
  }

  const origin = cs.transformOrigin.split(' ');
  let ox = parseFloat(origin[0]);
  let oy = parseFloat(origin[1]);
  if (Number.isNaN(ox)) ox = w / 2;
  if (Number.isNaN(oy)) oy = h / 2;

  if (node.root) m4a.identity();
  else readTransform(cs.transform, m4a);
  node.world
    .copy(parentMatrix)
    .multiply(m4b.makeTranslation(x + ox, y + oy, 0))
    .multiply(m4a)
    .multiply(m4b.makeTranslation(-ox, -oy, 0));

  node.mesh.matrix
    .copy(node.world)
    .multiply(m4b.makeTranslation(w / 2, h / 2, 0))
    .multiply(m4c.makeScale(w + PAD * 2, h + PAD * 2, 1));

  node.inner.copy(node.world).multiply(m4b.makeTranslation(px(cs.borderLeftWidth), px(cs.borderTopWidth), 0));

  const opacity = parentOpacity * (Number.isNaN(parseFloat(cs.opacity)) ? 1 : parseFloat(cs.opacity));
  const color = parseColor(cs.backgroundColor);
  const alpha = color[3] * opacity;

  const tl = radius(cs.borderTopLeftRadius, w);
  const tr = radius(cs.borderTopRightRadius, w);
  const br = radius(cs.borderBottomRightRadius, w);
  const bl = radius(cs.borderBottomLeftRadius, w);
  const f = Math.min(
    1,
    tl + tr > 0 ? w / (tl + tr) : 1,
    bl + br > 0 ? w / (bl + br) : 1,
    tl + bl > 0 ? h / (tl + bl) : 1,
    tr + br > 0 ? h / (tr + br) : 1
  );

  const u = node.material.uniforms;
  u.uSize.value.set(w, h);
  u.uQuad.value.set(w + PAD * 2, h + PAD * 2);
  u.uRadii.value.set(br * f, tr * f, bl * f, tl * f);
  u.uColor.value.set(color[0], color[1], color[2]);
  u.uAlpha.value = alpha;
  u.uPx.value = k;
  node.mesh.visible = alpha > 0.001;

  const e = node.mesh.matrix.elements;
  sig.push(w, h, color[0], color[1], color[2], alpha, tl, tr, br, bl, e[0], e[1], e[4], e[5], e[12], e[13]);

  for (const kid of node.kids) updateNode(kid, node.inner, opacity, k, sig);
}

class Instance {
  constructor(host, pixelRatio) {
    this.host = host;
    this.pixelRatio = pixelRatio;
    this.saved = { visibility: host.style.visibility, position: host.style.position };
    this.scene = new THREE.Scene();
    this.camera = new THREE.OrthographicCamera(0, 1, 0, 1, 0, 2);
    this.camera.position.z = 1;
    this.camW = 0;
    this.camH = 0;
    this.key = '';
    this.root = createNode(host, true, this.scene, { n: 0 });

    this.canvas = document.createElement('canvas');
    this.canvas.setAttribute('data-checkbox3d', '');
    Object.assign(this.canvas.style, {
      position: 'absolute',
      left: '0',
      top: '0',
      width: '100%',
      height: '100%',
      display: 'block',
      visibility: 'visible',
      cursor: 'inherit'
    });
    this.ctx = this.canvas.getContext('2d');

    if (getComputedStyle(host).position === 'static') host.style.position = 'relative';
    this.shown = false;
    host.appendChild(this.canvas);
  }

  render() {
    const host = this.host;
    const offset = host.offsetWidth;
    const scale = offset > 0 ? host.getBoundingClientRect().width / offset : 1;
    const k = (this.pixelRatio || window.devicePixelRatio || 1) * (scale || 1);

    const sig = [k];
    updateNode(this.root, IDENTITY, 1, k, sig);
    const key = sig.join(',');
    if (key === this.key) return;
    this.key = key;

    const w = this.root.w;
    const h = this.root.h;
    if (!(w > 0 && h > 0)) return;

    const s = getShared();
    if (s.k !== k) {
      s.renderer.setPixelRatio(k);
      s.k = k;
    }
    if (s.w !== w || s.h !== h) {
      s.renderer.setSize(w, h, false);
      s.w = w;
      s.h = h;
    }
    if (this.camW !== w || this.camH !== h) {
      this.camera.right = w;
      this.camera.bottom = h;
      this.camera.updateProjectionMatrix();
      this.camW = w;
      this.camH = h;
    }

    s.renderer.render(this.scene, this.camera);
    const source = s.renderer.domElement;
    if (this.canvas.width !== source.width || this.canvas.height !== source.height) {
      this.canvas.width = source.width;
      this.canvas.height = source.height;
    }
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.drawImage(source, 0, 0);
    if (!this.shown) {
      this.shown = true;
      this.host.style.visibility = 'hidden';
    }
  }

  destroy() {
    active.delete(this);
    this.canvas.remove();
    this.host.style.visibility = this.saved.visibility;
    this.host.style.position = this.saved.position;
    disposeNode(this.root);
  }
}

function tick() {
  for (const instance of [...active]) {
    try {
      instance.render();
    } catch (error) {
      console.error(error);
      instance.destroy();
    }
  }
  frame = active.size ? requestAnimationFrame(tick) : 0;
}

function start() {
  if (!frame && active.size) frame = requestAnimationFrame(tick);
}

export function mount(selector = '.checkbox', options = {}) {
  const { observe = true, pixelRatio } = options;
  const instances = new Map();

  const add = (el) => {
    if (instances.has(el)) return;
    const instance = new Instance(el, pixelRatio);
    instances.set(el, instance);
    active.add(instance);
    start();
  };

  const remove = (el) => {
    const instance = instances.get(el);
    if (!instance) return;
    instance.destroy();
    instances.delete(el);
  };

  document.querySelectorAll(selector).forEach(add);

  let observer = null;
  if (observe) {
    observer = new MutationObserver((records) => {
      for (const record of records) {
        for (const node of record.addedNodes) {
          if (node.nodeType !== 1) continue;
          if (node.matches(selector)) add(node);
          node.querySelectorAll(selector).forEach(add);
        }
        for (const node of record.removedNodes) {
          if (node.nodeType !== 1) continue;
          remove(node);
          node.querySelectorAll(selector).forEach(remove);
        }
      }
    });
    observer.observe(document.documentElement, { childList: true, subtree: true });
  }

  return {
    instances,
    destroy() {
      if (observer) observer.disconnect();
      for (const el of [...instances.keys()]) remove(el);
    }
  };
}

export default { mount };

if (!new URL(import.meta.url).searchParams.has('manual')) {
  const auto = () => mount('.checkbox:not([data-css])');
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', auto);
  else auto();
}
