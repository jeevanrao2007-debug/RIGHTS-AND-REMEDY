import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Scale,
  MapPin,
  Tag,
  ArrowLeft,
  Printer,
  Share2,
  Calendar,
  AlertCircle,
  FileCheck2,
  Clock,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { api } from '../services/api';
import type { LegalAnalysisResult } from '../types/legal';
import { LoadingState } from '../components/common/LoadingState';
import { ErrorState } from '../components/common/ErrorState';
import { RightsSection } from '../components/analysis/RightsSection';
import { RemediesSection } from '../components/analysis/RemediesSection';
import { RemedyPathComponent } from '../components/analysis/RemedyPathComponent';
import { EvidenceChecklistComponent } from '../components/analysis/EvidenceChecklistComponent';
import { ImportantDatesComponent } from '../components/analysis/ImportantDatesComponent';
import { LawyerQuestionsComponent } from '../components/analysis/LawyerQuestionsComponent';
import { SourcesComponent } from '../components/analysis/SourcesComponent';
import { LegalDisclaimerBanner } from '../components/common/LegalDisclaimerBanner';

export const AnalysisPage: React.FC = () => {
  const { caseId } = useParams<{ caseId: string }>();
  const navigate = useNavigate();

  const [analysis, setAnalysis] = useState<LegalAnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!caseId) {
      navigate('/cases', { replace: true });
      return;
    }

    let isMounted = true;
    setIsLoading(true);
    setError(null);

    api
      .getCaseById(caseId)
      .then((data) => {
        if (isMounted) {
          setAnalysis(data);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err.message || 'Unable to retrieve case analysis.');
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [caseId, navigate]);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-20">
        <LoadingState
          stages={[
            'Loading legal situation analysis...',
            'Verifying rights and remedies...',
            'Preparing evidence status...',
          ]}
          subtext="Retrieving your complete Legal Situation Dashboard."
        />
      </div>
    );
  }

  if (error || !analysis) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16">
        <ErrorState
          title="Analysis Not Found"
          message={error || 'We could not locate this legal situation record.'}
          onRetry={() => navigate('/cases')}
          actionText="Go to My Cases"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20">
      {/* Top Disclaimer */}
      <LegalDisclaimerBanner variant="compact" />

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8 space-y-8" id="analysis-main-content">
        {/* Navigation & Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
          <Link
            to="/cases"
            id="analysis-back-to-cases"
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to My Cases</span>
          </Link>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => window.print()}
              id="analysis-print-button"
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-xs transition-colors cursor-pointer"
            >
              <Printer className="h-3.5 w-3.5 text-slate-500" />
              <span>Print / PDF Export</span>
            </button>

            <Link
              to="/intake"
              id="analysis-new-situation-link"
              className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-slate-800 shadow-xs transition-colors"
            >
              <span>New Analysis</span>
            </Link>
          </div>
        </div>

        {/* Dashboard Header: Category, Issue, Jurisdiction */}
        <header
          id="dashboard-header-card"
          className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs"
        >
          <div className="flex flex-wrap items-center gap-2.5 mb-3">
            <span className="inline-flex items-center gap-1.5 rounded-md bg-slate-900 px-3 py-1 text-xs font-bold text-white">
              <Tag className="h-3 w-3" />
              <span>{analysis.category}</span>
            </span>

            <span className="inline-flex items-center gap-1.5 rounded-md bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 border border-slate-200">
              <MapPin className="h-3 w-3 text-slate-500" />
              <span>
                {analysis.jurisdiction.country}
                {analysis.jurisdiction.stateOrRegion ? ` • ${analysis.jurisdiction.stateOrRegion}` : ''}
              </span>
            </span>

            <span className="text-xs text-slate-400">
              Analyzed {new Date(analysis.createdAt).toLocaleDateString()}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 leading-tight">
            {analysis.title}
          </h1>

          <div className="mt-4 rounded-lg bg-slate-50 p-4 border border-slate-200/80">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
              Primary Legal Issue:
            </div>
            <p className="text-sm font-semibold text-slate-800">
              {analysis.primaryIssue}
            </p>
          </div>
        </header>

        {/* Card 1: Situation Summary */}
        <section
          id="analysis-situation-summary"
          aria-labelledby="situation-summary-heading"
          className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-7 shadow-xs space-y-4"
        >
          <div className="border-b border-slate-100 pb-3">
            <h2 id="situation-summary-heading" className="text-xl font-bold tracking-tight text-slate-900">
              1. Situation Summary
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Synthesis of verified core facts, identified legal questions, and provided clarifications.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-1">
            {/* Core Facts */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600">
                Core Established Facts:
              </h3>
              <ul className="space-y-2 text-xs text-slate-700">
                {analysis.situationSummary.coreFacts.map((fact, i) => (
                  <li key={i} className="flex items-start gap-2 bg-slate-50 rounded-lg p-2.5 border border-slate-100">
                    <span className="text-slate-400 font-bold">•</span>
                    <span>{fact}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Key Legal Issues */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600">
                Key Legal Issues Identified:
              </h3>
              <ul className="space-y-2 text-xs text-slate-700">
                {analysis.situationSummary.keyLegalIssues.map((issue, i) => (
                  <li key={i} className="flex items-start gap-2 bg-slate-50 rounded-lg p-2.5 border border-slate-100">
                    <span className="text-slate-900 font-bold">•</span>
                    <span className="font-medium text-slate-900">{issue}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {analysis.situationSummary.clarificationsProvided &&
            analysis.situationSummary.clarificationsProvided.length > 0 && (
              <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-600">
                <span className="font-semibold text-slate-800">Clarifications noted: </span>
                <span>{analysis.situationSummary.clarificationsProvided.join('; ')}</span>
              </div>
            )}
        </section>

        {/* Card 2: Potentially Relevant Rights */}
        <RightsSection rights={analysis.potentiallyRelevantRights} />

        {/* Card 3: Possible Remedies */}
        <RemediesSection remedies={analysis.possibleRemedies} />

        {/* Card 4: Remedy Pathway */}
        <RemedyPathComponent steps={analysis.remedyPath} />

        {/* Card 5: Evidence Checklist */}
        <EvidenceChecklistComponent
          caseId={analysis.id}
          items={analysis.evidenceChecklist}
        />

        {/* Card 6: Important Dates */}
        <ImportantDatesComponent dates={analysis.importantDates} />

        {/* Card 7: Possible Next Steps */}
        <section
          id="analysis-next-steps-section"
          aria-labelledby="next-steps-heading"
          className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-7 shadow-xs space-y-4"
        >
          <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
            <div>
              <h2 id="next-steps-heading" className="text-xl font-bold tracking-tight text-slate-900">
                7. Possible Next Steps
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Immediate and short-term recommended actions to protect your position.
              </p>
            </div>
            <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-700">
              {analysis.possibleNextSteps.length} steps
            </span>
          </div>

          <div className="space-y-3">
            {analysis.possibleNextSteps.map((stepItem, idx) => (
              <div
                key={idx}
                className="rounded-xl border border-slate-200 bg-slate-50/50 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`rounded-xs px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${
                        stepItem.urgency === 'immediate'
                          ? 'bg-red-100 text-red-800'
                          : stepItem.urgency === 'short_term'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-slate-200 text-slate-800'
                      }`}
                    >
                      {stepItem.urgency.replace('_', ' ')}
                    </span>
                    <h3 className="text-sm font-bold text-slate-900">
                      {stepItem.step}
                    </h3>
                  </div>
                  <p className="text-xs text-slate-600 pl-0 sm:pl-2">
                    {stepItem.details}
                  </p>
                </div>

                <div className="shrink-0 flex items-center gap-1 text-xs font-medium text-slate-500 bg-white px-2.5 py-1 rounded-md border border-slate-200 self-start sm:self-auto">
                  <Clock className="h-3.5 w-3.5" />
                  <span>{stepItem.timeline}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Card 8: Questions for a Legal Professional */}
        <LawyerQuestionsComponent
          questions={analysis.questionsForLegalProfessional}
          caseTitle={analysis.title}
        />

        {/* Card 9: Sources / Citations */}
        <SourcesComponent sources={analysis.sources} />

        {/* Comprehensive Disclaimer Banner at Dashboard Footer */}
        <LegalDisclaimerBanner variant="full" />
      </main>
    </div>
  );
};
