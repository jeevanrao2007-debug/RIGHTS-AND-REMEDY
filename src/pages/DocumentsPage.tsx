import React, { useState, useCallback } from 'react';
import {
  Upload,
  FileText,
  AlertTriangle,
  Clock,
  ArrowRight,
  ShieldAlert,
  FileCheck,
  Copy,
  Check,
  HelpCircle,
  Scale,
  ListCheck,
} from 'lucide-react';
import { api } from '../services/api';
import type { DocumentAnalysisResult, DocumentAnalysisMode } from '../types/legal';
import { LoadingState } from '../components/common/LoadingState';
import { ErrorState } from '../components/common/ErrorState';
import { LegalDisclaimerBanner } from '../components/common/LegalDisclaimerBanner';

const DOCUMENT_ANALYSIS_MODES: { id: DocumentAnalysisMode; title: string; desc: string }[] = [
  {
    id: 'explain_simply',
    title: 'Explain Simply',
    desc: 'Translate legal phrasing into plain English summaries',
  },
  {
    id: 'find_obligations',
    title: 'Find Obligations',
    desc: 'Identify what duties and promises each party agreed to',
  },
  {
    id: 'find_important_clauses',
    title: 'Important Clauses',
    desc: 'Highlight critical provisions, indemnities, and terms',
  },
  {
    id: 'identify_potential_risks',
    title: 'Identify Potential Risks',
    desc: 'Flag one-sided terms, liability shifts, and red flags',
  },
  {
    id: 'find_dates_deadlines',
    title: 'Dates & Deadlines',
    desc: 'Extract notice windows, renewal cutoff dates, and timelines',
  },
  {
    id: 'find_inconsistencies',
    title: 'Find Inconsistencies',
    desc: 'Detect contradictory language or ambiguous phrasing',
  },
  {
    id: 'ask_questions',
    title: 'Ask Specific Question',
    desc: 'Get an answer to a specific question about this document',
  },
];

export const DocumentsPage: React.FC = () => {
  const [documentName, setDocumentName] = useState<string>('');
  const [textContent, setTextContent] = useState<string>('');
  const [mode, setMode] = useState<DocumentAnalysisMode>('explain_simply');
  const [userQuestion, setUserQuestion] = useState<string>('');
  const [fileSize, setFileSize] = useState<number | undefined>(undefined);
  const [isUploading, setIsUploading] = useState<boolean>(false);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<DocumentAnalysisResult | null>(null);
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  // Helper to safely extract text from uploaded files using backend or client reader
  const processUploadedFile = async (file: File) => {
    setDocumentName(file.name);
    setFileSize(file.size);
    setError(null);

    // Enforce 10MB file limit
    if (file.size > 10 * 1024 * 1024) {
      setError('File size exceeds the 10MB limit. Please upload a smaller document.');
      return;
    }

    const isBinaryFormat = /\.(pdf|docx?|pages)$/i.test(file.name);

    if (isBinaryFormat) {
      setIsUploading(true);
      try {
        const uploadRes = await api.uploadDocument(file);
        if (uploadRes.extractedText && uploadRes.extractedText.length > 20) {
          setTextContent(uploadRes.extractedText);
          setIsUploading(false);
          return;
        }
      } catch (uploadErr: any) {
        console.warn('Backend document upload extraction error:', uploadErr);
      }
      setIsUploading(false);
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const raw = event.target?.result as string;
      if (!raw) return;

      if (isBinaryFormat) {
        setError(
          'For binary files (PDF/DOCX), please ensure the backend is running for automated parsing, or copy and paste the clauses directly into the text box below.'
        );
        setTextContent(`[Uploaded Document: ${file.name}]\n\n(Paste clauses or agreement text here for review)`);
      } else {
        setTextContent(raw);
      }
    };

    reader.onerror = () => {
      setError('Unable to read text from uploaded file. You can paste the text directly into the box below.');
    };

    reader.readAsText(file);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processUploadedFile(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) processUploadedFile(file);
  };

  // Pre-loaded realistic sample documents for immediate testing
  const loadSampleDocument = (type: 'lease' | 'severance' | 'debt') => {
    setError(null);
    if (type === 'lease') {
      setDocumentName('California_Residential_Lease_Excerpt.txt');
      setFileSize(1840);
      setTextContent(`RESIDENTIAL LEASE AGREEMENT (EXCERPT)
Premises: 742 Evergreen Terrace, Unit 4B, Los Angeles, CA 90028
Landlord: Pacific Coast Properties LLC | Tenant: Jane Doe

SECTION 5: SECURITY DEPOSIT
5.1 Amount: Tenant has deposited the sum of $2,400.00 as a Security Deposit.
5.2 Return of Deposit: Within twenty-one (21) days after Tenant vacates the Premises, Landlord shall provide Tenant with a full refund of the Security Deposit or an itemized statement detailing any deductions along with copies of invoices or receipts, pursuant to California Civil Code § 1950.5.
5.3 Allowable Deductions: Landlord may deduct amounts reasonably necessary to remedy defaults in rent, repair damages caused by Tenant beyond normal wear and tear, and clean the premises to initial condition. Landlord shall not deduct for ordinary aging, routine paint scuffs, or standard carpet wear resulting from reasonable everyday living.
5.4 Pre-Move-Out Inspection: Landlord agrees to notify Tenant in writing of Tenant's right to request an initial inspection prior to vacating, allowing Tenant an opportunity to cure identified deficiencies before final deductions are assessed.

SECTION 12: REPAIRS AND HABITABILITY
12.1 Landlord Obligations: Landlord shall maintain plumbing, heating, waterproofing, and electrical systems in safe, functional working condition as required by California Civil Code § 1941.1. Tenant shall deliver written notice of necessary repairs, and Landlord shall initiate repairs within 30 days or sooner if health and safety are affected.`);
    } else if (type === 'severance') {
      setDocumentName('Separation_and_Release_Agreement.txt');
      setFileSize(2150);
      setTextContent(`CONFIDENTIAL SEPARATION AND RELEASE AGREEMENT
Employer: Apex Technology Solutions, Inc. | Employee: John Smith
Date of Separation: October 14, 2025

SECTION 2: FINAL COMPENSATION AND SEVERANCE
2.1 Final Wages: Employer shall pay Employee all earned but unpaid base salary, accrued but unused paid time off (PTO), and reimbursable business expenses up through the Separation Date on the Separation Date, pursuant to California Labor Code §§ 201 and 2802.
2.2 Severance Payment: In exchange for the comprehensive waiver and release set forth in Section 4, Employer offers a severance payment equal to eight (8) weeks of base salary ($18,000.00), payable in a lump sum within fifteen (15) business days following expiration of the revocation period.
2.3 Consideration Period: Employee has twenty-one (21) calendar days from receipt of this Agreement to consider its terms before signing, and a period of seven (7) calendar days following execution to revoke acceptance in writing.

SECTION 6: RESTRICTIVE COVENANTS
6.1 Non-Solicitation & Confidentiality: Employee agrees to preserve proprietary company data. Any non-competition covenant is explicitly subject to California Business and Professions Code § 16600, which declares void any contract restraining lawful profession, trade, or business.`);
    } else if (type === 'debt') {
      setDocumentName('Notice_of_Collection_and_Validation.txt');
      setFileSize(1420);
      setTextContent(`NOTICE OF INTENT TO COLLECT DEBT
Date of Notice: November 5, 2025
Account Ref: #MED-8849201 | Creditor: Metropolitan Health Center
Collection Agency: Apex Recovery Services, LLC | Balance Claimed: $1,845.50

IMPORTANT NOTICE REGARDING YOUR RIGHTS UNDER FEDERAL LAW:
This communication is from a debt collector. This is an attempt to collect a debt and any information obtained will be used for that purpose.

NOTICE OF VALIDATION PERIOD:
Unless you, within thirty (30) days after receipt of this notice, dispute the validity of the debt, or any portion thereof, the debt will be assumed to be valid by this office.
If you notify this office in writing within the thirty-day period that the debt, or any portion thereof, is disputed, this office will obtain verification of the debt or a copy of a judgment against you and a copy of such verification or judgment will be mailed to you by this office pursuant to the Fair Debt Collection Practices Act (15 U.S.C. § 1692g).
Upon your written request within the thirty-day period, this office will provide you with the name and address of the original creditor, if different from the current creditor.`);
    }
  };

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!textContent.trim()) {
        setError('Please provide or upload document text to review.');
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const response = await api.analyzeDocument({
          documentName: documentName || 'Legal Document',
          textContent: textContent.trim(),
          mode,
          userQuestion: mode === 'ask_questions' ? userQuestion : undefined,
          fileSize,
        });

        setResult(response);
      } catch (err: any) {
        console.error('Error analyzing document:', err);
        setError(err.message || 'Failed to analyze document. Please check your text and retry.');
      } finally {
        setIsLoading(false);
      }
    },
    [documentName, textContent, mode, userQuestion, fileSize]
  );

  const copyToClipboard = useCallback((text: string, sectionId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(sectionId);
    setTimeout(() => {
      setCopiedSection(null);
    }, 2000);
  }, []);

  const modes = DOCUMENT_ANALYSIS_MODES;

  return (
    <div className="min-h-screen bg-slate-50 pb-16">
      <header className="border-b border-slate-200 bg-white py-8 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl space-y-2">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">
            <FileText className="h-4 w-4 text-slate-700" />
            <span>Document Review & Intelligence</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Analyze Legal Documents & Notices
          </h1>
          <p className="text-sm text-slate-600 max-w-3xl leading-relaxed">
            Upload lease agreements, employment contracts, dispute letters, or formal notices.
            Review plain-language explanations, commitments, risks, and questions before signing.
          </p>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
        <LegalDisclaimerBanner variant="compact" />

        {/* Input Form Card */}
        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-7 shadow-xs space-y-6"
        >
          {/* Analysis Mode Selector */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
              1. Choose Analysis Objective
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
              {modes.map((m) => {
                const isSelected = mode === m.id;
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setMode(m.id)}
                    className={`rounded-xl border p-3 text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'border-slate-900 bg-slate-900 text-white shadow-xs'
                        : 'border-slate-200 bg-white text-slate-800 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="text-xs font-bold">{m.title}</div>
                    <div
                      className={`text-[11px] mt-1 ${
                        isSelected ? 'text-slate-300' : 'text-slate-500'
                      }`}
                    >
                      {m.desc}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Conditional: Targeted question input */}
          {mode === 'ask_questions' && (
            <div className="space-y-1.5">
              <label htmlFor="user-question-input" className="text-xs font-bold text-slate-800">
                What specific question do you want answered about this document?
              </label>
              <input
                type="text"
                id="user-question-input"
                value={userQuestion}
                onChange={(e) => setUserQuestion(e.target.value)}
                placeholder="e.g. Can my landlord deduct for normal wear and tear? What notice is required to terminate?"
                className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-900 focus:outline-hidden focus:ring-1 focus:ring-slate-900 shadow-xs"
              />
            </div>
          )}

          {/* Drag & Drop File Upload Area */}
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            className="rounded-xl border-2 border-dashed border-slate-300 bg-slate-50/60 p-6 text-center hover:border-slate-400 transition-colors"
          >
            <Upload className="mx-auto h-8 w-8 text-slate-400" />
            <div className="mt-2 text-sm text-slate-700">
              <label
                htmlFor="file-upload-input"
                className="font-semibold text-slate-900 hover:underline cursor-pointer"
              >
                Upload a document file
              </label>
              <span className="text-slate-500"> or drag and drop</span>
              <input
                id="file-upload-input"
                type="file"
                accept=".txt,.md,.json,.pdf,.doc,.docx,.rtf"
                onChange={handleFileUpload}
                className="sr-only"
              />
            </div>
            <p className="mt-1 text-xs text-slate-500">
              Plain text (.txt, .md), agreements, or notices up to 10MB
            </p>

            <div role="status" aria-live="polite">
              {isUploading ? (
                <div className="mt-3 inline-flex items-center gap-2 rounded-lg bg-indigo-50 border border-indigo-200 px-3 py-1 text-xs font-semibold text-indigo-800">
                  <Clock className="h-3.5 w-3.5 text-indigo-600 animate-spin" aria-hidden="true" />
                  <span>Safely parsing document structure and extracting text...</span>
                </div>
              ) : documentName ? (
                <div className="mt-3 inline-flex items-center gap-2 rounded-lg bg-white border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-800 shadow-xs">
                  <FileCheck className="h-3.5 w-3.5 text-emerald-600" aria-hidden="true" />
                  <span>{documentName}</span>
                  {fileSize && (
                    <span className="text-slate-400">({Math.round(fileSize / 1024)} KB)</span>
                  )}
                </div>
              ) : null}
            </div>
          </div>

          {/* Quick-Load Sample Documents */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="text-xs font-semibold text-slate-500">Or try a sample agreement:</span>
            <button
              type="button"
              onClick={() => loadSampleDocument('lease')}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 hover:border-slate-400 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <span>🏡 Residential Lease</span>
            </button>
            <button
              type="button"
              onClick={() => loadSampleDocument('severance')}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 hover:border-slate-400 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <span>💼 Severance Agreement</span>
            </button>
            <button
              type="button"
              onClick={() => loadSampleDocument('debt')}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 hover:border-slate-400 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <span>📋 Debt Collection Notice</span>
            </button>
          </div>

          {/* Paste Document Text (Fallback & Direct Entry) */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label
                htmlFor="document-text-textarea"
                className="text-xs font-bold uppercase tracking-wider text-slate-700"
              >
                Or Paste Document Text Directly
              </label>
              <span className="text-xs text-slate-400">
                {textContent.length > 0 ? `${textContent.length.toLocaleString()} characters` : ''}
              </span>
            </div>
            <textarea
              id="document-text-textarea"
              rows={8}
              value={textContent}
              onChange={(e) => setTextContent(e.target.value)}
              placeholder="Paste clauses, lease text, termination letter, severance terms, or disputed contract language here..."
              className="w-full rounded-xl border border-slate-300 bg-white p-3.5 font-mono text-xs text-slate-900 placeholder:text-slate-400 focus:border-slate-900 focus:outline-hidden focus:ring-1 focus:ring-slate-900 leading-relaxed shadow-xs"
            />
          </div>

          {/* Action Row */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-100">
            <p className="text-[11px] text-slate-500 max-w-md">
              Documents are processed securely. Information is analyzed for your review and not shared publicly.
            </p>

            <button
              type="submit"
              id="analyze-document-submit"
              disabled={isLoading || !textContent.trim()}
              className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-5 py-2.5 text-xs font-semibold text-white hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed shadow-xs transition-colors cursor-pointer"
            >
              <span>Analyze Document</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </form>

        {/* Loading Indicator */}
        {isLoading && (
          <LoadingState message="Analyzing document language, extracting key clauses, and identifying obligations..." />
        )}

        {/* Error Notice */}
        {error && (
          <ErrorState
            title="Analysis Error"
            message={error}
            onRetry={() => handleSubmit({ preventDefault: () => {} } as any)}
          />
        )}

        {/* Analysis Results Display */}
        {result && !isLoading && (
          <div className="space-y-6 pt-2">
            {/* Executive Overview Header */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-7 shadow-xs space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <span className="rounded-xs bg-slate-900 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
                    {(result.selectedMode || mode || 'explain_simply').replace(/_/g, ' ')}
                  </span>
                  <h2 className="text-lg font-bold text-slate-900">
                    {result.documentName}
                  </h2>
                </div>

                <span className="text-xs text-slate-400">
                  Reviewed {new Date(result.uploadedAt).toLocaleDateString()}
                </span>
              </div>

              <div className="text-xs sm:text-sm text-slate-700 leading-relaxed pt-1">
                <strong className="text-slate-900 block mb-1">Executive Summary:</strong>
                {result.executiveSummary}
              </div>
            </div>

            {/* Document Findings */}
            {result.findings && result.findings.length > 0 && (
              <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-7 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div>
                    <h3 className="text-base font-bold text-slate-900">
                      Key Findings & Provisions
                    </h3>
                    <p className="text-xs text-slate-500">
                      Core provisions and their plain-language legal implications.
                    </p>
                  </div>
                  <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-700">
                    {result.findings.length} findings
                  </span>
                </div>

                <div className="space-y-3">
                  {result.findings.map((finding) => (
                    <div
                      key={finding.id}
                      className="rounded-xl border border-slate-200 bg-slate-50/60 p-4 space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                            {finding.topic}
                          </h4>
                          {finding.location && (
                            <span className="rounded-xs bg-slate-200 px-1.5 py-0.5 text-[10px] font-medium text-slate-700">
                              {finding.location}
                            </span>
                          )}
                        </div>

                        {finding.riskLevel && (
                          <span
                            className={`rounded-xs px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${
                              finding.riskLevel === 'high'
                                ? 'bg-red-700 text-white'
                                : finding.riskLevel === 'medium'
                                ? 'bg-amber-600 text-white'
                                : 'bg-slate-200 text-slate-700'
                            }`}
                          >
                            {finding.riskLevel}
                          </span>
                        )}
                      </div>

                      {finding.excerpt && (
                        <div className="rounded-lg bg-white p-3 border border-slate-200 font-mono text-[11px] text-slate-700 leading-relaxed">
                          "{finding.excerpt}"
                        </div>
                      )}

                      <p className="text-xs text-slate-700 leading-relaxed">
                        <strong className="text-slate-900 font-semibold">Plain English Explanation: </strong>
                        {finding.explanation}
                      </p>

                      {finding.recommendation && (
                        <div className="rounded-md bg-white p-2.5 border border-slate-200 text-xs text-slate-800">
                          <strong className="text-slate-900 font-semibold">Recommendation: </strong>
                          {finding.recommendation}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Dates and Deadlines */}
            {result.datesAndDeadlines && result.datesAndDeadlines.length > 0 && (
              <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-7 shadow-xs space-y-4">
                <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-bold text-slate-900">
                      Dates & Deadlines Identified
                    </h3>
                    <p className="text-xs text-slate-500">
                      Contractual timeframes, notice periods, and critical dates.
                    </p>
                  </div>
                  <Clock className="h-4 w-4 text-slate-400" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {result.datesAndDeadlines.map((item, idx) => (
                    <div
                      key={idx}
                      className="rounded-xl border border-amber-200 bg-amber-50/30 p-4 space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="rounded-md bg-amber-200 px-2 py-0.5 text-xs font-bold text-amber-950">
                          {item.date}
                        </span>
                        {item.clauseReference && (
                          <span className="text-[10px] text-slate-500 font-mono">
                            {item.clauseReference}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-800 font-medium">
                        {item.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Potential Risks */}
            {result.potentialRisks && result.potentialRisks.length > 0 && (
              <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-7 shadow-xs space-y-4">
                <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-bold text-slate-900">
                      Potential Risks & Adverse Terms
                    </h3>
                    <p className="text-xs text-slate-500">
                      Terms that warrant scrutiny before agreement or formal response.
                    </p>
                  </div>
                  <span className="rounded-full bg-red-50 text-red-700 px-2.5 py-0.5 text-xs font-semibold border border-red-200">
                    {result.potentialRisks.length} flagged
                  </span>
                </div>

                <div className="space-y-3">
                  {result.potentialRisks.map((item, idx) => (
                    <div
                      key={idx}
                      className="rounded-xl border border-red-200 bg-red-50/30 p-4 space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="h-4 w-4 text-red-600 shrink-0" />
                          <span className="text-xs font-bold text-red-950">
                            {item.risk}
                          </span>
                        </div>
                        <span
                          className={`rounded-xs px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${
                            item.severity === 'high'
                              ? 'bg-red-700 text-white'
                              : item.severity === 'medium'
                              ? 'bg-amber-600 text-white'
                              : 'bg-slate-200 text-slate-700'
                          }`}
                        >
                          {item.severity} severity
                        </span>
                      </div>
                      {item.clauseReference && (
                        <p className="text-[11px] text-slate-500 font-mono">
                          Clause: {item.clauseReference}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Answers to User Questions */}
            {result.answersToUserQuestions && result.answersToUserQuestions.length > 0 && (
              <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-7 shadow-xs space-y-4">
                <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-bold text-slate-900">
                      Answer to Your Question
                    </h3>
                    <p className="text-xs text-slate-500">
                      Plain-language response grounded in the provided document text.
                    </p>
                  </div>
                  <HelpCircle className="h-4 w-4 text-slate-400" />
                </div>

                <div className="space-y-3">
                  {result.answersToUserQuestions.map((qa, idx) => (
                    <div
                      key={idx}
                      className="rounded-xl border border-slate-200 bg-slate-50/80 p-4 space-y-2"
                    >
                      <h4 className="text-xs font-bold text-slate-900">
                        Q: {qa.question}
                      </h4>
                      <p className="text-xs text-slate-700 leading-relaxed bg-white p-3 rounded-lg border border-slate-200">
                        {qa.answer}
                      </p>
                      {qa.references && (
                        <p className="text-[11px] text-slate-500">
                          <strong>Reference: </strong> {qa.references}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
