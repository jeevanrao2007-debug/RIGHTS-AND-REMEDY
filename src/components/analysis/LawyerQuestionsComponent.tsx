import React, { useState } from 'react';
import { HelpCircle, Copy, Check, Printer, FileText, Share2 } from 'lucide-react';
import type { LawyerQuestion } from '../../types/legal';

interface LawyerQuestionsComponentProps {
  questions: LawyerQuestion[];
  caseTitle: string;
}

export const LawyerQuestionsComponent: React.FC<LawyerQuestionsComponentProps> = ({
  questions,
  caseTitle,
}) => {
  const [copiedAll, setCopiedAll] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopySingle = (q: LawyerQuestion) => {
    const text = `Question: ${q.question}\nContext: ${q.context}`;
    navigator.clipboard.writeText(text);
    setCopiedId(q.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCopyAll = () => {
    const text = `QUESTIONS FOR A LEGAL PROFESSIONAL\nCase: ${caseTitle}\n\n` +
      questions
        .map(
          (q, i) =>
            `${i + 1}. ${q.question}\n   Context: ${q.context}\n   Priority: ${q.priority.toUpperCase()}`
        )
        .join('\n\n');

    navigator.clipboard.writeText(text);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <section
      id="analysis-lawyer-prep-section"
      aria-labelledby="lawyer-prep-heading"
      className="space-y-4"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 id="lawyer-prep-heading" className="text-xl font-bold tracking-tight text-slate-900">
            7. Prepare for a Legal Professional
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Targeted, case-specific questions to ask during a formal legal consultation to maximize efficiency and clarity.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleCopyAll}
            id="copy-all-lawyer-questions-btn"
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer shadow-xs"
          >
            {copiedAll ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-600" />
                <span className="text-emerald-700">Copied all!</span>
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5 text-slate-500" />
                <span>Copy all questions</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handlePrint}
            id="print-lawyer-brief-btn"
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer shadow-xs"
          >
            <Printer className="h-3.5 w-3.5 text-slate-500" />
            <span>Print brief</span>
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {questions.map((q, idx) => (
          <div
            key={q.id}
            className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs hover:border-slate-300 transition-colors"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-700">
                  {idx + 1}
                </span>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`rounded-xs px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${
                        q.priority === 'high'
                          ? 'bg-red-50 text-red-700 border border-red-200'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {q.priority} priority
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 leading-snug">
                    {q.question}
                  </h3>

                  <p className="text-xs text-slate-600 leading-relaxed pt-1">
                    <strong className="text-slate-800 font-semibold">Factual & Legal Context: </strong>
                    {q.context}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleCopySingle(q)}
                title="Copy this question"
                className="shrink-0 p-1.5 text-slate-400 hover:text-slate-800 transition-colors cursor-pointer rounded-md hover:bg-slate-100"
              >
                {copiedId === q.id ? (
                  <Check className="h-4 w-4 text-emerald-600" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
