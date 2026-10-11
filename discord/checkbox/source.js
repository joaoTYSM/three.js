import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js";

const instances = new Map();

function roundedRect(width, height, radius) {
  const shape = new THREE.Shape();
  const r = Math.min(radius, width / 2, height / 2);

  shape.moveTo(r, 0);
  shape.lineTo(width - r, 0);
  shape.quadraticCurveTo(width, 0, width, r);
  shape.lineTo(width, height - r);
  shape.quadraticCurveTo(width, height, width - r, height);
  shape.lineTo(r, height);
  shape.quadraticCurveTo(0, height, 0, height - r);
  shape.lineTo(0, r);
  shape.quadraticCurveTo(0, 0, r, 0);

  return new THREE.ShapeGeometry(shape);
}

function createCheckbox(element) {
  if (instances.has(element)) return;

  const style = getComputedStyle(element);
  const knobElement = element.querySelector(".knob");
  if (!knobElement) return;

  const knobStyle = getComputedStyle(knobElement);
  const lineElement1 = knobElement.querySelector(".line1");
  const lineElement2 = knobElement.querySelector(".line2");

  if (!lineElement1 || !lineElement2) return;

  const lineStyle = getComputedStyle(lineElement1);
  const rect = element.getBoundingClientRect();

  const data = {
    element,
    width: rect.width,
    height: rect.height,
    radius: parseFloat(style.borderRadius) || 0,
    knobWidth: parseFloat(knobStyle.width) || 18,
    knobHeight: parseFloat(knobStyle.height) || 18,
    knobTop: parseFloat(knobStyle.top) || 3,
    knobLeft: parseFloat(knobStyle.left) || 3,
    lineWidth: parseFloat(lineStyle.width) || 12,
    lineHeight: parseFloat(lineStyle.height) || 2,
    background: style.backgroundColor,
    checkedColor: "#43b581",
    knobColor: knobStyle.backgroundColor || "#ffffff",
    lineColor: lineStyle.backgroundColor || "#72767d",
    progress: element.classList.contains("checked") ? 1 : 0,
    target: element.classList.contains("checked") ? 1 : 0,
    lastTime: performance.now()
  };

  const renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true
  });

  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setSize(data.width, data.height);
  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  Object.assign(renderer.domElement.style, {
    position: "absolute",
    inset: "0",
    width: "100%",
    height: "100%",
    display: "block",
    pointerEvents: "none"
  });

  const scene = new THREE.Scene();

  const camera = new THREE.OrthographicCamera(
    0, data.width, 0, data.height, 0.1, 100
  );

  camera.position.z = 10;

  function mesh(geometry, color, z) {
    const material = new THREE.MeshBasicMaterial({
      color,
      transparent: true,
      depthTest: false
    });

    const object = new THREE.Mesh(geometry, material);
    object.position.z = z;
    scene.add(object);

    return object;
  }

  function setGeometry(object, geometry) {
    object.geometry.dispose();
    object.geometry = geometry;
  }

  function position(object, x, y) {
    object.position.set(x, data.height - y, object.position.z);
  }

  const track = mesh(
    roundedRect(data.width, data.height, data.radius),
    data.background,
    0
  );

  const knob = mesh(
    roundedRect(data.knobWidth, data.knobHeight, data.knobHeight / 2),
    data.knobColor,
    1
  );

  const line1 = mesh(
    new THREE.PlaneGeometry(data.lineWidth, data.lineHeight),
    data.lineColor,
    2
  );

  const line2 = mesh(
    new THREE.PlaneGeometry(data.lineWidth, data.lineHeight),
    data.lineColor,
    2
  );

  element.style.position =
    style.position === "static" ? "relative" : style.position;

  element.style.background = "transparent";
  element.style.overflow = "hidden";

  knobElement.style.visibility = "hidden";
  lineElement1.style.visibility = "hidden";
  lineElement2.style.visibility = "hidden";

  element.appendChild(renderer.domElement);

  function resize() {
    const rect = element.getBoundingClientRect();
    if (!rect.width || !rect.height) return;

    data.width = rect.width;
    data.height = rect.height;

    renderer.setSize(data.width, data.height);

    camera.left = 0;
    camera.right = data.width;
    camera.top = data.height;
    camera.bottom = 0;
    camera.updateProjectionMatrix();

    setGeometry(
      track,
      roundedRect(data.width, data.height, data.radius)
    );

    position(track, 0, 0);
  }

  const observer = new MutationObserver(() => {
    data.target = element.classList.contains("checked") ? 1 : 0;
  });

  observer.observe(element, {
    attributes: true,
    attributeFilter: ["class"]
  });

  element.addEventListener("click", () => {
    data.target = element.classList.contains("checked") ? 1 : 0;
  });

  instances.set(element, {
    ...data,
    renderer,
    scene,
    camera,
    track,
    knob,
    line1,
    line2,
    observer,
    resize
  });
}

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function smoothstep(a, b, x) {
  const t = THREE.MathUtils.clamp((x - a) / (b - a), 0, 1);
  return t * t * (3 - 2 * t);
}

function update(data, time) {
  const dt = Math.min((time - data.lastTime) / 1000, 0.05);
  data.lastTime = time;

  const difference = data.target - data.progress;
  data.progress += difference * Math.min(dt * 12, 1);

  if (Math.abs(data.target - data.progress) < 0.001) {
    data.progress = data.target;
  }

  const p = data.progress;
  const w = data.width;
  const h = data.height;

  const startX = data.knobLeft;
  const endX = w - data.knobWidth - data.knobLeft;
  const centerX = lerp(startX, endX, p);
  const centerY = data.knobTop + data.knobHeight / 2;

  const stretch = Math.sin(p * Math.PI);
  const knobWidth = data.knobWidth + stretch * 4;
  const knobHeight = data.knobHeight - stretch;

  setGeometry(
    data.knob,
    roundedRect(knobWidth, knobHeight, knobHeight / 2)
  );

  position(
    data.knob,
    centerX + (data.knobWidth - knobWidth) / 2,
    data.knobTop + (data.knobHeight - knobHeight) / 2
  );

  const toDash = smoothstep(0, 0.5, p);
  const toCheck = smoothstep(0.5, 1, p);

  const xAngle1 = Math.PI / 4;
  const xAngle2 = -Math.PI / 4;
  const checkAngle1 = -Math.PI / 4;
  const checkAngle2 = Math.PI / 4;

  const width1 = lerp(
    data.lineWidth * 0.8,
    data.lineWidth * 0.38,
    toCheck
  );

  const width2 = lerp(
    data.lineWidth * 0.8,
    data.lineWidth * 0.85,
    toCheck
  );

  const dashWidth1 = lerp(width1, data.lineWidth * 0.75, toDash);
  const dashWidth2 = lerp(width2, 0, toDash);

  const finalWidth1 = lerp(dashWidth1, data.lineWidth * 0.38, toCheck);
  const finalWidth2 = lerp(dashWidth2, data.lineWidth * 0.85, toCheck);

  setGeometry(
    data.line1,
    new THREE.PlaneGeometry(Math.max(finalWidth1, 0.01), data.lineHeight)
  );

  setGeometry(
    data.line2,
    new THREE.PlaneGeometry(Math.max(finalWidth2, 0.01), data.lineHeight)
  );

  data.line1.rotation.z = lerp(xAngle1, 0, toDash);
  data.line1.rotation.z = lerp(
    data.line1.rotation.z,
    checkAngle1,
    toCheck
  );

  data.line2.rotation.z = lerp(xAngle2, 0, toDash);
  data.line2.rotation.z = lerp(
    data.line2.rotation.z,
    checkAngle2,
    toCheck
  );

  const checkOffset = toCheck * data.lineWidth * 0.16;

  position(
    data.line1,
    centerX + data.knobWidth / 2 - checkOffset,
    centerY + toCheck * data.lineHeight
  );

  position(
    data.line2,
    centerX + data.knobWidth / 2 + checkOffset,
    centerY - toCheck * data.lineHeight
  );

  const color = new THREE.Color(
    p > 0.5 ? data.checkedColor : data.lineColor
  );

  data.line1.material.color.copy(color);
  data.line2.material.color.copy(color);
  data.line2.material.opacity = 1 - toDash;

  data.track.material.color.set(
    p > 0.5 ? data.checkedColor : data.background
  );

  data.renderer.render(data.scene, data.camera);
}

function scan() {
  document.querySelectorAll(".checkbox").forEach(createCheckbox);
}

const resizeObserver = new ResizeObserver(() => {
  for (const data of instances.values()) {
    data.resize();
  }
});

function animate(time) {
  scan();

  for (const [element, data] of instances) {
    if (!element.isConnected) {
      data.observer.disconnect();
      data.renderer.dispose();
      data.renderer.domElement.remove();
      instances.delete(element);
      continue;
    }

    if (!resizeObserver) continue;

    resizeObserver.observe(element);
    update(data, time);
  }

  requestAnimationFrame(animate);
}

scan();
animate(performance.now());
