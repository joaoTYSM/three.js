/* v2.1
 ──────────────────────────────────────────────────────────────────────────
        ██╗███████╗██╗     ██╗  ██╗   ██╗
        ██║██╔════╝██║     ██║  ╚██╗ ██╔╝
        ██║█████╗  ██║     ██║   ╚████╔╝
   ██   ██║██╔══╝  ██║     ██║    ╚██╔╝
   ╚█████╔╝███████╗███████╗███████╗██║          Discord: https://discord.gg/AUddtuAGUf (Guaranteed role on the server: "tree.js")
    ╚════╝ ╚══════╝╚══════╝╚══════╝╚═╝          By joao repo: joaoTYSM/tree.js/jelly.js
                                                                                                                                        
                                                                                                                                        
                                                                                                                                        
                                                                                                                                        
                                                                                                                                        
                                                                                                                                        
                                                                                                                                        
                                                                                                                                        
                                                                                                                                        
                                                                                                                                        
                                                                                                                                        
                                                                                                                                        
                                                                                                                                        
                                                                                                                                        
                                                                                                                                        
                                                   :::::.....::.::::::--..-:.........                                                   
                                               ....:.. ...:                  ....  ::....                                               
                                           -:::: ....-:                         ..      :..:                                            
                                         ..:.: : ....                               ....::.....                                         
                                      ...::           ....                             --  ::-..:-                                      
                                      ..:.....        ....-:                               ..:.....                                     
                                     .: :.:......::..-                             ::..:.....    ...                                    
                                    .. ....     .........:==-:. -  : -:-.. -:..:::......          ..                                    
                                    .. ....     :-       ......................   ::::          . ..                                    
                                    :: ..:          -:+                                ..   .::-. .:                                    
                                   :. ::.    ...:                             -  =     --   :  -   ..                                   
                                   .. .   ...:  ..     .....:--               =+--       .....    ...                                   
                                  ::.......:    ..     ...  :..:..      ...:...-        ... ....... ..                                  
                                  .:            ..  -- .:       ..     ...    ..:-     ..           ..                                  
                                 :.::--          ..   ..:       ..    -.       ..      ..    :..:-- ...                                 
                                 ..   :           :....          .:..-.         ...:    ..   ...  -  ..                                 
                                 .    - :                                        :-::  ..:   ... :-  ..                                 
                                ::    : .                                           ....     ....:--  .:                                
                                .:    :....         :......                 ......            ...: -- ..                                
                               ..     -...        ::.     ...             ..     ..           .... -=: ..                               
                               .:    -....       ..   .... =..           -. ..... ..-              -=-                                  
                               .: -  -....       ..   :... =..           -.   ... ..:           :    - .:                               
                              ..  :  -:.         ..     .  =..           -.    .  ..-           :   .:  .:                              
                              ..     ==          ..  ...   -..           -.- ..   ..-           :    :  ...                             
                             ..   .  -.      .. ...:.....::.              ::.....::   ....      =   --   ..:                            
                            ..  .:  :-.      .....  ......                  .....    .....      :   :::  :..                            
                            ...:.:  .:...:                                                    =...  .:-  ...                            
                           :..:...  . ...=-                                                    ....  -.: . .:                           
                            ...:.   ....: :                                                :   .....     ...                            
                             ...:   :...: :     :.  :: :                         .. --     ..   ...     :.:                             
                               ....:  :.  .     ..:::  .:::  ....   -         -: :  ::   .--:   ..   =.:.                               
                                  ....+       :::-      -::  :::-  =:::   --  -:        ..   :..  ....                                  
                                    ...........        :::                 :  :.   :............:..:                                    
                                             ..........  :-==::::- -:::          ....   ........:                                       
                                                      ...........................:                                                      
                                                                                                                                        
                                                                                                                                        
                                                                                                                                        
                                                                                                                                        
                                                                                                                                        
                                                                                                                                        
                                                                                                                                        
                                                                                                                                        
                                                                                                                                                                       
 ──────────────────────────────────────────────────────────────────────────
*/
/*!
 * ┌──────────────────────────────────────────────────────────────────────────┐
 * │                                                                          │
 * │   J E L L Y  .  J S                                                     │
 * │   soft-body deformation · spring physics · surface anchoring             │
 * │                                                                          │
 * │   v1.0.0 · three.js r150+ · MIT                                          │
 * │                                                                          │
 * ├──────────────────────────────────────────────────────────────────────────┤
 * │                                                                          │
 * │   A self-contained wobbly jelly for any three.js scene.                  │
 * │   No scene, no lights, no renderer, no background — just the mesh        │
 * │   and its physics. Drop it next to a bubble, a logo, a product shot.     │
 * │                                                                          │
 * │   QUICK START                                                            │
 * │                                                                          │
 * │     import { Jelly } from './jelly.js';                                  │
 * │                                                                          │
 * │     const jelly = new Jelly({                                            │
 * │       camera,                          // optional, enables interaction   │
 * │       domElement: renderer.domElement, // optional, enables interaction  │
 * │       preset: 'petStar',                                                 │
 * │       color: 0xe00072,                                                   │
 * │     });                                                                  │
 * │                                                                          │
 * │     scene.add(jelly.mesh);                                               │
 * │                                                                          │
 * │     // inside your render loop                                           │
 * │     jelly.update(delta);                                                 │
 * │                                                                          │
 * ├──────────────────────────────────────────────────────────────────────────┤
 * │                                                                          │
 * │   PRESETS                                                                │
 * │     cube · box · sphere · ball · circle · star · heart · capsule ·       │
 * │     pill · torus · donut · blob                                          │
 * │     pet · petCube · petBox · petSphere · petBall · petCircle ·           │
 * │     petStar · petHeart · petBlob · petCapsule      (presets with eyes)   │
 * │                                                                          │
 * │   OPTIONS   — every field is live-editable through jelly.set({ ... })    │
 * │                                                                          │
 * │     preset            string    geometry preset (see above)              │
 * │     geometry          BufferGeometry   custom geometry, overrides preset │
 * │     segments          number    tessellation of the built-in presets     │
 * │     size              number    uniform scale                            │
 * │     height            number    vertical scale multiplier                │
 * │     rotation          number    yaw in degrees                           │
 * │     autoRotate        boolean   slow idle spin                           │
 * │     autoRotateSpeed   number    degrees per second                       │
 * │                                                                          │
 * │     firmness          0..100    spring stiffness                         │
 * │     damping           0..100    internal friction                        │
 * │     wobble            0..100    idle wobble amplitude                    │
 * │     speed             10..150   simulation speed                         │
 * │     gravity           boolean   sag and rest on the floor                │
 * │     floor             number    world Y the jelly rests on               │
 * │     release           number    bounce given by a plain click            │
 * │     paused            boolean   freeze the simulation                    │
 * │                                                                          │
 * │     interactive       boolean   master switch for pointer input          │
 * │     interaction       'pull' | 'move' | 'camera' | 'none'               │
 * │     pullRadius        0..100    radius of the grab falloff               │
 * │     stretch           0..100    how far a grabbed vertex may travel      │
 * │                                                                          │
 * │     color             hex|int   jelly tint                               │
 * │     clearColor        hex|int   colour the tint fades into               │
 * │     saturation        0..100    colour intensity                         │
 * │     transmission      0..1      see-through amount                       │
 * │     roughness         0..1      surface micro-detail                     │
 * │     thickness         0..10     optical thickness                        │
 * │     ior               1..2.5    index of refraction                      │
 * │     attenuationDistance number  how far light travels inside             │
 * │     reflections       0..100    gloss, clearcoat and env intensity       │
 * │     texture           boolean   procedural speckle map                   │
 * │     wireframe         boolean   render as wire mesh                      │
 * │                                                                          │
 * │     eyes              boolean   button eyes snapped to the surface       │
 * │     eyeColor          hex|int   button colour                            │
 * │     eyeThread         hex|int   thread colour                            │
 * │     eyeSpacing        number    distance between eyes (auto if null)     │
 * │     blink             boolean   idle blinking                            │
 * │                                                                          │
 * ├──────────────────────────────────────────────────────────────────────────┤
 * │                                                                          │
 * │   API                                                                    │
 * │     jelly.mesh                 THREE.Mesh — add it to your scene         │
 * │     jelly.material             THREE.MeshPhysicalMaterial                │
 * │     jelly.basePosition         THREE.Vector3 — resting position          │
 * │     jelly.update(dt)           step the physics, call every frame        │
 * │     jelly.set({ ... })         change any option at runtime              │
 * │     jelly.get(key)             read one option                           │
 * │     jelly.setPreset(name)      rebuild the geometry                      │
 * │     jelly.sculpt(fn)           deform the rest shape with your own fn    │
 * │     jelly.attach(obj, opts)    glue any Object3D to the surface          │
 * │     jelly.detachAll()          release every attachment                  │
 * │     jelly.impulse(strength)    give it a wobble                          │
 * │     jelly.wobble(strength)     alias of impulse                          │
 * │     jelly.reset()              back to rest                              │
 * │     jelly.pause() / resume()   freeze / unfreeze                         │
 * │     jelly.bind(dom, camera)    enable pointer interaction                │
 * │     jelly.unbind()             disable pointer interaction               │
 * │     jelly.dispose()            free every GPU resource                   │
 * │                                                                          │
 * └──────────────────────────────────────────────────────────────────────────┘
 */

import * as THREE from 'three';
import { mergeVertices } from 'three/addons/utils/BufferGeometryUtils.js';

/* -------------------------------------------------------------------------- */
/*  scratch                                                                   */
/* -------------------------------------------------------------------------- */

const _point = new THREE.Vector3();
const _inner = new THREE.Vector3();
const _normal = new THREE.Vector3();
const _world = new THREE.Vector3();
const _delta = new THREE.Vector3();
const _tint = new THREE.Color();
const _clear = new THREE.Color();
const _forward = new THREE.Vector3(0, 0, 1);
const _up = new THREE.Vector3(0, 1, 0);
const _quat = new THREE.Quaternion();
const _clockNow = () => (typeof performance !== 'undefined' ? performance.now() : Date.now());

/* -------------------------------------------------------------------------- */
/*  geometry builders                                                         */
/* -------------------------------------------------------------------------- */

function roundedBox({ width = 2.8, height = 2.35, depth = 2.5, radius = 0.4, segments = 24, ripple = 0.055, squash = 0.8 } = {}) {
  const geometry = new THREE.BoxGeometry(width, height, depth, segments, segments, segments);
  const position = geometry.getAttribute('position');
  const core = new THREE.Vector3(width / 2 - radius, height / 2 - radius, depth / 2 - radius);
  const limit = core.clone().negate();
  for (let i = 0; i < position.count; i += 1) {
    _point.fromBufferAttribute(position, i);
    _inner.copy(_point).clamp(limit, core);
    _normal.copy(_point).sub(_inner).normalize();
    _point.copy(_inner).addScaledVector(_normal, radius);
    if (ripple) {
      const bump = ripple * Math.sin(_point.x * 3.8 + _point.z * 2.2) * Math.cos(_point.y * 3);
      _point.addScaledVector(_normal, bump);
    }
    position.setXYZ(i, _point.x, _point.y * squash, _point.z);
  }
  geometry.deleteAttribute('normal');
  geometry.deleteAttribute('uv');
  return geometry;
}

function ball({ radius = 1.25, segments = 44 } = {}) {
  return new THREE.SphereGeometry(radius, segments, Math.round(segments * 0.62));
}

function star({ outer = 1.4, inner = 0.62, points = 5, depth = 0.7, bevel = 0.12, bevelSegments = 3 } = {}) {
  const shape = new THREE.Shape();
  const total = points * 2;
  for (let i = 0; i < total; i += 1) {
    const r = i % 2 === 0 ? outer : inner;
    const a = (i / total) * Math.PI * 2 - Math.PI / 2;
    const x = Math.cos(a) * r;
    const y = Math.sin(a) * r;
    if (i === 0) shape.moveTo(x, y);
    else shape.lineTo(x, y);
  }
  shape.closePath();
  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth, bevelEnabled: true, bevelThickness: bevel, bevelSize: bevel, bevelSegments, curveSegments: 6, steps: 1,
  });
  geometry.center();
  return geometry;
}

function heart({ scale = 0.62, depth = 0.8, bevel = 0.12 } = {}) {
  const shape = new THREE.Shape();
  const x = 0;
  const y = 0;
  shape.moveTo(x + 0.5, y + 0.5);
  shape.bezierCurveTo(x + 0.5, y + 0.5, x + 0.4, y, x, y);
  shape.bezierCurveTo(x - 0.6, y, x - 0.6, y + 0.7, x - 0.6, y + 0.7);
  shape.bezierCurveTo(x - 0.6, y + 1.1, x - 0.3, y + 1.54, x + 0.5, y + 1.9);
  shape.bezierCurveTo(x + 1.2, y + 1.54, x + 1.6, y + 1.1, x + 1.6, y + 0.7);
  shape.bezierCurveTo(x + 1.6, y + 0.7, x + 1.6, y, x + 1.0, y);
  shape.bezierCurveTo(x + 0.7, y, x + 0.5, y + 0.5, x + 0.5, y + 0.5);
  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth, bevelEnabled: true, bevelThickness: bevel, bevelSize: bevel, bevelSegments: 3, curveSegments: 12, steps: 1,
  });
  geometry.center();
  geometry.scale(scale, scale, scale);
  return geometry;
}

function capsule({ radius = 0.85, length = 1.0, segments = 24 } = {}) {
  return new THREE.CapsuleGeometry(radius, length, Math.round(segments * 0.5), segments);
}

function torus({ radius = 0.9, tube = 0.42, segments = 44 } = {}) {
  return new THREE.TorusGeometry(radius, tube, Math.round(segments * 0.5), segments);
}

function blob({ radius = 1.2, segments = 44, noise = 0.14, seed = 1.7 } = {}) {
  const geometry = new THREE.SphereGeometry(radius, segments, Math.round(segments * 0.62));
  const position = geometry.getAttribute('position');
  for (let i = 0; i < position.count; i += 1) {
    _point.fromBufferAttribute(position, i);
    const n = Math.sin(_point.x * 2.1 + seed) * Math.cos(_point.y * 2.7 - seed) * Math.sin(_point.z * 1.9 + seed);
    _point.multiplyScalar(1 + n * noise);
    position.setXYZ(i, _point.x, _point.y, _point.z);
  }
  return geometry;
}

const PRESETS = {
  cube: { build: roundedBox },
  box: { build: roundedBox },
  sphere: { build: ball },
  ball: { build: ball },
  circle: { build: ball },
  star: { build: star },
  heart: { build: heart },
  capsule: { build: capsule },
  pill: { build: capsule },
  torus: { build: torus },
  donut: { build: torus },
  blob: { build: blob },

  pet: { build: roundedBox, eyes: true },
  petCube: { build: roundedBox, eyes: true },
  petBox: { build: roundedBox, eyes: true },
  petSphere: { build: ball, eyes: true },
  petBall: { build: ball, eyes: true },
  petCircle: { build: ball, eyes: true },
  petStar: { build: star, eyes: true },
  petHeart: { build: heart, eyes: true },
  petBlob: { build: blob, eyes: true },
  petCapsule: { build: capsule, eyes: true },
};

/* -------------------------------------------------------------------------- */
/*  geometry helpers                                                          */
/* -------------------------------------------------------------------------- */

function projectUVs(geometry) {
  const position = geometry.getAttribute('position');
  const normal = geometry.getAttribute('normal');
  const uv = new Float32Array(position.count * 2);
  for (let i = 0; i < position.count; i += 1) {
    const nx = Math.abs(normal.getX(i));
    const ny = Math.abs(normal.getY(i));
    const nz = Math.abs(normal.getZ(i));
    uv[i * 2] = nx > nz && nx > ny ? (position.getZ(i) + 1.25) / 2.5 : (position.getX(i) + 1.4) / 2.8;
    uv[i * 2 + 1] = ny > nx && ny > nz ? (position.getZ(i) + 1.25) / 2.5 : (position.getY(i) + 1) / 2;
  }
  geometry.setAttribute('uv', new THREE.BufferAttribute(uv, 2));
}

function prepareGeometry(geometry, uv = true) {
  let g = geometry;
  g.deleteAttribute('normal');
  g.deleteAttribute('uv');
  g.deleteAttribute('uv1');
  g.deleteAttribute('uv2');
  g.deleteAttribute('color');
  const merged = mergeVertices(g, 1e-4);
  if (merged !== g) g.dispose();
  g = merged;
  g.computeVertexNormals();
  if (uv) projectUVs(g);
  g.computeBoundingBox();
  g.computeBoundingSphere();
  return g;
}

function speckleTexture({ size = 256, color = 0xffffff, alpha = 0.22, density = 420, radius = 1.7 } = {}) {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.clearRect(0, 0, size, size);
    ctx.globalAlpha = alpha;
    ctx.fillStyle = new THREE.Color(color).getStyle();
    for (let i = 0; i < density; i += 1) {
      const x = (i * 137.508) % size;
      const y = (i * 73.317 + Math.sin(i) * 40 + size) % size;
      ctx.beginPath();
      ctx.ellipse(x, y, radius, radius * 2, i * 0.6, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
}

function createButtonEye(color, threadColor) {
  const shape = new THREE.Shape();
  shape.absarc(0, 0, 0.225, 0, Math.PI * 2, false);
  for (const x of [-0.065, 0.065]) {
    for (const y of [-0.065, 0.065]) {
      const hole = new THREE.Path();
      hole.absarc(x, y, 0.034, 0, Math.PI * 2, true);
      shape.holes.push(hole);
    }
  }
  const disk = new THREE.ExtrudeGeometry(shape, {
    depth: 0.055, bevelEnabled: true, bevelSize: 0.014, bevelThickness: 0.012,
    bevelSegments: 2, steps: 1, curveSegments: 24,
  });
  const rim = new THREE.TorusGeometry(0.196, 0.012, 6, 32);
  const thread = new THREE.CylinderGeometry(0.009, 0.009, 0.185, 6);
  const buttonMaterial = new THREE.MeshStandardMaterial({ color, roughness: 0.27, metalness: 0.1 });
  const threadMaterial = new THREE.MeshStandardMaterial({ color: threadColor, roughness: 0.85 });

  const group = new THREE.Group();
  group.add(new THREE.Mesh(disk, buttonMaterial));
  const border = new THREE.Mesh(rim, buttonMaterial);
  border.position.z = 0.067;
  group.add(border);
  for (const angle of [-Math.PI / 4, Math.PI / 4]) {
    const stitch = new THREE.Mesh(thread, threadMaterial);
    stitch.rotation.z = angle;
    stitch.position.z = 0.078;
    group.add(stitch);
  }
  group.userData.dispose = () => {
    disk.dispose();
    rim.dispose();
    thread.dispose();
    buttonMaterial.dispose();
    threadMaterial.dispose();
  };
  return group;
}

/* -------------------------------------------------------------------------- */
/*  defaults                                                                  */
/* -------------------------------------------------------------------------- */

const DEFAULTS = {
  preset: 'cube',
  geometry: null,
  segments: 24,

  size: 1,
  height: 1,
  rotation: 0,
  autoRotate: false,
  autoRotateSpeed: 12,

  firmness: 38,
  damping: 28,
  wobble: 70,
  speed: 100,
  gravity: true,
  floor: 0,
  release: 0.65,
  paused: false,

  interactive: true,
  interaction: 'pull',
  pullRadius: 22,
  stretch: 65,

  color: 0xe00072,
  clearColor: 0xffffff,
  saturation: 100,
  transmission: 1,
  roughness: 0.065,
  thickness: 2.3,
  ior: 1.42,
  attenuationDistance: 1.8,
  reflections: 48,
  texture: false,
  textureColor: 0xffffff,
  wireframe: false,

  eyes: false,
  eyeColor: 0x453a33,
  eyeThread: 0xf2e6cf,
  eyeSpacing: null,
  blink: true,
};

const REDUCED_MOTION = typeof window !== 'undefined'
  && typeof window.matchMedia === 'function'
  && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* -------------------------------------------------------------------------- */
/*  Jelly                                                                     */
/* -------------------------------------------------------------------------- */

export class Jelly {
  static PRESETS = Object.keys(PRESETS);

  static DEFAULTS = DEFAULTS;

  constructor(options = {}) {
    const { camera = null, domElement = null, position = null, ...rest } = options;

    this.options = { ...DEFAULTS, ...rest };
    if (PRESETS[this.options.preset]?.eyes) this.options.eyes = true;

    this.mesh = null;
    this.material = null;
    this.basePosition = new THREE.Vector3();
    this.disposed = false;

    this._camera = camera;
    this._dom = null;
    this._geometry = null;
    this._rest = null;
    this._velocity = null;
    this._attachments = [];
    this._eyes = [];
    this._texture = null;
    this._raycaster = new THREE.Raycaster();
    this._pointer = new THREE.Vector2();
    this._bounce = 0;
    this._elapsed = 0;
    this._last = 0;
    this._minY = -1;
    this._spanY = 2;
    this._halfHeight = 1;
    this._explicitPosition = !!position;
    this._handlers = null;

    if (position) this.basePosition.copy(toVector3(position, new THREE.Vector3()));

    this.material = this._createMaterial();
    this.mesh = new THREE.Mesh(new THREE.BufferGeometry(), this.material);
    this.mesh.castShadow = true;
    this.mesh.receiveShadow = true;
    this.mesh.frustumCulled = false;
    this.mesh.userData.jelly = this;

    this._drag = {
      active: false,
      moved: false,
      point: new THREE.Vector3(),
      target: new THREE.Vector3(),
      origin: new THREE.Vector3(),
      offset: new THREE.Vector3(),
      worldOrigin: new THREE.Vector3(),
      normal: new THREE.Vector3(0, 1, 0),
      plane: new THREE.Plane(),
    };

    this._build();

    if (domElement) this.bind(domElement, camera);
  }

  /* ---------------------------------------------------------------- build */

  _createMaterial() {
    const o = this.options;
    return new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(o.color),
      roughness: o.roughness,
      metalness: 0,
      transmission: o.transmission,
      thickness: o.thickness,
      ior: o.ior,
      attenuationColor: new THREE.Color(o.color),
      attenuationDistance: o.attenuationDistance,
      clearcoat: 1,
      clearcoatRoughness: 0.045,
      envMapIntensity: (o.reflections / 100) * 3.5,
      side: THREE.FrontSide,
      transparent: false,
    });
  }

  _build() {
    const o = this.options;
    const preset = PRESETS[o.preset] ?? PRESETS.cube;
    const source = o.geometry ?? preset.build({ ...o, segments: o.segments });
    const prepared = prepareGeometry(source, true);

    const previous = this.mesh.geometry;
    this.mesh.geometry = prepared;
    if (previous && previous !== prepared) previous.dispose();
    this._geometry = prepared;

    const position = prepared.getAttribute('position');
    position.setUsage(THREE.DynamicDrawUsage);
    this._rest = new Float32Array(position.array);
    this._velocity = new Float32Array(position.array.length);

    const box = prepared.boundingBox;
    this._minY = box.min.y;
    this._spanY = Math.max(1e-4, box.max.y - box.min.y);
    this._halfHeight = this._spanY * 0.5;

    if (!this._explicitPosition) {
      this.basePosition.set(0, o.floor + this._halfHeight * o.size * o.height, 0);
    }

    this.mesh.scale.set(o.size, o.size * o.height, o.size);
    this.mesh.position.copy(this.basePosition);
    this.mesh.rotation.y = THREE.MathUtils.degToRad(o.rotation);

    this._drag.point.set(0, 0, 0);
    this._drag.target.set(0, 0, 0);
    this._drag.offset.set(0, 0, 0);
    this._drag.active = false;

    if (o.eyes) this._buildEyes();
    return this;
  }

  _buildEyes() {
    this._removeEyes();
    const o = this.options;
    const box = this._geometry.boundingBox;
    const width = box.max.x - box.min.x;
    const height = box.max.y - box.min.y;
    const spacing = o.eyeSpacing ?? width * 0.34;
    const eyeY = box.min.y + height * 0.62;
    const eyeZ = box.max.z + 0.03;

    for (const side of [-1, 1]) {
      const eye = createButtonEye(o.eyeColor, o.eyeThread);
      eye.position.set(side * spacing * 0.5, eyeY, eyeZ);
      this.mesh.add(eye);
      this.attach(eye, { at: eye.position, offset: 0.035, align: true, blink: true });
      this._eyes.push(eye);
    }
    return this;
  }

  _removeEyes() {
    for (const eye of this._eyes) {
      const handle = this._attachments.find((a) => a.object === eye);
      if (handle) handle.detach();
      eye.userData.dispose?.();
      eye.removeFromParent();
    }
    this._eyes = [];
    return this;
  }

  /* ------------------------------------------------------------ materials */

  _syncMaterial() {
    const o = this.options;
    const m = this.material;
    _tint.set(o.color);
    _clear.set(o.clearColor);
    const intensity = THREE.MathUtils.clamp(o.saturation / 100, 0, 1);

    m.color.copy(_tint).lerp(_clear, 1 - intensity);
    m.attenuationColor.copy(_tint).lerp(_clear, 0.25);
    m.roughness = o.roughness;
    m.ior = o.ior;
    m.thickness = o.thickness;
    m.attenuationDistance = o.attenuationDistance;
    m.transmission = o.transmission;
    m.envMapIntensity = (o.reflections / 100) * 3.5;
    m.clearcoat = THREE.MathUtils.clamp(o.reflections / 100, 0, 1);
    m.wireframe = o.wireframe;

    if (o.texture && !this._texture) {
      this._texture = speckleTexture({ color: o.textureColor });
      m.map = this._texture;
      m.needsUpdate = true;
    } else if (!o.texture && this._texture) {
      m.map = null;
      m.needsUpdate = true;
      this._texture.dispose();
      this._texture = null;
    }
  }

  /* ----------------------------------------------------------- attachments */

  attach(object, options = {}) {
    const target = options.at ? toVector3(options.at, new THREE.Vector3()) : object.position.clone();
    const index = this._nearestVertex(target);
    const handle = {
      object,
      index,
      offset: options.offset ?? 0.03,
      align: options.align ?? true,
      blink: options.blink ?? false,
      detach: () => {
        const i = this._attachments.indexOf(handle);
        if (i >= 0) this._attachments.splice(i, 1);
        object.removeFromParent();
      },
    };
    this._attachments.push(handle);
    if (!object.parent) this.mesh.add(object);
    return handle;
  }

  detachAll() {
    for (const handle of [...this._attachments]) handle.detach();
    this._attachments.length = 0;
    this._eyes = [];
    return this;
  }

  _nearestVertex(target) {
    const position = this._geometry.getAttribute('position');
    let best = 0;
    let bestDistance = Infinity;
    for (let i = 0; i < position.count; i += 1) {
      const dx = position.getX(i) - target.x;
      const dy = position.getY(i) - target.y;
      const dz = position.getZ(i) - target.z;
      const d = dx * dx + dy * dy + dz * dz;
      if (d < bestDistance) {
        bestDistance = d;
        best = i;
      }
    }
    return best;
  }

  _syncAttachments(now) {
    if (!this._attachments.length) return;
    const position = this._geometry.getAttribute('position');
    const normal = this._geometry.getAttribute('normal');
    const phase = (now / 1000) % 4.3;
    const blink = this.options.blink && phase > 3.95
      ? Math.max(0.06, Math.abs(((phase - 3.95) / 0.35) * 2 - 1))
      : 1;

    for (const handle of this._attachments) {
      const i = handle.index;
      _normal.fromBufferAttribute(normal, i);
      handle.object.position.set(
        position.getX(i) + _normal.x * handle.offset,
        position.getY(i) + _normal.y * handle.offset,
        position.getZ(i) + _normal.z * handle.offset,
      );
      if (handle.align) {
        _quat.setFromUnitVectors(_forward, _normal);
        handle.object.quaternion.copy(_quat);
      }
      if (handle.blink) handle.object.scale.y = blink;
    }
  }

  /* -------------------------------------------------------------- pointer */

  bind(domElement, camera) {
    this.unbind();
    if (!domElement) return this;
    this._dom = domElement;
    if (camera) this._camera = camera;

    const down = (e) => this._pointerDown(e);
    const move = (e) => this._pointerMove(e);
    const up = (e) => this._pointerUp(e);
    const context = (e) => e.preventDefault();

    domElement.addEventListener('pointerdown', down, { capture: true });
    domElement.addEventListener('pointermove', move);
    domElement.addEventListener('pointerup', up);
    domElement.addEventListener('pointercancel', up);
    domElement.addEventListener('contextmenu', context);
    this._handlers = { down, move, up, context };
    return this;
  }

  unbind() {
    if (!this._dom || !this._handlers) return this;
    const { down, move, up, context } = this._handlers;
    this._dom.removeEventListener('pointerdown', down, { capture: true });
    this._dom.removeEventListener('pointermove', move);
    this._dom.removeEventListener('pointerup', up);
    this._dom.removeEventListener('pointercancel', up);
    this._dom.removeEventListener('contextmenu', context);
    this._handlers = null;
    this._dom.style.cursor = '';
    return this;
  }

  _updatePointer(event) {
    const rect = this._dom.getBoundingClientRect();
    this._pointer.set(
      ((event.clientX - rect.left) / rect.width) * 2 - 1,
      -((event.clientY - rect.top) / rect.height) * 2 + 1,
    );
    this._raycaster.setFromCamera(this._pointer, this._camera);
  }

  _pointerDown(event) {
    const o = this.options;
    if (this.disposed || !o.interactive || !this._camera) return;
    if (o.interaction === 'none' || o.interaction === 'camera' || event.button !== 0) return;

    this._updatePointer(event);
    const hit = this._raycaster.intersectObject(this.mesh, false)[0];
    if (!hit) return;

    const drag = this._drag;
    drag.active = true;
    drag.moved = false;
    drag.point.copy(this.mesh.worldToLocal(hit.point.clone()));
    drag.target.copy(drag.point);
    drag.origin.copy(drag.offset);
    drag.worldOrigin.copy(hit.point);
    drag.normal.copy(hit.face ? hit.face.normal : _up);
    drag.plane.setFromNormalAndCoplanarPoint(
      this._camera.getWorldDirection(_world).clone(),
      hit.point,
    );

    this._dom.setPointerCapture?.(event.pointerId);
    this._dom.style.cursor = 'grabbing';
    event.stopImmediatePropagation();
  }

  _pointerMove(event) {
    if (!this._dom) return;
    const o = this.options;

    if (!this._drag.active) {
      if (!o.interactive || o.interaction === 'camera' || o.interaction === 'none') return;
      if (!this._camera) return;
      this._updatePointer(event);
      const over = this._raycaster.intersectObject(this.mesh, false).length > 0;
      this._dom.style.cursor = over ? 'grab' : '';
      return;
    }

    this._updatePointer(event);
    this._drag.moved = true;
    if (!this._raycaster.ray.intersectPlane(this._drag.plane, _world)) return;

    const drag = this._drag;
    _delta.copy(_world).sub(drag.worldOrigin);

    if (o.interaction === 'move') {
      drag.offset.copy(drag.origin).add(_delta);
      drag.offset.y = Math.max(0, drag.offset.y);
      return;
    }

    const reach = 0.5 + o.stretch * 0.055;
    const travel = Math.max(0, _delta.length() - reach * 0.55);
    drag.offset.copy(drag.origin).addScaledVector(_delta.clone().normalize(), travel);
    drag.offset.y = Math.max(0, drag.offset.y);

    this.mesh.position.copy(this.basePosition).add(drag.offset);
    this.mesh.updateWorldMatrix(true, false);
    drag.target.copy(this.mesh.worldToLocal(_world.clone()));

    const pull = drag.target.clone().sub(drag.point).clampLength(0, reach);
    const inward = pull.dot(drag.normal);
    if (inward < 0) pull.addScaledVector(drag.normal, -inward);
    drag.target.copy(drag.point).add(pull);
  }

  _pointerUp(event) {
    if (!this._drag.active) return;
    if (!this._drag.moved) this._bounce = this.options.release;
    this._drag.active = false;
    this._dom?.releasePointerCapture?.(event.pointerId);
    if (this._dom) this._dom.style.cursor = '';
  }

  /* ---------------------------------------------------------------- state */

  set(options = {}) {
    const previousPreset = this.options.preset;
    const previousEyes = this.options.eyes;
    const previousGeometry = this.options.geometry;

    if (options.position !== undefined) {
      this.basePosition.copy(toVector3(options.position, new THREE.Vector3()));
      this._explicitPosition = true;
      delete options.position;
    }
    if (options.camera) this._camera = options.camera;
    if (options.floor !== undefined && !this._explicitPosition) {
      this.basePosition.y = options.floor + this._halfHeight * this.options.size * this.options.height;
    }

    Object.assign(this.options, options);

    const rebuild = (options.preset !== undefined && options.preset !== previousPreset)
      || (options.geometry !== undefined && options.geometry !== previousGeometry);

    if (rebuild) {
      this._build();
    } else {
      this.mesh.scale.set(this.options.size, this.options.size * this.options.height, this.options.size);
      if (!this._explicitPosition) this.basePosition.y = this.options.floor + this._halfHeight * this.mesh.scale.y;
      if (this.options.eyes && !previousEyes) this._buildEyes();
      if (!this.options.eyes && previousEyes) this._removeEyes();
    }
    return this;
  }

  get(key) {
    return this.options[key];
  }

  setPreset(preset) {
    return this.set({ preset });
  }

  sculpt(fn) {
    const rest = this._rest;
    const v = new THREE.Vector3();
    for (let i = 0; i < rest.length; i += 3) {
      v.set(rest[i], rest[i + 1], rest[i + 2]);
      fn(v, i / 3);
      rest[i] = v.x;
      rest[i + 1] = v.y;
      rest[i + 2] = v.z;
    }
    const position = this._geometry.getAttribute('position');
    position.array.set(rest);
    position.needsUpdate = true;
    this._geometry.computeVertexNormals();
    this._geometry.computeBoundingBox();
    this._geometry.computeBoundingSphere();

    const box = this._geometry.boundingBox;
    this._minY = box.min.y;
    this._spanY = Math.max(1e-4, box.max.y - box.min.y);
    this._halfHeight = this._spanY * 0.5;
    if (!this._explicitPosition) this.basePosition.y = this.options.floor + this._halfHeight * this.mesh.scale.y;

    for (const handle of this._attachments) handle.index = this._nearestVertex(handle.object.position);
    return this;
  }

  impulse(strength = 0.65) {
    this._bounce = Math.max(this._bounce, strength);
    return this;
  }

  wobble(strength = 0.65) {
    return this.impulse(strength);
  }

  reset() {
    const position = this._geometry.getAttribute('position');
    position.array.set(this._rest);
    this._velocity.fill(0);
    this._bounce = 0;
    this._elapsed = 0;
    this._drag.active = false;
    this._drag.offset.set(0, 0, 0);
    this._drag.point.set(0, 0, 0);
    this._drag.target.set(0, 0, 0);
    this.mesh.position.copy(this.basePosition);
    position.needsUpdate = true;
    this._geometry.computeVertexNormals();
    this._geometry.computeBoundingSphere();
    return this;
  }

  pause() {
    this.options.paused = true;
    return this;
  }

  resume() {
    this.options.paused = false;
    return this;
  }

  toggle() {
    this.options.paused = !this.options.paused;
    return this;
  }

  /* ---------------------------------------------------------------- frame */

  update(delta) {
    if (this.disposed) return this;
    const now = _clockNow();
    const raw = delta === undefined ? (this._last ? (now - this._last) / 1000 : 1 / 60) : delta;
    this._last = now;
    const dt = Math.min(Math.max(raw, 0), 0.05);

    const o = this.options;
    const geometry = this._geometry;
    const position = geometry.getAttribute('position');
    const rest = this._rest;
    const velocity = this._velocity;

    this.mesh.scale.set(o.size, o.size * o.height, o.size);
    this.mesh.position.copy(this.basePosition).add(this._drag.offset);
    if (!this._drag.active) {
      this.mesh.rotation.y = THREE.MathUtils.degToRad(o.rotation)
        + (o.autoRotate ? this._elapsed * THREE.MathUtils.degToRad(o.autoRotateSpeed) : 0);
    }

    this._syncMaterial();

    if (!o.paused) {
      const step = dt * o.speed / 100;
      this._elapsed += step;

      const stiffness = 35 + o.firmness * 1.15;
      const friction = 2.3 + o.damping * 0.11;
      const damping = Math.exp(-friction * step);
      this._bounce *= Math.exp(-step * 3.3);

      const idle = REDUCED_MOTION ? 0 : Math.sin(this._elapsed * 2.3) * 0.035 * o.wobble / 100;
      const impact = Math.sin(this._elapsed * 14) * this._bounce;

      const drag = this._drag;
      const delta = drag.target.clone().sub(drag.point);
      const radius = 0.18 + o.pullRadius * 0.018;
      const falloff = radius * radius / (1 + delta.length() * 0.35);
      const grabbing = drag.active;
      const floorLocal = (o.floor - this.mesh.position.y) / Math.max(this.mesh.scale.y, 1e-5);
      const ramp = Math.max(this._spanY * 0.4, 1e-4);

      for (let i = 0; i < position.count; i += 1) {
        const j = i * 3;
        const x = rest[j];
        const y = rest[j + 1];
        const z = rest[j + 2];

        let weight = 0;
        if (grabbing) {
          const dx = x - drag.point.x;
          const dy = y - drag.point.y;
          const dz = z - drag.point.z;
          weight = Math.exp(-(dx * dx + dy * dy + dz * dz) / falloff);
        }
        const floorWeight = o.gravity ? THREE.MathUtils.clamp((y - this._minY) / ramp, 0, 1) : 1;

        const tx = x * (1 + impact * 0.2) + Math.sin(y * 2 + this._elapsed * 2) * idle + delta.x * weight * floorWeight;
        const ty = y * (1 - impact * 0.24) + delta.y * weight * floorWeight
          + (o.gravity ? 0 : Math.sin(this._elapsed * 1.8) * 0.12);
        const tz = z * (1 + impact * 0.18) + delta.z * weight * floorWeight;

        const px = position.array[j];
        const py = position.array[j + 1];
        const pz = position.array[j + 2];

        let vx = (velocity[j] + (tx - px) * stiffness * step) * damping;
        let vy = (velocity[j + 1] + (ty - py) * stiffness * step) * damping;
        let vz = (velocity[j + 2] + (tz - pz) * stiffness * step) * damping;

        let nx = px + vx * step;
        let ny = py + vy * step;
        let nz = pz + vz * step;

        if (o.gravity && ny < floorLocal) {
          ny = floorLocal;
          if (vy < 0) {
            vy = 0;
            velocity[j + 1] = 0;
          }
        }

        velocity[j] = vx;
        velocity[j + 1] = vy;
        velocity[j + 2] = vz;
        position.array[j] = nx;
        position.array[j + 1] = ny;
        position.array[j + 2] = nz;
      }

      position.needsUpdate = true;
      geometry.computeVertexNormals();
      geometry.computeBoundingSphere();
    }

    this._syncAttachments(now);
    return this;
  }

  /* --------------------------------------------------------------- dispose */

  dispose() {
    if (this.disposed) return this;
    this.disposed = true;
    this.unbind();

    for (const handle of [...this._attachments]) {
      if (handle.object.userData?.dispose) handle.object.userData.dispose();
      handle.object.removeFromParent();
    }
    this._attachments.length = 0;
    this._eyes.length = 0;

    if (this._texture) {
      this._texture.dispose();
      this._texture = null;
    }
    this._geometry?.dispose();
    this.material?.dispose();
    this.mesh.clear();
    this.mesh.removeFromParent();
    return this;
  }
}

/* -------------------------------------------------------------------------- */
/*  helpers                                                                   */
/* -------------------------------------------------------------------------- */

function toVector3(value, target) {
  if (value.isVector3) return target.copy(value);
  if (Array.isArray(value)) return target.set(value[0] ?? 0, value[1] ?? 0, value[2] ?? 0);
  if (typeof value === 'object') return target.set(value.x ?? 0, value.y ?? 0, value.z ?? 0);
  return target.set(0, 0, 0);
}

export default Jelly;
export { PRESETS };
