/**
 * AnatoVerse Human Body Explorer - Core 3D Interactive Client Engine
 * Designed in pure vanilla JS with ThreeJS for maximum offline portability.
 */

class AnatomyExplorer {
  constructor() {
    this.selectedSystemId = null;
    this.selectedOrganId = null;
    this.showHotspots = true;
    this.showLabels = true;

    // Dom elements
    this.canvasContainer = document.getElementById('canvas-container');
    this.canvasElement = document.getElementById('canvas3d');
    this.rightPanel = document.getElementById('right-info-panel');
    this.systemButtonsContainer = document.getElementById('systems-selector-container');
    this.searchBar = document.getElementById('explorer-search-input');
    this.searchDropdown = document.getElementById('search-dropdown-results');

    // ThreeJS state
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.controls = null;
    this.anatomyGroup = null;
    this.hotspotsGroup = null;
    this.systemLayers = {};
    this.clock = new THREE.Clock();

    this.init();
  }

  init() {
    this.initThree();
    this.buildHolographicBody();
    this.bindEvents();
    this.renderSystemMenus();
    this.renderSystemCards();
    this.renderOrganCards();
    this.updateInfoPanel();
    this.animate();
  }

  initThree() {
    const width = this.canvasContainer.clientWidth;
    const height = this.canvasContainer.clientHeight || 500;

    // Scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x0f172a);
    this.scene.fog = new THREE.FogExp2(0x0f172a, 0.15);

    // Camera
    this.camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 10);
    this.camera.position.set(0, 1.1, 2.5);

    // Renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true, canvas: this.canvasElement });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // OrbitControls
    this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.maxPolarAngle = Math.PI * 0.58;
    this.controls.minPolarAngle = Math.PI * 0.15;
    this.controls.minDistance = 0.6;
    this.controls.maxDistance = 4.2;
    this.controls.target.set(0, 1.0, 0);

    // Lights
    const ambientLight = new THREE.AmbientLight(0x334155, 1.2);
    this.scene.add(ambientLight);

    const mainLight = new THREE.DirectionalLight(0x38bdf8, 1.5);
    mainLight.position.set(4, 5, 4);
    this.scene.add(mainLight);

    const rimLight = new THREE.DirectionalLight(0xf43f5e, 1.0);
    rimLight.position.set(-4, 3, -3);
    this.scene.add(rimLight);

    const floorGrid = new THREE.GridHelper(10, 40, 0x1e293b, 0x0f172a);
    floorGrid.position.y = 0;
    this.scene.add(floorGrid);
  }

  buildHolographicBody() {
    this.anatomyGroup = new THREE.Group();
    this.scene.add(this.anatomyGroup);

    // REAL ANATOMY REFERENCE IMAGE BODY - replaces the old procedural dummy body
    const referenceTexture = new THREE.TextureLoader().load('assets/images/anatomy-human-body.png');
    referenceTexture.colorSpace = THREE.SRGBColorSpace;
    const referenceMaterial = new THREE.MeshBasicMaterial({
      map: referenceTexture,
      transparent: true,
      side: THREE.DoubleSide,
      depthWrite: false
    });
    const referenceBody = new THREE.Mesh(new THREE.PlaneGeometry(0.94, 1.80), referenceMaterial);
    referenceBody.name = 'Uploaded Anatomy Reference Image';
    referenceBody.position.set(0, 0.80, 0.10);
    referenceBody.renderOrder = 1;
    this.anatomyGroup.add(referenceBody);

    // Common glowing translucent materials
    const materials = {
      skin: new THREE.MeshPhysicalMaterial({
        color: 0x38bdf8,
        transparent: true,
        opacity: 0.14,
        roughness: 0.1,
        metalness: 0.1,
        clearcoat: 1.0
      }),
      skeleton: new THREE.MeshStandardMaterial({
        color: 0xe2e8f0,
        roughness: 0.4,
        emissive: 0x475569,
        emissiveIntensity: 0.25
      }),
      nervous: new THREE.MeshBasicMaterial({ color: 0xf59e0b, wireframe: true }),
      nerveCord: new THREE.LineBasicMaterial({ color: 0xf59e0b }),
      cardioRed: new THREE.MeshToonMaterial({ color: 0xef4444, emissive: 0xef4444, emissiveIntensity: 0.35 }),
      cardioBlue: new THREE.MeshToonMaterial({ color: 0x3b82f6, emissive: 0x3b82f6, emissiveIntensity: 0.35 }),
      lungs: new THREE.MeshStandardMaterial({ color: 0x06b6d4, transparent: true, opacity: 0.65, roughness: 0.2 }),
      digestive: new THREE.MeshStandardMaterial({ color: 0x10b981, roughness: 0.3, emissive: 0x064e3b, emissiveIntensity: 0.1 }),
      stomachMat: new THREE.MeshPhysicalMaterial({ color: 0x14b8a6, roughness: 0.2 }),
      urinary: new THREE.MeshStandardMaterial({ color: 0x818cf8, roughness: 0.4 }),
      endocrine: new THREE.MeshToonMaterial({ color: 0xec4899, emissive: 0xbe185d, emissiveIntensity: 0.2 }),
      reproductive: new THREE.MeshStandardMaterial({ color: 0xf43f5e, roughness: 0.5 }),
      muscularMat: new THREE.MeshStandardMaterial({ color: 0xf97316, wireframe: true, transparent: true, opacity: 0.35 })
    };

    // --- Integumentary Skin Shell ---
    const skinGroup = new THREE.Group();
    // Head
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.16, 16, 16), materials.skin);
    head.position.set(0, 1.5, 0); head.name = "Skin";
    skinGroup.add(head);

    // Torso
    const torso = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.18, 0.65, 16), materials.skin);
    torso.position.set(0, 0.95, 0); torso.name = "Skin";
    skinGroup.add(torso);

    // Hips
    const hips = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.20, 0.22, 16), materials.skin);
    hips.position.set(0, 0.54, 0); hips.name = "Skin";
    skinGroup.add(hips);

    // Left leg
    const legL = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.065, 0.95, 16), materials.skin);
    legL.position.set(-0.11, 0.48, 0); legL.name = "Skin";
    skinGroup.add(legL);

    // Right leg
    const legR = legL.clone();
    legR.position.x = 0.11;
    skinGroup.add(legR);

    skinGroup.visible = false; // replaced by uploaded anatomy image
    this.anatomyGroup.add(skinGroup);

    // --- 1. SKELETAL SYSTEM ---
    this.systemLayers.skeletal = new THREE.Group();
    const skull = new THREE.Mesh(new THREE.SphereGeometry(0.14, 12, 12), materials.skeleton);
    skull.position.set(0, 1.5, 0); skull.name = "Skull";
    this.systemLayers.skeletal.add(skull);

    const spine = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.018, 0.72, 8), materials.skeleton);
    spine.position.set(0, 1.05, -0.04); spine.name = "Spine";
    this.systemLayers.skeletal.add(spine);

    // Ribs loops
    for (let i = 0; i < 7; i++) {
      const rib = new THREE.Mesh(new THREE.TorusGeometry(0.14 + i * 0.005, 0.012, 8, 24, Math.PI * 0.85), materials.skeleton);
      rib.position.set(0, 0.88 + i * 0.045, -0.02);
      rib.rotation.set(Math.PI * 0.1, Math.PI, Math.PI * 0.5);
      rib.name = "Ribcage";
      this.systemLayers.skeletal.add(rib);
    }

    const pelvis = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.12, 0.16), materials.skeleton);
    pelvis.position.set(0, 0.56, -0.01); pelvis.name = "Bones";
    this.systemLayers.skeletal.add(pelvis);

    this.anatomyGroup.add(this.systemLayers.skeletal);

    // --- 2. CARDIOVASCULAR SYSTEM ---
    this.systemLayers.cardiovascular = new THREE.Group();
    const heart = new THREE.Mesh(new THREE.SphereGeometry(0.065, 12, 12), materials.cardioRed);
    heart.position.set(0.04, 1.14, 0.06); heart.name = "Heart";
    this.systemLayers.cardiovascular.add(heart);

    const aorta = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.4), materials.cardioRed);
    aorta.position.set(-0.02, 0.95, -0.01);
    this.systemLayers.cardiovascular.add(aorta);

    const vena = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.4), materials.cardioBlue);
    vena.position.set(0.07, 0.95, -0.01);
    this.systemLayers.cardiovascular.add(vena);

    this.anatomyGroup.add(this.systemLayers.cardiovascular);

    // --- 3. RESPIRATORY SYSTEM ---
    this.systemLayers.respiratory = new THREE.Group();
    const trachea = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.18, 12), materials.lungs);
    trachea.position.set(0, 1.34, 0.04); trachea.name = "Lungs";
    this.systemLayers.respiratory.add(trachea);

    const lungL = new THREE.Mesh(new THREE.SphereGeometry(0.08, 12, 12), materials.lungs);
    lungL.scale.set(1.2, 1.8, 1.0);
    lungL.position.set(-0.10, 1.13, 0.04); lungL.name = "Lungs";
    this.systemLayers.respiratory.add(lungL);

    const lungR = lungL.clone();
    lungR.position.x = 0.10;
    this.systemLayers.respiratory.add(lungR);

    this.anatomyGroup.add(this.systemLayers.respiratory);

    // --- 4. DIGESTIVE SYSTEM ---
    this.systemLayers.digestive = new THREE.Group();
    const liver = new THREE.Mesh(new THREE.ConeGeometry(0.12, 0.12, 4), materials.digestive);
    liver.position.set(-0.06, 0.90, 0.06); liver.name = "Liver";
    this.systemLayers.digestive.add(liver);

    const stomach = new THREE.Mesh(new THREE.SphereGeometry(0.068, 12, 12), materials.stomachMat);
    stomach.scale.set(1.3, 0.85, 1.0);
    stomach.position.set(0.08, 0.87, 0.05); stomach.name = "Stomach";
    this.systemLayers.digestive.add(stomach);

    const bowel = new THREE.Mesh(new THREE.TorusGeometry(0.08, 0.024, 8, 16), materials.digestive);
    bowel.position.set(0, 0.74, 0.06); bowel.name = "Small Intestine";
    this.systemLayers.digestive.add(bowel);

    this.anatomyGroup.add(this.systemLayers.digestive);

    // --- 5. NERVOUS SYSTEM ---
    this.systemLayers.nervous = new THREE.Group();
    const brain = new THREE.Mesh(new THREE.SphereGeometry(0.11, 12, 12), materials.nervous);
    brain.position.set(0, 1.54, 0.01); brain.name = "Brain";
    this.systemLayers.nervous.add(brain);

    const nervousCord = new THREE.Mesh(new THREE.CylinderGeometry(0.01, 0.01, 0.7, 8), materials.nervous);
    nervousCord.position.set(0, 1.05, -0.04); nervousCord.name = "Spinal Cord";
    this.systemLayers.nervous.add(nervousCord);

    this.anatomyGroup.add(this.systemLayers.nervous);

    // --- 6. URINARY SYSTEM ---
    this.systemLayers.urinary = new THREE.Group();
    const kidneyL = new THREE.Mesh(new THREE.BoxGeometry(0.035, 0.055, 0.025), materials.urinary);
    kidneyL.position.set(-0.09, 0.86, -0.05); kidneyL.name = "Kidneys";
    this.systemLayers.urinary.add(kidneyL);

    const kidneyR = kidneyL.clone();
    kidneyR.position.x = 0.09;
    this.systemLayers.urinary.add(kidneyR);

    const bladder = new THREE.Mesh(new THREE.SphereGeometry(0.04, 12, 12), materials.urinary);
    bladder.position.set(0, 0.58, 0.05); bladder.name = "Bladder";
    this.systemLayers.urinary.add(bladder);

    this.anatomyGroup.add(this.systemLayers.urinary);

    // --- 7. ENDOCRINE SYSTEM ---
    this.systemLayers.endocrine = new THREE.Group();
    const thyroid = new THREE.Mesh(new THREE.TorusGeometry(0.02, 0.008, 4, 12), materials.endocrine);
    thyroid.position.set(0, 1.34, 0.05); thyroid.name = "Thyroid gland";
    this.systemLayers.endocrine.add(thyroid);

    const pancreas = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.12, 8), materials.endocrine);
    pancreas.position.set(0.03, 0.84, -0.01); pancreas.name = "Pancreas";
    this.systemLayers.endocrine.add(pancreas);

    this.anatomyGroup.add(this.systemLayers.endocrine);


    // --- HOTSPOTS IN THREEJS VIEW ---
    this.hotspotsGroup = new THREE.Group();
    this.scene.add(this.hotspotsGroup);

    const hsGeo = new THREE.SphereGeometry(0.025, 12, 12);
    geometryData.organs.forEach((o) => {
      const sysObj = geometryData.systems.find((s) => s.name === o.system);
      const color = sysObj ? sysObj.glowColor : 0x06b6d4;

      const hsMat = new THREE.MeshBasicMaterial({ color: color, transparent: true, opacity: 0.85 });
      const hs = new THREE.Mesh(hsGeo, hsMat);
      hs.position.set(o.hotspotPosition.x, o.hotspotPosition.y, 0.22);
      hs.renderOrder = 2;
      hs.userData = { id: o.id, name: o.name };
      this.hotspotsGroup.add(hs);
    });

    this.onLayersDisplayReset();
  }

  onLayersDisplayReset() {
    Object.keys(this.systemLayers).forEach((key) => {
      const layer = this.systemLayers[key];
      // Hide old procedural dummy meshes. Uploaded anatomy image is now the body.
      layer.visible = false;
    });

    if (this.hotspotsGroup) {
      this.hotspotsGroup.visible = this.showHotspots;
    }
  }

  bindEvents() {
    window.addEventListener('resize', this.handleResize.bind(this));

    // Reset controls
    document.getElementById('ctrl-reset').addEventListener('click', () => {
      this.selectedSystemId = null;
      this.selectedOrganId = null;
      this.controls.reset();
      this.camera.position.set(0, 1.1, 2.5);
      this.controls.target.set(0, 1.0, 0);
      this.onLayersDisplayReset();
      this.updateInfoPanel();
      document.querySelectorAll('.system-btn').forEach(b => b.classList.remove('active'));
    });

    // Toggle hotspots
    document.getElementById('ctrl-hotspots').addEventListener('click', (e) => {
      this.showHotspots = !this.showHotspots;
      this.onLayersDisplayReset();
      e.currentTarget.classList.toggle('bg-sky-600');
    });

    // Raycast clicking
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    this.renderer.domElement.addEventListener('pointerup', (e) => {
      const rect = this.renderer.domElement.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, this.camera);
      const intersects = raycaster.intersectObjects(this.hotspotsGroup.children);

      if (intersects.length > 0) {
        const clickedHs = intersects[0].object;
        this.selectOrgan(clickedHs.userData.id);
      }
    });

    // Search events
    this.searchBar.addEventListener('input', (e) => {
      const q = e.target.value.toLowerCase().trim();
      if (!q) {
        this.searchDropdown.style.display = 'none';
        return;
      }

      this.searchDropdown.innerHTML = '';
      let matchCount = 0;

      // Systems match
      geometryData.systems.forEach((s) => {
        if (s.name.toLowerCase().includes(q) || s.shortDescription.toLowerCase().includes(q)) {
          const item = document.createElement('div');
          item.className = 'search-result-item';
          item.innerHTML = `<span class="search-result-name">${s.name}</span><span class="search-result-meta">Body System</span>`;
          item.addEventListener('click', () => {
            this.selectSystem(s.id);
            this.searchDropdown.style.display = 'none';
            this.searchBar.value = '';
          });
          this.searchDropdown.appendChild(item);
          matchCount++;
        }
      });

      // Organs match
      geometryData.organs.forEach((o) => {
        if (o.name.toLowerCase().includes(q) || o.function.toLowerCase().includes(q)) {
          const item = document.createElement('div');
          item.className = 'search-result-item';
          item.innerHTML = `<span class="search-result-name">${o.name}</span><span class="search-result-meta">${o.system}</span>`;
          item.addEventListener('click', () => {
            this.selectOrgan(o.id);
            this.searchDropdown.style.display = 'none';
            this.searchBar.value = '';
          });
          this.searchDropdown.appendChild(item);
          matchCount++;
        }
      });

      if (matchCount > 0) {
        this.searchDropdown.style.display = 'block';
      } else {
        this.searchDropdown.innerHTML = '<div class="p-3 text-xs text-slate-400">No topic matches query.</div>';
        this.searchDropdown.style.display = 'block';
      }
    });

    document.addEventListener('click', (e) => {
      if (!e.target.closest('#search-wrapper')) {
        this.searchDropdown.style.display = 'none';
      }
    });
  }

  selectSystem(systemId) {
    this.selectedSystemId = systemId;
    this.selectedOrganId = null;

    // Highlight button in selector panel
    document.querySelectorAll('.system-btn').forEach((b) => {
      b.classList.toggle('active', b.dataset.systemId === systemId);
    });

    this.onLayersDisplayReset();
    this.updateInfoPanel();

    // Zoom camera smoothly
    const system = geometryData.systems.find((s) => s.id === systemId);
    if (system && system.cameraTarget) {
      this.controls.target.set(system.cameraTarget.x, system.cameraTarget.y, 0);
      this.camera.position.set(0, system.cameraTarget.y, system.cameraTarget.z);
    }

    // Scroll viewer into visual path
    document.getElementById('explorer-viewer-section').scrollIntoView({ behavior: 'smooth' });
  }

  selectOrgan(organId) {
    this.selectedOrganId = organId;
    this.selectedSystemId = null;

    const organ = geometryData.organs.find((o) => o.id === organId);
    if (organ) {
      this.updateInfoPanel();

      // Zoom onto physical organ position
      this.controls.target.set(organ.hotspotPosition.x, organ.hotspotPosition.y, organ.hotspotPosition.z);
      this.camera.position.set(0, organ.hotspotPosition.y, 1.1);

      document.getElementById('explorer-viewer-section').scrollIntoView({ behavior: 'smooth' });
    }
  }

  renderSystemMenus() {
    this.systemButtonsContainer.innerHTML = '';
    geometryData.systems.forEach((sys) => {
      const btn = document.createElement('button');
      btn.className = 'system-btn';
      btn.dataset.systemId = sys.id;
      btn.innerHTML = `
        <div class="system-indicator"></div>
        <div class="system-btn-meta">
          <span class="system-btn-name">${sys.name}</span>
          <span class="system-btn-desc">${sys.shortDescription}</span>
        </div>
      `;
      btn.addEventListener('click', () => this.selectSystem(sys.id));
      this.systemButtonsContainer.appendChild(btn);
    });
  }

  renderSystemCards() {
    const grid = document.getElementById('systems-grid-container');
    grid.innerHTML = '';

    geometryData.systems.forEach((sys) => {
      const card = document.createElement('div');
      card.className = 'system-card';
      card.innerHTML = `
        <div class="system-card-icon">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
          </svg>
        </div>
        <h3>${sys.name}</h3>
        <p>${sys.shortDescription}</p>
        <div class="system-card-organs">
          <strong>Key components:</strong> ${sys.organs.join(', ')}
        </div>
        <button class="btn btn-secondary w-full" style="padding:0.5rem 1rem">Core Explorer Mode</button>
      `;
      card.querySelector('button').addEventListener('click', () => {
        this.selectSystem(sys.id);
      });
      grid.appendChild(card);
    });
  }

  renderOrganCards() {
    const grid = document.getElementById('organs-grid-container');
    grid.innerHTML = '';

    geometryData.organs.forEach((o) => {
      const card = document.createElement('div');
      card.className = 'organ-card';
      card.innerHTML = `
        <div class="organ-card-sys">${o.system}</div>
        <h3>${o.name}</h3>
        <p>${o.function}</p>
        <button class="btn btn-primary w-full" style="padding:0.5rem 1rem; font-size:0.8rem">View in 3D Camera</button>
      `;
      card.querySelector('button').addEventListener('click', () => {
        this.selectOrgan(o.id);
      });
      grid.appendChild(card);
    });
  }

  updateInfoPanel() {
    this.rightPanel.innerHTML = '';
    const contentBox = document.createElement('div');
    contentBox.className = 'info-content';

    if (this.selectedOrganId) {
      const o = geometryData.organs.find((org) => org.id === this.selectedOrganId);
      contentBox.innerHTML = `
        <div class="info-header">
          <span class="info-badge">${o.system}</span>
          <h2 class="info-title">${o.name}</h2>
        </div>
        <div>
          <h4 class="fact-title">Location in body</h4>
          <p class="fact-text text-slate-700">${o.location}</p>
        </div>
        <div>
          <h4 class="fact-title">Chemical Structure</h4>
          <p class="fact-text text-slate-700">${o.structure}</p>
        </div>
        <div>
          <h4 class="fact-title">Core Function</h4>
          <p class="fact-text text-slate-700">${o.function}</p>
        </div>
        <div>
          <h4 class="fact-title">Quick Academic Facts</h4>
          <ul class="bullet-list text-slate-700">
            ${o.quickFacts.map((f) => `<li>${f}</li>`).join('')}
          </ul>
        </div>
      `;
    } else {
      const sysId = this.selectedSystemId || 'cardiovascular';
      const s = geometryData.systems.find((sys) => sys.id === sysId);
      contentBox.innerHTML = `
        <div class="info-header">
          <span class="info-badge">Body System</span>
          <h2 class="info-title">${s.name}</h2>
        </div>
        <p class="text-slate-600 text-sm">${s.overview}</p>
        <div>
          <h4 class="fact-title">Physiological Functions</h4>
          <ul class="bullet-list text-slate-700">
            ${s.functions.map((f) => `<li>${f}</li>`).join('')}
          </ul>
        </div>
        <div>
          <h4 class="fact-title">Common Disorders</h4>
          <ul class="bullet-list text-slate-700">
            ${s.commonDisorders.map((d) => `<li>${d}</li>`).join('')}
          </ul>
        </div>
      `;
    }
    this.rightPanel.appendChild(contentBox);
  }

  handleResize() {
    const width = this.canvasContainer.clientWidth;
    const height = this.canvasContainer.clientHeight || 500;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  animate() {
    requestAnimationFrame(this.animate.bind(this));
    const elapsed = this.clock.getElapsedTime();

    // Pulsate interactive indicator points
    if (this.hotspotsGroup) {
      this.hotspotsGroup.children.forEach((hs) => {
        const pulse = 1.0 + Math.sin(elapsed * 4.5 + hs.position.y * 10) * 0.12;
        hs.scale.set(pulse, pulse, pulse);
      });
    }

    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }
}

// Bind names for local access (fallback data format)
const geometryData = window.anatomyData || {};

// Initialize application on content loaded
document.addEventListener('DOMContentLoaded', () => {
  new AnatomyExplorer();
});
