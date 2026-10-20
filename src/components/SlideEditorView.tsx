import React, { useState, useEffect, useCallback } from 'react';
import {
  CustomSlideElement,
  PresentationProject,
  PresentationTheme,
  SlideAIActionType,
  SlideData,
  SlideLayoutType,
} from '../types/presentation';
import { PRESENTATION_TEMPLATES } from '../data/templates';
import { SlideCanvasPreview } from './SlideCanvasPreview';
import { analyzePresentationQuality } from '../lib/qualityChecker';
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  AlertTriangle,
  ArrowDown,
  ArrowUp,
  BarChart3,
  Bold,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Copy,
  Download,
  FileDown,
  Italic,
  Layout,
  Loader2,
  Maximize2,
  Minimize2,
  Palette,
  Plus,
  Redo2,
  ShieldCheck,
  Sparkles,
  Square,
  Table,
  Trash2,
  Type as TypeIcon,
  Undo2,
  X,
} from 'lucide-react';

interface SlideEditorViewProps {
  project: PresentationProject;
  activeAiConfigId?: string;
  onUpdateProject: (updated: PresentationProject) => void;
  onExportPptx: (project: PresentationProject) => Promise<void>;
  onExportPdf: (project: PresentationProject) => void;
  onNotify: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

const SLIDE_LAYOUTS: { value: SlideLayoutType; label: string }[] = [
  { value: 'cover', label: 'Cover / Sampul' },
  { value: 'agenda', label: 'Agenda' },
  { value: 'concept', label: 'Konsep & Poin' },
  { value: 'comparison', label: 'Perbandingan' },
  { value: 'process', label: 'Diagram Proses' },
  { value: 'timeline', label: 'Timeline' },
  { value: 'statistics', label: 'Kartu Statistik' },
  { value: 'chart', label: 'Grafik Data' },
  { value: 'table', label: 'Tabel Data' },
  { value: 'case-study', label: 'Studi Kasus' },
  { value: 'conclusion', label: 'Kesimpulan' },
  { value: 'references', label: 'Referensi' },
];

export const SlideEditorView: React.FC<SlideEditorViewProps> = ({
  project,
  activeAiConfigId,
  onUpdateProject,
  onExportPptx,
  onExportPdf,
  onNotify,
}) => {
  const [activeSlideIdx, setActiveSlideIdx] = useState(0);
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const [zoom, setZoom] = useState(100);
  const [rightTab, setRightTab] = useState<'design' | 'ai' | 'quality'>('design');
  const [bottomTab, setBottomTab] = useState<'notes' | 'data' | 'references'>('notes');
  const [isPresentMode, setIsPresentMode] = useState(false);
  const [showPresenterNotesInFullscreen, setShowPresenterNotesInFullscreen] = useState(true);
  const [exportingPptx, setExportingPptx] = useState(false);

  // Undo / Redo History Stack
  const [history, setHistory] = useState<PresentationProject[]>([project]);
  const [historyIdx, setHistoryIdx] = useState(0);
  const [lastSavedTime, setLastSavedTime] = useState<string>(
    new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
  );

  // AI Action & Non-destructive Comparison Modal State
  const [runningAiAction, setRunningAiAction] = useState<SlideAIActionType | null>(null);
  const [targetTone, setTargetTone] = useState('akademik & eksekutif');
  const [targetLang, setTargetLang] = useState<'id' | 'en'>('en');
  const [aiProposal, setAiProposal] = useState<{
    action: SlideAIActionType;
    explanation: string;
    proposedSlide: SlideData;
  } | null>(null);

  // Manual Reference Input State
  const [newRefCitation, setNewRefCitation] = useState('');
  const [newRefUrl, setNewRefUrl] = useState('');

  // Keep activeSlideIdx in valid range
  const safeSlideIdx = Math.min(
    Math.max(0, activeSlideIdx),
    Math.max(0, (project.slides?.length || 1) - 1)
  );
  const activeSlide: SlideData = project.slides[safeSlideIdx] || {
    id: 'sld-empty',
    slideNumber: 1,
    title: 'Slide Baru',
    layout: 'concept',
    bullets: ['Poin pertama'],
    customElements: [],
    speakerNotes: '',
    references: [],
  };

  const commitProjectChange = useCallback(
    (nextProject: PresentationProject, recordUndo = true) => {
      const timestamped: PresentationProject = {
        ...nextProject,
        updatedAt: new Date().toISOString(),
      };
      onUpdateProject(timestamped);
      setLastSavedTime(
        new Date().toLocaleTimeString('id-ID', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })
      );
      if (recordUndo) {
        setHistory((prev) => {
          const sliced = prev.slice(0, historyIdx + 1);
          return [...sliced.slice(-24), timestamped];
        });
        setHistoryIdx((prev) => Math.min(prev + 1, 24));
      }
    },
    [historyIdx, onUpdateProject]
  );

  const handleUndo = () => {
    if (historyIdx <= 0) return;
    const prevProj = history[historyIdx - 1];
    setHistoryIdx(historyIdx - 1);
    onUpdateProject(prevProj);
  };

  const handleRedo = () => {
    if (historyIdx >= history.length - 1) return;
    const nextProj = history[historyIdx + 1];
    setHistoryIdx(nextProj ? historyIdx + 1 : historyIdx);
    if (nextProj) onUpdateProject(nextProj);
  };

  // Keyboard navigation in Present Mode
  useEffect(() => {
    if (!isPresentMode) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        setActiveSlideIdx((i) => Math.min(project.slides.length - 1, i + 1));
      } else if (e.key === 'ArrowLeft') {
        setActiveSlideIdx((i) => Math.max(0, i - 1));
      } else if (e.key === 'Escape') {
        setIsPresentMode(false);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isPresentMode, project.slides.length]);

  const updateActiveSlide = (updates: Partial<SlideData>) => {
    const nextSlides = project.slides.map((s, idx) =>
      idx === safeSlideIdx ? { ...s, ...updates } : s
    );
    commitProjectChange({ ...project, slides: nextSlides });
  };

  const updateTheme = (themeUpdates: Partial<PresentationTheme>) => {
    commitProjectChange({
      ...project,
      theme: {
        ...project.theme,
        ...themeUpdates,
      },
    });
  };

  const addSlide = () => {
    const newNum = project.slides.length + 1;
    const newSlide: SlideData = {
      id: `sld-${Date.now()}`,
      slideNumber: newNum,
      title: `Slide Pembahasan ${newNum}`,
      subtitle: 'Tambahkan subjudul atau gagasan utama',
      layout: 'concept',
      bullets: [
        'Poin utama pertama yang ingin disampaikan',
        'Poin pendukung kedua beserta bukti atau contoh',
        'Rekomendasi atau langkah tindak lanjut',
      ],
      bodyText: '',
      customElements: [],
      speakerNotes: 'Catatan pembicara untuk slide ini.',
      references: [],
    };
    const nextSlides = [...project.slides, newSlide];
    commitProjectChange({
      ...project,
      slides: nextSlides,
      config: { ...project.config, slideCount: nextSlides.length },
    });
    setActiveSlideIdx(nextSlides.length - 1);
    onNotify('Slide baru berhasil ditambahkan.', 'success');
  };

  const duplicateSlide = (idx: number) => {
    const target = project.slides[idx];
    if (!target) return;
    const copy: SlideData = {
      ...JSON.parse(JSON.stringify(target)),
      id: `sld-${Date.now()}`,
      title: `${target.title} (Salinan)`,
    };
    const nextSlides = [...project.slides];
    nextSlides.splice(idx + 1, 0, copy);
    const renumbered = nextSlides.map((s, i) => ({ ...s, slideNumber: i + 1 }));
    commitProjectChange({
      ...project,
      slides: renumbered,
      config: { ...project.config, slideCount: renumbered.length },
    });
    setActiveSlideIdx(idx + 1);
    onNotify('Slide berhasil diduplikasi.', 'success');
  };

  const deleteSlide = (idx: number) => {
    if (project.slides.length <= 1) {
      onNotify('Presentasi wajib memiliki minimal 1 slide.', 'error');
      return;
    }
    const nextSlides = project.slides
      .filter((_, i) => i !== idx)
      .map((s, i) => ({ ...s, slideNumber: i + 1 }));
    commitProjectChange({
      ...project,
      slides: nextSlides,
      config: { ...project.config, slideCount: nextSlides.length },
    });
    setActiveSlideIdx(Math.max(0, idx - 1));
    onNotify('Slide dihapus.', 'info');
  };

  const moveSlide = (idx: number, dir: 'up' | 'down') => {
    const targetIdx = dir === 'up' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= project.slides.length) return;
    const nextSlides = [...project.slides];
    const [moved] = nextSlides.splice(idx, 1);
    nextSlides.splice(targetIdx, 0, moved);
    const renumbered = nextSlides.map((s, i) => ({ ...s, slideNumber: i + 1 }));
    commitProjectChange({ ...project, slides: renumbered });
    setActiveSlideIdx(targetIdx);
  };

  // Add Custom Element to Active Slide
  const addCustomElement = (type: 'textbox' | 'shape' | 'callout') => {
    const newEl: CustomSlideElement = {
      id: `el-${Date.now()}`,
      type,
      content:
        type === 'textbox'
          ? 'Teks Kustom Baru (Klik untuk mengedit)'
          : type === 'callout'
          ? 'Catatan Penting / Highlight'
          : 'Kotak Visual',
      x: 55,
      y: 55,
      width: 36,
      height: 18,
      fontSize: 13,
      fontWeight: type === 'textbox' ? 'normal' : 'bold',
      fontStyle: 'normal',
      textAlign: type === 'shape' ? 'center' : 'left',
      textColor: project.theme.textColor || '#0F172A',
      backgroundColor:
        type === 'textbox' ? 'transparent' : project.theme.surfaceColor || '#F8FAFC',
      borderColor: project.theme.primaryColor || '#1E3A8A',
      shapeVariant: 'rounded',
    };
    const nextElements = [...(activeSlide.customElements || []), newEl];
    updateActiveSlide({ customElements: nextElements });
    setSelectedElementId(newEl.id);
    setRightTab('design');
  };

  const updateCustomElement = (elId: string, updates: Partial<CustomSlideElement>) => {
    const nextElements = (activeSlide.customElements || []).map((el) =>
      el.id === elId ? { ...el, ...updates } : el
    );
    updateActiveSlide({ customElements: nextElements });
  };

  const deleteCustomElement = (elId: string) => {
    const nextElements = (activeSlide.customElements || []).filter((el) => el.id !== elId);
    updateActiveSlide({ customElements: nextElements });
    setSelectedElementId(null);
  };

  const insertStructuredPreset = (targetLayout: SlideLayoutType) => {
    const patch: Partial<SlideData> = { layout: targetLayout };
    if (targetLayout === 'table' && !activeSlide.tableData) {
      patch.tableData = {
        headers: ['Indikator / Parameter', 'Kondisi Awal', 'Target Capaian'],
        rows: [
          ['Efisiensi Proses', 'Standar Manual', 'Otomatisasi Terukur'],
          ['Akurasi Validasi', 'Perlu Pemeriksaan Ulang', 'Terstandarisasi'],
          ['Waktu Penyelesaian', '45 Menit / Siklus', '12 Menit / Siklus'],
        ],
      };
    } else if (targetLayout === 'chart' && !activeSlide.chartData) {
      patch.chartData = {
        chartType: 'bar',
        title: 'Perbandingan Indikator Kinerja',
        labels: ['Q1', 'Q2', 'Q3', 'Q4'],
        values: [42, 58, 74, 89],
        unit: 'Poin',
        sourceNote: 'Data aktual yang dimasukkan oleh pengguna',
      };
    } else if (targetLayout === 'process' && !activeSlide.processSteps) {
      patch.processSteps = [
        { step: '01', title: 'Identifikasi', detail: 'Pemetaan kebutuhan dan ruang lingkup masalah.' },
        { step: '02', title: 'Perancangan', detail: 'Penyusunan arsitektur dan prototipe solusi.' },
        { step: '03', title: 'Implementasi', detail: 'Eksekusi terukur dan integrasi sistem.' },
        { step: '04', title: 'Evaluasi', detail: 'Pengukuran dampak dan audit kualitas.' },
      ];
    } else if (targetLayout === 'statistics' && !activeSlide.statCards) {
      patch.statCards = [
        { value: '3.2x', label: 'Kecepatan Analisis', context: 'Dibandingkan metode manual' },
        { value: '98.5%', label: 'Kepatuhan Standar', context: 'Berdasarkan uji verifikasi' },
        { value: '-40%', label: 'Waktu Rekapitulasi', context: 'Efisiensi jam kerja tim' },
      ];
    } else if (targetLayout === 'comparison' && !activeSlide.comparison) {
      patch.comparison = {
        leftTitle: 'Metode Konvensional',
        leftItems: ['Proses bertahap manual', 'Dokumentasi terpisah', 'Waktu tunggu lebih lama'],
        rightTitle: 'Pendekatan Terintegrasi',
        rightItems: ['Otomatisasi alur kerja', 'Satu basis data terpadu', 'Pemantauan real-time'],
      };
    } else if (targetLayout === 'timeline' && !activeSlide.timelineItems) {
      patch.timelineItems = [
        { period: 'Tahap 1', event: 'Persiapan & Riset Dasar', impact: 'Penyusunan dokumen spesifikasi' },
        { period: 'Tahap 2', event: 'Pengembangan Inti', impact: 'Integrasi modul utama' },
        { period: 'Tahap 3', event: 'Uji Coba & Validasi', impact: 'Pengujian pengguna terbatas' },
        { period: 'Tahap 4', event: 'Peluncuran Penuh', impact: 'Operasional dan evaluasi berkala' },
      ];
    }
    updateActiveSlide(patch);
    setBottomTab('data');
    onNotify(`Layout slide diubah ke ${targetLayout.toUpperCase()}.`, 'info');
  };

  // Run Per-Slide AI Action -> Show Non-Destructive Proposal Modal
  const runSlideAiAction = async (action: SlideAIActionType) => {
    setRunningAiAction(action);
    try {
      const response = await fetch('/api/ai/slide-action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slide: activeSlide,
          action,
          options: {
            targetTone,
            targetLanguage: targetLang,
          },
          projectContext: {
            title: project.title,
            topic: project.topic,
            language: project.config?.language || 'id',
          },
          aiConfigId: activeAiConfigId,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Gagal menjalankan AI Tool.');
      }
      setAiProposal({
        action,
        explanation: data.explanation,
        proposedSlide: data.proposedSlide,
      });
    } catch (err: any) {
      onNotify(err.message || 'Gagal menjalankan tindakan AI.', 'error');
    } finally {
      setRunningAiAction(null);
    }
  };

  const applyAiProposal = () => {
    if (!aiProposal) return;
    updateActiveSlide(aiProposal.proposedSlide);
    setAiProposal(null);
    onNotify('Usulan perbaikan AI berhasil diterapkan ke slide.', 'success');
  };

  const qualityIssues = analyzePresentationQuality(project);
  const selectedCustomElement = (activeSlide.customElements || []).find(
    (el) => el.id === selectedElementId
  );

  // Fullscreen Present Mode View
  if (isPresentMode) {
    return (
      <div className="fixed inset-0 z-50 bg-slate-950 text-white flex flex-col justify-between p-4 md:p-8">
        {/* Top Bar */}
        <div className="flex items-center justify-between gap-4 pb-3 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <span className="text-sm font-bold tracking-tight">{project.title}</span>
            <span className="text-xs text-slate-400 font-mono tabular-nums">
              · Slide {safeSlideIdx + 1} dari {project.slides.length}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowPresenterNotesInFullscreen((v) => !v)}
              className="px-3 py-1.5 text-xs font-medium bg-slate-800 hover:bg-slate-700 rounded-md"
            >
              {showPresenterNotesInFullscreen ? 'Sembunyikan Catatan' : 'Tampilkan Catatan Pembicara'}
            </button>
            <button
              type="button"
              onClick={() => setIsPresentMode(false)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-red-600 hover:bg-red-700 rounded-md"
            >
              <Minimize2 className="w-3.5 h-3.5" />
              <span>Keluar (ESC)</span>
            </button>
          </div>
        </div>

        {/* Center Slide Stage */}
        <div className="flex-1 flex items-center justify-center overflow-hidden my-4">
          <div className="w-full max-w-5xl">
            <SlideCanvasPreview
              slide={activeSlide}
              totalSlides={project.slides.length}
              theme={project.theme}
              aspectRatio={project.config?.aspectRatio || '16:9'}
              editable={false}
            />
          </div>
        </div>

        {/* Bottom Controls + Speaker Notes */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-3 border-t border-slate-800">
          {showPresenterNotesInFullscreen && (
            <div className="flex-1 text-xs text-slate-300 bg-slate-900/90 border border-slate-800 rounded-md p-3 max-h-24 overflow-y-auto w-full">
              <span className="font-semibold text-blue-400 mr-2">Catatan Pembicara:</span>
              {activeSlide.speakerNotes || 'Tidak ada catatan pembicara pada slide ini.'}
            </div>
          )}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              disabled={safeSlideIdx === 0}
              onClick={() => setActiveSlideIdx((i) => Math.max(0, i - 1))}
              className="inline-flex items-center gap-1 px-4 py-2 text-xs font-semibold bg-slate-800 hover:bg-slate-700 rounded-md disabled:opacity-40"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Sebelumnya</span>
            </button>
            <button
              type="button"
              disabled={safeSlideIdx === project.slides.length - 1}
              onClick={() =>
                setActiveSlideIdx((i) => Math.min(project.slides.length - 1, i + 1))
              }
              className="inline-flex items-center gap-1 px-4 py-2 text-xs font-semibold bg-blue-600 hover:bg-blue-700 rounded-md disabled:opacity-40"
            >
              <span>Berikutnya</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Top Editor Command Bar */}
      <div className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-lg p-3 flex flex-wrap items-center justify-between gap-3">
        {/* Left: Project Title + Autosave Status + Undo/Redo */}
        <div className="flex items-center gap-2 min-w-0">
          <input
            type="text"
            value={project.title}
            onChange={(e) => commitProjectChange({ ...project, title: e.target.value })}
            className="text-sm font-bold text-slate-900 dark:text-white bg-transparent border-b border-transparent hover:border-slate-300 focus:border-blue-600 focus:outline-none px-1 py-0.5 truncate max-w-[240px] md:max-w-xs"
          />
          <span className="text-[11px] text-slate-500 font-mono tabular-nums hidden sm:inline">
            · Tersimpan {lastSavedTime}
          </span>
          <div className="flex items-center border-l border-slate-200 dark:border-slate-800 pl-2 ml-1 gap-1">
            <button
              type="button"
              onClick={handleUndo}
              disabled={historyIdx <= 0}
              title="Undo"
              className="p-1.5 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded disabled:opacity-30"
            >
              <Undo2 className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleRedo}
              disabled={historyIdx >= history.length - 1}
              title="Redo"
              className="p-1.5 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded disabled:opacity-30"
            >
              <Redo2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Center: Insert Elements & Visual Presets */}
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            onClick={() => addCustomElement('textbox')}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded hover:bg-slate-50 dark:hover:bg-slate-800"
          >
            <TypeIcon className="w-3.5 h-3.5" />
            <span>+ Teks</span>
          </button>
          <button
            type="button"
            onClick={() => addCustomElement('shape')}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded hover:bg-slate-50 dark:hover:bg-slate-800"
          >
            <Square className="w-3.5 h-3.5" />
            <span>+ Bentuk</span>
          </button>
          <button
            type="button"
            onClick={() => insertStructuredPreset('table')}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded hover:bg-slate-50 dark:hover:bg-slate-800"
          >
            <Table className="w-3.5 h-3.5" />
            <span>Tabel</span>
          </button>
          <button
            type="button"
            onClick={() => insertStructuredPreset('chart')}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded hover:bg-slate-50 dark:hover:bg-slate-800"
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Grafik</span>
          </button>

          <select
            value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
            aria-label="Zoom Kanvas"
            className="px-2 py-1.5 text-xs font-mono tabular-nums border border-slate-200 dark:border-slate-700 rounded bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200"
          >
            <option value={75}>75%</option>
            <option value={90}>90%</option>
            <option value={100}>100%</option>
            <option value={110}>110%</option>
          </select>
        </div>

        {/* Right: Present Mode & Export PPTX / PDF */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsPresentMode(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 rounded-md hover:bg-slate-50 dark:hover:bg-slate-800"
          >
            <Maximize2 className="w-3.5 h-3.5" />
            <span>Present Mode</span>
          </button>

          <button
            type="button"
            disabled={exportingPptx}
            onClick={async () => {
              setExportingPptx(true);
              try {
                await onExportPptx(project);
              } finally {
                setExportingPptx(false);
              }
            }}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-md disabled:opacity-50"
          >
            {exportingPptx ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Download className="w-3.5 h-3.5" />
            )}
            <span>Download PPTX</span>
          </button>

          <button
            type="button"
            onClick={() => onExportPdf(project)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-800 dark:text-slate-100 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-md"
          >
            <FileDown className="w-3.5 h-3.5" />
            <span>Download PDF</span>
          </button>
        </div>
      </div>

      {/* Main 3-Panel PowerPoint Editor Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        {/* LEFT PANEL: Slide Thumbnails & Slide Management (2 cols) */}
        <div className="lg:col-span-2 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-lg p-3 space-y-3 max-h-[760px] overflow-y-auto">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Daftar Slide ({project.slides.length})
            </span>
            <button
              type="button"
              onClick={addSlide}
              className="inline-flex items-center gap-1 px-2 py-1 text-[11px] font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded"
            >
              <Plus className="w-3 h-3" />
              <span>Baru</span>
            </button>
          </div>

          <div className="space-y-2.5">
            {project.slides.map((s, idx) => {
              const isSelected = idx === safeSlideIdx;
              return (
                <div
                  key={s.id}
                  onClick={() => {
                    setActiveSlideIdx(idx);
                    setSelectedElementId(null);
                  }}
                  className={`p-2 rounded-md border cursor-pointer transition-all ${
                    isSelected
                      ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-950/40 ring-1 ring-blue-600'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-400'
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px] mb-1.5">
                    <span className="font-mono font-bold tabular-nums text-slate-700 dark:text-slate-300">
                      #{idx + 1} · {s.layout}
                    </span>
                    <div
                      className="flex items-center gap-0.5"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        type="button"
                        onClick={() => moveSlide(idx, 'up')}
                        disabled={idx === 0}
                        title="Naikkan"
                        className="p-0.5 text-slate-400 hover:text-slate-800 dark:hover:text-white disabled:opacity-25"
                      >
                        <ArrowUp className="w-3 h-3" />
                      </button>
                      <button
                        type="button"
                        onClick={() => moveSlide(idx, 'down')}
                        disabled={idx === project.slides.length - 1}
                        title="Turunkan"
                        className="p-0.5 text-slate-400 hover:text-slate-800 dark:hover:text-white disabled:opacity-25"
                      >
                        <ArrowDown className="w-3 h-3" />
                      </button>
                      <button
                        type="button"
                        onClick={() => duplicateSlide(idx)}
                        title="Duplikat Slide"
                        className="p-0.5 text-slate-400 hover:text-blue-600"
                      >
                        <Copy className="w-3 h-3" />
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteSlide(idx)}
                        title="Hapus Slide"
                        className="p-0.5 text-slate-400 hover:text-red-600"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  <SlideCanvasPreview
                    slide={s}
                    totalSlides={project.slides.length}
                    theme={project.theme}
                    aspectRatio={project.config?.aspectRatio || '16:9'}
                    compactThumbnail={true}
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* CENTER PANEL: Interactive Slide Canvas + Speaker Notes / Data / References (6 cols) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="border border-slate-200 dark:border-slate-800 bg-slate-100/70 dark:bg-slate-950 rounded-lg p-4 md:p-6 overflow-x-auto flex items-center justify-center">
            <SlideCanvasPreview
              slide={activeSlide}
              totalSlides={project.slides.length}
              theme={project.theme}
              aspectRatio={project.config?.aspectRatio || '16:9'}
              zoom={zoom}
              editable={true}
              selectedElementId={selectedElementId}
              onSelectElement={setSelectedElementId}
              onUpdateSlide={updateActiveSlide}
              onUpdateCustomElement={updateCustomElement}
            />
          </div>

          {/* Bottom Editor Panel: Speaker Notes, Structured Data & Bullet Points, and References */}
          <div className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-lg overflow-hidden">
            <div className="flex items-center border-b border-slate-200 dark:border-slate-800 px-3 pt-2 gap-2 bg-slate-50/60 dark:bg-slate-950/40">
              {[
                { id: 'notes', label: 'Catatan Pembicara (Speaker Notes)' },
                { id: 'data', label: 'Poin Isi & Data Visual Slide' },
                {
                  id: 'references',
                  label: `Referensi & Sumber (${activeSlide.references?.length || 0})`,
                },
              ].map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setBottomTab(t.id as any)}
                  className={`px-3 py-2 text-xs font-semibold border-b-2 transition-colors whitespace-nowrap ${
                    bottomTab === t.id
                      ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            <div className="p-4">
              {bottomTab === 'notes' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Naskah Catatan Pembicara untuk Slide #{activeSlide.slideNumber}
                    </span>
                    <button
                      type="button"
                      disabled={runningAiAction !== null}
                      onClick={() => runSlideAiAction('generate-notes')}
                      className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800 rounded hover:bg-blue-50 dark:hover:bg-blue-950/50"
                    >
                      {runningAiAction === 'generate-notes' ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Sparkles className="w-3.5 h-3.5" />
                      )}
                      <span>Buat / Sempurnakan Catatan dengan AI</span>
                    </button>
                  </div>
                  <textarea
                    rows={4}
                    value={activeSlide.speakerNotes || ''}
                    onChange={(e) => updateActiveSlide({ speakerNotes: e.target.value })}
                    placeholder="Tuliskan poin bicara, transisi, atau penekanan khusus saat mempresentasikan slide ini..."
                    className="w-full px-3 py-2 text-xs border border-slate-300 dark:border-slate-700 rounded-md bg-white dark:bg-slate-950 text-slate-900 dark:text-white leading-relaxed"
                  />
                </div>
              )}

              {bottomTab === 'data' && (
                <div className="space-y-4">
                  {/* Bullet Points Editor */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                        Daftar Poin Utama (Bullets)
                      </label>
                      <button
                        type="button"
                        onClick={() =>
                          updateActiveSlide({
                            bullets: [...(activeSlide.bullets || []), 'Poin pembahasan baru'],
                          })
                        }
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-blue-600 border border-blue-200 dark:border-blue-800 rounded"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Tambah Poin</span>
                      </button>
                    </div>
                    <div className="space-y-2">
                      {(activeSlide.bullets || []).map((b, bIdx) => (
                        <div key={bIdx} className="flex items-center gap-2">
                          <span className="text-xs font-mono text-slate-400 w-5 tabular-nums">
                            {bIdx + 1}.
                          </span>
                          <input
                            type="text"
                            value={b}
                            onChange={(e) => {
                              const next = [...activeSlide.bullets];
                              next[bIdx] = e.target.value;
                              updateActiveSlide({ bullets: next });
                            }}
                            className="flex-1 px-2.5 py-1.5 text-xs border border-slate-300 dark:border-slate-700 rounded bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const next = activeSlide.bullets.filter((_, i) => i !== bIdx);
                              updateActiveSlide({ bullets: next });
                            }}
                            className="p-1 text-slate-400 hover:text-red-600"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Chart Data Editor when layout === 'chart' */}
                  {activeSlide.layout === 'chart' && activeSlide.chartData && (
                    <div className="pt-3 border-t border-slate-200 dark:border-slate-800 space-y-3">
                      <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
                        Pengaturan Data Grafik (Berdasarkan Data Pengguna)
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                        <input
                          type="text"
                          value={activeSlide.chartData.title}
                          onChange={(e) =>
                            updateActiveSlide({
                              chartData: { ...activeSlide.chartData!, title: e.target.value },
                            })
                          }
                          placeholder="Judul Grafik"
                          className="px-2.5 py-1.5 text-xs border border-slate-300 dark:border-slate-700 rounded bg-white dark:bg-slate-950"
                        />
                        <select
                          value={activeSlide.chartData.chartType}
                          onChange={(e) =>
                            updateActiveSlide({
                              chartData: {
                                ...activeSlide.chartData!,
                                chartType: e.target.value as 'bar' | 'line' | 'pie',
                              },
                            })
                          }
                          className="px-2.5 py-1.5 text-xs border border-slate-300 dark:border-slate-700 rounded bg-white dark:bg-slate-950"
                        >
                          <option value="bar">Grafik Batang (Bar)</option>
                          <option value="line">Grafik Garis (Line)</option>
                          <option value="pie">Grafik Proporsi (Pie/Distribusi)</option>
                        </select>
                        <input
                          type="text"
                          value={activeSlide.chartData.unit}
                          onChange={(e) =>
                            updateActiveSlide({
                              chartData: { ...activeSlide.chartData!, unit: e.target.value },
                            })
                          }
                          placeholder="Satuan (mis. %, Juta, Menit)"
                          className="px-2.5 py-1.5 text-xs border border-slate-300 dark:border-slate-700 rounded bg-white dark:bg-slate-950"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[11px] text-slate-500 mb-1">
                            Label Kategori (Pisahkan dengan koma)
                          </label>
                          <input
                            type="text"
                            value={activeSlide.chartData.labels.join(', ')}
                            onChange={(e) =>
                              updateActiveSlide({
                                chartData: {
                                  ...activeSlide.chartData!,
                                  labels: e.target.value.split(',').map((s) => s.trim()),
                                },
                              })
                            }
                            className="w-full px-2.5 py-1.5 text-xs border border-slate-300 dark:border-slate-700 rounded bg-white dark:bg-slate-950"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] text-slate-500 mb-1">
                            Nilai Angka (Pisahkan dengan koma)
                          </label>
                          <input
                            type="text"
                            value={activeSlide.chartData.values.join(', ')}
                            onChange={(e) =>
                              updateActiveSlide({
                                chartData: {
                                  ...activeSlide.chartData!,
                                  values: e.target.value
                                    .split(',')
                                    .map((v) => Number(v.trim()) || 0),
                                },
                              })
                            }
                            className="w-full px-2.5 py-1.5 text-xs font-mono tabular-nums border border-slate-300 dark:border-slate-700 rounded bg-white dark:bg-slate-950"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {bottomTab === 'references' && (
                <div className="space-y-4">
                  <div className="p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-md text-xs text-slate-600 dark:text-slate-400">
                    Catatan Kejujuran Akademik: Referensi yang disarankan oleh AI ditandai sebagai{' '}
                    <strong className="text-amber-600">Perlu Diverifikasi</strong> hingga Anda memeriksa
                    dokumen aslinya dan menandainya sebagai{' '}
                    <strong className="text-emerald-600">Terverifikasi</strong>.
                  </div>

                  {/* Existing References List */}
                  <div className="space-y-2">
                    {(activeSlide.references || []).length === 0 ? (
                      <div className="text-xs text-slate-500 py-2">
                        Belum ada referensi pada slide ini. Tambahkan sumber rujukan secara manual di bawah.
                      </div>
                    ) : (
                      (activeSlide.references || []).map((ref, rIdx) => (
                        <div
                          key={ref.id}
                          className="p-2.5 border border-slate-200 dark:border-slate-800 rounded-md flex flex-wrap items-center justify-between gap-2"
                        >
                          <div className="flex-1 min-w-0">
                            <input
                              type="text"
                              value={ref.citation}
                              onChange={(e) => {
                                const next = [...activeSlide.references];
                                next[rIdx] = { ...ref, citation: e.target.value };
                                updateActiveSlide({ references: next });
                              }}
                              className="w-full text-xs font-medium bg-transparent border-b border-transparent focus:border-blue-500 focus:outline-none text-slate-900 dark:text-white"
                            />
                            {ref.verificationNote && (
                              <div className="text-[11px] text-slate-500 mt-0.5">
                                {ref.verificationNote}
                              </div>
                            )}
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <button
                              type="button"
                              onClick={() => {
                                const next = [...activeSlide.references];
                                next[rIdx] = {
                                  ...ref,
                                  verified: !ref.verified,
                                  verificationNote: !ref.verified
                                    ? 'Telah diverifikasi oleh penyusun presentasi.'
                                    : 'Perlu diperiksa kembali kesesuaian sumber aslinya.',
                                };
                                updateActiveSlide({ references: next });
                              }}
                              className={`inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold rounded border ${
                                ref.verified
                                  ? 'border-emerald-300 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300'
                                  : 'border-amber-300 bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300'
                              }`}
                            >
                              <CheckCircle2 className="w-3 h-3" />
                              <span>{ref.verified ? 'Terverifikasi' : 'Perlu Diverifikasi'}</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                const next = activeSlide.references.filter((_, i) => i !== rIdx);
                                updateActiveSlide({ references: next });
                              }}
                              className="p-1 text-slate-400 hover:text-red-600"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Add Manual Reference Form */}
                  <div className="flex flex-col sm:flex-row gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                    <input
                      type="text"
                      value={newRefCitation}
                      onChange={(e) => setNewRefCitation(e.target.value)}
                      placeholder="Masukkan kutipan sumber / daftar pustaka (mis. Penulis, Tahun, Judul)..."
                      className="flex-1 px-3 py-1.5 text-xs border border-slate-300 dark:border-slate-700 rounded bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
                    />
                    <input
                      type="text"
                      value={newRefUrl}
                      onChange={(e) => setNewRefUrl(e.target.value)}
                      placeholder="URL / DOI resmi (opsional)"
                      className="sm:w-48 px-3 py-1.5 text-xs border border-slate-300 dark:border-slate-700 rounded bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (!newRefCitation.trim()) return;
                        const next = [
                          ...(activeSlide.references || []),
                          {
                            id: `ref-${Date.now()}`,
                            citation: newRefCitation.trim(),
                            url: newRefUrl.trim() || undefined,
                            verified: true,
                            verificationNote: 'Dimasukkan dan diverifikasi secara manual oleh pengguna.',
                          },
                        ];
                        updateActiveSlide({ references: next });
                        setNewRefCitation('');
                        setNewRefUrl('');
                        onNotify('Referensi terverifikasi berhasil ditambahkan.', 'success');
                      }}
                      className="px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded shrink-0"
                    >
                      + Tambah Sumber
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT PANEL: Properties, Theme, AI Tools & Quality Checker (4 cols) */}
        <div className="lg:col-span-4 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-lg overflow-hidden">
          {/* Right Panel Tabs */}
          <div className="grid grid-cols-3 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
            <button
              type="button"
              onClick={() => setRightTab('design')}
              className={`py-2.5 px-2 text-xs font-semibold flex items-center justify-center gap-1.5 border-b-2 ${
                rightTab === 'design'
                  ? 'border-blue-600 text-blue-600 bg-white dark:bg-slate-900'
                  : 'border-transparent text-slate-600 dark:text-slate-400'
              }`}
            >
              <Palette className="w-3.5 h-3.5" />
              <span>Desain & Teks</span>
            </button>
            <button
              type="button"
              onClick={() => setRightTab('ai')}
              className={`py-2.5 px-2 text-xs font-semibold flex items-center justify-center gap-1.5 border-b-2 ${
                rightTab === 'ai'
                  ? 'border-blue-600 text-blue-600 bg-white dark:bg-slate-900'
                  : 'border-transparent text-slate-600 dark:text-slate-400'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI Tools</span>
            </button>
            <button
              type="button"
              onClick={() => setRightTab('quality')}
              className={`py-2.5 px-2 text-xs font-semibold flex items-center justify-center gap-1.5 border-b-2 ${
                rightTab === 'quality'
                  ? 'border-blue-600 text-blue-600 bg-white dark:bg-slate-900'
                  : 'border-transparent text-slate-600 dark:text-slate-400'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span className="tabular-nums">Audit ({qualityIssues.length})</span>
            </button>
          </div>

          <div className="p-4 space-y-5 max-h-[690px] overflow-y-auto">
            {/* TAB 1: DESIGN, LAYOUT & ELEMENT PROPERTIES */}
            {rightTab === 'design' && (
              <div className="space-y-5">
                {/* Selected Custom Element Inspector */}
                {selectedCustomElement && (
                  <div className="p-3.5 border border-blue-200 dark:border-blue-800 bg-blue-50/40 dark:bg-blue-950/30 rounded-lg space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-blue-900 dark:text-blue-200">
                        Properti Elemen Terpilih ({selectedCustomElement.type})
                      </span>
                      <button
                        type="button"
                        onClick={() => deleteCustomElement(selectedCustomElement.id)}
                        className="text-xs text-red-600 hover:underline flex items-center gap-1"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Hapus</span>
                      </button>
                    </div>

                    <textarea
                      rows={2}
                      value={selectedCustomElement.content}
                      onChange={(e) =>
                        updateCustomElement(selectedCustomElement.id, { content: e.target.value })
                      }
                      className="w-full px-2.5 py-1.5 text-xs border border-slate-300 dark:border-slate-700 rounded bg-white dark:bg-slate-900"
                    />

                    <div className="grid grid-cols-4 gap-2 text-xs">
                      <div>
                        <label className="block text-[10px] text-slate-500">Posisi X (%)</label>
                        <input
                          type="number"
                          value={selectedCustomElement.x}
                          onChange={(e) =>
                            updateCustomElement(selectedCustomElement.id, {
                              x: Number(e.target.value),
                            })
                          }
                          className="w-full px-2 py-1 border border-slate-300 dark:border-slate-700 rounded bg-white dark:bg-slate-900 tabular-nums"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-slate-500">Posisi Y (%)</label>
                        <input
                          type="number"
                          value={selectedCustomElement.y}
                          onChange={(e) =>
                            updateCustomElement(selectedCustomElement.id, {
                              y: Number(e.target.value),
                            })
                          }
                          className="w-full px-2 py-1 border border-slate-300 dark:border-slate-700 rounded bg-white dark:bg-slate-900 tabular-nums"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-slate-500">Lebar (%)</label>
                        <input
                          type="number"
                          value={selectedCustomElement.width}
                          onChange={(e) =>
                            updateCustomElement(selectedCustomElement.id, {
                              width: Number(e.target.value),
                            })
                          }
                          className="w-full px-2 py-1 border border-slate-300 dark:border-slate-700 rounded bg-white dark:bg-slate-900 tabular-nums"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-slate-500">Tinggi (%)</label>
                        <input
                          type="number"
                          value={selectedCustomElement.height}
                          onChange={(e) =>
                            updateCustomElement(selectedCustomElement.id, {
                              height: Number(e.target.value),
                            })
                          }
                          className="w-full px-2 py-1 border border-slate-300 dark:border-slate-700 rounded bg-white dark:bg-slate-900 tabular-nums"
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-2 pt-1">
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() =>
                            updateCustomElement(selectedCustomElement.id, {
                              fontWeight:
                                selectedCustomElement.fontWeight === 'bold' ? 'normal' : 'bold',
                            })
                          }
                          className={`p-1.5 rounded border ${
                            selectedCustomElement.fontWeight === 'bold'
                              ? 'bg-blue-600 text-white border-blue-600'
                              : 'border-slate-300 dark:border-slate-700'
                          }`}
                        >
                          <Bold className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            updateCustomElement(selectedCustomElement.id, {
                              fontStyle:
                                selectedCustomElement.fontStyle === 'italic' ? 'normal' : 'italic',
                            })
                          }
                          className={`p-1.5 rounded border ${
                            selectedCustomElement.fontStyle === 'italic'
                              ? 'bg-blue-600 text-white border-blue-600'
                              : 'border-slate-300 dark:border-slate-700'
                          }`}
                        >
                          <Italic className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <div className="flex items-center gap-2">
                        <label className="text-[11px] text-slate-500">Font (pt):</label>
                        <input
                          type="number"
                          min={9}
                          max={48}
                          value={selectedCustomElement.fontSize}
                          onChange={(e) =>
                            updateCustomElement(selectedCustomElement.id, {
                              fontSize: Number(e.target.value) || 14,
                            })
                          }
                          className="w-16 px-2 py-1 text-xs border border-slate-300 dark:border-slate-700 rounded bg-white dark:bg-slate-900 tabular-nums"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Slide Layout Switcher */}
                <div>
                  <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-2 flex items-center gap-1.5">
                    <Layout className="w-3.5 h-3.5 text-blue-600" />
                    <span>Tata Letak (Layout) Slide Aktif</span>
                  </label>
                  <div className="grid grid-cols-2 gap-1.5">
                    {SLIDE_LAYOUTS.map((l) => (
                      <button
                        key={l.value}
                        type="button"
                        onClick={() => insertStructuredPreset(l.value)}
                        className={`py-1.5 px-2.5 text-left text-xs font-medium rounded border transition-colors ${
                          activeSlide.layout === l.value
                            ? 'bg-blue-600 text-white border-blue-600'
                            : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                        }`}
                      >
                        {l.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Slide Typography & Alignment */}
                <div className="space-y-3 pt-3 border-t border-slate-200 dark:border-slate-800">
                  <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    Tipografi & Perataan Teks Slide
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-slate-500 mb-1">
                      Keluarga Font Presentasi
                    </label>
                    <select
                      value={project.theme.fontFamily}
                      onChange={(e) =>
                        updateTheme({
                          fontFamily: e.target.value as PresentationTheme['fontFamily'],
                        })
                      }
                      className="w-full px-2.5 py-1.5 text-xs border border-slate-300 dark:border-slate-700 rounded bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
                    >
                      <option value="Plus Jakarta Sans">Plus Jakarta Sans (Modern Geometric)</option>
                      <option value="DM Sans">DM Sans (Clean Contemporary)</option>
                      <option value="Playfair Display">Playfair Display (Academic & Editorial Serif)</option>
                      <option value="JetBrains Mono">JetBrains Mono (Technical & Quantitative)</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] text-slate-500 mb-1 tabular-nums">
                        Ukuran Judul ({activeSlide.titleFontSize || 24}px)
                      </label>
                      <input
                        type="range"
                        min={16}
                        max={38}
                        value={activeSlide.titleFontSize || 24}
                        onChange={(e) =>
                          updateActiveSlide({ titleFontSize: Number(e.target.value) })
                        }
                        className="w-full"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-slate-500 mb-1 tabular-nums">
                        Ukuran Isi ({activeSlide.bodyFontSize || 14}px)
                      </label>
                      <input
                        type="range"
                        min={10}
                        max={22}
                        value={activeSlide.bodyFontSize || 14}
                        onChange={(e) =>
                          updateActiveSlide({ bodyFontSize: Number(e.target.value) })
                        }
                        className="w-full"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-600 dark:text-slate-400">
                      Perataan Judul Slide
                    </span>
                    <div className="flex items-center gap-1">
                      {[
                        { align: 'left', icon: AlignLeft },
                        { align: 'center', icon: AlignCenter },
                        { align: 'right', icon: AlignRight },
                      ].map(({ align, icon: Icon }) => (
                        <button
                          key={align}
                          type="button"
                          onClick={() =>
                            updateActiveSlide({ textAlign: align as 'left' | 'center' | 'right' })
                          }
                          className={`p-1.5 rounded border ${
                            (activeSlide.textAlign || project.theme.titlePlacement) === align
                              ? 'bg-blue-600 text-white border-blue-600'
                              : 'border-slate-300 dark:border-slate-700 text-slate-600'
                          }`}
                        >
                          <Icon className="w-3.5 h-3.5" />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Color Palette & Theme Preset */}
                <div className="space-y-3 pt-3 border-t border-slate-200 dark:border-slate-800">
                  <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    Palet Warna & Identitas Tema
                  </div>

                  <div>
                    <label className="block text-[11px] text-slate-500 mb-1">
                      Ganti Template Cepat
                    </label>
                    <select
                      value={project.theme.templateId}
                      onChange={(e) => {
                        const found = PRESENTATION_TEMPLATES.find((t) => t.id === e.target.value);
                        if (found) {
                          updateTheme({ ...found.theme });
                          onNotify(`Tema diubah ke "${found.name}".`, 'info');
                        }
                      }}
                      className="w-full px-2.5 py-1.5 text-xs border border-slate-300 dark:border-slate-700 rounded bg-white dark:bg-slate-950"
                    >
                      {PRESENTATION_TEMPLATES.map((tpl) => (
                        <option key={tpl.id} value={tpl.id}>
                          {tpl.name} ({tpl.category})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5 text-xs">
                    <label className="flex items-center justify-between p-2 border border-slate-200 dark:border-slate-800 rounded">
                      <span>Warna Utama</span>
                      <input
                        type="color"
                        value={project.theme.primaryColor}
                        onChange={(e) => updateTheme({ primaryColor: e.target.value })}
                        className="w-6 h-6 rounded cursor-pointer border-0"
                      />
                    </label>
                    <label className="flex items-center justify-between p-2 border border-slate-200 dark:border-slate-800 rounded">
                      <span>Warna Sekunder</span>
                      <input
                        type="color"
                        value={project.theme.secondaryColor}
                        onChange={(e) => updateTheme({ secondaryColor: e.target.value })}
                        className="w-6 h-6 rounded cursor-pointer border-0"
                      />
                    </label>
                    <label className="flex items-center justify-between p-2 border border-slate-200 dark:border-slate-800 rounded">
                      <span>Warna Latar</span>
                      <input
                        type="color"
                        value={project.theme.backgroundColor}
                        onChange={(e) => updateTheme({ backgroundColor: e.target.value })}
                        className="w-6 h-6 rounded cursor-pointer border-0"
                      />
                    </label>
                    <label className="flex items-center justify-between p-2 border border-slate-200 dark:border-slate-800 rounded">
                      <span>Warna Teks</span>
                      <input
                        type="color"
                        value={project.theme.textColor}
                        onChange={(e) => updateTheme({ textColor: e.target.value })}
                        className="w-6 h-6 rounded cursor-pointer border-0"
                      />
                    </label>
                  </div>

                  <div className="space-y-2 pt-2">
                    <div>
                      <label className="block text-[11px] text-slate-500 mb-1">
                        Nama Institusi / Organisasi (Header)
                      </label>
                      <input
                        type="text"
                        value={project.theme.institutionName}
                        onChange={(e) => updateTheme({ institutionName: e.target.value })}
                        className="w-full px-2.5 py-1.5 text-xs border border-slate-300 dark:border-slate-700 rounded bg-white dark:bg-slate-950"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[11px] text-slate-500 mb-1">
                          Kode / Badge Logo
                        </label>
                        <input
                          type="text"
                          value={project.theme.institutionLogoText}
                          onChange={(e) => updateTheme({ institutionLogoText: e.target.value })}
                          className="w-full px-2.5 py-1.5 text-xs border border-slate-300 dark:border-slate-700 rounded bg-white dark:bg-slate-950"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-slate-500 mb-1">
                          Teks Footer
                        </label>
                        <input
                          type="text"
                          value={project.theme.footerText}
                          onChange={(e) => updateTheme({ footerText: e.target.value })}
                          className="w-full px-2.5 py-1.5 text-xs border border-slate-300 dark:border-slate-700 rounded bg-white dark:bg-slate-950"
                        />
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-1 text-xs">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={project.theme.showHeaderFooter}
                          onChange={(e) => updateTheme({ showHeaderFooter: e.target.checked })}
                        />
                        <span>Tampilkan Header/Footer</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={project.theme.showSlideNumbers}
                          onChange={(e) => updateTheme({ showSlideNumbers: e.target.checked })}
                        />
                        <span>Nomor Halaman</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: AI TOOLS PER-SLIDE (11 ACTIONS) */}
            {rightTab === 'ai' && (
              <div className="space-y-4">
                <div className="p-3 bg-blue-50/60 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 rounded-md text-xs text-slate-700 dark:text-slate-300">
                  Pilih tindakan AI untuk Slide #{activeSlide.slideNumber}. Hasil usulan AI akan
                  ditampilkan pada jendela perbandingan terlebih dahulu agar tidak langsung menimpa
                  editan Anda.
                </div>

                <div className="grid grid-cols-1 gap-2">
                  {[
                    { id: 'improve-writing', label: 'Perbaiki Penulisan & Tata Bahasa' },
                    { id: 'summarize', label: 'Ringkas Teks (Padat & Tajam)' },
                    { id: 'expand', label: 'Perluas Penjelasan & Konteks' },
                    { id: 'structure-points', label: 'Susun Ulang Poin-Poin Logis' },
                    { id: 'regenerate', label: 'Buat Ulang Konten Slide' },
                    { id: 'suggest-layout', label: 'Sarankan Layout Optimal' },
                    { id: 'suggest-visual', label: 'Sarankan Visual & Data Terstruktur' },
                    { id: 'generate-notes', label: 'Buat Catatan Pembicara' },
                    { id: 'check-consistency', label: 'Periksa Konsistensi & Keselarasan Isi' },
                  ].map((act) => {
                    const isRunning = runningAiAction === act.id;
                    return (
                      <button
                        key={act.id}
                        type="button"
                        disabled={runningAiAction !== null}
                        onClick={() => runSlideAiAction(act.id as SlideAIActionType)}
                        className="w-full py-2 px-3 text-left text-xs font-semibold border border-slate-200 dark:border-slate-800 rounded-md hover:border-blue-500 hover:bg-blue-50/40 dark:hover:bg-blue-950/30 flex items-center justify-between transition-colors disabled:opacity-50"
                      >
                        <span>{act.label}</span>
                        {isRunning ? (
                          <Loader2 className="w-3.5 h-3.5 text-blue-600 animate-spin" />
                        ) : (
                          <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Change Tone Control */}
                <div className="pt-3 border-t border-slate-200 dark:border-slate-800 space-y-2">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                    Ubah Gaya Bahasa Slide
                  </label>
                  <div className="flex gap-2">
                    <select
                      value={targetTone}
                      onChange={(e) => setTargetTone(e.target.value)}
                      className="flex-1 px-2.5 py-1.5 text-xs border border-slate-300 dark:border-slate-700 rounded bg-white dark:bg-slate-950"
                    >
                      <option value="akademik & ilmiah">Akademik & Ilmiah</option>
                      <option value="eksekutif & korporat">Eksekutif & Korporat</option>
                      <option value="persuasif & pitching">Persuasif & Pitching</option>
                      <option value="edukatif & mudah dipahami">Edukatif & Mudah Dipahami</option>
                      <option value="minimalis & lugas">Minimalis & Lugas</option>
                    </select>
                    <button
                      type="button"
                      disabled={runningAiAction !== null}
                      onClick={() => runSlideAiAction('change-tone')}
                      className="px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded disabled:opacity-50"
                    >
                      Ubah Gaya
                    </button>
                  </div>
                </div>

                {/* Translate Slide Control */}
                <div className="pt-3 border-t border-slate-200 dark:border-slate-800 space-y-2">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                    Terjemahkan Slide Ini
                  </label>
                  <div className="flex gap-2">
                    <select
                      value={targetLang}
                      onChange={(e) => setTargetLang(e.target.value as 'id' | 'en')}
                      className="flex-1 px-2.5 py-1.5 text-xs border border-slate-300 dark:border-slate-700 rounded bg-white dark:bg-slate-950"
                    >
                      <option value="en">Terjemahkan ke Bahasa Inggris (English)</option>
                      <option value="id">Terjemahkan ke Bahasa Indonesia</option>
                    </select>
                    <button
                      type="button"
                      disabled={runningAiAction !== null}
                      onClick={() => runSlideAiAction('translate')}
                      className="px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded disabled:opacity-50"
                    >
                      Terjemahkan
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: QUALITY & CONSISTENCY AUDITOR */}
            {rightTab === 'quality' && (
              <div className="space-y-3">
                <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  Pemeriksa Kualitas & Konsistensi Presentasi
                </div>
                {qualityIssues.length === 0 ? (
                  <div className="p-4 border border-emerald-200 dark:border-emerald-800 bg-emerald-50/50 dark:bg-emerald-950/30 rounded-lg text-xs text-emerald-800 dark:text-emerald-200 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>
                      Seluruh slide memenuhi standar keterbacaan, struktur, dan batas kanvas!
                    </span>
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {qualityIssues.map((iss) => (
                      <div
                        key={iss.id}
                        className="p-3 border border-slate-200 dark:border-slate-800 rounded-md space-y-1.5 bg-slate-50/50 dark:bg-slate-950/40"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 dark:text-white">
                            <AlertTriangle
                              className={`w-3.5 h-3.5 shrink-0 ${
                                iss.severity === 'critical'
                                  ? 'text-red-600'
                                  : iss.severity === 'warning'
                                  ? 'text-amber-600'
                                  : 'text-blue-600'
                              }`}
                            />
                            <span>{iss.title}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => setActiveSlideIdx(iss.slideNumber - 1)}
                            className="text-[11px] font-semibold text-blue-600 hover:underline shrink-0 tabular-nums"
                          >
                            Buka Slide #{iss.slideNumber}
                          </button>
                        </div>
                        <p className="text-[11px] text-slate-600 dark:text-slate-400">
                          {iss.description}
                        </p>
                        <div className="text-[11px] font-medium text-slate-700 dark:text-slate-300">
                          Saran: {iss.suggestion}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* NON-DESTRUCTIVE AI PROPOSAL COMPARISON MODAL */}
      {aiProposal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden shadow-xl">
            <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Tinjau Usulan Perubahan AI (Slide #{activeSlide.slideNumber})
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">{aiProposal.explanation}</p>
              </div>
              <button
                type="button"
                onClick={() => setAiProposal(null)}
                className="p-1 text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
              {/* Current Slide */}
              <div className="border border-slate-200 dark:border-slate-800 rounded-lg p-3.5 space-y-2">
                <div className="text-xs font-bold text-slate-500">Versi Saat Ini (Sebelum AI)</div>
                <div className="text-sm font-bold text-slate-900 dark:text-white">
                  {activeSlide.title}
                </div>
                {activeSlide.subtitle && (
                  <div className="text-xs text-slate-500">{activeSlide.subtitle}</div>
                )}
                <div className="text-[11px] font-mono text-slate-400">
                  Layout: {activeSlide.layout}
                </div>
                <ul className="space-y-1 text-xs text-slate-700 dark:text-slate-300 pt-1">
                  {(activeSlide.bullets || []).map((b, i) => (
                    <li key={i}>• {b}</li>
                  ))}
                </ul>
                {activeSlide.speakerNotes && (
                  <div className="text-[11px] text-slate-500 pt-2 border-t border-slate-200 dark:border-slate-800">
                    <strong>Catatan Pembicara:</strong> {activeSlide.speakerNotes}
                  </div>
                )}
              </div>

              {/* Proposed Slide */}
              <div className="border border-blue-500 bg-blue-50/20 dark:bg-blue-950/20 rounded-lg p-3.5 space-y-2">
                <div className="text-xs font-bold text-blue-600">Usulan AI Baru</div>
                <div className="text-sm font-bold text-slate-900 dark:text-white">
                  {aiProposal.proposedSlide.title}
                </div>
                {aiProposal.proposedSlide.subtitle && (
                  <div className="text-xs text-slate-500">{aiProposal.proposedSlide.subtitle}</div>
                )}
                <div className="text-[11px] font-mono text-blue-600">
                  Layout: {aiProposal.proposedSlide.layout}
                </div>
                <ul className="space-y-1 text-xs text-slate-700 dark:text-slate-300 pt-1">
                  {(aiProposal.proposedSlide.bullets || []).map((b, i) => (
                    <li key={i}>• {b}</li>
                  ))}
                </ul>
                {aiProposal.proposedSlide.speakerNotes && (
                  <div className="text-[11px] text-slate-600 dark:text-slate-400 pt-2 border-t border-slate-200 dark:border-slate-800">
                    <strong>Catatan Pembicara:</strong> {aiProposal.proposedSlide.speakerNotes}
                  </div>
                )}
              </div>
            </div>

            <div className="px-5 py-3.5 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-3 bg-slate-50 dark:bg-slate-950">
              <button
                type="button"
                onClick={() => setAiProposal(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Batalkan
              </button>
              <button
                type="button"
                onClick={applyAiProposal}
                className="inline-flex items-center gap-1.5 px-5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-md"
              >
                <Check className="w-4 h-4" />
                <span>Terapkan ke Slide</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
