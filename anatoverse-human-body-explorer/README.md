# AnatoVerse Human Body Explorer

AnatoVerse Human Body Explorer is an interactive, professional 3D human anatomy learning application. It allows students, medical professionals, and educators to explore the human body, toggle individual systems, trace organ locations, and research detailed clinical summaries.

## Features

- **Procedural 3D Holographic Model:** Rendered dynamically using pure WebGL and Three.js with OrbitControls. No heavy pre-downloads or third-party asset delays.
- **Dynamic System Selection:** Turn on/off 11 different core systems (Skeletal, Cardiovascular, Respiratory, Digestive, Nervous, Urinary, Endocrine, Lymphatic, Integumentary, Reproductive, Muscular).
- **Clickable Hotspots & Meshes:** Interact directly with glowing marker points or physical organs; instantly updates the academic details panel on the right.
- **Faceted Search Index:** Easily search through organs, systems, or physiological keywords with live suggestions.
- **Label & Wireframe Toggle:** Support toggling hotspots on/off and centering cameras securely via automated smooth transition curves.

## Package File Structure

```text
/anatoverse-human-body-explorer
│
├── index.html        # Main educational user interface structure
├── style.css         # Responsive slate-glass medical design styles
├── app.js            # Core ThreeJS 3D renderer and interaction logic
├── data.js           # Structured clinical anatomy facts database
└── README.md         # This documentation file
```

## How to Run Node Server Local Copy

### Option A: Standard Direct Launch

Because of native ES6 modular structures and cross-origin standard safety guidelines for WebGL assets, running via a lightweight web server is recommended. 

If you have **Python** installed:
```bash
python -m http.server 8000
```
Then visit `http://localhost:8000` in your browser.

If you have **Node.js** installed:
```bash
npx serve .
```
Then visit the url specified in your console terminal (typically `http://localhost:3000` or `http://localhost:5000`).

---

## 3D Model Integration

Our workspace uses a high-performance, responsive procedural 3D model, allowing local startup speeds of ~0ms without loading heavy models or broken URLs.

Should you wish to integrate high-density real **GLTF/GLB** files:
1. Place your GLB assets inside a `/models` folder (e.g., `models/human-body.glb`).
2. Inside `app.js`, use the standard `THREE.GLTFLoader` to parse the file:
```js
const loader = new THREE.GLTFLoader();
loader.load('models/human-body.glb', (gltf) => {
  scene.add(gltf.scene);
}, undefined, (error) => {
  console.error(error);
});
```

## Browser Requirements

- Standard modern web browser with WebGL enabled (Chrome 80+, Safari 13.5+, Edge 80+, Firefox 75+).
- High-resolution or responsive display recommended.

---

## Medical Disclaimer

*This application is built for educational, academic and reference purposes only. It does not provide medical advice, diagnosis, or treatment. Always consult certified clinical professionals.*
