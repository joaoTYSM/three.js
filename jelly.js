/*
 ──────────────────────────────────────────────────────────────────────────
        ██╗███████╗██╗     ██╗  ██╗   ██╗
        ██║██╔════╝██║     ██║  ╚██╗ ██╔╝
        ██║█████╗  ██║     ██║   ╚████╔╝
   ██   ██║██╔══╝  ██║     ██║    ╚██╔╝
   ╚█████╔╝███████╗███████╗███████╗██║
    ╚════╝ ╚══════╝╚══════╝╚══════╝╚═╝          By joao repo: joaoTYSM/tree.js/jelly.js
                                                      Discord: https://discord.gg/AUddtuAGUf (get role in server; "tree.js")

              .-~~~~~~~~~~~~~~~-.
            .'   (●)       (●)   '.        three.js · soft body physics
           /           ‿‿          \       translucent · wobbly · yours
           |                       |
            '.                   .'
              '-._____________.-'
 ──────────────────────────────────────────────────────────────────────────
*/

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { mergeVertices } from 'three/addons/utils/BufferGeometryUtils.js';

const DEFAULTS = {
  // material
  flavor: 'berry', transparency: 100, saturation: 40, roughness: 5, thickness: 22,
  refraction: 35, reflections: 48, texture: true, wireframe: false,
  // physical
  firmness: 38, damping: 28, pullRadius: 22, stretch: 65, wobble: 70, speed: 100,
  gravity: true, paused: false, tapBounce: .65, deformer: null,
  // form and scene
  size: 100, height: 100, rotation: 346, autoRotate: false, zoom: 100,
  lighting: 54, shadow: 35, exposure: 1.15, ambient: 2, lightPosition: [-3, 7, 5],
  background: null, pixelRatio: 2, antialias: true,
  // face
  eyes: true, blink: true, eyeColor: 'oklch(.27 .018 45)', threadColor: 'oklch(.95 .02 85)',
  eyePositions: [[-.47, .23, 1.28], [.47, .23, 1.28]],
  // Input and camera: interaction = 'pull' | 'move' | 'camera' | 'none'
  interaction: 'pull', orbit: true, orbitZoom: true, cursor: true,
  cameraDistance: null, fov: 34, touchAction: 'none',
  // counters (compatible with external state)
  impulse: 0, reset: 0,
  colors: { clear: 'oklch(1 0 0)' },
  flavors: {
    berry: { color: 'oklch(.57 .245 351)', pattern: 'speckle' },
    mint:  { color: 'oklch(.72 .17 158)',  pattern: 'speckle' },
    honey: { color: 'oklch(.76 .18 80)',   pattern: 'hex' },
    lemon: { color: 'oklch(.86 .2 105)',   pattern: 'dots' }
  },
  // creation only
  body: { size: [2.8, 2.35, 2.5], segments: [36, 32, 34], core: [1, .775, .85], round: .4, ripple: .055, squash: .8 }
};

function createButtonEyes(color, threadColor, positions) {
  const shape = new THREE.Shape();
  shape.absarc(0, 0, .225, 0, Math.PI * 2, false);
  for (const x of [-.065, .065]) {
    for (const y of [-.065, .065]) {
      const hole = new THREE.Path(); hole.absarc(x, y, .034, 0, Math.PI * 2, true); shape.holes.push(hole);
    }
  }
  const disk = new THREE.ExtrudeGeometry(shape, { depth: .055, bevelEnabled: true, bevelSize: .014, bevelThickness: .012, bevelSegments: 2, steps: 1, curveSegments: 24 });
  const rim = new THREE.TorusGeometry(.196, .012, 6, 32);
  const thread = new THREE.CylinderGeometry(.009, .009, .185, 6);
  const buttonMat = new THREE.MeshStandardMaterial({ color, roughness: .27, metalness: .1 });
  const threadMat = new THREE.MeshStandardMaterial({ color: threadColor, roughness: .85 });
  const eyes = positions.map(([x, y, z]) => {
    const group = new THREE.Group(); group.position.set(x, y, z);
    group.add(new THREE.Mesh(disk, buttonMat));
    const border = new THREE.Mesh(rim, buttonMat); border.position.z = .067; group.add(border);
    for (const angle of [-Math.PI / 4, Math.PI / 4]) {
      const stitch = new THREE.Mesh(thread, threadMat); stitch.rotation.z = angle; stitch.position.z = .078; group.add(stitch);
    }
    return group;
  });
  return { eyes, buttonMat, threadMat, dispose() { disk.dispose(); rim.dispose(); thread.dispose(); buttonMat.dispose(); threadMat.dispose(); } };
}

function createFlavorTexture(pattern, base, ink) {
  const canvas = document.createElement('canvas'); canvas.width = canvas.height = 512;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = base.getStyle(); ctx.fillRect(0, 0, 512, 512);
  ctx.strokeStyle = ink.getStyle(); ctx.fillStyle = ink.getStyle(); ctx.lineWidth = 2;
  if (pattern === 'hex') {
    ctx.globalAlpha = .28;
    const r = 30;
    for (let row = -1; row < 12; row++) {
      for (let col = -1; col < 12; col++) {
        const x = col * r * 1.5, y = row * r * Math.sqrt(3) + (col % 2) * r * Math.sqrt(3) / 2;
        ctx.beginPath();
        for (let k = 0; k < 6; k++) {
          const a = k * Math.PI / 3, px = x + r * Math.cos(a), py = y + r * Math.sin(a);
          if (k === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
        }
        ctx.closePath(); ctx.stroke();
      }
    }
  } else {
    const dots = pattern === 'dots';
    ctx.globalAlpha = dots ? .24 : .34;
    for (let i = 0; i < 750; i++) {
      const x = (i * 137.508) % 512, y = (i * 73.317 + Math.sin(i) * 50 + 512) % 512;
      ctx.beginPath(); ctx.ellipse(x, y, dots ? 1.6 : 2, dots ? 1.6 : 4, i * .6, 0, Math.PI * 2); ctx.fill();
    }
  }
  const texture = new THREE.CanvasTexture(canvas); texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  return texture;
}

export class Jelly {
  constructor(host, opts = {}) {
    host = typeof host === 'string' ? document.querySelector(host) : host;
    if (!host) throw new Error('Jelly: elemento host não encontrado');
    const { on = {}, ...rest } = opts, D = Jelly.defaults;
    const s = this.s = {
      ...D, ...rest,
      colors: { ...D.colors, ...rest.colors },
      flavors: { ...D.flavors, ...rest.flavors },
      body: { ...D.body, ...rest.body }
    };
    const base = JSON.stringify(s);
    this.host = host; host.jelly = this;

    const ev = {}, stash = {}, jelly = this;
    for (const [k, f] of Object.entries(on)) ev[k] = [].concat(f);
    const emit = (k, a) => ev[k]?.forEach(f => f(a, jelly));

    const colorCache = new Map();
    const cctx = Object.assign(document.createElement('canvas'), { width: 1, height: 1 }).getContext('2d', { willReadFrequently: true });
    const col = (str) => {
      let c = colorCache.get(str);
      if (!c) {
        cctx.clearRect(0, 0, 1, 1); cctx.fillStyle = '#000'; cctx.fillStyle = str; cctx.fillRect(0, 0, 1, 1);
        const d = cctx.getImageData(0, 0, 1, 1).data;
        c = new THREE.Color().setRGB(d[0] / 255, d[1] / 255, d[2] / 255, THREE.SRGBColorSpace);
        colorCache.set(str, c);
      }
      return c;
    };

    const scene = new THREE.Scene();
    const renderer = new THREE.WebGLRenderer({ antialias: s.antialias, alpha: true });
    renderer.setClearColor(0x000000, 0);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    const canvas = renderer.domElement;
    canvas.style.cssText = `display:block;width:100%;height:100%;touch-action:${s.touchAction}`;
    host.appendChild(canvas);

    const camera = new THREE.PerspectiveCamera(s.fov, 1, 0.1, 100);
    const pmrem = new THREE.PMREMGenerator(renderer);
    const room = new RoomEnvironment();
    const environment = pmrem.fromScene(room, .04);
    scene.environment = environment.texture;
    room.dispose();

    const light = new THREE.DirectionalLight(0xffffff, 4);
    light.castShadow = true;
    light.shadow.mapSize.set(1024, 1024);
    light.shadow.camera.left = -6; light.shadow.camera.right = 6;
    light.shadow.camera.top = 6; light.shadow.camera.bottom = -6;
    light.shadow.normalBias = .04; light.shadow.radius = 5;
    const hemi = new THREE.HemisphereLight(0xffffff, 0x9b9b9b, 2);
    scene.add(light, hemi);

    const ground = new THREE.Mesh(new THREE.PlaneGeometry(200, 200), new THREE.ShadowMaterial({ opacity: .19 }));
    ground.rotation.x = -Math.PI / 2; ground.position.y = -.06; ground.receiveShadow = true; scene.add(ground);

    const b = s.body;
    let geometry = new THREE.BoxGeometry(...b.size, ...b.segments);
    const positions = geometry.getAttribute('position');
    const core = new THREE.Vector3(...b.core);
    const p = new THREE.Vector3(), q = new THREE.Vector3();
    for (let i = 0; i < positions.count; i++) {
      p.fromBufferAttribute(positions, i);
      q.copy(p).clamp(core.clone().negate(), core);
      const n = p.clone().sub(q).normalize();
      p.copy(q).addScaledVector(n, b.round);
      p.addScaledVector(n, b.ripple * Math.sin(p.x * 3.8 + p.z * 2.2) * Math.cos(p.y * 3));
      positions.setXYZ(i, p.x, p.y * b.squash, p.z);
    }
    geometry.deleteAttribute('normal'); geometry.deleteAttribute('uv');
    geometry = mergeVertices(geometry, .0001); geometry.computeVertexNormals();

    const uvPositions = geometry.getAttribute('position'), uvNormals = geometry.getAttribute('normal');
    const uvs = new Float32Array(uvPositions.count * 2);
    const [bx, , bz] = b.size;
    for (let i = 0; i < uvPositions.count; i++) {
      const nx = Math.abs(uvNormals.getX(i)), ny = Math.abs(uvNormals.getY(i)), nz = Math.abs(uvNormals.getZ(i));
      uvs[i * 2] = nx > nz && nx > ny ? (uvPositions.getZ(i) + bz / 2) / bz : (uvPositions.getX(i) + bx / 2) / bx;
      uvs[i * 2 + 1] = ny > nx && ny > nz ? (uvPositions.getZ(i) + bz / 2) / bz : (uvPositions.getY(i) + 1) / 2;
    }
    geometry.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));
    const pos = geometry.getAttribute('position');
    pos.setUsage(THREE.DynamicDrawUsage);
    const rest = new Float32Array(pos.array);
    const velocity = new Float32Array(rest.length);

    const box = new THREE.Box3().setFromBufferAttribute(pos), mid = box.getCenter(new THREE.Vector3());
    const SPOTS = {
      center: [mid.x, mid.y, mid.z], top: [0, box.max.y, 0], bottom: [0, box.min.y, 0],
      front: [0, mid.y, box.max.z], back: [0, mid.y, box.min.z], left: [box.min.x, mid.y, 0], right: [box.max.x, mid.y, 0]
    };

    const material = new THREE.MeshPhysicalMaterial({ color: 0xe00072, roughness: .065, metalness: 0, transmission: 1, thickness: 2.3, ior: 1.42, attenuationColor: new THREE.Color(0xc90059), attenuationDistance: 1.8, clearcoat: 1, clearcoatRoughness: .045, envMapIntensity: 1.8 });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(0, .95, 0); mesh.rotation.y = -.24; mesh.castShadow = true; scene.add(mesh);

    const buttons = createButtonEyes(col(s.eyeColor), col(s.threadColor), s.eyePositions);
    const anchors = buttons.eyes.map(eye => {
      mesh.add(eye);
      let nearest = 0, distance = Infinity;
      for (let i = 0; i < pos.count; i++) {
        const d = (pos.getX(i) - eye.position.x) ** 2 + (pos.getY(i) - eye.position.y) ** 2 + (pos.getZ(i) - eye.position.z) ** 2;
        if (d < distance) { distance = d; nearest = i; }
      }
      return nearest;
    });

    const textures = new Map();
    const orbit = new OrbitControls(camera, canvas);
    orbit.enableDamping = true; orbit.dampingFactor = .1; orbit.zoomToCursor = true;
    orbit.minDistance = 0; orbit.maxDistance = Infinity; orbit.enablePan = false;

    const bodyOffset = new THREE.Vector3(), dragOrigin = new THREE.Vector3(), dragWorldOrigin = new THREE.Vector3();
    const dragNormal = new THREE.Vector3(), dragPoint = new THREE.Vector3(), dragTarget = new THREE.Vector3();
    const worldPoint = new THREE.Vector3(), plane = new THREE.Plane();
    const activePointers = new Set(), raycaster = new THREE.Raycaster(), pointer = new THREE.Vector2();
    const t = [0, 0, 0], d = [0, 0, 0];

    let dragging = false, held = false, moved = false, lastZoom = -1, lastKey = '', lastBg, lastEye = '', lastImpulse = 0, lastReset = 0;
    let previous = performance.now(), elapsed = 0, raf = 0, disposed = false, bounce = 0, pokeTimer = 0;

    const reach = () => .5 + s.stretch * .055;
    const interactive = () => s.interaction === 'pull' || s.interaction === 'move';

    function updatePointer(e) {
      const r = canvas.getBoundingClientRect();
      pointer.set((e.clientX - r.left) / r.width * 2 - 1, -(e.clientY - r.top) / r.height * 2 + 1);
      raycaster.setFromCamera(pointer, camera);
    }

    function down(e) {
      updatePointer(e);
      activePointers.add(e.pointerId);
      if (activePointers.size > 1) { dragging = false; orbit.enabled = s.orbit; return; }
      if (!interactive() || e.button !== 0) { orbit.enabled = s.orbit; return; }
      const hit = raycaster.intersectObject(mesh)[0];
      if (!hit) { orbit.enabled = s.orbit; return; }
      orbit.enabled = false; e.stopImmediatePropagation();
      dragging = true; moved = false; canvas.setPointerCapture(e.pointerId);
      dragPoint.copy(mesh.worldToLocal(hit.point.clone())); dragTarget.copy(dragPoint);
      dragOrigin.copy(bodyOffset); dragWorldOrigin.copy(hit.point);
      dragNormal.copy(hit.face?.normal ?? new THREE.Vector3(0, 1, 0));
      plane.setFromNormalAndCoplanarPoint(camera.getWorldDirection(new THREE.Vector3()), hit.point);
      if (s.cursor) canvas.style.cursor = 'grabbing';
      emit('grab', { point: hit.point.clone() });
    }

    function move(e) {
      updatePointer(e);
      if (dragging) {
        moved = true;
        if (raycaster.ray.intersectPlane(plane, worldPoint)) {
          const displacement = worldPoint.clone().sub(dragWorldOrigin);
          if (s.interaction === 'move') {
            bodyOffset.copy(dragOrigin).add(displacement);
            bodyOffset.y = Math.max(0, bodyOffset.y);
            return;
          }
          const travel = Math.max(0, displacement.length() - reach() * .55);
          bodyOffset.copy(dragOrigin).addScaledVector(displacement.clone().normalize(), travel);
          bodyOffset.y = Math.max(0, bodyOffset.y);
          mesh.position.set(bodyOffset.x, .95 * mesh.scale.y + bodyOffset.y, bodyOffset.z);
          mesh.updateWorldMatrix(true, false);
          dragTarget.copy(mesh.worldToLocal(worldPoint));
          const delta = dragTarget.clone().sub(dragPoint).clampLength(0, reach());
          const inward = delta.dot(dragNormal);
          if (inward < 0) delta.addScaledVector(dragNormal, -inward);
          dragTarget.copy(dragPoint).add(delta);
        }
      } else if (s.cursor) canvas.style.cursor = interactive() && raycaster.intersectObject(mesh).length ? 'grab' : '';
    }

    function up(e) {
      activePointers.delete(e.pointerId);
      orbit.enabled = s.orbit;
      if (dragging) {
        if (!moved) { bounce = s.tapBounce; emit('tap'); }
        emit('release');
      }
      dragging = false;
      if (s.cursor) canvas.style.cursor = '';
    }

    const contextMenu = (e) => e.preventDefault();
    canvas.addEventListener('pointerdown', down, { capture: true });
    canvas.addEventListener('pointermove', move);
    canvas.addEventListener('pointerup', up);
    canvas.addEventListener('pointercancel', up);
    canvas.addEventListener('contextmenu', contextMenu);

    function resize() {
      const { width, height } = host.getBoundingClientRect();
      if (!width || !height) return;
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, s.pixelRatio));
      renderer.setSize(width, height, false);
      camera.aspect = width / height; camera.fov = s.fov;
      const mobile = s.cameraDistance == null && width < 700;
      const distance = s.cameraDistance ?? (mobile ? Math.max(19, 21 * 390 / width) : 12.3);
      camera.position.set(distance * .44, distance * .32, distance * .8);
      orbit.target.set(0, mobile ? .95 : 1.12, 0); camera.lookAt(orbit.target);
      camera.zoom = 1; camera.updateProjectionMatrix();
      if (mobile) camera.setViewOffset(width, height, 0, height * .10, width, height);
      else camera.clearViewOffset();
    }

    const observer = new ResizeObserver(resize); observer.observe(host); resize();
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function frame(now) {
      if (disposed) return;
      const dt = Math.min((now - previous) / 1000, .035); previous = now;

      const fl = s.flavors[s.flavor] ?? { color: s.flavor, pattern: 'speckle' };
      const tint = col(fl.color), clear = col(s.colors.clear);
      const key = `${fl.color}|${fl.pattern}|${s.colors.clear}|${s.texture}`;
      if (key !== lastKey) {
        const tk = `${fl.color}|${fl.pattern}|${s.colors.clear}`;
        if (s.texture && fl.pattern !== 'none' && !textures.has(tk)) textures.set(tk, createFlavorTexture(fl.pattern, clear.clone().lerp(tint, .12), tint));
        material.map = s.texture && fl.pattern !== 'none' ? textures.get(tk) : null;
        material.needsUpdate = true; lastKey = key;
      }
      if (s.background !== lastBg) { scene.background = s.background ? col(s.background) : null; lastBg = s.background; }
      const eyeKey = s.eyeColor + s.threadColor;
      if (eyeKey !== lastEye) { buttons.buttonMat.color.copy(col(s.eyeColor)); buttons.threadMat.color.copy(col(s.threadColor)); lastEye = eyeKey; }

      material.color.copy(tint).lerp(clear, 1 - s.saturation / 100);
      material.attenuationColor.copy(tint).lerp(clear, .25);
      material.transmission = s.transparency / 100;
      material.attenuationDistance = 2 + s.transparency * .07;
      material.thickness = .1 + s.thickness * .03;
      material.roughness = .01 + s.roughness * .009;
      material.ior = 1 + s.refraction * .01;
      material.envMapIntensity = s.reflections * .035;
      material.clearcoat = s.reflections / 100;
      material.wireframe = s.wireframe;
      light.intensity = .5 + s.lighting * .065;
      light.position.set(...s.lightPosition);
      hemi.intensity = s.ambient;
      renderer.toneMappingExposure = s.exposure;
      ground.material.opacity = s.shadow * .004;
      ground.visible = s.shadow > 0;
      orbit.enableZoom = s.orbitZoom;
      if (!dragging && !activePointers.size) orbit.enabled = s.orbit;

      mesh.scale.set(s.size / 100, s.size * s.height / 10000, s.size / 100);
      mesh.position.set(bodyOffset.x, .95 * mesh.scale.y + bodyOffset.y, bodyOffset.z);
      if (!dragging) mesh.rotation.y = s.rotation * Math.PI / 180 + (s.autoRotate ? elapsed * .2 : 0);

      if (lastZoom !== s.zoom) {
        if (lastZoom > 0) camera.position.sub(orbit.target).multiplyScalar(lastZoom / s.zoom).add(orbit.target);
        lastZoom = s.zoom;
      }

      if (s.impulse !== lastImpulse) { bounce = s.wobble / 100; lastImpulse = s.impulse; }

      if (s.reset !== lastReset) {
        pos.array.set(rest); velocity.fill(0); bounce = 0; dragging = held = false;
        dragTarget.copy(dragPoint); elapsed = 0; bodyOffset.set(0, 0, 0);
        resize(); lastZoom = s.zoom; pos.needsUpdate = true;
        geometry.computeVertexNormals(); lastReset = s.reset; emit('reset');
      }

      if (!s.paused) {
        const step = dt * s.speed / 100;
        elapsed += step;
        const stiffness = 35 + s.firmness * 1.15, friction = 2.3 + s.damping * .11;
        bounce *= Math.exp(-step * 3.3);
        const wobble = reduce ? 0 : Math.sin(elapsed * 2.3) * .035 * s.wobble / 100;
        const impact = Math.sin(elapsed * 14) * bounce;
        const delta = dragTarget.clone().sub(dragPoint);
        const radius = .18 + s.pullRadius * .018;
        const falloff = radius * radius / (1 + delta.length() * .35);
        const active = dragging || held, fn = s.deformer;
        const floor = (-mesh.position.y + .015) / mesh.scale.y;

        for (let i = 0; i < pos.count; i++) {
          const j = i * 3, x = rest[j], y = rest[j + 1], z = rest[j + 2];
          const dx = x - dragPoint.x, dy = y - dragPoint.y, dz = z - dragPoint.z;
          const weight = active ? Math.exp(-(dx * dx + dy * dy + dz * dz) / falloff) : 0;
          const fw = s.gravity ? Math.min(1, Math.max(0, (y + 1.0) / .8)) : 1;
          t[0] = x * (1 + impact * .2) + Math.sin(y * 2 + elapsed * 2) * wobble + delta.x * weight * fw;
          t[1] = y * (1 - impact * .24) + delta.y * weight * fw + (s.gravity ? 0 : Math.sin(elapsed * 1.8) * .12);
          t[2] = z * (1 + impact * .18) + delta.z * weight * fw;
          if (fn) { d[0] = d[1] = d[2] = 0; fn(d, x, y, z, elapsed, i); t[0] += d[0]; t[1] += d[1]; t[2] += d[2]; }
          for (let k = 0; k < 3; k++) {
            const index = j + k, value = pos.array[index];
            const speed = (velocity[index] + (t[k] - value) * stiffness * step) * Math.exp(-friction * step);
            velocity[index] = speed;
            const next = value + speed * step;
            pos.array[index] = k === 1 && s.gravity ? Math.max(floor, next) : next;
            if (k === 1 && s.gravity && next < floor) velocity[index] = Math.max(0, speed);
          }
        }
        pos.needsUpdate = true; geometry.computeVertexNormals(); geometry.computeBoundingSphere();
      }

      const phase = (now / 1000) % 4.3;
      const blink = s.blink && phase > 3.95 ? Math.max(.06, Math.abs((phase - 3.95) / .35 * 2 - 1)) : 1;
      const normals = geometry.getAttribute('normal');
      buttons.eyes.forEach((eye, i) => {
        eye.visible = s.eyes;
        const index = anchors[i];
        eye.position.set(pos.getX(index), pos.getY(index), pos.getZ(index) + .035);
        eye.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), new THREE.Vector3().fromBufferAttribute(normals, index).normalize());
        eye.scale.y = blink;
      });

      emit('frame', { dt, elapsed });
      orbit.update(dt);
      const cameraDistance = camera.position.distanceTo(orbit.target);
      camera.near = Math.max(1e-7, Math.min(.1, cameraDistance * .001));
      camera.far = Math.max(100, cameraDistance * 10); camera.updateProjectionMatrix();
      renderer.render(scene, camera);
      raf = requestAnimationFrame(frame);
    }
    raf = requestAnimationFrame(frame);

    const spot = (v) => Array.isArray(v) ? v : typeof v === 'string' ? (SPOTS[v] ?? SPOTS.center) : [v.x, v.y, v.z];

    this.three = { THREE, scene, camera, renderer, mesh, material, light, hemi, ground, geometry, orbit, eyes: buttons.eyes };
    this.offset = bodyOffset;
    this.spots = SPOTS;

    this.set = (k, v) => {
      const o = typeof k === 'object' ? k : { [k]: v };
      Object.assign(s, o);
      if ('fov' in o || 'cameraDistance' in o || 'pixelRatio' in o) resize();
      return this;
    };
    this.get = (k) => s[k];
    this.enable = (k) => { const v = s[k]; if (typeof v === 'boolean') s[k] = true; else if (typeof v === 'number' && !v) s[k] = stash[k] ?? v; return this; };
    this.disable = (k) => { const v = s[k]; if (typeof v === 'boolean') s[k] = false; else if (typeof v === 'number' && v) { stash[k] = v; s[k] = 0; } return this; };
    this.toggle = (k) => typeof s[k] === 'boolean' ? (s[k] = !s[k], this) : s[k] ? this.disable(k) : this.enable(k);
    this.pause = () => this.set('paused', true);
    this.resume = () => this.set('paused', false);
    this.wobble = (power = s.wobble / 100) => { bounce = power; return this; };
    this.reset = (all = false) => {
      const { reset, impulse } = s;
      if (all) Object.assign(s, JSON.parse(base));
      s.reset = reset + 1; s.impulse = impulse;
      return this;
    };
    this.move = (x = 0, y = 0, z = 0) => { bodyOffset.set(x, Math.max(0, y), z); return this; };
    this.pull = (point, offset = [0, 0, 0]) => {
      dragPoint.set(...spot(point));
      const delta = new THREE.Vector3(...spot(offset)).clampLength(0, reach());
      dragTarget.copy(dragPoint).add(delta); held = true; return this;
    };
    this.release = () => { held = false; dragTarget.copy(dragPoint); return this; };
    this.poke = (point, offset, ms = 160) => { clearTimeout(pokeTimer); this.pull(point, offset); pokeTimer = setTimeout(() => this.release(), ms); return this; };
    this.on = (k, f) => ((ev[k] ??= []).push(f), this);
    this.off = (k, f) => { ev[k] = (ev[k] ?? []).filter(x => x !== f); return this; };

    this.destroy = () => {
      disposed = true; cancelAnimationFrame(raf); clearTimeout(pokeTimer); observer.disconnect();
      canvas.removeEventListener('pointerdown', down, { capture: true });
      canvas.removeEventListener('pointermove', move);
      canvas.removeEventListener('pointerup', up);
      canvas.removeEventListener('pointercancel', up);
      canvas.removeEventListener('contextmenu', contextMenu);
      orbit.dispose(); buttons.dispose(); textures.forEach(tx => tx.dispose());
      geometry.dispose(); material.dispose(); ground.geometry.dispose(); ground.material.dispose();
      environment.dispose(); pmrem.dispose(); renderer.dispose(); canvas.remove();
      delete host.jelly;
    };

    queueMicrotask(() => emit('ready'));
  }

  static auto(root = document) {
    return [...root.querySelectorAll('[data-jelly]')].map(el => {
      if (el.jelly) return el.jelly;
      let opts = {};
      try { opts = JSON.parse(el.dataset.jelly || '{}'); } catch { /* json inválido */ }
      for (const [key, raw] of Object.entries(el.dataset)) {
        if (!key.startsWith('jelly') || key.length < 6) continue;
        let value = raw; try { value = JSON.parse(raw); } catch { /* string simples */ }
        opts[key[5].toLowerCase() + key.slice(6)] = value;
      }
      return new Jelly(el, opts);
    });
  }
}

Jelly.defaults = DEFAULTS;
Jelly.THREE = THREE;
window.Jelly = Jelly;
Jelly.auto();

export default Jelly;
