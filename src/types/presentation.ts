export type SlideLayoutType =
  | 'cover'
  | 'agenda'
  | 'concept'
  | 'comparison'
  | 'process'
  | 'timeline'
  | 'table'
  | 'chart'
  | 'statistics'
  | 'case-study'
  | 'conclusion'
  | 'references';

export type AspectRatioType = '16:9' | '4:3';
export type ContentLanguage = 'id' | 'en';
export type WritingStyleType =
  | 'akademik'
  | 'profesional'
  | 'edukatif'
  | 'kreatif'
  | 'persuasif'
  | 'minimalis';
export type DepthLevelType = 'ringkas' | 'standar' | 'mendalam';

export interface SlideReference {
  id: string;
  citation: string;
  url?: string;
  verified: boolean;
  verificationNote?: string;
}

export interface ComparisonData {
  leftTitle: string;
  leftItems: string[];
  rightTitle: string;
  rightItems: string[];
}

export interface ProcessStep {
  step: string;
  title: string;
  detail: string;
}

export interface TimelineItem {
  period: string;
  event: string;
  impact: string;
}

export interface TableData {
  headers: string[];
  rows: string[][];
}

export interface ChartData {
  chartType: 'bar' | 'line' | 'pie';
  title: string;
  labels: string[];
  values: number[];
  unit: string;
  sourceNote?: string;
}

export interface StatCardItem {
  value: string;
  label: string;
  context: string;
}

export interface CustomSlideElement {
  id: string;
  type: 'textbox' | 'shape' | 'image' | 'callout';
  content: string;
  x: number; // percentage 0-100
  y: number; // percentage 0-100
  width: number; // percentage 5-100
  height: number; // percentage 5-100
  fontSize: number; // pt (e.g., 12 to 44)
  fontWeight: 'normal' | 'bold';
  fontStyle: 'normal' | 'italic';
  textAlign: 'left' | 'center' | 'right';
  textColor: string;
  backgroundColor: string;
  borderColor?: string;
  shapeVariant?: 'rect' | 'rounded' | 'line' | 'pill';
  imageUrl?: string;
  imageAlt?: string;
}

export interface SlideVisualSuggestion {
  type: 'diagram' | 'chart' | 'table' | 'comparison' | 'timeline' | 'stat-cards' | 'illustration';
  description: string;
}

export interface SlideData {
  id: string;
  slideNumber: number;
  title: string;
  subtitle?: string;
  layout: SlideLayoutType;
  bullets: string[];
  bodyText?: string;
  visualSuggestion?: SlideVisualSuggestion;
  comparison?: ComparisonData;
  processSteps?: ProcessStep[];
  timelineItems?: TimelineItem[];
  tableData?: TableData;
  chartData?: ChartData;
  statCards?: StatCardItem[];
  customElements: CustomSlideElement[];
  speakerNotes: string;
  references: SlideReference[];
  titleFontSize?: number;
  bodyFontSize?: number;
  textAlign?: 'left' | 'center' | 'right';
  overrideBgColor?: string;
  overrideTextColor?: string;
  imageUrl?: string;
  imageCaption?: string;
}

export interface OutlineItem {
  id: string;
  slideNumber: number;
  title: string;
  mainIdea: string;
  summaryPoints: string[];
  suggestedLayout: SlideLayoutType;
}

export interface PresentationTheme {
  templateId: string;
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  surfaceColor: string;
  textColor: string;
  mutedTextColor: string;
  fontFamily: 'Plus Jakarta Sans' | 'DM Sans' | 'Playfair Display' | 'JetBrains Mono';
  cornerRadius: 'sharp' | 'rounded' | 'soft';
  illustrationStyle: 'geometric' | 'editorial' | 'technical' | 'minimal';
  titlePlacement: 'left' | 'center';
  showHeaderFooter: boolean;
  headerText: string;
  footerText: string;
  showSlideNumbers: boolean;
  institutionName: string;
  institutionLogoText: string;
}

export interface VisualStyleReferenceReport {
  referenceFileName: string;
  referenceFileType: string;
  analyzedAt: string;
  targetNewTopic: string;
  sectionA_IdentitySummary: {
    styleName: string;
    overallCharacter: string;
    moodAndAtmosphere: string;
    designArchetype: string;
    suitabilityCrossTopic: string[];
  };
  sectionB_DesignAnalysis: {
    factualObservations: {
      colorPaletteObserved: string;
      typographyAndHierarchy: string;
      layoutAndComposition: string;
      whitespaceAndDensity: string;
      imageryIllustrationIcons: string;
      texturesOrnamentsBackground: string;
      coverAndContentCharacter: string;
    };
    observationalLimitations: string;
  };
  sectionC_StyleGuide: {
    visualConcept: string;
    extractedTheme: {
      primaryColor: string;
      secondaryColor: string;
      backgroundColor: string;
      surfaceColor: string;
      textColor: string;
      mutedTextColor: string;
      fontFamily: 'Plus Jakarta Sans' | 'DM Sans' | 'Playfair Display' | 'JetBrains Mono';
      cornerRadius: 'sharp' | 'rounded' | 'soft';
      illustrationStyle: 'geometric' | 'editorial' | 'technical' | 'minimal';
      titlePlacement: 'left' | 'center';
    };
    colorRoles: { hex: string; role: string; usageRule: string }[];
    typographyRules: string[];
    layoutSystemRules: string[];
    consistencyRules: string[];
    elementsToKeep: string[];
    elementsToAdapt: string[];
    elementsToAvoid: string[];
  };
  sectionD_ReadyDesignPrompt: {
    crossTopicAdaptationStrategy: string;
    creativeRecommendationsForNewTopic: string[];
    masterDesignPrompt: string;
  };
  sectionE_MoodboardDirection: {
    moodboardConcept: string;
    graphicElementsAndMotifs: string[];
    coverSlideDirection: string;
    contentSlideDirection: string;
    closingSlideDirection: string;
  };
}

export interface PresentationConfig {
  title: string;
  topic: string;
  purpose: string;
  targetAudience: string;
  language: ContentLanguage;
  slideCount: number;
  durationMinutes: number;
  depthLevel: DepthLevelType;
  writingStyle: WritingStyleType;
  visualStyle: string;
  aspectRatio: AspectRatioType;
  citationStyle: 'APA' | 'IEEE' | 'Harvard' | 'None';
  sourceType: 'topic' | 'text' | 'document' | 'outline' | 'visual-reference';
  sourceMaterial: string;
  extractedDocMeta?: {
    fileName: string;
    fileSize: number;
    wordCount: number;
    summary: string[];
  };
  visualStyleReference?: VisualStyleReferenceReport;
}

export interface PresentationProject {
  id: string;
  ownerId?: string;
  title: string;
  topic: string;
  config: PresentationConfig;
  theme: PresentationTheme;
  outline: OutlineItem[];
  slides: SlideData[];
  createdAt: string;
  updatedAt: string;
}

export interface TemplateDefinition {
  id: string;
  name: string;
  category:
    | 'Akademik dan perkuliahan'
    | 'Penelitian dan seminar'
    | 'Skripsi dan tesis'
    | 'Bisnis dan korporasi'
    | 'Proposal proyek'
    | 'Pendidikan dan pelatihan'
    | 'Teknologi dan AI'
    | 'Minimalis profesional'
    | 'Infografis'
    | 'Pitch deck'
    | 'Laporan dan analisis data'
    | 'Presentasi kreatif';
  description: string;
  recommendedFor: string[];
  theme: PresentationTheme;
  previewSlides: string[];
}

export type AIProviderType = 'gemini' | 'nvidia' | 'huggingface';

export interface AIProviderConfig {
  id: string;
  name: string;
  provider: AIProviderType;
  baseUrl?: string;
  outlineModel: string;
  slideModel: string;
  rewriteModel: string;
  documentModel: string;
  temperature: number;
  topP: number;
  maxOutputTokens?: number;
  isDefault: boolean;
  connectionStatus: 'connected' | 'untested' | 'error';
  lastTestedAt?: string;
  lastErrorMessage?: string;
  credentialSource: string;
  hasSavedKey?: boolean;
  maskedKey?: string;
  updatedAt: string;
}

export type SlideAIActionType =
  | 'improve-writing'
  | 'summarize'
  | 'expand'
  | 'change-tone'
  | 'translate'
  | 'regenerate'
  | 'structure-points'
  | 'suggest-layout'
  | 'suggest-visual'
  | 'generate-notes'
  | 'check-consistency';

export interface QualityIssue {
  id: string;
  slideId: string;
  slideNumber: number;
  severity: 'warning' | 'info' | 'critical';
  category:
    | 'density'
    | 'font-size'
    | 'duplicate-title'
    | 'structure'
    | 'unverified-claim'
    | 'incomplete-reference'
    | 'out-of-bounds';
  title: string;
  description: string;
  suggestion: string;
}
