import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { Move3d, RotateCcw, Crosshair, HelpCircle, Maximize2, Minimize2, Activity } from 'lucide-react';
import { anatomyData, OrganData, SystemData } from '../data';

interface ViewerProps {
  selectedSystemId: string | null;
  selectedOrganId: string | null;
  onSelectOrgan: (organId: string) => void;
  onSelectSystem: (systemId: string) => void;
  showHotspots: boolean;
  showLabels: boolean;
  onResetViewer: () => void;
}

export const Anatomy3DViewer: React.FC<ViewerProps> = ({
  selectedSystemId,
  selectedOrganId,
  onSelectOrgan,
  onSelectSystem,
  showHotspots,
  showLabels,
  onResetViewer,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [hoveredOrgan, setHoveredOrgan] = useState<string | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Keep references to access inside useEffect animation loop
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const hotspotsGroupRef = useRef<THREE.Group | null>(null);
  const anatomyGroupRef = useRef<THREE.Group | null>(null);
  const systemLayersRef = useRef<{ [key: string]: THREE.Group }>({});
  const bodySilhouetteRef = useRef<THREE.Mesh | null>(null);

  // Handle Fullscreen toggle
  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => setIsFullscreen(true)).catch(err => console.error(err));
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  // Set up the ThreeJS scene on mount
  useEffect(() => {
    if (!mountRef.current) return;

    setLoading(true);

    // 1. Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0f172a); // Deep modern dark space bg
    scene.fog = new THREE.FogExp2(0x0f172a, 0.15);
    sceneRef.current = scene;

    // 2. Camera setup
    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight || 500;
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 10);
    camera.position.set(0, 1.1, 2.5); // Focus looking closely at torso
    cameraRef.current = camera;

    // 3. Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    mountRef.current.innerHTML = ''; // Clear previous mount
    mountRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 4. OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxPolarAngle = Math.PI * 0.58; // Don't look completely below floor
    controls.minPolarAngle = Math.PI * 0.15;
    controls.minDistance = 0.6;
    controls.maxDistance = 4.2;
    controls.target.set(0, 1.0, 0); // Torso focus target
    controlsRef.current = controls;

    // 5. Lighting
    const ambientLight = new THREE.AmbientLight(0x334155, 1.2);
    scene.add(ambientLight);

    const mainLight = new THREE.DirectionalLight(0x38bdf8, 1.5); // Cool blue key light
    mainLight.position.set(4, 5, 4);
    scene.add(mainLight);

    const rimLight = new THREE.DirectionalLight(0xf43f5e, 1.0); // Warm red rim light from back-left
    rimLight.position.set(-4, 3, -3);
    scene.add(rimLight);

    const floorGrid = new THREE.GridHelper(10, 40, 0x1e293b, 0x0f172a);
    floorGrid.position.y = 0;
    scene.add(floorGrid);

    // --- PROCEDURAL 3D HOLOGRAPHIC ANATOMY GENERATOR ---
    const anatomyGroup = new THREE.Group();
    scene.add(anatomyGroup);
    anatomyGroupRef.current = anatomyGroup;

    // REAL ANATOMY REFERENCE IMAGE BODY
    // This replaces the old procedural dummy body. Hotspots, search, panels,
    // camera controls, system buttons, and organ selection still work.
    const referenceTexture = new THREE.TextureLoader().load('/anatomy-human-body.png');
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
    anatomyGroup.add(referenceBody);

    // Premium 3D-model support: drop an open-license/custom human-body.glb
    // into public/models/human-body.glb and the viewer will load it automatically.
    // If the model is missing, the app keeps the reliable anatomy-image + hotspots fallback.
    const gltfLoader = new GLTFLoader();
    gltfLoader.load(
      '/models/human-body.glb',
      (gltf) => {
        const model = gltf.scene;
        model.name = 'External GLB Human Anatomy Model';
        model.position.set(0, 0.03, 0.02);
        model.scale.setScalar(0.9);
        model.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;
            mesh.castShadow = false;
            mesh.receiveShadow = false;
            mesh.userData.clickable = true;
          }
        });
        referenceBody.visible = false;
        anatomyGroup.add(model);
      },
      undefined,
      () => {
        // Silent fallback: do not break the project if no real GLB is provided.
        referenceBody.visible = true;
      }
    );

    const systemLayers: { [key: string]: THREE.Group } = {};

    // Base glowing materials
    const materials = {
      skin: new THREE.MeshPhysicalMaterial({
        color: 0x38bdf8,
        transparent: true,
        opacity: 0.15,
        wireframe: false,
        roughness: 0.1,
        metalness: 0.1,
        clearcoat: 1.0,
        clearcoatRoughness: 0.1,
        side: THREE.DoubleSide
      }),
      skeleton: new THREE.MeshStandardMaterial({
        color: 0xe2e8f0,
        roughness: 0.4,
        bumpScale: 0.05,
        emissive: 0x475569,
        emissiveIntensity: 0.2
      }),
      nervous: new THREE.MeshBasicMaterial({
        color: 0xf59e0b,
        wireframe: true
      }),
      nerveCord: new THREE.LineBasicMaterial({
        color: 0xf59e0b,
        linewidth: 2
      }),
      cardioRed: new THREE.MeshToonMaterial({
        color: 0xef4444,
        emissive: 0xef4444,
        emissiveIntensity: 0.3
      }),
      cardioBlue: new THREE.MeshToonMaterial({
        color: 0x3b82f6,
        emissive: 0x3b82f6,
        emissiveIntensity: 0.3
      }),
      lungs: new THREE.MeshStandardMaterial({
        color: 0x06b6d4,
        transparent: true,
        opacity: 0.65,
        roughness: 0.2
      }),
      digestive: new THREE.MeshStandardMaterial({
        color: 0x10b981,
        roughness: 0.3,
        emissive: 0x064e3b,
        emissiveIntensity: 0.1
      }),
      stomachMat: new THREE.MeshPhysicalMaterial({
        color: 0x14b8a6,
        roughness: 0.2,
        clearcoat: 0.8
      }),
      urinary: new THREE.MeshStandardMaterial({
        color: 0x818cf8,
        roughness: 0.4
      }),
      endocrine: new THREE.MeshToonMaterial({
        color: 0xec4899,
        emissive: 0xbe185d,
        emissiveIntensity: 0.2
      }),
      reproductive: new THREE.MeshStandardMaterial({
        color: 0xf43f5e,
        roughness: 0.5
      }),
      muscularMat: new THREE.MeshStandardMaterial({
        color: 0xf97316,
        wireframe: true,
        transparent: true,
        opacity: 0.4
      })
    };

    // A. SILHOUETTE BODY (Integumentary)
    const bodyGeometry = new THREE.Group();
    // Head
    const headGeo = new THREE.SphereGeometry(0.16, 24, 24);
    const headMesh = new THREE.Mesh(headGeo, materials.skin);
    headMesh.name = "Skin";
    headMesh.position.set(0, 1.5, 0);
    bodyGeometry.add(headMesh);

    // Neck
    const neckGeo = new THREE.CylinderGeometry(0.06, 0.08, 0.1, 16);
    const neckMesh = new THREE.Mesh(neckGeo, materials.skin);
    neckMesh.name = "Skin";
    neckMesh.position.set(0, 1.32, 0);
    bodyGeometry.add(neckMesh);

    // Torso
    const torsoGeo = new THREE.CylinderGeometry(0.24, 0.18, 0.65, 24);
    const torsoMesh = new THREE.Mesh(torsoGeo, materials.skin);
    torsoMesh.name = "Skin";
    torsoMesh.position.set(0, 0.95, 0);
    bodyGeometry.add(torsoMesh);

    // Hips
    const hipGeo = new THREE.CylinderGeometry(0.18, 0.20, 0.22, 24);
    const hipMesh = new THREE.Mesh(hipGeo, materials.skin);
    hipMesh.name = "Skin";
    hipMesh.position.set(0, 0.54, 0);
    bodyGeometry.add(hipMesh);

    // Left Arm
    const lArmGeo = new THREE.CylinderGeometry(0.065, 0.045, 0.55, 16);
    const lArmMesh = new THREE.Mesh(lArmGeo, materials.skin);
    lArmMesh.name = "Skin";
    lArmMesh.position.set(-0.35, 1.05, 0);
    lArmMesh.rotation.z = Math.PI * 0.1;
    bodyGeometry.add(lArmMesh);

    // Right Arm
    const rArmMesh = lArmMesh.clone();
    rArmMesh.position.x = 0.35;
    rArmMesh.rotation.z = -Math.PI * 0.1;
    bodyGeometry.add(rArmMesh);

    // Left Hand
    const lHandGeo = new THREE.SphereGeometry(0.045, 12, 12);
    const lHandMesh = new THREE.Mesh(lHandGeo, materials.skin);
    lHandMesh.name = "Skin";
    lHandMesh.position.set(-0.48, 0.74, 0);
    bodyGeometry.add(lHandMesh);

    // Right Hand
    const rHandMesh = lHandMesh.clone();
    rHandMesh.position.x = 0.48;
    bodyGeometry.add(rHandMesh);

    // Left Leg
    const lLegGeo = new THREE.CylinderGeometry(0.09, 0.065, 0.95, 16);
    const lLegMesh = new THREE.Mesh(lLegGeo, materials.skin);
    lLegMesh.name = "Skin";
    lLegMesh.position.set(-0.11, 0.48, 0);
    bodyGeometry.add(lLegMesh);

    // Right Leg
    const rLegMesh = lLegMesh.clone();
    rLegMesh.position.x = 0.11;
    bodyGeometry.add(rLegMesh);

    // Consolidated main silhouette group
    const mainBodySilhouette = new THREE.Group();
    mainBodySilhouette.add(bodyGeometry);
    mainBodySilhouette.visible = false; // replaced by uploaded anatomy image
    anatomyGroup.add(mainBodySilhouette);
    bodySilhouetteRef.current = headMesh; // reference skin model

    // --- SYSTEM MODULES ---

    // 1. SKELETAL SYSTEM
    systemLayers.skeletal = new THREE.Group();
    // Skull
    const skullMesh = new THREE.Mesh(new THREE.SphereGeometry(0.14, 16, 16), materials.skeleton);
    skullMesh.position.set(0, 1.5, 0);
    skullMesh.scale.set(1, 1.1, 1.15);
    skullMesh.name = "Bones";
    systemLayers.skeletal.add(skullMesh);

    // Spinal Column
    const spineGroup = new THREE.Group();
    for (let i = 0; i < 24; i++) {
      const vert = new THREE.Mesh(new THREE.BoxGeometry(0.025, 0.015, 0.025), materials.skeleton);
      vert.position.set(0, 0.65 + i * 0.028, -0.04);
      vert.name = "Bones";
      spineGroup.add(vert);
    }
    systemLayers.skeletal.add(spineGroup);

    // Rib cage
    const ribGroup = new THREE.Group();
    for (let i = 0; i < 9; i++) {
      const radius = 0.14 + i * 0.005;
      const ringGeo = new THREE.TorusGeometry(radius, 0.012, 8, 24, Math.PI * 0.85);
      const leftRib = new THREE.Mesh(ringGeo, materials.skeleton);
      leftRib.name = "Bones";
      leftRib.position.set(0, 0.85 + i * 0.042, -0.02);
      leftRib.rotation.set(Math.PI * 0.1, Math.PI, Math.PI * 0.5);
      ribGroup.add(leftRib);

      const rightRib = leftRib.clone();
      rightRib.rotation.set(Math.PI * 0.1, 0, -Math.PI * 0.5);
      ribGroup.add(rightRib);
    }
    systemLayers.skeletal.add(ribGroup);

    // Pelvis bone
    const pelvisMesh = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.12, 0.16), materials.skeleton);
    pelvisMesh.name = "Bones";
    pelvisMesh.position.set(0, 0.56, -0.01);
    systemLayers.skeletal.add(pelvisMesh);

    // Humerus left/right
    const lHumerus = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.012, 0.28), materials.skeleton);
    lHumerus.position.set(-0.32, 1.1, 0);
    lHumerus.rotation.z = Math.PI * 0.08;
    lHumerus.name = "Bones";
    systemLayers.skeletal.add(lHumerus);

    const rHumerus = lHumerus.clone();
    rHumerus.position.x = 0.32;
    rHumerus.rotation.z = -Math.PI * 0.08;
    systemLayers.skeletal.add(rHumerus);

    // Femurs Left/Right
    const lFemur = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.018, 0.44), materials.skeleton);
    lFemur.position.set(-0.11, 0.32, 0);
    lFemur.name = "Bones";
    systemLayers.skeletal.add(lFemur);

    const rFemur = lFemur.clone();
    rFemur.position.x = 0.11;
    systemLayers.skeletal.add(rFemur);

    anatomyGroup.add(systemLayers.skeletal);


    // 2. MUSCULAR SYSTEM
    systemLayers.muscular = new THREE.Group();
    // Glowing stylized wireframe muscles
    const muscTorso = new THREE.Mesh(new THREE.CylinderGeometry(0.20, 0.15, 0.55, 12), materials.muscularMat);
    muscTorso.position.set(0, 0.95, 0.01);
    muscTorso.name = "Muscles";
    systemLayers.muscular.add(muscTorso);

    const muscArmL = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.03, 0.45, 8), materials.muscularMat);
    muscArmL.position.set(-0.31, 1.05, 0);
    muscArmL.rotation.z = Math.PI * 0.08;
    muscArmL.name = "Muscles";
    systemLayers.muscular.add(muscArmL);

    const muscArmR = muscArmL.clone();
    muscArmR.position.x = 0.31;
    muscArmR.rotation.z = -Math.PI * 0.08;
    systemLayers.muscular.add(muscArmR);

    const muscLegL = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.05, 0.75, 10), materials.muscularMat);
    muscLegL.position.set(-0.11, 0.35, 0);
    muscLegL.name = "Muscles";
    systemLayers.muscular.add(muscLegL);

    const muscLegR = muscLegL.clone();
    muscLegR.position.x = 0.11;
    systemLayers.muscular.add(muscLegR);

    anatomyGroup.add(systemLayers.muscular);


    // 3. NERVOUS SYSTEM
    systemLayers.nervous = new THREE.Group();
    // Brain (detailed dome)
    const brainMesh = new THREE.Mesh(new THREE.SphereGeometry(0.12, 16, 16), new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      roughness: 0.2,
      emissive: 0xd97706,
      emissiveIntensity: 0.4
    }));
    brainMesh.position.set(0, 1.54, 0.01);
    brainMesh.scale.set(1.05, 0.9, 1.25);
    brainMesh.name = "Brain";
    systemLayers.nervous.add(brainMesh);

    // Spinal Cord Tube (Nervous)
    const spinalCordMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.01, 0.01, 0.72, 8), new THREE.MeshBasicMaterial({ color: 0xfbbf24 }));
    spinalCordMesh.position.set(0, 1.05, -0.04);
    spinalCordMesh.name = "Spinal Cord";
    systemLayers.nervous.add(spinalCordMesh);

    // Branching fine nerves
    const nerveGroup = new THREE.Group();
    for (let i = 0; i < 14; i++) {
      const points = [];
      const side = i % 2 === 0 ? -1 : 1;
      const yLvl = 1.25 - (i * 0.05);
      points.push(new THREE.Vector3(0, yLvl, -0.04));
      points.push(new THREE.Vector3(side * 0.1, yLvl - 0.02, -0.02));
      points.push(new THREE.Vector3(side * 0.22, yLvl - 0.12, 0.01));

      const spline = new THREE.CatmullRomCurve3(points);
      const nerfLine = new THREE.Line(new THREE.BufferGeometry().setFromPoints(spline.getPoints(10)), materials.nerveCord);
      nerfLine.name = "Nervous System";
      nerveGroup.add(nerfLine);
    }
    systemLayers.nervous.add(nerveGroup);
    anatomyGroup.add(systemLayers.nervous);


    // 4. CARDIOVASCULAR SYSTEM
    systemLayers.cardiovascular = new THREE.Group();
    // Heart shape
    const heartMesh = new THREE.Mesh(new THREE.SphereGeometry(0.065, 16, 16), materials.cardioRed);
    heartMesh.scale.set(1.15, 1.35, 1.05);
    heartMesh.position.set(0.04, 1.14, 0.06);
    heartMesh.name = "Heart";
    systemLayers.cardiovascular.add(heartMesh);

    const aortaSpline = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0.04, 1.15, 0.06),
      new THREE.Vector3(0.04, 1.22, 0.05),
      new THREE.Vector3(0.0, 1.25, 0.02),
      new THREE.Vector3(-0.02, 1.12, -0.02),
      new THREE.Vector3(-0.02, 0.75, -0.03)
    ]);
    const aortaGeo = new THREE.TubeGeometry(aortaSpline, 16, 0.014, 8, false);
    const aortaTube = new THREE.Mesh(aortaGeo, materials.cardioRed);
    aortaTube.name = "Heart";
    systemLayers.cardiovascular.add(aortaTube);

    const venaSpline = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0.07, 0.72, -0.01),
      new THREE.Vector3(0.07, 1.00, 0.0),
      new THREE.Vector3(0.07, 1.14, 0.05),
      new THREE.Vector3(0.06, 1.26, 0.04)
    ]);
    const venaGeo = new THREE.TubeGeometry(venaSpline, 16, 0.012, 8, false);
    const venaTube = new THREE.Mesh(venaGeo, materials.cardioBlue);
    venaTube.name = "Heart";
    systemLayers.cardiovascular.add(venaTube);

    // Branching vessels to arms and legs
    const vessels = new THREE.Group();
    // Left shoulder / arm artery
    const armArteryL = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0.0, 1.25, 0.02),
      new THREE.Vector3(-0.16, 1.24, 0.01),
      new THREE.Vector3(-0.28, 1.12, 0.0)
    ]);
    const lArmArtery = new THREE.Mesh(new THREE.TubeGeometry(armArteryL, 10, 0.006, 6, false), materials.cardioRed);
    lArmArtery.name = "Cardiovascular System";
    vessels.add(lArmArtery);

    // Right arm artery
    const armArteryR = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0.04, 1.24, 0.03),
      new THREE.Vector3(0.16, 1.23, 0.01),
      new THREE.Vector3(0.28, 1.12, 0.0)
    ]);
    const rArmArtery = new THREE.Mesh(new THREE.TubeGeometry(armArteryR, 10, 0.006, 6, false), materials.cardioRed);
    rArmArtery.name = "Cardiovascular System";
    vessels.add(rArmArtery);

    // Left and Right leg arterial branches
    const legArteryL = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.02, 0.75, -0.03),
      new THREE.Vector3(-0.10, 0.62, 0.02),
      new THREE.Vector3(-0.11, 0.32, 0.02)
    ]);
    const lLegArtery = new THREE.Mesh(new THREE.TubeGeometry(legArteryL, 10, 0.007, 6, false), materials.cardioRed);
    lLegArtery.name = "Cardiovascular System";
    vessels.add(lLegArtery);

    const legArteryR = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.02, 0.75, -0.03),
      new THREE.Vector3(0.10, 0.62, 0.02),
      new THREE.Vector3(0.11, 0.32, 0.02)
    ]);
    const rLegArtery = new THREE.Mesh(new THREE.TubeGeometry(legArteryR, 10, 0.007, 6, false), materials.cardioRed);
    rLegArtery.name = "Cardiovascular System";
    vessels.add(rLegArtery);

    systemLayers.cardiovascular.add(vessels);
    anatomyGroup.add(systemLayers.cardiovascular);


    // 5. RESPIRATORY SYSTEM
    systemLayers.respiratory = new THREE.Group();
    // Trachea
    const tracheaMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.18, 12), new THREE.MeshToonMaterial({ color: 0xa5f3fc }));
    tracheaMesh.position.set(0, 1.34, 0.04);
    tracheaMesh.name = "Lungs";
    systemLayers.respiratory.add(tracheaMesh);

    // Left Lung Lobe
    const lungL = new THREE.Mesh(new THREE.SphereGeometry(0.08, 16, 16), materials.lungs);
    lungL.scale.set(1.2, 1.8, 1.0);
    lungL.position.set(-0.10, 1.13, 0.04);
    lungL.name = "Lungs";
    systemLayers.respiratory.add(lungL);

    // Right Lung Lobe (bigger, has 3 lobes)
    const lungR = lungL.clone();
    lungR.scale.set(1.3, 1.8, 1.1);
    lungR.position.set(0.10, 1.13, 0.04);
    lungR.name = "Lungs";
    systemLayers.respiratory.add(lungR);

    anatomyGroup.add(systemLayers.respiratory);


    // 6. DIGESTIVE SYSTEM
    systemLayers.digestive = new THREE.Group();
    // Liver (large triangular prism style)
    const liverGeo = new THREE.ConeGeometry(0.12, 0.12, 4);
    const liverMesh = new THREE.Mesh(liverGeo, materials.digestive);
    liverMesh.name = "Liver";
    liverMesh.position.set(-0.06, 0.90, 0.06);
    liverMesh.rotation.set(0.3, 0.4, -0.6);
    systemLayers.digestive.add(liverMesh);

    // Stomach (expanded capsule/kidney)
    const stomachMesh = new THREE.Mesh(new THREE.SphereGeometry(0.068, 16, 16), materials.stomachMat);
    stomachMesh.scale.set(1.3, 0.85, 1.0);
    stomachMesh.position.set(0.08, 0.87, 0.05);
    stomachMesh.rotation.z = -0.3;
    stomachMesh.name = "Stomach";
    systemLayers.digestive.add(stomachMesh);

    // Small Intestine (winding tube)
    const splinePoints = [];
    for (let i = 0; i < 30; i++) {
      const radius = 0.06;
      const angle = i * 0.85;
      const x = Math.sin(angle) * radius * 1.1;
      const y = 0.74 + Math.sin(i * 0.2) * 0.04;
      const z = Math.cos(angle) * (radius * 0.6) + 0.04;
      splinePoints.push(new THREE.Vector3(x, y, z));
    }
    const bowelCurve = new THREE.CatmullRomCurve3(splinePoints);
    const bowelGeo = new THREE.TubeGeometry(bowelCurve, 64, 0.016, 6, false);
    const bowelMesh = new THREE.Mesh(bowelGeo, new THREE.MeshStandardMaterial({ color: 0x2dd4bf, roughness: 0.8 }));
    bowelMesh.name = "Small Intestine";
    systemLayers.digestive.add(bowelMesh);

    // Large Intestine/Colon outer frame
    const colonPoints = [
      new THREE.Vector3(-0.09, 0.68, 0.04), // start cecum
      new THREE.Vector3(-0.11, 0.78, 0.04), // ascending
      new THREE.Vector3(-0.09, 0.82, 0.04), // trans-bend-left
      new THREE.Vector3(0.09, 0.82, 0.04),  // transverse colon
      new THREE.Vector3(0.11, 0.78, 0.04),  // trans-bend-right
      new THREE.Vector3(0.09, 0.64, 0.04),  // descending
      new THREE.Vector3(0.0, 0.61, 0.02)   // sigmoid / rectum
    ];
    const colonCurve = new THREE.CatmullRomCurve3(colonPoints);
    const colonGeo = new THREE.TubeGeometry(colonCurve, 32, 0.024, 8, false);
    const colonMesh = new THREE.Mesh(colonGeo, materials.digestive);
    colonMesh.name = "Large Intestine";
    systemLayers.digestive.add(colonMesh);

    anatomyGroup.add(systemLayers.digestive);


    // 7. URINARY SYSTEM
    systemLayers.urinary = new THREE.Group();
    // Kidneys
    const kidneyL = new THREE.Mesh(new THREE.BoxGeometry(0.035, 0.055, 0.025), materials.urinary);
    kidneyL.position.set(-0.09, 0.86, -0.05); // tucked behind abdominal digestive
    kidneyL.rotation.y = 0.2;
    kidneyL.name = "Kidneys";
    systemLayers.urinary.add(kidneyL);

    const kidneyR = kidneyL.clone();
    kidneyR.position.x = 0.09;
    kidneyR.rotation.y = -0.2;
    systemLayers.urinary.add(kidneyR);

    // Bladder
    const bladderMesh = new THREE.Mesh(new THREE.SphereGeometry(0.04, 12, 12), materials.urinary);
    bladderMesh.position.set(0, 0.58, 0.05);
    bladderMesh.name = "Bladder";
    systemLayers.urinary.add(bladderMesh);

    // Ureters lines
    const ureterPointsL = [new THREE.Vector3(-0.09, 0.86, -0.05), new THREE.Vector3(-0.05, 0.70, 0.0), new THREE.Vector3(0, 0.58, 0.05)];
    const ureterL = new THREE.Line(
      new THREE.BufferGeometry().setFromPoints(new THREE.CatmullRomCurve3(ureterPointsL).getPoints(10)),
      new THREE.LineBasicMaterial({ color: 0x818cf8, linewidth: 2 })
    );
    ureterL.name = "Urinary System";
    systemLayers.urinary.add(ureterL);

    const ureterPointsR = [new THREE.Vector3(0.09, 0.86, -0.05), new THREE.Vector3(0.05, 0.70, 0.0), new THREE.Vector3(0, 0.58, 0.05)];
    const ureterR = new THREE.Line(
      new THREE.BufferGeometry().setFromPoints(new THREE.CatmullRomCurve3(ureterPointsR).getPoints(10)),
      new THREE.LineBasicMaterial({ color: 0x818cf8, linewidth: 2 })
    );
    ureterR.name = "Urinary System";
    systemLayers.urinary.add(ureterR);

    systemLayers.urinary.name = "Urinary Layer";
    anatomyGroup.add(systemLayers.urinary);


    // 8. ENDOCRINE SYSTEM
    systemLayers.endocrine = new THREE.Group();
    // Thyroid gland
    const thyroidMesh = new THREE.Mesh(new THREE.TorusGeometry(0.024, 0.009, 6, 12, Math.PI * 1.5), materials.endocrine);
    thyroidMesh.name = "Thyroid gland";
    thyroidMesh.position.set(0, 1.34, 0.05);
    thyroidMesh.rotation.set(Math.PI * 0.5, 0, Math.PI);
    systemLayers.endocrine.add(thyroidMesh);

    // Pancreas (flat horizontal cylinder behind stomach)
    const pancreasMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.12, 8), materials.endocrine);
    pancreasMesh.rotation.z = Math.PI * 0.45;
    pancreasMesh.position.set(0.03, 0.84, -0.01);
    pancreasMesh.name = "Pancreas";
    systemLayers.endocrine.add(pancreasMesh);

    anatomyGroup.add(systemLayers.endocrine);


    // 9. REPRODUCTIVE SYSTEM
    systemLayers.reproductive = new THREE.Group();
    // Male organs
    const maleRepro = new THREE.Mesh(new THREE.SphereGeometry(0.035, 12, 12), materials.reproductive);
    maleRepro.position.set(0, 0.52, 0.08);
    maleRepro.name = "Male reproductive organs";
    systemLayers.reproductive.add(maleRepro);

    // Female organs
    const femaleRepro = new THREE.Mesh(new THREE.SphereGeometry(0.04, 12, 12), materials.reproductive);
    femaleRepro.position.set(0, 0.52, 0.04);
    femaleRepro.name = "Female reproductive organs";
    systemLayers.reproductive.add(femaleRepro);

    anatomyGroup.add(systemLayers.reproductive);


    // Save layers reference
    systemLayersRef.current = systemLayers;


    // --- 3D INTERACTIVE CLICKABLE HOTSPOTS (SPHERES) ---
    const hotspotsGroup = new THREE.Group();
    scene.add(hotspotsGroup);
    hotspotsGroupRef.current = hotspotsGroup;

    // Create glowing physical 3D marker spheres for each organ
    const hotspotGeo = new THREE.SphereGeometry(0.025, 16, 16);

    anatomyData.organs.forEach((organ) => {
      // Find suitable visual color from the system color
      const system = anatomyData.systems.find((s) => s.name === organ.system);
      const colorHex = system ? system.glowColor : 0x06b6d4;

      const markerMat = new THREE.MeshPhysicalMaterial({
        color: colorHex,
        emissive: colorHex,
        emissiveIntensity: 1.5,
        transparent: true,
        opacity: 0.85,
        roughness: 0,
        metalness: 0
      });

      const hotspot = new THREE.Mesh(hotspotGeo, markerMat);
      // Keep hotspots in front of the reference anatomy image so they remain clickable.
      hotspot.position.set(organ.hotspotPosition.x, organ.hotspotPosition.y, 0.22);
      hotspot.renderOrder = 2;
      // Attach organ metadata of the mesh to detect on Raycast
      hotspot.userData = { organId: organ.id, organName: organ.name };
      hotspot.name = "Hotspot_" + organ.id;

      hotspotsGroup.add(hotspot);
    });

    setLoading(false);


    // --- INTERACTIVE RAYCASTING FOR DETECTING CLICKS AND HOVERS ---
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handlePointerMove = (event: PointerEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      // Calculate normal pointer coordinates
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      // Cast Ray
      raycaster.setFromCamera(mouse, camera);

      // We intersect both hotspots and system group meshes
      const hotspotsToInter = hotspotsGroup.children;
      const partsToInter: THREE.Object3D[] = [];

      // Consolidate actual visible components to click
      Object.keys(systemLayers).forEach((sysKey) => {
        const sysGroup = systemLayers[sysKey];
        if (sysGroup.visible) {
          partsToInter.push(...sysGroup.children);
        }
      });

      const intersectsHotspots = raycaster.intersectObjects(hotspotsToInter);
      const intersectsElements = raycaster.intersectObjects(partsToInter, true);

      if (intersectsHotspots.length > 0) {
        // Hovering a Hotspot
        const target = intersectsHotspots[0].object;
        setHoveredOrgan(target.userData.organName);
        setTooltipPos({ x: event.clientX, y: event.clientY });
        document.body.style.cursor = 'pointer';
      } else if (intersectsElements.length > 0) {
        // Hovering an actual organ geometry
        let node: THREE.Object3D | null = intersectsElements[0].object;
        let foundName = "";
        while (node && node !== scene) {
          if (node.name && node.name !== "Bones" && node.name !== "Muscles" && node.name !== "Skin" && node.name !== "Cardiovascular System" && node.name !== "Nervous System" && node.name !== "Urinary System") {
            foundName = node.name;
            break;
          }
          node = node.parent;
        }

        if (foundName) {
          setHoveredOrgan(foundName);
          setTooltipPos({ x: event.clientX, y: event.clientY });
          document.body.style.cursor = 'pointer';
        } else {
          setHoveredOrgan(null);
          document.body.style.cursor = 'default';
        }
      } else {
        setHoveredOrgan(null);
        document.body.style.cursor = 'default';
      }
    };

    const handlePointerUp = (event: PointerEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);

      const intersectsHotspots = raycaster.intersectObjects(hotspotsGroup.children);
      const partsToInter: THREE.Object3D[] = [];
      Object.keys(systemLayers).forEach((sysKey) => {
        const sysGroup = systemLayers[sysKey];
        if (sysGroup.visible) {
          partsToInter.push(...sysGroup.children);
        }
      });
      const intersectsElements = raycaster.intersectObjects(partsToInter, true);

      if (intersectsHotspots.length > 0) {
        const clickedHotspot = intersectsHotspots[0].object;
        onSelectOrgan(clickedHotspot.userData.organId);
      } else if (intersectsElements.length > 0) {
        let node: THREE.Object3D | null = intersectsElements[0].object;
        let organName = "";
        while (node && node !== scene) {
          if (node.name && node.name !== "Bones" && node.name !== "Muscles" && node.name !== "Skin" && node.name !== "Cardiovascular System") {
            organName = node.name;
            break;
          }
          node = node.parent;
        }

        if (organName) {
          // Map mesh name to actual organ ID inside database
          const oRecord = anatomyData.organs.find((o) => o.name.toLowerCase() === organName.toLowerCase() || o.id.replace('-', '') === organName.toLowerCase().replace(' ', ''));
          if (oRecord) {
            onSelectOrgan(oRecord.id);
          }
        }
      }
    };

    renderer.domElement.addEventListener('pointermove', handlePointerMove);
    renderer.domElement.addEventListener('pointerup', handlePointerUp);


    // --- ANIMATION / RENDER LOOP ---
    let frameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      frameId = requestAnimationFrame(animate);

      const elapsed = clock.getElapsedTime();

      // Pulsate floating organ hotspots for attention
      if (hotspotsGroup) {
        hotspotsGroup.children.forEach((hotspot) => {
          const pulsate = 1.0 + Math.sin(elapsed * 4.5 + hotspot.position.y * 10) * 0.15;
          hotspot.scale.set(pulsate, pulsate, pulsate);
        });
      }

      // Keep the uploaded anatomy reference image facing the viewer.
      // The user can still zoom/pan/orbit with controls, but the dummy body is no longer shown.
      if (anatomyGroup) {
        anatomyGroup.rotation.y = 0;
      }

      controls.update();
      renderer.render(scene, camera);
    };

    animate();


    // --- RESPONSIVE LAYOUT RESIZER ---
    const resizeObserver = new ResizeObserver((entries) => {
      if (!entries || entries.length === 0) return;
      const entry = entries[0];
      const w = entry.contentRect.width || mountRef.current?.clientWidth || 300;
      const h = entry.contentRect.height || mountRef.current?.clientHeight || 500;

      if (cameraRef.current && rendererRef.current) {
        cameraRef.current.aspect = w / h;
        cameraRef.current.updateProjectionMatrix();
        rendererRef.current.setSize(w, h);
      }
    });

    if (mountRef.current) {
      resizeObserver.observe(mountRef.current);
    }

    // CLEANUP DESTRUCTION
    return () => {
      cancelAnimationFrame(frameId);
      if (rendererRef.current && rendererRef.current.domElement) {
        rendererRef.current.domElement.removeEventListener('pointermove', handlePointerMove);
        rendererRef.current.domElement.removeEventListener('pointerup', handlePointerUp);
      }
      resizeObserver.disconnect();
      controls.dispose();
      renderer.dispose();
      // Dispose materials/geometry recursively
      scene.traverse((obj) => {
        if (obj instanceof THREE.Mesh) {
          obj.geometry.dispose();
          if (Array.isArray(obj.material)) {
            obj.material.forEach((m) => m.dispose());
          } else {
            obj.material.dispose();
          }
        }
      });
    };
  }, []);


  // --- SYNC REACT STATES TO THREEJS MODEL VISIBILITY ---
  useEffect(() => {
    // 1. Toggle visibility of individual system layers
    Object.keys(systemLayersRef.current).forEach((sysKey) => {
      const layer = systemLayersRef.current[sysKey];
      if (!layer) return;

      // Hide old procedural dummy meshes. The uploaded anatomy image is now the body.
      // Functions remain active through system buttons, hotspots, search, and info panel.
      layer.visible = false;
    });

    // Handle high priority override for active organ's system
    if (selectedOrganId && selectedSystemId === null) {
      const organ = anatomyData.organs.find((o) => o.id === selectedOrganId);
      if (organ) {
        const matchingSys = anatomyData.systems.find((s) => s.name === organ.system);
        if (matchingSys) {
          Object.keys(systemLayersRef.current).forEach((key) => {
            if (systemLayersRef.current[key]) {
              systemLayersRef.current[key].visible = false;
            }
          });
        }
      }
    }

    // 2. Pulse or emphasize active organ hotspot
    if (hotspotsGroupRef.current) {
      hotspotsGroupRef.current.children.forEach((hs: any) => {
        if (selectedOrganId && hs.userData.organId === selectedOrganId) {
          hs.material.emissiveIntensity = 3.5;
          hs.scale.set(1.5, 1.5, 1.5);
        } else {
          hs.material.emissiveIntensity = 1.2;
        }
      });
    }

    // 3. Move camera to target smoothly based on system/organ focus bounds
    if (cameraRef.current && controlsRef.current) {
      let targetPos = new THREE.Vector3(0, 1.0, 0);
      let targetCamZ = 2.4;

      if (selectedOrganId) {
        const organ = anatomyData.organs.find((o) => o.id === selectedOrganId);
        if (organ) {
          targetPos.set(organ.hotspotPosition.x, organ.hotspotPosition.y, organ.hotspotPosition.z);
          targetCamZ = 1.0;
        }
      } else if (selectedSystemId) {
        const sys = anatomyData.systems.find((s) => s.id === selectedSystemId);
        if (sys) {
          targetPos.set(sys.cameraTarget.x, sys.cameraTarget.y, sys.cameraTarget.z - 1.2);
          targetCamZ = sys.cameraTarget.z;
        }
      }

      // Perform a smooth vector interpolation toward the selected point
      const cam = cameraRef.current;
      const ctrl = controlsRef.current;

      const animateTransition = () => {
        const speed = 0.08;
        ctrl.target.lerp(targetPos, speed);
        cam.position.z = THREE.MathUtils.lerp(cam.position.z, targetCamZ, speed);
        if (Math.abs(cam.position.z - targetCamZ) > 0.01) {
          requestAnimationFrame(animateTransition);
        }
      };
      animateTransition();
    }
  }, [selectedSystemId, selectedOrganId]);


  // Synchronize Toggle Hotspots visibility
  useEffect(() => {
    if (hotspotsGroupRef.current) {
      hotspotsGroupRef.current.visible = showHotspots;
    }
  }, [showHotspots]);

  return (
    <div
      ref={containerRef}
      id="3d-anatomy-canvas-container"
      className="relative w-full h-[500px] md:h-[600px] bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-slate-800 transition-all duration-300"
    >
      {/* Dynamic 3D canvas viewport */}
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Hover Tooltip Box */}
      {hoveredOrgan && showLabels && (
        <div
          style={{
            position: 'fixed',
            left: `${tooltipPos.x + 15}px`,
            top: `${tooltipPos.y - 15}px`,
            pointerEvents: 'none',
          }}
          className="z-50 bg-slate-950/95 text-white px-3 py-1.5 rounded-xl text-xs font-medium border border-cyan-500/30 shadow-lg shadow-cyan-950/20 flex items-center gap-1.5 backdrop-blur-md animate-fade-in"
        >
          <Activity className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
          <span>{hoveredOrgan}</span>
        </div>
      )}

      {/* Loading state spinner */}
      {loading && (
        <div className="absolute inset-0 bg-slate-950/90 flex flex-col items-center justify-center gap-4 text-slate-300 z-10">
          <div className="relative flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
            <Activity className="w-5 h-5 text-cyan-400 absolute animate-pulse" />
          </div>
          <div className="text-center">
            <h3 className="font-semibold text-lg text-white">AnatoVerse Core Eng</h3>
            <p className="text-xs text-slate-400 mt-1">Bootloading 3D Holographic Model Environment...</p>
          </div>
        </div>
      )}

      {/* Ambient Sci-fi HUD overlay overlaying canvas */}
      <div className="absolute top-4 left-4 pointer-events-none select-none">
        <div className="bg-slate-950/70 border border-slate-800 backdrop-blur-md px-3 py-2 rounded-2xl flex flex-col gap-0.5">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
            <span className="text-[10px] font-mono tracking-widest text-cyan-400 font-bold uppercase">ANATOMY IMAGE ENGINE v3.0</span>
          </div>
          <span className="text-sm font-semibold text-white tracking-wide">
            {selectedSystemId
              ? anatomyData.systems.find((s) => s.id === selectedSystemId)?.name
              : selectedOrganId
              ? anatomyData.organs.find((o) => o.id === selectedOrganId)?.system
              : "Uploaded Anatomy Body"}
          </span>
          {selectedOrganId && (
            <span className="text-xs text-cyan-300 transform animate-pulse">
              Focused → {anatomyData.organs.find((o) => o.id === selectedOrganId)?.name}
            </span>
          )}
        </div>
      </div>

      {/* Viewer Floating control panel bar */}
      <div className="absolute bottom-4 right-4 flex items-center gap-2">
        <button
          onClick={onResetViewer}
          title="Reset Camera Target"
          className="p-3 bg-slate-950/80 border border-slate-800 text-slate-300 hover:text-white rounded-2xl hover:bg-slate-900 transition-all shadow-md focus:outline-hidden"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
        <button
          onClick={toggleFullscreen}
          title="Toggle Fullscreen Canvas"
          className="p-3 bg-slate-950/80 border border-slate-800 text-slate-300 hover:text-white rounded-2xl hover:bg-slate-900 transition-all shadow-md focus:outline-hidden"
        >
          {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
        </button>
      </div>

      {/* Drag instructions */}
      <div className="absolute bottom-4 left-4 pointer-events-none select-none">
        <div className="bg-slate-950/55 backdrop-blur-xs px-2.5 py-1.5 rounded-xl text-[10px] font-mono text-slate-400 flex items-center gap-1.5 border border-slate-800/45">
          <Move3d className="w-3.5 h-3.5 text-cyan-500" />
          <span>DRAG TO ROTATE  •  PINCH/SCROLL TO ZOOM</span>
        </div>
      </div>
    </div>
  );
};
