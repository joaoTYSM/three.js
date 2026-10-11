<div align="center">

# Animated Discord Checkbox

**A Discord-inspired animated checkbox recreated with Three.js and WebGL.**

[![Three.js](https://img.shields.io/badge/Three.js-WebGL-black?style=for-the-badge&logo=threedotjs&logoColor=white)](https://threejs.org/)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES%20Modules-F7DF1E?style=for-the-badge&logo=javascript&logoColor=222)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Status](https://img.shields.io/badge/Status-Experimental-orange?style=for-the-badge)](#limitations)
[![Platform](https://img.shields.io/badge/Platform-Web-5865F2?style=for-the-badge&logo=googlechrome&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web)

[Overview](#-overview) ·
[Features](#-features) ·
[Installation](#-installation) ·
[Usage](#-usage) ·
[Documentation](#-documentation)

</div>

---

## 📌 Overview

**Animated Discord Checkbox** is an experimental frontend project inspired by Discord's checkbox animation.

The project explores recreating the original checkbox appearance using **Three.js and WebGL**, replacing its visible CSS-drawn components with rendered geometry while retaining the original HTML structure.

The converter automatically detects elements using the `.checkbox` class, reads selected computed styles, and creates a transparent WebGL canvas over each checkbox.

The intended visual transition is:

`✕ → − → ✓`

And in reverse:

`✓ → − → ✕`

> [!IMPORTANT]
> This project is experimental. The current Three.js implementation approximates the original CSS animation and does not reproduce every keyframe pixel-perfectly.

## 🖼️ Preview

<div align="center">

<!-- Replace this placeholder with a real screenshot or GIF. -->

<img src="assets/checkbox-demo.gif" alt="Animated Discord Checkbox demonstration" width="480">

*Animated checkbox inspired by Discord's interface.*

</div>

To display the preview, add a real GIF or screenshot at:

`assets/checkbox-demo.gif`

The image reference above is a placeholder until that file exists in the repository.

## ✨ Features

- **Discord-inspired design** — based on the supplied checkbox styling.
- **Automatic detection** — finds elements with the `.checkbox` class.
- **Style sampling** — reads dimensions, border radius, and selected colors.
- **WebGL rendering** — draws the track, knob, and indicator lines using Three.js.
- **Responsive dimensions** — uses `ResizeObserver` to react to size changes.
- **Dynamic discovery** — scans the document for matching checkbox elements.
- **State observation** — watches the `.checked` and `.unchecked` classes.
- **No build system required** — uses browser ES modules and a CDN import map.
- **Original markup compatibility** — retains the existing checkbox structure.

## 📚 Documentation

- [Overview](#-overview)
- [Preview](#-preview)
- [Features](#-features)
- [How It Works](#-how-it-works)
- [Requirements](#-requirements)
- [Installation](#-installation)
- [Usage](#-usage)
- [HTML Structure](#-html-structure)
- [Customization](#-customization)
- [Compatibility](#-compatibility)
- [Limitations](#-limitations)
- [Troubleshooting](#-troubleshooting)
- [Roadmap](#-roadmap)
- [Contributing](#-contributing)
- [Credits](#-credits)
- [License](#-license)

## ⚙️ How It Works

Animated Discord Checkbox follows a straightforward rendering process.

### 1. Element Detection

The script searches the document for elements matching `.checkbox`.

### 2. Style Inspection

It reads selected CSS properties, including dimensions, border radius, and colors.

### 3. Renderer Initialization

A transparent `THREE.WebGLRenderer` canvas is created and positioned over each checkbox.

### 4. Geometry Creation

Three.js meshes recreate the visible components:

- Track
- Knob
- First indicator line
- Second indicator line

### 5. State Observation

A `MutationObserver` watches for changes to the checkbox's CSS classes.

### 6. Responsive Rendering

A `ResizeObserver` updates the rendering dimensions when the checkbox changes size.

### 7. Animation Loop

`requestAnimationFrame` updates the geometry and renders the scene continuously.

For more information, see the official [Three.js documentation](https://threejs.org/docs/).

## 💻 Requirements

Before running the project, ensure that you have:

- A modern browser with ES module support.
- WebGL 2 support.
- An internet connection to load Three.js from jsDelivr.
- HTML elements using the expected checkbox structure.
- A local HTTP server for reliable development and testing.

## 🚀 Installation

### Step 1 — Create the HTML file

Create an `index.html` file containing the original checkbox markup and CSS.

### Step 2 — Import Three.js

Add the following import map inside the `<head>` section, before the module script:

```html
<script type="importmap">
{
  "imports": {
    "three": "https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js"
  }
}
</script>
