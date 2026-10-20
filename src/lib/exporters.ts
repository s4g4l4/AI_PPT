import { jsPDF } from 'jspdf';
import { PresentationProject } from '../types/presentation';
import { PRESENTATION_TEMPLATES } from '../data/templates';
import { generateClientSidePptxBlob } from './apiClient';

function hexToRgb(hex: string, fallback: [number, number, number]): [number, number, number] {
  const clean = (hex || '').replace('#', '').trim();
  if (clean.length !== 6) return fallback;
  const r = parseInt(clean.slice(0, 2), 16);
  const g = parseInt(clean.slice(2, 4), 16);
  const b = parseInt(clean.slice(4, 6), 16);
  if (Number.isNaN(r) || Number.isNaN(g) || Number.isNaN(b)) return fallback;
  return [r, g, b];
}

export async function downloadPresentationPptx(project: PresentationProject): Promise<void> {
  let blob: Blob | null = null;
  try {
    const response = await fetch('/api/export/pptx', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ project }),
    });
    const contentType = response.headers.get('content-type') || '';
    if (
      response.ok &&
      (contentType.includes('presentationml') || contentType.includes('octet-stream'))
    ) {
      blob = await response.blob();
    }
  } catch {
    // Fall back to client-side PPTX generator
  }

  if (!blob) {
    blob = await generateClientSidePptxBlob(project);
  }

  const safeName =
    (project.title || 'Presentasi_AI_PPT_Studio')
      .replace(/[^a-zA-Z0-9_\-\s]/g, '')
      .trim()
      .replace(/\s+/g, '_')
      .slice(0, 60) || 'Presentasi_AI_PPT_Studio';

  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${safeName}.pptx`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function downloadPresentationPdf(project: PresentationProject): void {
  const is4x3 = project.config?.aspectRatio === '4:3';
  const pageW = is4x3 ? 254 : 338.67; // mm (10in vs 13.33in)
  const pageH = 190.5; // mm (7.5in)

  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: [pageW, pageH],
  });

  const theme = project.theme || PRESENTATION_TEMPLATES[0].theme;
  const primaryRgb = hexToRgb(theme.primaryColor, [30, 58, 138]);
  const secondaryRgb = hexToRgb(theme.secondaryColor, [2, 132, 199]);
  const defaultBgRgb = hexToRgb(theme.backgroundColor, [255, 255, 255]);
  const surfaceRgb = hexToRgb(theme.surfaceColor, [248, 250, 252]);
  const defaultTextRgb = hexToRgb(theme.textColor, [15, 23, 42]);
  const mutedTextRgb = hexToRgb(theme.mutedTextColor, [71, 85, 105]);

  project.slides.forEach((s, index) => {
    if (index > 0) {
      doc.addPage([pageW, pageH], 'landscape');
    }

    const bgRgb = s.overrideBgColor ? hexToRgb(s.overrideBgColor, defaultBgRgb) : defaultBgRgb;
    const txtRgb = s.overrideTextColor
      ? hexToRgb(s.overrideTextColor, defaultTextRgb)
      : defaultTextRgb;

    // Background fill
    doc.setFillColor(bgRgb[0], bgRgb[1], bgRgb[2]);
    doc.rect(0, 0, pageW, pageH, 'F');

    // Top bar
    doc.setFillColor(primaryRgb[0], primaryRgb[1], primaryRgb[2]);
    doc.rect(0, 0, pageW, 3.5, 'F');

    // Header
    if (theme.showHeaderFooter) {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(mutedTextRgb[0], mutedTextRgb[1], mutedTextRgb[2]);
      if (theme.headerText) {
        doc.text(theme.headerText, 16, 10);
      }
      if (theme.institutionLogoText || theme.institutionName) {
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(primaryRgb[0], primaryRgb[1], primaryRgb[2]);
        const instLabel = `${theme.institutionLogoText ? `[${theme.institutionLogoText}] ` : ''}${
          theme.institutionName || ''
        }`;
        doc.text(instLabel, pageW - 16, 10, { align: 'right' });
      }
    }

    // Title & Subtitle
    if (s.layout === 'cover') {
      doc.setFillColor(secondaryRgb[0], secondaryRgb[1], secondaryRgb[2]);
      doc.rect(16, 38, 2.5, 58, 'F');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(26);
      doc.setTextColor(txtRgb[0], txtRgb[1], txtRgb[2]);
      const titleLines = doc.splitTextToSize(s.title, pageW - 44);
      doc.text(titleLines, 24, 48);

      if (s.subtitle) {
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(13);
        doc.setTextColor(mutedTextRgb[0], mutedTextRgb[1], mutedTextRgb[2]);
        const subLines = doc.splitTextToSize(s.subtitle, pageW - 48);
        doc.text(subLines, 24, 76);
      }

      if (s.bullets && s.bullets.length > 0) {
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(11.5);
        doc.setTextColor(txtRgb[0], txtRgb[1], txtRgb[2]);
        let yCursor = 104;
        s.bullets.slice(0, 5).forEach((b) => {
          const bLines = doc.splitTextToSize(`•  ${b}`, pageW - 48);
          doc.text(bLines, 24, yCursor);
          yCursor += bLines.length * 6.5 + 2.5;
        });
      }
    } else {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(20);
      doc.setTextColor(txtRgb[0], txtRgb[1], txtRgb[2]);
      const titleLines = doc.splitTextToSize(s.title, pageW - 32);
      doc.text(titleLines, 16, 22);

      let yCursor = 22 + titleLines.length * 8;
      if (s.subtitle) {
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(11.5);
        doc.setTextColor(mutedTextRgb[0], mutedTextRgb[1], mutedTextRgb[2]);
        const subLines = doc.splitTextToSize(s.subtitle, pageW - 32);
        doc.text(subLines, 16, yCursor + 2);
        yCursor += subLines.length * 6 + 8;
      } else {
        yCursor += 6;
      }

      if (s.layout === 'comparison' && s.comparison) {
        const colW = (pageW - 38) / 2;
        // Left Column
        doc.setFillColor(surfaceRgb[0], surfaceRgb[1], surfaceRgb[2]);
        doc.setDrawColor(primaryRgb[0], primaryRgb[1], primaryRgb[2]);
        doc.rect(16, yCursor, colW, 108, 'FD');
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(13);
        doc.setTextColor(primaryRgb[0], primaryRgb[1], primaryRgb[2]);
        doc.text(s.comparison.leftTitle || 'Opsi A', 22, yCursor + 10);

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10.5);
        doc.setTextColor(txtRgb[0], txtRgb[1], txtRgb[2]);
        let ly = yCursor + 20;
        (s.comparison.leftItems || []).forEach((it) => {
          const lines = doc.splitTextToSize(`• ${it}`, colW - 12);
          doc.text(lines, 22, ly);
          ly += lines.length * 5.5 + 2.5;
        });

        // Right Column
        const rx = 16 + colW + 6;
        doc.setFillColor(surfaceRgb[0], surfaceRgb[1], surfaceRgb[2]);
        doc.setDrawColor(secondaryRgb[0], secondaryRgb[1], secondaryRgb[2]);
        doc.rect(rx, yCursor, colW, 108, 'FD');
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(13);
        doc.setTextColor(secondaryRgb[0], secondaryRgb[1], secondaryRgb[2]);
        doc.text(s.comparison.rightTitle || 'Opsi B', rx + 6, yCursor + 10);

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10.5);
        doc.setTextColor(txtRgb[0], txtRgb[1], txtRgb[2]);
        let ry = yCursor + 20;
        (s.comparison.rightItems || []).forEach((it) => {
          const lines = doc.splitTextToSize(`• ${it}`, colW - 12);
          doc.text(lines, rx + 6, ry);
          ry += lines.length * 5.5 + 2.5;
        });
      } else if (s.layout === 'process' && s.processSteps && s.processSteps.length > 0) {
        const steps = s.processSteps.slice(0, 4);
        const cardW = (pageW - 32 - (steps.length - 1) * 5) / steps.length;
        steps.forEach((st, idx) => {
          const cx = 16 + idx * (cardW + 5);
          doc.setFillColor(surfaceRgb[0], surfaceRgb[1], surfaceRgb[2]);
          doc.setDrawColor(primaryRgb[0], primaryRgb[1], primaryRgb[2]);
          doc.rect(cx, yCursor, cardW, 88, 'FD');

          doc.setFont('helvetica', 'bold');
          doc.setFontSize(14);
          doc.setTextColor(secondaryRgb[0], secondaryRgb[1], secondaryRgb[2]);
          doc.text(st.step || `0${idx + 1}`, cx + 5, yCursor + 10);

          doc.setFontSize(11.5);
          doc.setTextColor(txtRgb[0], txtRgb[1], txtRgb[2]);
          const tLines = doc.splitTextToSize(st.title, cardW - 10);
          doc.text(tLines, cx + 5, yCursor + 20);

          doc.setFont('helvetica', 'normal');
          doc.setFontSize(9.5);
          doc.setTextColor(mutedTextRgb[0], mutedTextRgb[1], mutedTextRgb[2]);
          const dLines = doc.splitTextToSize(st.detail, cardW - 10);
          doc.text(dLines, cx + 5, yCursor + 35);
        });
      } else if (s.layout === 'timeline' && s.timelineItems && s.timelineItems.length > 0) {
        const items = s.timelineItems.slice(0, 4);
        const cardW = (pageW - 32 - (items.length - 1) * 5) / items.length;
        items.forEach((tm, idx) => {
          const cx = 16 + idx * (cardW + 5);
          doc.setFillColor(primaryRgb[0], primaryRgb[1], primaryRgb[2]);
          doc.rect(cx, yCursor, cardW, 11, 'F');
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(10);
          doc.setTextColor(255, 255, 255);
          doc.text(tm.period, cx + 4, yCursor + 7.5);

          doc.setFillColor(surfaceRgb[0], surfaceRgb[1], surfaceRgb[2]);
          doc.setDrawColor(primaryRgb[0], primaryRgb[1], primaryRgb[2]);
          doc.rect(cx, yCursor + 11, cardW, 76, 'FD');

          doc.setFont('helvetica', 'bold');
          doc.setFontSize(11);
          doc.setTextColor(txtRgb[0], txtRgb[1], txtRgb[2]);
          const eLines = doc.splitTextToSize(tm.event, cardW - 8);
          doc.text(eLines, cx + 4, yCursor + 20);

          doc.setFont('helvetica', 'normal');
          doc.setFontSize(9.5);
          doc.setTextColor(mutedTextRgb[0], mutedTextRgb[1], mutedTextRgb[2]);
          const iLines = doc.splitTextToSize(tm.impact, cardW - 8);
          doc.text(iLines, cx + 4, yCursor + 36);
        });
      } else if (s.layout === 'statistics' && s.statCards && s.statCards.length > 0) {
        const cards = s.statCards.slice(0, 4);
        const cardW = (pageW - 32 - (cards.length - 1) * 6) / cards.length;
        cards.forEach((sc, idx) => {
          const cx = 16 + idx * (cardW + 6);
          doc.setFillColor(surfaceRgb[0], surfaceRgb[1], surfaceRgb[2]);
          doc.setDrawColor(secondaryRgb[0], secondaryRgb[1], secondaryRgb[2]);
          doc.rect(cx, yCursor, cardW, 56, 'FD');

          doc.setFont('helvetica', 'bold');
          doc.setFontSize(22);
          doc.setTextColor(primaryRgb[0], primaryRgb[1], primaryRgb[2]);
          doc.text(sc.value, cx + 6, yCursor + 16);

          doc.setFontSize(11);
          doc.setTextColor(txtRgb[0], txtRgb[1], txtRgb[2]);
          const lLines = doc.splitTextToSize(sc.label, cardW - 12);
          doc.text(lLines, cx + 6, yCursor + 26);

          doc.setFont('helvetica', 'normal');
          doc.setFontSize(9);
          doc.setTextColor(mutedTextRgb[0], mutedTextRgb[1], mutedTextRgb[2]);
          const cLines = doc.splitTextToSize(sc.context, cardW - 12);
          doc.text(cLines, cx + 6, yCursor + 38);
        });
        yCursor += 64;
        if (s.bullets && s.bullets.length > 0) {
          doc.setFont('helvetica', 'normal');
          doc.setFontSize(11);
          doc.setTextColor(txtRgb[0], txtRgb[1], txtRgb[2]);
          s.bullets.slice(0, 4).forEach((b) => {
            const bLines = doc.splitTextToSize(`•  ${b}`, pageW - 32);
            doc.text(bLines, 16, yCursor);
            yCursor += bLines.length * 6 + 2;
          });
        }
      } else {
        // Default bullets + body text + table/references
        if (s.bullets && s.bullets.length > 0) {
          doc.setFont('helvetica', 'normal');
          doc.setFontSize(12);
          doc.setTextColor(txtRgb[0], txtRgb[1], txtRgb[2]);
          s.bullets.forEach((b) => {
            const bLines = doc.splitTextToSize(`•  ${b}`, pageW - 32);
            doc.text(bLines, 16, yCursor);
            yCursor += bLines.length * 6.5 + 3;
          });
        }

        if (s.bodyText) {
          yCursor += 4;
          doc.setFillColor(surfaceRgb[0], surfaceRgb[1], surfaceRgb[2]);
          doc.setDrawColor(secondaryRgb[0], secondaryRgb[1], secondaryRgb[2]);
          const bodyLines = doc.splitTextToSize(s.bodyText, pageW - 44);
          const boxH = Math.max(20, bodyLines.length * 5.8 + 10);
          doc.rect(16, yCursor, pageW - 32, boxH, 'FD');
          doc.setFont('helvetica', 'normal');
          doc.setFontSize(10.5);
          doc.setTextColor(mutedTextRgb[0], mutedTextRgb[1], mutedTextRgb[2]);
          doc.text(bodyLines, 22, yCursor + 8);
          yCursor += boxH + 6;
        }

        if (s.references && s.references.length > 0) {
          yCursor += 4;
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(9.5);
          doc.setTextColor(primaryRgb[0], primaryRgb[1], primaryRgb[2]);
          doc.text('Referensi & Status Verifikasi:', 16, yCursor);
          yCursor += 5;
          doc.setFont('helvetica', 'normal');
          doc.setFontSize(8.5);
          doc.setTextColor(mutedTextRgb[0], mutedTextRgb[1], mutedTextRgb[2]);
          s.references.slice(0, 4).forEach((ref) => {
            const statusTag = ref.verified ? '[Terverifikasi]' : '[Perlu Diverifikasi]';
            const rLines = doc.splitTextToSize(`${statusTag} ${ref.citation}`, pageW - 32);
            doc.text(rLines, 16, yCursor);
            yCursor += rLines.length * 4.5 + 1.5;
          });
        }
      }
    }

    // Footer & Slide Number
    if (theme.showHeaderFooter && theme.footerText) {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(mutedTextRgb[0], mutedTextRgb[1], mutedTextRgb[2]);
      doc.text(theme.footerText, 16, pageH - 8);
    }
    if (theme.showSlideNumbers) {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(mutedTextRgb[0], mutedTextRgb[1], mutedTextRgb[2]);
      doc.text(`${s.slideNumber} / ${project.slides.length}`, pageW - 16, pageH - 8, {
        align: 'right',
      });
    }
  });

  const safeName =
    (project.title || 'Presentasi_AI_PPT_Studio')
      .replace(/[^a-zA-Z0-9_\-\s]/g, '')
      .trim()
      .replace(/\s+/g, '_')
      .slice(0, 60) || 'Presentasi_AI_PPT_Studio';

  doc.save(`${safeName}.pdf`);
}
