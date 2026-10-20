import React, { useState } from 'react';
import {
  AspectRatioType,
  ContentLanguage,
  DepthLevelType,
  OutlineItem,
  PresentationConfig,
  PresentationProject,
  SlideData,
  SlideLayoutType,
  VisualStyleReferenceReport,
  WritingStyleType,
} from '../types/presentation';
import { PRESENTATION_TEMPLATES, INITIAL_SAMPLE_PROJECTS } from '../data/templates';
import { apiRequest } from '../lib/apiClient';
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  CheckCircle2,
  Copy,
  Eye,
  FileText,
  Layers,
  Loader2,
  Palette,
  Plus,
  RefreshCw,
  Sparkles,
  Trash2,
  Upload,
  AlertCircle,
} from 'lucide-react';

interface PresentationWizardProps {
  initialTopic?: string;
  initialSourceType?: 'topic' | 'text' | 'document' | 'outline' | 'visual-reference';
  initialTemplateId?: string;
  activeAiConfigId?: string;
  defaultLanguage: ContentLanguage;
  onCompleteProject: (project: PresentationProject) => void;
  onNotify: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

const LAYOUT_OPTIONS: { value: SlideLayoutType; label: string }[] = [
  { value: 'cover', label: 'Cover / Sampul' },
  { value: 'agenda', label: 'Agenda / Daftar Isi' },
  { value: 'concept', label: 'Konsep & Poin Inti' },
  { value: 'comparison', label: 'Perbandingan (2 Kolom)' },
  { value: 'process', label: 'Diagram Proses (Tahapan)' },
  { value: 'timeline', label: 'Linimasa (Timeline)' },
  { value: 'statistics', label: 'Kartu Statistik / KPI' },
  { value: 'chart', label: 'Grafik Data (Batang/Garis/Pie)' },
  { value: 'table', label: 'Tabel Terstruktur' },
  { value: 'case-study', label: 'Studi Kasus' },
  { value: 'conclusion', label: 'Kesimpulan & Rekomendasi' },
  { value: 'references', label: 'Daftar Pustaka & Referensi' },
];

export const PresentationWizard: React.FC<PresentationWizardProps> = ({
  initialTopic = '',
  initialSourceType = 'topic',
  initialTemplateId = 'tpl-akademik-oxford',
  activeAiConfigId,
  defaultLanguage,
  onCompleteProject,
  onNotify,
}) => {
  const [step, setStep] = useState<'A' | 'B' | 'C' | 'D'>('A');
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>(initialTemplateId);
  const [customSlideCountMode, setCustomSlideCountMode] = useState(false);

  const [config, setConfig] = useState<PresentationConfig>({
    title: initialTopic ? initialTopic.slice(0, 90) : '',
    topic: initialTopic,
    purpose: 'Menyajikan analisis komprehensif, argumen terstruktur, dan rekomendasi praktis.',
    targetAudience: 'Mahasiswa, Dosen, Manajemen Eksekutif, dan Praktisi Profesional',
    language: defaultLanguage,
    slideCount: 8,
    durationMinutes: 20,
    depthLevel: 'standar',
    writingStyle: 'profesional',
    visualStyle: 'Modern & Bersih',
    aspectRatio: '16:9',
    citationStyle: 'APA',
    sourceType: initialSourceType,
    sourceMaterial: '',
  });

  // Document extraction state
  const [extractingDoc, setExtractingDoc] = useState(false);
  const [docConfirmed, setDocConfirmed] = useState(false);
  const [docError, setDocError] = useState<string | null>(null);

  // Visual Style Reference (Tahap 1–4 & Format A–E) state
  const [analyzingStyle, setAnalyzingStyle] = useState(false);
  const [styleError, setStyleError] = useState<string | null>(null);
  const [styleGuideConfirmed, setStyleGuideConfirmed] = useState(false);

  // Step C: Outline state
  const [outline, setOutline] = useState<OutlineItem[]>([]);
  const [generatingOutline, setGeneratingOutline] = useState(false);
  const [outlineError, setOutlineError] = useState<string | null>(null);

  // Step D: Slide Generation Progress
  const [slidesByNumber, setSlidesByNumber] = useState<Record<number, SlideData>>({});
  const [slideStatuses, setSlideStatuses] = useState<
    Record<number, 'pending' | 'generating' | 'done' | 'error'>
  >({});
  const [slideErrors, setSlideErrors] = useState<Record<number, string>>({});
  const [isGeneratingAllSlides, setIsGeneratingAllSlides] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setDocError(null);
    setDocConfirmed(false);

    const maxBytes = 10 * 1024 * 1024;
    if (file.size > maxBytes) {
      const msg = 'Ukuran file melebihi batas 10 MB. Pilih file yang lebih kecil.';
      setDocError(msg);
      onNotify(msg, 'error');
      return;
    }

    const allowedExts = ['.pdf', '.docx', '.pptx', '.txt', '.md', '.csv', '.json'];
    const lowerName = file.name.toLowerCase();
    if (!allowedExts.some((ext) => lowerName.endsWith(ext))) {
      const msg = 'Format file tidak didukung. Gunakan PDF, DOCX, PPTX, TXT, MD, atau CSV.';
      setDocError(msg);
      onNotify(msg, 'error');
      return;
    }

    setExtractingDoc(true);
    try {
      const base64Data = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          const resStr = String(reader.result || '');
          const commaIdx = resStr.indexOf(',');
          resolve(commaIdx >= 0 ? resStr.slice(commaIdx + 1) : resStr);
        };
        reader.onerror = () => reject(new Error('Gagal membaca file.'));
        reader.readAsDataURL(file);
      });

      const { ok, data } = await apiRequest('/api/documents/extract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fileName: file.name,
          fileSize: file.size,
          mimeType: file.type,
          base64Data,
        }),
      });

      if (!ok) {
        throw new Error(data.error || 'Gagal mengekstrak isi dokumen.');
      }

      setConfig((prev) => ({
        ...prev,
        title: prev.title || file.name.replace(/\.[^.]+$/, ''),
        topic: prev.topic || `Presentasi berdasarkan dokumen ${file.name}`,
        sourceMaterial: data.extractedText || '',
        extractedDocMeta: {
          fileName: data.fileName,
          fileSize: data.fileSize,
          wordCount: data.wordCount,
          summary: data.summary || [],
        },
      }));
      onNotify(`Dokumen "${file.name}" berhasil diekstrak (${data.wordCount} kata).`, 'success');
    } catch (err: any) {
      setDocError(err.message || 'Gagal mengekstrak dokumen.');
      onNotify(err.message || 'Gagal mengekstrak dokumen.', 'error');
    } finally {
      setExtractingDoc(false);
    }
  };

  const handleVisualStyleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setStyleError(null);
    setStyleGuideConfirmed(false);

    const maxBytes = 10 * 1024 * 1024;
    if (file.size > maxBytes) {
      const msg = 'Ukuran file referensi melebihi batas 10 MB.';
      setStyleError(msg);
      onNotify(msg, 'error');
      return;
    }

    const allowedExts = ['.pptx', '.pdf', '.png', '.jpg', '.jpeg', '.webp', '.docx', '.txt'];
    const lowerName = file.name.toLowerCase();
    if (!allowedExts.some((ext) => lowerName.endsWith(ext))) {
      const msg =
        'Format file referensi tidak didukung. Gunakan PPTX, PDF, PNG, JPG, WEBP, atau DOCX.';
      setStyleError(msg);
      onNotify(msg, 'error');
      return;
    }

    setAnalyzingStyle(true);
    try {
      const base64Data = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          const resStr = String(reader.result || '');
          const commaIdx = resStr.indexOf(',');
          resolve(commaIdx >= 0 ? resStr.slice(commaIdx + 1) : resStr);
        };
        reader.onerror = () => reject(new Error('Gagal membaca file referensi visual.'));
        reader.readAsDataURL(file);
      });

      const { ok, data } = await apiRequest('/api/ai/analyze-visual-style', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fileName: file.name,
          fileSize: file.size,
          mimeType: file.type,
          base64Data,
          targetNewTopic:
            config.topic ||
            'Topik Baru Lintas Bidang (Teknologi, Bisnis, Pendidikan, Kesehatan, Sains, Lingkungan, atau Budaya)',
          language: config.language,
          aiConfigId: activeAiConfigId,
        }),
      });

      if (!ok || !data.report) {
        throw new Error(data.error || 'Gagal menganalisis gaya visual file referensi.');
      }

      const report: VisualStyleReferenceReport = data.report;
      setConfig((prev) => ({
        ...prev,
        visualStyle: report.sectionA_IdentitySummary.styleName,
        visualStyleReference: report,
        title:
          prev.title ||
          (prev.topic
            ? prev.topic.slice(0, 90)
            : `Adaptasi Gaya Visual: ${report.sectionA_IdentitySummary.styleName}`),
      }));
      onNotify(
        `Analisis Gaya Visual "${file.name}" selesai! Silakan tinjau Format A–E sebelum membuat slide.`,
        'success'
      );
    } catch (err: any) {
      setStyleError(err.message || 'Gagal menganalisis gaya visual.');
      onNotify(err.message || 'Gagal menganalisis gaya visual.', 'error');
    } finally {
      setAnalyzingStyle(false);
    }
  };

  const handleBuildStyleGuidePresentationDeck = () => {
    const vsr = config.visualStyleReference;
    if (!vsr) {
      const prebuilt = INITIAL_SAMPLE_PROJECTS.find(
        (p) => p.id === 'proj-visual-style-reference-guide'
      );
      if (prebuilt) {
        onCompleteProject({
          ...prebuilt,
          id: `proj-vsr-${Date.now()}`,
          updatedAt: new Date().toISOString(),
        });
        onNotify(
          'Presentasi Sistem Gaya Visual (Format A–E) berhasil dibuka di Editor PowerPoint!',
          'success'
        );
      }
      return;
    }

    const extTheme = vsr.sectionC_StyleGuide.extractedTheme;
    const deckSlides: SlideData[] = [
      {
        id: `vsr-s1-${Date.now()}`,
        slideNumber: 1,
        title: `A. Ringkasan Identitas Visual: ${vsr.sectionA_IdentitySummary.styleName}`,
        subtitle: `Arketipe: ${vsr.sectionA_IdentitySummary.designArchetype} · Referensi: ${vsr.referenceFileName}`,
        layout: 'cover',
        bullets: [
          `Karakter Visual Utama: ${vsr.sectionA_IdentitySummary.overallCharacter}`,
          `Atmosfer & Mood Desain: ${vsr.sectionA_IdentitySummary.moodAndAtmosphere}`,
          `Kesesuaian Lintas Topik: ${vsr.sectionA_IdentitySummary.suitabilityCrossTopic.join(', ')}`,
        ],
        bodyText: `Dokumen Visual Style Reference (Format A–E) hasil analisis dari ${vsr.referenceFileName} untuk diadaptasi ke topik baru: "${vsr.targetNewTopic}".`,
        visualSuggestion: {
          type: 'diagram',
          description: vsr.sectionE_MoodboardDirection.coverSlideDirection,
        },
        customElements: [],
        speakerNotes: `Slide 1 merangkum Bagian A: Identitas Visual dari file referensi ${vsr.referenceFileName}.`,
        references: [],
      },
      {
        id: `vsr-s2-${Date.now()}`,
        slideNumber: 2,
        title: 'B. Analisis Elemen Desain dari File Referensi (Tahap 1)',
        subtitle:
          'Pemisahan hasil pengamatan faktual pada file referensi dengan pernyataan keterbatasan observasi',
        layout: 'table',
        bullets: [
          `Karakter Sampul & Halaman Isi: ${vsr.sectionB_DesignAnalysis.factualObservations.coverAndContentCharacter}`,
          `Keterbatasan Observasi File: ${vsr.sectionB_DesignAnalysis.observationalLimitations}`,
        ],
        tableData: {
          headers: ['Aspek Elemen Desain', 'Hasil Pengamatan Faktual dari File Referensi'],
          rows: [
            ['Palet Warna Teramati', vsr.sectionB_DesignAnalysis.factualObservations.colorPaletteObserved],
            ['Tipografi & Hierarki Teks', vsr.sectionB_DesignAnalysis.factualObservations.typographyAndHierarchy],
            ['Komposisi & Tata Letak', vsr.sectionB_DesignAnalysis.factualObservations.layoutAndComposition],
            ['Ruang Kosong (Whitespace)', vsr.sectionB_DesignAnalysis.factualObservations.whitespaceAndDensity],
            ['Fotografi, Ilustrasi & Ikon', vsr.sectionB_DesignAnalysis.factualObservations.imageryIllustrationIcons],
            ['Tekstur, Ornamen & Latar', vsr.sectionB_DesignAnalysis.factualObservations.texturesOrnamentsBackground],
          ],
        },
        visualSuggestion: {
          type: 'table',
          description: 'Tabel audit pengamatan faktual elemen desain dari file referensi.',
        },
        customElements: [],
        speakerNotes: `Slide 2 memuat Bagian B (Tahap 1): Hasil pengamatan objektif dari file ${vsr.referenceFileName} beserta batasan observasinya.`,
        references: [],
      },
      {
        id: `vsr-s3-${Date.now()}`,
        slideNumber: 3,
        title: 'C.1 Panduan Visual Style Guide: Palet Warna & Tipografi (Tahap 2)',
        subtitle: vsr.sectionC_StyleGuide.visualConcept,
        layout: 'statistics',
        bullets: [
          ...vsr.sectionC_StyleGuide.typographyRules.slice(0, 2),
          ...vsr.sectionC_StyleGuide.layoutSystemRules.slice(0, 2),
        ],
        statCards: vsr.sectionC_StyleGuide.colorRoles.slice(0, 3).map((cr) => ({
          value: cr.hex,
          label: cr.role,
          context: cr.usageRule,
        })),
        visualSuggestion: {
          type: 'stat-cards',
          description: 'Kartu spesifikasi palet warna HEX dan sistem tipografi.',
        },
        customElements: [],
        speakerNotes: 'Slide 3 menampilkan Bagian C.1: Spesifikasi palet warna HEX dan aturan tipografi.',
        references: [],
      },
      {
        id: `vsr-s4-${Date.now()}`,
        slideNumber: 4,
        title: 'C.2 Aturan Konsistensi: Dipertahankan, Disesuaikan & Dihindari',
        subtitle:
          'Pedoman menjaga DNA visual referensi tanpa menyalin elemen tematik lama yang tidak relevan',
        layout: 'comparison',
        bullets: vsr.sectionC_StyleGuide.elementsToAvoid.map(
          (av) => `Dihindari (Anti-Pattern): ${av}`
        ),
        comparison: {
          leftTitle: 'DIPERTAHANKAN (DNA Visual Referensi)',
          leftItems: vsr.sectionC_StyleGuide.elementsToKeep,
          rightTitle: 'DISESUAIKAN (Adaptasi Topik Baru)',
          rightItems: vsr.sectionC_StyleGuide.elementsToAdapt,
        },
        visualSuggestion: {
          type: 'comparison',
          description: 'Perbandingan elemen visual yang dipertahankan vs disesuaikan untuk topik baru.',
        },
        customElements: [],
        speakerNotes: 'Slide 4 merinci elemen yang wajib dipertahankan, disesuaikan, dan dihindari.',
        references: [],
      },
      {
        id: `vsr-s5-${Date.now()}`,
        slideNumber: 5,
        title: `D.1 Adaptasi ke Topik Baru: ${vsr.targetNewTopic} (Tahap 3)`,
        subtitle: vsr.sectionD_ReadyDesignPrompt.crossTopicAdaptationStrategy,
        layout: 'process',
        bullets: vsr.sectionD_ReadyDesignPrompt.creativeRecommendationsForNewTopic,
        processSteps: vsr.sectionD_ReadyDesignPrompt.creativeRecommendationsForNewTopic
          .slice(0, 4)
          .map((rec, idx) => ({
            step: `0${idx + 1}`,
            title: `Rekomendasi Kreatif #${idx + 1}`,
            detail: rec,
          })),
        visualSuggestion: {
          type: 'diagram',
          description: 'Tahapan adaptasi kreatif DNA visual referensi ke topik baru.',
        },
        customElements: [],
        speakerNotes:
          'Slide 5 memisahkan rekomendasi kreatif untuk topik baru dari hasil pengamatan file asli.',
        references: [],
      },
      {
        id: `vsr-s6-${Date.now()}`,
        slideNumber: 6,
        title: 'D.2 Prompt Desain Siap Pakai untuk Topik Baru',
        subtitle: 'Master Design Prompt untuk digunakan lintas topik dengan karakter visual yang konsisten',
        layout: 'concept',
        bullets: [
          `MASTER DESIGN PROMPT: "${vsr.sectionD_ReadyDesignPrompt.masterDesignPrompt}"`,
          ...vsr.sectionC_StyleGuide.consistencyRules.slice(0, 3),
        ],
        bodyText:
          'Gunakan prompt desain di atas untuk menghasilkan slide baru pada topik apa pun dengan tetap mempertahankan karakter visual referensi.',
        visualSuggestion: {
          type: 'illustration',
          description: 'Blok Master Design Prompt lintas topik.',
        },
        customElements: [],
        speakerNotes: 'Slide 6 menyajikan Bagian D: Prompt desain siap pakai untuk topik baru.',
        references: [],
      },
      {
        id: `vsr-s7-${Date.now()}`,
        slideNumber: 7,
        title: 'E. Arahan Pembuatan Moodboard Visual: Sampul, Isi & Penutup (Tahap 4)',
        subtitle: vsr.sectionE_MoodboardDirection.moodboardConcept,
        layout: 'timeline',
        bullets: vsr.sectionE_MoodboardDirection.graphicElementsAndMotifs,
        timelineItems: [
          {
            period: '01. SAMPUL (COVER)',
            event: 'Arahan Komposisi Halaman Sampul',
            impact: vsr.sectionE_MoodboardDirection.coverSlideDirection,
          },
          {
            period: '02. HALAMAN ISI (CONTENT)',
            event: 'Arahan Komposisi Halaman Isi & Data',
            impact: vsr.sectionE_MoodboardDirection.contentSlideDirection,
          },
          {
            period: '03. PENUTUP (CLOSING)',
            event: 'Arahan Komposisi Halaman Penutup',
            impact: vsr.sectionE_MoodboardDirection.closingSlideDirection,
          },
        ],
        visualSuggestion: {
          type: 'timeline',
          description: 'Blueprint Moodboard Visual untuk Sampul, Isi, dan Penutup.',
        },
        customElements: [],
        speakerNotes: 'Slide 7 merangkum Bagian E: Arahan Moodboard Visual.',
        references: [],
      },
    ];

    const newProj: PresentationProject = {
      id: `proj-vsr-${Date.now()}`,
      title: `Visual Style Guide (A–E): ${vsr.sectionA_IdentitySummary.styleName}`,
      topic: vsr.targetNewTopic,
      config: {
        ...config,
        title: `Visual Style Guide (A–E): ${vsr.sectionA_IdentitySummary.styleName}`,
        slideCount: deckSlides.length,
      },
      theme: {
        templateId: 'tpl-minimalis-swiss',
        primaryColor: extTheme.primaryColor || '#2563EB',
        secondaryColor: extTheme.secondaryColor || '#1D4ED8',
        backgroundColor: extTheme.backgroundColor || '#F8FAFC',
        surfaceColor: extTheme.surfaceColor || '#FFFFFF',
        textColor: extTheme.textColor || '#0F172A',
        mutedTextColor: extTheme.mutedTextColor || '#475569',
        fontFamily: extTheme.fontFamily || 'Plus Jakarta Sans',
        cornerRadius: extTheme.cornerRadius || 'rounded',
        illustrationStyle: extTheme.illustrationStyle || 'editorial',
        titlePlacement: extTheme.titlePlacement || 'left',
        showHeaderFooter: true,
        headerText: `VISUAL STYLE REFERENCE: ${vsr.sectionA_IdentitySummary.styleName.toUpperCase()}`,
        footerText: `Ref: ${vsr.referenceFileName} · Adaptasi Lintas Topik`,
        showSlideNumbers: true,
        institutionName: 'Visual Style Reference Studio',
        institutionLogoText: 'STYLE DNA',
      },
      outline: deckSlides.map((s) => ({
        id: `out-${s.slideNumber}`,
        slideNumber: s.slideNumber,
        title: s.title,
        mainIdea: s.subtitle || '',
        summaryPoints: s.bullets,
        suggestedLayout: s.layout,
      })),
      slides: deckSlides,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onCompleteProject(newProj);
    onNotify(
      'Deck Presentasi Visual Style Reference (Format A–E) berhasil dibuat & siap diunduh sebagai PPTX/PDF!',
      'success'
    );
  };

  const handleProceedFromStepA = () => {
    if (config.sourceType === 'topic' && !config.topic.trim()) {
      onNotify('Silakan masukkan topik atau ide presentasi terlebih dahulu.', 'error');
      return;
    }
    if (
      (config.sourceType === 'text' || config.sourceType === 'outline') &&
      !config.sourceMaterial.trim()
    ) {
      onNotify('Silakan tempelkan teks materi atau kerangka presentasi terlebih dahulu.', 'error');
      return;
    }
    if (config.sourceType === 'document') {
      if (!config.extractedDocMeta || !config.sourceMaterial.trim()) {
        onNotify('Silakan unggah dokumen terlebih dahulu.', 'error');
        return;
      }
      if (!docConfirmed) {
        onNotify('Harap centang konfirmasi materi hasil ekstraksi sebelum melanjutkan.', 'error');
        return;
      }
    }
    if (config.sourceType === 'visual-reference') {
      if (!config.visualStyleReference) {
        onNotify(
          'Jangan membuat desain final sebelum gaya visual referensi dianalisis. Unggah file referensi terlebih dahulu.',
          'error'
        );
        return;
      }
      if (!config.topic.trim()) {
        onNotify(
          'Masukkan Topik Baru yang ingin Anda terapkan menggunakan gaya visual referensi ini.',
          'error'
        );
        return;
      }
      if (!styleGuideConfirmed) {
        onNotify(
          'Harap centang konfirmasi bahwa Anda telah meninjau hasil Analisis Gaya Visual (A–E) sebelum membuat desain final.',
          'error'
        );
        return;
      }
    }
    if (!config.title.trim()) {
      setConfig((prev) => ({
        ...prev,
        title: (prev.topic || prev.extractedDocMeta?.fileName || 'Presentasi Baru').slice(0, 100),
      }));
    }
    setStep('B');
  };

  const generateOutlineFromAI = async () => {
    setGeneratingOutline(true);
    setOutlineError(null);
    setStep('C');

    try {
      const { ok, data } = await apiRequest('/api/ai/generate-outline', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          config,
          aiConfigId: activeAiConfigId,
        }),
      });
      if (!ok) {
        throw new Error(data.error || 'Gagal membuat outline dari AI.');
      }
      setOutline(data.outline || []);
      onNotify(`Berhasil menyusun kerangka ${data.outline?.length || 0} slide.`, 'success');
    } catch (err: any) {
      setOutlineError(err.message || 'Gagal membuat outline presentasi.');
      onNotify(err.message || 'Gagal membuat outline presentasi.', 'error');
    } finally {
      setGeneratingOutline(false);
    }
  };

  const generateSingleSlideItem = async (item: OutlineItem, totalCount: number): Promise<SlideData | null> => {
    setSlideStatuses((prev) => ({ ...prev, [item.slideNumber]: 'generating' }));
    setSlideErrors((prev) => {
      const copy = { ...prev };
      delete copy[item.slideNumber];
      return copy;
    });

    try {
      const { ok, data } = await apiRequest('/api/ai/generate-single-slide', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          config,
          outlineItem: item,
          totalSlides: totalCount,
          aiConfigId: activeAiConfigId,
        }),
      });
      if (!ok) {
        throw new Error(data.error || `Gagal membuat Slide ${item.slideNumber}`);
      }
      const generated: SlideData = data.slide;
      setSlidesByNumber((prev) => ({ ...prev, [item.slideNumber]: generated }));
      setSlideStatuses((prev) => ({ ...prev, [item.slideNumber]: 'done' }));
      return generated;
    } catch (err: any) {
      setSlideStatuses((prev) => ({ ...prev, [item.slideNumber]: 'error' }));
      setSlideErrors((prev) => ({
        ...prev,
        [item.slideNumber]: err.message || 'Gagal membuat slide ini.',
      }));
      return null;
    }
  };

  const startGeneratingAllSlides = async () => {
    if (outline.length === 0) {
      onNotify('Outline masih kosong. Tambahkan minimal 1 slide.', 'error');
      return;
    }
    setStep('D');
    setIsGeneratingAllSlides(true);

    const normalizedOutline = outline.map((item, idx) => ({
      ...item,
      slideNumber: idx + 1,
    }));
    setOutline(normalizedOutline);

    const initialStatus: Record<number, 'pending' | 'generating' | 'done' | 'error'> = {};
    normalizedOutline.forEach((it) => {
      initialStatus[it.slideNumber] = slidesByNumber[it.slideNumber] ? 'done' : 'pending';
    });
    setSlideStatuses(initialStatus);

    const generatedResults: Record<number, SlideData> = { ...slidesByNumber };

    for (const item of normalizedOutline) {
      if (generatedResults[item.slideNumber]) continue;
      const res = await generateSingleSlideItem(item, normalizedOutline.length);
      if (res) {
        generatedResults[item.slideNumber] = res;
      }
    }

    setIsGeneratingAllSlides(false);
    const completedCount = Object.keys(generatedResults).length;
    if (completedCount === normalizedOutline.length) {
      onNotify('Seluruh slide berhasil dibuat oleh AI!', 'success');
    } else {
      onNotify(
        `${completedCount} dari ${normalizedOutline.length} slide selesai. Anda dapat menekan "Coba Lagi" pada slide yang gagal.`,
        'info'
      );
    }
  };

  const handleFinalizeAndOpenEditor = () => {
    const selectedTpl =
      PRESENTATION_TEMPLATES.find((t) => t.id === selectedTemplateId) || PRESENTATION_TEMPLATES[0];

    const finalSlides: SlideData[] = outline.map((item, idx) => {
      const num = idx + 1;
      const existing = slidesByNumber[num];
      if (existing) {
        return { ...existing, slideNumber: num };
      }
      // Fallback slide if user chooses to proceed before retrying a failed slide
      return {
        id: `sld-fallback-${Date.now()}-${num}`,
        slideNumber: num,
        title: item.title,
        subtitle: item.mainIdea,
        layout: item.suggestedLayout,
        bullets: item.summaryPoints,
        bodyText: '',
        customElements: [],
        speakerNotes: `Catatan pembicara untuk slide ${item.title}.`,
        references: [],
      };
    });

    const vsrTheme = config.visualStyleReference?.sectionC_StyleGuide.extractedTheme;
    const resolvedTheme = vsrTheme
      ? {
          ...selectedTpl.theme,
          primaryColor: vsrTheme.primaryColor || selectedTpl.theme.primaryColor,
          secondaryColor: vsrTheme.secondaryColor || selectedTpl.theme.secondaryColor,
          backgroundColor: vsrTheme.backgroundColor || selectedTpl.theme.backgroundColor,
          surfaceColor: vsrTheme.surfaceColor || selectedTpl.theme.surfaceColor,
          textColor: vsrTheme.textColor || selectedTpl.theme.textColor,
          mutedTextColor: vsrTheme.mutedTextColor || selectedTpl.theme.mutedTextColor,
          fontFamily: vsrTheme.fontFamily || selectedTpl.theme.fontFamily,
          cornerRadius: vsrTheme.cornerRadius || selectedTpl.theme.cornerRadius,
          illustrationStyle: vsrTheme.illustrationStyle || selectedTpl.theme.illustrationStyle,
          titlePlacement: vsrTheme.titlePlacement || selectedTpl.theme.titlePlacement,
          headerText: config.visualStyleReference
            ? `${config.visualStyleReference.sectionA_IdentitySummary.styleName.toUpperCase()} · ${
                config.title || config.topic
              }`
            : selectedTpl.theme.headerText,
        }
      : { ...selectedTpl.theme };

    const newProject: PresentationProject = {
      id: `proj-${Date.now()}`,
      title: config.title || config.topic || 'Presentasi AI Baru',
      topic: config.topic || config.title,
      config: {
        ...config,
        slideCount: finalSlides.length,
      },
      theme: resolvedTheme,
      outline,
      slides: finalSlides,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onCompleteProject(newProject);
  };

  const moveOutlineSlide = (index: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= outline.length) return;
    const next = [...outline];
    const [moved] = next.splice(index, 1);
    next.splice(targetIdx, 0, moved);
    setOutline(
      next.map((item, idx) => ({
        ...item,
        slideNumber: idx + 1,
      }))
    );
  };

  const addOutlineSlide = () => {
    const newNum = outline.length + 1;
    setOutline([
      ...outline,
      {
        id: `out-${Date.now()}`,
        slideNumber: newNum,
        title: `Topik Pembahasan Slide ${newNum}`,
        mainIdea: 'Gagasan utama atau analisis pendukung pada bagian ini.',
        summaryPoints: ['Poin pembahasan pertama', 'Poin pembahasan kedua', 'Implikasi praktis'],
        suggestedLayout: 'concept',
      },
    ]);
  };

  const deleteOutlineSlide = (index: number) => {
    if (outline.length <= 1) {
      onNotify('Presentasi harus memiliki minimal 1 slide.', 'error');
      return;
    }
    const next = outline
      .filter((_, idx) => idx !== index)
      .map((item, idx) => ({ ...item, slideNumber: idx + 1 }));
    setOutline(next);
  };

  const completedSlidesCount = outline.filter(
    (it) => slideStatuses[it.slideNumber] === 'done'
  ).length;
  const progressPercent =
    outline.length > 0 ? Math.round((completedSlidesCount / outline.length) * 100) : 0;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Stepper Header */}
      <div className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-lg p-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { id: 'A', title: '01. Materi Sumber', sub: 'Topik, Teks, atau Dokumen' },
            { id: 'B', title: '02. Konfigurasi', sub: 'Audiens, Gaya & Parameter' },
            { id: 'C', title: '03. Outline AI', sub: 'Susun & Edit Kerangka Slide' },
            { id: 'D', title: '04. Generate Slide', sub: 'Pembuatan Isi & Visual' },
          ].map((s) => {
            const isActive = step === s.id;
            return (
              <button
                key={s.id}
                onClick={() => {
                  if (s.id === 'A') setStep('A');
                  if (s.id === 'B') handleProceedFromStepA();
                  if (s.id === 'C' && outline.length > 0) setStep('C');
                  if (s.id === 'D' && Object.keys(slidesByNumber).length > 0) setStep('D');
                }}
                className={`text-left p-3 rounded-md border transition-colors ${
                  isActive
                    ? 'border-blue-600 bg-blue-50/60 dark:bg-blue-950/40 text-slate-900 dark:text-white'
                    : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                }`}
              >
                <div className="text-xs font-bold tracking-tight">{s.title}</div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                  {s.sub}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* STEP A: MATERI SUMBER */}
      {step === 'A' && (
        <div className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-lg p-6 space-y-6">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Langkah A — Pilih Sumber Materi Presentasi
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              Mulai dari ide/topik singkat, tempel catatan kuliah/rapat, unggah dokumen (PDF, DOCX, PPTX, TXT), atau gunakan kerangka buatan sendiri.
            </p>
          </div>

          {/* Segmented Control for Source Type */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
            {[
              { id: 'topic', label: 'Dari Topik / Prompt' },
              { id: 'visual-reference', label: 'Referensi Gaya Visual (A–E)' },
              { id: 'document', label: 'Unggah Dokumen Materi' },
              { id: 'text', label: 'Dari Teks Ditempel' },
              { id: 'outline', label: 'Kerangka Sendiri' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() =>
                  setConfig((prev) => ({
                    ...prev,
                    sourceType: tab.id as any,
                  }))
                }
                className={`py-2 px-3 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
                  config.sourceType === tab.id
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {config.sourceType === 'topic' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Judul Presentasi (Opsional — AI dapat menyempurnakannya)
                </label>
                <input
                  type="text"
                  value={config.title}
                  onChange={(e) => setConfig({ ...config, title: e.target.value })}
                  placeholder="Contoh: Strategi Dekarbonisasi Rantai Pasok Industri Manufaktur 2026"
                  className="w-full px-3.5 py-2.5 text-sm border border-slate-300 dark:border-slate-700 rounded-md bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Topik, Prompt, atau Deskripsi Materi *
                </label>
                <textarea
                  rows={5}
                  value={config.topic}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      topic: e.target.value,
                      title: config.title || e.target.value.slice(0, 80),
                    })
                  }
                  placeholder="Jelaskan topik presentasi, poin-poin yang ingin dibahas, studi kasus, atau instruksi khusus untuk AI..."
                  className="w-full px-3.5 py-2.5 text-sm border border-slate-300 dark:border-slate-700 rounded-md bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:border-blue-600"
                />
              </div>

              <div className="space-y-2">
                <div className="text-xs font-medium text-slate-500 dark:text-slate-400">
                  Contoh Prompt Cepat (Klik untuk mengisi):
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  {[
                    {
                      title: 'Arsitektur Microservices & Kubernetes pada Perbankan Digital',
                      topic:
                        'Bahas migrasi dari sistem monolitik ke microservices, manajemen kontainer Kubernetes, keamanan zero-trust, observabilitas, dan efisiensi biaya cloud.',
                    },
                    {
                      title: 'Metodologi Penelitian Kuantitatif untuk Skripsi Ekonomi',
                      topic:
                        'Panduan kuliah mencakup perumusan hipotesis, teknik sampling, uji validitas & reliabilitas instrumen, regresi berganda, dan interpretasi p-value.',
                    },
                    {
                      title: 'Pitch Deck SaaS B2B Otomasi Rantai Pasok Logistik Dingin',
                      topic:
                        'Presentasi investor mencakup masalah pemborosan cold-chain, solusi sensor IoT + AI prediktif, ukuran pasar Asia Tenggara, model bisnis langganan, dan proyeksi finansial.',
                    },
                  ].map((sample, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() =>
                        setConfig({
                          ...config,
                          title: sample.title,
                          topic: sample.topic,
                        })
                      }
                      className="text-left p-3 border border-slate-200 dark:border-slate-800 rounded-md hover:border-blue-500 transition-colors"
                    >
                      <div className="text-xs font-semibold text-slate-900 dark:text-white line-clamp-1">
                        {sample.title}
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                        {sample.topic}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {config.sourceType === 'visual-reference' && (
            <div className="space-y-6">
              {/* Banner Penjelasan 4 Tahap & Format A–E */}
              <div className="p-4 rounded-lg border border-blue-200 dark:border-blue-900 bg-blue-50/50 dark:bg-blue-950/30 flex flex-wrap items-start justify-between gap-4">
                <div className="space-y-1 max-w-2xl">
                  <div className="flex items-center gap-2 text-xs font-bold text-blue-700 dark:text-blue-300 uppercase tracking-wider">
                    <Palette className="w-4 h-4" />
                    <span>Art Director & Visual Style Reference Engine (Tahap 1–4 · Format A–E)</span>
                  </div>
                  <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                    Unggah file referensi visual (<strong>PPTX, PDF, PNG, JPG, WEBP, atau DOCX</strong>) sebagai acuan gaya desain, bukan batasan topik. Sistem akan mengekstrak DNA visualnya (Tahap 1–4), memisahkan <em>hasil pengamatan faktual</em> dari <em>rekomendasi kreatif</em>, menyusun laporan <strong>Format A–E</strong>, dan menerapkannya pada topik baru pilihan Anda.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleBuildStyleGuidePresentationDeck}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-blue-700 dark:text-blue-300 bg-white dark:bg-slate-900 border border-blue-300 dark:border-blue-800 rounded-md hover:bg-blue-50 dark:hover:bg-slate-800 shrink-0"
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>
                    {config.visualStyleReference
                      ? 'Buat Deck Presentasi Style Guide Ini (A–E)'
                      : 'Buka Contoh Deck Visual Style Guide (A–E)'}
                  </span>
                </button>
              </div>

              {/* Input Topik Baru Lintas Bidang */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Topik Baru yang Akan Diterapkan (Lintas Bidang) *
                  </label>
                  <input
                    type="text"
                    value={config.topic}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        topic: e.target.value,
                        title: config.title || e.target.value.slice(0, 85),
                      })
                    }
                    placeholder="Contoh: Transformasi Energi Terbarukan & Jaringan Smart Grid di Indonesia"
                    className="w-full px-3.5 py-2 text-sm border border-slate-300 dark:border-slate-700 rounded-md bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Judul Presentasi Baru
                  </label>
                  <input
                    type="text"
                    value={config.title}
                    onChange={(e) => setConfig({ ...config, title: e.target.value })}
                    placeholder="Judul presentasi untuk topik baru..."
                    className="w-full px-3.5 py-2 text-sm border border-slate-300 dark:border-slate-700 rounded-md bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              {/* Pilihan Cepat Domain Topik Baru */}
              <div className="space-y-1.5">
                <div className="text-[11px] font-medium text-slate-500">
                  Pilih Cepat Contoh Topik Baru Lintas Disiplin:
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    {
                      domain: 'Teknologi & AI',
                      topic: 'Arsitektur Keamanan Siber Zero-Trust dan Otomasi Respons Insiden Berbasis AI',
                    },
                    {
                      domain: 'Bisnis & Ekonomi',
                      topic: 'Strategi Ekspansi Pasar Ekspor UMKM dan Integrasi Ekosistem Pembayaran Lintas Negara',
                    },
                    {
                      domain: 'Pendidikan & Sejarah',
                      topic: 'Evolusi Jalur Rempah Nusantara dan Dampaknya terhadap Jaringan Perdagangan Maritim Global',
                    },
                    {
                      domain: 'Kesehatan & Sains',
                      topic: 'Terapi Gen Berbasis CRISPR dan Masa Depan Pengobatan Presisi untuk Penyakit Langka',
                    },
                    {
                      domain: 'Lingkungan & Budaya',
                      topic: 'Konservasi Hutan Mangrove Berbasis Kearifan Lokal untuk Mitigasi Perubahan Iklim Pesisir',
                    },
                  ].map((item) => (
                    <button
                      key={item.domain}
                      type="button"
                      onClick={() =>
                        setConfig((prev) => ({
                          ...prev,
                          title: item.topic,
                          topic: item.topic,
                        }))
                      }
                      className="px-2.5 py-1 text-xs font-medium rounded border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-300 hover:border-blue-500"
                    >
                      {item.domain}
                    </button>
                  ))}
                </div>
              </div>

              {/* Dropzone Unggah File Referensi Visual */}
              <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-lg p-6 text-center bg-slate-50/50 dark:bg-slate-950/40">
                <Palette className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <div className="text-sm font-semibold text-slate-900 dark:text-white">
                  Unggah File Referensi Gaya Visual (PPTX, PDF, PNG, JPG, WEBP, atau DOCX)
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 mb-4 max-w-xl mx-auto">
                  Desain final tidak akan dibuat sebelum karakter visual referensi dianalisis (Tahap 1–4). Sistem mengekstrak palet warna, tipografi, tata letak, dan menyusun panduan Format A–E.
                </p>
                <label className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-md cursor-pointer transition-colors">
                  {analyzingStyle ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Menganalisis DNA Visual Referensi (Tahap 1–4)...</span>
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4" />
                      <span>Pilih File Referensi Visual</span>
                    </>
                  )}
                  <input
                    type="file"
                    accept=".pptx,.pdf,.png,.jpg,.jpeg,.webp,.docx,.txt"
                    onChange={handleVisualStyleFileUpload}
                    disabled={analyzingStyle}
                    className="hidden"
                  />
                </label>
              </div>

              {styleError && (
                <div className="p-3 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 rounded-md text-xs text-red-700 dark:text-red-300 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{styleError}</span>
                </div>
              )}

              {/* Hasil Analisis Visual Style Reference (Format A - E) */}
              {config.visualStyleReference && (
                <div className="border border-slate-200 dark:border-slate-800 rounded-lg p-5 space-y-6 bg-slate-50/70 dark:bg-slate-950">
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
                    <div>
                      <div className="text-xs font-mono uppercase text-blue-600 font-bold">
                        HASIL ANALISIS VISUAL STYLE REFERENCE (FORMAT A–E)
                      </div>
                      <h3 className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
                        {config.visualStyleReference.sectionA_IdentitySummary.styleName} — File:{' '}
                        {config.visualStyleReference.referenceFileName}
                      </h3>
                    </div>
                    <button
                      type="button"
                      onClick={handleBuildStyleGuidePresentationDeck}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-md"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Jadikan Hasil Analisis A–E Ini Sebagai Slide PPTX</span>
                    </button>
                  </div>

                  {/* A. Ringkasan Identitas Visual */}
                  <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg space-y-2">
                    <div className="text-xs font-bold text-slate-900 dark:text-white">
                      A. RINGKASAN IDENTITAS VISUAL
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                      <div className="p-2.5 bg-slate-50 dark:bg-slate-950 rounded border border-slate-200 dark:border-slate-800">
                        <div className="text-[11px] text-slate-500">Arketipe Desain</div>
                        <div className="font-semibold text-slate-900 dark:text-white mt-0.5">
                          {config.visualStyleReference.sectionA_IdentitySummary.designArchetype}
                        </div>
                      </div>
                      <div className="p-2.5 bg-slate-50 dark:bg-slate-950 rounded border border-slate-200 dark:border-slate-800">
                        <div className="text-[11px] text-slate-500">Karakter Visual Utama</div>
                        <div className="font-semibold text-slate-900 dark:text-white mt-0.5">
                          {config.visualStyleReference.sectionA_IdentitySummary.overallCharacter}
                        </div>
                      </div>
                      <div className="p-2.5 bg-slate-50 dark:bg-slate-950 rounded border border-slate-200 dark:border-slate-800">
                        <div className="text-[11px] text-slate-500">Mood & Atmosfer</div>
                        <div className="font-semibold text-slate-900 dark:text-white mt-0.5">
                          {config.visualStyleReference.sectionA_IdentitySummary.moodAndAtmosphere}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* B. Analisis Elemen Desain dari File Referensi (Hasil Pengamatan vs Keterbatasan) */}
                  <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900 dark:text-white">
                        B. ANALISIS ELEMEN DESAIN DARI FILE REFERENSI (TAHAP 1 — PENGAMATAN FAKTUAL)
                      </span>
                      <span className="text-[11px] font-mono text-emerald-600">
                        Observasi Objektif File Asli
                      </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                      {[
                        {
                          label: 'Palet Warna Teramati',
                          val: config.visualStyleReference.sectionB_DesignAnalysis.factualObservations
                            .colorPaletteObserved,
                        },
                        {
                          label: 'Tipografi & Hierarki Teks',
                          val: config.visualStyleReference.sectionB_DesignAnalysis.factualObservations
                            .typographyAndHierarchy,
                        },
                        {
                          label: 'Komposisi & Tata Letak',
                          val: config.visualStyleReference.sectionB_DesignAnalysis.factualObservations
                            .layoutAndComposition,
                        },
                        {
                          label: 'Ruang Kosong (Whitespace)',
                          val: config.visualStyleReference.sectionB_DesignAnalysis.factualObservations
                            .whitespaceAndDensity,
                        },
                        {
                          label: 'Fotografi, Ilustrasi & Ikon',
                          val: config.visualStyleReference.sectionB_DesignAnalysis.factualObservations
                            .imageryIllustrationIcons,
                        },
                        {
                          label: 'Sampul, Isi & Latar Belakang',
                          val: `${config.visualStyleReference.sectionB_DesignAnalysis.factualObservations.coverAndContentCharacter} (${config.visualStyleReference.sectionB_DesignAnalysis.factualObservations.texturesOrnamentsBackground})`,
                        },
                      ].map((item) => (
                        <div
                          key={item.label}
                          className="p-2.5 bg-slate-50 dark:bg-slate-950 rounded border border-slate-200 dark:border-slate-800"
                        >
                          <div className="font-semibold text-slate-800 dark:text-slate-200">
                            {item.label}
                          </div>
                          <div className="text-slate-600 dark:text-slate-400 mt-0.5 leading-relaxed">
                            {item.val}
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="p-2.5 bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 rounded text-xs text-amber-900 dark:text-amber-200">
                      <strong>Catatan Keterbatasan Observasi:</strong>{' '}
                      {config.visualStyleReference.sectionB_DesignAnalysis.observationalLimitations}
                    </div>
                  </div>

                  {/* C. Panduan Visual Style Guide */}
                  <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg space-y-4">
                    <div className="text-xs font-bold text-slate-900 dark:text-white">
                      C. PANDUAN VISUAL STYLE GUIDE (TAHAP 2)
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      {config.visualStyleReference.sectionC_StyleGuide.visualConcept}
                    </p>

                    {/* Palet Warna HEX Terukur */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
                      {[
                        {
                          label: 'Primary',
                          hex: config.visualStyleReference.sectionC_StyleGuide.extractedTheme
                            .primaryColor,
                        },
                        {
                          label: 'Secondary',
                          hex: config.visualStyleReference.sectionC_StyleGuide.extractedTheme
                            .secondaryColor,
                        },
                        {
                          label: 'Background',
                          hex: config.visualStyleReference.sectionC_StyleGuide.extractedTheme
                            .backgroundColor,
                        },
                        {
                          label: 'Surface',
                          hex: config.visualStyleReference.sectionC_StyleGuide.extractedTheme
                            .surfaceColor,
                        },
                        {
                          label: 'Text Main',
                          hex: config.visualStyleReference.sectionC_StyleGuide.extractedTheme
                            .textColor,
                        },
                        {
                          label: 'Text Muted',
                          hex: config.visualStyleReference.sectionC_StyleGuide.extractedTheme
                            .mutedTextColor,
                        },
                      ].map((sw) => (
                        <div
                          key={sw.label}
                          className="p-2 border border-slate-200 dark:border-slate-800 rounded bg-slate-50 dark:bg-slate-950 flex items-center gap-2"
                        >
                          <span
                            className="w-6 h-6 rounded border border-black/15 shrink-0"
                            style={{ backgroundColor: sw.hex }}
                          />
                          <div className="min-w-0">
                            <div className="text-[10px] text-slate-500 truncate">{sw.label}</div>
                            <div className="text-xs font-mono font-bold text-slate-900 dark:text-white">
                              {sw.hex}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* 3 Kolom: Dipertahankan, Disesuaikan, Dihindari */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                      <div className="p-3 rounded border border-emerald-200 dark:border-emerald-900 bg-emerald-50/40 dark:bg-emerald-950/20 space-y-1.5">
                        <div className="font-bold text-emerald-800 dark:text-emerald-300">
                          1. Elemen Dipertahankan (DNA Visual)
                        </div>
                        <ul className="space-y-1 text-slate-700 dark:text-slate-300 list-disc pl-4">
                          {config.visualStyleReference.sectionC_StyleGuide.elementsToKeep.map(
                            (el, i) => (
                              <li key={i}>{el}</li>
                            )
                          )}
                        </ul>
                      </div>
                      <div className="p-3 rounded border border-blue-200 dark:border-blue-900 bg-blue-50/40 dark:bg-blue-950/20 space-y-1.5">
                        <div className="font-bold text-blue-800 dark:text-blue-300">
                          2. Elemen Disesuaikan (Topik Baru)
                        </div>
                        <ul className="space-y-1 text-slate-700 dark:text-slate-300 list-disc pl-4">
                          {config.visualStyleReference.sectionC_StyleGuide.elementsToAdapt.map(
                            (el, i) => (
                              <li key={i}>{el}</li>
                            )
                          )}
                        </ul>
                      </div>
                      <div className="p-3 rounded border border-red-200 dark:border-red-900 bg-red-50/40 dark:bg-red-950/20 space-y-1.5">
                        <div className="font-bold text-red-800 dark:text-red-300">
                          3. Elemen Dihindari (Anti-Pattern)
                        </div>
                        <ul className="space-y-1 text-slate-700 dark:text-slate-300 list-disc pl-4">
                          {config.visualStyleReference.sectionC_StyleGuide.elementsToAvoid.map(
                            (el, i) => (
                              <li key={i}>{el}</li>
                            )
                          )}
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* D. Adaptasi ke Topik Baru & Prompt Desain Siap Pakai */}
                  <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900 dark:text-white">
                        D. ADAPTASI KE TOPIK BARU & PROMPT DESAIN SIAP PAKAI (TAHAP 3)
                      </span>
                      <span className="text-[11px] font-mono text-blue-600">
                        Rekomendasi Kreatif Topik Baru
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      {
                        config.visualStyleReference.sectionD_ReadyDesignPrompt
                          .crossTopicAdaptationStrategy
                      }
                    </p>
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                          Master Design Prompt Siap Pakai (Dapat Disunting / Disalin):
                        </label>
                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard?.writeText(
                              config.visualStyleReference?.sectionD_ReadyDesignPrompt
                                .masterDesignPrompt || ''
                            );
                            onNotify('Master Design Prompt berhasil disalin!', 'info');
                          }}
                          className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 hover:underline"
                        >
                          <Copy className="w-3 h-3" />
                          <span>Salin Prompt</span>
                        </button>
                      </div>
                      <textarea
                        rows={3}
                        value={
                          config.visualStyleReference.sectionD_ReadyDesignPrompt.masterDesignPrompt
                        }
                        onChange={(e) => {
                          if (!config.visualStyleReference) return;
                          setConfig({
                            ...config,
                            visualStyleReference: {
                              ...config.visualStyleReference,
                              sectionD_ReadyDesignPrompt: {
                                ...config.visualStyleReference.sectionD_ReadyDesignPrompt,
                                masterDesignPrompt: e.target.value,
                              },
                            },
                          });
                        }}
                        className="w-full px-3 py-2 text-xs font-mono border border-slate-300 dark:border-slate-700 rounded bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white"
                      />
                    </div>
                  </div>

                  {/* E. Arahan Pembuatan Moodboard Visual */}
                  <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg space-y-3">
                    <div className="text-xs font-bold text-slate-900 dark:text-white">
                      E. ARAHAN PEMBUATAN MOODBOARD VISUAL: SAMPUL, ISI & PENUTUP (TAHAP 4)
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      {config.visualStyleReference.sectionE_MoodboardDirection.moodboardConcept}
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                      {[
                        {
                          title: '01. Sampul (Cover Slide)',
                          desc: config.visualStyleReference.sectionE_MoodboardDirection
                            .coverSlideDirection,
                        },
                        {
                          title: '02. Halaman Isi (Content Slide)',
                          desc: config.visualStyleReference.sectionE_MoodboardDirection
                            .contentSlideDirection,
                        },
                        {
                          title: '03. Penutup (Closing Slide)',
                          desc: config.visualStyleReference.sectionE_MoodboardDirection
                            .closingSlideDirection,
                        },
                      ].map((mb) => (
                        <div
                          key={mb.title}
                          className="p-3 rounded border"
                          style={{
                            backgroundColor:
                              config.visualStyleReference?.sectionC_StyleGuide.extractedTheme
                                .backgroundColor || '#F8FAFC',
                            borderColor:
                              config.visualStyleReference?.sectionC_StyleGuide.extractedTheme
                                .primaryColor || '#2563EB',
                            color:
                              config.visualStyleReference?.sectionC_StyleGuide.extractedTheme
                                .textColor || '#0F172A',
                          }}
                        >
                          <div
                            className="font-bold mb-1"
                            style={{
                              color:
                                config.visualStyleReference?.sectionC_StyleGuide.extractedTheme
                                  .primaryColor || '#2563EB',
                            }}
                          >
                            {mb.title}
                          </div>
                          <div className="text-[11px] leading-relaxed opacity-90">{mb.desc}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Konfirmasi Wajib Sebelum Membuat Desain Final */}
                  <label className="flex items-center gap-2.5 text-xs font-semibold text-slate-900 dark:text-white cursor-pointer pt-2 border-t border-slate-200 dark:border-slate-800">
                    <input
                      type="checkbox"
                      checked={styleGuideConfirmed}
                      onChange={(e) => setStyleGuideConfirmed(e.target.checked)}
                      className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span>
                      Saya telah meninjau hasil Analisis Gaya Visual (A–E) dan menyetujui penerapan Visual Style Guide ini untuk menghasilkan slide pada topik baru.
                    </span>
                  </label>
                </div>
              )}
            </div>
          )}

          {config.sourceType === 'text' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Judul Presentasi
                </label>
                <input
                  type="text"
                  value={config.title}
                  onChange={(e) => setConfig({ ...config, title: e.target.value })}
                  placeholder="Masukkan judul presentasi..."
                  className="w-full px-3.5 py-2.5 text-sm border border-slate-300 dark:border-slate-700 rounded-md bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Tempelkan Materi Teks / Artikel / Catatan Kuliah *
                  </label>
                  <span className="text-xs font-mono tabular-nums text-slate-500">
                    {config.sourceMaterial.trim().split(/\s+/).filter(Boolean).length} kata
                  </span>
                </div>
                <textarea
                  rows={8}
                  value={config.sourceMaterial}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      sourceMaterial: e.target.value,
                      topic: config.topic || e.target.value.slice(0, 200),
                    })
                  }
                  placeholder="Tempelkan materi lengkap di sini. AI akan menganalisis struktur bab, argumen utama, dan mengekstraknya menjadi slide..."
                  className="w-full px-3.5 py-2.5 text-sm border border-slate-300 dark:border-slate-700 rounded-md bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
                />
              </div>
            </div>
          )}

          {config.sourceType === 'document' && (
            <div className="space-y-4">
              <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-lg p-6 text-center bg-slate-50/50 dark:bg-slate-950/40">
                <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <div className="text-sm font-semibold text-slate-900 dark:text-white">
                  Unggah Dokumen Materi (PDF, DOCX, PPTX, TXT, MD, CSV)
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 mb-4">
                  Ukuran maksimum 10 MB. Konten akan diekstrak di server untuk Anda periksa sebelum slide dibuat.
                </p>
                <label className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-md cursor-pointer transition-colors">
                  {extractingDoc ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Mengekstrak Dokumen di Server...</span>
                    </>
                  ) : (
                    <>
                      <FileText className="w-4 h-4" />
                      <span>Pilih File Dokumen</span>
                    </>
                  )}
                  <input
                    type="file"
                    accept=".pdf,.docx,.pptx,.txt,.md,.csv,.json"
                    onChange={handleFileUpload}
                    disabled={extractingDoc}
                    className="hidden"
                  />
                </label>
              </div>

              {docError && (
                <div className="p-3 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 rounded-md text-xs text-red-700 dark:text-red-300 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{docError}</span>
                </div>
              )}

              {config.extractedDocMeta && (
                <div className="border border-slate-200 dark:border-slate-800 rounded-lg p-4 space-y-4 bg-slate-50 dark:bg-slate-950">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
                    <div>
                      <div className="text-sm font-bold text-slate-900 dark:text-white">
                        Hasil Ekstraksi: {config.extractedDocMeta.fileName}
                      </div>
                      <div className="text-xs text-slate-500 tabular-nums mt-0.5">
                        Ukuran: {Math.round(config.extractedDocMeta.fileSize / 1024)} KB · Jumlah Kata:{' '}
                        {config.extractedDocMeta.wordCount} kata
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Ringkasan Poin Penting Hasil Analisis Server:
                    </div>
                    <ul className="space-y-1 text-xs text-slate-600 dark:text-slate-400">
                      {config.extractedDocMeta.summary.map((s, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="font-mono text-blue-600 font-bold">0{idx + 1}.</span>
                          <span>{s}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Teks Materi Hasil Ekstraksi (Dapat Anda Sunting Sebelum Lanjut):
                    </label>
                    <textarea
                      rows={5}
                      value={config.sourceMaterial}
                      onChange={(e) => setConfig({ ...config, sourceMaterial: e.target.value })}
                      className="w-full px-3 py-2 text-xs border border-slate-300 dark:border-slate-700 rounded-md bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                    />
                  </div>

                  <label className="flex items-center gap-2.5 text-xs font-semibold text-slate-900 dark:text-white cursor-pointer pt-1">
                    <input
                      type="checkbox"
                      checked={docConfirmed}
                      onChange={(e) => setDocConfirmed(e.target.checked)}
                      className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span>
                      Saya telah meninjau dan mengonfirmasi hasil ekstraksi materi dokumen ini untuk dijadikan slide.
                    </span>
                  </label>
                </div>
              )}
            </div>
          )}

          {config.sourceType === 'outline' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Judul Presentasi *
                </label>
                <input
                  type="text"
                  value={config.title}
                  onChange={(e) =>
                    setConfig({ ...config, title: e.target.value, topic: e.target.value })
                  }
                  placeholder="Masukkan judul presentasi..."
                  className="w-full px-3.5 py-2.5 text-sm border border-slate-300 dark:border-slate-700 rounded-md bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Tuliskan Kerangka Slide (Satu baris atau blok per slide) *
                </label>
                <textarea
                  rows={7}
                  value={config.sourceMaterial}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      sourceMaterial: e.target.value,
                      topic: config.title || e.target.value.slice(0, 120),
                    })
                  }
                  placeholder={`Contoh:\nSlide 1: Pendahuluan & Latar Belakang Masalah\nSlide 2: Rumusan Masalah dan Tujuan Penelitian\nSlide 3: Tinjauan Pustaka & Kerangka Teori\nSlide 4: Metodologi dan Desain Eksperimen\nSlide 5: Hasil Analisis Data & Pembahasan\nSlide 6: Kesimpulan dan Rekomendasi`}
                  className="w-full px-3.5 py-2.5 text-sm border border-slate-300 dark:border-slate-700 rounded-md bg-white dark:bg-slate-950 text-slate-900 dark:text-white font-mono"
                />
              </div>
            </div>
          )}

          <div className="flex justify-end pt-2 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={handleProceedFromStepA}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
            >
              <span>Lanjut ke Konfigurasi (Langkah B)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP B: KONFIGURASI PRESENTASI */}
      {step === 'B' && (
        <div className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-lg p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Langkah B — Konfigurasi Struktur, Gaya & Visual
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-0.5">
                Atur jumlah slide, bahasa, audiens, kedalaman pembahasan, rasio kanvas, dan tema visual.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setStep('A')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 border border-slate-300 dark:border-slate-700 rounded-md hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Kembali</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Judul Presentasi
              </label>
              <input
                type="text"
                value={config.title}
                onChange={(e) => setConfig({ ...config, title: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-slate-300 dark:border-slate-700 rounded-md bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Target Audiens
              </label>
              <input
                type="text"
                value={config.targetAudience}
                onChange={(e) => setConfig({ ...config, targetAudience: e.target.value })}
                placeholder="Mis. Penguji Sidang Skripsi, Direksi, Investor, Mahasiswa"
                className="w-full px-3 py-2 text-sm border border-slate-300 dark:border-slate-700 rounded-md bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Tujuan Presentasi
              </label>
              <input
                type="text"
                value={config.purpose}
                onChange={(e) => setConfig({ ...config, purpose: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-slate-300 dark:border-slate-700 rounded-md bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Bahasa Konten
                </label>
                <select
                  value={config.language}
                  onChange={(e) =>
                    setConfig({ ...config, language: e.target.value as ContentLanguage })
                  }
                  className="w-full px-3 py-2 text-sm border border-slate-300 dark:border-slate-700 rounded-md bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
                >
                  <option value="id">Bahasa Indonesia</option>
                  <option value="en">English (Inggris)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Durasi Presentasi (Menit)
                </label>
                <input
                  type="number"
                  min={5}
                  max={180}
                  value={config.durationMinutes}
                  onChange={(e) =>
                    setConfig({ ...config, durationMinutes: Number(e.target.value) || 15 })
                  }
                  className="w-full px-3 py-2 text-sm border border-slate-300 dark:border-slate-700 rounded-md bg-white dark:bg-slate-950 text-slate-900 dark:text-white tabular-nums"
                />
              </div>
            </div>

            {/* Jumlah Slide: 5, 10, 15, 20, atau Custom */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Jumlah Slide ({config.slideCount} Slide)
              </label>
              <div className="flex items-center gap-2">
                {[5, 10, 15, 20].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => {
                      setCustomSlideCountMode(false);
                      setConfig({ ...config, slideCount: num });
                    }}
                    className={`px-3 py-2 text-xs font-semibold rounded-md border tabular-nums transition-colors ${
                      !customSlideCountMode && config.slideCount === num
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    {num}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setCustomSlideCountMode(true)}
                  className={`px-3 py-2 text-xs font-semibold rounded-md border transition-colors ${
                    customSlideCountMode
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  Custom
                </button>
                {customSlideCountMode && (
                  <input
                    type="number"
                    min={3}
                    max={25}
                    value={config.slideCount}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        slideCount: Math.min(25, Math.max(3, Number(e.target.value) || 6)),
                      })
                    }
                    className="w-20 px-2.5 py-1.5 text-sm border border-slate-300 dark:border-slate-700 rounded-md bg-white dark:bg-slate-950 text-slate-900 dark:text-white tabular-nums"
                  />
                )}
              </div>
            </div>

            {/* Tingkat Kedalaman */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Tingkat Kedalaman Materi
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['ringkas', 'standar', 'mendalam'] as DepthLevelType[]).map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setConfig({ ...config, depthLevel: lvl })}
                    className={`py-2 px-3 text-xs font-semibold capitalize rounded-md border transition-colors ${
                      config.depthLevel === lvl
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>

            {/* Gaya Penulisan */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Gaya Penulisan
              </label>
              <select
                value={config.writingStyle}
                onChange={(e) =>
                  setConfig({ ...config, writingStyle: e.target.value as WritingStyleType })
                }
                className="w-full px-3 py-2 text-sm border border-slate-300 dark:border-slate-700 rounded-md bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
              >
                <option value="akademik">Akademik & Ilmiah</option>
                <option value="profesional">Profesional & Eksekutif</option>
                <option value="edukatif">Edukatif & Instruksional</option>
                <option value="persuasif">Persuasif & Pitching</option>
                <option value="kreatif">Kreatif & Naratif</option>
                <option value="minimalis">Minimalis & To-the-Point</option>
              </select>
            </div>

            {/* Rasio Slide & Sitasi */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Rasio Presentasi
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {(['16:9', '4:3'] as AspectRatioType[]).map((ratio) => (
                    <button
                      key={ratio}
                      type="button"
                      onClick={() => setConfig({ ...config, aspectRatio: ratio })}
                      className={`py-2 text-xs font-mono font-semibold rounded-md border tabular-nums ${
                        config.aspectRatio === ratio
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {ratio}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Gaya Referensi / Sitasi
                </label>
                <select
                  value={config.citationStyle}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      citationStyle: e.target.value as 'APA' | 'IEEE' | 'Harvard' | 'None',
                    })
                  }
                  className="w-full px-3 py-2 text-sm border border-slate-300 dark:border-slate-700 rounded-md bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
                >
                  <option value="APA">APA Style (Edisi 7)</option>
                  <option value="IEEE">IEEE Numbered</option>
                  <option value="Harvard">Harvard Referencing</option>
                  <option value="None">Tanpa Slide Daftar Pustaka</option>
                </select>
              </div>
            </div>
          </div>

          {/* Template Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Pilih Template & Tema Desain Visual
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-h-64 overflow-y-auto pr-1">
              {PRESENTATION_TEMPLATES.map((tpl) => {
                const isSelected = selectedTemplateId === tpl.id;
                return (
                  <button
                    key={tpl.id}
                    type="button"
                    onClick={() => {
                      setSelectedTemplateId(tpl.id);
                      setConfig((prev) => ({ ...prev, visualStyle: tpl.name }));
                    }}
                    className={`text-left p-3 rounded-md border transition-all ${
                      isSelected
                        ? 'border-blue-600 ring-1 ring-blue-600 bg-blue-50/40 dark:bg-blue-950/30'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-400'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 mb-2">
                      <span
                        className="w-4 h-4 rounded-xs border border-black/10"
                        style={{ backgroundColor: tpl.theme.primaryColor }}
                      />
                      <span
                        className="w-4 h-4 rounded-xs border border-black/10"
                        style={{ backgroundColor: tpl.theme.secondaryColor }}
                      />
                      <span
                        className="w-4 h-4 rounded-xs border border-slate-300"
                        style={{ backgroundColor: tpl.theme.backgroundColor }}
                      />
                    </div>
                    <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                      {tpl.name}
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                      {tpl.category}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setStep('A')}
              className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900"
            >
              Kembali ke Materi
            </button>
            <button
              type="button"
              onClick={generateOutlineFromAI}
              disabled={generatingOutline}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors disabled:opacity-50"
            >
              {generatingOutline ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Menyusun Outline AI...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Buat Kerangka Slide (Outline AI)</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* STEP C: OUTLINE AI */}
      {step === 'C' && (
        <div className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-lg p-6 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Langkah C — Kerangka Slide (Outline AI)
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-0.5">
                Periksa, ubah urutan, tambah, hapus, atau sesuaikan jenis layout setiap slide sebelum AI menghasilkan konten lengkap.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={generateOutlineFromAI}
                disabled={generatingOutline}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 rounded-md hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${generatingOutline ? 'animate-spin' : ''}`} />
                <span>Buat Ulang Outline</span>
              </button>
              <button
                type="button"
                onClick={addOutlineSlide}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 rounded-md hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Tambah Slide</span>
              </button>
            </div>
          </div>

          {generatingOutline ? (
            <div className="py-16 text-center space-y-3">
              <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto" />
              <div className="text-sm font-semibold text-slate-900 dark:text-white">
                AI sedang merancang struktur alur presentasi ({config.slideCount} slide)...
              </div>
              <p className="text-xs text-slate-500">
                Menyesuaikan tata letak visual, kedalaman materi ({config.depthLevel}), dan gaya penulisan ({config.writingStyle}).
              </p>
            </div>
          ) : outlineError ? (
            <div className="p-6 border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/40 rounded-lg text-center space-y-3">
              <AlertCircle className="w-7 h-7 text-red-600 mx-auto" />
              <div className="text-sm font-bold text-red-900 dark:text-red-200">{outlineError}</div>
              <button
                type="button"
                onClick={generateOutlineFromAI}
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded-md"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Coba Lagi Buat Outline</span>
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {outline.map((item, idx) => (
                <div
                  key={item.id}
                  className="p-4 border border-slate-200 dark:border-slate-800 rounded-lg bg-slate-50/50 dark:bg-slate-950/40 flex flex-col md:flex-row gap-4 items-start"
                >
                  {/* Slide Number & Reorder Controls */}
                  <div className="flex md:flex-col items-center gap-1.5 shrink-0">
                    <span className="w-8 h-8 rounded-md bg-blue-600 text-white font-mono text-xs font-bold tabular-nums flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <div className="flex md:flex-col gap-1">
                      <button
                        type="button"
                        onClick={() => moveOutlineSlide(idx, 'up')}
                        disabled={idx === 0}
                        title="Geser ke Atas"
                        className="p-1 text-slate-500 hover:text-slate-900 dark:hover:text-white disabled:opacity-30"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => moveOutlineSlide(idx, 'down')}
                        disabled={idx === outline.length - 1}
                        title="Geser ke Bawah"
                        className="p-1 text-slate-500 hover:text-slate-900 dark:hover:text-white disabled:opacity-30"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteOutlineSlide(idx)}
                        title="Hapus Slide"
                        className="p-1 text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Editable Outline Fields */}
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-3 w-full">
                    <div className="md:col-span-8 space-y-2">
                      <input
                        type="text"
                        value={item.title}
                        onChange={(e) => {
                          const next = [...outline];
                          next[idx] = { ...item, title: e.target.value };
                          setOutline(next);
                        }}
                        className="w-full px-3 py-1.5 text-sm font-bold border border-slate-300 dark:border-slate-700 rounded-md bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                        placeholder="Judul Slide..."
                      />
                      <input
                        type="text"
                        value={item.mainIdea}
                        onChange={(e) => {
                          const next = [...outline];
                          next[idx] = { ...item, mainIdea: e.target.value };
                          setOutline(next);
                        }}
                        className="w-full px-3 py-1 text-xs border border-slate-200 dark:border-slate-800 rounded-md bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300"
                        placeholder="Tujuan / gagasan utama slide..."
                      />
                      <textarea
                        rows={2}
                        value={item.summaryPoints.join('\n')}
                        onChange={(e) => {
                          const next = [...outline];
                          next[idx] = {
                            ...item,
                            summaryPoints: e.target.value.split('\n').filter((s) => s.trim() !== ''),
                          };
                          setOutline(next);
                        }}
                        placeholder="Satu poin ringkasan per baris..."
                        className="w-full px-3 py-1.5 text-xs border border-slate-200 dark:border-slate-800 rounded-md bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300"
                      />
                    </div>

                    <div className="md:col-span-4 flex flex-col justify-between">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
                          Layout yang Disarankan
                        </label>
                        <select
                          value={item.suggestedLayout}
                          onChange={(e) => {
                            const next = [...outline];
                            next[idx] = {
                              ...item,
                              suggestedLayout: e.target.value as SlideLayoutType,
                            };
                            setOutline(next);
                          }}
                          className="w-full px-2.5 py-1.5 text-xs border border-slate-300 dark:border-slate-700 rounded-md bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                        >
                          {LAYOUT_OPTIONS.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                              {opt.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="text-[11px] text-slate-500 mt-2">
                        {item.summaryPoints.length} poin kerangka
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!generatingOutline && outline.length > 0 && (
            <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setStep('B')}
                className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900"
              >
                Kembali ke Konfigurasi
              </button>
              <button
                type="button"
                onClick={() => {
                  setSlidesByNumber({});
                  startGeneratingAllSlides();
                }}
                className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
              >
                <Sparkles className="w-4 h-4" />
                <span>Lanjutkan ke Desain & Generate {outline.length} Slide</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* STEP D: GENERATE SLIDES PROGRESS & RETRY */}
      {step === 'D' && (
        <div className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-lg p-6 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Langkah D — Pembuatan Konten & Visual Slide Bertahap
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-0.5">
                AI menyusun poin inti, visual terstruktur (tabel/grafik/diagram), catatan pembicara, dan referensi untuk setiap slide.
              </p>
            </div>

            <div className="text-right">
              <div className="text-sm font-bold font-mono tabular-nums text-blue-600">
                {completedSlidesCount} / {outline.length} Slide Selesai ({progressPercent}%)
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-600 transition-all duration-200"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {/* Per-Slide Status List with Individual Retry */}
          <div className="space-y-2.5">
            {outline.map((item) => {
              const status = slideStatuses[item.slideNumber] || 'pending';
              const generated = slidesByNumber[item.slideNumber];
              const errMsg = slideErrors[item.slideNumber];

              return (
                <div
                  key={item.id}
                  className="p-3.5 border border-slate-200 dark:border-slate-800 rounded-lg flex flex-wrap items-center justify-between gap-3 bg-slate-50/40 dark:bg-slate-950/40"
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <span className="w-7 h-7 rounded-md bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-mono text-xs font-bold tabular-nums flex items-center justify-center shrink-0">
                      {item.slideNumber}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                        {generated?.title || item.title}
                      </div>
                      <div className="text-[11px] text-slate-500 truncate">
                        Layout: {(generated?.layout || item.suggestedLayout).toUpperCase()} ·{' '}
                        {generated
                          ? `${generated.bullets?.length || 0} poin utama · Catatan pembicara siap`
                          : item.mainIdea}
                      </div>
                      {errMsg && (
                        <div className="text-[11px] text-red-600 dark:text-red-400 mt-0.5">
                          Error: {errMsg}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {status === 'generating' && (
                      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-blue-600">
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Sedang Dibuat...</span>
                      </span>
                    )}
                    {status === 'done' && (
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Selesai</span>
                      </span>
                    )}
                    {status === 'error' && (
                      <button
                        type="button"
                        onClick={() => generateSingleSlideItem(item, outline.length)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-700 rounded-md"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>Coba Lagi Slide Ini</span>
                      </button>
                    )}
                    {status === 'done' && !isGeneratingAllSlides && (
                      <button
                        type="button"
                        onClick={() => generateSingleSlideItem(item, outline.length)}
                        className="px-2.5 py-1 text-[11px] font-medium text-slate-600 dark:text-slate-400 border border-slate-300 dark:border-slate-700 rounded hover:bg-slate-100 dark:hover:bg-slate-800"
                      >
                        Buat Ulang
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              disabled={isGeneratingAllSlides}
              onClick={() => setStep('C')}
              className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 disabled:opacity-40"
            >
              Kembali ke Outline
            </button>

            <button
              type="button"
              disabled={isGeneratingAllSlides}
              onClick={handleFinalizeAndOpenEditor}
              className="inline-flex items-center gap-2 px-6 py-2.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors disabled:opacity-50"
            >
              <span>Simpan Proyek & Buka di Editor PowerPoint</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
