import React, { useState, useEffect, useCallback } from 'react';
import {
  AIProviderConfig,
  AspectRatioType,
  ContentLanguage,
  PresentationProject,
  TemplateDefinition,
} from './types/presentation';
import { PRESENTATION_TEMPLATES, INITIAL_SAMPLE_PROJECTS } from './data/templates';
import { PresentationWizard } from './components/PresentationWizard';
import { SlideEditorView } from './components/SlideEditorView';
import { AISettingsView } from './components/AISettingsView';
import {
  TemplateGalleryView,
  AppSettingsView,
  HelpDocumentationView,
} from './components/StudioViews';
import { downloadPresentationPptx, downloadPresentationPdf } from './lib/exporters';
import { apiRequest, loadLocalConfigs } from './lib/apiClient';
import {
  auth,
  onAuthStateChanged,
  signInWithGoogle,
  signOutUser,
  syncProjectToFirestore,
  deleteProjectFromFirestore,
  fetchUserProjectsFromFirestore,
  User,
} from './lib/firebase';
import {
  BookOpen,
  CheckCircle2,
  Copy,
  Download,
  Edit3,
  FileDown,
  FileText,
  FolderKanban,
  HelpCircle,
  LayoutDashboard,
  LayoutTemplate,
  LogIn,
  LogOut,
  Menu,
  Moon,
  Palette,
  Plus,
  Search,
  Settings,
  Sliders,
  Sparkles,
  Sun,
  Trash2,
  Upload,
  X,
  AlertCircle,
} from 'lucide-react';

type NavViewType =
  | 'dashboard'
  | 'wizard'
  | 'projects'
  | 'templates'
  | 'editor'
  | 'ai-settings'
  | 'app-settings'
  | 'help';

interface ToastItem {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

export default function App() {
  const [activeView, setActiveView] = useState<NavViewType>('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState<boolean>(false);

  // App-wide user preferences
  const [defaultLanguage, setDefaultLanguage] = useState<ContentLanguage>('id');
  const [defaultAspectRatio, setDefaultAspectRatio] = useState<AspectRatioType>('16:9');
  const [autosaveEnabled, setAutosaveEnabled] = useState<boolean>(true);

  // Projects & Active Project State
  const [projects, setProjects] = useState<PresentationProject[]>(INITIAL_SAMPLE_PROJECTS);
  const [activeProjectId, setActiveProjectId] = useState<string>(
    INITIAL_SAMPLE_PROJECTS[0]?.id || ''
  );
  const [loadingProjects, setLoadingProjects] = useState<boolean>(true);

  // Dashboard Quick Create & Project Filter State
  const [quickTopic, setQuickTopic] = useState<string>('');
  const [quickSourceMode, setQuickSourceMode] = useState<
    'topic' | 'text' | 'document' | 'visual-reference'
  >('topic');
  const [wizardInitialTemplateId, setWizardInitialTemplateId] =
    useState<string>('tpl-akademik-oxford');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [languageFilter, setLanguageFilter] = useState<'all' | 'id' | 'en'>('all');

  // Rename & Delete Confirmation Modals
  const [renamingProject, setRenamingProject] = useState<{ id: string; title: string } | null>(
    null
  );
  const [deletingProject, setDeletingProject] = useState<PresentationProject | null>(null);

  // AI Provider Configurations
  const [aiConfigs, setAiConfigs] = useState<AIProviderConfig[]>(() => loadLocalConfigs());
  const [activeAiConfigId, setActiveAiConfigId] = useState<string>('');

  // Firebase Auth User
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);

  // Toast Notifications
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const notify = useCallback((message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev.slice(-3), { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4200);
  }, []);

  // Load initial projects and AI configs from backend (with automatic client-side fallback on Vercel)
  const fetchProjectsAndConfigs = useCallback(async () => {
    setLoadingProjects(true);
    try {
      const [projRes, cfgRes] = await Promise.all([
        apiRequest('/api/projects'),
        apiRequest('/api/ai/configs'),
      ]);
      if (projRes.ok && Array.isArray(projRes.data?.projects) && projRes.data.projects.length > 0) {
        setProjects(projRes.data.projects);
        setActiveProjectId((prev) => prev || projRes.data.projects[0].id);
      }
      if (cfgRes.ok && Array.isArray(cfgRes.data?.configs)) {
        setAiConfigs(cfgRes.data.configs);
        const def =
          cfgRes.data.configs.find((c: AIProviderConfig) => c.isDefault) || cfgRes.data.configs[0];
        if (def) setActiveAiConfigId(def.id);
      }
    } catch {
      // Fallback to initial sample projects if offline
    } finally {
      setLoadingProjects(false);
    }
  }, []);

  useEffect(() => {
    fetchProjectsAndConfigs();
  }, [fetchProjectsAndConfigs]);

  // Listen to Firebase Auth state & merge user projects from Firestore
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      setFirebaseUser(user);
      if (user && user.emailVerified) {
        try {
          const cloudProjects = await fetchUserProjectsFromFirestore();
          if (cloudProjects.length > 0) {
            setProjects((prev) => {
              const map = new Map<string, PresentationProject>();
              prev.forEach((p) => map.set(p.id, p));
              cloudProjects.forEach((cp) => map.set(cp.id, cp));
              return Array.from(map.values()).sort(
                (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
              );
            });
          }
        } catch {
          // Firestore error handled by handleFirestoreError
        }
      }
    });
    return () => unsub();
  }, []);

  const activeProject =
    projects.find((p) => p.id === activeProjectId) || projects[0] || null;

  const saveProjectToServerAndCloud = useCallback(
    async (project: PresentationProject) => {
      setProjects((prev) => {
        const exists = prev.some((p) => p.id === project.id);
        if (exists) {
          return prev.map((p) => (p.id === project.id ? project : p));
        }
        return [project, ...prev];
      });

      if (!autosaveEnabled) return;

      try {
        await apiRequest('/api/projects', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(project),
        });
      } catch {
        // ignore transient network error
      }

      if (firebaseUser) {
        try {
          await syncProjectToFirestore(project);
        } catch {
          // handled
        }
      }
    },
    [autosaveEnabled, firebaseUser]
  );

  const handleDuplicateProject = async (proj: PresentationProject) => {
    try {
      const copy: PresentationProject = {
        ...proj,
        id: `proj-${Date.now()}`,
        title: `${proj.title} (Salinan)`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      await saveProjectToServerAndCloud(copy);
      notify(`Proyek "${copy.title}" berhasil diduplikasi.`, 'success');
    } catch {
      notify('Gagal menduplikasi proyek.', 'error');
    }
  };

  const handleConfirmRename = async () => {
    if (!renamingProject || !renamingProject.title.trim()) return;
    const target = projects.find((p) => p.id === renamingProject.id);
    if (!target) return;

    const updated: PresentationProject = {
      ...target,
      title: renamingProject.title.trim(),
      config: { ...target.config, title: renamingProject.title.trim() },
      updatedAt: new Date().toISOString(),
    };
    await saveProjectToServerAndCloud(updated);
    setRenamingProject(null);
    notify('Nama proyek berhasil diperbarui.', 'success');
  };

  const handleConfirmDelete = async () => {
    if (!deletingProject) return;
    const targetId = deletingProject.id;
    setProjects((prev) => prev.filter((p) => p.id !== targetId));
    if (activeProjectId === targetId) {
      const remaining = projects.filter((p) => p.id !== targetId);
      setActiveProjectId(remaining[0]?.id || '');
    }
    setDeletingProject(null);

    try {
      await apiRequest(`/api/projects/${targetId}`, { method: 'DELETE' });
      if (firebaseUser) {
        await deleteProjectFromFirestore(targetId);
      }
      notify('Proyek presentasi telah dihapus.', 'info');
    } catch {
      notify('Proyek dihapus dari daftar.', 'info');
    }
  };

  const handleExportPptxAction = async (proj: PresentationProject) => {
    try {
      notify(`Menyiapkan file PowerPoint "${proj.title}.pptx"...`, 'info');
      await downloadPresentationPptx(proj);
      notify('File PowerPoint (.pptx) berhasil diunduh!', 'success');
    } catch (err: any) {
      notify(err.message || 'Gagal mengunduh file PPTX.', 'error');
    }
  };

  const handleExportPdfAction = (proj: PresentationProject) => {
    try {
      downloadPresentationPdf(proj);
      notify('File PDF berhasil diunduh!', 'success');
    } catch (err: any) {
      notify(err.message || 'Gagal mengunduh file PDF.', 'error');
    }
  };

  const filteredProjects = projects.filter((p) => {
    const matchesSearch =
      !searchQuery.trim() ||
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.topic || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLang =
      languageFilter === 'all' || (p.config?.language || 'id') === languageFilter;
    return matchesSearch && matchesLang;
  });

  const navItems: { id: NavViewType; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'wizard', label: 'Buat Presentasi', icon: Sparkles },
    { id: 'projects', label: 'Semua Presentasi', icon: FolderKanban },
    { id: 'templates', label: 'Template', icon: LayoutTemplate },
    { id: 'editor', label: 'Editor Slide', icon: Sliders },
    { id: 'ai-settings', label: 'Pengaturan AI', icon: Settings },
    { id: 'app-settings', label: 'Pengaturan Aplikasi', icon: Palette },
    { id: 'help', label: 'Bantuan', icon: HelpCircle },
  ];

  const renderProjectCard = (proj: PresentationProject) => {
    const updatedDate = new Date(proj.updatedAt).toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
    const slideCount = proj.slides?.length || 0;

    return (
      <div
        key={proj.id}
        className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-lg p-5 flex flex-col justify-between gap-4 hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
      >
        <div className="space-y-2">
          {/* Clean unboxed metadata per Zero-Pill rule */}
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-mono tabular-nums">
            <span>{slideCount} Slide</span>
            <span aria-hidden="true">·</span>
            <span>Rasio {proj.config?.aspectRatio || '16:9'}</span>
            <span aria-hidden="true">·</span>
            <span>{(proj.config?.language || 'id').toUpperCase()}</span>
            <span aria-hidden="true">·</span>
            <span>Diedit {updatedDate}</span>
          </div>

          <h3
            onClick={() => {
              setActiveProjectId(proj.id);
              setActiveView('editor');
            }}
            className="text-base font-bold text-slate-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer line-clamp-2 leading-snug"
          >
            {proj.title}
          </h3>

          <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
            {proj.topic || 'Presentasi dibuat dengan AI PPT Studio.'}
          </p>
        </div>

        {/* Project Actions */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => {
                setActiveProjectId(proj.id);
                setActiveView('editor');
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors whitespace-nowrap"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Buka & Edit</span>
            </button>

            <button
              type="button"
              onClick={() => handleExportPptxAction(proj)}
              title="Download PPTX"
              className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-md hover:bg-slate-50 dark:hover:bg-slate-800 whitespace-nowrap"
            >
              <Download className="w-3.5 h-3.5" />
              <span>PPTX</span>
            </button>

            <button
              type="button"
              onClick={() => handleExportPdfAction(proj)}
              title="Download PDF"
              className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-md hover:bg-slate-50 dark:hover:bg-slate-800 whitespace-nowrap"
            >
              <FileDown className="w-3.5 h-3.5" />
              <span>PDF</span>
            </button>
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setRenamingProject({ id: proj.id, title: proj.title })}
              title="Ganti Nama Proyek"
              className="p-1.5 text-slate-500 hover:text-slate-900 dark:hover:text-white rounded hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <Edit3 className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => handleDuplicateProject(proj)}
              title="Duplikat Proyek"
              className="p-1.5 text-slate-500 hover:text-blue-600 rounded hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <Copy className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setDeletingProject(proj)}
              title="Hapus Proyek"
              className="p-1.5 text-slate-500 hover:text-red-600 rounded hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={darkMode ? 'dark' : ''}>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex">
        {/* Desktop Sidebar Navigation (260px) */}
        <aside className="hidden lg:flex lg:flex-col lg:w-64 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shrink-0 justify-between">
          <div className="p-5 space-y-6">
            {/* Brand Wordmark */}
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => setActiveView('dashboard')}
                className="text-lg font-bold tracking-tight text-slate-900 dark:text-white whitespace-nowrap"
              >
                AI PPT Studio
              </button>
            </div>

            {/* Primary CTA Button */}
            <button
              type="button"
              onClick={() => {
                setQuickTopic('');
                setQuickSourceMode('topic');
                setActiveView('wizard');
              }}
              className="w-full py-2.5 px-4 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg flex items-center justify-center gap-2 transition-colors whitespace-nowrap"
            >
              <Plus className="w-4 h-4" />
              <span>Buat Presentasi Baru</span>
            </button>

            {/* 8 Menu Items */}
            <nav className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeView === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setActiveView(item.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
                      isActive
                        ? 'bg-slate-900 text-white dark:bg-blue-600 dark:text-white'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Bottom Account & Cloud Sync Footer */}
          <div className="p-4 border-t border-slate-200 dark:border-slate-800 space-y-3">
            {firebaseUser ? (
              <div className="space-y-2">
                <div className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                  {firebaseUser.displayName || firebaseUser.email}
                </div>
                <div className="text-[11px] text-slate-500 truncate">
                  Cloud Firestore Sync Aktif
                </div>
                <button
                  type="button"
                  onClick={() => signOutUser()}
                  className="w-full py-1.5 px-3 text-xs font-medium text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center gap-1.5"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Keluar Akun</span>
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="text-[11px] text-slate-500">
                  Penyimpanan Server Aktif · Login untuk sinkronisasi Cloud
                </div>
                <button
                  type="button"
                  onClick={() =>
                    signInWithGoogle()
                      .then(() => notify('Berhasil masuk dengan akun Google.', 'success'))
                      .catch(() =>
                        notify('Login dibatalkan atau jendela popup diblokir.', 'info')
                      )
                  }
                  className="w-full py-2 px-3 text-xs font-semibold text-slate-800 dark:text-white border border-slate-300 dark:border-slate-700 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center gap-2"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Sinkronkan via Google</span>
                </button>
              </div>
            )}
          </div>
        </aside>

        {/* Mobile Sidebar Drawer */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex">
            <div
              className="fixed inset-0 bg-black/50"
              onClick={() => setMobileMenuOpen(false)}
            />
            <div className="relative w-64 max-w-[80vw] bg-white dark:bg-slate-900 h-full p-5 flex flex-col justify-between z-10">
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <span className="text-base font-bold text-slate-900 dark:text-white">
                    AI PPT Studio
                  </span>
                  <button
                    type="button"
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-1 text-slate-500"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <nav className="space-y-1">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => {
                          setActiveView(item.id);
                          setMobileMenuOpen(false);
                        }}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 text-xs font-semibold rounded-md ${
                          activeView === item.id
                            ? 'bg-blue-600 text-white'
                            : 'text-slate-600 dark:text-slate-400'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span>{item.label}</span>
                      </button>
                    );
                  })}
                </nav>
              </div>
            </div>
          </div>
        )}

        {/* Main Content Viewport */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Top Bar Following Strict 3-Zone Contract */}
          <header className="flex items-center justify-between gap-8 px-6 py-3.5 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shrink-0">
            {/* Zone 1: Mobile Menu Trigger + Contextual Breadcrumb Title */}
            <div className="flex items-center gap-3 min-w-0">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(true)}
                className="lg:hidden p-1.5 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded"
              >
                <Menu className="w-4 h-4" />
              </button>
              <span className="text-sm font-bold tracking-tight text-slate-900 dark:text-white whitespace-nowrap shrink-0">
                {navItems.find((n) => n.id === activeView)?.label || 'AI PPT Studio'}
              </span>
            </div>

            {/* Zone 2: Quick Navigation Links */}
            <nav className="hidden md:flex items-center gap-6 text-xs font-medium text-slate-600 dark:text-slate-400">
              <button
                type="button"
                onClick={() => setActiveView('dashboard')}
                className="hover:text-slate-900 dark:hover:text-white transition-colors whitespace-nowrap shrink-0"
              >
                Dashboard
              </button>
              <button
                type="button"
                onClick={() => setActiveView('wizard')}
                className="hover:text-slate-900 dark:hover:text-white transition-colors whitespace-nowrap shrink-0"
              >
                Generator AI
              </button>
              <button
                type="button"
                onClick={() => setActiveView('templates')}
                className="hover:text-slate-900 dark:hover:text-white transition-colors whitespace-nowrap shrink-0"
              >
                Template (12)
              </button>
              <button
                type="button"
                onClick={() => setActiveView('editor')}
                className="hover:text-slate-900 dark:hover:text-white transition-colors whitespace-nowrap shrink-0"
              >
                Editor Slide
              </button>
              <button
                type="button"
                onClick={() => setActiveView('ai-settings')}
                className="hover:text-slate-900 dark:hover:text-white transition-colors whitespace-nowrap shrink-0"
              >
                Konfigurasi AI
              </button>
            </nav>

            {/* Zone 3: Primary Action + Theme Switch */}
            <div className="flex items-center gap-2.5 shrink-0">
              <button
                type="button"
                onClick={() => setDarkMode((d) => !d)}
                title={darkMode ? 'Beralih ke Mode Terang' : 'Beralih ke Mode Gelap'}
                className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md"
              >
                {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>
              <button
                type="button"
                onClick={() => setActiveView('wizard')}
                className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors whitespace-nowrap shrink-0"
              >
                Buat Presentasi Baru
              </button>
            </div>
          </header>

          {/* Main Workspace Container */}
          <main className="flex-1 p-6 md:p-8 overflow-y-auto">
            {/* VIEW 1: DASHBOARD */}
            {activeView === 'dashboard' && (
              <div className="max-w-6xl mx-auto space-y-8">
                {/* Hero Quick Presentation Launcher */}
                <section className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-lg p-6 md:p-8">
                  <div className="max-w-3xl space-y-3">
                    <div className="text-xs font-medium text-blue-600 dark:text-blue-400">
                      AI PPT Studio · Create Stunning Presentations with AI
                    </div>
                    <h1
                      className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white tracking-tight"
                      style={{ textWrap: 'balance' }}
                    >
                      Buat Presentasi PowerPoint Profesional dari Topik, Teks, atau Dokumen
                    </h1>
                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                      Susun kerangka slide otomatis dengan AI, sesuaikan tata letak visual (tabel,
                      grafik, linimasa, perbandingan), lengkapi catatan pembicara, dan unduh sebagai
                      file <strong>.PPTX</strong> asli maupun <strong>.PDF</strong>.
                    </p>
                  </div>

                  {/* Source Mode Tabs */}
                  <div className="mt-6 space-y-3">
                    <div className="inline-flex flex-wrap p-1 bg-slate-100 dark:bg-slate-800 rounded-lg gap-1">
                      {[
                        { id: 'topic', label: 'Buat dari Topik / Ide', icon: Sparkles },
                        {
                          id: 'visual-reference',
                          label: 'Referensi Gaya Visual (Style Guide A–E)',
                          icon: Palette,
                        },
                        { id: 'text', label: 'Buat dari Teks Materi', icon: FileText },
                        { id: 'document', label: 'Unggah Dokumen (PDF/DOCX/PPTX)', icon: Upload },
                      ].map((m) => {
                        const Icon = m.icon;
                        return (
                          <button
                            key={m.id}
                            type="button"
                            onClick={() => setQuickSourceMode(m.id as any)}
                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
                              quickSourceMode === m.id
                                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                            }`}
                          >
                            <Icon className="w-3.5 h-3.5" />
                            <span>{m.label}</span>
                          </button>
                        );
                      })}
                    </div>

                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        setActiveView('wizard');
                      }}
                      className="flex flex-col sm:flex-row gap-3"
                    >
                      <input
                        type="text"
                        value={quickTopic}
                        onChange={(e) => setQuickTopic(e.target.value)}
                        placeholder={
                          quickSourceMode === 'topic'
                            ? 'Ketik topik presentasi, judul kuliah, atau materi bisnis Anda...'
                            : quickSourceMode === 'visual-reference'
                            ? 'Masukkan topik baru lintas bidang, lalu unggah file Referensi Gaya Visual di langkah berikutnya...'
                            : quickSourceMode === 'text'
                            ? 'Masukkan judul materi, lalu tempel teks lengkap di langkah berikutnya...'
                            : 'Masukkan judul proyek, lalu unggah file PDF/DOCX/PPTX di langkah berikutnya...'
                        }
                        className="flex-1 px-4 py-3 text-sm border border-slate-300 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:border-blue-600"
                      />
                      <button
                        type="submit"
                        className="px-6 py-3 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg inline-flex items-center justify-center gap-2 transition-colors whitespace-nowrap shrink-0"
                      >
                        <Sparkles className="w-4 h-4" />
                        <span>Buat Presentasi Baru</span>
                      </button>
                    </form>
                  </div>
                </section>

                {/* Recent Projects Section with Search & Filter */}
                <section className="space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                        Proyek Presentasi Terakhir ({filteredProjects.length})
                      </h2>
                      <p className="text-xs text-slate-500">
                        Buka kembali, edit di kanvas 3-panel, duplikat, atau ekspor langsung ke PowerPoint (.pptx).
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <div className="relative">
                        <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          placeholder="Cari judul atau topik..."
                          className="pl-8 pr-3 py-1.5 text-xs border border-slate-300 dark:border-slate-700 rounded-md bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                        />
                      </div>

                      <div className="flex items-center gap-1 p-1 bg-slate-200/70 dark:bg-slate-800 rounded-md">
                        {[
                          { id: 'all', label: 'Semua' },
                          { id: 'id', label: 'Indonesia' },
                          { id: 'en', label: 'English' },
                        ].map((flt) => (
                          <button
                            key={flt.id}
                            type="button"
                            onClick={() => setLanguageFilter(flt.id as any)}
                            className={`px-2.5 py-1 text-xs font-medium rounded transition-colors ${
                              languageFilter === flt.id
                                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                                : 'text-slate-600 dark:text-slate-400'
                            }`}
                          >
                            {flt.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {loadingProjects ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[1, 2].map((n) => (
                        <div
                          key={n}
                          className="h-44 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-lg p-5 animate-pulse"
                        />
                      ))}
                    </div>
                  ) : filteredProjects.length === 0 ? (
                    <div className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-lg p-10 text-center space-y-3">
                      <FolderKanban className="w-8 h-8 text-slate-400 mx-auto" />
                      <div className="text-sm font-bold text-slate-900 dark:text-white">
                        Belum Ada Proyek Presentasi yang Sesuai
                      </div>
                      <p className="text-xs text-slate-500 max-w-md mx-auto">
                        Mulai buat presentasi pertama Anda dari topik, teks materi kuliah, atau unggah dokumen PDF/DOCX menggunakan generator AI.
                      </p>
                      <button
                        type="button"
                        onClick={() => setActiveView('wizard')}
                        className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-md"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Buat Presentasi Pertama</span>
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {filteredProjects.map(renderProjectCard)}
                    </div>
                  )}
                </section>

                {/* Recommended Templates Strip */}
                <section className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                        Template yang Direkomendasikan
                      </h2>
                      <p className="text-xs text-slate-500">
                        Pilih template akademik, seminar penelitian, sidang skripsi, atau bisnis korporat.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setActiveView('templates')}
                      className="text-xs font-semibold text-blue-600 hover:underline"
                    >
                      Lihat Semua 12 Kategori →
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {PRESENTATION_TEMPLATES.slice(0, 4).map((tpl) => (
                      <div
                        key={tpl.id}
                        className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-lg p-4 flex flex-col justify-between gap-3"
                      >
                        <div>
                          <div className="flex items-center gap-1.5 mb-2">
                            <span
                              className="w-3.5 h-3.5 rounded-xs"
                              style={{ backgroundColor: tpl.theme.primaryColor }}
                            />
                            <span
                              className="w-3.5 h-3.5 rounded-xs"
                              style={{ backgroundColor: tpl.theme.secondaryColor }}
                            />
                            <span className="text-[11px] text-slate-500 ml-1 truncate">
                              {tpl.category}
                            </span>
                          </div>
                          <div className="text-sm font-bold text-slate-900 dark:text-white">
                            {tpl.name}
                          </div>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                            {tpl.description}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setWizardInitialTemplateId(tpl.id);
                            setActiveView('wizard');
                          }}
                          className="w-full py-1.5 px-3 text-xs font-semibold text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800 hover:bg-blue-50 dark:hover:bg-blue-950/40 rounded-md transition-colors"
                        >
                          Gunakan Template Ini
                        </button>
                      </div>
                    ))}
                  </div>
                </section>
              </div>
            )}

            {/* VIEW 2: AI PRESENTATION GENERATOR WIZARD */}
            {activeView === 'wizard' && (
              <PresentationWizard
                initialTopic={quickTopic}
                initialSourceType={quickSourceMode}
                initialTemplateId={wizardInitialTemplateId}
                activeAiConfigId={activeAiConfigId}
                defaultLanguage={defaultLanguage}
                onCompleteProject={async (newProj) => {
                  await saveProjectToServerAndCloud(newProj);
                  setActiveProjectId(newProj.id);
                  setActiveView('editor');
                  notify(`Presentasi "${newProj.title}" berhasil dibuat dan disimpan!`, 'success');
                }}
                onNotify={notify}
              />
            )}

            {/* VIEW 3: SEMUA PRESENTASI */}
            {activeView === 'projects' && (
              <div className="max-w-6xl mx-auto space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-4 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-lg p-6">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                      Semua Proyek Presentasi ({projects.length})
                    </h2>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-0.5">
                      Kelola seluruh proyek presentasi Anda, duplikat versi, ganti nama, atau unduh sebagai PPTX dan PDF.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Cari proyek..."
                        className="pl-8 pr-3 py-2 text-xs border border-slate-300 dark:border-slate-700 rounded-md bg-white dark:bg-slate-950"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => setActiveView('wizard')}
                      className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-md"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Proyek Baru</span>
                    </button>
                  </div>
                </div>

                {filteredProjects.length === 0 ? (
                  <div className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-lg p-12 text-center space-y-3">
                    <div className="text-sm font-bold">Tidak ada proyek ditemukan</div>
                    <button
                      type="button"
                      onClick={() => setActiveView('wizard')}
                      className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 rounded-md"
                    >
                      Buat Presentasi Baru
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredProjects.map(renderProjectCard)}
                  </div>
                )}
              </div>
            )}

            {/* VIEW 4: TEMPLATE GALLERY */}
            {activeView === 'templates' && (
              <div className="max-w-6xl mx-auto">
                <TemplateGalleryView
                  activeProject={activeProject}
                  onApplyTemplateToActive={(tpl: TemplateDefinition) => {
                    if (!activeProject) return;
                    const updated: PresentationProject = {
                      ...activeProject,
                      theme: { ...tpl.theme },
                      updatedAt: new Date().toISOString(),
                    };
                    saveProjectToServerAndCloud(updated);
                    notify(
                      `Template "${tpl.name}" diterapkan ke proyek "${activeProject.title}".`,
                      'success'
                    );
                    setActiveView('editor');
                  }}
                  onStartNewWithTemplate={(tpl: TemplateDefinition) => {
                    setWizardInitialTemplateId(tpl.id);
                    setActiveView('wizard');
                  }}
                />
              </div>
            )}

            {/* VIEW 5: 3-PANEL POWERPOINT EDITOR */}
            {activeView === 'editor' &&
              (activeProject ? (
                <SlideEditorView
                  project={activeProject}
                  activeAiConfigId={activeAiConfigId}
                  onUpdateProject={(updated) => saveProjectToServerAndCloud(updated)}
                  onExportPptx={handleExportPptxAction}
                  onExportPdf={handleExportPdfAction}
                  onNotify={notify}
                />
              ) : (
                <div className="max-w-xl mx-auto border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-lg p-10 text-center space-y-3">
                  <div className="text-base font-bold">Belum Ada Proyek Aktif</div>
                  <p className="text-xs text-slate-500">
                    Pilih proyek dari Dashboard atau buat presentasi baru terlebih dahulu.
                  </p>
                  <button
                    type="button"
                    onClick={() => setActiveView('wizard')}
                    className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 rounded-md"
                  >
                    Buat Presentasi Baru
                  </button>
                </div>
              ))}

            {/* VIEW 6: PENGATURAN AI & MODEL ROUTING */}
            {activeView === 'ai-settings' && (
              <AISettingsView
                configs={aiConfigs}
                onRefreshConfigs={fetchProjectsAndConfigs}
                onSelectDefaultConfig={(id) => setActiveAiConfigId(id)}
                onNotify={notify}
              />
            )}

            {/* VIEW 7: PENGATURAN APLIKASI */}
            {activeView === 'app-settings' && (
              <AppSettingsView
                darkMode={darkMode}
                onToggleDarkMode={setDarkMode}
                defaultLanguage={defaultLanguage}
                onChangeDefaultLanguage={setDefaultLanguage}
                defaultAspectRatio={defaultAspectRatio}
                onChangeDefaultAspectRatio={setDefaultAspectRatio}
                autosaveEnabled={autosaveEnabled}
                onToggleAutosave={setAutosaveEnabled}
                projects={projects}
                onImportProjectsBackup={async (imported) => {
                  for (const proj of imported) {
                    if (proj.id && proj.title && Array.isArray(proj.slides)) {
                      await saveProjectToServerAndCloud(proj);
                    }
                  }
                }}
                onNotify={notify}
              />
            )}

            {/* VIEW 8: BANTUAN */}
            {activeView === 'help' && <HelpDocumentationView />}
          </main>
        </div>

        {/* RENAME PROJECT MODAL */}
        {renamingProject && (
          <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg max-w-md w-full p-5 space-y-4 shadow-lg">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Ganti Nama Proyek Presentasi
              </h3>
              <input
                type="text"
                value={renamingProject.title}
                onChange={(e) =>
                  setRenamingProject({ ...renamingProject, title: e.target.value })
                }
                className="w-full px-3 py-2 text-sm border border-slate-300 dark:border-slate-700 rounded-md bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setRenamingProject(null)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 border border-slate-300 dark:border-slate-700 rounded-md"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={handleConfirmRename}
                  className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-md"
                >
                  Simpan Nama
                </button>
              </div>
            </div>
          </div>
        )}

        {/* DELETE CONFIRMATION MODAL */}
        {deletingProject && (
          <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg max-w-md w-full p-5 space-y-4 shadow-lg">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Konfirmasi Hapus Proyek
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Apakah Anda yakin ingin menghapus proyek{' '}
                <strong>&quot;{deletingProject.title}&quot;</strong> ({deletingProject.slides.length}{' '}
                slide)? Tindakan ini tidak dapat dibatalkan.
              </p>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setDeletingProject(null)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 border border-slate-300 dark:border-slate-700 rounded-md"
                >
                  Batalkan
                </button>
                <button
                  type="button"
                  onClick={handleConfirmDelete}
                  className="px-4 py-2 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded-md"
                >
                  Ya, Hapus Proyek
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TOAST NOTIFICATIONS */}
        <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
          {toasts.map((t) => (
            <div
              key={t.id}
              className={`pointer-events-auto p-3.5 rounded-lg border shadow-md flex items-center justify-between gap-3 text-xs font-medium transition-all ${
                t.type === 'success'
                  ? 'bg-emerald-950 text-emerald-100 border-emerald-800'
                  : t.type === 'error'
                  ? 'bg-red-950 text-red-100 border-red-800'
                  : 'bg-slate-900 text-white border-slate-700'
              }`}
            >
              <div className="flex items-center gap-2">
                {t.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : t.type === 'error' ? (
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                ) : (
                  <Sparkles className="w-4 h-4 text-blue-400 shrink-0" />
                )}
                <span>{t.message}</span>
              </div>
              <button
                type="button"
                onClick={() => setToasts((prev) => prev.filter((item) => item.id !== t.id))}
                className="opacity-70 hover:opacity-100"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
