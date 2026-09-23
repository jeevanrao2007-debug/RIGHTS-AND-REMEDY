import { authService } from './auth';
import { firestoreService } from './firestore';
import {
  buildGroundedFallbackIntake,
  buildGroundedFallbackAnalysis,
  buildDocumentAnalysisFallback,
  initialCase as demoCase,
} from './legalEngine';
import type {
  LegalAnalysisResult,
  IntakeDraft,
  FollowUpQuestion,
  DocumentAnalysisResult,
  DocumentAnalysisMode,
  EvidenceStatus,
  CaseListItem,
} from '../types/legal';

export interface InitialAnalysisResponse {
  category: string;
  extractedFacts: string[];
  missingInformation: string[];
  followUpQuestions: FollowUpQuestion[];
}

export interface ApiError {
  message: string;
  status?: number;
  details?: string;
}

export function normalizeAnalysisResult(raw: any): LegalAnalysisResult {
  if (!raw) throw new Error('Empty analysis result');

  // If already standard camelCase
  if (raw.situationSummary && raw.remedyPath && raw.potentiallyRelevantRights) {
    return raw as LegalAnalysisResult;
  }

  // Map from FastAPI LegalAnalysis (snake_case)
  const situationSummary = {
    coreFacts: raw.core_facts || (raw.situationSummary ? raw.situationSummary.coreFacts : []),
    keyLegalIssues: [raw.situation_issue || raw.primaryIssue || 'Civil legal issue'],
    clarificationsProvided: raw.missing_or_uncertain_information || [],
  };

  const potentiallyRelevantRights = (raw.potentially_relevant_rights || raw.potentiallyRelevantRights || []).map(
    (r: any, idx: number) => ({
      id: r.id || `right-${idx + 1}`,
      title: r.title || 'Potentially Relevant Statutory Right',
      plainLanguageExplanation: r.plain_language_explanation || r.plainLanguageExplanation || '',
      whyRelevant: r.why_relevant || r.whyRelevant || '',
      supportingSource: r.supporting_citation
        ? {
            id: r.supporting_citation.source_id || `src-${idx + 1}`,
            title: r.supporting_citation.source_title || 'Statute',
            authority: r.supporting_citation.authority || 'State Authority',
            provision: r.supporting_citation.provision,
            url: r.supporting_citation.source_url,
            sourceType: r.supporting_citation.source_type || 'statute',
            status: r.supporting_citation.verification_status || 'statutory',
          }
        : r.supportingSource || {
            id: `src-gen-${idx + 1}`,
            title: 'Statutory Authority',
            authority: raw.jurisdiction_country || 'Jurisdiction',
            sourceType: 'statute',
            status: 'statutory',
          },
      sourceStatus: r.sourceStatus || 'statutory',
    })
  );

  const possibleRemedies = (raw.possible_remedies || raw.possibleRemedies || []).map(
    (rem: any, idx: number) => ({
      id: rem.id || `rem-${idx + 1}`,
      title: rem.title || 'Potential Remedy Step',
      description: rem.description || '',
      prerequisites: rem.qualifications ? [rem.qualifications] : rem.prerequisites || [],
      relevantEvidence: rem.basis_sources || rem.relevantEvidence || [],
      uncertainty: rem.qualifications || rem.uncertainty,
    })
  );

  const remedyPath =
    raw.remedyPath || [
      {
        stepNumber: 1,
        title: 'Document the Situation',
        stage: 'situation' as const,
        summary: 'Establish an accurate, organized timeline and factual inventory.',
        detailedGuidance: 'Keep records of all written communications, dates, receipts, and formal notices.',
        keyPoints: ['Preserve emails/SMS', 'Log timeline of events', 'Identify key parties'],
      },
      {
        stepNumber: 2,
        title: 'Understand Potentially Relevant Rights',
        stage: 'understand_right' as const,
        summary: 'Review applicable statutory protections and definitions.',
        detailedGuidance: 'Review governing statutes to understand standard legal standards and expectations.',
        keyPoints: ['Check local statutes', 'Confirm timeline requirements'],
      },
      {
        stepNumber: 3,
        title: 'Gather & Organize Evidence',
        stage: 'gather_evidence' as const,
        summary: 'Compile the supporting documentation identified in your Evidence Checklist.',
        detailedGuidance: 'Match each claimed issue with corresponding photos, invoices, contracts, or notices.',
        keyPoints: ['Use checklist below', 'Secure copies', 'Store securely'],
      },
      {
        stepNumber: 4,
        title: 'First Action: Formal Notice or Demand',
        stage: 'first_action' as const,
        summary: 'Deliver a clear, formal written communication citing specific facts.',
        detailedGuidance: 'Send a professional demand or notification setting a reasonable timeline for response.',
        keyPoints: ['Send in writing', 'Keep proof of delivery', 'Remain objective'],
      },
      {
        stepNumber: 5,
        title: 'Escalation & Professional Counsel',
        stage: 'escalation' as const,
        summary: 'Evaluate regulatory complaints, mediation, small claims, or legal representation.',
        detailedGuidance: 'If the matter remains unresolved after notice, consider regulatory filing or consulting a licensed attorney.',
        keyPoints: ['Consult attorney', 'File agency complaint if eligible', 'Assess small claims limit'],
      },
    ];

  const evidenceChecklist = (raw.evidence_checklist || raw.evidenceChecklist || []).map(
    (ev: any, idx: number) => ({
      id: ev.id || `ev-${idx + 1}`,
      name: ev.name || 'Supporting Document',
      whyItMatters: ev.why_it_may_matter || ev.whyItMatters || 'Supports factual claims.',
      status: (ev.status as any) || 'need',
    })
  );

  const importantDates = raw.importantDates || {
    hasVerifiedDeadline: Boolean(raw.has_verified_deadline),
    deadlineDescription: raw.verified_deadlines?.[0]?.date_or_period,
    dateOrTimeframe: raw.verified_deadlines?.[0]?.date_or_period,
    whatTriggersIt: raw.verified_deadlines?.[0]?.triggering_event,
    explanation:
      raw.deadline_limitation_note ||
      (raw.has_verified_deadline
        ? 'Verified statutory deadline applicable to this jurisdiction.'
        : 'No verified deadline was identified from the available sources.'),
  };

  const possibleNextSteps = (raw.possible_next_steps || raw.possibleNextSteps || []).map(
    (stepText: any, idx: number) => {
      if (typeof stepText === 'string') {
        return {
          step: stepText,
          timeline: idx === 0 ? 'Immediate (1-3 days)' : 'Short-term (1-2 weeks)',
          details: 'Review and complete this action item.',
          urgency: idx === 0 ? ('immediate' as const) : ('short_term' as const),
        };
      }
      return stepText;
    }
  );

  const questionsForLegalProfessional = (raw.lawyer_questions || raw.questionsForLegalProfessional || []).map(
    (q: any, idx: number) => ({
      id: q.id || `q-lawyer-${idx + 1}`,
      question: q.question || 'What is the applicable statute of limitations?',
      context: q.context_and_purpose || q.context || 'Provides clarity on strategic timing.',
      priority: 'high' as const,
    })
  );

  const sources = (raw.validated_sources || raw.citations || raw.sources || []).map((s: any, idx: number) => ({
    id: s.source_id || s.id || `src-${idx + 1}`,
    title: s.source_title || s.title || 'Legal Source',
    authority: s.authority || 'State Code',
    provision: s.provision,
    dateOrVersion: s.dateOrVersion,
    url: s.source_url || s.url,
    sourceType: s.source_type || s.sourceType || 'statute',
    status: s.verification_status || s.status || 'statutory',
  }));

  return {
    id: raw.id || `case-${Date.now()}`,
    userId: raw.user_id || raw.userId,
    title: raw.title || 'Situation Legal Analysis',
    createdAt: raw.created_at || raw.createdAt || new Date().toISOString(),
    updatedAt: raw.updated_at || raw.updatedAt || new Date().toISOString(),
    category: raw.category || 'Other',
    primaryIssue: raw.situation_issue || raw.primaryIssue || 'Civil dispute',
    jurisdiction: {
      country: raw.jurisdiction_country || raw.jurisdiction?.country || 'United States',
      stateOrRegion: raw.jurisdiction_state || raw.jurisdiction?.stateOrRegion || '',
    },
    originalNarrative: raw.narrative || raw.originalNarrative || '',
    answersSummary: raw.clarifications || raw.answersSummary || {},
    situationSummary,
    potentiallyRelevantRights,
    possibleRemedies,
    remedyPath,
    evidenceChecklist,
    importantDates,
    possibleNextSteps,
    questionsForLegalProfessional,
    sources,
  };
}

class ApiClient {
  private readonly baseUrl: string;
  private readonly defaultTimeoutMs: number;
  private readonly cacheTtlMs = 60000; // 60s cache TTL for read efficiency
  private caseCache = new Map<string, { data: LegalAnalysisResult; timestamp: number }>();
  private casesListCache: { data: CaseListItem[]; timestamp: number } | null = null;
  private docAnalysisCache = new Map<string, { data: DocumentAnalysisResult; timestamp: number }>();

  constructor() {
    this.baseUrl = import.meta.env.VITE_API_BASE_URL || '/api';
    this.defaultTimeoutMs = 60000; // 60s for deep legal reasoning
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
    timeoutMs: number = this.defaultTimeoutMs
  ): Promise<T> {
    const token = await authService.getIdToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...options,
        headers,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      const contentType = response.headers.get('content-type') || '';
      const rawText = await response.text();
      const isHtml =
        rawText.includes('<!DOCTYPE') ||
        rawText.includes('<!doctype') ||
        rawText.includes('<html') ||
        contentType.includes('text/html');

      if (!response.ok) {
        let errorMessage = `API request to "${this.baseUrl}${endpoint}" failed with status ${response.status} (${response.statusText})`;
        let details: string | undefined;

        if (contentType.includes('application/json')) {
          try {
            const errorData = JSON.parse(rawText);
            errorMessage = errorData.error || errorData.message || errorMessage;
            details = errorData.details;
          } catch {
            // failed parsing error json
          }
        } else if (isHtml) {
          errorMessage = `The API endpoint returned an HTML document (Status ${response.status}) instead of JSON. Ensure the backend server is running and accessible at "${this.baseUrl}".`;
          details = rawText.slice(0, 300);
        } else if (rawText.trim().length > 0) {
          errorMessage = rawText.slice(0, 300);
        }

        const error: ApiError = {
          status: response.status,
          message: errorMessage,
          details,
        };
        throw error;
      }

      // Check if 200 OK was returned, but content is HTML (SPA rewrite catch-all)
      if (isHtml || !contentType.includes('application/json')) {
        const error: ApiError = {
          status: 404,
          message: `The API route "${this.baseUrl}${endpoint}" returned HTML instead of JSON (intercepted by static SPA hosting). Please verify the backend service URL (VITE_API_BASE_URL).`,
          details: rawText.slice(0, 300),
        };
        throw error;
      }

      try {
        return JSON.parse(rawText) as T;
      } catch (parseErr: any) {
        throw {
          status: 500,
          message: `Failed to parse JSON response from "${this.baseUrl}${endpoint}": ${parseErr.message}`,
          details: rawText.slice(0, 300),
        } as ApiError;
      }
    } catch (err: any) {
      clearTimeout(timeoutId);
      if (err.name === 'AbortError') {
        throw {
          status: 408,
          message: 'The legal analysis request timed out. Please verify your connection or try again.',
        } as ApiError;
      }
      if (err.message && !err.status) {
        throw {
          status: 0,
          message: err.message || 'Network connection failed. Please ensure the server is active.',
        } as ApiError;
      }
      throw err as ApiError;
    }
  }

  // 1. Intake: Analyze initial natural language situation
  async analyzeInitialSituation(draft: {
    narrative: string;
    country: string;
    stateOrRegion?: string;
    category?: string;
  }): Promise<InitialAnalysisResponse> {
    try {
      return await this.request<InitialAnalysisResponse>('/intake/analyze-initial', {
        method: 'POST',
        body: JSON.stringify(draft),
      });
    } catch (err: any) {
      if (err.message === 'API_HTML_FALLBACK' || err.status === 404 || err.status === 0) {
        return buildGroundedFallbackIntake(
          draft.narrative,
          draft.country,
          draft.stateOrRegion,
          draft.category
        );
      }
      throw err;
    }
  }

  // 2. Complete Legal Analysis: Generates complete structured dashboard
  async completeLegalAnalysis(payload: {
    narrative: string;
    country: string;
    stateOrRegion?: string;
    category?: string;
    answers?: Record<string, any>;
  }): Promise<LegalAnalysisResult> {
    let result: LegalAnalysisResult;
    try {
      const raw = await this.request<any>('/intake/complete-analysis', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      result = normalizeAnalysisResult(raw);
    } catch (err: any) {
      if (err.message === 'API_HTML_FALLBACK' || err.status === 404 || err.status === 0) {
        const caseId = `case-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
        result = buildGroundedFallbackAnalysis(
          caseId,
          payload.narrative,
          {
            country: payload.country || 'United States',
            stateOrRegion: payload.stateOrRegion || '',
          },
          payload.category,
          payload.answers
        );
      } else {
        throw err;
      }
    }

    // Cache newly created case and invalidate case list cache
    this.caseCache.set(result.id, { data: result, timestamp: Date.now() });
    this.casesListCache = null;

    // Cache locally in sessionStorage for guest session resilience
    try {
      sessionStorage.setItem(`rrn_case_${result.id}`, JSON.stringify(result));
    } catch {}

    // Automatically sync case to Cloud Firestore if signed into Firebase
    try {
      if (firestoreService.isAvailable()) {
        await firestoreService.saveCase(result);
      }
    } catch (e) {
      console.warn('Could not mirror case to Cloud Firestore:', e);
    }

    return result;
  }

  // Safe file upload for PDF, DOCX, and TXT documents
  async uploadDocument(
    file: File,
    caseId?: string
  ): Promise<{ documentId: string; extractedText: string; filename: string }> {
    const formData = new FormData();
    formData.append('file', file);
    if (caseId) {
      formData.append('case_id', caseId);
    }

    const token = await authService.getIdToken();
    const headers: Record<string, string> = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${this.baseUrl}/documents`, {
      method: 'POST',
      body: formData,
      headers,
    });

    const contentType = response.headers.get('content-type') || '';
    const rawText = await response.text();
    const isHtml =
      rawText.includes('<!DOCTYPE') ||
      rawText.includes('<!doctype') ||
      rawText.includes('<html') ||
      contentType.includes('text/html');

    if (!response.ok || isHtml || !contentType.includes('application/json')) {
      let msg = `Document upload failed (Status ${response.status})`;
      if (isHtml) {
        msg = 'Document upload extraction requires active backend service. You can paste document clauses directly for review.';
      } else {
        try {
          const parsed = JSON.parse(rawText);
          msg = parsed.detail || parsed.error?.message || parsed.message || msg;
        } catch {}
      }
      throw new Error(msg);
    }

    let data: any;
    try {
      data = JSON.parse(rawText);
    } catch {
      throw new Error('Failed to parse document upload response as JSON');
    }

    return {
      documentId: data.document_id || data.id || `doc-${Date.now()}`,
      extractedText: data.extracted_text || data.extractedText || '',
      filename: data.filename || file.name,
    };
  }

  // 3. Document Analysis: Uploaded contract or policy review with smart memoization
  async analyzeDocument(payload: {
    documentName: string;
    textContent: string;
    fileSize?: number;
    mode: DocumentAnalysisMode;
    userQuestion?: string;
  }): Promise<DocumentAnalysisResult> {
    const cacheKey = `${payload.documentName}_${payload.mode}_${payload.userQuestion || ''}_${payload.textContent.length}_${payload.textContent.slice(0, 80)}`;
    const cached = this.docAnalysisCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < this.cacheTtlMs * 2) {
      return cached.data;
    }

    try {
      const result = await this.request<DocumentAnalysisResult>('/documents/analyze', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      this.docAnalysisCache.set(cacheKey, { data: result, timestamp: Date.now() });
      return result;
    } catch (err: any) {
      if (err.message === 'API_HTML_FALLBACK' || err.status === 404 || err.status === 0) {
        const docId = `doc-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
        const fallback = buildDocumentAnalysisFallback(
          docId,
          payload.documentName,
          payload.textContent,
          payload.mode,
          payload.userQuestion,
          payload.fileSize
        );
        this.docAnalysisCache.set(cacheKey, { data: fallback, timestamp: Date.now() });
        return fallback;
      }
      throw err;
    }
  }

  // 4. Cases Management
  async getCases(): Promise<CaseListItem[]> {
    if (this.casesListCache && Date.now() - this.casesListCache.timestamp < this.cacheTtlMs / 2) {
      return this.casesListCache.data;
    }

    // If authenticated with Firebase, fetch directly from Firestore
    try {
      const firestoreCases = await firestoreService.getCases();
      if (firestoreCases && firestoreCases.length > 0) {
        this.casesListCache = { data: firestoreCases, timestamp: Date.now() };
        return firestoreCases;
      }
    } catch (e) {
      console.warn('Firestore getCases fallback to local API:', e);
    }

    try {
      const cases = await this.request<CaseListItem[]>('/cases', {
        method: 'GET',
      });
      this.casesListCache = { data: cases, timestamp: Date.now() };
      return cases;
    } catch (err: any) {
      const demoList: CaseListItem[] = [
        {
          id: demoCase.id,
          title: demoCase.title,
          category: demoCase.category,
          jurisdiction: demoCase.jurisdiction,
          createdAt: demoCase.createdAt,
          updatedAt: demoCase.updatedAt,
          status: 'active',
          checklistCompletedCount: demoCase.evidenceChecklist.filter((e) => e.status === 'have').length,
          checklistTotalCount: demoCase.evidenceChecklist.length,
        },
      ];
      const sessionCases: CaseListItem[] = [];
      try {
        for (let i = 0; i < sessionStorage.length; i++) {
          const key = sessionStorage.key(i);
          if (key && key.startsWith('rrn_case_')) {
            const parsed = JSON.parse(sessionStorage.getItem(key) || '{}');
            if (parsed.id && parsed.title) {
              sessionCases.push({
                id: parsed.id,
                title: parsed.title,
                category: parsed.category || 'Other',
                jurisdiction: parsed.jurisdiction || { country: 'General' },
                createdAt: parsed.createdAt || new Date().toISOString(),
                updatedAt: parsed.updatedAt || new Date().toISOString(),
                status: 'active',
                checklistCompletedCount: (parsed.evidenceChecklist || []).filter((e: any) => e.status === 'have').length,
                checklistTotalCount: (parsed.evidenceChecklist || []).length,
              });
            }
          }
        }
      } catch {}
      const combinedList = [...sessionCases, ...demoList.filter((d) => !sessionCases.some((s) => s.id === d.id))];
      this.casesListCache = { data: combinedList, timestamp: Date.now() };
      return combinedList;
    }
  }

  async getCaseById(caseId: string): Promise<LegalAnalysisResult> {
    const cached = this.caseCache.get(caseId);
    if (cached && Date.now() - cached.timestamp < this.cacheTtlMs) {
      return cached.data;
    }

    // Check local sessionStorage for resilient guest sessions
    try {
      const stored = sessionStorage.getItem(`rrn_case_${caseId}`);
      if (stored) {
        const parsed = JSON.parse(stored) as LegalAnalysisResult;
        this.caseCache.set(caseId, { data: parsed, timestamp: Date.now() });
        return parsed;
      }
    } catch {}

    // If authenticated with Firebase, fetch directly from Firestore
    try {
      const firestoreCase = await firestoreService.getCaseById(caseId);
      if (firestoreCase) {
        this.caseCache.set(caseId, { data: firestoreCase, timestamp: Date.now() });
        return firestoreCase;
      }
    } catch (e) {
      console.warn('Firestore getCaseById fallback to local API:', e);
    }

    try {
      const caseItem = await this.request<LegalAnalysisResult>(`/cases/${encodeURIComponent(caseId)}`, {
        method: 'GET',
      });
      this.caseCache.set(caseId, { data: caseItem, timestamp: Date.now() });
      return caseItem;
    } catch (err: any) {
      if (caseId === demoCase.id || caseId === 'case-demo-101') {
        this.caseCache.set(caseId, { data: demoCase, timestamp: Date.now() });
        return demoCase;
      }
      throw err;
    }
  }

  async updateEvidenceStatus(
    caseId: string,
    evidenceId: string,
    status: EvidenceStatus
  ): Promise<{ success: boolean; updatedAt: string }> {
    // Optimistically update cached case if present
    const cached = this.caseCache.get(caseId);
    if (cached) {
      const item = cached.data.evidenceChecklist.find((e) => e.id === evidenceId);
      if (item) {
        item.status = status;
        cached.data.updatedAt = new Date().toISOString();
      }
    }
    this.casesListCache = null;

    // Update in Firestore if available
    try {
      await firestoreService.updateEvidenceStatus(caseId, evidenceId, status);
    } catch (e) {
      console.warn('Firestore update evidence error:', e);
    }

    try {
      return await this.request<{ success: boolean; updatedAt: string }>(
        `/cases/${encodeURIComponent(caseId)}/evidence/${encodeURIComponent(evidenceId)}`,
        {
          method: 'PATCH',
          body: JSON.stringify({ status }),
        }
      );
    } catch (err: any) {
      return { success: true, updatedAt: new Date().toISOString() };
    }
  }

  async deleteCase(caseId: string): Promise<{ success: boolean }> {
    this.caseCache.delete(caseId);
    this.casesListCache = null;

    // Delete in Firestore if available
    try {
      await firestoreService.deleteCase(caseId);
    } catch (e) {
      console.warn('Firestore delete case error:', e);
    }

    try {
      return await this.request<{ success: boolean }>(`/cases/${encodeURIComponent(caseId)}`, {
        method: 'DELETE',
      });
    } catch (err: any) {
      return { success: true };
    }
  }

  async checkHealth(): Promise<{ status: string }> {
    try {
      return await this.request<{ status: string }>('/health', {
        method: 'GET',
      });
    } catch {
      return { status: 'healthy_client' };
    }
  }
}

export const api = new ApiClient();
