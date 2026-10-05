# 🍮 jelly.js

[![npm version](https://img.shields.io/npm/v/jelly.js.svg?style=flat-square)](https://npmjs.org/package/jelly.js)
[![downloads](https://img.shields.io/npm/dm/jelly.js.svg?style=flat-square)](https://npmjs.org/package/jelly.js)
[![license](https://img.shields.io/npm/l/jelly.js.svg?style=flat-square)](https://github.com/joaoTYSM/tree.js/blob/main/LICENSE)
[![discord](https://img.shields.io/discord/1234567890?color=7289da&label=Discord&logo=discord&style=flat-square)](https://discord.gg/RCXKUtYhpp)

**100% Customizable Soft-Body Physics Helper for the Web.** 
Extracted directly from the *Soft Matter* material studies[span_0](start_span)[span_0](end_span), `jelly.js` acts as an interactive, drag-and-drop web companion or "bubble" widget you can inject directly into any page. Built on top of Three.js.

## 🔗 Live Demo
* **Preview:** [https://codepen.io/joaoTYSM/jelly-js-demo](#) *(Mock URL)*

## 📦 Installation

Since `jelly.js` utilizes modern ES Modules and `three`, ensure you have an import map or a bundler (Vite, Webpack) set up.

```html
<script type="importmap">
  {
    "imports": {
      "three": "[https://unpkg.com/three@0.160.0/build/three.module.js](https://unpkg.com/three@0.160.0/build/three.module.js)",
      "three/addons/": "[https://unpkg.com/three@0.160.0/examples/jsm/](https://unpkg.com/three@0.160.0/examples/jsm/)"
    }
  }
</script>
