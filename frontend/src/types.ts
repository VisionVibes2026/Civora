export type Language = 'en' | 'ta' | 'hi' | 'te' | 'kn';

export type ViewMode = 'home' | 'chat' | 'schemes' | 'laws' | 'grievance' | 'documents';

export interface Jurisdiction {
  state: string;
  cooperativeType: string;
  authority: string;
  policy: string;
}

export interface SourceCitation {
  label: string;
  actOrScheme: string;
  section: string;
  version: string;
  effectiveDate: string;
  trustBadge: string;
  confidence: number;
}

export interface NextAction {
  label: string;
  actionType: 'grievance' | 'documents' | 'laws' | 'schemes' | 'query';
  payload?: string;
}

export interface AssistantResponseStructure {
  directAnswer: string;
  explanation: string;
  importantPoints: string[];
  nextActions: NextAction[];
}

export interface AttachedDocState {
  label: string;
  status: 'success' | 'pending' | 'error';
  details: string[];
}

export interface VerificationState {
  label: string;
  steps: string[];
}

export interface VerifiedAnswer {
  title: string;
  content: string;
  source: string;
  actions: string[];
}

export interface OfficialSupportCardData {
  title: string;
  portal: string;
  helpline: string;
}

export interface CropLossSummaryCardData {
  crop: string;
  location: string;
  cause: string;
  loan: string;
  insurance: string;
  incident: string;
  isDemoData: boolean;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  originalEnglishText?: string;
  tamilText?: string;
  jurisdiction?: Jurisdiction;
  source?: SourceCitation;
  assistantStructure?: AssistantResponseStructure;
  isLowConfidence?: boolean;
  attachedDocName?: string;
  attachedDocState?: AttachedDocState;
  verificationState?: VerificationState;
  verifiedAnswer?: VerifiedAnswer;
  audioUrl?: string;
  officialSupportCard?: OfficialSupportCardData;
  summaryReportCard?: CropLossSummaryCardData;
  demoStepIndex?: number;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: string;
  language: Language;
}

export interface GrievanceDraft {
  issueType: string;
  description: string;
  state: string;
  societyName: string;
  societyType: string;
  memberId?: string;
  generatedText: string;
  referenceNo: string;
  createdAt: string;
}

export interface DocumentAnalysis {
  documentName: string;
  documentType: string;
  extractedTextSnippet: string;
  whatItIs: string;
  keyPoints: string[];
  requiredActions: string[];
  verificationStatus: 'verified' | 'needs_clarification' | 'unverified';
  detectedAuthority: string;
}

export interface CooperativeScheme {
  id: string;
  title: string;
  shortDescription: string;
  sector: 'Agriculture' | 'Credit' | 'Dairy' | 'Multi-purpose' | 'Housing';
  state: string;
  benefits: string[];
  eligibleEntities: string[];
  requiredDocuments: string[];
  officialSource: string;
  version: string;
}

export interface LegalSection {
  sectionNumber: string;
  title: string;
  description: string;
}

export interface CooperativeLaw {
  id: string;
  actTitle: string;
  jurisdiction: string;
  summary: string;
  keySections: LegalSection[];
  effectiveDate: string;
}
