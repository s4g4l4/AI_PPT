import { PresentationProject, QualityIssue } from '../types/presentation';

export function analyzePresentationQuality(project: PresentationProject): QualityIssue[] {
  const issues: QualityIssue[] = [];
  if (!project || !Array.isArray(project.slides)) return issues;

  const titleCounts = new Map<string, number[]>();

  project.slides.forEach((slide, idx) => {
    const slideNum = idx + 1;
    const normTitle = (slide.title || '').trim().toLowerCase();
    if (normTitle) {
      const arr = titleCounts.get(normTitle) || [];
      arr.push(slideNum);
      titleCounts.set(normTitle, arr);
    }

    // 1. Check Slide Density (terlalu padat)
    const bulletText = (slide.bullets || []).join(' ');
    const totalWords = `${slide.title} ${slide.subtitle || ''} ${bulletText} ${
      slide.bodyText || ''
    }`
      .trim()
      .split(/\s+/)
      .filter(Boolean).length;

    if ((slide.bullets && slide.bullets.length > 6) || totalWords > 115) {
      issues.push({
        id: `q-density-${slide.id}`,
        slideId: slide.id,
        slideNumber: slideNum,
        severity: 'warning',
        category: 'density',
        title: `Slide ${slideNum} terlalu padat (${totalWords} kata, ${slide.bullets?.length || 0} poin)`,
        description:
          'Slide dengan lebih dari 6 poin atau lebih dari 115 kata berisiko menurunkan keterbacaan audiens.',
        suggestion:
          'Gunakan AI Tool "Ringkas teks" atau pecah isi slide ini menjadi dua slide terpisah.',
      });
    }

    // 2. Check Small Font Size Risk
    if (
      (slide.titleFontSize && slide.titleFontSize < 18) ||
      (slide.bodyFontSize && slide.bodyFontSize < 12)
    ) {
      issues.push({
        id: `q-font-${slide.id}`,
        slideId: slide.id,
        slideNumber: slideNum,
        severity: 'warning',
        category: 'font-size',
        title: `Ukuran teks pada Slide ${slideNum} berpotensi terlalu kecil`,
        description:
          'Ukuran font judul di bawah 18pt atau isi di bawah 12pt sulit dibaca dari jarak ruang rapat/kelas.',
        suggestion: 'Tingkatkan ukuran font judul minimal 22pt dan teks isi minimal 14pt di panel kanan.',
      });
    }

    // 3. Check Out-of-Bounds / Overflowing Custom Elements
    if (Array.isArray(slide.customElements)) {
      slide.customElements.forEach((el) => {
        if (el.x < 0 || el.y < 0 || el.x + el.width > 100 || el.y + el.height > 100) {
          issues.push({
            id: `q-oob-${slide.id}-${el.id}`,
            slideId: slide.id,
            slideNumber: slideNum,
            severity: 'critical',
            category: 'out-of-bounds',
            title: `Elemen kustom melampaui batas kanvas pada Slide ${slideNum}`,
            description: `Elemen "${el.content?.slice(0, 24) || el.type}" berada di posisi (${el.x}%, ${el.y}%) dengan ukuran (${el.width}% × ${el.height}%).`,
            suggestion:
              'Sesuaikan koordinat X/Y atau lebar/tinggi elemen di panel properti kanan agar tidak terpotong saat diekspor.',
          });
        }
      });
    }

    // 4. Check Unverified Factual/Statistical Claims
    const combinedContent = `${bulletText} ${slide.bodyText || ''}`;
    const hasNumericClaim = /\b\d+(\.\d+)?%|\b(menurut|studi|riset|survei|data)\b/i.test(
      combinedContent
    );
    const hasVerifiedRef = (slide.references || []).some((r) => r.verified);
    if (
      hasNumericClaim &&
      !hasVerifiedRef &&
      slide.layout !== 'cover' &&
      slide.layout !== 'agenda' &&
      slide.layout !== 'references'
    ) {
      issues.push({
        id: `q-claim-${slide.id}`,
        slideId: slide.id,
        slideNumber: slideNum,
        severity: 'info',
        category: 'unverified-claim',
        title: `Klaim kuantitatif/riset pada Slide ${slideNum} perlu verifikasi sumber`,
        description:
          'Slide memuat angka persentase atau rujukan studi namun belum memiliki referensi berstatus Terverifikasi.',
        suggestion:
          'Tambahkan sumber rujukan asli di panel Referensi Bawah atau tandai referensi setelah diverifikasi.',
      });
    }

    // 5. Check Incomplete / Unverified References
    const unverifiedRefs = (slide.references || []).filter((r) => !r.verified);
    if (unverifiedRefs.length > 0) {
      issues.push({
        id: `q-ref-${slide.id}`,
        slideId: slide.id,
        slideNumber: slideNum,
        severity: 'warning',
        category: 'incomplete-reference',
        title: `${unverifiedRefs.length} referensi pada Slide ${slideNum} belum diverifikasi`,
        description:
          'Referensi yang disarankan oleh AI belum ditandai sebagai Terverifikasi oleh penyusun.',
        suggestion:
          'Periksa keaslian penulis/tahun/publikasi pada panel Referensi lalu klik tombol "Tandai Terverifikasi".',
      });
    }
  });

  // 6. Check Duplicate Titles across slides
  titleCounts.forEach((slideNums, normTitle) => {
    if (slideNums.length > 1) {
      const firstSlide = project.slides[slideNums[0] - 1];
      issues.push({
        id: `q-dup-${normTitle}`,
        slideId: firstSlide?.id || '',
        slideNumber: slideNums[0],
        severity: 'warning',
        category: 'duplicate-title',
        title: `Judul berulang pada Slide ${slideNums.join(' & ')}`,
        description: `Judul "${firstSlide?.title}" digunakan lebih dari satu kali dalam presentasi ini.`,
        suggestion:
          'Tambahkan keterangan spesifik (mis. "Bagian 1: Analisis" / "Bagian 2: Implementasi") agar navigasi audiens jelas.',
      });
    }
  });

  // 7. Check Overall Presentation Structure Consistency
  if (project.slides.length > 0 && project.slides[0].layout !== 'cover') {
    issues.push({
      id: 'q-struct-cover',
      slideId: project.slides[0].id,
      slideNumber: 1,
      severity: 'info',
      category: 'structure',
      title: 'Slide pertama tidak menggunakan layout Cover (Sampul)',
      description: 'Presentasi profesional umumnya diawali dengan slide sampul (cover).',
      suggestion: 'Ubah layout Slide 1 menjadi "cover" pada panel pengaturan kanan.',
    });
  }

  return issues;
}
