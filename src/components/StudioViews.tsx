import React, { useState } from 'react';
import {
  AspectRatioType,
  ContentLanguage,
  PresentationProject,
  TemplateDefinition,
} from '../types/presentation';
import { PRESENTATION_TEMPLATES, VERIFIED_VISUAL_STYLE_REPORT } from '../data/templates';
import {
  BookOpen,
  Check,
  CheckCircle2,
  Copy,
  Download,
  Eye,
  FileSpreadsheet,
  FileText,
  HelpCircle,
  Layers,
  Moon,
  Palette,
  ShieldCheck,
  Sparkles,
  Sun,
  Upload,
  X,
} from 'lucide-react';

interface TemplateGalleryViewProps {
  activeProject: PresentationProject | null;
  onApplyTemplateToActive: (tpl: TemplateDefinition) => void;
  onStartNewWithTemplate: (tpl: TemplateDefinition) => void;
}

export const TemplateGalleryView: React.FC<TemplateGalleryViewProps> = ({
  activeProject,
  onApplyTemplateToActive,
  onStartNewWithTemplate,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [showStyleGuideModal, setShowStyleGuideModal] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'A' | 'B' | 'C' | 'D' | 'E'>('A');
  const [copiedPrompt, setCopiedPrompt] = useState<boolean>(false);

  const vsr = VERIFIED_VISUAL_STYLE_REPORT;
  const agroTemplate =
    PRESENTATION_TEMPLATES.find((t) => t.id === 'tpl-agro-integrated-farming') ||
    PRESENTATION_TEMPLATES[0];

  const categories = [
    'Semua',
    ...Array.from(new Set(PRESENTATION_TEMPLATES.map((t) => t.category))),
  ];

  const filteredTemplates =
    selectedCategory === 'Semua'
      ? PRESENTATION_TEMPLATES
      : PRESENTATION_TEMPLATES.filter((t) => t.category === selectedCategory);

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(vsr.sectionD_ReadyDesignPrompt.masterDesignPrompt);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Featured Hero Banner: Visual Style Reference Template */}
      <div className="border-2 border-emerald-700/60 bg-gradient-to-br from-emerald-950 via-slate-900 to-slate-950 rounded-xl p-6 text-white shadow-md relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 rounded-full bg-emerald-600/10 pointer-events-none blur-2xl" />
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-3 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-400 text-slate-950 shadow-xs flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                Template Hasil Analisis Visual Reference
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-800 text-emerald-200 border border-emerald-600">
                20 Slide Asli Teruji
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-800 text-slate-300 border border-slate-700">
                Bisa untuk Semua Topik
              </span>
            </div>

            <div>
              <h2 className="text-xl lg:text-2xl font-black tracking-tight text-white">
                Ekosistem Modular & Agro-Infografis
              </h2>
              <p className="text-xs text-emerald-200/90 leading-relaxed mt-1">
                Template resmi hasil ekstraksi Visual Style Reference dokumen perkuliahan/seminar terpadu: perpaduan Forest Green (<code className="font-mono text-amber-300">#064E3B</code>), Golden Amber (<code className="font-mono text-amber-300">#F59E0B</code>), dan Emerald (<code className="font-mono text-amber-300">#047857</code>) dengan sistem banner kontainer solid, nomor lingkaran emas dinamis, komparasi BEFORE vs AFTER terarah, modular cards 4–6 pilar, callout Pesan Utama quote-badge, dan footer bar piktogram ekosistem.
              </p>
            </div>

            {/* Visual Color Role Swatches */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="text-[11px] text-slate-300 font-medium">DNA Warna:</span>
              <div className="flex items-center gap-1.5 text-[10px] font-mono">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-900 border border-emerald-700 text-emerald-200">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#064E3B]" /> #064E3B Header
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-950 border border-amber-700 text-amber-200">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]" /> #F59E0B Nomor
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-950 border border-emerald-800 text-emerald-300">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#047857]" /> #047857 Solusi
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#334155]" /> #334155 Before
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5 shrink-0">
            <button
              type="button"
              onClick={() => onStartNewWithTemplate(agroTemplate)}
              className="py-2.5 px-4 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2 whitespace-nowrap"
            >
              <Sparkles className="w-4 h-4" />
              <span>Buat Presentasi dengan Gaya Ini</span>
            </button>

            <button
              type="button"
              onClick={() => setShowStyleGuideModal(true)}
              className="py-2.5 px-4 text-xs font-semibold text-white bg-emerald-800/80 hover:bg-emerald-700/80 border border-emerald-600 rounded-lg transition-colors flex items-center justify-center gap-2 whitespace-nowrap"
            >
              <FileText className="w-4 h-4 text-emerald-300" />
              <span>Lihat Style Guide & Moodboard (Format A–E)</span>
            </button>

            {activeProject && (
              <button
                type="button"
                onClick={() => onApplyTemplateToActive(agroTemplate)}
                className="py-2 px-3 text-xs font-medium text-slate-200 hover:text-white bg-slate-800/70 hover:bg-slate-800 border border-slate-700 rounded-lg transition-colors flex items-center justify-center gap-1.5 whitespace-nowrap"
              >
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>Terapkan ke Proyek Aktif</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Gallery Header & Filters */}
      <div className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-lg p-6">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
          Galeri Template & Sistem Desain Slide ({PRESENTATION_TEMPLATES.length} Template)
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
          Setiap template dirancang dengan palet warna terukur, hierarki tipografi, tata letak header/footer, dan struktur visual yang konsisten untuk ekspor PowerPoint (.pptx) dan PDF.
        </p>

        {/* Category Filter Buttons */}
        <div className="flex flex-wrap gap-1.5 mt-4 pt-4 border-t border-slate-200 dark:border-slate-800">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Template Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredTemplates.map((tpl) => {
          const isCurrent = activeProject?.theme?.templateId === tpl.id;
          const isAgro = tpl.id === 'tpl-agro-integrated-farming';
          return (
            <div
              key={tpl.id}
              className={`border bg-white dark:bg-slate-900 rounded-lg overflow-hidden flex flex-col justify-between transition-shadow hover:shadow-md ${
                isAgro
                  ? 'border-emerald-500/80 ring-1 ring-emerald-500/30'
                  : 'border-slate-200 dark:border-slate-800'
              }`}
            >
              <div>
                {/* Visual Slide Thumbnail Mockup */}
                <div
                  className="p-4 border-b border-slate-200 dark:border-slate-800 relative"
                  style={{
                    backgroundColor: tpl.theme.backgroundColor,
                    color: tpl.theme.textColor,
                    aspectRatio: '16 / 9',
                  }}
                >
                  <div
                    className="absolute top-0 left-0 right-0 h-1.5"
                    style={{
                      background: `linear-gradient(90deg, ${tpl.theme.primaryColor}, ${tpl.theme.secondaryColor})`,
                    }}
                  />
                  <div className="h-full flex flex-col justify-between pt-1">
                    <div className="flex items-center justify-between text-[10px] opacity-75">
                      <span>{tpl.theme.headerText || tpl.category}</span>
                      <span
                        className="font-bold px-1.5 py-0.5 border"
                        style={{
                          borderColor: tpl.theme.primaryColor,
                          color: tpl.theme.primaryColor,
                        }}
                      >
                        {tpl.theme.institutionLogoText}
                      </span>
                    </div>

                    <div className="space-y-1.5 my-auto">
                      <div
                        className="text-sm font-bold leading-snug"
                        style={{ color: tpl.theme.textColor }}
                      >
                        {tpl.name}
                      </div>
                      <div className="text-[11px]" style={{ color: tpl.theme.mutedTextColor }}>
                        {tpl.category} · Font: {tpl.theme.fontFamily}
                      </div>
                      <div className="flex gap-1.5 pt-1">
                        {tpl.previewSlides.slice(0, 3).map((ps, idx) => (
                          <span
                            key={idx}
                            className="text-[10px] px-2 py-0.5 rounded border"
                            style={{
                              backgroundColor: tpl.theme.surfaceColor,
                              borderColor: `${tpl.theme.primaryColor}35`,
                              color: tpl.theme.textColor,
                            }}
                          >
                            0{idx + 1}. {ps}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[10px] opacity-70">
                      <span>{tpl.theme.institutionName}</span>
                      <div className="flex items-center gap-1">
                        <span
                          className="w-3 h-3 rounded-xs border border-black/10"
                          style={{ backgroundColor: tpl.theme.primaryColor }}
                        />
                        <span
                          className="w-3 h-3 rounded-xs border border-black/10"
                          style={{ backgroundColor: tpl.theme.secondaryColor }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Template Description & Metadata */}
                <div className="p-4 space-y-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      {tpl.category} · {tpl.theme.fontFamily}
                    </span>
                    {isAgro && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-300">
                        ⭐ Referensi Asli
                      </span>
                    )}
                  </div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">{tpl.name}</h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {tpl.description}
                  </p>
                  <div className="text-[11px] text-slate-500 pt-1">
                    Cocok untuk: {tpl.recommendedFor.join(' · ')}
                  </div>
                </div>
              </div>

              <div className="p-4 pt-0 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onStartNewWithTemplate(tpl)}
                  className="flex-1 py-2 px-3 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors whitespace-nowrap"
                >
                  Buat Presentasi Baru
                </button>
                {activeProject && (
                  <button
                    type="button"
                    onClick={() => onApplyTemplateToActive(tpl)}
                    className="py-2 px-3 text-xs font-semibold text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-md transition-colors whitespace-nowrap flex items-center gap-1"
                  >
                    {isCurrent && <Check className="w-3.5 h-3.5 text-emerald-600" />}
                    <span>{isCurrent ? 'Aktif' : 'Terapkan'}</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Interactive Modal: Visual Style Guide & Moodboard (Format A–E) */}
      {showStyleGuideModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-950">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-emerald-800 text-white flex items-center justify-center font-bold text-xs">
                  DNA
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Panduan Gaya Visual & Moodboard (Format Hasil A–E)
                  </h3>
                  <div className="text-xs text-slate-500">
                    Berdasarkan analisis file: <code className="font-mono text-emerald-600 dark:text-emerald-400">{vsr.referenceFileName}</code>
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowStyleGuideModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Tab Navigation (Format A, B, C, D, E) */}
            <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-100/70 dark:bg-slate-950/50 px-5 gap-1 overflow-x-auto">
              {[
                { id: 'A', label: 'A. Identitas Visual' },
                { id: 'B', label: 'B. Analisis Elemen (Tahap 1)' },
                { id: 'C', label: 'C. Style Guide (Tahap 2)' },
                { id: 'D', label: 'D. Prompt Siap Pakai (Tahap 3)' },
                { id: 'E', label: 'E. Moodboard (Tahap 4)' },
              ].map((tb) => (
                <button
                  key={tb.id}
                  type="button"
                  onClick={() => setActiveTab(tb.id as any)}
                  className={`py-2.5 px-3.5 text-xs font-bold border-b-2 transition-colors whitespace-nowrap ${
                    activeTab === tb.id
                      ? 'border-emerald-600 text-emerald-700 dark:text-emerald-400 bg-white dark:bg-slate-900'
                      : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {tb.label}
                </button>
              ))}
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-800 dark:text-slate-200">
              {activeTab === 'A' && (
                <div className="space-y-4">
                  <div className="p-4 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                      Nama Gaya Visual
                    </span>
                    <h4 className="text-lg font-bold text-emerald-950 dark:text-emerald-200 mt-0.5">
                      {vsr.sectionA_IdentitySummary.styleName}
                    </h4>
                    <p className="text-xs text-emerald-900/80 dark:text-emerald-300/80 mt-1 leading-relaxed">
                      {vsr.sectionA_IdentitySummary.overallCharacter}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 border border-slate-200 dark:border-slate-800 rounded-lg space-y-1.5">
                      <div className="text-xs font-bold text-slate-900 dark:text-white">
                        Mood & Atmosfer Desain
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                        {vsr.sectionA_IdentitySummary.moodAndAtmosphere}
                      </p>
                    </div>
                    <div className="p-4 border border-slate-200 dark:border-slate-800 rounded-lg space-y-1.5">
                      <div className="text-xs font-bold text-slate-900 dark:text-white">
                        Arketipe Desain (Design Archetype)
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                        {vsr.sectionA_IdentitySummary.designArchetype}
                      </p>
                    </div>
                  </div>

                  <div className="p-4 border border-slate-200 dark:border-slate-800 rounded-lg space-y-2">
                    <div className="text-xs font-bold text-slate-900 dark:text-white">
                      Kesesuaian Penerapan Lintas Bidang (Cross-Topic Suitability)
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      {vsr.sectionA_IdentitySummary.suitabilityCrossTopic.map((st, i) => (
                        <div key={i} className="flex items-center gap-2 p-2 rounded bg-slate-50 dark:bg-slate-950">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>{st}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'B' && (
                <div className="space-y-4">
                  <div className="border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden">
                    <div className="bg-slate-100 dark:bg-slate-950 px-4 py-2.5 text-xs font-bold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800">
                      Pengamatan Faktual Elemen Desain dari File Referensi (Tahap 1)
                    </div>
                    <div className="divide-y divide-slate-200 dark:divide-slate-800 text-xs">
                      {[
                        { label: 'Palet Warna Teramati', val: vsr.sectionB_DesignAnalysis.factualObservations.colorPaletteObserved },
                        { label: 'Tipografi & Hierarki Teks', val: vsr.sectionB_DesignAnalysis.factualObservations.typographyAndHierarchy },
                        { label: 'Komposisi & Tata Letak', val: vsr.sectionB_DesignAnalysis.factualObservations.layoutAndComposition },
                        { label: 'Ruang Kosong (Whitespace) & Kepadatan', val: vsr.sectionB_DesignAnalysis.factualObservations.whitespaceAndDensity },
                        { label: 'Fotografi, Ilustrasi & Ikon', val: vsr.sectionB_DesignAnalysis.factualObservations.imageryIllustrationIcons },
                        { label: 'Tekstur, Ornamen & Latar', val: vsr.sectionB_DesignAnalysis.factualObservations.texturesOrnamentsBackground },
                        { label: 'Karakter Sampul & Halaman Isi', val: vsr.sectionB_DesignAnalysis.factualObservations.coverAndContentCharacter },
                      ].map((obs, i) => (
                        <div key={i} className="p-3.5 grid grid-cols-1 sm:grid-cols-3 gap-2">
                          <div className="font-bold text-slate-900 dark:text-white">{obs.label}</div>
                          <div className="sm:col-span-2 text-slate-600 dark:text-slate-300 leading-relaxed">
                            {obs.val}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="p-3.5 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-xs text-amber-900 dark:text-amber-200">
                    <span className="font-bold">Keterbatasan Observasi: </span>
                    {vsr.sectionB_DesignAnalysis.observationalLimitations}
                  </div>
                </div>
              )}

              {activeTab === 'C' && (
                <div className="space-y-5">
                  {/* Swatches Warna */}
                  <div>
                    <div className="text-xs font-bold text-slate-900 dark:text-white mb-2">
                      Spesifikasi Palet Warna & Aturan Peran (Color Roles)
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5">
                      {vsr.sectionC_StyleGuide.colorRoles.map((cr, i) => (
                        <div key={i} className="p-3 border border-slate-200 dark:border-slate-800 rounded-lg flex flex-col justify-between">
                          <div className="flex items-center gap-2 mb-2">
                            <span
                              className="w-5 h-5 rounded-md border border-black/10 shrink-0"
                              style={{ backgroundColor: cr.hex }}
                            />
                            <span className="font-mono font-bold text-xs">{cr.hex}</span>
                          </div>
                          <div className="text-xs font-semibold text-slate-900 dark:text-white">
                            {cr.role}
                          </div>
                          <div className="text-[11px] text-slate-500 mt-1 leading-snug">
                            {cr.usageRule}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Aturan Tipografi & Tata Letak */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 border border-slate-200 dark:border-slate-800 rounded-lg space-y-2">
                      <div className="text-xs font-bold text-slate-900 dark:text-white">
                        Aturan Tipografi & Hierarki
                      </div>
                      <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                        {vsr.sectionC_StyleGuide.typographyRules.map((tr, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="text-emerald-600 font-bold">•</span>
                            <span>{tr}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-4 border border-slate-200 dark:border-slate-800 rounded-lg space-y-2">
                      <div className="text-xs font-bold text-slate-900 dark:text-white">
                        Aturan Sistem Tata Letak (Layout System)
                      </div>
                      <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                        {vsr.sectionC_StyleGuide.layoutSystemRules.map((lr, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="text-emerald-600 font-bold">•</span>
                            <span>{lr}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Elemen Keep, Adapt, Avoid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="p-3.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 space-y-2">
                      <div className="text-xs font-bold text-emerald-900 dark:text-emerald-200 flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span>DIPERTAHANKAN (DNA Visual)</span>
                      </div>
                      <ul className="space-y-1 text-[11px] text-emerald-950 dark:text-emerald-300">
                        {vsr.sectionC_StyleGuide.elementsToKeep.map((item, i) => (
                          <li key={i}>✓ {item}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-3.5 rounded-lg bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800 space-y-2">
                      <div className="text-xs font-bold text-sky-900 dark:text-sky-200 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-sky-600" />
                        <span>DISESUAIKAN (Topik Baru)</span>
                      </div>
                      <ul className="space-y-1 text-[11px] text-sky-950 dark:text-sky-300">
                        {vsr.sectionC_StyleGuide.elementsToAdapt.map((item, i) => (
                          <li key={i}>➔ {item}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-3.5 rounded-lg bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 space-y-2">
                      <div className="text-xs font-bold text-red-900 dark:text-red-200 flex items-center gap-1.5">
                        <X className="w-3.5 h-3.5 text-red-600" />
                        <span>DIHINDARI (Anti-Pattern)</span>
                      </div>
                      <ul className="space-y-1 text-[11px] text-red-950 dark:text-red-300">
                        {vsr.sectionC_StyleGuide.elementsToAvoid.map((item, i) => (
                          <li key={i}>✕ {item}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'D' && (
                <div className="space-y-4">
                  <div className="p-4 border border-slate-200 dark:border-slate-800 rounded-lg space-y-2">
                    <div className="text-xs font-bold text-slate-900 dark:text-white">
                      Strategi Adaptasi Lintas Topik (Tahap 3)
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                      {vsr.sectionD_ReadyDesignPrompt.crossTopicAdaptationStrategy}
                    </p>
                  </div>

                  <div className="p-4 border border-slate-200 dark:border-slate-800 rounded-lg space-y-2">
                    <div className="text-xs font-bold text-slate-900 dark:text-white">
                      Rekomendasi Kreatif Spesifik Topik Baru
                    </div>
                    <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                      {vsr.sectionD_ReadyDesignPrompt.creativeRecommendationsForNewTopic.map((rec, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-blue-600 font-bold">•</span>
                          <span>{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-4 rounded-lg bg-slate-900 text-white space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-emerald-400">
                        Master Design Prompt (Siap Pakai untuk Semua Topik)
                      </span>
                      <button
                        type="button"
                        onClick={handleCopyPrompt}
                        className="py-1 px-2.5 text-xs font-semibold rounded bg-emerald-700 hover:bg-emerald-600 text-white flex items-center gap-1 transition-colors"
                      >
                        {copiedPrompt ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedPrompt ? 'Tersalin!' : 'Salin Prompt'}</span>
                      </button>
                    </div>
                    <p className="text-xs font-mono leading-relaxed bg-slate-950 p-3 rounded border border-slate-800 text-slate-200">
                      {vsr.sectionD_ReadyDesignPrompt.masterDesignPrompt}
                    </p>
                  </div>
                </div>
              )}

              {activeTab === 'E' && (
                <div className="space-y-4">
                  <div className="p-4 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 space-y-1">
                    <div className="text-xs font-bold text-emerald-900 dark:text-emerald-200">
                      Konsep Moodboard Visual (Tahap 4)
                    </div>
                    <p className="text-xs text-emerald-950 dark:text-emerald-300 leading-relaxed">
                      {vsr.sectionE_MoodboardDirection.moodboardConcept}
                    </p>
                  </div>

                  <div className="p-4 border border-slate-200 dark:border-slate-800 rounded-lg space-y-2">
                    <div className="text-xs font-bold text-slate-900 dark:text-white">
                      Elemen Grafis & Motif Kunci
                    </div>
                    <div className="flex flex-wrap gap-2 text-xs">
                      {vsr.sectionE_MoodboardDirection.graphicElementsAndMotifs.map((motif, i) => (
                        <span key={i} className="px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                          {motif}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                    <div className="p-3.5 border border-slate-200 dark:border-slate-800 rounded-lg space-y-1.5">
                      <div className="font-bold text-slate-900 dark:text-white">
                        01. Halaman Sampul (Cover)
                      </div>
                      <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-[11px]">
                        {vsr.sectionE_MoodboardDirection.coverSlideDirection}
                      </p>
                    </div>

                    <div className="p-3.5 border border-slate-200 dark:border-slate-800 rounded-lg space-y-1.5">
                      <div className="font-bold text-slate-900 dark:text-white">
                        02. Halaman Isi (Content)
                      </div>
                      <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-[11px]">
                        {vsr.sectionE_MoodboardDirection.contentSlideDirection}
                      </p>
                    </div>

                    <div className="p-3.5 border border-slate-200 dark:border-slate-800 rounded-lg space-y-1.5">
                      <div className="font-bold text-slate-900 dark:text-white">
                        03. Halaman Penutup (Closing)
                      </div>
                      <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-[11px]">
                        {vsr.sectionE_MoodboardDirection.closingSlideDirection}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex flex-wrap items-center justify-between gap-3">
              <div className="text-xs text-slate-500">
                Template ini tersimpan di sistem dan dapat diterapkan langsung ke topik apa pun.
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowStyleGuideModal(false);
                    onStartNewWithTemplate(agroTemplate);
                  }}
                  className="py-2 px-4 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Gunakan Template Ini</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

interface AppSettingsViewProps {
  darkMode: boolean;
  onToggleDarkMode: (dark: boolean) => void;
  defaultLanguage: ContentLanguage;
  onChangeDefaultLanguage: (lang: ContentLanguage) => void;
  defaultAspectRatio: AspectRatioType;
  onChangeDefaultAspectRatio: (ratio: AspectRatioType) => void;
  autosaveEnabled: boolean;
  onToggleAutosave: (enabled: boolean) => void;
  projects: PresentationProject[];
  onImportProjectsBackup: (imported: PresentationProject[]) => void;
  onNotify: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export const AppSettingsView: React.FC<AppSettingsViewProps> = ({
  darkMode,
  onToggleDarkMode,
  defaultLanguage,
  onChangeDefaultLanguage,
  defaultAspectRatio,
  onChangeDefaultAspectRatio,
  autosaveEnabled,
  onToggleAutosave,
  projects,
  onImportProjectsBackup,
  onNotify,
}) => {
  const handleExportBackupJson = () => {
    const dataStr = JSON.stringify(projects, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ai_ppt_studio_backup_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    onNotify('Cadangan seluruh proyek berhasil diunduh (.json).', 'success');
  };

  const handleImportBackupJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result || '[]'));
        if (!Array.isArray(parsed)) {
          throw new Error('Format file cadangan harus berupa array proyek JSON.');
        }
        onImportProjectsBackup(parsed);
        onNotify(`Berhasil mengimpor ${parsed.length} proyek presentasi.`, 'success');
      } catch (err: any) {
        onNotify(err.message || 'File JSON tidak valid.', 'error');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-lg p-6 space-y-6">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Pengaturan Aplikasi & Preferensi Kerja
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Sesuaikan tema antarmuka, bahasa default presentasi, rasio kanvas, penyimpanan otomatis, serta pencadangan data proyek.
          </p>
        </div>

        <div className="space-y-4 divide-y divide-slate-200 dark:divide-slate-800">
          {/* Dark Mode Toggle */}
          <div className="pt-4 first:pt-0 flex items-center justify-between gap-4">
            <div>
              <div className="text-sm font-bold text-slate-900 dark:text-white">
                Tema Tampilan Antarmuka
              </div>
              <div className="text-xs text-slate-500">
                Beralih antara Mode Terang (Light) dan Mode Gelap (Dark Slate).
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onToggleDarkMode(false)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md border ${
                  !darkMode
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                <Sun className="w-3.5 h-3.5" />
                <span>Terang</span>
              </button>
              <button
                type="button"
                onClick={() => onToggleDarkMode(true)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md border ${
                  darkMode
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                <Moon className="w-3.5 h-3.5" />
                <span>Gelap</span>
              </button>
            </div>
          </div>

          {/* Default Presentation Content Language */}
          <div className="pt-4 flex items-center justify-between gap-4">
            <div>
              <div className="text-sm font-bold text-slate-900 dark:text-white">
                Bahasa Default Konten Presentasi
              </div>
              <div className="text-xs text-slate-500">
                Bahasa utama yang dipilih secara otomatis saat membuat presentasi baru.
              </div>
            </div>
            <select
              value={defaultLanguage}
              onChange={(e) => onChangeDefaultLanguage(e.target.value as ContentLanguage)}
              className="px-3 py-2 text-xs font-semibold border border-slate-300 dark:border-slate-700 rounded-md bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
            >
              <option value="id">Bahasa Indonesia (Default)</option>
              <option value="en">English (Inggris)</option>
            </select>
          </div>

          {/* Default Slide Aspect Ratio */}
          <div className="pt-4 flex items-center justify-between gap-4">
            <div>
              <div className="text-sm font-bold text-slate-900 dark:text-white">
                Rasio Slide Default
              </div>
              <div className="text-xs text-slate-500">
                Widescreen 16:9 (proyektor modern) atau Standard 4:3 (dokumen klasik).
              </div>
            </div>
            <div className="flex items-center gap-2">
              {(['16:9', '4:3'] as AspectRatioType[]).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => onChangeDefaultAspectRatio(r)}
                  className={`px-3.5 py-1.5 text-xs font-mono font-semibold rounded-md border tabular-nums ${
                    defaultAspectRatio === r
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          {/* Autosave Toggle */}
          <div className="pt-4 flex items-center justify-between gap-4">
            <div>
              <div className="text-sm font-bold text-slate-900 dark:text-white">
                Penyimpanan Otomatis (Autosave)
              </div>
              <div className="text-xs text-slate-500">
                Simpan setiap perubahan slide secara otomatis ke server dan Cloud Firestore.
              </div>
            </div>
            <label className="inline-flex items-center gap-2 text-xs font-semibold cursor-pointer">
              <input
                type="checkbox"
                checked={autosaveEnabled}
                onChange={(e) => onToggleAutosave(e.target.checked)}
                className="w-4 h-4 rounded text-blue-600"
              />
              <span>{autosaveEnabled ? 'Aktif' : 'Nonaktif'}</span>
            </label>
          </div>

          {/* Backup & Restore JSON */}
          <div className="pt-4 flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="text-sm font-bold text-slate-900 dark:text-white">
                Ekspor & Impor Arsip Proyek (.JSON)
              </div>
              <div className="text-xs text-slate-500">
                Unduh seluruh proyek presentasi ({projects.length} proyek) sebagai cadangan lokal atau pulihkan dari file JSON.
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleExportBackupJson}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 rounded-md hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Ekspor JSON</span>
              </button>
              <label className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-md cursor-pointer">
                <Upload className="w-3.5 h-3.5" />
                <span>Impor JSON</span>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImportBackupJson}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const HelpDocumentationView: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-lg p-6 space-y-6">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Pusat Bantuan & Dokumentasi AI PPT Studio
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Panduan lengkap pembuatan presentasi otomatis dari ide atau dokumen hingga menjadi file Microsoft PowerPoint (.pptx) dan PDF yang siap digunakan.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 border border-slate-200 dark:border-slate-800 rounded-lg space-y-2">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span>01. Alur Wizard 4 Langkah</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Mulai di menu <strong>Buat Presentasi</strong>: (A) Pilih materi dari topik, tempel teks, atau unggah dokumen PDF/DOCX/PPTX/TXT; (B) Atur audiens, jumlah slide, kedalaman, dan rasio 16:9 atau 4:3; (C) Tinjau dan sesuaikan Outline AI; (D) Generate isi slide secara bertahap dengan kemampuan retry per-slide.
            </p>
          </div>

          <div className="p-4 border border-slate-200 dark:border-slate-800 rounded-lg space-y-2">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
              <Layers className="w-4 h-4 text-blue-600" />
              <span>02. Editor PowerPoint 3 Panel</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Panel kiri mengelola urutan slide; panel tengah menyediakan kanvas WYSIWYG interaktif, editor catatan pembicara, tabel/grafik, dan verifikasi referensi; panel kanan mengatur tata letak, font, warna tema, 11 tindakan AI, serta audit kualitas slide.
            </p>
          </div>

          <div className="p-4 border border-slate-200 dark:border-slate-800 rounded-lg space-y-2">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
              <FileSpreadsheet className="w-4 h-4 text-blue-600" />
              <span>03. Ekspor PPTX & PDF Asli</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Tombol <strong>Download PPTX</strong> menggunakan engine PptxGenJS di sisi server untuk membangun objek PowerPoint asli (kotak teks yang dapat diedit, tabel, grafik, bentuk diagram, dan speaker notes). Tombol <strong>Download PDF</strong> menghasilkan dokumen landscape presisi.
            </p>
          </div>

          <div className="p-4 border border-slate-200 dark:border-slate-800 rounded-lg space-y-2">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>04. Keamanan Kredensial & Kejujuran Referensi</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Seluruh pemanggilan AI berjalan di server melalui endpoint <code>/api/ai/*</code> tanpa pernah mengekspos API Key ke browser. Selain itu, referensi yang dihasilkan AI ditandai sebagai <em>Perlu Diverifikasi</em> hingga Anda memeriksa keaslian sumbernya.
            </p>
          </div>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white">
            <BookOpen className="w-4 h-4 text-blue-600" />
            <span>Pintasan Keyboard pada Present Mode (Layar Penuh)</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-slate-600 dark:text-slate-400 pt-1">
            <div>
              <code className="px-1.5 py-0.5 bg-slate-200 dark:bg-slate-800 rounded font-mono">
                ArrowRight / Space
              </code>{' '}
              Slide berikutnya
            </div>
            <div>
              <code className="px-1.5 py-0.5 bg-slate-200 dark:bg-slate-800 rounded font-mono">
                ArrowLeft
              </code>{' '}
              Slide sebelumnya
            </div>
            <div>
              <code className="px-1.5 py-0.5 bg-slate-200 dark:bg-slate-800 rounded font-mono">
                ESC
              </code>{' '}
              Keluar dari layar penuh
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
