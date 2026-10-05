# 🍮 jelly.js

[![npm version](https://img.shields.io/npm/v/jelly.js.svg?style=flat-square)](https://raw.githubusercontent.com/joaoTYSM/tree.js/refs/heads/main/jelly/tree.js)
[![downloads](https://img.shields.io/npm/dm/jelly.js.svg?style=flat-square)](https://raw.githubusercontent.com/joaoTYSM/tree.js/refs/heads/main/jelly/tree.js)
[![license](https://img.shields.io/npm/l/jelly.js.svg?style=flat-square)](https://github.com/joaoTYSM/tree.js/blob/main/LICENSE)
[![discord](https://img.shields.io/discord/1234567890?color=7289da&label=Discord&logo=discord&style=flat-square)](https://discord.gg/RCXKUtYhpp)

**100% Customizable Soft-Body Physics Helper for the Web.** 
Extracted directly from the *Soft Matter* material studies[span_0](start_span)[span_0](end_span), `jelly.js` acts as an interactive, drag-and-drop web companion or "bubble" widget you can inject directly into any page. Built on top of Three.js.

## 🔗 Live Demo
* **Preview:** [demo/jelly](https://ilove-treejs.vercel.app/jelly) *(Mock URL)*

## 📦 Installation

Since `jelly.js` utilizes modern ES Modules and `three`, ensure you have an import map or a bundler (Vite, Webpack) set up.

```html
<script type="importmap">
{
  "imports": {
    "three": "https://unpkg.com/three@0.160.0/build/three.module.js",
    "three/addons/": "https://unpkg.com/three@0.160.0/examples/jsm/",
    "tree.js": "https://raw.githubusercontent.com/joaoTYSM/tree.js/refs/heads/main/jelly/tree.js"
  }
}
</script>
```
