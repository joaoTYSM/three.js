<div align="center">

<h1 align="center">
  <img
    src="https://raw.githubusercontent.com/joaoTYSM/three.js/refs/heads/main/jelly/jelly.png"
    width="140"
    alt="jelly.js"
    align="middle"
  >
  <span>jelly.js</span>
</h1>




### Interactive soft-body jelly physics for Three.js

A lightweight JavaScript library for creating interactive, deformable and customizable
3D jelly objects directly in the browser.

<br>

[![GitHub](https://img.shields.io/badge/GitHub-joaoTYSM%2Ftree.js-181717?style=flat-square&logo=github&logoColor=white)](https://github.com/joaoTYSM/three.js)
[![Three.js](https://img.shields.io/badge/jsdeliver-black?style=flat-square&logo=javascript&logoColor=white)](https://cdn.jsdelivr.net/gh/joaoTYSM/three.js@main/jelly/main.js)
[![License](https://img.shields.io/badge/License-MIT-blue?style=flat-square)](LICENSE)
[![Discord](https://img.shields.io/badge/Discord-RCXKUtYhpp-5865F2?style=flat-square&logo=discord&logoColor=white)](https://discord.gg/RCXKUtYhpp)

<br>

<a href="#features">Features</a>
&nbsp;&nbsp;•&nbsp;&nbsp;
<a href="#installation">Installation</a>
&nbsp;&nbsp;•&nbsp;&nbsp;
<a href="#quick-start">Quick Start</a>
&nbsp;&nbsp;•&nbsp;&nbsp;
<a href="#api">API</a>
&nbsp;&nbsp;•&nbsp;&nbsp;
<a href="#community">Community</a>

</div>

---

## <img src="https://api.iconify.design/solar/info-circle-linear.svg?color=%23ffffff&width=20&height=20" width="20" height="20" align="absmiddle"> About

**jelly.js** is an experimental soft-body 3D jelly system built on top of
[Three.js](https://threejs.org/).

It creates a translucent, deformable 3D object that reacts to pointer interaction,
movement and configurable physical parameters.

The project is designed to stay simple to integrate while exposing enough controls
to customize the appearance and behavior of the jelly.

---

## <img src="https://api.iconify.design/solar/widget-5-linear.svg?color=%23ffffff&width=20&height=20" width="20" height="20" align="absmiddle"> Features

| | |
|---|---|
| <img src="https://api.iconify.design/solar/cursor-linear.svg?color=%23ffffff&width=20&height=20" width="20"> **Interactive** | Drag the jelly directly with pointer input. |
| <img src="https://api.iconify.design/solar:video-frame-play-vertical-broken.svg?color=%23ffffff&width=20&height=20" width="20"> **Soft-body motion** | Deformable geometry with spring-like movement and wobble. |
| <img src="https://api.iconify.design/solar/tuning-2-linear.svg?color=%23ffffff&width=20&height=20" width="20"> **Customizable** | Adjust firmness, damping, transparency, refraction, reflections and more. |
| <img src="https://api.iconify.design/solar:pills-3-bold-duotone.svg?color=%23ffffff&width=20&height=20" width="20"> **3D** | Built around the Three.js rendering ecosystem. |
| <img src="https://api.iconify.design/solar/code-2-linear.svg?color=%23ffffff&width=20&height=20" width="20"> **ES Modules** | Uses modern native JavaScript modules. |
| <img src="https://api.iconify.design/solar/bolt-linear.svg?color=%23ffffff&width=20&height=20" width="20"> **Browser-based** | Runs directly inside a WebGL-capable browser. |
| <img src="https://api.iconify.design/solar/refresh-linear.svg?color=%23ffffff&width=20&height=20" width="20"> **Resettable** | Restore the jelly to its original geometry. |
| <img src="https://api.iconify.design/solar/maximize-linear.svg?color=%23ffffff&width=20&height=20" width="20"> **Responsive** | Automatically adapts the renderer to its container. |

---

## <img src="https://api.iconify.design/solar/play-circle-linear.svg?color=%23ffffff&width=20&height=20" width="20" height="20" align="absmiddle"> Live Demo

<div align="center">

<a href="https://github.com/joaoTYSM/three.js">

<img src="https://img.shields.io/badge/OPEN_LIVE_DEMO-ffffff?style=for-the-badge&logo=googlechrome&logoColor=ffffff&labelColor=000000">

</a>

</div>

> A dedicated online demo is being prepared.

---

## <img src="https://api.iconify.design/solar-download-linear.svg?color=%23ffffff&width=20&height=20" width="20" height="20" align="absmiddle"> Installation

### CDN

You can load `jelly.js` directly from the GitHub repository.

```html
<script type="importmap">
{
  "imports": {
    "three": "https://unpkg.com/three@0.160.0/build/three.module.js",
    "three/addons/": "https://unpkg.com/three@0.160.0/examples/jsm/"
  }
}
</script>

<script type="module">
  import Jelly from "https://raw.githubusercontent.com/joaoTYSM/three.js/refs/heads/main/jelly/three.js";
</script>
