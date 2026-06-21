import React, { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { ArrowLeft, BookOpen, Dna, Eye, Layers, MapPin, RotateCcw, Search, X } from 'lucide-react';
import { anatomyData, OrganData } from '../data';

type MarkerPoint = {
  id: string;
  name: string;
  position: [number, number, number];
  color: string;
  placement: string;
};

type ScreenLabel = {
  id: string;
  x: number;
  y: number;
  visible: boolean;
};

interface AdvancedAnatomyViewerProps {
  initialOrganId?: string | null;
  initialSystemId?: string | null;
  onBack: () => void;
}

// Positions are mapped to the imported human_body.glb coordinate system used by the Three.js viewer.
// X = front/back depth, Y = vertical body axis, Z = left/right body side.
const markerPositions: Record<string, Omit<MarkerPoint, 'name'>> = {
  brain: {
    id: 'brain',
    position: [0.062, 0.432, 0.0],
    color: '#8b5cf6',
    placement: 'inside the cranial cavity, centered above the eyes within the skull',
  },
  'spinal-cord': {
    id: 'spinal-cord',
    position: [-0.076, 0.145, 0.0],
    color: '#7c3aed',
    placement: 'posterior midline running inside the vertebral canal',
  },
  heart: {
    id: 'heart',
    position: [0.098, 0.172, -0.025],
    color: '#ef4444',
    placement: 'middle of the chest, slightly toward the anatomical left side between both lungs',
  },
  lungs: {
    id: 'lungs',
    position: [0.098, 0.198, 0.0],
    color: '#22c55e',
    placement: 'left and right thoracic cavity surrounding the heart',
  },
  liver: {
    id: 'liver',
    position: [0.101, 0.064, 0.052],
    color: '#a855f7',
    placement: 'upper right abdomen just below the diaphragm and ribs',
  },
  stomach: {
    id: 'stomach',
    position: [0.101, 0.055, -0.048],
    color: '#f97316',
    placement: 'upper left abdomen under the left rib cage',
  },
  pancreas: {
    id: 'pancreas',
    position: [0.104, 0.044, -0.012],
    color: '#eab308',
    placement: 'deep upper abdomen, running horizontally behind the stomach above the small intestine',
  },
  'small-intestine': {
    id: 'small-intestine',
    position: [0.106, -0.024, 0.0],
    color: '#84cc16',
    placement: 'central abdomen below the stomach, filling the middle intestinal loops around the navel',
  },
  'large-intestine': {
    id: 'large-intestine',
    position: [0.108, -0.061, 0.0],
    color: '#14b8a6',
    placement: 'outer abdominal frame around the small intestine, descending toward the lower abdomen',
  },
  kidneys: {
    id: 'kidneys',
    position: [0.082, 0.026, 0.072],
    color: '#06b6d4',
    placement: 'posterior upper abdomen on both sides of the spine, shown from the side flank so the pin remains visible',
  },
  bladder: {
    id: 'bladder',
    position: [0.106, -0.138, 0.0],
    color: '#0ea5e9',
    placement: 'midline pelvic cavity just behind the pubic bone, below the intestines',
  },
  thyroid: {
    id: 'thyroid',
    position: [0.103, 0.292, 0.0],
    color: '#f59e0b',
    placement: 'front of the lower neck wrapped around the trachea',
  },
  skin: {
    id: 'skin',
    position: [0.111, 0.118, 0.116],
    color: '#fb7185',
    placement: 'outer body surface on the lateral torso',
  },
  bones: {
    id: 'bones',
    position: [0.089, -0.252, -0.045],
    color: '#64748b',
    placement: 'inside the thigh bone region of the skeletal frame',
  },
  muscles: {
    id: 'muscles',
    position: [0.112, 0.126, -0.098],
    color: '#f43f5e',
    placement: 'front/lateral skeletal muscle layer of the upper torso and arm',
  },
  'male-reproductive': {
    id: 'male-reproductive',
    position: [0.110, -0.174, 0.0],
    color: '#6366f1',
    placement: 'central external groin/pubic region below the bladder, not on the thigh',
  },
  'female-reproductive': {
    id: 'female-reproductive',
    position: [0.104, -0.118, 0.0],
    color: '#ec4899',
    placement: 'deep central pelvic cavity between the hip bones, above the bladder and below the intestines',
  },
};


const markerLabelOffsets: Record<string, { dx: number; dy: number; side: 'left' | 'right' }> = {
  brain: { dx: 16, dy: -16, side: 'right' },
  'spinal-cord': { dx: 18, dy: 8, side: 'right' },
  heart: { dx: 18, dy: 12, side: 'right' },
  lungs: { dx: 18, dy: -8, side: 'right' },
  liver: { dx: -14, dy: -10, side: 'left' },
  stomach: { dx: 18, dy: -4, side: 'right' },
  pancreas: { dx: 18, dy: 14, side: 'right' },
  'small-intestine': { dx: 18, dy: -14, side: 'right' },
  'large-intestine': { dx: 18, dy: 12, side: 'right' },
  kidneys: { dx: -14, dy: 6, side: 'left' },
  bladder: { dx: 18, dy: -2, side: 'right' },
  thyroid: { dx: 18, dy: 0, side: 'right' },
  skin: { dx: -14, dy: 0, side: 'left' },
  bones: { dx: 18, dy: 14, side: 'right' },
  muscles: { dx: 18, dy: 0, side: 'right' },
  'male-reproductive': { dx: 18, dy: 14, side: 'right' },
  'female-reproductive': { dx: -14, dy: -12, side: 'left' },
};

const getReadableSystemId = (systemName: string) => {
  const found = anatomyData.systems.find((sys) => sys.name === systemName);
  return found?.id || 'all';
};

const getFirstOrganIdForSystem = (systemId?: string | null) => {
  if (!systemId || systemId === 'all') return null;
  return anatomyData.organs.find((organ) => markerPositions[organ.id] && getReadableSystemId(organ.system) === systemId)?.id || null;
};

export const AdvancedAnatomyViewer: React.FC<AdvancedAnatomyViewerProps> = ({
  initialOrganId,
  initialSystemId,
  onBack,
}) => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const markerMeshesRef = useRef<Map<string, THREE.Mesh<THREE.SphereGeometry, THREE.MeshStandardMaterial>>>(new Map());
  const bodyGroupRef = useRef<THREE.Group | null>(null);
  const selectedOrganIdRef = useRef<string>('');
  const hoveredOrganIdRef = useRef<string | null>(null);
  const filteredIdsRef = useRef<Set<string>>(new Set());
  const showOrgansRef = useRef(true);
  const detailsPanelRef = useRef<HTMLElement | null>(null);

  const organMarkers = useMemo<MarkerPoint[]>(() => {
    return anatomyData.organs
      .filter((organ) => markerPositions[organ.id])
      .map((organ) => ({
        ...markerPositions[organ.id],
        name: organ.name,
      }));
  }, []);

  const firstValidOrganId = organMarkers[0]?.id || 'heart';
  const firstOrganForInitialSystem = getFirstOrganIdForSystem(initialSystemId);
  const [selectedOrganId, setSelectedOrganId] = useState<string>(initialOrganId || firstOrganForInitialSystem || firstValidOrganId);
  const [activeSystemId, setActiveSystemId] = useState<string>(initialSystemId || 'all');
  const [searchQuery, setSearchQuery] = useState('');
  const [labels, setLabels] = useState<ScreenLabel[]>([]);
  const [hoveredOrganId, setHoveredOrganId] = useState<string | null>(null);
  const [loadingModel, setLoadingModel] = useState(true);
  const [modelError, setModelError] = useState<string | null>(null);
  const [showLabels, setShowLabels] = useState(() => (typeof window !== 'undefined' ? window.innerWidth >= 768 : true));
  const [showOrgans, setShowOrgans] = useState(true);

  useEffect(() => {
    if (initialOrganId && markerPositions[initialOrganId]) {
      setSelectedOrganId(initialOrganId);
    } else {
      const firstOrganForSystem = getFirstOrganIdForSystem(initialSystemId);
      if (firstOrganForSystem) setSelectedOrganId(firstOrganForSystem);
    }
    if (initialSystemId) {
      setActiveSystemId(initialSystemId);
    }
  }, [initialOrganId, initialSystemId]);

  const selectedOrgan = useMemo<OrganData | undefined>(() => {
    return anatomyData.organs.find((organ) => organ.id === selectedOrganId);
  }, [selectedOrganId]);

  const selectedMarker = selectedOrganId ? markerPositions[selectedOrganId] : null;

  const filteredMarkers = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return organMarkers.filter((marker) => {
      const organ = anatomyData.organs.find((entry) => entry.id === marker.id);
      const matchesSystem = activeSystemId === 'all' || (organ && getReadableSystemId(organ.system) === activeSystemId);
      const matchesSearch = !query || marker.name.toLowerCase().includes(query) || organ?.system.toLowerCase().includes(query);
      return matchesSystem && matchesSearch;
    });
  }, [activeSystemId, organMarkers, searchQuery]);



  useEffect(() => {
    selectedOrganIdRef.current = selectedOrganId;
  }, [selectedOrganId]);

  useEffect(() => {
    hoveredOrganIdRef.current = hoveredOrganId;
  }, [hoveredOrganId]);

  useEffect(() => {
    filteredIdsRef.current = new Set(filteredMarkers.map((marker) => marker.id));
  }, [filteredMarkers]);

  useEffect(() => {
    showOrgansRef.current = showOrgans;
  }, [showOrgans]);

  const focusMarker = (id: string) => {
    const marker = markerMeshesRef.current.get(id);
    const camera = cameraRef.current;
    const controls = controlsRef.current;
    if (!marker || !camera || !controls) return;

    const worldPosition = new THREE.Vector3();
    marker.getWorldPosition(worldPosition);
    controls.target.copy(worldPosition);
    camera.position.set(worldPosition.x + 0.55, worldPosition.y + 0.12, worldPosition.z + 2.7);
    controls.update();
  };

  const resetCamera = () => {
    const camera = cameraRef.current;
    const controls = controlsRef.current;
    if (!camera || !controls) return;
    camera.position.set(0, 0.04, 3.65);
    controls.target.set(0, 0.03, 0);
    controls.update();
  };

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#020617');
    scene.fog = new THREE.Fog('#020617', 2.8, 7.5);

    const isMobileViewport = window.innerWidth < 768;
    const camera = new THREE.PerspectiveCamera(isMobileViewport ? 44 : 38, mount.clientWidth / mount.clientHeight, 0.01, 100);
    camera.position.set(0, 0.04, 3.65);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobileViewport ? 1.25 : 2));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.style.touchAction = 'none';
    mount.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.enablePan = false;
    controls.minDistance = 2.2;
    controls.maxDistance = 6.0;
    controls.target.set(0, 0.03, 0);
    controlsRef.current = controls;

    const hemiLight = new THREE.HemisphereLight('#e0f2fe', '#0f172a', 1.35);
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight('#ffffff', 3.2);
    keyLight.position.set(2.5, 3.0, 2.7);
    keyLight.castShadow = true;
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight('#38bdf8', 2.5);
    rimLight.position.set(-2.8, 1.7, -2.2);
    scene.add(rimLight);

    const floor = new THREE.Mesh(
      new THREE.CircleGeometry(1.35, 96),
      new THREE.MeshBasicMaterial({ color: '#083344', transparent: true, opacity: 0.26 })
    );
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -1.22;
    scene.add(floor);

    const bodyGroup = new THREE.Group();
    bodyGroup.position.set(0, 0.02, 0);
    bodyGroup.scale.setScalar(2.35);
    bodyGroupRef.current = bodyGroup;
    scene.add(bodyGroup);

    const modelWrapper = new THREE.Group();
    modelWrapper.rotation.y = -Math.PI / 2;
    bodyGroup.add(modelWrapper);

    const loader = new GLTFLoader();
    loader.load(
      '/models/human-body.glb',
      (gltf) => {
        const model = gltf.scene;
        model.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;
            mesh.castShadow = true;
            mesh.receiveShadow = true;
            mesh.material = new THREE.MeshStandardMaterial({
              color: '#e8e0d5',
              roughness: 0.52,
              metalness: 0.04,
              transparent: true,
              opacity: 0.96,
            });
          }
        });
        modelWrapper.add(model);
        setLoadingModel(false);
      },
      undefined,
      () => {
        setModelError('The GLB model could not be loaded from /models/human-body.glb.');
        setLoadingModel(false);
      }
    );

    const markerGroup = new THREE.Group();
    modelWrapper.add(markerGroup);

    const markerMeshes = new Map<string, THREE.Mesh<THREE.SphereGeometry, THREE.MeshStandardMaterial>>();
    organMarkers.forEach((marker) => {
      const material = new THREE.MeshStandardMaterial({
        color: marker.color,
        emissive: marker.color,
        emissiveIntensity: 0.9,
        roughness: 0.24,
        metalness: 0.12,
      });
      const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.016, 32, 32), material);
      sphere.position.set(marker.position[0], marker.position[1], marker.position[2]);
      sphere.userData.organId = marker.id;
      markerGroup.add(sphere);

      const halo = new THREE.Mesh(
        new THREE.SphereGeometry(0.030, 32, 32),
        new THREE.MeshBasicMaterial({ color: marker.color, transparent: true, opacity: 0.17, depthWrite: false })
      );
      halo.name = `${marker.id}-halo`;
      sphere.add(halo);
      markerMeshes.set(marker.id, sphere);
    });
    markerMeshesRef.current = markerMeshes;

    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();

    const setPointerFromEvent = (event: PointerEvent) => {
      const bounds = renderer.domElement.getBoundingClientRect();
      pointer.x = ((event.clientX - bounds.left) / bounds.width) * 2 - 1;
      pointer.y = -((event.clientY - bounds.top) / bounds.height) * 2 + 1;
    };

    const handlePointerMove = (event: PointerEvent) => {
      setPointerFromEvent(event);
      raycaster.setFromCamera(pointer, camera);
      const hits = raycaster.intersectObjects(Array.from(markerMeshesRef.current.values()), false);
      const hitId = hits[0]?.object.userData.organId as string | undefined;
      setHoveredOrganId(hitId || null);
      renderer.domElement.style.cursor = hitId ? 'pointer' : 'grab';
    };

    const handlePointerDown = (event: PointerEvent) => {
      setPointerFromEvent(event);
      raycaster.setFromCamera(pointer, camera);
      const hits = raycaster.intersectObjects(Array.from(markerMeshesRef.current.values()), false);
      const hitId = hits[0]?.object.userData.organId as string | undefined;
      if (hitId) {
        setSelectedOrganId(hitId);
        const organ = anatomyData.organs.find((entry) => entry.id === hitId);
        if (organ) setActiveSystemId(getReadableSystemId(organ.system));
        window.history.replaceState(null, '', `#/advanced-3d-viewer?organ=${encodeURIComponent(hitId)}`);
      }
    };

    renderer.domElement.addEventListener('pointermove', handlePointerMove);
    renderer.domElement.addEventListener('pointerdown', handlePointerDown);

    let frameId = 0;
    let frameCount = 0;
    const screenPosition = new THREE.Vector3();

    const animate = () => {
      frameId = requestAnimationFrame(animate);
      frameCount += 1;
      controls.update();
      markerMeshesRef.current.forEach((mesh, id) => {
        const material = mesh.material;
        const isActive = id === selectedOrganIdRef.current;
        const isHovered = id === hoveredOrganIdRef.current;
        const isFiltered = filteredIdsRef.current.has(id);
        mesh.visible = showOrgansRef.current && isFiltered;
        mesh.scale.setScalar(isActive ? 1.85 : isHovered ? 1.45 : 1);
        material.emissiveIntensity = isActive ? 1.55 : isHovered ? 1.22 : 0.85;
      });

      if (frameCount % 3 === 0) {
        const nextLabels: ScreenLabel[] = [];
        markerMeshesRef.current.forEach((mesh, id) => {
          if (!mesh.visible) return;
          mesh.getWorldPosition(screenPosition);
          screenPosition.project(camera);
                const visible = screenPosition.z < 1 && screenPosition.x > -1.15 && screenPosition.x < 1.15 && screenPosition.y > -1.15 && screenPosition.y < 1.15;
          nextLabels.push({
            id,
            x: (screenPosition.x * 0.5 + 0.5) * mount.clientWidth,
            y: (-screenPosition.y * 0.5 + 0.5) * mount.clientHeight,
            visible,
          });
        });
        setLabels(nextLabels);
      }

      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!mount) return;
      camera.aspect = mount.clientWidth / mount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mount.clientWidth, mount.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('resize', handleResize);
      renderer.domElement.removeEventListener('pointermove', handlePointerMove);
      renderer.domElement.removeEventListener('pointerdown', handlePointerDown);
      controls.dispose();
      renderer.dispose();
      markerMeshesRef.current.clear();
      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, [organMarkers]);

  const selectOrgan = (organId: string) => {
    setSelectedOrganId(organId);
    const organ = anatomyData.organs.find((entry) => entry.id === organId);
    if (organ) setActiveSystemId(getReadableSystemId(organ.system));
    window.history.replaceState(null, '', `#/advanced-3d-viewer?organ=${encodeURIComponent(organId)}`);

    if (typeof window !== 'undefined' && window.innerWidth < 1280) {
      window.setTimeout(() => {
        detailsPanelRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 120);
    }
  };

  const activeMarkerInfo = selectedOrganId ? markerPositions[selectedOrganId] : null;

  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-x-hidden">
      <header className="h-16 border-b border-cyan-400/15 bg-slate-950/90 backdrop-blur flex items-center justify-between px-4 md:px-8 sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="w-10 h-10 rounded-2xl bg-white/5 hover:bg-cyan-500/20 border border-white/10 flex items-center justify-center transition-colors"
            aria-label="Back to main AnatoVerse website"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="w-10 h-10 rounded-2xl bg-cyan-400/10 border border-cyan-300/20 flex items-center justify-center text-cyan-300">
            <Dna className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-black tracking-tight leading-none">AnatoVerse Advanced 3D Viewer</h1>
            <p className="text-[10px] uppercase tracking-widest text-cyan-200/70 mt-1">Three.js GLB body model + corrected organ markers</p>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-2 text-xs font-bold text-slate-300">
          <span className="px-3 py-1.5 rounded-full bg-cyan-400/10 border border-cyan-300/20 text-cyan-200">Orbit</span>
          <span className="px-3 py-1.5 rounded-full bg-cyan-400/10 border border-cyan-300/20 text-cyan-200">Zoom</span>
          <span className="px-3 py-1.5 rounded-full bg-cyan-400/10 border border-cyan-300/20 text-cyan-200">Click Organs</span>
        </div>
      </header>

      <main className="flex flex-col xl:grid xl:grid-cols-[320px_minmax(0,1fr)_360px] xl:h-[calc(100vh-4rem)] overflow-y-auto xl:overflow-hidden">
        <aside className="order-3 xl:order-1 border-r border-white/10 bg-slate-900/80 p-4 md:p-5 overflow-y-visible xl:overflow-y-auto xl:max-h-none xl:h-full">
          <div className="flex items-center gap-2 mb-4">
            <Layers className="w-4 h-4 text-cyan-300" />
            <h2 className="text-xs font-black uppercase tracking-widest text-slate-300">Organ Selector</h2>
          </div>

          <div className="xl:hidden mb-4 rounded-3xl border border-cyan-300/20 bg-cyan-400/10 p-4">
            <p className="text-[10px] uppercase tracking-widest font-black text-cyan-200/80 mb-2">Quick mobile organ picker</p>
            <select
              value={selectedOrganId}
              onChange={(event) => selectOrgan(event.target.value)}
              className="w-full rounded-2xl bg-slate-950 border border-cyan-300/30 px-4 py-3 text-sm font-black text-white outline-none focus:border-cyan-300"
            >
              {filteredMarkers.map((marker) => (
                <option key={marker.id} value={marker.id}>
                  {marker.name}
                </option>
              ))}
            </select>
            <p className="text-xs text-slate-300 mt-3 leading-relaxed">Select an organ here or tap a colored marker. Details now open directly below the 3D model on mobile.</p>
          </div>

          <div className="relative mb-4">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search organ..."
              className="w-full rounded-2xl bg-slate-950 border border-white/10 py-3 pl-10 pr-10 text-xs font-bold outline-none focus:border-cyan-300 text-white"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2 mb-4">
            <button
              onClick={() => setActiveSystemId('all')}
              className={`rounded-2xl px-3 py-2.5 text-[11px] font-black border transition-all ${activeSystemId === 'all' ? 'bg-cyan-400 text-slate-950 border-cyan-300' : 'bg-white/5 text-slate-300 border-white/10 hover:border-cyan-300/40'}`}
            >
              All organs
            </button>
            {anatomyData.systems.slice(0, 9).map((system) => (
              <button
                key={system.id}
                onClick={() => setActiveSystemId(system.id)}
                className={`rounded-2xl px-3 py-2.5 text-[10px] font-black border transition-all text-left ${activeSystemId === system.id ? 'bg-cyan-400 text-slate-950 border-cyan-300' : 'bg-white/5 text-slate-300 border-white/10 hover:border-cyan-300/40'}`}
              >
                {system.name.replace(' System', '')}
              </button>
            ))}
          </div>

          <div className="space-y-2">
            {filteredMarkers.map((marker) => {
              const organ = anatomyData.organs.find((entry) => entry.id === marker.id);
              const isActive = selectedOrganId === marker.id;
              return (
                <button
                  key={marker.id}
                  onClick={() => selectOrgan(marker.id)}
                  className={`w-full text-left rounded-2xl border p-3 transition-all ${isActive ? 'bg-cyan-400 text-slate-950 border-cyan-200 shadow-lg shadow-cyan-500/20' : 'bg-white/[0.04] border-white/10 hover:border-cyan-300/50 hover:bg-white/[0.07]'}`}
                >
                  <span className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: marker.color }} />
                    <span className="text-sm font-black">{marker.name}</span>
                  </span>
                  <span className={`block text-[10px] font-bold mt-1 ${isActive ? 'text-slate-800' : 'text-slate-500'}`}>{organ?.system}</span>
                </button>
              );
            })}
          </div>
        </aside>

        <section className="order-1 xl:order-2 relative h-[58svh] min-h-[390px] max-h-[620px] xl:h-full xl:max-h-none xl:min-h-0 bg-[radial-gradient(circle_at_center,_rgba(8,145,178,0.26),_rgba(2,6,23,1)_62%)] overflow-hidden">
          <div ref={mountRef} className="absolute inset-0" />

          {showLabels && labels.map((label) => {
            const marker = organMarkers.find((entry) => entry.id === label.id);
            if (!marker || !label.visible) return null;
            const isActive = selectedOrganId === label.id;
            return (
              <button
                key={label.id}
                onClick={() => selectOrgan(label.id)}
                className="absolute z-20 h-0 w-0 transition-all"
                style={{ left: label.x, top: label.y }}
                aria-label={`Select ${marker.name}`}
              >
                <span
                  className={`absolute left-0 top-0 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 ${isActive ? 'border-white shadow-xl shadow-cyan-400/50 scale-125' : 'border-white/70 shadow-lg shadow-black/40'}`}
                  style={{ backgroundColor: marker.color }}
                />
                {(() => {
                  const offset = markerLabelOffsets[marker.id] || { dx: 16, dy: 0, side: 'right' as const };
                  return (
                    <span
                      className={`absolute top-0 whitespace-nowrap rounded-full border px-2.5 py-1 text-[10px] font-black backdrop-blur transition-all ${!isActive ? 'hidden sm:block ' : ''}${isActive ? 'bg-cyan-300 text-slate-950 border-white shadow-xl shadow-cyan-400/30 scale-105' : 'bg-slate-950/70 text-white border-white/20 hover:bg-cyan-300 hover:text-slate-950'}`}
                      style={{
                        left: offset.dx,
                        top: offset.dy,
                        transform: offset.side === 'left' ? 'translate(-100%, -50%)' : 'translate(0, -50%)',
                      }}
                    >
                      {marker.name}
                    </span>
                  );
                })()}
              </button>
            );
          })}

          <div className="absolute left-4 top-4 z-30 flex flex-wrap gap-2">
            <button
              onClick={resetCamera}
              className="rounded-2xl bg-slate-950/70 hover:bg-cyan-400 hover:text-slate-950 border border-white/10 px-3 py-2 text-xs font-black backdrop-blur inline-flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" /> Reset view
            </button>
            <button
              onClick={() => setShowLabels((value) => !value)}
              className="rounded-2xl bg-slate-950/70 hover:bg-cyan-400 hover:text-slate-950 border border-white/10 px-3 py-2 text-xs font-black backdrop-blur inline-flex items-center gap-2"
            >
              <Eye className="w-4 h-4" /> {showLabels ? 'Hide labels' : 'Show labels'}
            </button>
            <button
              onClick={() => setShowOrgans((value) => !value)}
              className="rounded-2xl bg-slate-950/70 hover:bg-cyan-400 hover:text-slate-950 border border-white/10 px-3 py-2 text-xs font-black backdrop-blur inline-flex items-center gap-2"
            >
              <MapPin className="w-4 h-4" /> {showOrgans ? 'Hide markers' : 'Show markers'}
            </button>
          </div>

          <div className="hidden sm:block absolute bottom-4 left-4 right-4 z-30 rounded-3xl border border-cyan-300/20 bg-slate-950/70 backdrop-blur p-4 shadow-xl">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              <div>
                <p className="text-[10px] uppercase tracking-widest font-black text-cyan-200/80">Model guidance</p>
                <p className="text-sm text-slate-300 font-semibold mt-1">Drag to rotate, scroll to zoom, and click glowing markers to open organ details.</p>
              </div>
              <div className="text-[10px] text-slate-400 max-w-xl leading-relaxed">
                The colored dot is the anatomical pin. Labels are offset away from the pin so organs in the abdomen and pelvis stay readable and correctly placed.
              </div>
            </div>
          </div>

          {loadingModel && (
            <div className="absolute inset-0 z-40 grid place-items-center bg-slate-950/80 backdrop-blur-sm">
              <div className="text-center">
                <div className="w-14 h-14 rounded-full border-4 border-cyan-300/20 border-t-cyan-300 animate-spin mx-auto mb-4" />
                <p className="font-black">Loading 3D anatomy model...</p>
              </div>
            </div>
          )}

          {modelError && (
            <div className="absolute inset-0 z-40 grid place-items-center p-8 bg-slate-950/90">
              <div className="max-w-lg rounded-3xl border border-red-400/30 bg-red-950/25 p-6 text-center">
                <p className="font-black text-red-200">Model loading problem</p>
                <p className="text-sm text-red-100/80 mt-2">{modelError}</p>
              </div>
            </div>
          )}
        </section>

        <aside ref={detailsPanelRef} className="order-2 xl:order-3 border-l border-white/10 bg-slate-900/80 p-4 md:p-5 overflow-visible xl:overflow-y-auto xl:max-h-none xl:h-full">
          <div className="rounded-3xl border border-cyan-300/20 bg-cyan-400/10 p-5 mb-5">
            <p className="text-[10px] font-black uppercase tracking-widest text-cyan-200 mb-2">Selected anatomy point</p>
            <h2 className="text-3xl font-black tracking-tight">{selectedOrgan?.name || 'Organ marker'}</h2>
            <p className="text-sm font-semibold text-cyan-100/80 mt-2">{selectedOrgan?.system}</p>
          </div>

          {selectedOrgan && (
            <div className="space-y-5">
              <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
                <div className="flex items-center gap-2 mb-3">
                  <MapPin className="w-4 h-4 text-cyan-300" />
                  <h3 className="text-xs uppercase tracking-widest font-black text-slate-300">Exact placement guide</h3>
                </div>
                <p className="text-sm leading-relaxed text-slate-300">{selectedOrgan.location}</p>
                {activeMarkerInfo && (
                  <p className="text-xs mt-3 text-cyan-100 bg-cyan-400/10 border border-cyan-300/20 rounded-2xl p-3">
                    Marker position: {activeMarkerInfo.placement}.
                  </p>
                )}
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Dna className="w-4 h-4 text-cyan-300" />
                  <h3 className="text-xs uppercase tracking-widest font-black text-slate-300">Structure</h3>
                </div>
                <p className="text-sm leading-relaxed text-slate-300">{selectedOrgan.structure}</p>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
                <div className="flex items-center gap-2 mb-3">
                  <BookOpen className="w-4 h-4 text-cyan-300" />
                  <h3 className="text-xs uppercase tracking-widest font-black text-slate-300">Function</h3>
                </div>
                <p className="text-sm leading-relaxed text-slate-300">{selectedOrgan.function}</p>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
                <h3 className="text-xs uppercase tracking-widest font-black text-slate-300 mb-3">Quick facts</h3>
                <ul className="space-y-2">
                  {selectedOrgan.quickFacts.map((fact) => (
                    <li key={fact} className="text-sm text-slate-300 leading-relaxed flex gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-300 mt-2 shrink-0" />
                      <span>{fact}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </aside>
      </main>
    </div>
  );
};
