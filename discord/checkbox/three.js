<script type="importmap">
{
  "imports": {
    "three": "https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js"
  }
}
</script>

<script type="module">
import * as THREE from "three";

const checkboxes = new Map();

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
  if (checkboxes.has(element)) return;

  const style = getComputedStyle(element);
  const knobElement = element.querySelector(".knob");
  const knobStyle = knobElement
    ? getComputedStyle(knobElement)
    : null;

  const line1Style = element.querySelector(".line1")
    ? getComputedStyle(element.querySelector(".line1"))
    : null;

  const line2Style = element.querySelector(".line2")
    ? getComputedStyle(element.querySelector(".line2"))
    : null;

  const data = {
    element,
    width: parseFloat(style.width),
    height: parseFloat(style.height),
    radius: parseFloat(style.borderRadius) || 0,
    background: style.backgroundColor,
    knobColor: knobStyle?.backgroundColor || "#fff",
    lineColor: line1Style?.backgroundColor || "#72767d",
    checkedColor: "#43b581",
    knobWidth: parseFloat(knobStyle?.width || "18"),
    knobHeight: parseFloat(knobStyle?.height || "18"),
    knobTop: parseFloat(knobStyle?.top || "3"),
    knobLeft: parseFloat(knobStyle?.left || "3"),
    lineWidth: parseFloat(line1Style?.width || "12"),
    lineHeight: parseFloat(line1Style?.height || "2"),
    checked: element.classList.contains("checked"),
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

  renderer.domElement.style.cssText = `
    position:absolute;
    inset:0;
    width:100%;
    height:100%;
    display:block;
    pointer-events:none;
  `;

  const scene = new THREE.Scene();

  const camera = new THREE.OrthographicCamera(
    0, data.width, 0, data.height, 0.1, 100
  );

  camera.position.set(0, 0, 10);
  camera.lookAt(0, 0, 0);

  function makeMesh(geometry, color, z = 0) {
    const mesh = new THREE.Mesh(
      geometry,
      new THREE.MeshBasicMaterial({
        color,
        transparent: true,
        depthTest: false
      })
    );

    mesh.position.z = z;
    scene.add(mesh);

    return mesh;
  }

  function replaceGeometry(mesh, geometry) {
    mesh.geometry.dispose();
    mesh.geometry = geometry;
  }

  const track = makeMesh(
    roundedRect(data.width, data.height, data.radius),
    data.background,
    0
  );

  const knob = makeMesh(
    roundedRect(data.knobWidth, data.knobHeight, data.knobHeight / 2),
    data.knobColor,
    1
  );

  const line1 = makeMesh(
    new THREE.PlaneGeometry(data.lineWidth, data.lineHeight),
    data.lineColor,
    2
  );

  const line2 = makeMesh(
    new THREE.PlaneGeometry(data.lineWidth, data.lineHeight),
    data.lineColor,
    2
  );

  function positionMesh(mesh, x, y) {
    mesh.position.set(x, data.height - y, mesh.position.z);
  }

  function resize() {
    const rect = element.getBoundingClientRect();
    const currentStyle = getComputedStyle(element);

    data.width = rect.width;
    data.height = rect.height;
    data.radius = parseFloat(currentStyle.borderRadius) || 0;

    if (!data.width || !data.height) return;

    renderer.setSize(data.width, data.height);

    camera.left = 0;
    camera.right = data.width;
    camera.top = data.height;
    camera.bottom = 0;
    camera.updateProjectionMatrix();

    replaceGeometry(
      track,
      roundedRect(data.width, data.height, data.radius)
    );

    positionMesh(track, 0, 0);
  }

  const originalBackground = element.style.background;
  const originalPosition = element.style.position;

  element.style.position =
    style.position === "static" ? "relative" : style.position;

  element.style.background = "transparent";
  element.appendChild(renderer.domElement);

  element.querySelectorAll(".knob").forEach(knob => {
    knob.style.visibility = "hidden";
  });

  const observer = new MutationObserver(() => {
    const checked = element.classList.contains("checked");
    const unchecked = element.classList.contains("unchecked");

    if (checked) data.target = 1;
    else if (unchecked) data.target = 0;
    else data.target = 0;

    if (data.target) {
      track.material.color.set(data.checkedColor);
    } else {
      track.material.color.set(data.background);
    }
  });

  observer.observe(element, {
    attributes: true,
    attributeFilter: ["class", "style"]
  });

  data.resize = resize;
  data.renderer = renderer;
  data.scene = scene;
  data.camera = camera;
  data.track = track;
  data.knob = knob;
  data.line1 = line1;
  data.line2 = line2;
  data.observer = observer;
  data.originalBackground = originalBackground;
  data.originalPosition = originalPosition;

  checkboxes.set(element, data);

  element.addEventListener("click", () => {
    data.target = element.classList.contains("checked") ? 1 : 0;
  });

  resize();
}

function updateCheckbox(data, time) {
  const dt = Math.min((time - data.lastTime) / 1000, 0.05);
  data.lastTime = time;

  const speed = 0.3;
  const difference = data.target - data.progress;

  if (Math.abs(difference) > 0.001) {
    data.progress += difference * Math.min(dt / speed * 1.8, 1);
  } else {
    data.progress = data.target;
  }

  const p = data.progress;
  const w = data.width;
  const h = data.height;
  const startX = data.knobLeft;
  const endX = w - data.knobWidth - data.knobLeft;

  const stretch = Math.sin(p * Math.PI);
  const knobWidth = data.knobWidth + stretch * 6;
  const knobHeight = data.knobHeight - stretch * 2;
  const x = startX + (endX - startX) * p;

  replaceGeometry(
    data.knob,
    roundedRect(knobWidth, knobHeight, knobHeight / 2)
  );

  positionMesh(
    data.knob,
    x + (data.knobWidth - knobWidth) / 2,
    data.knobTop + (data.knobHeight - knobHeight) / 2
  );

  const lineLength = data.lineWidth;
  const lineHeight = data.lineHeight;

  const line1Width = THREE.MathUtils.lerp(lineLength, 6, p);
  const line2Width = THREE.MathUtils.lerp(lineLength, 10, p);

  const middleWidth = THREE.MathUtils.lerp(lineLength, 8, p);
  const collapse = Math.max(0, 1 - Math.abs(p - 0.5) / 0.25);

  const aWidth = THREE.MathUtils.lerp(line1Width, middleWidth, collapse);
  const bWidth = THREE.MathUtils.lerp(line2Width, middleWidth, collapse);

  line1.scale.x = aWidth / lineLength;
  line2.scale.x = bWidth / lineLength;

  positionMesh(
    data.line1,
    x + data.knobWidth / 2,
    data.knobTop + data.knobHeight / 2
  );

  positionMesh(
    data.line2,
    x + data.knobWidth / 2,
    data.knobTop + data.knobHeight / 2
  );

  const angle1 = THREE.MathUtils.lerp(Math.PI / 4, Math.PI / 4, p);
  const angle2 = THREE.MathUtils.lerp(-Math.PI / 4, -Math.PI / 4, p);

  data.line1.rotation.z = angle1;
  data.line2.rotation.z = angle2;

  const color = new THREE.Color(
    data.target ? data.checkedColor : data.lineColor
  );

  data.line1.material.color.copy(color);
  data.line2.material.color.copy(color);

  data.renderer.render(data.scene, data.camera);
}

function scan() {
  document.querySelectorAll(".checkbox").forEach(createCheckbox);
}

const resizeObserver = new ResizeObserver(() => {
  for (const data of checkboxes.values()) {
    data.resize();
  }
});

function observeElements() {
  for (const element of document.querySelectorAll(".checkbox")) {
    resizeObserver.observe(element);
  }
}

function animate(time) {
  scan();
  observeElements();

  for (const data of checkboxes.values()) {
    updateCheckbox(data, time);
  }

  requestAnimationFrame(animate);
}

scan();
animate(performance.now());

</script>
