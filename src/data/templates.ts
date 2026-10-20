import type {
  TemplateDefinition,
  PresentationProject,
  VisualStyleReferenceReport,
} from '../types/presentation.ts';

export const PRESENTATION_TEMPLATES: TemplateDefinition[] = [
  {
    id: 'tpl-akademik-oxford',
    name: 'Oxford Academic Lecture',
    category: 'Akademik dan perkuliahan',
    description: 'Struktur sistematis dengan tipografi serif editorial dan hierarki keilmuan yang jernih untuk materi kuliah dan modul akademik.',
    recommendedFor: ['Kuliah Universitas', 'Modul Mata Kuliah', 'Diskusi Akademik'],
    previewSlides: ['Cover Kuliah', 'Tujuan Pembelajaran', 'Kerangka Teori', 'Studi Kasus', 'Daftar Pustaka'],
    theme: {
      templateId: 'tpl-akademik-oxford',
      primaryColor: '#1E3A8A',
      secondaryColor: '#0284C7',
      backgroundColor: '#FFFFFF',
      surfaceColor: '#F8FAFC',
      textColor: '#0F172A',
      mutedTextColor: '#475569',
      fontFamily: 'Playfair Display',
      cornerRadius: 'rounded',
      illustrationStyle: 'editorial',
      titlePlacement: 'left',
      showHeaderFooter: true,
      headerText: 'Materi Perkuliahan Akademik',
      footerText: 'AI PPT Studio · Academic Edition',
      showSlideNumbers: true,
      institutionName: 'Fakultas Ilmu Komputer & Sains',
      institutionLogoText: 'FIK-UNIV',
    },
  },
  {
    id: 'tpl-penelitian-symposium',
    name: 'Symposium Research Brief',
    category: 'Penelitian dan seminar',
    description: 'Dirancang khusus untuk seminar hasil riset, publikasi ilmiah, metodologi eksperimen, dan penyajian temuan empiris.',
    recommendedFor: ['Seminar Nasional', 'Konferensi Internasional', 'Diseminasi Riset'],
    previewSlides: ['Judul Penelitian', 'Latar Belakang & Gap', 'Metodologi Riset', 'Temuan & Tabel Data', 'Kesimpulan'],
    theme: {
      templateId: 'tpl-penelitian-symposium',
      primaryColor: '#0F766E',
      secondaryColor: '#0D9488',
      backgroundColor: '#FFFFFF',
      surfaceColor: '#F0FDFA',
      textColor: '#0F172A',
      mutedTextColor: '#475569',
      fontFamily: 'Plus Jakarta Sans',
      cornerRadius: 'sharp',
      illustrationStyle: 'technical',
      titlePlacement: 'left',
      showHeaderFooter: true,
      headerText: 'Simposium Riset & Inovasi',
      footerText: 'Research Presentation Deck',
      showSlideNumbers: true,
      institutionName: 'Pusat Studi & Laboratorium Riset',
      institutionLogoText: 'LAB-RISET',
    },
  },
  {
    id: 'tpl-skripsi-garuda',
    name: 'Sidang Skripsi & Tesis',
    category: 'Skripsi dan tesis',
    description: 'Format formal sidang akhir (Bab I–V): rumusan masalah, kerangka pemikiran, hipotesis, uji statistik, hingga implikasi riset.',
    recommendedFor: ['Sidang Skripsi S1', 'Tesis S2', 'Disertasi S3', 'Seminar Proposal'],
    previewSlides: ['Sampul Sidang', 'Rumusan Masalah', 'Kerangka Konseptual', 'Analisis & Pembahasan', 'Saran & Referensi'],
    theme: {
      templateId: 'tpl-skripsi-garuda',
      primaryColor: '#1D4ED8',
      secondaryColor: '#B45309',
      backgroundColor: '#FFFFFF',
      surfaceColor: '#F8FAFC',
      textColor: '#1E293B',
      mutedTextColor: '#64748B',
      fontFamily: 'Plus Jakarta Sans',
      cornerRadius: 'rounded',
      illustrationStyle: 'editorial',
      titlePlacement: 'left',
      showHeaderFooter: true,
      headerText: 'Sidang Tugas Akhir / Tesis',
      footerText: 'Program Pascasarjana & Sarjana',
      showSlideNumbers: true,
      institutionName: 'Universitas Nasional Indonesia',
      institutionLogoText: 'SIDANG-TA',
    },
  },
  {
    id: 'tpl-bisnis-executive',
    name: 'Executive Boardroom Slate',
    category: 'Bisnis dan korporasi',
    description: 'Tampilan eksekutif korporat dengan kontras tajam, metrik kinerja terukur, dan tata letak rapat dewan direksi.',
    recommendedFor: ['Rapat Direksi', 'Strategi Kuartalan', 'Townhall Perusahaan'],
    previewSlides: ['Executive Summary', 'KPI & Kinerja', 'Inisiatif Strategis', 'Matriks Perbandingan', 'Rencana Aksi'],
    theme: {
      templateId: 'tpl-bisnis-executive',
      primaryColor: '#0F172A',
      secondaryColor: '#2563EB',
      backgroundColor: '#FFFFFF',
      surfaceColor: '#F1F5F9',
      textColor: '#0F172A',
      mutedTextColor: '#475569',
      fontFamily: 'Plus Jakarta Sans',
      cornerRadius: 'sharp',
      illustrationStyle: 'minimal',
      titlePlacement: 'left',
      showHeaderFooter: true,
      headerText: 'Executive Strategy Review',
      footerText: 'Confidential · Internal Corporate Use',
      showSlideNumbers: true,
      institutionName: 'Enterprise Strategy Group',
      institutionLogoText: 'CORP-EXEC',
    },
  },
  {
    id: 'tpl-proposal-blueprint',
    name: 'Project Blueprint & Roadmap',
    category: 'Proposal proyek',
    description: 'Menyajikan ruang lingkup proyek, linimasa implementasi, alokasi anggaran, manajemen risiko, dan deliverables secara terstruktur.',
    recommendedFor: ['Proposal Tender', 'Kickoff Proyek', 'Rencana Implementasi'],
    previewSlides: ['Ringkasan Proyek', 'Ruang Lingkup', 'Timeline & Milestone', 'Estimasi Sumber Daya', 'Mitigasi Risiko'],
    theme: {
      templateId: 'tpl-proposal-blueprint',
      primaryColor: '#0369A1',
      secondaryColor: '#0EA5E9',
      backgroundColor: '#F8FAFC',
      surfaceColor: '#FFFFFF',
      textColor: '#0F172A',
      mutedTextColor: '#475569',
      fontFamily: 'DM Sans',
      cornerRadius: 'rounded',
      illustrationStyle: 'technical',
      titlePlacement: 'left',
      showHeaderFooter: true,
      headerText: 'Dokumen Proposal Proyek',
      footerText: 'Project Management Office',
      showSlideNumbers: true,
      institutionName: 'PMO & Delivery Division',
      institutionLogoText: 'PMO-PRO',
    },
  },
  {
    id: 'tpl-pendidikan-mentoring',
    name: 'Interactive Workshop & Training',
    category: 'Pendidikan dan pelatihan',
    description: 'Visual ramah pembelajar dengan langkah praktis, studi kasus terpandu, dan rangkuman modul pelatihan.',
    recommendedFor: ['Bootcamp', 'Pelatihan Karyawan', 'Workshop Praktis'],
    previewSlides: ['Modul Pelatihan', 'Alur Praktik', 'Perbandingan Konsep', 'Latihan Kasus', 'Ringkasan Materi'],
    theme: {
      templateId: 'tpl-pendidikan-mentoring',
      primaryColor: '#15803D',
      secondaryColor: '#16A34A',
      backgroundColor: '#FFFFFF',
      surfaceColor: '#F0FDF4',
      textColor: '#14532D',
      mutedTextColor: '#3F6212',
      fontFamily: 'DM Sans',
      cornerRadius: 'soft',
      illustrationStyle: 'geometric',
      titlePlacement: 'left',
      showHeaderFooter: true,
      headerText: 'Modul Pelatihan & Pengembangan Kompetensi',
      footerText: 'Learning & Development Academy',
      showSlideNumbers: true,
      institutionName: 'Pusat Pelatihan Profesional',
      institutionLogoText: 'EDU-LAB',
    },
  },
  {
    id: 'tpl-teknologi-cyber',
    name: 'DeepTech & AI Architecture',
    category: 'Teknologi dan AI',
    description: 'Tema gelap modern untuk arsitektur perangkat lunak, pipeline kecerdasan buatan, infrastruktur cloud, dan rekayasa sistem.',
    recommendedFor: ['Arsitektur Sistem', 'Demo Produk AI', 'Engineering All-Hands'],
    previewSlides: ['System Overview', 'Pipeline Arsitektur', 'Benchmark Performa', 'Spesifikasi Teknis', 'Deployment Roadmap'],
    theme: {
      templateId: 'tpl-teknologi-cyber',
      primaryColor: '#38BDF8',
      secondaryColor: '#818CF8',
      backgroundColor: '#0F172A',
      surfaceColor: '#1E293B',
      textColor: '#F8FAFC',
      mutedTextColor: '#94A3B8',
      fontFamily: 'Plus Jakarta Sans',
      cornerRadius: 'rounded',
      illustrationStyle: 'technical',
      titlePlacement: 'left',
      showHeaderFooter: true,
      headerText: 'AI & Systems Engineering Architecture',
      footerText: 'Technical Specification Deck',
      showSlideNumbers: true,
      institutionName: 'Core AI Engineering Team',
      institutionLogoText: 'AI-ENG',
    },
  },
  {
    id: 'tpl-minimalis-swiss',
    name: 'Swiss Grid Minimalist',
    category: 'Minimalis profesional',
    description: 'Terinspirasi tipografi Swiss Internasional: ruang kosong terukur, garis pembatas tipis, dan fokus 100% pada substansi pesan.',
    recommendedFor: ['Keynote Eksekutif', 'Desain Produk', 'Presentasi Monograf'],
    previewSlides: ['Judul Monograf', 'Pernyataan Utama', 'Tiga Pilar Inti', 'Data Terpilih', 'Penutup'],
    theme: {
      templateId: 'tpl-minimalis-swiss',
      primaryColor: '#18181B',
      secondaryColor: '#52525B',
      backgroundColor: '#FAFAFA',
      surfaceColor: '#FFFFFF',
      textColor: '#09090B',
      mutedTextColor: '#71717A',
      fontFamily: 'Plus Jakarta Sans',
      cornerRadius: 'sharp',
      illustrationStyle: 'minimal',
      titlePlacement: 'left',
      showHeaderFooter: false,
      headerText: '',
      footerText: 'Swiss Grid Layout',
      showSlideNumbers: true,
      institutionName: 'Studio Design System',
      institutionLogoText: 'SWISS',
    },
  },
  {
    id: 'tpl-infografis-visual',
    name: 'Visual Infographic & Flows',
    category: 'Infografis',
    description: 'Mengutamakan diagram proses, kartu angka KPI, linimasa berurutan, dan matriks perbandingan visual.',
    recommendedFor: ['Sosialisasi Kebijakan', 'Alur Operasional', 'Ringkasan Eksekutif'],
    previewSlides: ['Peta Ekosistem', 'Diagram 4 Tahap', 'Kartu Metrik Utama', 'Perbandingan Opsi', 'Rekomendasi'],
    theme: {
      templateId: 'tpl-infografis-visual',
      primaryColor: '#0284C7',
      secondaryColor: '#0D9488',
      backgroundColor: '#FFFFFF',
      surfaceColor: '#F0F9FF',
      textColor: '#0C4A6E',
      mutedTextColor: '#0369A1',
      fontFamily: 'DM Sans',
      cornerRadius: 'soft',
      illustrationStyle: 'geometric',
      titlePlacement: 'center',
      showHeaderFooter: true,
      headerText: 'Visual Infographic Summary',
      footerText: 'Data & Process Visualization',
      showSlideNumbers: true,
      institutionName: 'Visual Analytics Unit',
      institutionLogoText: 'INFO-VIS',
    },
  },
  {
    id: 'tpl-pitch-venture',
    name: 'Venture Capital Pitch Deck',
    category: 'Pitch deck',
    description: 'Struktur standar pendanaan startup: Problem, Solution, Market Size, Traction, Business Model, Competitive Advantage, dan Ask.',
    recommendedFor: ['Seed / Series A Pitch', 'Demo Day', 'Kemitraan Strategis'],
    previewSlides: ['The Problem', 'Our Solution', 'Market Traction', 'Unit Economics', 'Investment Ask'],
    theme: {
      templateId: 'tpl-pitch-venture',
      primaryColor: '#2563EB',
      secondaryColor: '#10B981',
      backgroundColor: '#090D16',
      surfaceColor: '#111827',
      textColor: '#F9FAFB',
      mutedTextColor: '#9CA3AF',
      fontFamily: 'Plus Jakarta Sans',
      cornerRadius: 'rounded',
      illustrationStyle: 'geometric',
      titlePlacement: 'left',
      showHeaderFooter: true,
      headerText: 'Investor Pitch Deck',
      footerText: 'Strictly Private & Confidential',
      showSlideNumbers: true,
      institutionName: 'Venture Growth Labs',
      institutionLogoText: 'PITCH',
    },
  },
  {
    id: 'tpl-laporan-analitik',
    name: 'Quantitative Data & Audit Report',
    category: 'Laporan dan analisis data',
    description: 'Dikhususkan untuk tabel metrik presisi, grafik tren kuartalan, dan telaah audit berbasis bukti kuantitatif.',
    recommendedFor: ['Laporan Kuartalan', 'Evaluasi Kinerja', 'Riset Pasar'],
    previewSlides: ['Ikhtisar Data', 'Tren Kuartalan', 'Tabel Distribusi', 'Temuan Anomali', 'Rekomendasi Kebijakan'],
    theme: {
      templateId: 'tpl-laporan-analitik',
      primaryColor: '#1E40AF',
      secondaryColor: '#047857',
      backgroundColor: '#FFFFFF',
      surfaceColor: '#F8FAFC',
      textColor: '#0F172A',
      mutedTextColor: '#475569',
      fontFamily: 'JetBrains Mono',
      cornerRadius: 'sharp',
      illustrationStyle: 'technical',
      titlePlacement: 'left',
      showHeaderFooter: true,
      headerText: 'Laporan Analisis Data Kuantitatif',
      footerText: 'Data Intelligence & Audit Division',
      showSlideNumbers: true,
      institutionName: 'Divisi Riset & Analitik',
      institutionLogoText: 'DATA-REP',
    },
  },
  {
    id: 'tpl-kreatif-editorial',
    name: 'Editorial Creative Showcase',
    category: 'Presentasi kreatif',
    description: 'Perpaduan judul serif ekspresif dengan palet hangat terkurasi untuk kampanye kreatif, desain brand, dan cerita produk.',
    recommendedFor: ['Creative Pitch', 'Brand Identity', 'Kampanye Komunikasi'],
    previewSlides: ['Manifesto Kreatif', 'Konsep Visual', 'Perjalanan Audiens', 'Eksekusi Media', 'Dampak Kampanye'],
    theme: {
      templateId: 'tpl-kreatif-editorial',
      primaryColor: '#9A3412',
      secondaryColor: '#D97706',
      backgroundColor: '#FAF8F5',
      surfaceColor: '#FFFFFF',
      textColor: '#1C1917',
      mutedTextColor: '#57534E',
      fontFamily: 'Playfair Display',
      cornerRadius: 'soft',
      illustrationStyle: 'editorial',
      titlePlacement: 'center',
      showHeaderFooter: true,
      headerText: 'Creative Direction & Brand Story',
      footerText: 'Editorial Studio Deck',
      showSlideNumbers: true,
      institutionName: 'Creative Direction Studio',
      institutionLogoText: 'STUDIO',
    },
  },
  {
    id: 'tpl-agro-integrated-farming',
    name: 'Ekosistem Modular & Agro-Infografis (Visual Reference Template)',
    category: 'Infografis',
    description:
      'Template resmi hasil analisis Visual Style Reference file perkuliahan/seminar terpadu: memadukan Forest Green (#064E3B), Golden Amber (#F59E0B), dan Emerald (#047857) dengan sistem banner kontainer solid, nomor lingkaran emas dinamis, komparasi BEFORE vs AFTER terarah, modular cards 4–6 pilar, callout Pesan Utama quote-badge, dan footer bar piktogram ekosistem. Fleksibel untuk topik teknologi, sains, bisnis, pendidikan, kesehatan, maupun lingkungan.',
    recommendedFor: [
      'Semua Topik Lintas Bidang (Teknologi, Bisnis, Edukasi, Sains)',
      'Kuliah Pascasarjana & Seminar Akademik',
      'Laporan Proyek & Strategi ESG Berkelanjutan',
      'Infografis Ekosistem & Alur Proses',
      'Hilirisasi Riset & Rekomendasi Kebijakan',
    ],
    previewSlides: [
      'Cover Asimetris & Ekosistem Sinergis',
      'Komparasi BEFORE vs AFTER (Sistem Terpadu)',
      'Tujuan 6 Kompetensi Bernomor Lingkaran',
      'Zonasi Spasial & Arsitektur Lapangan',
      'Efisiensi 5R & Evaluasi Metrik LER',
    ],
    theme: {
      templateId: 'tpl-agro-integrated-farming',
      primaryColor: '#064E3B',
      secondaryColor: '#F59E0B',
      backgroundColor: '#FFFFFF',
      surfaceColor: '#F0FDF4',
      textColor: '#0F172A',
      mutedTextColor: '#475569',
      fontFamily: 'Plus Jakarta Sans',
      cornerRadius: 'rounded',
      illustrationStyle: 'editorial',
      titlePlacement: 'left',
      showHeaderFooter: true,
      headerText: 'Fakultas Pertanian · Pengelolaan Pangan Berkelanjutan',
      footerText: 'PENGELOLAAN TANAMAN PERKEBUNAN & PANGAN BERKELANJUTAN BY YENNI ASBUR',
      showSlideNumbers: true,
      institutionName: 'Universitas Islam Sumatera Utara (UISU)',
      institutionLogoText: 'UISU-PERTANIAN',
    },
  },
];

export const VERIFIED_VISUAL_STYLE_REPORT: VisualStyleReferenceReport = {
  referenceFileName: 'Pertemuan_1_PENGELOLAAN_TANAMAN_PERKEBUNAN___PANGAN_BERKELANJUTAN_ef29efc6.pdf',
  referenceFileType: 'PDF',
  analyzedAt: '2026-10-19T10:00:00.000Z',
  targetNewTopic: 'Topik Lintas Bidang (Teknologi, Bisnis, Pendidikan, Sains & Lingkungan)',
  sectionA_IdentitySummary: {
    styleName: 'Ekosistem Modular & Agro-Infografis (Editorial-Technical Hybrid)',
    overallCharacter:
      'Sistem presentasi multidimensi berdensitas tinggi yang sangat disiplin dan terstruktur. Menggabungkan identitas akademik formal dengan infografis modular berdinding kontainer, roda ekosistem sirkular, komparasi tajam BEFORE vs AFTER, serta penanda hierarki nomor lingkaran emas kontras.',
    moodAndAtmosphere:
      'Otoritatif, berbasis data empiris, ilmiah, segar alami, membumi, dan berorientasi keberlanjutan strategis.',
    designArchetype: 'Modular High-Density Infographic & Institutional Field Guide',
    suitabilityCrossTopic: [
      'Teknologi Informasi, Arsitektur AI & Rekayasa Cloud Terdistribusi',
      'Bisnis, Tata Kelola ESG & Manajemen Rantai Pasok Berkelanjutan',
      'Pendidikan Tinggi, Kurikulum Merdeka & Modul Pelatihan Profesional',
      'Kesehatan Masyarakat, Biomedis & Epidemiologi Terpadu',
      'Ekonomi Sirkular, Valuasi Karbon & Energi Baru Terbarukan',
      'Sains Kebumian, Bioteknologi & Konservasi Lingkungan Hidup',
    ],
  },
  sectionB_DesignAnalysis: {
    factualObservations: {
      colorPaletteObserved:
        'Dominasi Forest Green (#064E3B) dan Emerald (#047857) untuk kontainer judul utama dan footer bar; Golden Amber (#F59E0B) dan Marigold (#D97706) sebagai aksen lingkaran nomor slide dan sorotan pertanyaan; Slate Gray (#334155) dan Crimson Red (#DC2626) sebagai penegas kontras kondisi BEFORE/tantangan; Sky Blue (#0284C7) untuk metrik air/teknologi; Terra Cotta (#78350F) untuk biomassa/unsur hara; latar kanvas putih bersih (#FFFFFF) berpadu kontainer hijau lembut (#F0FDF4) dan pita kuning gading (#FEF3C7).',
      typographyAndHierarchy:
        'Font sans-serif modern berbobot bold/black (Plus Jakarta Sans/Inter) berkarakter geometris tegas. Judul slide berhuruf kapital penuh (ALL CAPS) putih di atas banner kontainer hijau pekat; nomor slide ditempatkan di lingkaran kuning emas kontras; subjudul berupa kalimat pertanyaan reflektif di pita kuning lembut; teks isi terstruktur dalam kartu ber-bullet checkmark hijau.',
      layoutAndComposition:
        'Grid modular 2 hingga 4 kolom kartu dengan sudut rounded (rounded-lg/xl); sampul asimetris (kiri identitas universitas/program studi dan 5 badge kompetensi, kanan diagram sirkular konsentris); halaman isi menerapkan split-panel BEFORE vs AFTER dengan panah transisi, zonasi bertingkat, diagram alur panah tebal, dan kartu pesan penutup.',
      whitespaceAndDensity:
        'Tingkat kepadatan informasi tinggi (high-density macro infographic), namun tetap nyaman dipindai karena seluruh elemen terkapsul rapi dalam kontainer kartu mandiri tanpa teks liar mengambang bebas.',
      imageryIllustrationIcons:
        'Perpaduan fotografi nyata lapangan berbingkai sudut membulat, diagram vektor lingkaran konsentris dengan panah melingkar, piktogram mikro di samping setiap poin materi, serta set piktogram minimalis putih di footer (daun, tunas, panah daur ulang sirkular, tetesan air, grafik performa).',
      texturesOrnamentsBackground:
        'Latar belakang kanvas putih polos tanpa noise mengganggu; ornamen grafis berupa pita sorot rounded (ribbon), panah tebal penunjuk arah transformasi sistemik, dan footer bar hijau tua penuh di dasar slide.',
      coverAndContentCharacter:
        'Sampul menonjolkan kredibilitas institusi resmi di kiri atas (logo UISU dan Fakultas Pertanian), judul besar dwinaungan hijau-emas, serta 5 badge pilar kompetensi. Halaman isi sangat konsisten mempertahankan nomor slide lingkaran emas di samping banner judul hijau tua dan footer bar identitas di batas paling bawah.',
    },
    observationalLimitations:
      'Analisis dilakukan secara langsung dan menyeluruh terhadap ke-20 halaman penuh dokumen PDF referensi beresolusi tinggi, mencakup halaman sampul, komparasi sistem, capaian kompetensi, arsitektur zonasi kebun, dinamika ruang tegakan, matriks tanaman pangan, evaluasi LER, SDGs, etika dakwah amanah, hingga hilirisasi dampak.',
  },
  sectionC_StyleGuide: {
    visualConcept:
      'Sistem Informasi Terpadu Multi-Container: menyatukan data analitis, foto bukti empiris, dan pesan strategis dalam blok-blok modular yang terhubung oleh alur relasional yang jelas.',
    extractedTheme: {
      primaryColor: '#064E3B',
      secondaryColor: '#F59E0B',
      backgroundColor: '#FFFFFF',
      surfaceColor: '#F0FDF4',
      textColor: '#0F172A',
      mutedTextColor: '#475569',
      fontFamily: 'Plus Jakarta Sans',
      cornerRadius: 'rounded',
      illustrationStyle: 'editorial',
      titlePlacement: 'left',
    },
    colorRoles: [
      {
        hex: '#064E3B',
        role: 'Header Banner & Footer Bar Penuh',
        usageRule: 'Digunakan untuk banner kontainer judul slide utama, footer bar horizontal, dan kartu Pesan Utama.',
      },
      {
        hex: '#F59E0B',
        role: 'Nomor Slide & Penanda Fokus',
        usageRule: 'Wajib digunakan pada lingkaran nomor slide dan penanda elemen kunci yang membutuhkan atensi instan.',
      },
      {
        hex: '#047857',
        role: 'Panel Solusi / Sinergi Terpadu',
        usageRule: 'Digunakan untuk container panel AFTER, status optimal, dan badge pencapaian keberhasilan.',
      },
      {
        hex: '#334155',
        role: 'Panel Kondisi Awal / Baseline Masalah',
        usageRule: 'Digunakan untuk container panel BEFORE atau konteks kendala sebelum intervensi/inovasi.',
      },
      {
        hex: '#DC2626',
        role: 'Penanda Risiko, Batasan & Tantangan',
        usageRule: 'Digunakan untuk badge peringatan (danger), kendala kritis, atau limitasi kompetisi negatif.',
      },
      {
        hex: '#0284C7',
        role: 'Dimensi Teknologi & Metrik Presisi',
        usageRule: 'Digunakan untuk indikator efisiensi sistem, sensor/teknologi digital, dan data analitik.',
      },
      {
        hex: '#FEF3C7',
        role: 'Latar Ribbon Pertanyaan Analitis',
        usageRule: 'Digunakan sebagai latar belakang pita pertanyaan reflektif atau subjudul di bawah banner judul.',
      },
      {
        hex: '#F0FDF4',
        role: 'Latar Kontainer Kartu Isi',
        usageRule: 'Digunakan untuk permukaan kartu-kartu sub-konten agar kontras halus dengan kanvas putih.',
      },
    ],
    typographyRules: [
      'Judul slide wajib menggunakan font Sans-Serif Tebal (Bold/Black), ALL CAPS, warna putih di atas banner kontainer hijau (#064E3B).',
      'Nomor slide wajib ditempatkan di dalam lingkaran bulat kuning emas (#F59E0B) dengan angka gelap tebal yang kontras.',
      'Pertanyaan pemantik atau subjudul diletakkan pada pita rounded lembut (#FEF3C7) dengan teks gelap berbobot medium.',
      'Poin-poin isi dikelompokkan ke dalam kartu-kartu mandiri dengan ikon checkmark berlingkar hijau, bukan teks mengambang tanpa wadah.',
      'Pesan Utama (Key Takeaway) wajib disajikan dalam kontainer bar tersendiri di bagian bawah slide dengan ikon target/kutipan.',
    ],
    layoutSystemRules: [
      'Modular Container Hierarchy: semua konten harus berada dalam kartu (card container) berbatas sudut membulat (rounded-lg).',
      'Sistem Perbandingan 2 Kolom: gunakan format BEFORE (Slate Gray) vs AFTER (Emerald Green) dengan panah transisi di tengah.',
      'Sistem Hub-and-Spoke: jika materi memiliki banyak komponen saling berinteraksi, gunakan diagram lingkaran pusat dengan satelit melingkar.',
      'Footer Bar Identitas: setiap halaman wajib memiliki bilah bawah horizontal warna primer yang memuat identitas deck dan 4–5 piktogram minimalis.',
    ],
    consistencyRules: [
      'Pertahankan posisi badge nomor slide di samping banner judul secara seragam di seluruh dek.',
      'Gunakan ketebalan border kartu yang konsisten (1–1.5px) dengan warna turunan kontainer yang halus.',
      'Jangan biarkan ada teks panjang lebih dari 3 baris tanpa pemecahan menjadi poin kartu atau diagram alur.',
    ],
    elementsToKeep: [
      'Struktur banner judul slide solid hijau tua (#064E3B) dengan nomor slide dalam lingkaran kuning emas (#F59E0B).',
      'Format komparasi tajam BEFORE (masalah/awal) vs AFTER (solusi terpadu) dengan panah dinamis.',
      'Sistem kartu bernomor 1–6 dengan lingkaran angka berwarna-warni teratur.',
      'Container callout Pesan Utama di bagian bawah setiap slide analitis.',
      'Footer bar gelap di dasar slide dengan deretan piktogram minimalis.',
    ],
    elementsToAdapt: [
      'Ganti seluruh foto objek perkebunan kelapa sawit dengan foto visual dan diagram arsitektur yang 100% relevan dengan topik baru.',
      'Sesuaikan teks branding institusi (UISU) dengan nama institusi, universitas, atau perusahaan target pengguna.',
      'Ganti piktogram footer yang agraris dengan 5 piktogram minimalis yang mewakili pilar topik baru.',
    ],
    elementsToAvoid: [
      'DILARANG menyalin objek perkebunan sawit, biji kedelai, atau istilah agronomi jika topik baru adalah teknologi, bisnis, atau bidang non-agrikultur.',
      'HINDARI tata letak teks polos yang mengambang tanpa kontainer kartu.',
      'HINDARI menghilangkan lingkaran nomor slide atau banner judul solid, karena itu adalah DNA utama gaya referensi ini.',
    ],
  },
  sectionD_ReadyDesignPrompt: {
    crossTopicAdaptationStrategy:
      'Pertahankan seluruh DNA struktural (banner hijau tua, nomor emas bulat, kartu modular 4–6 pilar, komparasi Before-After, dan footer piktogram), lalu terapkan objek, terminologi teknis, dan studi kasus yang 100% spesifik untuk topik target.',
    creativeRecommendationsForNewTopic: [
      'Untuk Topik Teknologi/AI: gunakan diagram arsitektur berlapis sebagai pengganti zonasi kebun, metrik throughput/latency sebagai pengganti LER, dan diagram siklus CI/CD sebagai pengganti siklus biomassa sirkular.',
      'Untuk Topik Bisnis/Finansial: gunakan kartu BEFORE (inefisiensi biaya) vs AFTER (pertumbuhan margin terpadu), metrik ROI/EBITDA, dan roadmap kuartalan pada layout dinamika linimasa.',
      'Untuk Topik Kesehatan/Kedokteran: gunakan komparasi monoterapi vs terapi kombinasi terpadu, skema jalur metabolisme seluler, dan evaluasi hasil klinis berbasis statistik.',
    ],
    masterDesignPrompt:
      'Design an executive high-density modular infographic slide deck inspired by an academic field reference system: Deep Forest Green (#064E3B) structured header banner with a vibrant golden-amber (#F59E0B) circular slide number badge; clean white cards with subtle borders; Before vs After dual-panel comparison with transition arrows; 6-pillar numbered circular icon cards; bottom dark green "Key Takeaway" callout container; and an edge-to-edge dark footer bar with minimalist thematic icons. All visual elements, photography, and diagrams must strictly portray [TARGET_TOPIC] without any unrelated botanical artifacts.',
  },
  sectionE_MoodboardDirection: {
    moodboardConcept:
      'Modular Ecosystem & Multidimensional Intelligence: perpaduan ketegasan ilmiah akademik dengan kejelasan infografis modern berstruktur kontainer.',
    graphicElementsAndMotifs: [
      'Circular Number Badges (Amber #F59E0B dengan teks tebal kontras)',
      'Solid Emerald Header Container Pills (#064E3B)',
      'Split Before-After Comparison Panels dengan panah transisi horizontal',
      'Circular Hub-and-Spoke Ecosystem Wheel dengan panah sirkular',
      'Bottom Callout Container "Pesan Utama" dengan icon target/kutipan',
      'Minimalist Footer Strip dengan 5 ikon tematik berderet',
    ],
    coverSlideDirection:
      'Komposisi split asimetris: 60% kiri memuat logo institusi, judul dua-warna (primer + aksen emas), subjudul kartu penjelasan, metadata pemateri bertanda ikon, dan 5 badge pilar kompetensi di bagian kaki; 40% kanan menampilkan diagram ekosistem sirkular bertema topik baru.',
    contentSlideDirection:
      'Setiap slide isi menggunakan banner judul kontainer hijau gelap dengan lingkaran nomor slide emas di sudut; badan slide dibagi menjadi 2–4 kartu kontainer berbatas halus dengan bullet checkmark hijau; bagian bawah selalu dilengkapi banner "Pesan Utama" (kontainer hijau tua) atau "Pertanyaan Diskusi" (kontainer kuning gading berlampu bohlam).',
    closingSlideDirection:
      'Slide penutup memuat diagram ringkasan pilar melingkar di sisi kiri, container "5 TAKE-HOME MESSAGES" bernomor di sisi kanan atas, kutipan inspiratif di kotak berarsir, dan tipografi ekspresif "Terima Kasih" beserta afiliasi institusi di sudut kanan bawah.',
  },
};

export const INITIAL_SAMPLE_PROJECTS: PresentationProject[] = [
  {
    id: 'proj-agro-integrated-farming',
    title: 'Pengelolaan Kelapa Sawit Berbasis Integrated Farming',
    topic:
      'Optimalisasi Ruang, Tanaman Pangan, Biomassa, dan Efisiensi Input Menuju Perkebunan Berkelanjutan (Mata Kuliah Magister Agroteknologi Fakultas Pertanian UISU by Yenni Asbur).',
    createdAt: '2026-10-19T08:00:00.000Z',
    updatedAt: '2026-10-19T08:30:00.000Z',
    config: {
      title: 'Pengelolaan Kelapa Sawit Berbasis Integrated Farming',
      topic:
        'Optimalisasi Ruang, Tanaman Pangan, Biomassa, dan Efisiensi Input Menuju Perkebunan Berkelanjutan',
      purpose:
        'Membekali mahasiswa Magister Agroteknologi dan praktisi perkebunan dengan paradigma agroekosistem multifungsi terpadu.',
      targetAudience:
        'Mahasiswa Pascasarjana, Dosen, Peneliti Agroteknologi, Dinas Perkebunan, dan Praktisi Kelapa Sawit',
      language: 'id',
      slideCount: 20,
      durationMinutes: 45,
      depthLevel: 'mendalam',
      writingStyle: 'akademik',
      visualStyle: 'Agro-Ekologi & Integrated Farming Infographic',
      aspectRatio: '16:9',
      citationStyle: 'APA',
      sourceType: 'document',
      sourceMaterial:
        'Pertemuan 1: Pengelolaan Tanaman Perkebunan & Pangan Berkelanjutan, Program Studi Magister Agroteknologi (S2) Fakultas Pertanian UISU by Yenni Asbur.',
      visualStyleReference: VERIFIED_VISUAL_STYLE_REPORT,
    },
    theme: {
      templateId: 'tpl-agro-integrated-farming',
      primaryColor: '#064E3B',
      secondaryColor: '#F59E0B',
      backgroundColor: '#FFFFFF',
      surfaceColor: '#F0FDF4',
      textColor: '#0F172A',
      mutedTextColor: '#475569',
      fontFamily: 'Plus Jakarta Sans',
      cornerRadius: 'rounded',
      illustrationStyle: 'editorial',
      titlePlacement: 'left',
      showHeaderFooter: true,
      headerText: 'Fakultas Pertanian · Pengelolaan Pangan Berkelanjutan',
      footerText: 'PENGELOLAAN TANAMAN PERKEBUNAN & PANGAN BERKELANJUTAN BY YENNI ASBUR',
      showSlideNumbers: true,
      institutionName: 'Universitas Islam Sumatera Utara (UISU)',
      institutionLogoText: 'UISU-PERTANIAN',
    },
    outline: [
      {
        id: 'agro-out-1',
        slideNumber: 1,
        title: 'Pengelolaan Kelapa Sawit Berbasis Integrated Farming',
        mainIdea: 'Sampul kuliah magister agroteknologi mengenai optimalisasi ruang, tanaman pangan, biomassa, dan efisiensi input.',
        summaryPoints: ['Judul perkuliahan', 'Identitas fakultas & program studi', 'Dosen pengampu', '5 Pilar agroekosistem'],
        suggestedLayout: 'cover',
      },
      {
        id: 'agro-out-2',
        slideNumber: 2,
        title: 'Mengapa Integrated Farming?',
        mainIdea: 'Perbandingan tajam antara sistem monokultur konvensional dengan sistem integrated farming multifungsi.',
        summaryPoints: ['Pertanyaan reflektif 1 hektar sawit', 'Kondisi Before Monokultur', 'Kondisi After Integrated Farming', 'Pesan transformasi kebun'],
        suggestedLayout: 'comparison',
      },
      {
        id: 'agro-out-3',
        slideNumber: 3,
        title: 'Tujuan Pembelajaran',
        mainIdea: '6 capaian kompetensi mahasiswa pascasarjana dalam merancang dan mengevaluasi perkebunan terpadu.',
        summaryPoints: ['Analisis arsitektur kebun', 'Peluang TBM vs TM', 'Pemanfaatan gawangan', 'Evaluasi komoditas adaptif', 'Biomassa & efisiensi hara', 'SDGs & nilai Islam'],
        suggestedLayout: 'concept',
      },
      {
        id: 'agro-out-4',
        slideNumber: 4,
        title: 'Konsep Integrated Farming Kelapa Sawit',
        mainIdea: 'Prinsip pengelolaan interaksi antarkomponen secara terpadu melalui 5 konsep kunci.',
        summaryPoints: ['Bukan sekadar tumpangsari', 'Integrasi & diversifikasi', 'Daur ulang & efisiensi', 'Resiliensi iklim dan pasar', 'Interaksi ekologis'],
        suggestedLayout: 'process',
      },
      {
        id: 'agro-out-5',
        slideNumber: 5,
        title: 'Arsitektur Kebun Kelapa Sawit & Zonasi Ruang',
        mainIdea: 'Pemetaan ruang spasial kebun untuk menemukan titik intervensi tanaman pangan tanpa mengganggu produksi utama sawit.',
        summaryPoints: ['Barisan sawit & piringan', 'Gawangan hidup & mati', 'Pasar pikul & jalan produksi', 'Drainase & konservasi', 'Pesan utama peluang'],
        suggestedLayout: 'case-study',
      },
      {
        id: 'agro-out-6',
        slideNumber: 6,
        title: 'Dinamika Ruang: Kebun Sawit Tidak Statis',
        mainIdea: 'Perubahan radiasi cahaya bawah kanopi (PAR) seiring umur tegakan dari 0 tahun hingga lebih dari 20 tahun.',
        summaryPoints: ['Fase tanam & TBM (0-3 th)', 'Fase TM awal (4-8 th)', 'Fase TM matang (8-15 th)', 'Fase TM tua (>20 th)', 'Implikasi pilihan tanaman'],
        suggestedLayout: 'timeline',
      },
      {
        id: 'agro-out-7',
        slideNumber: 7,
        title: 'TBM vs TM: Peluang Integrasi Berbeda',
        mainIdea: 'Analisis komparatif karakteristik ekologis dan komoditas pangan yang sesuai pada fase TBM versus fase TM.',
        summaryPoints: ['Cahaya & ruang gawangan', 'Kompetisi tajuk & akar', 'Peluang pangan & pendapatan awal', 'Selektivitas toleran naungan', 'Tabel perbandingan'],
        suggestedLayout: 'comparison',
      },
      {
        id: 'agro-out-8',
        slideNumber: 8,
        title: 'Gawangan sebagai Ruang Produktif & Ekologis',
        mainIdea: 'Empat fungsi strategis gawangan: produksi pangan, konservasi tanah, sumber bahan organik biomassa, dan biodiversitas.',
        summaryPoints: ['Pangan semusim', 'Cover crop & penutup tanah', 'Pelepah & mulsa organik', 'Musuh alami & refugia', 'Zonasi tata kelola'],
        suggestedLayout: 'table',
      },
      {
        id: 'agro-out-9',
        slideNumber: 9,
        title: 'Integrasi Sawit × Padi Gogo',
        mainIdea: 'Strategi budidaya padi gogo lahan kering di sela sawit muda fase TBM dengan potensi hasil 2-5 ton/ha.',
        summaryPoints: ['Urgensi kedaulatan pangan', 'Karakteristik padi gogo', 'Skema integrasi bertahap', 'Faktor kritis cahaya dan hara', 'Pesan utama pendapatan ganda'],
        suggestedLayout: 'concept',
      },
      {
        id: 'agro-out-10',
        slideNumber: 10,
        title: 'Integrasi Sawit × Kedelai: Simbiosis & Kesuburan',
        mainIdea: 'Simbiosis legum dengan Rhizobium untuk fiksasi nitrogen alami dan peningkatan nutrisi tanah perkebunan.',
        summaryPoints: ['Bintil akar nodul aktif', 'Fiksasi N udara jadi NH4+', 'Siklus panen pendek 3-4 bulan', 'Residu biomassa hijau', 'Tantangan naungan & hama'],
        suggestedLayout: 'process',
      },
      {
        id: 'agro-out-11',
        slideNumber: 11,
        title: 'Integrasi Sawit × Jagung: Efisiensi Radiasi & Hasil Ganda',
        mainIdea: 'Distribusi gradient cahaya gawangan dan pemanfaatan panen ganda: biji pangan/pakan serta biomassa organik.',
        summaryPoints: ['Gradient cahaya 70-100% di tengah', 'Kebutuhan radiasi jagung', 'Jarak aman dari batang sawit', 'Produksi biji & pakan ternak', 'Grafik efisiensi cahaya'],
        suggestedLayout: 'chart',
      },
      {
        id: 'agro-out-12',
        slideNumber: 12,
        title: 'Matriks Pemilihan Tanaman Pangan Adaptif',
        mainIdea: 'Panduan lengkap komparasi 8 tanaman pangan: ubi kayu, ubi jalar, kacang tanah, kacang hijau, talas, sorgum, porang, dan sayuran.',
        summaryPoints: ['Toleransi naungan', 'Kebutuhan air & umur panen', 'Nilai ekonomis pasar', 'Penyesuaian fase TBM vs TM', 'Pesan prinsip kesesuaian lokal'],
        suggestedLayout: 'table',
      },
      {
        id: 'agro-out-13',
        slideNumber: 13,
        title: 'Kompetisi atau Komplementaritas?',
        mainIdea: 'Kondisi agroekologis yang memicu perebutan sumber daya versus kondisi yang membangun sinergi saling menguntungkan.',
        summaryPoints: ['Faktor perebutan: cahaya, air, N-P-K, akar', 'Kondisi pemicu kompetisi', 'Kondisi pemicu komplementaritas', 'Diferensiasi zona perakaran', 'Pesan tata kelola'],
        suggestedLayout: 'comparison',
      },
      {
        id: 'agro-out-14',
        slideNumber: 14,
        title: 'Biomassa Sawit: Dari Limbah Menjadi Sumber Daya',
        mainIdea: 'Transformasi dari sistem linier buang menjadi sistem sirkular bioekonomi terpadu.',
        summaryPoints: ['Pelepah & mulsa penutup', 'Tandan kosong (EFB) kompos', 'Limbah cair POME & biogas', 'Serat, cangkang & biochar', 'Alur sistem sirkular'],
        suggestedLayout: 'process',
      },
      {
        id: 'agro-out-15',
        slideNumber: 15,
        title: 'Efisiensi Input: Formula Konseptual 5R',
        mainIdea: 'Kerangka efisiensi input presisi untuk meningkatkan hasil sekaligus menekan jejak lingkungan perkebunan.',
        summaryPoints: ['Right Input', 'Right Dose', 'Right Place', 'Right Time', 'Right Technology', 'Formula output per unit input'],
        suggestedLayout: 'concept',
      },
      {
        id: 'agro-out-16',
        slideNumber: 16,
        title: 'Pengukuran Keberhasilan & Land Equivalent Ratio (LER)',
        mainIdea: 'Evaluasi 4 pilar (Produktivitas, Ekologi, Efisiensi, Sosial-Ekonomi) dan pembuktian LER > 1.',
        summaryPoints: ['Indikator LER = 1.55', 'Penurunan pupuk sintetis -28%', 'Kenaikan pendapatan +35%', 'Tabel interpretasi LER', 'Pilar keberhasilan komprehensif'],
        suggestedLayout: 'statistics',
      },
      {
        id: 'agro-out-17',
        slideNumber: 17,
        title: 'Integrated Farming & Keselarasan SDGs Global',
        mainIdea: 'Korelasi sistem pertanian terpadu sawit dengan target pembangunan berkelanjutan PBB 2030.',
        summaryPoints: ['SDG 2 Tanpa Kelaparan', 'SDG 6 Air Bersih', 'SDG 7 Energi Terbarukan', 'SDG 8 Pekerjaan Layak', 'SDG 12 & 13 Iklim & Sirkular', 'SDG 15 & 17 Kemitraan'],
        suggestedLayout: 'concept',
      },
      {
        id: 'agro-out-18',
        slideNumber: 18,
        title: 'Dakwah Islamiyah: Pengelolaan Kebun sebagai Amanah',
        mainIdea: 'Penyelarasan ilmu agroteknologi dengan etika lingkungan Al-Qur’an (QS. Al-A’raf: 56).',
        summaryPoints: ['Prinsip Khalifah pemakmur bumi', 'Amanah sumber daya', 'Mizan menjaga keseimbangan', 'Larangan Israf pemborosan', 'Maslahah manfaat masyarakat'],
        suggestedLayout: 'case-study',
      },
      {
        id: 'agro-out-19',
        slideNumber: 19,
        title: 'Hilirisasi: Dari Kebun Percobaan Menuju Dampak Nyata',
        mainIdea: 'Dua jalur hilirisasi: akademik (publikasi, tesis, HKI, policy brief) dan non-akademik (demplot, SOP, produk, adopsi petani).',
        summaryPoints: ['Jalur akademik terindeks', 'Jalur non-akademik lapangan', 'Demplot UISU & SOP terpadu', 'Kolaborasi multi-pihak triple helix', 'Pesan riset berdampak'],
        suggestedLayout: 'timeline',
      },
      {
        id: 'agro-out-20',
        slideNumber: 20,
        title: 'Rangkuman 5 Pesan Kunci & Penutup',
        mainIdea: 'Sintesis akhir 5 take-home messages menuju kebun sawit yang produktif, lestari, dan bermartabat.',
        summaryPoints: ['1. Ruang dinamis', '2. Peluang TBM vs TM', '3. Kompatibilitas tanaman', '4. Biomassa sirkular', '5. Evaluasi 3 pilar', 'Terima kasih & salam penutup'],
        suggestedLayout: 'conclusion',
      },
    ],
    slides: [
      {
        id: 'agro-sld-1',
        slideNumber: 1,
        title: 'PENGELOLAAN KELAPA SAWIT BERBASIS INTEGRATED FARMING',
        subtitle:
          'Optimalisasi Ruang, Tanaman Pangan, Biomassa, dan Efisiensi Input Menuju Perkebunan Berkelanjutan',
        layout: 'cover',
        bullets: [
          'Mata Kuliah: PENGELOLAAN TANAMAN PERKEBUNAN DAN PANGAN BERKELANJUTAN',
          'Program Studi Magister Agroteknologi (S2) · Fakultas Pertanian UISU',
          'Dosen Pengampu / Penyusun Materi: YENNI ASBUR',
          '5 Pilar Utama: Optimalisasi Ruang · Produksi Pangan · Daur Ulang Biomassa · Efisiensi Input · Perkebunan Berkelanjutan',
        ],
        bodyText:
          'Universitas Islam Sumatera Utara (UISU) · Fakultas Pertanian · Program Studi Magister Agroteknologi.',
        speakerNotes:
          'Selamat datang pada perkuliahan Pengelolaan Tanaman Perkebunan dan Pangan Berkelanjutan. Hari ini kita mendiskusikan paradigma baru pengelolaan kelapa sawit yang tidak lagi dipandang sebagai monokultur murni, melainkan sebagai agroekosistem terpadu multifungsi yang berdaya saing dan berkelanjutan.',
        references: [
          {
            id: 'ref-u1',
            citation: 'Fakultas Pertanian UISU. (2026). Rencana Pembelajaran Semester (RPS) Pengelolaan Perkebunan Berkelanjutan.',
            verified: true,
            verificationNote: 'Silabus resmi Program Magister Agroteknologi UISU.',
          },
        ],
        customElements: [],
      },
      {
        id: 'agro-sld-2',
        slideNumber: 2,
        title: 'Mengapa Integrated Farming?',
        subtitle:
          '"Apakah satu hektar kebun kelapa sawit hanya menghasilkan kelapa sawit?"',
        layout: 'comparison',
        bullets: [
          'Transformasi dari sistem produksi tunggal menuju agroekosistem multifungsi.',
          'Pemanfaatan ruang antartanaman sawit (gawangan) untuk ketahanan pangan nasional.',
          'Pengurangan ketergantungan pupuk kimia sintetis melalui daur ulang hara biomassa lokal.',
        ],
        comparison: {
          leftTitle: 'BEFORE: SISTEM MONOKULTUR',
          leftItems: [
            'Ruang antartanaman (gawangan) belum dimanfaatkan optimal',
            'Ketergantungan tinggi terhadap pupuk dan input eksternal',
            'Biomassa kebun banyak terbuang dan belum didaur ulang',
            'Kontribusi terhadap ketahanan pangan daerah masih rendah',
            'Rentan terhadap fluktuasi harga komoditas tunggal CPO',
          ],
          rightTitle: 'AFTER: SISTEM INTEGRATED FARMING',
          rightItems: [
            'Ruang gawangan dimanfaatkan optimal untuk tanaman pangan',
            'Efisiensi input dengan pemanfaatan sumber daya lokal',
            'Biomassa dikembalikan menjadi pupuk organik, energi & pakan',
            'Meningkatkan produksi pangan, pendapatan, dan keberlanjutan',
            'Membangun resiliensi ekologis dan stabilitas ekonomi petani',
          ],
        },
        visualSuggestion: {
          type: 'comparison',
          description: 'Bagan Before vs After sistem monokultur versus integrated farming.',
        },
        speakerNotes:
          'Perhatikan pertanyaan pemicu pada slide ini: apakah satu hektar sawit hanya menghasilkan sawit? Jawabannya tidak. Integrated farming membuktikan bahwa ruang, cahaya, dan biomassa dapat dimaksimalkan untuk pangan dan kesejahteraan petani.',
        references: [],
        customElements: [],
      },
      {
        id: 'agro-sld-3',
        slideNumber: 3,
        title: 'Tujuan Pembelajaran',
        subtitle: 'Setelah pembelajaran ini, mahasiswa Magister Agroteknologi mampu:',
        layout: 'concept',
        bullets: [
          '1. Menganalisis arsitektur dan dinamika ruang kebun kelapa sawit (dinamika cahaya, tajuk, dan perakaran).',
          '2. Membedakan peluang dan batasan integrasi tanaman pangan pada fase TBM (0–3 tahun) vs TM (≥4 tahun).',
          '3. Merancang pemanfaatan gawangan hidup dan gawangan mati berdasarkan zonasi kebun.',
          '4. Mengevaluasi kesesuaian agroekologi integrasi sawit dengan padi gogo, kedelai, jagung, dan tanaman adaptif.',
          '5. Menganalisis pemanfaatan biomassa (pelepah, TKKS, POME) dan formula efisiensi hara (prinsip 5R).',
          '6. Menghubungkan integrated farming dengan pilar SDGs, nilai Islam (amanah & mizan), serta hilirisasi riset.',
        ],
        bodyText:
          'Capaian pembelajaran mata kuliah ini dirancang untuk membentuk keahlian strategis dalam merancang sistem perkebunan terpadu berdaya saing tinggi.',
        speakerNotes:
          'Enam tujuan pembelajaran ini mencakup seluruh ranah kompetensi: mulai dari pemahaman biofisik arsitektur lahan, seleksi komoditas, manajemen biomassa, hingga integrasi dengan nilai etika Islam dan hilirisasi produk.',
        references: [],
        customElements: [],
      },
      {
        id: 'agro-sld-4',
        slideNumber: 4,
        title: 'Konsep Integrated Farming Kelapa Sawit',
        subtitle:
          'Bukan sekadar menanam dua komoditas, melainkan mengelola interaksi antarkomponen secara terpadu.',
        layout: 'process',
        bullets: [
          'Mengelola interaksi antarkomponen sistem secara terpadu untuk hasil ekonomi, ekologi, dan sosial.',
          'Interaksi meliputi aliran energi, siklus hara, pertukaran air, dan efisiensi ruang.',
        ],
        processSteps: [
          {
            step: '1',
            title: 'INTEGRASI',
            detail: 'Menghubungkan berbagai komponen (sawit, tanaman pangan, ternak, dan mikroba) dalam satu sistem terpadu.',
          },
          {
            step: '2',
            title: 'DIVERSIFIKASI',
            detail: 'Memperkaya keragaman tanaman dan usaha tani untuk meningkatkan stabilitas pendapatan petani.',
          },
          {
            step: '3',
            title: 'DAUR ULANG',
            detail: 'Memanfaatkan biomassa dan limbah perkebunan menjadi sumber daya pupuk organik, pakan, dan biogas.',
          },
          {
            step: '4',
            title: 'EFISIENSI',
            detail: 'Optimalisasi penggunaan input (air, hara, energi, dan tenaga kerja) secara presisi.',
          },
          {
            step: '5',
            title: 'RESILIENSI',
            detail: 'Membangun agroekosistem yang lebih adaptif terhadap perubahan iklim, hama, dan fluktuasi harga.',
          },
        ],
        speakerNotes:
          'Kunci dari integrated farming adalah kata "terpadu". Ada 5 konsep kunci: integrasi, diversifikasi, daur ulang, efisiensi, dan resiliensi.',
        references: [],
        customElements: [],
      },
      {
        id: 'agro-sld-5',
        slideNumber: 5,
        title: 'Arsitektur Kebun Kelapa Sawit & Zonasi Ruang',
        subtitle: 'Pesan Utama: Arsitektur kebun menentukan peluang integrasi.',
        layout: 'case-study',
        bullets: [
          'Barisan Kelapa Sawit: Jalur tegakan pokok utama sawit dengan jarak tanam standar 9×9×9 meter (segitiga sama sisi).',
          'Piringan: Area melingkar (radius 1.5–2 m) sekitar batang yang harus bebas gulma untuk aplikasi pupuk pokok sawit.',
          'Gawangan Hidup: Ruang antarbarisan yang mendapat penetrasi cahaya, sangat potensial untuk tanaman pangan semusim.',
          'Gawangan Mati: Zona tumpukan pelepah pangkasan (pruning) dan mulsa organik biomassa.',
          'Pasar Pikul & Jalan Produksi: Jalur akses panen, angkutan TBS sementara, dan transportasi mekanisasi perkebunan.',
          'Drainase & Zona Konservasi: Saluran pengatur tata air dan sabuk sempadan sungai untuk perlindungan keanekaragaman hayati.',
        ],
        bodyText:
          'Pertanyaan Analitis: "Di mana ruang produksi tambahan tersedia tanpa mengganggu fungsi utama tanaman kelapa sawit?" Jawabannya ada pada gawangan hidup dan optimalisasi gawangan mati.',
        speakerNotes:
          'Kita harus memahami zonasi ruang perkebunan sawit. Jangan menanam tanaman pangan di area piringan karena itu zona perakaran utama sawit. Gawangan hidup adalah lokasi yang tepat.',
        references: [],
        customElements: [],
      },
      {
        id: 'agro-sld-6',
        slideNumber: 6,
        title: 'Dinamika Ruang: Kebun Sawit Tidak Statis',
        subtitle: 'Pesan Utama: Strategi integrated farming harus mengikuti dinamika umur tegakan.',
        layout: 'timeline',
        bullets: [
          'Penutupan kanopi sawit meningkat seiring pertambahan umur, menyebabkan radiasi PAR di bawah kanopi menurun.',
          'Pilihan tanaman pangan harus disesuaikan secara adaptif dari fase cahaya tinggi hingga naungan pekat.',
        ],
        timelineItems: [
          {
            period: '0 Tahun (Tanam / Replanting)',
            event: 'Cahaya Penuh (100% PAR)',
            impact: 'Peluang maksimal untuk tanaman pangan semusim (padi gogo, jagung, kedelai, sayuran).',
          },
          {
            period: '1–3 Tahun (Fase TBM)',
            event: 'Kanopi Belum Menutup (70–90% PAR)',
            impact: 'Gawangan sangat luas, kompetisi tajuk rendah, produktivitas tanaman pangan sangat optimal.',
          },
          {
            period: '4–8 Tahun (Awal TM)',
            event: 'Penutupan Tajuk Mulai Rapat (40–60% PAR)',
            impact: 'Pilihan tanaman mulai terbatas; beralih ke jagung toleran, kedelai naungan, dan kacang tanah.',
          },
          {
            period: '8–15 Tahun (Fase TM Penuh)',
            event: 'Naungan Tajuk Tinggi (20–35% PAR)',
            impact: 'Fokus pada tanaman sangat toleran naungan: ubi-umbian (talas, porang), rempah adaptif, dan cover crop.',
          },
          {
            period: '>15 Tahun (Fase TM Tua)',
            event: 'Kanopi Stabil & Batang Tinggi',
            impact: 'Integrasi tanaman herba obat bernilai ekonomi tinggi, pakan ternak naungan, dan peternakan sapi.',
          },
        ],
        speakerNotes:
          'Kebun kelapa sawit itu dinamis, tidak statis. Kurva PAR menurun drastis setelah tahun ke-4. Oleh karena itu, kita tidak bisa memaksakan tanaman yang butuh cahaya penuh di kebun sawit yang sudah berusia 10 tahun.',
        references: [],
        customElements: [],
      },
      {
        id: 'agro-sld-7',
        slideNumber: 7,
        title: 'TBM vs TM: Peluang Integrasi Berbeda',
        subtitle: 'Pesan Utama: Peluang dan strategi integrated farming berbeda antara TBM dan TM.',
        layout: 'comparison',
        bullets: [
          'Perbedaan cahaya, ruang gawangan, dan kompetisi perakaran menentukan portofolio komoditas yang layak.',
        ],
        comparison: {
          leftTitle: 'TBM: TANAMAN BELUM MENGHASILKAN (0–3 TH)',
          leftItems: [
            'Cahaya relatif tinggi (70–100% PAR)',
            'Gawangan masih sangat luas dan terbuka',
            'Kompetisi tajuk dan perakaran sawit sangat rendah',
            'Peluang tanaman pangan semusim sangat tinggi',
            'Menghasilkan pendapatan sebelum panen sawit pertama',
            'Tanaman sesuai: Padi gogo, jagung hibrida, kedelai, kacang tanah, ubi kayu',
          ],
          rightTitle: 'TM: TANAMAN MENGHASILKAN (≥4 TAHUN)',
          rightItems: [
            'Kanopi berkembang dan naungan tajuk meningkat',
            'Kompetisi air dan hara perakaran lebih kompleks',
            'Diperlukan tanaman yang toleran naungan (shade-tolerant)',
            'Integrasi harus lebih selektif dengan rotasi terukur',
            'Fokus pada fungsi ekosistem dan tanaman bernilai khusus',
            'Tanaman sesuai: Kacang tanah naungan, talas, sorgum, porang, tanaman penutup tanah',
          ],
        },
        speakerNotes:
          'Pada fase TBM, fokus utama adalah produksi pangan massal dan pendapatan awal. Pada fase TM, fokus bergeser ke tanaman pangan khusus toleran naungan dan konservasi tanah.',
        references: [],
        customElements: [],
      },
      {
        id: 'agro-sld-8',
        slideNumber: 8,
        title: 'Gawangan sebagai Ruang Produktif & Ekologis',
        subtitle: 'Gawangan = Ruang Produksi Pangan + Konservasi + Sumber Biomassa + Biodiversitas.',
        layout: 'table',
        bullets: [
          'Pesan Utama: Tidak semua gawangan harus diperlakukan sama; zonasi kebun adalah kunci efisiensi.',
        ],
        tableData: {
          headers: ['Fungsi Gawangan', 'Komoditas / Komponen', 'Peran Ekologis', 'Manfaat Agronomi & Ekonomi'],
          rows: [
            [
              '1. Produksi Pangan',
              'Padi gogo, kedelai, jagung, umbi-umbian',
              'Menutup tanah terbuka dan mengurangi laju erosi permukaan',
              'Menghasilkan bahan pangan karbohidrat/protein dan arus kas tambahan',
            ],
            [
              '2. Konservasi',
              'Legume Cover Crop (Mucuna bracteata, Calopogonium)',
              'Fiksasi nitrogen bebas dan menjaga kelembapan lengas tanah',
              'Menekan pertumbuhan gulma liar dan menghemat biaya herbisida',
            ],
            [
              '3. Sumber Biomassa',
              'Pelepah pangkasan, tandan kosong kelapa sawit (TKKS)',
              'Meningkatkan C-organik dan kapasitas retensi air tanah',
              'Menjadi kompos mulsa organik yang menyuburkan perakaran sawit',
            ],
            [
              '4. Biodiversitas',
              'Tanaman berbunga (Turnera subulata, Antigonon)',
              'Menyediakan nektar dan habitat predator alami hama sawit',
              'Pengendalian hayati ulat pemakan daun sawit secara berkelanjutan',
            ],
          ],
        },
        speakerNotes:
          'Tabel ini merangkum 4 peran utama gawangan. Kita membagi kebun ke dalam zona fungsional sehingga produksi pangan dan perlindungan ekologis berjalan berdampingan.',
        references: [],
        customElements: [],
      },
      {
        id: 'agro-sld-9',
        slideNumber: 9,
        title: 'Integrasi Sawit × Padi Gogo',
        subtitle: 'Pesan Utama: Memanfaatkan ruang dan cahaya pada TBM untuk pangan dan pendapatan tambahan.',
        layout: 'concept',
        bullets: [
          'Mengapa Padi Gogo? Tidak memerlukan genangan air sawah, dapat memanfaatkan lahan kering bercurah hujan cukup.',
          'Kontribusi Nyata: Berperan langsung dalam penguatan ketahanan pangan beras di sekitar sentra perkebunan.',
          'Potensi Hasil Lapangan: Menghasilkan ±2–5 ton gabah kering panen per hektar pada fase TBM sawit.',
          'Faktor Kritis Keberhasilan: Intensitas cahaya minimal, pengaturan jarak tanam aman dari sawit, varietas unggul adaptif lokal, dan suplai hara berimbang.',
          'Manfaat Ganda: Selain menghasilkan gabah, jerami sisa panen menjadi mulsa penutup tanah penahan erosi.',
        ],
        bodyText:
          'Skema Integrasi: Sawit Muda (TBM 0–3 th) ➔ Ruang & Cahaya Gawangan ➔ Padi Gogo Ditanam ➔ Pangan & Pendapatan Tambahan ➔ Menjaga Penutup Tanah.',
        speakerNotes:
          'Padi gogo merupakan komoditas primadona pada fase TBM. Petani bisa panen beras tanpa harus membuka hutan baru atau mengalihfungsikan sawah irigasi.',
        references: [],
        customElements: [],
      },
      {
        id: 'agro-sld-10',
        slideNumber: 10,
        title: 'Integrasi Sawit × Kedelai: Simbiosis & Kesuburan',
        subtitle: 'Pesan Utama: Kedelai berkontribusi pada pangan protein, biomassa hijau, dan perbaikan kesuburan tanah.',
        layout: 'process',
        bullets: [
          'Kedelai merupakan tanaman legum yang bersimbiosis mutualisme dengan bakteri Rhizobium.',
        ],
        processSteps: [
          {
            step: '1',
            title: 'Simbiosis Rhizobium',
            detail: 'Bakteri Rhizobium pada bintil akar mengikat gas N2 udara menjadi ion amonium (N organik) yang siap diserap tanaman.',
          },
          {
            step: '2',
            title: 'Siklus Tanam Singkat',
            detail: 'Umur panen cepat (±3–4 bulan) memungkinkan 2 kali rotasi tanam dalam satu tahun kalender perkebunan.',
          },
          {
            step: '3',
            title: 'Pangan Sumber Protein',
            detail: 'Menyediakan bahan pangan bergizi tinggi untuk konsumsi lokal dan industri olahan tahu/tempe.',
          },
          {
            step: '4',
            title: 'Biomassa Residu Hijau',
            detail: 'Sisa brangkasan kedelai dibenamkan ke dalam tanah untuk memperbaiki agregat fisik dan populasi mikroba dekomposer.',
          },
        ],
        speakerNotes:
          'Kedelai tidak hanya memberi nilai ekonomi panen, tetapi juga menyuntikkan nitrogen gratis ke tanah melalui simbiosis Rhizobium. Ini menghemat pemakaian urea pada perkebunan sawit.',
        references: [],
        customElements: [],
      },
      {
        id: 'agro-sld-11',
        slideNumber: 11,
        title: 'Integrasi Sawit × Jagung: Efisiensi Radiasi & Hasil Ganda',
        subtitle: 'Pesan Utama: Jagung menghasilkan biji pangan/pakan sekaligus biomassa organik melimpah.',
        layout: 'chart',
        bullets: [
          'Jagung membutuhkan intensitas cahaya relatif tinggi sehingga paling optimal ditanam pada titik tengah gawangan fase TBM.',
          'Hasil ganda: Biji jagung untuk pangan/pakan ternak, dan batang/daun jagung untuk silase pakan atau mulsa organik.',
        ],
        chartData: {
          chartType: 'bar',
          title: 'Distribusi Relatif Radiasi Matahari (PAR) di Gawangan Sawit TBM',
          labels: ['Dekat Batang (10-20%)', 'Seperempat Gawangan (30-50%)', 'Tengah Gawangan (70-100%)', 'Rata-rata Plot TBM'],
          values: [18, 42, 92, 64],
          unit: '% Intensitas PAR',
          sourceNote: 'Kajian Agrometeorologi dan Zonasi Radiasi Kanopi Perkebunan Sawit UISU.',
        },
        speakerNotes:
          'Grafik ini memperlihatkan bahwa bagian tengah gawangan menerima hingga 92% cahaya matahari. Di situlah posisi paling ideal menanam jagung.',
        references: [],
        customElements: [],
      },
      {
        id: 'agro-sld-12',
        slideNumber: 12,
        title: 'Matriks Pemilihan Tanaman Pangan Adaptif',
        subtitle: 'Pesan Utama: Tidak ada satu tanaman terbaik untuk seluruh kebun; pemilihan berbasis agroekologi.',
        layout: 'table',
        bullets: [
          'Kesesuaian komoditas bergantung pada toleransi naungan, ketersediaan air, umur panen, dan dinamika tegakan sawit.',
        ],
        tableData: {
          headers: ['Komoditas', 'Toleransi Naungan', 'Kebutuhan Air', 'Umur Panen', 'Nilai Ekonomi', 'Kesesuaian Fase'],
          rows: [
            ['Ubi Kayu', 'Sedang', 'Rendah-Sedang', '8–12 Bulan', 'Tinggi', 'Sangat Baik di TBM (0–3 th)'],
            ['Ubi Jalar', 'Sedang', 'Sedang', '3–5 Bulan', 'Sedang', 'Cocok di TBM & Awal TM'],
            ['Kacang Tanah', 'Rendah-Sedang', 'Sedang', '3–4 Bulan', 'Tinggi', 'Optimal di TBM (Cahaya Penuh)'],
            ['Kacang Hijau', 'Rendah-Sedang', 'Rendah-Sedang', '2–3 Bulan', 'Sedang', 'Siklus Sangat Cepat di TBM'],
            ['Talas', 'Tinggi', 'Tinggi', '6–10 Bulan', 'Sedang-Tinggi', 'Sangat Baik di TM (Toleran Naungan)'],
            ['Sorgum', 'Sedang', 'Rendah', '3–4 Bulan', 'Sedang', 'Toleran Kering & Lahan Marjinal'],
            ['Porang / Suweg', 'Tinggi', 'Sedang', '8–12 Bulan', 'Tinggi', 'Pilihan Ekspor Unggulan di TM'],
            ['Sayuran Tumpangsari', 'Rendah-Sedang', 'Sedang', '1–3 Bulan', 'Sedang-Tinggi', 'Cash-crop Cepat di TBM'],
          ],
        },
        speakerNotes:
          'Gunakan matriks ini saat menyusun rencana bisnis tumpangsari. Di fase TM, talas dan porang menjadi pilihan terbaik karena toleransinya yang tinggi terhadap naungan tajuk.',
        references: [],
        customElements: [],
      },
      {
        id: 'agro-sld-13',
        slideNumber: 13,
        title: 'Kompetisi atau Komplementaritas?',
        subtitle: 'Pesan Utama: Intercropping dapat menjadi kompetisi atau komplementaritas tergantung tata kelola sistem.',
        layout: 'comparison',
        bullets: [
          'Faktor yang diperebutkan: Cahaya untuk fotosintesis, air tanah, unsur hara (N, P, K), dan ruang perakaran.',
        ],
        comparison: {
          leftTitle: 'COMPETITION (KOMPETISI MERUGIKAN)',
          leftItems: [
            'Naungan tinggi dipaksakan tanaman butuh cahaya penuh',
            'Populasi tanaman pangan terlalu rapat melampaui kapasitas',
            'Jarak tanam pangan terlalu dekat dengan pangkal batang sawit',
            'Ketersediaan air dan pupuk sangat rendah sehingga saling berebut',
            'Tanah dangkal atau padat membatasi kedalaman penetrasi akar',
          ],
          rightTitle: 'COMPLEMENTARITY (KOMPLEMENTARITAS MENGUNTUNGKAN)',
          rightItems: [
            'Cahaya memadai pada fase TBM atau varietas toleran naungan di TM',
            'Diversifikasi zona perakaran (sawit lateral vs pangan vertikal)',
            'Penutupan tanah mengurangi evaporasi air dan menjaga kelembapan',
            'Biomassa residu tanaman pangan menyumbang bahan organik tanah',
            'Pengaturan jarak tanam aman dan pemupukan presisi terpisah',
          ],
        },
        speakerNotes:
          'Kapan tumpangsari gagal? Ketika manajemen salah menempatkan tanaman atau membiarkan tanaman berebut hara di piringan sawit. Dengan pengaturan zonasi yang tepat, interaksi berubah menjadi komplementaritas yang menguntungkan.',
        references: [],
        customElements: [],
      },
      {
        id: 'agro-sld-14',
        slideNumber: 14,
        title: 'Biomassa Sawit: Dari Limbah Menjadi Sumber Daya',
        subtitle: 'Pesan Besar: Mengubah sistem linier (buang) menjadi sistem sirkular bioekonomi berkelanjutan.',
        layout: 'process',
        bullets: [
          'Siklus berkelanjutan: Limbah dan residu ➔ Bahan organik & energi ➔ Input produksi ➔ Produksi sawit & pangan ➔ Biomassa baru dikembalikan ke sistem.',
        ],
        processSteps: [
          {
            step: 'Pelepah',
            title: 'Pelepah Sawit',
            detail: 'Dicacah dan disusun di gawangan mati sebagai mulsa penahan erosi dan pengatur kelembapan tanah.',
          },
          {
            step: 'TKKS',
            title: 'Tandan Kosong (EFB)',
            detail: 'Didekomposisi menjadi kompos bermutu tinggi kaya unsur Kalium (K) untuk menyuburkan tanah.',
          },
          {
            step: 'POME',
            title: 'Limbah Cair Pabrik (POME)',
            detail: 'Difermentasi dalam biodigester menghasilkan biogas energi terbarukan dan pupuk organik cair.',
          },
          {
            step: 'Biochar',
            title: 'Serat & Cangkang',
            detail: 'Dikonversi menjadi biochar untuk meningkatkan KTK tanah serta bahan bakar boiler terbarukan.',
          },
          {
            step: 'Residu',
            title: 'Residu Tanaman Pangan',
            detail: 'Brangkasan sisa panen diolah menjadi pakan ternak fermentasi atau dikembalikan sebagai mulsa.',
          },
        ],
        speakerNotes:
          'Prinsip zero-waste berlaku di sini. Tandan kosong, pelepah, dan limbah cair bukan polutan, melainkan aset biologis bernilai tinggi jika dikelola secara sirkular.',
        references: [],
        customElements: [],
      },
      {
        id: 'agro-sld-15',
        slideNumber: 15,
        title: 'Efisiensi Input: Formula Konseptual 5R',
        subtitle: '"Lebih banyak output per unit input ≠ sekadar menggunakan lebih banyak input."',
        layout: 'concept',
        bullets: [
          '1. Right Input (Jenis Tepat): Memadukan pupuk presisi (N, P, K, mikro), bahan organik lokal (kompos EFB), dan agens hayati.',
          '2. Right Dose (Dosis Tepat): Ditetapkan berdasarkan uji laboratorium tanah dan daun, menghindari pemborosan dan pencemaran.',
          '3. Right Place (Tempat Tepat): Penempatan pupuk pada zona perakaran aktif tanaman pangan dan sawit secara terpisah.',
          '4. Right Time (Waktu Tepat): Disesuaikan dengan fase kritis kebutuhan hara dan kalender prakiraan curah hujan.',
          '5. Right Technology (Teknologi Tepat): Mekanisasi budidaya, irigasi presisi, sensor kelembapan tanah, dan drone pemantau vigor.',
        ],
        bodyText:
          'Formula 5R menghasilkan kebun berproduktivitas tinggi dengan biaya input yang lebih efisien dan jejak karbon yang minimal.',
        speakerNotes:
          'Jangan terjebak paradigma bahwa hasil tinggi harus dengan pupuk kimia berlebih. Prinsip 5R membuktikan bahwa efisiensi penempatan dan dosis justru mendongkrak hasil sekaligus menyehatkan ekosistem.',
        references: [],
        customElements: [],
      },
      {
        id: 'agro-sld-16',
        slideNumber: 16,
        title: 'Pengukuran Keberhasilan & Land Equivalent Ratio (LER)',
        subtitle: 'Pesan Utama: Keberhasilan integrasi tidak hanya diukur dari hasil sawit, tetapi juga manfaat ekologi dan efisiensi.',
        layout: 'statistics',
        bullets: [
          'Land Equivalent Ratio (LER) mengukur efisiensi pemanfaatan lahan tumpangsari dibandingkan monokultur.',
          'Formula: LER = (Ysp / Ysm) + (Ypp / Ypm) dimana nilai LER > 1 menandakan pemanfaatan lahan lebih efisien.',
        ],
        statCards: [
          {
            value: 'LER = 1.55',
            label: 'Efisiensi Lahan Tumpangsari',
            context: 'Butuh 1.55 ha monokultur untuk menyamai produksi 1 ha integrated farming.',
          },
          {
            value: '+35%',
            label: 'Peningkatan Pendapatan Petani',
            context: 'Tambahan arus kas bulanan sebelum kebun sawit mencapai masa panen pertama.',
          },
          {
            value: '-28%',
            label: 'Reduksi Pupuk Kimia',
            context: 'Penghematan biaya input anorganik melalui pemanfaatan kompos biomassa lokal.',
          },
          {
            value: '100%',
            label: 'Penutupan Lahan Terbuka',
            context: 'Penurunan tingkat erosi tanah dan limpasan permukaan secara drastis.',
          },
        ],
        speakerNotes:
          'Pada slide ini kita menggunakan data empiris percontohan. Nilai LER 1.55 adalah bukti ilmiah tak terbantahkan bahwa tumpangsari sawit-padi gogo jauh lebih produktif dibandingkan sistem monokultur terpisah.',
        references: [
          {
            id: 'ref-ler',
            citation: 'Mead, R., & Willey, R. W. (1980). The concept of a Land Equivalent Ratio and advantages in yields from intercropping. Experimental Agriculture.',
            verified: true,
            verificationNote: 'Metodologi baku LER dalam sains agronomi internasional.',
          },
        ],
        customElements: [],
      },
      {
        id: 'agro-sld-17',
        slideNumber: 17,
        title: 'Integrated Farming & Keselarasan SDGs Global',
        subtitle: 'Tujuan Akhir: Sistem perkebunan yang produktif, berdaya saing, inklusif, dan selaras dengan SDGs.',
        layout: 'concept',
        bullets: [
          'SDG 2 (Zero Hunger): Meningkatkan produksi pangan (padi gogo, kedelai, jagung) langsung dari lahan perkebunan.',
          'SDG 6 (Clean Water & Sanitation): Konservasi kualitas air melalui mulsa tanah dan perlindungan sempadan sungai.',
          'SDG 7 (Affordable & Clean Energy): Pemanfaatan biogas limbah POME dan bahan bakar biomassa boiler terbarukan.',
          'SDG 8 (Decent Work & Economic Growth): Menciptakan peluang kerja baru dan diversifikasi pendapatan petani sawit rakyat.',
          'SDG 12 (Responsible Consumption & Production): Daur ulang biomassa pelepah dan tandan kosong tanpa residu terbuang.',
          'SDG 13 (Climate Action): Peningkatan cadangan karbon tanah dan penurunan emisi gas rumah kaca.',
          'SDG 15 & 17 (Life on Land & Partnerships): Konservasi musuh alami serta kolaborasi perguruan tinggi, industri, dan petani.',
        ],
        bodyText:
          'Integrated farming kelapa sawit berkontribusi langsung pada pencapaian 8 tujuan pembangunan berkelanjutan global.',
        speakerNotes:
          'Sektor kelapa sawit sering dikritik terkait isu lingkungan. Melalui model integrated farming ini, perkebunan sawit justru menjadi bagian dari solusi pencapaian SDGs global.',
        references: [],
        customElements: [],
      },
      {
        id: 'agro-sld-18',
        slideNumber: 18,
        title: 'Dakwah Islamiyah: Pengelolaan Kebun sebagai Amanah',
        subtitle: 'Mengelola perkebunan dan pangan bukan hanya kegiatan ekonomi, tetapi bagian dari ibadah dan amanah khalifah.',
        layout: 'case-study',
        bullets: [
          'Dalil Al-Qur’an (QS. Al-A’raf: 56): "Dan janganlah kamu membuat kerusakan di muka bumi sesudah Allah memperbaikinya..."',
          'KHALIFAH: Manusia sebagai pengelola bumi yang bertugas merawat kelestarian alam untuk generasi mendatang.',
          'AMANAH: Sumber daya alam harus dikelola secara jujur, transparan, dan bertanggung jawab di hadapan Allah dan manusia.',
          'MIZAN: Menjaga neraca keseimbangan antara target produksi ekonomi, kelestarian ekologi, dan keadilan sosial.',
          'ISRAF (Larangan Pemborosan): Menghindari eksploitasi berlebihan, pemborosan air/pupuk, dan pembuangan biomassa.',
          'MASLAHAH: Pengelolaan kebun harus memberikan manfaat kemakmuran yang luas bagi petani, masyarakat, dan semesta.',
        ],
        bodyText:
          'Refleksi Utama: "Produktivitas tanpa tanggung jawab ekologis bukanlah tujuan akhir pertanian berkelanjutan." Pesan Akhir: Mengelola kebun dengan ilmu, amanah, dan keseimbangan adalah jalan menuju keberkahan dunia dan akhirat.',
        speakerNotes:
          'Sebagai institusi UISU, integrasi nilai keislaman adalah fondasi moral kita. Pertanian bukan semata soal uang, melainkan amanah ketuhanan untuk memakmurkan bumi tanpa merusaknya.',
        references: [
          {
            id: 'ref-quran',
            citation: 'Al-Qur’an Al-Karim, Surah Al-A’raf Ayat 56.',
            verified: true,
            verificationNote: 'Ayat etika perlindungan lingkungan dalam syariat Islam.',
          },
        ],
        customElements: [],
      },
      {
        id: 'agro-sld-19',
        slideNumber: 19,
        title: 'Hilirisasi: Dari Kebun Percobaan Menuju Dampak Nyata',
        subtitle: 'Pesan Utama: Riset tidak berhenti pada publikasi; riset harus mampu menghasilkan perubahan.',
        layout: 'timeline',
        bullets: [
          'Mengubah hasil riset laboratorium dan kebun percobaan menjadi ilmu, teknologi, produk, kebijakan, dan kesejahteraan.',
        ],
        timelineItems: [
          {
            period: '1. Hilirisasi Akademik',
            event: 'Bukti Ilmiah & Rekomendasi Kebijakan',
            impact: 'Publikasi jurnal terindeks, tesis magister, dataset spasial sawit-pangan, HKI, dan naskah policy brief dinas.',
          },
          {
            period: '2. Demplot Percontohan',
            event: 'Uji Lapangan Skala Petani',
            impact: 'Pembangunan demonstration plot UISU untuk membuktikan kelayakan teknis dan agronomis di lapangan.',
          },
          {
            period: '3. SOP & Standardisasi',
            event: 'Panduan Praktis Budidaya',
            impact: 'Penyusunan SOP integrated farming sawit-pangan yang mudah dipahami dan diterapkan oleh petani pekebun rakyat.',
          },
          {
            period: '4. Produk Komersial & Biobisnis',
            event: 'Inovasi Berbasis Biomassa',
            impact: 'Formulasi kompos EFB, biochar pembenah tanah, pakan ternak residu, dan biopestisida agens hayati.',
          },
          {
            period: '5. Kemitraan & Adopsi Massal',
            event: 'Kolaborasi Multi-Pihak (Triple Helix)',
            impact: 'Sinergi Perguruan Tinggi (UISU) · Pemerintah · Perusahaan Perkebunan · Petani Rakyat · Lembaga Riset.',
          },
        ],
        speakerNotes:
          'Riset di menara gading tidak ada gunanya jika petani di lapangan tidak merasakan manfaatnya. Inilah misi hilirisasi Fakultas Pertanian UISU.',
        references: [],
        customElements: [],
      },
      {
        id: 'agro-sld-20',
        slideNumber: 20,
        title: 'Rangkuman & 5 Take-Home Messages',
        subtitle: '"Kebun sawit berkelanjutan bukan hanya tentang apa yang dipanen, tetapi bagaimana seluruh sumber daya di dalamnya dikelola."',
        layout: 'conclusion',
        bullets: [
          '1. Kebun kelapa sawit merupakan ruang produksi yang dinamis, bukan entitas statis.',
          '2. Peluang integrasi tanaman pangan sangat terbuka pada fase TBM dan bertransisi selektif pada fase TM.',
          '3. Tanaman pangan harus dipilih secara cermat berdasarkan kompatibilitas ekologis dan kebutuhan radiasi cahaya.',
          '4. Biomassa sawit dan limbah pabrik adalah sumber daya berharga dalam siklus ekonomi sirkular.',
          '5. Keberhasilan integrated farming harus dinilai dari produktivitas, ekologi, dan kemakmuran sosial secara terpadu.',
        ],
        bodyText:
          'Terima Kasih · Wassalamu’alaikum Warahmatullahi Wabarakatuh · YENNI ASBUR · Fakultas Pertanian Universitas Islam Sumatera Utara (UISU).',
        speakerNotes:
          'Terima kasih atas perhatian Anda semua. Semoga materi Pengelolaan Kelapa Sawit Berbasis Integrated Farming ini memberikan inspirasi dan wawasan aplikatif bagi kemajuan pertanian berkelanjutan Indonesia.',
        references: [],
        customElements: [],
      },
    ],
  },
  {
    id: 'proj-visual-style-reference-guide',
    title: 'Sistem Gaya Visual & Panduan Desain Lintas Topik (Visual Style Reference)',
    topic:
      'Analisis karakter visual referensi (Tahap 1–4) dan perumusan Visual Style Guide (Format A–E) yang fleksibel untuk diadaptasi ke berbagai bidang ilmu dan topik baru.',
    createdAt: '2026-10-19T02:30:00.000Z',
    updatedAt: '2026-10-19T02:55:00.000Z',
    config: {
      title: 'Sistem Gaya Visual & Panduan Desain Lintas Topik (Visual Style Reference)',
      topic:
        'Analisis karakter visual referensi (Tahap 1–4) dan perumusan Visual Style Guide (Format A–E) yang fleksibel untuk diadaptasi ke berbagai bidang ilmu dan topik baru.',
      purpose:
        'Menyediakan hasil analisis elemen desain referensi, panduan Visual Style Guide terukur, pemisahan pengamatan faktual vs rekomendasi kreatif, prompt desain lintas topik, dan konsep moodboard visual.',
      targetAudience:
        'Art Director, Desainer Presentasi, Tim Riset, Konsultan Strategis, dan Pembuat Materi Akademik/Bisnis',
      language: 'id',
      slideCount: 7,
      durationMinutes: 25,
      depthLevel: 'mendalam',
      writingStyle: 'profesional',
      visualStyle: 'Architectural Editorial & Precision Grid',
      aspectRatio: '16:9',
      citationStyle: 'None',
      sourceType: 'visual-reference',
      sourceMaterial:
        'Analisis Visual Style Reference 4 Tahap: (1) Analisis Gaya Visual Faktual, (2) Rumusan Visual Style Guide, (3) Adaptasi ke Topik Baru Lintas Disiplin, (4) Konsep Moodboard Visual (Sampul, Isi, Penutup).',
    },
    theme: {
      ...PRESENTATION_TEMPLATES[7].theme,
      headerText: 'VISUAL STYLE REFERENCE & DESIGN SYSTEM (A–E)',
      footerText: 'Art Direction & Cross-Topic Presentation Style Guide',
      institutionLogoText: 'STYLE GUIDE',
    },
    outline: [
      {
        id: 'vsr-out-1',
        slideNumber: 1,
        title: 'A. Ringkasan Identitas Visual (Visual Identity Summary)',
        mainIdea:
          'Karakteristik utama DNA visual referensi, arketipe desain, atmosfer, serta fleksibilitas penerapan lintas disiplin.',
        summaryPoints: [
          'Arketipe Desain & Karakter Utama',
          'Atmosfer & Mood Visual',
          'Kesesuaian Lintas Topik',
          'Prinsip Non-Tematik',
        ],
        suggestedLayout: 'cover',
      },
      {
        id: 'vsr-out-2',
        slideNumber: 2,
        title: 'B. Analisis Elemen Desain dari File Referensi',
        mainIdea:
          'Pengamatan faktual objektif terhadap warna, tipografi, komposisi, ruang kosong, ikonografi, dan tekstur tanpa mengarang.',
        summaryPoints: [
          'Observasi Palet & Kontras Warna',
          'Tipografi & Hierarki Heading/Body',
          'Komposisi & Tata Letak Ruang',
          'Ikonografi, Tekstur & Batasan Observasi',
        ],
        suggestedLayout: 'table',
      },
      {
        id: 'vsr-out-3',
        slideNumber: 3,
        title: 'C. Panduan Visual Style Guide & Aturan Desain',
        mainIdea:
          'Sistem perancangan baku: pembagian peran warna, hierarki teks, sistem layout, serta batasan apa yang harus dipertahankan vs dihindari.',
        summaryPoints: [
          'Peran Warna & Aturan Penggunaan',
          'Standar Tipografi & Sistem Grid',
          'Elemen yang Dipertahankan',
          'Elemen yang Harus Dihindari',
        ],
        suggestedLayout: 'process',
      },
      {
        id: 'vsr-out-4',
        slideNumber: 4,
        title: 'D. Adaptasi ke Topik Baru & Prompt Desain Siap Pakai',
        mainIdea:
          'Pemisahan tegas antara hasil observasi file referensi dengan rekomendasi kreatif untuk topik baru di bidang apa pun.',
        summaryPoints: [
          'Strategi Pemindahan DNA Visual',
          'Rekomendasi Kreatif Lintas Disiplin',
          'Master Design Prompt Siap Pakai',
          'Konsistensi Tanpa Batasan Isi',
        ],
        suggestedLayout: 'case-study',
      },
      {
        id: 'vsr-out-5',
        slideNumber: 5,
        title: 'E. Arahan Pembuatan Moodboard Visual',
        mainIdea:
          'Konsep moodboard visual mencakup sampul, tata letak konten, ornamen grafis, dan slide penutup.',
        summaryPoints: [
          'Konsep Moodboard Keseluruhan',
          'Arahan Desain Slide Sampul',
          'Arahan Desain Slide Konten',
          'Arahan Desain Slide Penutup',
        ],
        suggestedLayout: 'concept',
      },
      {
        id: 'vsr-out-6',
        slideNumber: 6,
        title: 'Matriks Perbandingan: Desain Generik vs Sistem Gaya Visual Referensi',
        mainIdea:
          'Membandingkan pendekatan slide template biasa dengan sistem desain berkarakter hasil analisis referensi.',
        summaryPoints: [
          'Karakter Visual yang Khas',
          'Hierarki Informasi yang Jelas',
          'Adaptabilitas Lintas Topik',
          'Kualitas Ekspor PPTX Asli',
        ],
        suggestedLayout: 'comparison',
      },
      {
        id: 'vsr-out-7',
        slideNumber: 7,
        title: 'Kesimpulan & Langkah Selanjutnya',
        mainIdea:
          'Langkah implementasi praktis untuk menerapkan panduan gaya visual ini pada presentasi PowerPoint Anda.',
        summaryPoints: [
          'Gunakan Template pada Proyek Baru',
          'Manfaatkan AI Assistant untuk Regenerasi',
          'Audit Kualitas Desain Berkala',
          'Unduh sebagai PPTX & PDF Siap Pakai',
        ],
        suggestedLayout: 'conclusion',
      },
    ],
    slides: [
      {
        id: 'vsr-sld-1',
        slideNumber: 1,
        title: 'A. Ringkasan Identitas Visual (Visual Identity Summary)',
        subtitle:
          'Analisis karakter visual referensi dan perumusan panduan gaya desain lintas disiplin ilmu',
        layout: 'cover',
        bullets: [
          'Arketipe Desain: Editorial Ilmiah & Arsitektur Informasi Terstruktur',
          'Atmosfer Visual: Profesional, Berbasis Bukti, Presisi, dan Modern',
          'Palet Utama: Deep Slate (#0F172A), Sapphire Accent (#2563EB), dan Soft Surface (#F8FAFC)',
          'Fleksibilitas Lintas Topik: Sangat sesuai untuk Teknologi, Bisnis, Kesehatan, Sains, dan Kebijakan Publik',
        ],
        bodyText:
          'Dokumen ini merangkum analisis gaya visual referensi faktual dan panduan implementasi desain yang dapat diterapkan pada bidang ilmu apa pun tanpa terikat oleh tema materi aslinya.',
        speakerNotes:
          'Slide sampul ini menetapkan tone of voice: analisis desain profesional tingkat lanjut yang membedakan DNA visual dari topik isi.',
        references: [],
        customElements: [],
      },
      {
        id: 'vsr-sld-2',
        slideNumber: 2,
        title: 'B. Analisis Elemen Desain Faktual dari File Referensi',
        subtitle:
          'Hasil pengamatan objektif terhadap elemen visual teramati (Tahap 1)',
        layout: 'table',
        bullets: [
          'Pengamatan dilakukan secara ketat terhadap elemen visual yang dapat diobservasi.',
        ],
        tableData: {
          headers: ['Elemen Desain', 'Hasil Pengamatan Faktual', 'Peran & Dampak Visual'],
          rows: [
            [
              'Palet Warna',
              'Dominasi warna gelap solid (#0F172A) dengan aksen biru sapphire (#2563EB) dan latar netral terang (#FFFFFF)',
              'Menciptakan kontras tinggi yang memudahkan keterbacaan data dan fokus perhatian audiens',
            ],
            [
              'Tipografi',
              'Kombinasi font sans-serif modern (Plus Jakarta Sans) dengan bobot bold tegas pada judul dan regular pada isi',
              'Hierarki teks sangat jelas dengan rasio ukuran judul vs isi sekitar 1.8:1',
            ],
            [
              'Komposisi & Grid',
              'Tata letak multi-kolom teratur dengan pembagian kartu modular (card-based layout) bergaris batas halus',
              'Mengelompokkan informasi padat menjadi unit-unit logis yang mudah dicerna',
            ],
            [
              'Ruang Kosong',
              'Pemberian padding konsisten (16–24px) antar kartu dan margin luar yang proporsional',
              'Mencegah kesan visual yang terlalu sesak meski memuat data analitik yang mendalam',
            ],
            [
              'Ikon & Ornamen',
              'Ikon garis minimalis berukuran 16–20px dengan warna monokrom atau warna aksen sekunder',
              'Berfungsi sebagai penanda visual fungsional tanpa menjadi distraksi dekoratif',
            ],
          ],
        },
        speakerNotes:
          'Seluruh poin dalam tabel ini murni berasal dari observasi faktual file referensi, tanpa asumsi atau fabrikasi elemen yang tidak tampak.',
        references: [],
        customElements: [],
      },
      {
        id: 'vsr-sld-3',
        slideNumber: 3,
        title: 'C. Panduan Visual Style Guide & Aturan Konsistensi',
        subtitle:
          'Sistem perancangan baku yang dapat digunakan lintas topik dan proyek presentasi (Tahap 2)',
        layout: 'process',
        bullets: [
          'Aturan baku untuk memastikan setiap slide yang dibuat memiliki kesatuan visual yang kohesif.',
        ],
        processSteps: [
          {
            step: '01',
            title: 'Sistem Peran Warna',
            detail:
              'Gunakan 60% warna latar bersih (#FFFFFF / #F8FAFC), 30% warna teks utama (#0F172A / #334155), dan 10% warna aksen terarah (#2563EB / #059669).',
          },
          {
            step: '02',
            title: 'Hierarki Tipografi',
            detail:
              'Judul Slide: 24–28pt Bold; Subjudul: 12–14pt Muted; Poin Isi: 11–13pt Regular dengan line-height 1.4–1.5.',
          },
          {
            step: '03',
            title: 'Elemen yang Dipertahankan',
            detail:
              'Pertahankan sistem grid berbasis kartu, garis pemisah halus (opacity 20%), dan aksen visual di sudut atas slide.',
          },
          {
            step: '04',
            title: 'Elemen yang Dihindari',
            detail:
              'Hindari gradasi pelangi yang mencolok, font dekoratif meliuk-liuk, teks bertumpuk tanpa kartu, dan ikon 3D bergaya kartun.',
          },
        ],
        speakerNotes:
          'Style guide ini menjadi acuan tunggal bagi tim desain atau generator AI dalam membangun slide baru.',
        references: [],
        customElements: [],
      },
      {
        id: 'vsr-sld-4',
        slideNumber: 4,
        title: 'D. Adaptasi ke Topik Baru & Master Design Prompt',
        subtitle:
          'Menerapkan DNA visual referensi pada berbagai bidang ilmu tanpa batasan isi (Tahap 3)',
        layout: 'case-study',
        bullets: [
          'Strategi Adaptasi: Pertahankan proporsi grid, palet warna primer, dan rasio tipografi; sesuaikan objek, terminologi, dan ilustrasi dengan topik baru.',
          'Kesesuaian Bidang: Teknologi Informasi (Cloud/AI), Layanan Kesehatan, Ekonomi Finansial, Sains Lingkungan, dan Rencana Bisnis Korporat.',
          'Pemisahan Tegas: DNA visual diambil dari file referensi; materi, narasi, dan data disesuaikan sepenuhnya dengan topik baru Anda.',
        ],
        bodyText:
          'Master Design Prompt: "Rancang presentasi bergaya Editorial Ilmiah Presisi dengan palet Slate (#0F172A) dan Sapphire (#2563EB). Gunakan tata letak kartu modular berbatas tipis, tipografi sans-serif Plus Jakarta Sans berhierarki tegas, ikon garis minimalis, ruang kosong terukur, serta penanda status terverifikasi."',
        speakerNotes:
          'Inilah inti dari permintaan pengguna: kemampuan membawa gaya visual referensi ke topik baru apa pun yang diinginkan.',
        references: [],
        customElements: [],
      },
      {
        id: 'vsr-sld-5',
        slideNumber: 5,
        title: 'E. Arahan Pembuatan Moodboard Visual',
        subtitle:
          'Konsep visual menyeluruh untuk sampul, halaman isi, dan penutup (Tahap 4)',
        layout: 'concept',
        bullets: [
          'Slide Sampul: Latar bersih atau aksen gelap elegan dengan aksen garis vertikal di sebelah kiri judul dan metadata institusi di sudut atas.',
          'Slide Konten: Pembagian 2 atau 3 kolom kartu data, tabel metrik terstruktur, grafik bar dua warna, dan catatan kaki sumber.',
          'Slide Penutup: Ringkasan take-home message dalam kartu sorotan, diikuti informasi kontak dan call-to-action yang tegas.',
          'Elemen Grafis & Motif: Badge penomoran berbingkai halus, kartu berlatar surface color lembut, dan pembatas horizontal subtil.',
        ],
        bodyText:
          'Moodboard ini memberikan panduan visual menyeluruh bagi perancang presentasi untuk menghasilkan presentasi yang tampak berkelas internasional.',
        speakerNotes:
          'Moodboard memastikan desainer memiliki gambaran konkret saat menyusun slide pembuka, pengembang materi, hingga penutup.',
        references: [],
        customElements: [],
      },
      {
        id: 'vsr-sld-6',
        slideNumber: 6,
        title: 'Matriks Evaluasi: Presentasi Biasa vs Sistem Visual Style Guide',
        subtitle: 'Perbandingan kualitas hasil desain presentasi',
        layout: 'comparison',
        bullets: [
          'Perbedaan nyata antara presentasi template acak dengan presentasi yang mengikuti sistem gaya visual terukur.',
        ],
        comparison: {
          leftTitle: 'PRESENTASI GENERIK BIASA',
          leftItems: [
            'Warna acak tanpa aturan peran hierarki',
            'Tipografi tidak konsisten antar slide',
            'Layout penuh sesak tanpa ruang bernapas',
            'Ikon beragam gaya dan ukuran',
            'Teks panjang tanpa struktur kartu logis',
          ],
          rightTitle: 'SISTEM GAYA VISUAL TERUKUR',
          rightItems: [
            'Palet warna terdefinisi dengan rasio 60-30-10',
            'Hierarki font baku dengan kontras ukuran jelas',
            'Grid modular rapi dengan padding teratur',
            'Ikonografi garis seragam dan fungsional',
            'Informasi padat terbagi ke dalam kartu modular',
          ],
        },
        speakerNotes:
          'Perbandingan ini memperjelas mengapa pendekatan Visual Style Reference menghasilkan output yang jauh lebih profesional.',
        references: [],
        customElements: [],
      },
      {
        id: 'vsr-sld-7',
        slideNumber: 7,
        title: 'Kesimpulan & Langkah Selanjutnya',
        subtitle: 'Mulai buat presentasi Anda dengan standar gaya visual ini',
        layout: 'conclusion',
        bullets: [
          'Gaya visual ini kini telah tersimpan sebagai standar dalam AI PPT Studio.',
          'Anda dapat memilih gaya ini saat membuat presentasi baru melalui Wizard Pembuatan Slide.',
          'Gunakan 11 tindakan AI di panel editor untuk menjaga konsistensi gaya saat mengubah isi slide.',
          'Unduh hasil akhir kapan saja sebagai file Microsoft PowerPoint (.pptx) asli atau PDF berkualitas tinggi.',
        ],
        bodyText:
          'AI PPT Studio siap membantu Anda menghasilkan presentasi berkelas dunia secara cepat, presisi, dan aman.',
        speakerNotes:
          'Sebagai penutup, seluruh format A sampai E telah terpenuhi dan siap diunduh atau diterapkan ke proyek berikutnya.',
        references: [],
        customElements: [],
      },
    ],
  },
  {
    id: 'proj-visual-reference-master-deck',
    title: 'Sistem Gaya Visual & Panduan Desain Lintas Topik (Master Deck A–E)',
    topic:
      'Analisis karakter visual referensi (Tahap 1–4) dan perumusan Visual Style Guide (Format A–E) yang fleksibel untuk diadaptasi ke berbagai bidang ilmu dan topik baru.',
    createdAt: '2026-10-19T02:30:00.000Z',
    updatedAt: '2026-10-19T02:55:00.000Z',
    config: {
      title: 'Sistem Gaya Visual & Panduan Desain Lintas Topik (Visual Style Reference)',
      topic:
        'Analisis karakter visual referensi (Tahap 1–4) dan perumusan Visual Style Guide (Format A–E) yang fleksibel untuk diadaptasi ke berbagai bidang ilmu dan topik baru.',
      purpose:
        'Menyediakan hasil analisis elemen desain referensi, panduan Visual Style Guide terukur, pemisahan pengamatan faktual vs rekomendasi kreatif, prompt desain lintas topik, dan konsep moodboard visual.',
      targetAudience:
        'Art Director, Desainer Presentasi, Tim Riset, Konsultan Strategis, dan Pembuat Materi Akademik/Bisnis',
      language: 'id',
      slideCount: 7,
      durationMinutes: 25,
      depthLevel: 'mendalam',
      writingStyle: 'profesional',
      visualStyle: 'Architectural Editorial & Precision Grid',
      aspectRatio: '16:9',
      citationStyle: 'None',
      sourceType: 'visual-reference',
      sourceMaterial:
        'Analisis Visual Style Reference 4 Tahap: (1) Analisis Gaya Visual Faktual, (2) Rumusan Visual Style Guide, (3) Adaptasi ke Topik Baru Lintas Disiplin, (4) Konsep Moodboard Visual (Sampul, Isi, Penutup).',
    },
    theme: {
      ...PRESENTATION_TEMPLATES[7].theme,
      headerText: 'VISUAL STYLE REFERENCE & DESIGN SYSTEM (A–E)',
      footerText: 'Art Direction & Cross-Topic Presentation Style Guide',
      institutionLogoText: 'STYLE GUIDE',
    },
    outline: [
      {
        id: 'vsr-out-1',
        slideNumber: 1,
        title: 'A. Ringkasan Identitas Visual (Visual Identity Summary)',
        mainIdea:
          'Karakteristik utama DNA visual referensi, arketipe desain, atmosfer, serta fleksibilitas penerapan lintas disiplin.',
        summaryPoints: [
          'Arketipe Desain: Swiss Editorial & High-Contrast Precision Grid',
          'Atmosfer Visual: Berwibawa, jernih, terstruktur, dan bebas ornamen berlebihan',
          'Fleksibilitas Lintas Topik: Siap diadaptasi ke teknologi, bisnis, pendidikan, kesehatan, hingga sains',
        ],
        suggestedLayout: 'cover',
      },
      {
        id: 'vsr-out-2',
        slideNumber: 2,
        title: 'B. Analisis Elemen Desain dari File Referensi (Tahap 1)',
        mainIdea:
          'Pemisahan tegas antara hasil pengamatan faktual dari struktur referensi dan pernyataan keterbatasan observasi.',
        summaryPoints: [
          'Pengamatan Palet, Tipografi, Komposisi Grid, dan Proporsi Ruang Kosong (Whitespace)',
          'Karakteristik Visual Sampul (Hero Asimetris) vs Halaman Isi (Modular Bento/Kolom)',
          'Pernyataan Keterbatasan Observasi secara transparan tanpa mengarang elemen fiktif',
        ],
        suggestedLayout: 'table',
      },
      {
        id: 'vsr-out-3',
        slideNumber: 3,
        title: 'C.1 Panduan Visual Style Guide: Palet Warna & Sistem Tipografi (Tahap 2)',
        mainIdea:
          'Spesifikasi kode warna HEX fungsional, rasio kontras, serta skala hierarki tipografi dari judul hingga keterangan data.',
        summaryPoints: [
          'Palet Warna Terukur: Primary Ink (#18181B), Accent Blue (#2563EB), Warm Canvas (#F4F4F5)',
          'Hierarki Tipografi: Plus Jakarta Sans Bold untuk tajuk & JetBrains Mono untuk metrik/kode',
          'Sistem Grid 12 Kolom dengan ruang kosong minimum 30% untuk keterbacaan optimal',
        ],
        suggestedLayout: 'statistics',
      },
      {
        id: 'vsr-out-4',
        slideNumber: 4,
        title: 'C.2 Aturan Konsistensi: Dipertahankan, Disesuaikan & Dihindari',
        mainIdea:
          'Pedoman tata kelola visual agar karakter desain referensi tetap utuh saat berpindah ke topik baru.',
        summaryPoints: [
          'Dipertahankan (DNA Visual): Struktur grid, kontras tipografi, garis batas 1px, dan ritme ruang kosong',
          'Disesuaikan (Konten Baru): Objek fotografi, subjek ilustrasi, terminologi, dan metrik data',
          'Dihindari (Anti-Pattern): Menyalin objek tematik lama yang tidak relevan atau mencampur lebih dari 3 warna aksen',
        ],
        suggestedLayout: 'comparison',
      },
      {
        id: 'vsr-out-5',
        slideNumber: 5,
        title: 'D. Adaptasi ke Topik Baru & Pemisahan Pengamatan vs Rekomendasi (Tahap 3)',
        mainIdea:
          'Matriks adaptasi gaya visual ke berbagai bidang (Teknologi, Bisnis, Pendidikan, Kesehatan, Lingkungan, Budaya).',
        summaryPoints: [
          'Membedakan pengamatan objektif file referensi dengan rekomendasi kreatif topik baru',
          'Adaptasi ikonografi, diagram, dan fotografi sesuai domain topik target',
          'Menjaga DNA struktur halaman tanpa terikat pada isi materi asli',
        ],
        suggestedLayout: 'process',
      },
      {
        id: 'vsr-out-6',
        slideNumber: 6,
        title: 'D.2 Prompt Desain Siap Pakai untuk Topik Baru (Ready-to-Use Design Prompt)',
        mainIdea:
          'Template prompt terstruktur yang siap ditempelkan atau dijalankan untuk menghasilkan slide pada topik apa pun.',
        summaryPoints: [
          'Formula Prompt Desain: [Peran Art Director] + [DNA Visual Referensi] + [Variabel Topik Baru]',
          'Instruksi komposisi sampul, halaman isi analitis, dan visualisasi data',
          'Kontrol negatif (Negative Constraints) agar bebas dari klise desain generik',
        ],
        suggestedLayout: 'concept',
      },
      {
        id: 'vsr-out-7',
        slideNumber: 7,
        title: 'E. Arahan Pembuatan Moodboard Visual: Sampul, Isi & Penutup (Tahap 4)',
        mainIdea:
          'Blueprint komposisi moodboard untuk halaman sampul (Cover), halaman isi (Content), dan penutup (Closing).',
        summaryPoints: [
          'Sampul: Tipografi fokus kiri dengan aksen vertikal tegas dan ruang bernapas luas',
          'Halaman Isi: Header terstruktur, kartu permukaan bersih, dan diagram vektor monoline',
          'Penutup: Ringkasan eksekutif kontras tinggi dengan penanda identitas institusi',
        ],
        suggestedLayout: 'timeline',
      },
    ],
    slides: [
      {
        id: 'vsr-sld-1',
        slideNumber: 1,
        title: 'A. Ringkasan Identitas Visual (Visual Style Reference)',
        subtitle:
          'Sistem Gaya Desain Fleksibel & Konsisten untuk Adaptasi Lintas Topik (Teknologi, Bisnis, Pendidikan, Kesehatan, Sains & Budaya)',
        layout: 'cover',
        bullets: [
          'Arketipe Gaya: Swiss Editorial Modernism & High-Precision Information Architecture',
          'Karakteristik Inti: Kontras tipografi tegas, grid modular terukur, garis pembatas 1px (hairline), dan ruang kosong fungsional',
          'Prinsip Utama: Mempertahankan DNA visual referensi sepenuhnya sambil menyesuaikan objek, ilustrasi, dan narasi pada topik baru',
        ],
        bodyText:
          'Dokumen presentasi ini merangkum hasil Analisis Gaya Visual (Tahap 1), Rumusan Visual Style Guide (Tahap 2), Strategi Adaptasi Lintas Topik (Tahap 3), serta Arahan Moodboard Visual (Tahap 4) dalam format terstruktur A sampai E.',
        visualSuggestion: {
          type: 'diagram',
          description:
            'Komposisi sampul editorial dengan blok aksen struktural di sisi kiri, tipografi bold bertingkat, dan penanda kode warna HEX.',
        },
        customElements: [],
        speakerNotes:
          'Slide pembuka ini menyajikan Bagian A (Ringkasan Identitas Visual). Fokus utama kita adalah mengekstrak DNA desain dari referensi visual sehingga dapat diterapkan secara konsisten pada topik apa pun tanpa terjebak pada tema isi file aslinya.',
        references: [],
      },
      {
        id: 'vsr-sld-2',
        slideNumber: 2,
        title: 'B. Analisis Elemen Desain dari File Referensi (Tahap 1)',
        subtitle:
          'Pengamatan objektif terhadap elemen visual terukur serta pencatatan jujur atas keterbatasan observasi file',
        layout: 'table',
        bullets: [
          'Observasi Faktual: Mengamati palet warna, hierarki teks, kepadatan informasi, dan ritme tata letak secara langsung tanpa spekulasi',
          'Keterbatasan Observasi: Jika file referensi berupa dokumen teks atau tidak memuat metadata font/gambar tertanam, keterbatasan dinyatakan secara eksplisit',
        ],
        tableData: {
          headers: [
            'Dimensi Desain',
            'Hasil Pengamatan Faktual dari Referensi',
            'Catatan & Batasan Observasi',
          ],
          rows: [
            [
              'Karakter & Komposisi',
              'Tata letak asimetris terstruktur dengan pembagian kolom jelas dan alur baca kiri-ke-kanan.',
              'Teramati langsung dari struktur tata letak halaman.',
            ],
            [
              'Palet Warna & Latar',
              'Dominasi latar netral terang (#F4F4F5 / #FFFFFF) dengan teks arang gelap (#18181B) dan aksen biru fokus (#2563EB).',
              'Kode HEX diekstrak dari skema tema / pengamatan langsung.',
            ],
            [
              'Tipografi & Hierarki',
              '3 tingkat hierarki tegas: Judul utama tebal (26–32pt), Subjudul kontekstual (14–16pt), dan Isi ringkas (12–13pt).',
              'Menggunakan keluarga Sans-Serif geometris modern & Monospace untuk label angka.',
            ],
            [
              'Ruang Kosong & Ornamen',
              'Rasio whitespace 30%–35% per halaman; minim ornamen dekoratif, mengandalkan garis tepi tipis 1px.',
              'Tidak ditemukan tekstur latar berat yang mengganggu keterbacaan.',
            ],
            [
              'Fotografi, Ilustrasi & Ikon',
              'Mengutamakan diagram konseptual, kartu metrik, dan ikon garis (monoline stroke) yang bersih.',
              'Objek visual spesifik pada file asli dikategorikan sebagai elemen yang wajib disesuaikan dengan topik baru.',
            ],
          ],
        },
        visualSuggestion: {
          type: 'table',
          description:
            'Tabel matriks audit elemen visual yang memisahkan hasil pengamatan faktual dari catatan keterbatasan pembacaan.',
        },
        customElements: [],
        speakerNotes:
          'Pada Bagian B (Tahap 1), kita mendokumentasikan apa yang benar-benar terlihat dari referensi visual dan menyatakan keterbatasan observasi secara jujur tanpa mengarang elemen yang tidak dapat diamati.',
        references: [],
      },
      {
        id: 'vsr-sld-3',
        slideNumber: 3,
        title: 'C.1 Panduan Visual Style Guide: Palet Warna & Tipografi (Tahap 2)',
        subtitle:
          'Spesifikasi kuantitatif untuk menjaga keseragaman kontras, keterbacaan, dan struktur ruang pada seluruh slide',
        layout: 'statistics',
        bullets: [
          'Palet Utama & Permukaan: Latar #F4F4F5, Kartu Permukaan #FFFFFF, Teks Utama #18181B, Teks Sekunder #71717A',
          'Warna Aksen Fungsional: Biru Utama #2563EB (60% permukaan netral, 30% struktur tipografi, 10% aksen fokus)',
          'Rekomendasi Font: Plus Jakarta Sans / DM Sans untuk narasi utama, dipadukan dengan JetBrains Mono untuk indeks numerik',
        ],
        statCards: [
          {
            value: '60 : 30 : 10',
            label: 'Rasio Distribusi Warna',
            context: '60% Latar Netral (#F4F4F5/#FFFFFF), 30% Teks & Struktur (#18181B), 10% Aksen Utama (#2563EB)',
          },
          {
            value: '≥ 30% Area',
            label: 'Standar Ruang Kosong (Whitespace)',
            context: 'Menjaga margin tepi kanvas dan jarak antar-kartu agar slide tidak terasa penuh atau sesak',
          },
          {
            value: '3 Tingkat',
            label: 'Skala Hierarki Tipografi',
            context: 'Judul Slide (28pt Bold), Subjudul/Gagasan Inti (15pt Medium), Poin & Data (13pt Regular)',
          },
        ],
        visualSuggestion: {
          type: 'stat-cards',
          description:
            'Tiga kartu metrik spesifikasi Visual Style Guide menampilkan rasio warna 60:30:10, persentase whitespace, dan hierarki font.',
        },
        customElements: [],
        speakerNotes:
          'Bagian C merumuskan Visual Style Guide yang konkret dan terukur, mulai dari kode warna HEX hingga proporsi ruang kosong.',
        references: [],
      },
      {
        id: 'vsr-sld-4',
        slideNumber: 4,
        title: 'C.2 Aturan Konsistensi: Dipertahankan vs Disesuaikan vs Dihindari',
        subtitle:
          'Pedoman operasional ketika menerapkan gaya desain referensi ke bidang ilmu atau topik yang sama sekali baru',
        layout: 'comparison',
        bullets: [
          'Elemen yang Dihindari (Anti-Pattern): Jangan menyalin foto/istilah dari topik lama, jangan memakai gradien neon yang tidak ada di referensi, dan hindari paragraf dinding teks (>5 baris)',
        ],
        comparison: {
          leftTitle: 'DIPERTAHANKAN (DNA Visual Referensi)',
          leftItems: [
            'Proporsi tata letak, sistem grid, dan penempatan judul rata kiri yang konsisten',
            'Skema palet warna HEX, rasio kontras tinggi, dan penggunaan garis batas tipis 1px',
            'Gaya ikon monoline, sudut kartu terukur, serta penomoran indeks berformat tabular (01, 02, 03)',
            'Karakter kontras antara halaman Sampul yang berani dan halaman Isi yang analitis',
          ],
          rightTitle: 'DISESUAIKAN (Adaptasi Topik Baru)',
          rightItems: [
            'Subjek fotografi, ilustrasi, dan studi kasus disesuaikan 100% dengan domain topik baru',
            'Jenis visualisasi data (grafik batang, linimasa sejarah, diagram alir klinis/bisnis) mengikuti sifat data baru',
            'Terminologi header, footer, dan label kategori mengikuti konteks audiens baru',
            'Simbol atau metafora visual disesuaikan tanpa mengubah gaya goresan/estetika dasarnya',
          ],
        },
        visualSuggestion: {
          type: 'comparison',
          description:
            'Matriks dua kolom yang membandingkan elemen DNA visual yang wajib dipertahankan dengan elemen konten yang wajib disesuaikan pada topik baru.',
        },
        customElements: [],
        speakerNotes:
          'Slide ini memperjelas batas antara DNA visual yang harus dijaga dan elemen tematik yang harus diganti saat berpindah topik.',
        references: [],
      },
      {
        id: 'vsr-sld-5',
        slideNumber: 5,
        title: 'D.1 Strategi Adaptasi Lintas Topik: Pengamatan vs Rekomendasi Kreatif (Tahap 3)',
        subtitle:
          'Memisahkan hasil pengamatan dari file referensi dengan rekomendasi kreatif untuk berbagai topik baru',
        layout: 'process',
        bullets: [
          'Hasil Pengamatan Referensi: Struktur kartu modular, tipografi sans-serif bersih, dan aksen warna terfokus',
          'Rekomendasi Kreatif Topik Baru: Mengganti objek visual sesuai disiplin ilmu tanpa merusak proporsi dan tata cahaya referensi',
        ],
        processSteps: [
          {
            step: '01',
            title: 'Teknologi, Sains & AI',
            detail:
              'Pertahankan grid presisi & palet referensi; ganti ilustrasi dengan diagram arsitektur sistem, topologi jaringan, atau visualisasi molekul.',
          },
          {
            step: '02',
            title: 'Bisnis, Ekonomi & Keuangan',
            detail:
              'Pertahankan hierarki tipografi & kartu metrik; sesuaikan isi dengan grafik tren pasar, matriks kompetitif, dan indikator ROI.',
          },
          {
            step: '03',
            title: 'Pendidikan, Sejarah & Budaya',
            detail:
              'Pertahankan ruang kosong & tata letak editorial; ganti visual dengan linimasa kronologis, peta konsep pedagogis, atau dokumentasi artefak.',
          },
          {
            step: '04',
            title: 'Kesehatan & Lingkungan',
            detail:
              'Pertahankan kebersihan kanvas & kontras teks; gunakan alur protokol klinis, diagram siklus ekologis, atau statistik dampak lingkungan.',
          },
        ],
        visualSuggestion: {
          type: 'diagram',
          description:
            'Alur 4 domain adaptasi lintas topik yang menunjukkan bagaimana satu DNA visual yang sama diterapkan pada Teknologi, Bisnis, Pendidikan/Budaya, dan Kesehatan/Lingkungan.',
        },
        customElements: [],
        speakerNotes:
          'Pada Tahap 3, kita membuktikan bagaimana satu sistem gaya visual dapat diterapkan lintas topik dari teknologi hingga sejarah dan lingkungan.',
        references: [],
      },
      {
        id: 'vsr-sld-6',
        slideNumber: 6,
        title: 'D.2 Prompt Desain Siap Pakai untuk Topik Baru (Master Design Prompt)',
        subtitle:
          'Salin dan gunakan prompt desain di bawah ini untuk menghasilkan presentasi pada topik baru apa pun dengan DNA visual yang identik',
        layout: 'concept',
        bullets: [
          'PROMPT DESAIN SIAP PAKAI: "Bertindaklah sebagai Art Director. Buat desain slide presentasi untuk topik [MASUKKAN TOPIK BARU] dengan mempertahankan DNA Visual berikut: latar belakang netral bersih (#F4F4F5 / #FFFFFF), tipografi utama Sans-Serif tegas berwarna #18181B dengan aksen fungsional #2563EB, sistem grid modular dengan ruang kosong minimal 30%, serta garis pembatas tipis 1px."',
          'INSTRUKSI VISUAL & OBJEK: "Gunakan ilustrasi vektor bersih / diagram terstruktur yang relevan langsung dengan [MASUKKAN TOPIK BARU]. Jangan menyertakan objek atau elemen tematik dari materi lama."',
          'STRUKTUR HALAMAN: "Gunakan komposisi asimetris berani pada Sampul, tata letak kartu/tabel terukur pada Halaman Isi, dan ringkasan eksekutif berfokus tindakan pada Halaman Penutup."',
        ],
        bodyText:
          'Catatan Pemisahan: Struktur grid, rasio warna 60:30:10, dan skala tipografi di atas berasal dari pengamatan referensi visual, sedangkan pemilihan diagram/ilustrasi spesifik merupakan rekomendasi kreatif yang menyesuaikan topik baru Anda.',
        visualSuggestion: {
          type: 'illustration',
          description:
            'Kotak spesifikasi Master Design Prompt dengan variabel [TOPIK BARU] yang siap diadaptasi ke bidang apa pun.',
        },
        customElements: [],
        speakerNotes:
          'Bagian D menyediakan prompt desain siap pakai yang memisahkan aturan baku dari referensi dengan variabel topik baru.',
        references: [],
      },
      {
        id: 'vsr-sld-7',
        slideNumber: 7,
        title: 'E. Arahan Pembuatan Moodboard Visual: Sampul, Isi & Penutup (Tahap 4)',
        subtitle:
          'Panduan komposisi visual terpadu untuk menjaga kohesi dari slide pertama hingga slide penutup',
        layout: 'timeline',
        bullets: [
          'Identitas Moodboard: Perpaduan presisi arsitektural, palet terukur, ikon monoline 1.5px, dan fokus keterbacaan instan',
          'Konsistensi Lintas Halaman: Header, nomor indeks tabular, dan posisi judul dijaga tetap presisi di seluruh deck',
        ],
        timelineItems: [
          {
            period: '01. SAMPUL (COVER)',
            event: 'Komposisi Hero Editorial & Penegas Identitas',
            impact:
              'Judul ukuran besar (28–34pt) rata kiri, subjudul kontras, bar aksen vertikal #2563EB, serta blok metadata institusi/topik yang bersih tanpa keramaian visual.',
          },
          {
            period: '02. HALAMAN ISI (CONTENT)',
            event: 'Grid Modular, Kartu Data & Diagram Fungsional',
            impact:
              'Maksimal 3–4 poin utama per slide, dipadukan dengan tabel, perbandingan 2 kolom, atau kartu statistik di atas permukaan #FFFFFF dengan ruang kosong ≥30%.',
          },
          {
            period: '03. PENUTUP (CLOSING)',
            event: 'Sintesis Eksekutif & Penekanan Pesan Kunci',
            impact:
              'Menampilkan 3 kesimpulan utama yang dapat ditindaklanjuti (actionable takeaways), ringkasan dampak, dan identitas penutup yang selaras dengan sampul.',
          },
        ],
        visualSuggestion: {
          type: 'timeline',
          description:
            'Peta komposisi Moodboard Visual 3 bagian: Struktur Sampul (Cover), Halaman Isi (Content), dan Halaman Penutup (Closing).',
        },
        customElements: [],
        speakerNotes:
          'Slide terakhir ini menyajikan Bagian E (Arahan Moodboard Visual) yang merinci penerapan gaya pada sampul, halaman isi, dan penutup. Anda dapat langsung mengunduh deck ini sebagai PPTX/PDF atau mengunggah file referensi Anda sendiri di menu Buat Presentasi.',
        references: [],
      },
    ],
  },
  {
    id: 'proj-sample-ai-kesehatan',
    title: 'Transformasi AI Diagnostik dalam Layanan Kesehatan Primer',
    topic: 'Implementasi sistem pendukung keputusan klinis berbasis kecerdasan buatan pada fasilitas kesehatan tingkat pertama di Indonesia.',
    createdAt: '2026-10-18T09:00:00.000Z',
    updatedAt: '2026-10-19T01:15:00.000Z',
    config: {
      title: 'Transformasi AI Diagnostik dalam Layanan Kesehatan Primer',
      topic: 'Implementasi sistem pendukung keputusan klinis berbasis kecerdasan buatan pada fasilitas kesehatan tingkat pertama di Indonesia.',
      purpose: 'Memberikan kerangka evaluasi klinis, kesiapan infrastruktur, dan tata kelola etika penggunaan AI medis.',
      targetAudience: 'Kementerian Kesehatan, Direktur RS, dan Peneliti Informatika Medis',
      language: 'id',
      slideCount: 6,
      durationMinutes: 20,
      depthLevel: 'mendalam',
      writingStyle: 'akademik',
      visualStyle: 'Teknis & Berbasis Bukti',
      aspectRatio: '16:9',
      citationStyle: 'APA',
      sourceType: 'topic',
      sourceMaterial: 'Evaluasi kesiapan infrastruktur telemedisin dan AI triase klinis pada Puskesmas dan klinik pratama.',
    },
    theme: { ...PRESENTATION_TEMPLATES[1].theme },
    outline: [
      {
        id: 'out-1',
        slideNumber: 1,
        title: 'Transformasi AI Diagnostik dalam Layanan Kesehatan Primer',
        mainIdea: 'Pembukaan dan konteks strategis integrasi AI klinis di fasilitas kesehatan tingkat pertama.',
        summaryPoints: ['Urgensi pemerataan akses diagnostik', 'Peran Clinical Decision Support System (CDSS)', 'Fokus keamanan pasien & regulasi'],
        suggestedLayout: 'cover',
      },
      {
        id: 'out-2',
        slideNumber: 2,
        title: 'Tantangan Layanan Primer & Peluang Intervensi AI',
        mainIdea: 'Membandingkan kondisi layanan konvensional dengan alur kerja berbantuan AI.',
        summaryPoints: ['Rasio beban kerja tenaga medis', 'Kecepatan triase awal dan deteksi dini', 'Standarisasi rujukan berjenjang'],
        suggestedLayout: 'comparison',
      },
      {
        id: 'out-3',
        slideNumber: 3,
        title: 'Alur Kerja Integrasi CDSS pada Fasilitas Kesehatan',
        mainIdea: 'Tahapan operasional dari anamnesis pasien hingga verifikasi dokter penanggung jawab.',
        summaryPoints: ['Akuisisi data rekam medis elektronik', 'Inferensi model & skor risiko', 'Validasi klinis oleh dokter (Human-in-the-Loop)'],
        suggestedLayout: 'process',
      },
      {
        id: 'out-4',
        slideNumber: 4,
        title: 'Evaluasi Metrik Kinerja & Efisiensi Operasional',
        mainIdea: 'Ringkasan indikator kunci berdasarkan studi percontohan klinik.',
        summaryPoints: ['Penurunan waktu tunggu triase', 'Akurasi kesesuaian rujukan', 'Tingkat adopsi tenaga kesehatan'],
        suggestedLayout: 'statistics',
      },
      {
        id: 'out-5',
        slideNumber: 5,
        title: 'Peta Jalan Implementasi & Tata Kelola Etika',
        mainIdea: 'Linimasa bertahap untuk adopsi aman dan patuh regulasi pelindungan data pribadi.',
        summaryPoints: ['Fase I: Standarisasi RME & Anonimisasi', 'Fase II: Uji Klinis Terbatas (Sandbox)', 'Fase III: Audit Algoritmik Berkala'],
        suggestedLayout: 'timeline',
      },
      {
        id: 'out-6',
        slideNumber: 6,
        title: 'Daftar Pustaka & Catatan Verifikasi Sumber',
        mainIdea: 'Rujukan literatur regulasi dan pedoman informatika kesehatan.',
        summaryPoints: ['Pedoman WHO terkait etika AI kesehatan', 'Regulasi Rekam Medis Elektronik nasional', 'Literatur evaluasi CDSS'],
        suggestedLayout: 'references',
      },
    ],
    slides: [
      {
        id: 'sld-1',
        slideNumber: 1,
        title: 'Transformasi AI Diagnostik dalam Layanan Kesehatan Primer',
        subtitle: 'Kerangka Implementasi Clinical Decision Support System (CDSS) yang Aman, Terukur, dan Berpusat pada Pasien',
        layout: 'cover',
        bullets: [
          'Pemerataan kualitas skrining awal di Fasilitas Kesehatan Tingkat Pertama (FKTP)',
          'Pendekatan Human-in-the-Loop: AI sebagai asisten analisis, dokter sebagai pengambil keputusan akhir',
          'Kepatuhan penuh terhadap standar Rekam Medis Elektronik (RME) dan pelindungan data medis',
        ],
        bodyText: 'Presentasi kajian strategis mengenai integrasi kecerdasan buatan dalam mendukung ketepatan triase dan efisiensi rujukan klinis.',
        visualSuggestion: {
          type: 'illustration',
          description: 'Ilustrasi skema integrasi rekam medis elektronik dengan panel asistensi klinis dokter.',
        },
        customElements: [],
        speakerNotes: 'Selamat pagi/siang Bapak dan Ibu. Pada sesi ini kita akan membahas secara komprehensif bagaimana sistem pendukung keputusan klinis berbasis AI dapat memperkuat layanan kesehatan primer tanpa menggantikan otonomi klinis dokter.',
        references: [],
      },
      {
        id: 'sld-2',
        slideNumber: 2,
        title: 'Perbandingan Alur Triase Konvensional vs Berbantuan CDSS',
        subtitle: 'Mengatasi kendala beban administratif dan variasi dokumentasi klinis pada layanan primer',
        layout: 'comparison',
        bullets: [
          'Standarisasi pemeriksaan gejala awal berbasis pedoman praktik klinis nasional',
          'Peringatan dini interaksi obat (drug-to-drug interaction) secara otomatis',
        ],
        comparison: {
          leftTitle: 'Layanan Primer Konvensional',
          leftItems: [
            'Pencatatan anamnesis manual memakan waktu 8–12 menit per pasien',
            'Pemeriksaan riwayat alergi dan kontraindikasi obat dilakukan secara terpisah',
            'Variasi protokol rujukan antar fasilitas kesehatan tingkat pertama',
          ],
          rightTitle: 'Layanan Terintegrasi AI CDSS',
          rightItems: [
            'Ringkasan riwayat klinis otomatis tersaji dalam waktu kurang dari 30 detik',
            'Deteksi otomatis potensi kontraindikasi resep secara real-time',
            'Rekomendasi rujukan terstandar sesuai pedoman klinis nasional',
          ],
        },
        visualSuggestion: {
          type: 'comparison',
          description: 'Matriks dua kolom yang membandingkan alur triase manual dengan alur terintegrasi CDSS.',
        },
        customElements: [],
        speakerNotes: 'Pada slide kedua ini, kita melihat perbedaan mendasar antara alur konvensional dan alur yang diperkuat oleh CDSS. Fokus utamanya adalah memangkas beban administratif sehingga waktu konsultasi dokter-pasien menjadi lebih berkualitas.',
        references: [
          {
            id: 'ref-s2-1',
            citation: 'World Health Organization (WHO). (2021). Ethics and governance of artificial intelligence for health.',
            url: 'https://www.who.int/publications/i/item/9789240029200',
            verified: true,
            verificationNote: 'Dokumen pedoman resmi WHO mengenai tata kelola AI kesehatan.',
          },
        ],
      },
      {
        id: 'sld-3',
        slideNumber: 3,
        title: 'Arsitektur Alur Kerja Integrasi CDSS (Human-in-the-Loop)',
        subtitle: 'Empat tahapan verifikasi berlapis untuk menjamin keselamatan pasien',
        layout: 'process',
        bullets: [
          'Setiap rekomendasi model wajib menampilkan alasan klinis (explainable output)',
          'Dokter memiliki wewenang penuh untuk menerima, memodifikasi, atau menolak saran sistem',
        ],
        processSteps: [
          {
            step: '01',
            title: 'Input RME Terstruktur',
            detail: 'Perawat dan dokter memasukkan tanda vital, keluhan utama, dan riwayat medis ke dalam sistem RME.',
          },
          {
            step: '02',
            title: 'Analisis & Stratifikasi Risiko',
            detail: 'Mesin CDSS mengevaluasi pola gejala terhadap pedoman klinis dan menandai bendera risiko merah (red flags).',
          },
          {
            step: '03',
            title: 'Verifikasi Dokter (HITL)',
            detail: 'Dokter meninjau saran diferensial beserta bukti pendukung sebelum menetapkan diagnosis akhir.',
          },
          {
            step: '04',
            title: 'Umpan Balik & Audit Log',
            detail: 'Keputusan tercatat di jejak audit klinis untuk evaluasi mutu berkala dan kalibrasi sistem.',
          },
        ],
        visualSuggestion: {
          type: 'diagram',
          description: 'Diagram alir 4 tahap dari input RME hingga jejak audit klinis.',
        },
        customElements: [],
        speakerNotes: 'Prinsip terpenting dalam arsitektur ini adalah Human-in-the-Loop pada tahap ke-3. Sistem tidak pernah mengeluarkan resep atau diagnosis langsung ke pasien tanpa otorisasi dokter.',
        references: [],
      },
      {
        id: 'sld-4',
        slideNumber: 4,
        title: 'Indikator Sasaran Mutu & Efisiensi Layanan',
        subtitle: 'Target terukur pada evaluasi percontohan integrasi RME dan asisten klinis',
        layout: 'statistics',
        bullets: [
          'Pengukuran dilakukan melalui audit waktu tunggu poli umum dan kelengkapan kode ICD-10',
          'Evaluasi keselamatan berfokus pada pencegahan kesalahan peresepan (medication error)',
        ],
        statCards: [
          {
            value: '-35%',
            label: 'Durasi Administrasi RME',
            context: 'Target pengurangan waktu ketik dokumentasi medis per kunjungan pasien',
          },
          {
            value: '99.2%',
            label: 'Kelengkapan Kode ICD-10',
            context: 'Konsistensi pengodean diagnosis untuk klaim dan pelaporan epidemiologi',
          },
          {
            value: '100%',
            label: 'Otorisasi Dokter (HITL)',
            context: 'Seluruh rekomendasi klinis wajib melewati persetujuan eksplisit tenaga medis',
          },
        ],
        chartData: {
          chartType: 'bar',
          title: 'Alokasi Waktu Konsultasi (Menit per Pasien)',
          labels: ['Dokumentasi Manual', 'Dokumentasi + CDSS', 'Edukasi Pasien (Manual)', 'Edukasi Pasien (+CDSS)'],
          values: [9.5, 4.2, 4.0, 8.5],
          unit: 'Menit',
          sourceNote: 'Simulasi alokasi waktu layanan poli umum (15 menit/pasien)',
        },
        visualSuggestion: {
          type: 'stat-cards',
          description: 'Tiga kartu KPI utama disandingkan dengan grafik batang alokasi waktu konsultasi.',
        },
        customElements: [],
        speakerNotes: 'Perhatikan bagaimana pengurangan waktu dokumentasi dari 9,5 menit menjadi 4,2 menit memungkinkan waktu edukasi langsung kepada pasien meningkat lebih dari dua kali lipat.',
        references: [],
      },
      {
        id: 'sld-5',
        slideNumber: 5,
        title: 'Peta Jalan Implementasi & Tata Kelola Regulasi',
        subtitle: 'Tahapan adopsi bertahap selama 12 bulan dengan pengawasan mutu klinis',
        layout: 'timeline',
        bullets: [
          'Mengutamakan kesiapan interoperabilitas standar FHIR/HL7 sebelum aktivasi modul AI',
          'Audit bias algoritmik wajib dilakukan pada populasi demografis lokal',
        ],
        timelineItems: [
          {
            period: 'Kuartal 1',
            event: 'Standarisasi Data & Interoperabilitas RME',
            impact: 'Harmonisasi format input klinis, kode ICD-10, dan enkripsi data pasien.',
          },
          {
            period: 'Kuartal 2',
            event: 'Uji Coba Terbatas (Clinical Sandbox)',
            impact: 'Validasi bayangan (shadow mode) di 15 FKTP percontohan bersama komite medis.',
          },
          {
            period: 'Kuartal 3',
            event: 'Pelatihan Tenaga Medis & Integrasi Aktif',
            impact: 'Onboarding dokter umum dan perawat terkait literasi AI klinis dan protokol eskalasi.',
          },
          {
            period: 'Kuartal 4',
            event: 'Audit Mutu, Keamanan & Perluasan Nasional',
            impact: 'Evaluasi dampak klinis tahunan dan pembaruan pedoman tata kelola.',
          },
        ],
        visualSuggestion: {
          type: 'timeline',
          description: 'Linimasa horizontal 4 kuartal dari standarisasi data hingga audit nasional.',
        },
        customElements: [],
        speakerNotes: 'Kita tidak langsung melompat ke deployment penuh. Kuartal pertama dan kedua didedikasikan untuk fondasi data RME dan pengujian shadow-mode agar akurasi benar-benar teruji di lapangan.',
        references: [],
      },
      {
        id: 'sld-6',
        slideNumber: 6,
        title: 'Daftar Pustaka & Status Verifikasi Referensi',
        subtitle: 'Transparansi sumber ilmiah dan regulasi yang digunakan dalam penyusunan materi',
        layout: 'references',
        bullets: [
          'Sumber dengan status Terverifikasi telah diperiksa kesesuaian dokumen aslinya',
          'Sumber berstatus Perlu Diverifikasi memerlukan pengecekan lanjutan oleh penyusun',
        ],
        tableData: {
          headers: ['Sumber / Pedoman', 'Kategori', 'Status Verifikasi'],
          rows: [
            ['WHO (2021) Ethics and Governance of AI for Health', 'Pedoman Global', 'Terverifikasi'],
            ['Peraturan Menteri Kesehatan RI No. 24 Tahun 2022 tentang Rekam Medis', 'Regulasi Nasional', 'Terverifikasi'],
            ['Sutton, R. T., et al. (2020). An overview of clinical decision support systems. npj Digital Medicine.', 'Jurnal Ilmiah', 'Terverifikasi'],
          ],
        },
        visualSuggestion: {
          type: 'table',
          description: 'Tabel daftar pustaka dengan indikator status verifikasi referensi.',
        },
        customElements: [],
        speakerNotes: 'Sebagai penutup, seluruh klaim regulasi dan kerangka etika pada presentasi ini merujuk pada pedoman resmi WHO serta Permenkes No. 24 Tahun 2022 mengenai Rekam Medis Elektronik. Terima kasih.',
        references: [
          {
            id: 'ref-1',
            citation: 'World Health Organization. (2021). Ethics and governance of artificial intelligence for health. WHO Press.',
            url: 'https://www.who.int/publications/i/item/9789240029200',
            verified: true,
            verificationNote: 'Pedoman resmi WHO.',
          },
          {
            id: 'ref-2',
            citation: 'Kementerian Kesehatan Republik Indonesia. (2022). Peraturan Menteri Kesehatan Nomor 24 Tahun 2022 tentang Rekam Medis.',
            verified: true,
            verificationNote: 'Regulasi RME nasional Indonesia.',
          },
          {
            id: 'ref-3',
            citation: 'Sutton, R. T., Pincock, D., Baumgart, D. C., Sadowski, D. C., Fedorak, R. N., & Kroeker, K. I. (2020). An overview of clinical decision support systems: benefits, risks, and strategies for success. npj Digital Medicine, 3(1), 17.',
            verified: true,
            verificationNote: 'Publikasi peer-reviewed npj Digital Medicine.',
          },
        ],
      },
    ],
  },
];
