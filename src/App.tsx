import React, { useState, useEffect, useRef } from 'react';
import {
  Activity,
  Search,
  Menu,
  X,
  BookOpen,
  AlertTriangle,
  Info,
  ChevronRight,
  Eye,
  Settings,
  Dna,
  ShieldAlert,
  Sliders,
  Sparkles,
  Layers,
  MapPin,
  ArrowRight,
  Heart,
  User,
  Trophy,
  LogOut,
} from 'lucide-react';
import { anatomyData, SystemData, OrganData } from './data';
import { AnatomyIllustrations } from './components/AnatomyIllustrations';
import { AdvancedAnatomyViewer } from './components/AdvancedAnatomyViewer';
import { OrganStudyPage } from './components/OrganStudyPage';
import { SystemStudyPage } from './components/SystemStudyPage';
import { MedicalAiChat } from './components/MedicalAiChat';
import { apiRequest } from './lib/api';
import { localAuthMe, localGetActivities, localLogActivity, localLogin, localLogout, localRegister } from './lib/localAuth';

type AppRoute =
  | { page: 'advanced-3d-viewer'; organId: string | null; systemId: string | null }
  | { page: 'organ-study'; organId: string }
  | { page: 'system-study'; systemId: string }
  | null;

type AuthUser = {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  progress: { organs: string[]; systems: string[] };
};

type ActivityRecord = {
  id: string;
  type: string;
  targetId: string | null;
  targetName: string | null;
  createdAt: string;
  meta?: Record<string, unknown>;
};

const readAppRoute = (): AppRoute => {
  if (typeof window === 'undefined') return null;
  const hash = window.location.hash || '';
  if (hash.startsWith('#/advanced-3d-viewer')) {
    const queryString = hash.includes('?') ? hash.split('?')[1] : '';
    const params = new URLSearchParams(queryString);
    return {
      page: 'advanced-3d-viewer',
      organId: params.get('organ'),
      systemId: params.get('system'),
    };
  }
  if (hash.startsWith('#/organ-study/')) {
    const organId = decodeURIComponent(hash.replace('#/organ-study/', '')).trim();
    if (organId) return { page: 'organ-study', organId };
  }
  if (hash.startsWith('#/system-study/')) {
    const systemId = decodeURIComponent(hash.replace('#/system-study/', '')).trim();
    if (systemId) return { page: 'system-study', systemId };
  }
  return null;
};

const formatActivityLabel = (activity: ActivityRecord) => {
  switch (activity.type) {
    case 'view_organ':
      return `Viewed organ: ${activity.targetName || activity.targetId}`;
    case 'view_system':
      return `Studied system: ${activity.targetName || activity.targetId}`;
    case 'open_study_page':
      return `Opened MBBS organ page: ${activity.targetName || activity.targetId}`;
    case 'open_system_study':
      return `Opened MBBS system page: ${activity.targetName || activity.targetId}`;
    case 'open_advanced_viewer':
      return `Opened 3D viewer: ${activity.targetName || 'General view'}`;
    default:
      return activity.targetName || activity.type;
  }
};

export default function App() {
  const [selectedSystemId, setSelectedSystemId] = useState<string | null>(null);
  const [selectedOrganId, setSelectedOrganId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Array<{ id: string; name: string; type: 'system' | 'organ'; systemName?: string }>>([]);
  const [showHotspots, setShowHotspots] = useState(true);
  const [showLabels, setShowLabels] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [learnerName, setLearnerName] = useState(() => localStorage.getItem('anatoverseLearnerName') || 'Guest Learner');
  const [completedOrganIds, setCompletedOrganIds] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem('anatoverseCompletedOrgans') || '[]'); } catch { return []; }
  });
  const [completedSystemIds, setCompletedSystemIds] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem('anatoverseCompletedSystems') || '[]'); } catch { return []; }
  });
  const [route, setRoute] = useState<AppRoute>(() => readAppRoute());
  const [authToken, setAuthToken] = useState(() => localStorage.getItem('anatoverseAuthToken') || '');
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [recentActivities, setRecentActivities] = useState<ActivityRecord[]>([]);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [authForm, setAuthForm] = useState({ name: '', email: '', password: '' });
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState('');

  const explorerRef = useRef<HTMLDivElement>(null);
  const systemsRef = useRef<HTMLDivElement>(null);
  const organsRef = useRef<HTMLDivElement>(null);
  const aboutRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleHashChange = () => setRoute(readAppRoute());
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  useEffect(() => {
    localStorage.setItem('anatoverseAuthToken', authToken);
  }, [authToken]);

  useEffect(() => {
    const loadAuthData = async () => {
      setAuthChecked(false);
      if (!authToken) {
        setAuthUser(null);
        setRecentActivities([]);
        setAuthChecked(true);
        return;
      }
      try {
        const me = await apiRequest<{ user: AuthUser }>('/api/auth/me', {}, authToken);
        setAuthUser(me.user);
        setLearnerName(me.user.name);
        if (me.user.progress) {
          setCompletedOrganIds(me.user.progress.organs || []);
          setCompletedSystemIds(me.user.progress.systems || []);
        }
        const logs = await apiRequest<{ activities: ActivityRecord[] }>('/api/activities', {}, authToken);
        setRecentActivities(logs.activities || []);
      } catch {
        try {
          const localMe = localAuthMe(authToken);
          setAuthUser(localMe.user as AuthUser);
          setLearnerName(localMe.user.name);
          if (localMe.user.progress) {
            setCompletedOrganIds(localMe.user.progress.organs || []);
            setCompletedSystemIds(localMe.user.progress.systems || []);
          }
          const localLogs = localGetActivities(authToken);
          setRecentActivities(localLogs.activities as ActivityRecord[]);
        } catch {
          setAuthToken('');
          setAuthUser(null);
          setRecentActivities([]);
        }
      } finally {
        setAuthChecked(true);
      }
    };
    loadAuthData();
  }, [authToken]);

  useEffect(() => {
    localStorage.setItem('anatoverseLearnerName', learnerName);
  }, [learnerName]);

  useEffect(() => {
    localStorage.setItem('anatoverseCompletedOrgans', JSON.stringify(completedOrganIds));
  }, [completedOrganIds]);

  useEffect(() => {
    localStorage.setItem('anatoverseCompletedSystems', JSON.stringify(completedSystemIds));
  }, [completedSystemIds]);
  // Sync Search queries live
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    const q = searchQuery.toLowerCase().trim();

    const matches: typeof searchResults = [];

    // Filter systems
    anatomyData.systems.forEach((sys) => {
      if (sys.name.toLowerCase().includes(q) || sys.shortDescription.toLowerCase().includes(q)) {
        matches.push({ id: sys.id, name: sys.name, type: 'system' });
      }
    });

    // Filter organs
    anatomyData.organs.forEach((org) => {
      if (
        org.name.toLowerCase().includes(q) ||
        org.function.toLowerCase().includes(q) ||
        org.system.toLowerCase().includes(q)
      ) {
        matches.push({ id: org.id, name: org.name, type: 'organ', systemName: org.system });
      }
    });

    setSearchResults(matches.slice(0, 8)); // Max 8 live results
  }, [searchQuery]);

  const scrollToSection = (ref: React.RefObject<HTMLDivElement | null>) => {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    setMobileMenuOpen(false);
  };

  const syncBackendProgress = (progress?: { organs: string[]; systems: string[] }) => {
    if (!progress) return;
    setCompletedOrganIds(progress.organs || []);
    setCompletedSystemIds(progress.systems || []);
    setAuthUser((prev) => (prev ? { ...prev, progress } : prev));
  };

  const logActivity = async (type: string, targetId?: string, targetName?: string, meta: Record<string, unknown> = {}) => {
    if (!authToken) return;
    try {
      const response = await apiRequest<{ activity: ActivityRecord; progress: { organs: string[]; systems: string[] } }>(
        "/api/activities",
        { method: "POST", body: JSON.stringify({ type, targetId, targetName, meta }) },
        authToken
      );
      setRecentActivities((prev) => [response.activity, ...prev].slice(0, 50));
      syncBackendProgress(response.progress);
    } catch {
      try {
        const response = localLogActivity(authToken, { type, targetId, targetName, meta });
        setRecentActivities((prev) => [response.activity as ActivityRecord, ...prev].slice(0, 50));
        syncBackendProgress(response.progress);
      } catch (error) {
        console.error(error);
      }
    }
  };

  const submitAuthForm = async () => {
    setAuthLoading(true);
    setAuthError("");
    try {
      const endpoint = authMode === "login" ? "/api/auth/login" : "/api/auth/register";
      const payload = authMode === "login"
        ? { email: authForm.email, password: authForm.password }
        : { name: authForm.name, email: authForm.email, password: authForm.password };
      const response = await apiRequest<{ token: string; user: AuthUser }>(endpoint, { method: "POST", body: JSON.stringify(payload) });
      setAuthToken(response.token);
      setAuthUser(response.user);
      setLearnerName(response.user.name);
      syncBackendProgress(response.user.progress);
      setAuthForm({ name: "", email: "", password: "" });
    } catch {
      try {
        const localResponse = authMode === "login"
          ? localLogin({ email: authForm.email, password: authForm.password })
          : localRegister({ name: authForm.name, email: authForm.email, password: authForm.password });
        setAuthToken(localResponse.token);
        setAuthUser(localResponse.user as AuthUser);
        setLearnerName(localResponse.user.name);
        syncBackendProgress(localResponse.user.progress);
        setAuthForm({ name: "", email: "", password: "" });
      } catch (localError) {
        setAuthError(localError instanceof Error ? localError.message : "Authentication failed.");
      }
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      if (authToken) {
        await apiRequest("/api/auth/logout", { method: "POST" }, authToken);
      }
    } catch {}
    try {
      if (authToken) localLogout(authToken);
    } catch {}
    setAuthToken("");
    setAuthUser(null);
    setRecentActivities([]);
    closeRoute();
  };

  const openAdvancedViewer = (organId?: string, systemId?: string) => {
    const params = new URLSearchParams();
    if (organId) params.set("organ", organId);
    if (systemId) params.set("system", systemId);
    const query = params.toString();
    const hash = "/advanced-3d-viewer" + (query ? `?${query}` : "");
    window.location.hash = hash;
    setRoute({ page: "advanced-3d-viewer", organId: organId || null, systemId: systemId || null });
    setMobileMenuOpen(false);

    const organ = organId ? anatomyData.organs.find((item) => item.id === organId) : null;
    const system = systemId ? anatomyData.systems.find((item) => item.id === systemId) : null;
    logActivity("open_advanced_viewer", organId || systemId, organ?.name || system?.name || "Advanced 3D Viewer", {
      entityType: organId ? "organ" : systemId ? "system" : "general",
    });
  };

  const openOrganStudyPage = (organId: string) => {
    const organ = anatomyData.organs.find((item) => item.id === organId);
    window.location.hash = "/organ-study/" + organId;
    setRoute({ page: "organ-study", organId });
    setMobileMenuOpen(false);
    logActivity("open_study_page", organId, organ?.name || organId, { entityType: "organ" });
  };

  const openSystemStudyPage = (systemId: string) => {
    const system = anatomyData.systems.find((item) => item.id === systemId);
    window.location.hash = "/system-study/" + systemId;
    setRoute({ page: "system-study", systemId });
    setMobileMenuOpen(false);
    logActivity("open_system_study", systemId, system?.name || systemId, { entityType: "system" });
  };

  const closeRoute = () => {
    window.history.pushState(null, "", window.location.pathname + window.location.search);
    setRoute(null);
  };

  const handleSelectSystem = (systemId: string) => {
    setSelectedSystemId(systemId);
    setSelectedOrganId(null);
    setCompletedSystemIds((prev) => prev.includes(systemId) ? prev : [...prev, systemId]);
    const system = anatomyData.systems.find((s) => s.id === systemId);
    logActivity("view_system", systemId, system?.name || systemId, { entityType: "system" });
    scrollToSection(explorerRef);
  };

  const handleSelectOrgan = (organId: string) => {
    setSelectedOrganId(organId);
    setSelectedSystemId(null);
    setCompletedOrganIds((prev) => prev.includes(organId) ? prev : [...prev, organId]);
    const organ = anatomyData.organs.find((o) => o.id === organId);
    const relatedSystem = organ ? anatomyData.systems.find((s) => s.name === organ.system) : null;
    if (relatedSystem) {
      setCompletedSystemIds((prev) => prev.includes(relatedSystem.id) ? prev : [...prev, relatedSystem.id]);
    }
    logActivity("view_organ", organId, organ?.name || organId, { entityType: "organ" });
    scrollToSection(explorerRef);
  };

  const handleSearchResultClick = (result: typeof searchResults[0]) => {
    if (result.type === 'system') {
      setSelectedSystemId(result.id);
      setSelectedOrganId(null);
    } else {
      setSelectedOrganId(result.id);
      setSelectedSystemId(null);
    }
    setSearchQuery('');
    scrollToSection(explorerRef);
  };

  const handleResetViewer = () => {
    setSelectedSystemId(null);
    setSelectedOrganId(null);
    scrollToSection(explorerRef);
  };

  // Active details computed reference
  const currentOrganModel = selectedOrganId ? anatomyData.organs.find((o) => o.id === selectedOrganId) : null;
  const currentSystemModel = selectedSystemId
    ? anatomyData.systems.find((s) => s.id === selectedSystemId)
    : currentOrganModel
    ? anatomyData.systems.find((s) => s.name === currentOrganModel.system)
    : anatomyData.systems.find((s) => s.id === 'cardiovascular'); // fall back to cardiovascular system details

  const organProgressPercent = Math.round((completedOrganIds.length / anatomyData.organs.length) * 100);
  const systemProgressPercent = Math.round((completedSystemIds.length / anatomyData.systems.length) * 100);
  const overallProgressPercent = Math.round(((completedOrganIds.length + completedSystemIds.length) / (anatomyData.organs.length + anatomyData.systems.length)) * 100);

  if (!authChecked) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-6">
        <div className="text-center">
          <div className="w-16 h-16 rounded-3xl bg-cyan-400/10 border border-cyan-300/20 flex items-center justify-center mx-auto mb-5 text-cyan-300">
            <Dna className="w-8 h-8 animate-pulse" />
          </div>
          <h1 className="text-3xl font-black tracking-tight">Loading AnatoVerse...</h1>
          <p className="text-sm text-slate-400 mt-2">Checking secure learner session.</p>
        </div>
      </div>
    );
  }

  if (!authUser) {
    return (
      <div className="min-h-screen bg-slate-950 text-white px-4 sm:px-6 lg:px-8 flex items-center justify-center overflow-hidden relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(34,211,238,0.22),_transparent_38%),radial-gradient(circle_at_bottom_right,_rgba(14,165,233,0.16),_transparent_40%)]" />
        <div className="relative z-10 max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-cyan-400/10 border border-cyan-300/20 text-cyan-200 text-xs font-black uppercase tracking-widest">
              <Dna className="w-4 h-4" />
              <span>Secure learner access required</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight tracking-tight">
              Login to enter <span className="text-cyan-300">AnatoVerse</span>
            </h1>
            <p className="text-slate-300 text-base sm:text-lg leading-relaxed max-w-xl">
              Create an account or sign in first. Your organ views, body-system study pages, 3D viewer activity, and MBBS learning progress will be saved for your learner session.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-xl">
              {[
                { title: '11 Systems', helper: 'MBBS pages' },
                { title: '15 Organs', helper: 'Detailed notes' },
                { title: 'Activity Log', helper: 'Backend saved' },
              ].map((item) => (
                <div key={item.title} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="font-black text-xl">{item.title}</div>
                  <div className="text-xs text-slate-400 mt-1">{item.helper}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white text-slate-900 rounded-[2rem] border border-white/10 shadow-2xl p-6 sm:p-8">
            <div className="mb-6">
              <div className="text-[11px] font-extrabold uppercase tracking-[0.22em] text-cyan-700">AnatoVerse account</div>
              <h2 className="text-2xl font-black mt-1">{authMode === 'login' ? 'Login' : 'Create account'}</h2>
              <p className="text-sm text-slate-500 mt-2">Required before opening the website.</p>
            </div>

            <div className="inline-flex rounded-2xl bg-slate-100 p-1 mb-6">
              <button
                onClick={() => { setAuthMode('login'); setAuthError(''); }}
                className={`px-4 py-2 rounded-2xl text-sm font-bold cursor-pointer ${authMode === 'login' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}
              >
                Login
              </button>
              <button
                onClick={() => { setAuthMode('register'); setAuthError(''); }}
                className={`px-4 py-2 rounded-2xl text-sm font-bold cursor-pointer ${authMode === 'register' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}
              >
                Sign up
              </button>
            </div>

            <div className="space-y-4">
              {authMode === 'register' && (
                <div>
                  <label className="text-[11px] uppercase tracking-[0.18em] font-extrabold text-slate-500 block mb-2">Full name</label>
                  <input
                    value={authForm.name}
                    onChange={(e) => setAuthForm({ ...authForm, name: e.target.value })}
                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm font-medium outline-none focus:border-cyan-400"
                    placeholder="Enter your name"
                  />
                </div>
              )}
              <div>
                <label className="text-[11px] uppercase tracking-[0.18em] font-extrabold text-slate-500 block mb-2">Email</label>
                <input
                  value={authForm.email}
                  onChange={(e) => setAuthForm({ ...authForm, email: e.target.value })}
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm font-medium outline-none focus:border-cyan-400"
                  placeholder="student@example.com"
                />
              </div>
              <div>
                <label className="text-[11px] uppercase tracking-[0.18em] font-extrabold text-slate-500 block mb-2">Password</label>
                <input
                  type="password"
                  value={authForm.password}
                  onChange={(e) => setAuthForm({ ...authForm, password: e.target.value })}
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm font-medium outline-none focus:border-cyan-400"
                  placeholder="Minimum 6 characters"
                />
              </div>
              {authError && <p className="text-sm font-semibold text-red-600">{authError}</p>}
              <button
                onClick={submitAuthForm}
                disabled={authLoading}
                className="w-full py-3.5 rounded-2xl bg-cyan-600 hover:bg-cyan-700 disabled:bg-cyan-300 text-white font-black text-sm cursor-pointer"
              >
                {authLoading ? 'Please wait...' : authMode === 'login' ? 'Login and enter website' : 'Sign up and enter website'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (route?.page === 'advanced-3d-viewer') {
    return (
      <>
        <AdvancedAnatomyViewer
          initialOrganId={route.organId}
          initialSystemId={route.systemId}
          onBack={closeRoute}
        />
        <MedicalAiChat learnerName={authUser?.name || learnerName} />
      </>
    );
  }

  if (route?.page === 'organ-study') {
    return (
      <>
        <OrganStudyPage
          organId={route.organId}
          onBack={closeRoute}
          onOpen3D={(organId) => openAdvancedViewer(organId)}
        />
        <MedicalAiChat learnerName={authUser?.name || learnerName} />
      </>
    );
  }

  if (route?.page === 'system-study') {
    return (
      <>
        <SystemStudyPage
          systemId={route.systemId}
          onBack={closeRoute}
          onOpen3D={(systemId) => openAdvancedViewer(undefined, systemId)}
        />
        <MedicalAiChat learnerName={authUser?.name || learnerName} />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7fbff] text-slate-900 font-sans antialiased selection:bg-cyan-150 selection:text-cyan-900">
      
      {/* 1. Header Navigation */}
      <header
        className={`sticky top-0 w-full z-40 transition-all duration-300 border-b border-slate-100 ${
          scrolled ? 'bg-white/95 backdrop-blur-md shadow-xs py-3' : 'bg-white/80 backdrop-blur-xs py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <a href="#" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-2xl bg-cyan-600/10 flex items-center justify-center text-cyan-600 group-hover:bg-cyan-600 group-hover:text-white transition-all duration-300 shadow-inner">
              <Dna className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight text-slate-900 block leading-tight">
                AnatoVerse
              </span>
              <span className="text-[10px] font-bold text-slate-400 tracking-wider uppercase block">
                Human Body Explorer
              </span>
            </div>
          </a>

          {/* Desktop links */}
          <nav className="hidden md:flex items-center gap-8">
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="text-sm font-semibold text-slate-500 hover:text-cyan-600 transition-colors pointer-events-auto cursor-pointer"
            >
              Home
            </button>
            <button
              onClick={() => openAdvancedViewer()}
              className="text-sm font-semibold text-slate-500 hover:text-cyan-600 transition-colors pointer-events-auto cursor-pointer"
            >
              3D Explorer
            </button>
            <button
              onClick={() => scrollToSection(systemsRef)}
              className="text-sm font-semibold text-slate-500 hover:text-cyan-600 transition-colors pointer-events-auto cursor-pointer"
            >
              Systems
            </button>
            <button
              onClick={() => scrollToSection(organsRef)}
              className="text-sm font-semibold text-slate-500 hover:text-cyan-600 transition-colors pointer-events-auto cursor-pointer"
            >
              Organs
            </button>
            <button
              onClick={() => scrollToSection(aboutRef)}
              className="text-sm font-semibold text-slate-500 hover:text-cyan-600 transition-colors pointer-events-auto cursor-pointer"
            >
              About
            </button>
          </nav>

          {/* Search bar dropdown section */}
          <div className="hidden sm:block relative w-64 xl:w-72" id="search-bar-desktop-box">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search organs/systems..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-xs font-medium pl-10 pr-4 py-2.5 rounded-2xl bg-slate-50 focus:bg-white border border-slate-100 focus:border-cyan-400 outline-hidden transition-all focus:shadow-xs"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Live Search suggestions result list */}
            {searchResults.length > 0 && (
              <div className="absolute top-12 right-0 w-80 bg-white border border-slate-100 rounded-3xl shadow-xl z-50 p-2.5 max-h-96 overflow-y-auto animate-fade-in">
                <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3 py-1.5 border-b border-slate-50 mb-1">
                  SUGGESTIONS MATCHES ({searchResults.length})
                </span>
                {searchResults.map((res) => (
                  <button
                    key={`${res.type}-${res.id}`}
                    onClick={() => handleSearchResultClick(res)}
                    className="w-full flex items-center justify-between text-left p-2.5 rounded-2xl hover:bg-slate-50 transition-colors group cursor-pointer"
                  >
                    <div>
                      <span className="text-xs font-semibold text-slate-900 group-hover:text-cyan-600 transition-colors block">
                        {res.name}
                      </span>
                      <span className="text-[10px] font-medium text-slate-400">
                        {res.type === 'system' ? 'Major System' : `Organ • ${res.systemName}`}
                      </span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-cyan-500 group-hover:translate-x-0.5 transition-all" />
                  </button>
                ))}
              </div>
            )}
            {searchQuery && searchResults.length === 0 && (
              <div className="absolute top-12 right-0 w-80 bg-white border border-slate-105 rounded-3xl shadow-xl z-50 p-4 text-center">
                <span className="text-xs font-semibold text-slate-500 block">No anatomy topic found</span>
                <span className="text-[10px] text-slate-400 mt-1 block">Try searching terms like "Heart", "Lungs", or "Nervous"</span>
              </div>
            )}
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-600 hover:text-slate-900 md:hidden"
            id="mobile-drawer-btn"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile menu drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white/95 border-b border-slate-150 p-4 flex flex-col gap-3 animate-fade-in-down absolute w-full top-16 left-0 shadow-lg">
            {/* Mobile search bar */}
            <div className="relative mb-2">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search anatomy topics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-xs font-medium pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 focus:bg-white border border-slate-100 outline-hidden transition-all"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2">
                  <X className="w-3.5 h-3.5 text-slate-400" />
                </button>
              )}
            </div>

            {/* Mobile query matches */}
            {searchResults.length > 0 && (
              <div className="bg-slate-50 rounded-2xl p-2 max-h-48 overflow-y-auto mb-2">
                {searchResults.map((res) => (
                  <button
                    key={`mob-${res.id}`}
                    onClick={() => {
                      handleSearchResultClick(res);
                      setMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center justify-between text-left p-1.5 text-xs font-medium text-slate-700 hover:text-cyan-600"
                  >
                    <span>{res.name}</span>
                    <span className="text-[10px] text-slate-400">{res.type}</span>
                  </button>
                ))}
              </div>
            )}

            <button
              onClick={() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
                setMobileMenuOpen(false);
              }}
              className="text-left w-full py-2 font-medium text-slate-700 hover:text-cyan-600 border-b border-slate-50"
            >
              Home
            </button>
            <button
              onClick={() => openAdvancedViewer()}
              className="text-left w-full py-2 font-medium text-slate-700 hover:text-cyan-600 border-b border-slate-50"
            >
              Advanced 3D Viewer
            </button>
            <button
              onClick={() => scrollToSection(systemsRef)}
              className="text-left w-full py-2 font-medium text-slate-700 hover:text-cyan-600 border-b border-slate-50"
            >
              Body Systems
            </button>
            <button
              onClick={() => scrollToSection(organsRef)}
              className="text-left w-full py-2 font-medium text-slate-700 hover:text-cyan-600 border-b border-slate-50"
            >
              Organ Catalog
            </button>
            <button
              onClick={() => scrollToSection(aboutRef)}
              className="text-left w-full py-2 font-medium text-slate-700 hover:text-cyan-600"
            >
              About
            </button>
          </div>
        )}
      </header>

      {/* 2. Hero Interactive Stage */}
      <section className="relative overflow-hidden pt-12 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="absolute inset-0 bg-radial from-cyan-400/5 via-transparent to-transparent -z-10" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-50 border border-cyan-100 text-cyan-700 font-semibold text-xs mb-6 uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-cyan-600 animate-spin" style={{ animationDuration: '4s' }} />
              <span>HOLOGRAPHIC ANATOMY SUITE</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-tight">
              Explore the Human <br />
              <span className="text-cyan-600 underline decoration-cyan-400/40 decoration-wavy">Body in Real-Time 3D</span>
            </h1>
            
            <p className="mt-6 text-slate-500 font-medium text-base sm:text-lg max-w-xl leading-relaxed">
              Study multi-layered physiological systems, trace structures of vital organs, and analyze physical anatomy mechanisms with a medical classification learning suite.
            </p>

            <div className="mt-8 flex flex-wrap gap-4 items-center">
              <button
                onClick={() => openAdvancedViewer()}
                className="px-6 py-4 rounded-2xl bg-cyan-650 hover:bg-cyan-700 text-white font-bold inline-flex items-center gap-2.5 shadow-md shadow-cyan-600/20 active:translate-y-0.5 transition-all text-sm pointer-events-auto cursor-pointer"
              >
                <span>Launch New 3D Viewer</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => scrollToSection(systemsRef)}
                className="px-6 py-4 rounded-2xl bg-white hover:bg-slate-50 text-slate-700 font-bold border border-slate-205 inline-flex items-center gap-2 transition-colors text-sm pointer-events-auto cursor-pointer"
              >
                <Layers className="w-4 h-4 text-slate-500" />
                <span>View Body Systems</span>
              </button>
            </div>
          </div>

          <div className="lg:col-span-5 flex justify-center">
            {/* Premium real-anatomy hero visual */}
            <div className="relative w-80 h-96 bg-sky-50 rounded-[2.5rem] flex items-center justify-center p-5 overflow-hidden shadow-inner border border-sky-100/70">
              <div className="absolute inset-0 bg-radial from-cyan-200/25 via-transparent to-sky-50" />
              <div className="absolute top-5 left-5 px-3 py-1 rounded-full bg-white/85 backdrop-blur text-[10px] font-extrabold text-cyan-700 border border-cyan-100 shadow-sm">
                Real Anatomy Reference
              </div>
              <img
                src="/anatomy-human-body.png"
                alt="Human body anatomy reference preview"
                className="relative z-10 h-full object-contain drop-shadow-2xl animate-float"
                loading="eager"
              />
              <div className="absolute right-5 bottom-5 bg-white/90 backdrop-blur rounded-2xl border border-slate-100 shadow-md p-3 text-left">
                <span className="block text-[10px] font-extrabold text-slate-400 uppercase">Study Progress</span>
                <span className="block text-lg font-black text-slate-900">{overallProgressPercent}%</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Main 3D Anatomy Explorer Sandbox */}
      <section ref={explorerRef} className="bg-slate-50 border-y border-slate-150 py-16 px-4 sm:px-6 lg:px-8" id="sandbox-view">
        <div className="max-w-7xl mx-auto">
          
          <div className="text-center mb-10">
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Interactive Anatomy Workspace
            </h2>
            <p className="mt-2 text-slate-505 font-medium text-sm">
              Toggle specific layers inside the selector panel, orbit in 3D camera coordinates, and trigger detailed organ profiles.
            </p>
          </div>

          {/* Core Explorer Layout Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            
            {/* Left selector menu buttons */}
            <div className="lg:col-span-3 bg-white border border-slate-150 rounded-3xl p-5 flex flex-col shadow-xs" id="left-system-menu">
              <div className="flex items-center gap-2 px-1 mb-4">
                <Sliders className="w-4 h-4 text-slate-500" />
                <span className="text-xs font-extrabold text-slate-400 uppercase tracking-widest">
                  Systems Selector
                </span>
              </div>
              
              <div className="space-y-1.5 overflow-y-auto max-h-[480px] pr-1 scrollbar-thin">
                <button
                  onClick={() => { setSelectedSystemId(null); setSelectedOrganId(null); }}
                  className={`w-full flex items-center gap-3.5 p-3 rounded-2xl text-left border transition-all text-xs font-bold pointer-events-auto cursor-pointer ${
                    selectedSystemId === null && selectedOrganId === null
                      ? 'bg-cyan-50/75 border-cyan-200 text-cyan-800 shadow-inner'
                      : 'border-transparent text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${selectedSystemId === null ? 'bg-cyan-600 animate-ping' : 'bg-slate-300'}`} />
                  <div className="flex-1">
                    <span className="block">Show Complete Body</span>
                    <span className="text-[10px] font-medium text-slate-400 block mt-0.5">Procedural humanoid base</span>
                  </div>
                </button>

                {anatomyData.systems.map((sys) => {
                  const isActive = selectedSystemId === sys.id;
                  return (
                    <button
                      key={sys.id}
                      onClick={() => handleSelectSystem(sys.id)}
                      className={`w-full flex items-center gap-3.5 p-3 rounded-2xl text-left border transition-all text-xs font-bold pointer-events-auto cursor-pointer ${
                        isActive
                          ? 'bg-cyan-50/75 border-cyan-200 text-cyan-850 shadow-inner'
                          : 'border-transparent text-slate-605 hover:bg-slate-50 hover:text-slate-900'
                      }`}
                    >
                      <span className={`w-2 h-2 rounded-full ${isActive ? 'bg-cyan-600 animate-ping' : 'bg-slate-300'}`} />
                      <div className="flex-1">
                        <span className="block">{sys.name}</span>
                        <span className="text-[10px] font-medium text-slate-400 block mt-0.5 truncate max-w-[170px]">
                          {sys.shortDescription}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* View options HUD HUD controls */}
              <div className="border-t border-slate-100 mt-5 pt-4 space-y-3.5">
                <label className="flex items-center justify-between text-xs font-bold text-slate-600 cursor-pointer">
                  <span>Show Glowing Hotspots</span>
                  <input
                    type="checkbox"
                    checked={showHotspots}
                    onChange={(e) => setShowHotspots(e.target.checked)}
                    className="w-4 h-4 rounded-sm border-slate-300 text-cyan-600 focus:ring-cyan-500 cursor-pointer"
                  />
                </label>
                <label className="flex items-center justify-between text-xs font-bold text-slate-600 cursor-pointer">
                  <span>Show Labels on Hover</span>
                  <input
                    type="checkbox"
                    checked={showLabels}
                    onChange={(e) => setShowLabels(e.target.checked)}
                    className="w-4 h-4 rounded-sm border-slate-300 text-cyan-600 focus:ring-cyan-500 cursor-pointer"
                  />
                </label>
              </div>
            </div>

            {/* Center advanced viewer launch panel */}
            <div className="lg:col-span-6 flex flex-col gap-4">
              <div className="relative min-h-[520px] rounded-[2rem] overflow-hidden border border-cyan-200/70 bg-slate-950 shadow-xl flex items-center justify-center p-8 text-center">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(8,145,178,0.32),_rgba(2,6,23,1)_65%)]" />
                <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'linear-gradient(rgba(34,211,238,.14) 1px, transparent 1px), linear-gradient(90deg, rgba(34,211,238,.14) 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
                <div className="relative z-10 max-w-lg mx-auto">
                  <div className="w-20 h-20 rounded-3xl bg-cyan-400/10 border border-cyan-300/30 flex items-center justify-center mx-auto mb-5 text-cyan-300 shadow-lg shadow-cyan-500/20">
                    <Dna className="w-9 h-9" />
                  </div>
                  <span className="inline-flex px-3 py-1 rounded-full bg-cyan-300/10 border border-cyan-300/25 text-cyan-200 text-[10px] font-black uppercase tracking-widest mb-4">
                    New embedded Three.js GLB viewer
                  </span>
                  <h3 className="text-3xl font-black text-white tracking-tight mb-3">Open Advanced Human Anatomy Viewer</h3>
                  <p className="text-sm text-slate-300 font-medium leading-relaxed mb-6">
                    The old procedural 3D workspace has been replaced with a dedicated viewer page using a real imported human-body GLB model, orbit controls, and accurately placed organ markers.
                  </p>
                  <button
                    onClick={() => openAdvancedViewer(selectedOrganId || undefined, selectedSystemId || undefined)}
                    className="px-6 py-4 rounded-2xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-black inline-flex items-center gap-2.5 shadow-lg shadow-cyan-500/25 active:translate-y-0.5 transition-all text-sm cursor-pointer"
                  >
                    <span>Launch New 3D Viewer</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Right details facts statistics summary panel */}
            <div className="lg:col-span-3 bg-white border border-slate-150 rounded-3xl p-6 shadow-xs flex flex-col justify-between max-h-[500px] md:max-h-[600px] overflow-y-auto" id="right-info-panel-box">
              {currentOrganModel ? (
                // Focused Organ state template
                <div className="space-y-5 animate-fade-in">
                  <div>
                    <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-[10px] font-extrabold text-emerald-700 border border-emerald-100 uppercase tracking-widest inline-block mb-1">
                      {currentOrganModel.system}
                    </span>
                    <h3 className="text-xl font-bold text-slate-900 tracking-tight">
                      {currentOrganModel.name}
                    </h3>
                  </div>

                  {/* Draw vector illustration dynamically based on ID */}
                  <div className="flex justify-center my-3 bg-slate-50/70 p-2.5 rounded-2xl border border-slate-100">
                    <AnatomyIllustrations id={currentOrganModel.id} size={150} />
                  </div>

                  <div className="space-y-4">
                    <div>
                      <span className="text-[10px] font-bold text-slate-405 uppercase tracking-wider block">Bio Location</span>
                      <p className="text-xs font-medium text-slate-650 mt-1">{currentOrganModel.location}</p>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-405 uppercase tracking-wider block">Anatomical Structure</span>
                      <p className="text-xs font-medium text-slate-650 mt-1 leading-relaxed">{currentOrganModel.structure}</p>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-405 uppercase tracking-wider block">Physiological Function</span>
                      <p className="text-xs font-medium text-slate-650 mt-1 leading-relaxed">{currentOrganModel.function}</p>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-405 uppercase tracking-wider block mb-1.5">Academic Key Facts</span>
                      <ul className="space-y-1.5">
                        {currentOrganModel.quickFacts.map((fact, idx) => (
                          <li key={idx} className="text-xs font-medium text-slate-600 flex items-start gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 shrink-0 mt-1.5" />
                            <span>{fact}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ) : (
                // Selected System details state template
                <div className="space-y-5 animate-slide-right">
                  <div>
                    <span className="px-2 py-0.5 rounded-md bg-cyan-50 text-[10px] font-extrabold text-cyan-700 border border-cyan-100 uppercase tracking-widest inline-block mb-1">
                      Major Body System
                    </span>
                    <h3 className="text-xl font-bold text-slate-900 tracking-tight">
                      {currentSystemModel ? currentSystemModel.name : "Cardiovascular System"}
                    </h3>
                  </div>

                  {/* Dynamic system illustration fallback mapping */}
                  <div className="flex justify-center my-3 bg-slate-50/70 p-2.5 rounded-xl border border-slate-100">
                    <AnatomyIllustrations id={currentSystemModel ? currentSystemModel.id : "cardiovascular"} size={140} />
                  </div>

                  {currentSystemModel && (
                    <div className="space-y-4">
                      <p className="text-xs font-medium text-slate-500 leading-relaxed">
                        {currentSystemModel.overview}
                      </p>
                      <div>
                        <span className="text-[10px] font-bold text-slate-405 uppercase tracking-wider block mb-1">Key operations</span>
                        <ul className="space-y-1.5">
                          {currentSystemModel.functions.map((func, idx) => (
                            <li key={idx} className="text-xs font-medium text-slate-650 flex items-start gap-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 shrink-0 mt-1.5" />
                              <span>{func}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-slate-450 uppercase tracking-wider block mb-1">Common Disorders</span>
                        <div className="flex flex-wrap gap-1 mt-1.5">
                          {currentSystemModel.commonDisorders.map((dis, idx) => (
                            <span key={idx} className="text-[10px] font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 px-2.5 py-1 rounded-lg">
                              {dis}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div className="border-t border-slate-100 mt-6 pt-4 text-center space-y-3">
                {currentOrganModel && (
                  <button
                    onClick={() => openOrganStudyPage(currentOrganModel.id)}
                    className="w-full py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-xs inline-flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Open MBBS Study Page</span>
                  </button>
                )}
                <button
                  onClick={() => scrollToSection(systemsRef)}
                  className="text-xs font-bold text-cyan-600 hover:text-cyan-700 inline-flex items-center gap-1 cursor-pointer"
                >
                  <span>Compare full structures list</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 4. Systems grid cards presentation list */}
      <section ref={systemsRef} className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto" id="systems-grid-view">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-600/5 text-cyan-700 text-[10px] font-extrabold uppercase tracking-widest mb-2.5">
            <Layers className="w-3.5 h-3.5" />
            <span>Human physiological systems</span>
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            11 Core Human Body Systems
          </h2>
          <p className="mt-2 text-slate-500 font-medium text-base">
            Explore descriptions, component lists, and diagnostic paths for each system.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {anatomyData.systems.map((sys) => {
            const isSystemActive = selectedSystemId === sys.id;
            return (
              <div
                key={sys.id}
                onClick={() => openSystemStudyPage(sys.id)}
                className={`bg-white border rounded-3xl p-6 transition-all duration-300 flex flex-col justify-between hover:border-slate-300 hover:shadow-lg cursor-pointer ${
                  isSystemActive ? 'border-cyan-400 ring-4 ring-cyan-50' : 'border-slate-200/80 shadow-xs'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center border border-slate-100">
                      <AnatomyIllustrations id={sys.id} size={36} />
                    </div>
                    <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md uppercase tracking-wider">
                      {sys.organs.length} Components
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 mb-2 leading-tight">
                    {sys.name}
                  </h3>
                  <p className="text-slate-505 font-medium text-xs leading-relaxed mb-4">
                    {sys.shortDescription}
                  </p>

                  <div className="mb-6">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5">Primary Organs</span>
                    <div className="flex flex-wrap gap-1">
                      {sys.organs.map((organName, idx) => (
                        <span key={idx} className="text-[10px] font-semibold bg-slate-50 hover:bg-slate-120 border border-slate-100 text-slate-650 px-2.5 py-0.5 rounded-lg">
                          {organName}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-2">
                  <button
                    onClick={(e) => { e.stopPropagation(); openSystemStudyPage(sys.id); }}
                    className="w-full py-3 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-xs border border-cyan-600 inline-flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Open MBBS System Page</span>
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); openAdvancedViewer(undefined, sys.id); }}
                    className="w-full py-3 rounded-xl bg-slate-50 hover:bg-cyan-600 hover:text-white text-slate-700 font-bold text-xs border border-slate-205/60 inline-flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Interactive 3D Study</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. Organs Index list with custom vectors */}
      <section ref={organsRef} className="bg-white border-t border-slate-150 py-20 px-4 sm:px-6 lg:px-8 shadow-xs" id="organs-grid-view">
        <div className="max-w-7xl mx-auto">
          
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-600/5 text-emerald-700 text-[10px] font-extrabold uppercase tracking-widest mb-2.5">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Core Biological Structures</span>
            </div>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Primary Organs Index
            </h2>
            <p className="mt-2 text-slate-500 font-medium text-base">
              A comprehensive directory containing specific functions, structures, and clinical facts.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {anatomyData.organs.map((org) => {
              const isActive = selectedOrganId === org.id;
              return (
                <div
                  key={org.id}
                  onClick={() => openOrganStudyPage(org.id)}
                  className={`bg-slate-50/50 border rounded-3xl p-5 transition-all duration-300 flex flex-col justify-between hover:border-slate-350 hover:shadow-md cursor-pointer ${
                    isActive ? 'border-cyan-400 ring-4 ring-cyan-50 bg-white' : 'border-slate-200/80 shadow-xs'
                  }`}
                >
                  <div>
                    <div className="flex justify-center bg-white p-3.5 rounded-2xl border border-slate-100 mb-4 h-36 items-center">
                      <AnatomyIllustrations id={org.id} size={110} />
                    </div>
                    
                    <span className="text-[9px] font-bold text-cyan-600 block uppercase tracking-wider mb-0.5">
                      {org.system}
                    </span>
                    <h3 className="text-base font-bold text-slate-900 leading-tight mb-2">
                      {org.name}
                    </h3>
                    <p className="text-slate-505 font-medium text-xs leading-relaxed mb-4 line-clamp-3">
                      {org.function}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 gap-2">
                    <button
                      onClick={(e) => { e.stopPropagation(); openOrganStudyPage(org.id); }}
                      className="w-full py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white border border-cyan-600 font-bold text-xs inline-flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>Open MBBS Study Page</span>
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); openAdvancedViewer(org.id); }}
                      className="w-full py-2.5 rounded-xl bg-white hover:bg-cyan-600 hover:text-white hover:border-cyan-600 border border-slate-205 text-slate-700 font-bold text-xs inline-flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View in 3D Model</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* 6. Learner accounts and progress tracking foundation */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white border-y border-slate-150" id="progress-view">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          <div className="lg:col-span-4 bg-slate-950 text-white rounded-3xl p-8 shadow-lg">
            <div className="w-12 h-12 rounded-2xl bg-cyan-400/10 flex items-center justify-center text-cyan-300 mb-5">
              <User className="w-5 h-5" />
            </div>
            <h2 className="text-2xl font-black tracking-tight mb-2">Learner Profile</h2>
            <p className="text-sm text-slate-300 leading-relaxed mb-5">
              Local progress is still shown here for quick study tracking, while the new backend login system below stores user activity and learning progress permanently for signed-in learners.
            </p>
            <label className="text-[10px] uppercase tracking-widest font-extrabold text-slate-400 block mb-2">Learner name</label>
            <input
              value={learnerName}
              onChange={(e) => setLearnerName(e.target.value)}
              className="w-full rounded-2xl bg-white/10 border border-white/10 px-4 py-3 text-sm font-bold text-white outline-none focus:border-cyan-300"
              aria-label="Learner name"
            />
          </div>

          <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              { title: 'Overall Completion', value: overallProgressPercent, icon: Trophy, helper: 'Systems + organs viewed' },
              { title: 'Systems Studied', value: systemProgressPercent, icon: Layers, helper: `${completedSystemIds.length}/${anatomyData.systems.length} systems` },
              { title: 'Organs Studied', value: organProgressPercent, icon: Heart, helper: `${completedOrganIds.length}/${anatomyData.organs.length} organs` },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="bg-slate-50 border border-slate-150 rounded-3xl p-6 shadow-xs">
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-11 h-11 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-cyan-600">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-3xl font-black text-slate-900">{item.value}%</span>
                  </div>
                  <h3 className="font-extrabold text-slate-900 text-sm">{item.title}</h3>
                  <p className="text-xs text-slate-500 font-medium mt-1">{item.helper}</p>
                  <div className="mt-4 h-2 rounded-full bg-slate-200 overflow-hidden">
                    <div className="h-full bg-cyan-600 rounded-full transition-all duration-700" style={{ width: `${item.value}%` }} />
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>


      {/* 7. Backend account and activity center */}
      <section className="py-18 px-4 sm:px-6 lg:px-8 bg-slate-50 border-b border-slate-150">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-5 bg-white border border-slate-200 rounded-3xl p-8 shadow-xs">
            <div className="flex items-center justify-between gap-3 mb-5">
              <div>
                <span className="text-[11px] font-extrabold uppercase tracking-[0.22em] text-cyan-700">Login system</span>
                <h2 className="text-2xl font-black text-slate-900 mt-1">Account &amp; Activity Center</h2>
              </div>
              {authUser && (
                <button onClick={handleLogout} className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-slate-950 text-white text-xs font-bold cursor-pointer">
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              )}
            </div>

            {authUser ? (
              <div className="space-y-5">
                <div className="rounded-3xl bg-slate-950 text-white p-5">
                  <div className="text-[11px] uppercase tracking-[0.2em] font-extrabold text-cyan-300 mb-2">Logged in learner</div>
                  <h3 className="text-xl font-black">{authUser.name}</h3>
                  <p className="text-sm text-slate-300 mt-1">{authUser.email}</p>
                  <p className="text-xs text-slate-400 mt-3">Your viewed systems, organs, and MBBS study-page visits are now saved for this account session.</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <div className="text-[11px] uppercase tracking-[0.18em] font-extrabold text-slate-500 mb-2">Systems saved</div>
                    <div className="text-2xl font-black text-slate-900">{completedSystemIds.length}</div>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <div className="text-[11px] uppercase tracking-[0.18em] font-extrabold text-slate-500 mb-2">Organs saved</div>
                    <div className="text-2xl font-black text-slate-900">{completedOrganIds.length}</div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-5">
                <div className="inline-flex rounded-2xl bg-slate-100 p-1">
                  <button
                    onClick={() => setAuthMode('login')}
                    className={`px-4 py-2 rounded-2xl text-sm font-bold cursor-pointer ${authMode === 'login' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}
                  >
                    Login
                  </button>
                  <button
                    onClick={() => setAuthMode('register')}
                    className={`px-4 py-2 rounded-2xl text-sm font-bold cursor-pointer ${authMode === 'register' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}
                  >
                    Register
                  </button>
                </div>

                {authMode === 'register' && (
                  <div>
                    <label className="text-[11px] uppercase tracking-[0.18em] font-extrabold text-slate-500 block mb-2">Full name</label>
                    <input
                      value={authForm.name}
                      onChange={(e) => setAuthForm({ ...authForm, name: e.target.value })}
                      className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm font-medium outline-none focus:border-cyan-400"
                      placeholder="Enter learner name"
                    />
                  </div>
                )}

                <div>
                  <label className="text-[11px] uppercase tracking-[0.18em] font-extrabold text-slate-500 block mb-2">Email</label>
                  <input
                    value={authForm.email}
                    onChange={(e) => setAuthForm({ ...authForm, email: e.target.value })}
                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm font-medium outline-none focus:border-cyan-400"
                    placeholder="Enter email"
                  />
                </div>

                <div>
                  <label className="text-[11px] uppercase tracking-[0.18em] font-extrabold text-slate-500 block mb-2">Password</label>
                  <input
                    type="password"
                    value={authForm.password}
                    onChange={(e) => setAuthForm({ ...authForm, password: e.target.value })}
                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm font-medium outline-none focus:border-cyan-400"
                    placeholder="Minimum 6 characters"
                  />
                </div>

                {authError && <p className="text-sm font-medium text-red-600">{authError}</p>}

                <button
                  onClick={submitAuthForm}
                  disabled={authLoading}
                  className="w-full py-3.5 rounded-2xl bg-cyan-600 hover:bg-cyan-700 disabled:bg-cyan-300 text-white font-black text-sm cursor-pointer"
                >
                  {authLoading ? 'Please wait...' : authMode === 'login' ? 'Login to save activity' : 'Create account'}
                </button>
              </div>
            )}
          </div>

          <div className="lg:col-span-7 bg-white border border-slate-200 rounded-3xl p-8 shadow-xs">
            <div className="flex items-center justify-between gap-3 mb-6">
              <div>
                <span className="text-[11px] font-extrabold uppercase tracking-[0.22em] text-emerald-700">Saved user activity</span>
                <h2 className="text-2xl font-black text-slate-900 mt-1">Recent Activity Log</h2>
              </div>
              <span className="text-xs font-bold text-slate-500">{recentActivities.length} items</span>
            </div>

            {authUser ? (
              recentActivities.length > 0 ? (
                <div className="space-y-3">
                  {recentActivities.slice(0, 12).map((activity) => (
                    <div key={activity.id} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <div>
                        <div className="text-sm font-bold text-slate-900">{formatActivityLabel(activity)}</div>
                        <div className="text-xs text-slate-500 mt-1">{activity.targetId ? 'Target ID: ' + activity.targetId : 'General activity'}</div>
                      </div>
                      <div className="text-xs font-medium text-slate-500">{new Date(activity.createdAt).toLocaleString()}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center">
                  <p className="text-slate-600 font-medium">No backend activity saved yet. Start opening systems, organs, and MBBS pages.</p>
                </div>
              )
            ) : (
              <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center">
                <p className="text-slate-600 font-medium">Login or register to save user actions in the activity log.</p>
              </div>
            )}
          </div>
        </div>
      </section>
      {/* 7. About Application section */}
      <section ref={aboutRef} className="py-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto text-center" id="about-view">
        <div className="space-y-6 bg-white border border-slate-150 rounded-3xl p-8 md:p-12 shadow-xs">
          <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center mx-auto text-slate-600 border border-slate-100">
            <Info className="w-5 h-5 text-cyan-600" />
          </div>
          
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            AnatoVerse Educational Goal
          </h2>
          
          <p className="text-slate-505 font-medium text-sm leading-relaxed max-w-2xl mx-auto">
            AnatoVerse is a premium educational workbench designed for students mapping the intricacies of human anatomy. By translating static textbook blueprints into responsive, immersive, and interactive WebGL coordinates, the platform reduces learning friction, making core medical terminology and systems functions instantly visual and accessible on high-resolution displays.
          </p>
          
          <div className="border-t border-slate-50 pt-5 text-xs text-slate-401 font-mono">
            <span>Academic Sandbox Edition 2.1 • Styled with High-Contrast Slate theme</span>
          </div>
        </div>
      </section>

      {/* 8. Modern footer and disclaimer */}
      <footer className="bg-slate-950 text-slate-400 pt-16 pb-12 px-4 sm:px-6 lg:px-8 border-t border-slate-900">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-10 items-start">
          
          <div className="md:col-span-8 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-cyan-500/10 flex items-center justify-center text-cyan-400">
                <Dna className="w-4 h-4" />
              </div>
              <span className="text-md font-extrabold text-white tracking-wider uppercase">
                AnatoVerse Human Body Explorer
              </span>
            </div>
            
            <p className="text-xs text-slate-400 max-w-xl leading-relaxed">
              Dedicated only to human skeletal frames, neural pathways, core digestive tubes, cardiovascular lines, and respiratory systems. Built for students and teachers of human biology. No commercial fitment or wellness marketing included.
            </p>

            {/* Medical Disclaimer Banner */}
            <div className="flex gap-3 bg-red-950/20 shadow-inner rounded-2xl p-4 border border-red-500/20 max-w-2xl">
              <ShieldAlert className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
              <div className="text-[11px] leading-relaxed text-red-300">
                <strong className="block font-bold text-red-200">MEDICAL DISCLAIMER NOTICE:</strong>
                This website is for educational, academic, and demonstration purposes only. It does not provide medical advice, diagnosis, treatment, prognosis, or therapeutic testing. Always obtain explicit medical check-ups and treatment guidance from licensed healthcare practitioners.
              </div>
            </div>
          </div>

          <div className="md:col-span-4 flex flex-col md:items-end gap-3 text-xs font-semibold" id="index-nav-box">
            <span className="text-white uppercase tracking-widest text-[10px] font-bold block mb-2">Workspace Navigation</span>
            <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="hover:text-white transition-colors cursor-pointer text-left">Back to top</button>
            <button onClick={() => openAdvancedViewer()} className="hover:text-white transition-colors cursor-pointer text-left">Advanced 3D Viewer</button>
            <button onClick={() => scrollToSection(systemsRef)} className="hover:text-white transition-colors cursor-pointer text-left">Human Systems Grid</button>
            <button onClick={() => scrollToSection(organsRef)} className="hover:text-white transition-colors cursor-pointer text-left">Primary Organs catalog</button>
          </div>

        </div>

        <div className="max-w-7xl mx-auto border-t border-slate-900 mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500">
          <span>&copy; 2026 AnatoVerse Inc. Educational Workspace Suite. All rights reserved.</span>
          <span className="mt-2 sm:mt-0">Clinical Grade Procedural Rendering deck</span>
        </div>
      </footer>

      <MedicalAiChat learnerName={authUser?.name || learnerName} />
    </div>
  );
}
