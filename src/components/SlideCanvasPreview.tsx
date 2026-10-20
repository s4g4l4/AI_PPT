import React, { useState } from 'react';
import {
  SlideData,
  PresentationTheme,
  AspectRatioType,
  CustomSlideElement,
} from '../types/presentation';
import { AlertTriangle, CheckCircle2, Image as ImageIcon } from 'lucide-react';

interface SlideCanvasPreviewProps {
  slide: SlideData;
  totalSlides: number;
  theme: PresentationTheme;
  aspectRatio: AspectRatioType;
  zoom?: number;
  editable?: boolean;
  selectedElementId?: string | null;
  onSelectElement?: (id: string | null) => void;
  onUpdateSlide?: (updated: Partial<SlideData>) => void;
  onUpdateCustomElement?: (elId: string, updated: Partial<CustomSlideElement>) => void;
  compactThumbnail?: boolean;
}

export const SlideCanvasPreview: React.FC<SlideCanvasPreviewProps> = ({
  slide,
  totalSlides,
  theme,
  aspectRatio,
  zoom = 100,
  editable = false,
  selectedElementId = null,
  onSelectElement,
  onUpdateSlide,
  onUpdateCustomElement,
  compactThumbnail = false,
}) => {
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});

  const bgColor = slide.overrideBgColor || theme.backgroundColor || '#FFFFFF';
  const textColor = slide.overrideTextColor || theme.textColor || '#0F172A';
  const mutedColor = theme.mutedTextColor || '#475569';
  const primaryColor = theme.primaryColor || '#1E3A8A';
  const secondaryColor = theme.secondaryColor || '#0284C7';
  const surfaceColor = theme.surfaceColor || '#F8FAFC';

  const radiusClass =
    theme.cornerRadius === 'sharp'
      ? 'rounded-none'
      : theme.cornerRadius === 'soft'
      ? 'rounded-xl'
      : 'rounded-lg';

  const isAgroTemplate =
    theme.templateId === 'tpl-agro-integrated-farming' ||
    theme.primaryColor?.toLowerCase() === '#064e3b';

  const fontClass =
    theme.fontFamily === 'Playfair Display'
      ? 'font-playfair'
      : theme.fontFamily === 'DM Sans'
      ? 'font-dm'
      : theme.fontFamily === 'JetBrains Mono'
      ? 'font-mono-code'
      : 'font-jakarta';

  const titleAlign = slide.textAlign || theme.titlePlacement || 'left';
  const scaleFactor = compactThumbnail ? 1 : zoom / 100;

  // Check if any custom element overflows 0..100% bounds
  const hasOverflowElement =
    Array.isArray(slide.customElements) &&
    slide.customElements.some(
      (el) => el.x < 0 || el.y < 0 || el.x + el.width > 100 || el.y + el.height > 100
    );

  const bulletCount = slide.bullets?.length || 0;
  const wordCount = `${slide.title} ${slide.subtitle || ''} ${(slide.bullets || []).join(' ')} ${
    slide.bodyText || ''
  }`
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
  const isDenseSlide = bulletCount > 6 || wordCount > 115;

  const renderChartVisual = () => {
    const chart = slide.chartData;
    if (!chart || !Array.isArray(chart.labels) || chart.labels.length === 0) return null;
    const maxVal = Math.max(...(chart.values || [1]), 1);

    if (chart.chartType === 'pie') {
      const total = (chart.values || []).reduce((acc, v) => acc + Math.max(0, v), 0) || 1;
      const palette = [primaryColor, secondaryColor, '#10B981', '#F59E0B', '#6366F1'];
      return (
        <div
          className={`p-4 border ${radiusClass} flex flex-col justify-between h-full`}
          style={{ backgroundColor: surfaceColor, borderColor: `${primaryColor}30` }}
        >
          <div className="text-xs font-semibold mb-2" style={{ color: textColor }}>
            {chart.title} ({chart.unit})
          </div>
          <div className="space-y-2 my-auto">
            {chart.labels.map((lbl, idx) => {
              const val = chart.values?.[idx] ?? 0;
              const pct = Math.round((val / total) * 100);
              const barColor = palette[idx % palette.length];
              return (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-xs tabular-nums">
                    <span style={{ color: textColor }}>{lbl}</span>
                    <span className="font-semibold" style={{ color: barColor }}>
                      {val} {chart.unit} ({pct}%)
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-200/70 rounded-sm overflow-hidden">
                    <div
                      className="h-full transition-all duration-200"
                      style={{ width: `${ Math.min(100, Math.max(4, pct)) }%`, backgroundColor: barColor }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
          {chart.sourceNote && (
            <div className="text-[10px] mt-2 pt-1.5 border-t border-slate-200/50" style={{ color: mutedColor }}>
              Catatan: {chart.sourceNote}
            </div>
          )}
        </div>
      );
    }

    // Bar or Line visualization
    return (
      <div
        className={`p-4 border ${radiusClass} flex flex-col justify-between h-full`}
        style={{ backgroundColor: surfaceColor, borderColor: `${primaryColor}30` }}
      >
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="text-xs font-semibold" style={{ color: textColor }}>
            {chart.title}
          </span>
          <span className="text-[11px] tabular-nums" style={{ color: mutedColor }}>
            Satuan: {chart.unit || 'Nilai'}
          </span>
        </div>

        <div className="flex items-end gap-3 flex-1 min-h-[130px] pt-4 pb-1 px-2 border-b border-slate-300/60">
          {chart.labels.map((lbl, idx) => {
            const val = chart.values?.[idx] ?? 0;
            const heightPct = Math.max(8, Math.min(100, Math.round((val / maxVal) * 100)));
            return (
              <div key={idx} className="flex-1 flex flex-col items-center h-full justify-end group">
                <span
                  className="text-[11px] font-semibold tabular-nums mb-1"
                  style={{ color: primaryColor }}
                >
                  {val}
                </span>
                <div
                  className="w-full max-w-[44px] rounded-t transition-all duration-200"
                  style={{
                    height: `${heightPct}%`,
                    backgroundColor: idx % 2 === 0 ? primaryColor : secondaryColor,
                  }}
                />
              </div>
            );
          })}
        </div>

        <div className="flex items-start gap-3 pt-1.5 px-2">
          {chart.labels.map((lbl, idx) => (
            <div
              key={idx}
              className="flex-1 text-center text-[10px] leading-tight truncate"
              style={{ color: mutedColor }}
              title={lbl}
            >
              {lbl}
            </div>
          ))}
        </div>

        {chart.sourceNote && (
          <div className="text-[10px] mt-2 pt-1 border-t border-slate-200/40" style={{ color: mutedColor }}>
            {chart.sourceNote}
          </div>
        )}
      </div>
    );
  };

  return (
    <div
      className="relative w-full flex flex-col items-center justify-center select-none"
      style={{
        transform: compactThumbnail ? undefined : `scale(${scaleFactor})`,
        transformOrigin: 'top center',
      }}
    >
      {/* Overflow / Density Alert Bar (only shown in active editor mode, never in thumbnails) */}
      {!compactThumbnail && editable && (hasOverflowElement || isDenseSlide) && (
        <div className="w-full mb-2 px-3 py-1.5 bg-amber-50 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-800 rounded-md flex items-center justify-between text-xs text-amber-900 dark:text-amber-200">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            <span>
              {hasOverflowElement
                ? 'Peringatan: Ada elemen kustom yang melewati batas kanvas slide.'
                : `Peringatan Kepadatan: Slide ini memuat ${wordCount} kata / ${bulletCount} poin. Pertimbangkan menggunakan tombol AI "Ringkas teks".`}
            </span>
          </div>
        </div>
      )}

      {/* Slide Aspect Ratio Container */}
      <div
        onClick={() => {
          if (editable && onSelectElement) onSelectElement(null);
        }}
        className={`relative w-full overflow-hidden border border-slate-300 dark:border-slate-700 shadow-sm ${fontClass}`}
        style={{
          aspectRatio: aspectRatio === '4:3' ? '4 / 3' : '16 / 9',
          backgroundColor: bgColor,
          color: textColor,
          fontSize: compactThumbnail ? '6px' : '14px',
        }}
      >
        {/* Top Accent Bar */}
        <div
          className="w-full"
          style={{
            height: compactThumbnail ? '3px' : '6px',
            background: `linear-gradient(90deg, ${primaryColor} 0%, ${secondaryColor} 100%)`,
          }}
        />

        {/* Slide Inner Frame */}
        <div
          className={`w-full h-[calc(100%-6px)] flex flex-col justify-between ${
            compactThumbnail ? 'p-2' : 'p-6 md:p-8'
          }`}
        >
          {/* Header Row */}
          {theme.showHeaderFooter && !compactThumbnail && (
            isAgroTemplate ? (
              <div className="flex items-center justify-between gap-3 pb-2 mb-1.5 border-b border-emerald-900/15">
                {/* Institutional branding on top left */}
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-emerald-800 text-white flex items-center justify-center font-black text-[9px] border border-amber-400 shrink-0">
                    {theme.institutionLogoText || 'UISU'}
                  </div>
                  <div className="flex flex-col text-[10px] leading-tight font-bold text-slate-800 dark:text-slate-100">
                    <span>{theme.institutionName || 'UNIVERSITAS ISLAM SUMATERA UTARA'}</span>
                    <span className="text-[9px] text-emerald-800 dark:text-emerald-400 font-semibold">
                      {theme.headerText || 'FAKULTAS PERTANIAN'}
                    </span>
                  </div>
                </div>

                {/* Numbered Circular Badge & Solid Forest Green Banner on top right */}
                {slide.layout !== 'cover' && (
                  <div className="flex items-center gap-2 flex-1 max-w-[70%] ml-auto justify-end">
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center font-black text-slate-950 shrink-0 shadow-sm"
                      style={{ backgroundColor: secondaryColor || '#F59E0B' }}
                    >
                      <span className="text-xs font-black">{slide.slideNumber}</span>
                    </div>
                    <div
                      className="px-3.5 py-1.5 rounded-lg font-black text-white uppercase tracking-wider truncate shadow-xs flex-1 text-right text-xs"
                      style={{ backgroundColor: primaryColor || '#064E3B' }}
                    >
                      {slide.title}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div
                className="flex items-center justify-between text-[11px] pb-2 mb-1 border-b"
                style={{
                  color: mutedColor,
                  borderColor: `${mutedColor}22`,
                }}
              >
                <span className="truncate max-w-[60%]">{theme.headerText}</span>
                <div className="flex items-center gap-2 shrink-0 font-medium" style={{ color: primaryColor }}>
                  {theme.institutionLogoText && (
                    <span
                      className="px-1.5 py-0.5 text-[10px] font-bold tracking-tight border"
                      style={{ borderColor: primaryColor }}
                    >
                      {theme.institutionLogoText}
                    </span>
                  )}
                  <span>{theme.institutionName}</span>
                </div>
              </div>
            )
          )}

          {/* Main Slide Body */}
          <div className="flex-1 flex flex-col justify-center min-h-0 overflow-hidden py-1">
            {slide.layout === 'cover' ? (
              isAgroTemplate ? (
                <div className="grid grid-cols-12 gap-4 h-full items-center">
                  {/* Left Column 7 cols: Title, Subtitle, Metadata & 5 Pillars */}
                  <div className="col-span-7 flex flex-col justify-between h-full py-1 space-y-2">
                    <div className="space-y-1.5">
                      <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 text-[10px] font-bold">
                        <span>{theme.institutionName || 'UNIVERSITAS ISLAM SUMATERA UTARA'}</span>
                        <span className="text-emerald-400">|</span>
                        <span>{theme.headerText || 'FAKULTAS PERTANIAN'}</span>
                      </div>
                      <h1
                        className="font-black leading-tight tracking-tight uppercase"
                        style={{
                          fontSize: compactThumbnail ? '11px' : `${slide.titleFontSize || 26}px`,
                          color: primaryColor,
                        }}
                      >
                        {slide.title}
                      </h1>
                      {slide.subtitle && (
                        <p className="text-xs leading-relaxed font-semibold text-amber-700 dark:text-amber-300">
                          {slide.subtitle}
                        </p>
                      )}
                    </div>

                    {/* Metadata Badges */}
                    <div className="space-y-1 text-xs bg-slate-50 dark:bg-slate-900/60 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800">
                      <div className="flex items-center gap-2 font-semibold text-emerald-800 dark:text-emerald-300">
                        <span className="w-4 h-4 rounded-full bg-emerald-700 text-white flex items-center justify-center text-[10px]">🎓</span>
                        <span>Mata Kuliah: PENGELOLAAN TANAMAN PERKEBUNAN DAN PANGAN BERKELANJUTAN</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                        <span className="w-4 h-4 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px]">📖</span>
                        <span>Program Studi Magister Agroteknologi (S2) · Fakultas Pertanian</span>
                      </div>
                      <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
                        <span className="w-4 h-4 rounded-full bg-amber-500 text-white flex items-center justify-center text-[10px]">👤</span>
                        <span>YENNI ASBUR</span>
                      </div>
                    </div>

                    {/* 5 Capability Badges */}
                    <div className="grid grid-cols-5 gap-1 pt-0.5">
                      {[
                        { label: 'Optimalisasi Ruang', icon: '🌾' },
                        { label: 'Produksi Pangan', icon: '🌽' },
                        { label: 'Daur Ulang Biomassa', icon: '♻️' },
                        { label: 'Efisiensi Input', icon: '💧' },
                        { label: 'Perkebunan Lestari', icon: '🌱' },
                      ].map((pil, idx) => (
                        <div
                          key={idx}
                          className="p-1 rounded border text-center flex flex-col items-center justify-center bg-white dark:bg-slate-950"
                          style={{ borderColor: `${primaryColor}30` }}
                        >
                          <span className="text-xs">{pil.icon}</span>
                          <span className="text-[8px] font-bold mt-0.5 leading-tight text-slate-800 dark:text-slate-200">
                            {pil.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Right Column 5 cols: Circular Ecosystem Diagram Hub */}
                  <div className="col-span-5 h-full flex flex-col items-center justify-center relative p-2">
                    <div
                      className="w-40 h-40 rounded-full border-4 flex flex-col items-center justify-center p-2 text-center shadow-md relative"
                      style={{
                        borderColor: secondaryColor,
                        background: 'radial-gradient(circle, #F0FDF4 0%, #DCFCE7 100%)',
                      }}
                    >
                      <span className="text-2xl mb-0.5">🌿</span>
                      <div className="font-black text-xs uppercase tracking-wider text-emerald-950">
                        INTEGRATED
                      </div>
                      <div className="font-black text-xs uppercase tracking-wider text-emerald-700">
                        FARMING
                      </div>
                      <div className="text-[8px] text-emerald-800 font-medium mt-0.5">
                        Agroekosistem Multifungsi
                      </div>
                    </div>

                    {/* 4 Orbiting Satellite Badges */}
                    <div className="absolute top-1 left-4 px-2 py-0.5 rounded-full bg-amber-100 border border-amber-300 text-amber-900 text-[9px] font-bold shadow-xs">
                      Tanaman Pangan 🌾
                    </div>
                    <div className="absolute top-1 right-4 px-2 py-0.5 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-900 text-[9px] font-bold shadow-xs">
                      Kedelai & Legum 🌱
                    </div>
                    <div className="absolute bottom-1 left-4 px-2 py-0.5 rounded-full bg-sky-100 border border-sky-300 text-sky-900 text-[9px] font-bold shadow-xs">
                      Padi Gogo 🌾
                    </div>
                    <div className="absolute bottom-1 right-4 px-2 py-0.5 rounded-full bg-amber-100 border border-amber-300 text-amber-900 text-[9px] font-bold shadow-xs">
                      Biomassa & Energi ♻️
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-stretch gap-4 my-auto">
                  <div
                    className="w-1.5 shrink-0 rounded-full"
                    style={{ backgroundColor: secondaryColor }}
                  />
                  <div className="space-y-3 flex-1">
                    {editable && !compactThumbnail ? (
                      <input
                        type="text"
                        value={slide.title}
                        onChange={(e) => onUpdateSlide?.({ title: e.target.value })}
                        className="w-full font-bold bg-transparent border-b border-transparent hover:border-slate-300 focus:border-blue-500 focus:outline-none leading-tight"
                        style={{
                          fontSize: `${slide.titleFontSize || 30}px`,
                          color: textColor,
                        }}
                      />
                    ) : (
                      <h1
                        className="font-bold leading-tight"
                        style={{
                          fontSize: compactThumbnail ? '10px' : `${slide.titleFontSize || 30}px`,
                          color: textColor,
                          textWrap: 'balance',
                        }}
                      >
                        {slide.title}
                      </h1>
                    )}

                    {(slide.subtitle || editable) && !compactThumbnail && (
                      editable ? (
                        <input
                          type="text"
                          value={slide.subtitle || ''}
                          placeholder="Tambahkan subjudul presentasi..."
                          onChange={(e) => onUpdateSlide?.({ subtitle: e.target.value })}
                          className="w-full text-base bg-transparent border-b border-transparent hover:border-slate-300 focus:border-blue-500 focus:outline-none"
                          style={{ color: mutedColor }}
                        />
                      ) : (
                        <p className="text-base leading-relaxed" style={{ color: mutedColor }}>
                          {slide.subtitle}
                        </p>
                      )
                    )}

                    {!compactThumbnail && slide.bullets && slide.bullets.length > 0 && (
                      <ul className="space-y-1.5 pt-2">
                        {slide.bullets.slice(0, 4).map((b, idx) => (
                          <li
                            key={idx}
                            className="flex items-start gap-2 text-sm leading-snug"
                            style={{ color: textColor }}
                          >
                            <span
                              className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0"
                              style={{ backgroundColor: primaryColor }}
                            />
                            {editable ? (
                              <input
                                type="text"
                                value={b}
                                onChange={(e) => {
                                  const next = [...slide.bullets];
                                  next[idx] = e.target.value;
                                  onUpdateSlide?.({ bullets: next });
                                }}
                                className="w-full bg-transparent border-b border-transparent hover:border-slate-300 focus:border-blue-500 focus:outline-none"
                              />
                            ) : (
                              <span>{b}</span>
                            )}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              )
            ) : (
              /* Non-Cover Slide Layouts */
              <div className="flex flex-col h-full justify-between gap-2.5 min-h-0">
                {/* Slide Title & Subtitle Header */}
                {isAgroTemplate ? (
                  !compactThumbnail && slide.subtitle && (
                    <div
                      className="mb-1 px-3 py-1 rounded-full text-xs font-semibold inline-flex items-center gap-2 shadow-xs border self-start max-w-full truncate"
                      style={{
                        backgroundColor: '#FEF3C7',
                        borderColor: '#FDE68A',
                        color: '#92400E',
                      }}
                    >
                      <span className="w-4 h-4 rounded-full bg-amber-500 text-white flex items-center justify-center text-[10px] font-black shrink-0">?</span>
                      <span className="truncate">{slide.subtitle}</span>
                    </div>
                  )
                ) : (
                  <div
                    className="shrink-0"
                    style={{
                      textAlign: titleAlign,
                    }}
                  >
                    {editable && !compactThumbnail ? (
                      <input
                        type="text"
                        value={slide.title}
                        onChange={(e) => onUpdateSlide?.({ title: e.target.value })}
                        className="w-full font-bold bg-transparent border-b border-transparent hover:border-slate-300 focus:border-blue-500 focus:outline-none leading-snug"
                        style={{
                          fontSize: `${slide.titleFontSize || 22}px`,
                          color: textColor,
                          textAlign: titleAlign,
                        }}
                      />
                    ) : (
                      <h2
                        className="font-bold leading-snug truncate"
                        style={{
                          fontSize: compactThumbnail ? '8px' : `${slide.titleFontSize || 22}px`,
                          color: textColor,
                        }}
                      >
                        {slide.title}
                      </h2>
                    )}

                    {!compactThumbnail && (slide.subtitle || editable) && (
                      editable ? (
                        <input
                          type="text"
                          value={slide.subtitle || ''}
                          placeholder="Subjudul / gagasan utama slide..."
                          onChange={(e) => onUpdateSlide?.({ subtitle: e.target.value })}
                          className="w-full text-xs mt-0.5 bg-transparent border-b border-transparent hover:border-slate-300 focus:border-blue-500 focus:outline-none"
                          style={{ color: mutedColor, textAlign: titleAlign }}
                        />
                      ) : (
                        <p className="text-xs mt-0.5" style={{ color: mutedColor }}>
                          {slide.subtitle}
                        </p>
                      )
                    )}
                  </div>
                )}

                {/* Layout-Specific Content Area */}
                {compactThumbnail ? (
                  <div className="flex-1 flex flex-col justify-center gap-1 overflow-hidden opacity-80">
                    {(slide.bullets || []).slice(0, 3).map((b, i) => (
                      <div key={i} className="truncate text-[5px]" style={{ color: mutedColor }}>
                        • {b}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex-1 min-h-0 overflow-y-auto pr-1">
                    {slide.layout === 'comparison' && slide.comparison ? (
                      isAgroTemplate ? (
                        <div className="flex flex-col h-full justify-between gap-2.5">
                          <div className="grid grid-cols-12 gap-3 flex-1 items-stretch">
                            {/* Left BEFORE */}
                            <div className="col-span-5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/80 flex flex-col overflow-hidden shadow-xs">
                              <div className="bg-slate-700 text-white px-3 py-1.5 flex items-center justify-between text-xs font-bold">
                                <span>BEFORE</span>
                                <span className="text-[10px] bg-red-600 px-2 py-0.5 rounded text-white font-semibold">SISTEM MONOKULTUR</span>
                              </div>
                              <div className="p-3 flex-1 flex flex-col justify-between">
                                <div className="text-xs font-bold text-slate-800 dark:text-slate-200 mb-2">
                                  {slide.comparison.leftTitle || 'Kebun hanya menghasilkan satu komoditas'}
                                </div>
                                <ul className="space-y-1.5 text-xs flex-1">
                                  {(slide.comparison.leftItems || []).map((item, idx) => (
                                    <li key={idx} className="flex items-start gap-2 text-slate-700 dark:text-slate-300">
                                      <span className="text-red-500 font-bold shrink-0">✕</span>
                                      <span className="leading-snug">{item}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </div>

                            {/* Center Transition */}
                            <div className="col-span-2 flex flex-col items-center justify-center gap-1">
                              <div className="w-9 h-9 rounded-full bg-emerald-700 text-white flex items-center justify-center font-bold text-base shadow-sm">
                                ➔
                              </div>
                              <span className="text-[9px] font-bold uppercase text-emerald-800 dark:text-emerald-400 text-center">
                                Transformasi
                              </span>
                            </div>

                            {/* Right AFTER */}
                            <div className="col-span-5 rounded-lg border border-emerald-300 dark:border-emerald-800 bg-emerald-50/50 dark:bg-emerald-950/30 flex flex-col overflow-hidden shadow-xs">
                              <div className="bg-emerald-800 text-white px-3 py-1.5 flex items-center justify-between text-xs font-bold">
                                <span>AFTER</span>
                                <span className="text-[10px] bg-emerald-600 px-2 py-0.5 rounded text-white font-semibold">INTEGRATED FARMING</span>
                              </div>
                              <div className="p-3 flex-1 flex flex-col justify-between">
                                <div className="text-xs font-bold text-emerald-950 dark:text-emerald-200 mb-2">
                                  {slide.comparison.rightTitle || 'Agroekosistem Multifungsi Berkelanjutan'}
                                </div>
                                <ul className="space-y-1.5 text-xs flex-1">
                                  {(slide.comparison.rightItems || []).map((item, idx) => (
                                    <li key={idx} className="flex items-start gap-2 text-slate-800 dark:text-slate-200">
                                      <span className="text-emerald-600 font-bold shrink-0">✓</span>
                                      <span className="leading-snug">{item}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          </div>

                          {/* Bottom Callout: Pesan Utama */}
                          <div className="w-full px-3.5 py-1.5 rounded-lg bg-emerald-900 text-white flex items-center gap-2 text-xs font-medium shadow-xs shrink-0">
                            <span className="w-4 h-4 rounded-full bg-emerald-700 text-white flex items-center justify-center text-[10px] shrink-0 font-bold">🎯</span>
                            <span className="truncate flex-1 font-semibold text-[11px]">
                              PESAN UTAMA: Integrated farming mengubah kebun dari sistem produksi tunggal menjadi agroekosistem multifungsi yang berdaya saing dan berkelanjutan.
                            </span>
                          </div>
                        </div>
                      ) : (
                        <div className="grid grid-cols-2 gap-4 h-full">
                          <div
                            className={`p-4 border ${radiusClass} flex flex-col`}
                            style={{
                              backgroundColor: surfaceColor,
                              borderColor: `${primaryColor}45`,
                            }}
                          >
                            <div
                              className="font-bold text-sm pb-2 mb-2 border-b"
                              style={{
                                color: primaryColor,
                                borderColor: `${primaryColor}25`,
                              }}
                            >
                              {slide.comparison.leftTitle || 'Pendekatan A'}
                            </div>
                            <ul className="space-y-2 text-xs flex-1">
                              {(slide.comparison.leftItems || []).map((item, idx) => (
                                <li key={idx} className="flex items-start gap-2">
                                  <span style={{ color: primaryColor }}>•</span>
                                  <span>{item}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div
                            className={`p-4 border ${radiusClass} flex flex-col`}
                            style={{
                              backgroundColor: surfaceColor,
                              borderColor: `${secondaryColor}45`,
                            }}
                          >
                            <div
                              className="font-bold text-sm pb-2 mb-2 border-b"
                              style={{
                                color: secondaryColor,
                                borderColor: `${secondaryColor}25`,
                              }}
                            >
                              {slide.comparison.rightTitle || 'Pendekatan B'}
                            </div>
                            <ul className="space-y-2 text-xs flex-1">
                              {(slide.comparison.rightItems || []).map((item, idx) => (
                                <li key={idx} className="flex items-start gap-2">
                                  <span style={{ color: secondaryColor }}>•</span>
                                  <span>{item}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      )
                    ) : slide.layout === 'process' &&
                      slide.processSteps &&
                      slide.processSteps.length > 0 ? (
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 h-full items-stretch">
                        {slide.processSteps.slice(0, 4).map((st, idx) => (
                          <div
                            key={idx}
                            className={`p-3.5 border ${radiusClass} flex flex-col justify-between`}
                            style={{
                              backgroundColor: surfaceColor,
                              borderColor: `${primaryColor}35`,
                            }}
                          >
                            <div>
                              <div
                                className="text-base font-bold tabular-nums mb-1"
                                style={{ color: secondaryColor }}
                              >
                                {st.step || `0${idx + 1}`}
                              </div>
                              <div className="font-bold text-xs mb-1.5" style={{ color: textColor }}>
                                {st.title}
                              </div>
                              <p className="text-[11px] leading-relaxed" style={{ color: mutedColor }}>
                                {st.detail}
                              </p>
                            </div>
                            <div
                              className="h-1 w-8 mt-3"
                              style={{ backgroundColor: primaryColor }}
                            />
                          </div>
                        ))}
                      </div>
                    ) : slide.layout === 'timeline' &&
                      slide.timelineItems &&
                      slide.timelineItems.length > 0 ? (
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 h-full items-stretch">
                        {slide.timelineItems.slice(0, 4).map((tm, idx) => (
                          <div
                            key={idx}
                            className={`border ${radiusClass} overflow-hidden flex flex-col`}
                            style={{
                              backgroundColor: surfaceColor,
                              borderColor: `${primaryColor}35`,
                            }}
                          >
                            <div
                              className="px-3 py-1.5 text-xs font-bold text-white tabular-nums"
                              style={{ backgroundColor: primaryColor }}
                            >
                              {tm.period}
                            </div>
                            <div className="p-3 flex-1 flex flex-col justify-between">
                              <div>
                                <div className="font-bold text-xs mb-1" style={{ color: textColor }}>
                                  {tm.event}
                                </div>
                                <p className="text-[11px] leading-relaxed" style={{ color: mutedColor }}>
                                  {tm.impact}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : slide.layout === 'statistics' &&
                      slide.statCards &&
                      slide.statCards.length > 0 ? (
                      <div className="flex flex-col gap-3 h-full justify-between">
                        <div className="grid grid-cols-3 gap-3">
                          {slide.statCards.slice(0, 3).map((sc, idx) => (
                            <div
                              key={idx}
                              className={`p-3.5 border ${radiusClass}`}
                              style={{
                                backgroundColor: surfaceColor,
                                borderColor: `${secondaryColor}45`,
                              }}
                            >
                              <div
                                className="text-2xl font-bold tabular-nums tracking-tight"
                                style={{ color: primaryColor }}
                              >
                                {sc.value}
                              </div>
                              <div className="text-xs font-semibold mt-1" style={{ color: textColor }}>
                                {sc.label}
                              </div>
                              <div className="text-[11px] mt-0.5 leading-snug" style={{ color: mutedColor }}>
                                {sc.context}
                              </div>
                            </div>
                          ))}
                        </div>
                        {slide.bullets && slide.bullets.length > 0 && (
                          <ul className="space-y-1.5 text-xs pt-1">
                            {slide.bullets.slice(0, 3).map((b, i) => (
                              <li key={i} className="flex items-start gap-2">
                                <span style={{ color: primaryColor }}>•</span>
                                <span>{b}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ) : (slide.layout === 'table' || slide.layout === 'references') &&
                      slide.tableData &&
                      Array.isArray(slide.tableData.headers) &&
                      slide.tableData.headers.length > 0 ? (
                      <div className="space-y-3">
                        <div className={`overflow-x-auto border ${radiusClass}`} style={{ borderColor: `${mutedColor}35` }}>
                          <table className="w-full text-left border-collapse text-xs">
                            <thead>
                              <tr style={{ backgroundColor: primaryColor, color: '#FFFFFF' }}>
                                {slide.tableData.headers.map((h, hi) => (
                                  <th key={hi} className="py-2 px-3 font-semibold border-r border-white/15 last:border-r-0">
                                    {h}
                                  </th>
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              {(slide.tableData.rows || []).map((row, ri) => (
                                <tr
                                  key={ri}
                                  className="border-t"
                                  style={{
                                    backgroundColor: ri % 2 === 0 ? bgColor : surfaceColor,
                                    borderColor: `${mutedColor}25`,
                                  }}
                                >
                                  {row.map((cell, ci) => (
                                    <td key={ci} className="py-2 px-3 tabular-nums" style={{ color: textColor }}>
                                      {cell}
                                    </td>
                                  ))}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                        {slide.references && slide.references.length > 0 && (
                          <div className="space-y-1 pt-1">
                            {slide.references.map((ref) => (
                              <div
                                key={ref.id}
                                className="flex items-center justify-between text-[11px] gap-2 py-1 border-b border-slate-200/40"
                              >
                                <span className="truncate" style={{ color: textColor }}>
                                  {ref.citation}
                                </span>
                                <span
                                  className="shrink-0 font-medium flex items-center gap-1"
                                  style={{
                                    color: ref.verified ? '#16A34A' : '#D97706',
                                  }}
                                >
                                  <CheckCircle2 className="w-3 h-3" />
                                  {ref.verified ? 'Terverifikasi' : 'Perlu Diverifikasi'}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ) : slide.layout === 'chart' && slide.chartData ? (
                      <div className="grid grid-cols-12 gap-4 h-full items-stretch">
                        <div className="col-span-7 h-full">{renderChartVisual()}</div>
                        <div className="col-span-5 flex flex-col justify-between space-y-2">
                          <ul className="space-y-2 text-xs">
                            {(slide.bullets || []).map((b, idx) => (
                              <li key={idx} className="flex items-start gap-2 leading-relaxed">
                                <span
                                  className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0"
                                  style={{ backgroundColor: primaryColor }}
                                />
                                <span>{b}</span>
                              </li>
                            ))}
                          </ul>
                          {slide.bodyText && (
                            <div
                              className={`p-3 text-xs border ${radiusClass}`}
                              style={{
                                backgroundColor: surfaceColor,
                                borderColor: `${secondaryColor}35`,
                                color: mutedColor,
                              }}
                            >
                              {slide.bodyText}
                            </div>
                          )}
                        </div>
                      </div>
                    ) : (
                      /* Default Concept / Agenda / Case Study / Conclusion Layout */
                      <div className="grid grid-cols-12 gap-4 h-full">
                        <div
                          className={`${
                            slide.imageUrl || slide.visualSuggestion ? 'col-span-8' : 'col-span-12'
                          } flex flex-col justify-between space-y-3`}
                        >
                          <ul
                            className="space-y-2"
                            style={{ fontSize: `${slide.bodyFontSize || 14}px` }}
                          >
                            {(slide.bullets || []).map((b, idx) => (
                              <li key={idx} className="flex items-start gap-2.5 leading-relaxed">
                                <span
                                  className="font-mono text-xs font-semibold tabular-nums mt-0.5 shrink-0"
                                  style={{ color: primaryColor }}
                                >
                                  0{idx + 1}.
                                </span>
                                {editable ? (
                                  <input
                                    type="text"
                                    value={b}
                                    onChange={(e) => {
                                      const next = [...slide.bullets];
                                      next[idx] = e.target.value;
                                      onUpdateSlide?.({ bullets: next });
                                    }}
                                    className="w-full bg-transparent border-b border-transparent hover:border-slate-300 focus:border-blue-500 focus:outline-none"
                                    style={{ color: textColor }}
                                  />
                                ) : (
                                  <span style={{ color: textColor }}>{b}</span>
                                )}
                              </li>
                            ))}
                          </ul>

                          {(slide.bodyText || editable) && (
                            <div
                              className={`p-3 border ${radiusClass}`}
                              style={{
                                backgroundColor: surfaceColor,
                                borderColor: `${primaryColor}25`,
                              }}
                            >
                              {editable ? (
                                <textarea
                                  rows={2}
                                  value={slide.bodyText || ''}
                                  placeholder="Tambahkan penjelasan pendukung slide..."
                                  onChange={(e) => onUpdateSlide?.({ bodyText: e.target.value })}
                                  className="w-full text-xs bg-transparent focus:outline-none resize-none"
                                  style={{ color: mutedColor }}
                                />
                              ) : (
                                <p className="text-xs leading-relaxed" style={{ color: mutedColor }}>
                                  {slide.bodyText}
                                </p>
                              )}
                            </div>
                          )}
                        </div>

                        {(slide.imageUrl || slide.visualSuggestion) && (
                          <div className="col-span-4 flex flex-col">
                            {slide.imageUrl && !failedImages[slide.imageUrl] ? (
                              <div
                                className={`flex-1 overflow-hidden border ${radiusClass} flex flex-col`}
                                style={{
                                  backgroundColor: surfaceColor,
                                  borderColor: `${primaryColor}30`,
                                }}
                              >
                                <img
                                  src={slide.imageUrl}
                                  alt={slide.imageCaption || slide.title}
                                  referrerPolicy="no-referrer"
                                  onError={() =>
                                    setFailedImages((prev) => ({
                                      ...prev,
                                      [slide.imageUrl!]: true,
                                    }))
                                  }
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            ) : (
                              <div
                                className={`flex-1 p-3.5 border ${radiusClass} flex flex-col justify-between`}
                                style={{
                                  backgroundColor: surfaceColor,
                                  borderColor: `${secondaryColor}35`,
                                }}
                              >
                                <div className="flex items-center gap-2 text-xs font-semibold" style={{ color: primaryColor }}>
                                  <ImageIcon className="w-4 h-4 shrink-0" />
                                  <span className="capitalize">
                                    Visual: {slide.visualSuggestion?.type || 'Ilustrasi'}
                                  </span>
                                </div>
                                <p className="text-[11px] leading-relaxed my-auto py-2" style={{ color: mutedColor }}>
                                  {slide.visualSuggestion?.description ||
                                    'Area visual pendukung materi slide.'}
                                </p>
                                <div className="text-[10px] pt-2 border-t border-slate-200/40" style={{ color: mutedColor }}>
                                  Layout: {slide.layout.toUpperCase()}
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Render Custom Interactive Elements on Canvas */}
            {!compactThumbnail &&
              Array.isArray(slide.customElements) &&
              slide.customElements.map((el) => {
                const isSelected = selectedElementId === el.id;
                const isOut =
                  el.x < 0 || el.y < 0 || el.x + el.width > 100 || el.y + el.height > 100;
                return (
                  <div
                    key={el.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (editable && onSelectElement) onSelectElement(el.id);
                    }}
                    className={`absolute transition-shadow cursor-pointer flex items-center p-2 ${
                      isSelected
                        ? 'ring-2 ring-blue-600 shadow-md z-20'
                        : 'hover:ring-1 hover:ring-blue-400 z-10'
                    } ${isOut ? 'ring-2 ring-red-500' : ''}`}
                    style={{
                      left: `${el.x}%`,
                      top: `${el.y}%`,
                      width: `${el.width}%`,
                      height: `${el.height}%`,
                      backgroundColor:
                        el.type === 'textbox' ? 'transparent' : el.backgroundColor || surfaceColor,
                      border:
                        el.type === 'shape' || el.type === 'callout'
                          ? `1.5px solid ${el.borderColor || primaryColor}`
                          : undefined,
                      borderRadius: el.shapeVariant === 'rounded' ? '8px' : '2px',
                      color: el.textColor || textColor,
                      fontSize: `${el.fontSize || 14}px`,
                      fontWeight: el.fontWeight || 'normal',
                      fontStyle: el.fontStyle || 'normal',
                      textAlign: el.textAlign || 'left',
                    }}
                  >
                    {editable && isSelected ? (
                      <textarea
                        value={el.content}
                        onChange={(e) =>
                          onUpdateCustomElement?.(el.id, { content: e.target.value })
                        }
                        className="w-full h-full bg-transparent focus:outline-none resize-none"
                        style={{
                          color: el.textColor || textColor,
                          fontSize: `${el.fontSize || 14}px`,
                          fontWeight: el.fontWeight || 'normal',
                          fontStyle: el.fontStyle || 'normal',
                          textAlign: el.textAlign || 'left',
                        }}
                      />
                    ) : (
                      <div className="w-full break-words">{el.content}</div>
                    )}
                  </div>
                );
              })}
          </div>

          {/* Footer & Slide Number */}
          {!compactThumbnail && (
            isAgroTemplate ? (
              <div
                className="w-full flex items-center justify-between px-3.5 py-1.5 rounded text-[10px] text-white mt-1 shrink-0 font-medium shadow-xs"
                style={{ backgroundColor: primaryColor || '#064E3B' }}
              >
                <span className="uppercase tracking-wider truncate max-w-[65%] opacity-90 font-bold">
                  {theme.footerText || 'PENGELOLAAN TANAMAN PERKEBUNAN & PANGAN BERKELANJUTAN BY YENNI ASBUR'}
                </span>
                <div className="flex items-center gap-2.5 opacity-90 shrink-0">
                  <span title="Ekosistem Biosfer">🌿</span>
                  <span title="Komoditas Tanaman">🌱</span>
                  <span title="Ekonomi Sirkular Biomassa">♻️</span>
                  <span title="Efisiensi Input Air & Hara">💧</span>
                  <span title="Kinerja & Indikator Hasil">📊</span>
                  {theme.showSlideNumbers && (
                    <span className="ml-1 pl-2 border-l border-white/30 font-mono font-bold">
                      {slide.slideNumber} / {totalSlides}
                    </span>
                  )}
                </div>
              </div>
            ) : (theme.showHeaderFooter || theme.showSlideNumbers) ? (
              <div
                className="flex items-center justify-between text-[11px] pt-2 mt-1 border-t shrink-0"
                style={{
                  color: mutedColor,
                  borderColor: `${mutedColor}22`,
                }}
              >
                <div className="flex items-center gap-3 truncate">
                  {theme.showHeaderFooter && <span>{theme.footerText}</span>}
                  {slide.references && slide.references.length > 0 && (
                    <span>
                      · {slide.references.filter((r) => r.verified).length}/{slide.references.length}{' '}
                      Referensi Terverifikasi
                    </span>
                  )}
                </div>
                {theme.showSlideNumbers && (
                  <span className="font-mono tabular-nums font-medium shrink-0">
                    {slide.slideNumber} / {totalSlides}
                  </span>
                )}
              </div>
            ) : null
          )}
        </div>
      </div>
    </div>
  );
};
