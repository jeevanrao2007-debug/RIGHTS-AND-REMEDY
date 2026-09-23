import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  HelpCircle,
  Calendar,
  Check,
  AlertCircle,
  FileCheck,
  RotateCcw,
} from 'lucide-react';
import { api } from '../services/api';
import type { IntakeDraft, FollowUpQuestion } from '../types/legal';
import { LoadingState } from '../components/common/LoadingState';
import { ErrorState } from '../components/common/ErrorState';

export const DynamicQuestionsPage: React.FC = () => {
  const navigate = useNavigate();

  const [draft, setDraft] = useState<IntakeDraft | null>(null);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [apiError, setApiError] = useState<string | null>(null);

  useEffect(() => {
    const raw = sessionStorage.getItem('rrn_intake_draft');
    if (!raw) {
      // Redirect back to intake if user arrived directly
      navigate('/intake', { replace: true });
      return;
    }
    try {
      const parsed: IntakeDraft = JSON.parse(raw);
      setDraft(parsed);
      if (parsed.answers) {
        setAnswers(parsed.answers);
      }
    } catch {
      navigate('/intake', { replace: true });
    }
  }, [navigate]);

  const handleAnswerChange = React.useCallback((questionId: string, val: any) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: val,
    }));
  }, []);

  const handleCheckboxToggle = React.useCallback((questionId: string, option: string) => {
    setAnswers((prev) => {
      const currentList: string[] = Array.isArray(prev[questionId]) ? prev[questionId] : [];
      const exists = currentList.includes(option);
      const updated = exists ? currentList.filter((item) => item !== option) : [...currentList, option];
      return {
        ...prev,
        [questionId]: updated,
      };
    });
  }, []);

  const handleFinalSubmit = React.useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!draft) return;
      setApiError(null);
      setIsLoading(true);

      try {
        // Save current answers into draft in session
        const updatedDraft = { ...draft, answers };
        sessionStorage.setItem('rrn_intake_draft', JSON.stringify(updatedDraft));

        const result = await api.completeLegalAnalysis({
          narrative: draft.narrative,
          country: draft.jurisdiction.country,
          stateOrRegion: draft.jurisdiction.stateOrRegion,
          category: draft.category,
          answers,
        });

        // Clear draft once completed and redirect to analysis dashboard
        sessionStorage.removeItem('rrn_intake_draft');
        navigate(`/analysis/${result.id}`, { replace: true });
      } catch (err: any) {
        setApiError(err.message || 'Failed to complete legal analysis. Please try again.');
        setIsLoading(false);
      }
    },
    [draft, answers, navigate]
  );

  if (!draft) {
    return null;
  }

  const questions: FollowUpQuestion[] = draft.followUpQuestions || [];

  if (isLoading) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20">
        <LoadingState
          stages={[
            'Synthesizing your facts and responses...',
            'Cross-referencing verified legal codes and statutes...',
            'Evaluating statutory deadlines and triggering events...',
            'Constructing structured 5-stage remedy pathway...',
            'Generating tailored questions for a legal professional...',
          ]}
          subtext="Building your comprehensive Legal Situation Dashboard."
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Header with back link */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-5">
        <button
          type="button"
          onClick={() => {
            // Persist current answers so if user goes back, their work is saved
            const updatedDraft = { ...draft, answers };
            sessionStorage.setItem('rrn_intake_draft', JSON.stringify(updatedDraft));
            navigate('/intake');
          }}
          id="questions-back-to-intake"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Edit original narrative</span>
        </button>

        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
          Step 2 of 2: Essential Clarifications
        </span>
      </div>

      {apiError && (
        <div className="mt-6">
          <ErrorState
            title="Analysis Error"
            message={apiError}
            onRetry={() => setApiError(null)}
            actionText="Dismiss & Retry"
          />
        </div>
      )}

      {/* Narrative Acknowledgment Banner: "I understand the basic situation. I need a few more details." */}
      <div
        role="region"
        aria-label="Fact Synthesis Summary"
        className="mt-6 rounded-xl border border-slate-200 bg-slate-50/80 p-5"
      >
        <div className="flex items-start gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-800">
            <CheckCircle2 className="h-5 w-5" aria-hidden="true" />
          </div>
          <div className="space-y-2">
            <h2 className="text-base font-bold text-slate-900">
              I understand the basic situation. I need a few more details.
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              Based on your description in <strong className="text-slate-900">{draft.jurisdiction.country}</strong>
              {draft.jurisdiction.stateOrRegion ? ` (${draft.jurisdiction.stateOrRegion})` : ''} regarding{' '}
              <strong className="text-slate-900">{draft.category || 'your civil issue'}</strong>, we've extracted the core facts below and generated only the necessary follow-up questions to identify relevant rights and deadlines.
            </p>

            {draft.extractedFacts && draft.extractedFacts.length > 0 && (
              <div className="mt-3 rounded-lg bg-white border border-slate-200 p-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Extracted Key Facts
                </h3>
                <ul className="space-y-1 text-xs text-slate-700 list-disc list-inside">
                  {draft.extractedFacts.map((fact, i) => (
                    <li key={i}>{fact}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Dynamic Questions Form */}
      <form onSubmit={handleFinalSubmit} className="mt-8 space-y-8" id="follow-up-questions-form">
        <div className="space-y-6">
          {questions.map((q, idx) => {
            const currentVal = answers[q.id];

            return (
              <div
                key={q.id}
                id={`question-card-${q.id}`}
                className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs transition-all hover:border-slate-300"
              >
                {/* Question Label & Counter */}
                <div className="flex items-baseline justify-between gap-4">
                  <label
                    htmlFor={`input-${q.id}`}
                    className="text-base font-semibold text-slate-900 flex items-center gap-2"
                  >
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-700">
                      {idx + 1}
                    </span>
                    <span>{q.question}</span>
                    {q.required && (
                      <span className="text-red-500 text-sm" title="Required">*</span>
                    )}
                  </label>
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider shrink-0">
                    {q.type.replace('_', ' ')}
                  </span>
                </div>

                {/* Explanation */}
                {q.explanation && (
                  <p className="mt-1 text-xs text-slate-500 pl-7 leading-relaxed">
                    {q.explanation}
                  </p>
                )}

                {/* Dynamic Input Renderers */}
                <div className="mt-4 pl-7">
                  {/* 1. Date Type */}
                  {q.type === 'date' && (
                    <div className="relative max-w-xs">
                      <input
                        type="date"
                        id={`input-${q.id}`}
                        value={currentVal || ''}
                        onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                        className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-slate-900 focus:outline-hidden focus:ring-1 focus:ring-slate-900 shadow-xs"
                      />
                    </div>
                  )}

                  {/* 2. Yes/No Type */}
                  {q.type === 'yes_no' && (
                    <div
                      role="radiogroup"
                      aria-label={q.question}
                      className="flex items-center gap-3"
                    >
                      <button
                        type="button"
                        role="radio"
                        aria-checked={currentVal === 'Yes'}
                        onClick={() => handleAnswerChange(q.id, 'Yes')}
                        className={`inline-flex items-center gap-2 rounded-lg border px-5 py-2.5 text-sm font-semibold transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:outline-hidden ${
                          currentVal === 'Yes'
                            ? 'border-slate-900 bg-slate-900 text-white shadow-xs'
                            : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        {currentVal === 'Yes' && <Check className="h-4 w-4" aria-hidden="true" />}
                        <span>Yes</span>
                      </button>

                      <button
                        type="button"
                        role="radio"
                        aria-checked={currentVal === 'No'}
                        onClick={() => handleAnswerChange(q.id, 'No')}
                        className={`inline-flex items-center gap-2 rounded-lg border px-5 py-2.5 text-sm font-semibold transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:outline-hidden ${
                          currentVal === 'No'
                            ? 'border-slate-900 bg-slate-900 text-white shadow-xs'
                            : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        {currentVal === 'No' && <Check className="h-4 w-4" aria-hidden="true" />}
                        <span>No</span>
                      </button>

                      <button
                        type="button"
                        role="radio"
                        aria-checked={currentVal === 'Not sure'}
                        onClick={() => handleAnswerChange(q.id, 'Not sure')}
                        className={`inline-flex items-center gap-2 rounded-lg border px-4 py-2.5 text-xs font-medium transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:outline-hidden ${
                          currentVal === 'Not sure'
                            ? 'border-slate-600 bg-slate-100 text-slate-900'
                            : 'border-slate-200 bg-white text-slate-500 hover:bg-slate-50'
                        }`}
                      >
                        <span>Not sure</span>
                      </button>
                    </div>
                  )}

                  {/* 3. Single Choice Type */}
                  {q.type === 'single_choice' && q.options && (
                    <div className="space-y-2">
                      {q.options.map((opt, oIdx) => {
                        const isSelected = currentVal === opt;
                        return (
                          <label
                            key={oIdx}
                            className={`flex items-center gap-3 rounded-lg border p-3.5 text-sm cursor-pointer transition-colors ${
                              isSelected
                                ? 'border-slate-900 bg-slate-50 font-semibold text-slate-900'
                                : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50/70'
                            }`}
                          >
                            <input
                              type="radio"
                              name={`radio-${q.id}`}
                              value={opt}
                              checked={isSelected}
                              onChange={() => handleAnswerChange(q.id, opt)}
                              className="h-4 w-4 border-slate-300 text-slate-900 focus:ring-slate-900"
                            />
                            <span>{opt}</span>
                          </label>
                        );
                      })}
                    </div>
                  )}

                  {/* 4. Multiple Choice Type */}
                  {q.type === 'multiple_choice' && q.options && (
                    <div className="space-y-2">
                      {q.options.map((opt, oIdx) => {
                        const isChecked = Array.isArray(currentVal) && currentVal.includes(opt);
                        return (
                          <label
                            key={oIdx}
                            className={`flex items-center gap-3 rounded-lg border p-3.5 text-sm cursor-pointer transition-colors ${
                              isChecked
                                ? 'border-slate-900 bg-slate-50 font-semibold text-slate-900'
                                : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50/70'
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => handleCheckboxToggle(q.id, opt)}
                              className="h-4 w-4 rounded-sm border-slate-300 text-slate-900 focus:ring-slate-900"
                            />
                            <span>{opt}</span>
                          </label>
                        );
                      })}
                    </div>
                  )}

                  {/* 5. Text Type */}
                  {q.type === 'text' && (
                    <input
                      type="text"
                      id={`input-${q.id}`}
                      value={currentVal || ''}
                      onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                      placeholder="Enter brief details..."
                      className="w-full max-w-lg rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-900 focus:outline-hidden focus:ring-1 focus:ring-slate-900 shadow-xs"
                    />
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Action Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-200 pt-6">
          <button
            type="button"
            onClick={() => {
              const updatedDraft = { ...draft, answers };
              sessionStorage.setItem('rrn_intake_draft', JSON.stringify(updatedDraft));
              navigate('/intake');
            }}
            id="questions-back-btn"
            className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to situation details</span>
          </button>

          <button
            type="submit"
            id="generate-analysis-submit-btn"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 rounded-lg bg-emerald-600 px-8 py-3.5 text-base font-semibold text-white shadow-sm hover:bg-emerald-500 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-colors cursor-pointer"
          >
            <FileCheck className="h-5 w-5" aria-hidden="true" />
            <span>Generate Legal Situation Dashboard</span>
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </form>
    </div>
  );
};
