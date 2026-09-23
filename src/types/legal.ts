export type SituationCategory =
  | 'Employment'
  | 'Housing'
  | 'Consumer'
  | 'Family'
  | 'Contract'
  | 'Education'
  | 'Financial'
  | 'Other';

export interface Jurisdiction {
  country: string;
  stateOrRegion?: string;
}

export type QuestionType = 'text' | 'date' | 'yes_no' | 'single_choice' | 'multiple_choice';

export interface FollowUpQuestion {
  id: string;
  question: string;
  explanation?: string;
  type: QuestionType;
  options?: string[]; // for single_choice or multiple_choice
  required?: boolean;
}

export interface IntakeDraft {
  narrative: string;
  jurisdiction: Jurisdiction;
  category?: SituationCategory;
  extractedFacts?: string[];
  missingInformation?: string[];
  followUpQuestions?: FollowUpQuestion[];
  answers?: Record<string, string | string[] | boolean>;
}

export type SourceStatus = 'verified' | 'authoritative' | 'statutory' | 'unsupported';

export interface LegalSource {
  id: string;
  title: string;
  authority: string; // e.g. "US Department of Labor", "Fair Housing Act", "UK Employment Rights Act 1996"
  provision?: string; // e.g. "Section 7", "29 U.S.C. § 207"
  dateOrVersion?: string;
  url?: string;
  sourceType: 'statute' | 'regulation' | 'case_law' | 'official_guidance' | 'unsupported';
  status: SourceStatus;
  notes?: string;
}

export interface RelevantRight {
  id: string;
  title: string;
  plainLanguageExplanation: string;
  whyRelevant: string;
  supportingSource: LegalSource;
  sourceStatus: SourceStatus;
}

export interface LegalRemedy {
  id: string;
  title: string;
  description: string;
  prerequisites?: string[];
  relevantEvidence?: string[];
  supportingSource?: LegalSource;
  uncertainty?: string;
}

export interface RemedyPathStep {
  stepNumber: number;
  title: string;
  stage: 'situation' | 'understand_right' | 'gather_evidence' | 'first_action' | 'escalation';
  summary: string;
  detailedGuidance: string;
  keyPoints: string[];
}

export type EvidenceStatus = 'have' | 'need' | 'not_sure';

export interface EvidenceItem {
  id: string;
  name: string;
  whyItMatters: string;
  status: EvidenceStatus;
  category?: string;
}

export interface ImportantDate {
  hasVerifiedDeadline: boolean;
  deadlineDescription?: string;
  dateOrTimeframe?: string;
  whatTriggersIt?: string;
  explanation?: string;
  supportingSource?: LegalSource;
}

export interface LawyerQuestion {
  id: string;
  question: string;
  context: string;
  priority: 'high' | 'medium' | 'standard';
}

export interface LegalAnalysisResult {
  id: string;
  userId?: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  category: SituationCategory;
  primaryIssue: string;
  jurisdiction: Jurisdiction;
  originalNarrative: string;
  answersSummary?: Record<string, string>;
  
  // Structured dashboard cards
  situationSummary: {
    coreFacts: string[];
    keyLegalIssues: string[];
    clarificationsProvided: string[];
  };
  potentiallyRelevantRights: RelevantRight[];
  possibleRemedies: LegalRemedy[];
  remedyPath: RemedyPathStep[];
  evidenceChecklist: EvidenceItem[];
  importantDates: ImportantDate;
  possibleNextSteps: {
    step: string;
    timeline: string;
    details: string;
    urgency: 'immediate' | 'short_term' | 'medium_term';
  }[];
  questionsForLegalProfessional: LawyerQuestion[];
  sources: LegalSource[];
}

export type DocumentAnalysisMode =
  | 'explain_simply'
  | 'find_obligations'
  | 'find_important_clauses'
  | 'identify_potential_risks'
  | 'find_dates_deadlines'
  | 'find_inconsistencies'
  | 'ask_questions';

export interface DocumentFinding {
  id: string;
  location?: string; // e.g. "Section 4.2", "Page 2, Paragraph 3"
  excerpt?: string;
  topic: string;
  explanation: string;
  riskLevel?: 'high' | 'medium' | 'low' | 'neutral';
  recommendation?: string;
}

export interface DocumentAnalysisResult {
  id: string;
  documentName: string;
  fileSize: number;
  uploadedAt: string;
  selectedMode: DocumentAnalysisMode;
  executiveSummary: string;
  findings: DocumentFinding[];
  datesAndDeadlines?: {
    date: string;
    description: string;
    clauseReference?: string;
  }[];
  potentialRisks?: {
    risk: string;
    severity: 'high' | 'medium' | 'low';
    clauseReference?: string;
  }[];
  answersToUserQuestions?: {
    question: string;
    answer: string;
    references?: string;
  }[];
}

export interface CaseListItem {
  id: string;
  title: string;
  category: SituationCategory;
  jurisdiction: Jurisdiction;
  createdAt: string;
  updatedAt: string;
  status: 'active' | 'archived' | 'reviewed';
  checklistCompletedCount: number;
  checklistTotalCount: number;
}
