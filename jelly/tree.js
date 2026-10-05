/* v2.1
 ──────────────────────────────────────────────────────────────────────────
        ██╗███████╗██╗     ██╗  ██╗   ██╗
        ██║██╔════╝██║     ██║  ╚██╗ ██╔╝
        ██║█████╗  ██║     ██║   ╚████╔╝
   ██   ██║██╔══╝  ██║     ██║    ╚██╔╝
   ╚█████╔╝███████╗███████╗███████╗██║          Discord: https://discord.gg/AUddtuAGUf (Guaranteed role on the server: "tree.js")
    ╚════╝ ╚══════╝╚══════╝╚══════╝╚═╝          By joao repo: joaoTYSM/tree.js/jelly.js
                                                 ........                                             
                                           .....................                                      
                                     ......:-===============-:.....                                   
                                   ...:--=====+*************+===-:....                                
                                ....-====+**************+:..:+**+==-....                              
                              ...:-===+*********+++++++++:....+****==-...                             
                            ....-===+*******+++++++++++++++++++******==:....                          
                            ..:-==+*******+++++++++++++++++++++++*****+=-...                          
                           ..:===**#+.=**++++++++++++++++++++++++*+.-#*==-...                         
                         ...:===***%%%#**+++++++++++++++++++++++++#%%##*==-..                         
                         ..:===+***#%#***++++++++++++++++++++++++++#%#**+==:..                        
                         ..-==+**********++++++++++++++++++++++++++++****+==:..                       
                       ...-===***********++++++++++++++++++++++++++++*****==-..                       
                       ..:===+************+++++++++++++++++++++++++++*****+==:...                     
                       ..-===**********++++++++++++++++++++++++++++********==-:..                     
                     ...:===**********+++++++++++++++++++++++++++***********==-...                    
                     ..:-==+***********++++++**++++++++++++++++*************===-...                   
                   ...:-===******+++**********************************+=+**+====-:..                  
                 ...:-===+********************************************===+**+=====-....               
               ..:-===++*******************************************************++===-:...             
              ..-====***********++++++++++++++++++++++++++++++++++++++++***********+==-...            
              ..-===+********++++++++++++++++++++++++++++++++++++++++++++++********===-...            
              ...-======+++********++++++++++++++++++++++++++++++++++*********++=====-...             
               ......:-===============++++++*********************++++===========-:......              
                     ........::::-------========================------::::.........                   
                               ........ ..........  ...................                               
 ──────────────────────────────────────────────────────────────────────────
*/

import * as THREE from 'three';
import { mergeVertices } from 'three/addons/utils/BufferGeometryUtils.js';

export default class Jelly {
    constructor(container, options = {}) {
        this.container = typeof container === 'string' ? document.querySelector(container) : container;
        
        this.settings = {
            color: 0xe00072,
            firmness: 38,
            damping: 28,
            gravity: false,
            transparency: 100,
            roughness: 5,
            thickness: 22,
            refraction: 35,
            reflections: 48,
            pullRadius: 22,
            stretch: 65,
            wobble: 70,
            speed: 100,
            size: 100,
            scaleY: 100,
            paused: false,
            wireframe: false,
            ...options
        };

        this.init();
    }

    init() {
        this.scene = new THREE.Scene();
        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1.15;
        
        this.container.appendChild(this.renderer.domElement);

        this.camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100);
        this.camera.position.set(0, 0, 12);

        const light = new THREE.DirectionalLight(0xffffff, 4);
        light.position.set(-3, 7, 5);
        this.scene.add(light, new THREE.HemisphereLight(0xffffff, 0x9b9b9b, 2));

        let geometry = new THREE.BoxGeometry(2.8, 2.35, 2.5, 36, 32, 34);
        const positions = geometry.getAttribute('position');
        const core = new THREE.Vector3(1.0, 0.775, 0.85);
        const p = new THREE.Vector3(), q = new THREE.Vector3();
        
        for (let i = 0; i < positions.count; i++) {
            p.fromBufferAttribute(positions, i);
            q.copy(p).clamp(core.clone().negate(), core);
            const n = p.clone().sub(q).normalize();
            p.copy(q).addScaledVector(n, 0.4);
            const ripple = 0.055 * Math.sin(p.x * 3.8 + p.z * 2.2) * Math.cos(p.y * 3);
            p.addScaledVector(n, ripple);
            positions.setXYZ(i, p.x, p.y * 0.8, p.z);
        }
        
        geometry.deleteAttribute('normal');
        geometry.deleteAttribute('uv');
        geometry = mergeVertices(geometry, 0.0001);
        geometry.computeVertexNormals();

        this.pos = geometry.getAttribute('position');
        this.pos.setUsage(THREE.DynamicDrawUsage);
        this.rest = new Float32Array(this.pos.array);
        this.velocity = new Float32Array(this.rest.length);

        this.material = new THREE.MeshPhysicalMaterial({ 
            color: this.settings.color, 
            roughness: 0.065, 
            metalness: 0, 
            transmission: 1, 
            thickness: 2.3, 
            ior: 1.42, 
            attenuationColor: new THREE.Color(this.settings.color).lerp(new THREE.Color(0xffffff), 0.25), 
            attenuationDistance: 1.8, 
            clearcoat: 1, 
            clearcoatRoughness: 0.045
        });

        this.jelly = new THREE.Mesh(geometry, this.material);
        this.scene.add(this.jelly);

        this.raycaster = new THREE.Raycaster();
        this.pointer = new THREE.Vector2();
        this.dragPoint = new THREE.Vector3();
        this.dragTarget = new THREE.Vector3();
        this.plane = new THREE.Plane();
        this.worldPoint = new THREE.Vector3();

        this.dragging = false;
        this.bounce = 0;
        this.elapsed = 0;
        this.previousTime = performance.now();

        this.bindEvents();
        this.resize();
        window.addEventListener('resize', () => this.resize());

        this.animate();
    }

    bindEvents() {
        const canvas = this.renderer.domElement;
        
        const updatePointer = (e) => {
            const r = canvas.getBoundingClientRect();
            this.pointer.set((e.clientX - r.left) / r.width * 2 - 1, -(e.clientY - r.top) / r.height * 2 + 1);
            this.raycaster.setFromCamera(this.pointer, this.camera);
        };

        canvas.addEventListener('pointerdown', (e) => {
            updatePointer(e);
            const hit = this.raycaster.intersectObject(this.jelly)[0];
            if (!hit) return;
            
            this.dragging = true;
            canvas.setPointerCapture(e.pointerId);
            this.dragPoint.copy(this.jelly.worldToLocal(hit.point.clone()));
            this.dragTarget.copy(this.dragPoint);
            this.plane.setFromNormalAndCoplanarPoint(this.camera.getWorldDirection(new THREE.Vector3()), hit.point);
            canvas.style.cursor = 'grabbing';
        });

        canvas.addEventListener('pointermove', (e) => {
            updatePointer(e);
            if (this.dragging) {
                if (this.raycaster.ray.intersectPlane(this.plane, this.worldPoint)) {
                    this.dragTarget.copy(this.jelly.worldToLocal(this.worldPoint.clone()));
                    const delta = this.dragTarget.clone().sub(this.dragPoint).clampLength(0, 0.5 + this.settings.stretch * 0.055);
                    this.dragTarget.copy(this.dragPoint).add(delta);
                }
            } else {
                canvas.style.cursor = this.raycaster.intersectObject(this.jelly).length > 0 ? 'grab' : 'default';
            }
        });

        const up = () => {
            if (this.dragging) this.bounce = 0.65;
            this.dragging = false;
            canvas.style.cursor = 'default';
        };

        canvas.addEventListener('pointerup', up);
        canvas.addEventListener('pointercancel', up);
    }

    updateSettings(newSettings) {
        this.settings = { ...this.settings, ...newSettings };
        
        this.material.color.setHex(this.settings.color);
        this.material.transmission = this.settings.transparency / 100;
        this.material.thickness = 0.1 + this.settings.thickness * 0.03;
        this.material.roughness = 0.01 + this.settings.roughness * 0.009;
        this.material.ior = 1 + this.settings.refraction * 0.01;
        this.material.clearcoat = this.settings.reflections / 100;
        this.material.wireframe = this.settings.wireframe;
        
        this.jelly.scale.set(this.settings.size / 100, (this.settings.size * this.settings.scaleY) / 10000, this.settings.size / 100);
    }

    wobble(strength = 1) {
        this.bounce = strength * (this.settings.wobble / 100);
    }

    reset() {
        this.pos.array.set(this.rest);
        this.velocity.fill(0);
        this.bounce = 0;
        this.pos.needsUpdate = true;
        this.jelly.geometry.computeVertexNormals();
    }

    resize() {
        const { clientWidth, clientHeight } = this.container;
        this.renderer.setSize(clientWidth, clientHeight);
        this.camera.aspect = clientWidth / clientHeight;
        this.camera.updateProjectionMatrix();
    }

    animate = (now) => {
        this.raf = requestAnimationFrame(this.animate);
        
        const dt = Math.min(((now || performance.now()) - this.previousTime) / 1000, 0.035);
        this.previousTime = now || performance.now();

        if (!this.settings.paused) {
            const step = dt * this.settings.speed / 100;
            this.elapsed += step;
            
            const stiffness = 35 + this.settings.firmness * 1.15;
            const friction = 2.3 + this.settings.damping * 0.11;
            this.bounce *= Math.exp(-step * 3.3);
            
            const wobble = Math.sin(this.elapsed * 2.3) * 0.035 * this.settings.wobble / 100;
            const impact = Math.sin(this.elapsed * 14) * this.bounce;
            const delta = this.dragTarget.clone().sub(this.dragPoint);
            const radius = 0.18 + this.settings.pullRadius * 0.018;
            const falloff = radius * radius / (1 + delta.length() * 0.35);

            for (let i = 0; i < this.pos.count; i++) {
                const j = i * 3, x = this.rest[j], y = this.rest[j+1], z = this.rest[j+2];
                const dx = x - this.dragPoint.x, dy = y - this.dragPoint.y, dz = z - this.dragPoint.z;
                const weight = this.dragging ? Math.exp(-(dx*dx + dy*dy + dz*dz) / falloff) : 0;
                
                const targets = [
                    x * (1 + impact * 0.2) + Math.sin(y * 2 + this.elapsed * 2) * wobble + delta.x * weight,
                    y * (1 - impact * 0.24) + delta.y * weight + (this.settings.gravity ? 0 : Math.sin(this.elapsed * 1.8) * 0.12),
                    z * (1 + impact * 0.18) + delta.z * weight
                ];

                for (let k = 0; k < 3; k++) {
                    const index = j + k;
                    const value = this.pos.array[index];
                    const speed = (this.velocity[index] + (targets[k] - value) * stiffness * step) * Math.exp(-friction * step);
                    this.velocity[index] = speed;
                    this.pos.array[index] = value + speed * step;
                }
            }
            this.pos.needsUpdate = true;
            this.jelly.geometry.computeVertexNormals();
        }

        this.renderer.render(this.scene, this.camera);
    }

    destroy() {
        cancelAnimationFrame(this.raf);
        this.renderer.dispose();
        this.jelly.geometry.dispose();
        this.material.dispose();
        this.container.innerHTML = '';
    }
}
