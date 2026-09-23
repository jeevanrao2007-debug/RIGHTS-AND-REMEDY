import React from 'react';
import { Calendar, AlertCircle, ShieldAlert, BookOpen, ExternalLink, Clock } from 'lucide-react';
import type { ImportantDate } from '../../types/legal';

interface ImportantDatesComponentProps {
  dates: ImportantDate;
}

export const ImportantDatesComponent: React.FC<ImportantDatesComponentProps> = ({ dates }) => {
  return (
    <section
      id="analysis-important-dates-section"
      aria-labelledby="important-dates-heading"
      className="space-y-4"
    >
      <div className="flex items-center justify-between">
        <div>
          <h2 id="important-dates-heading" className="text-xl font-bold tracking-tight text-slate-900">
            6. Important Dates & Statutory Deadlines
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Strict statutory filing periods or notice requirements. Deadlines must be verified by authoritative sources.
          </p>
        </div>
      </div>

      {dates.hasVerifiedDeadline ? (
        <div className="rounded-xl border border-amber-300 bg-amber-50/50 p-6 shadow-xs space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-600 text-white">
                <Calendar className="h-5 w-5" aria-hidden="true" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-900">
                  Verified Statutory Deadline
                </span>
                <h3 className="text-base font-bold text-amber-950">
                  {dates.deadlineDescription || dates.dateOrTimeframe}
                </h3>
              </div>
            </div>

            {dates.dateOrTimeframe && (
              <span className="rounded-md bg-amber-200/80 px-3 py-1 text-xs font-bold text-amber-950">
                {dates.dateOrTimeframe}
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-amber-950">
            {dates.whatTriggersIt && (
              <div className="rounded-lg bg-white/80 p-3.5 border border-amber-200/80">
                <strong className="block text-slate-900 font-semibold mb-1 flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 text-amber-700" />
                  What Triggers this Deadline:
                </strong>
                <span>{dates.whatTriggersIt}</span>
              </div>
            )}

            {dates.explanation && (
              <div className="rounded-lg bg-white/80 p-3.5 border border-amber-200/80">
                <strong className="block text-slate-900 font-semibold mb-1 flex items-center gap-1.5">
                  <ShieldAlert className="h-3.5 w-3.5 text-amber-700" />
                  Statutory Explanation:
                </strong>
                <span>{dates.explanation}</span>
              </div>
            )}
          </div>

          {dates.supportingSource && (
            <div className="pt-2 border-t border-amber-200/60 flex items-center justify-between text-xs text-amber-900">
              <div className="flex items-center gap-1.5">
                <BookOpen className="h-3.5 w-3.5 text-amber-700" />
                <span>
                  Source: <strong>{dates.supportingSource.title}</strong>
                  {dates.supportingSource.provision ? ` (${dates.supportingSource.provision})` : ''}
                </span>
              </div>
              {dates.supportingSource.url && (
                <a
                  href={dates.supportingSource.url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 font-semibold text-amber-950 hover:underline"
                >
                  <span>Verify Law</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              )}
            </div>
          )}
        </div>
      ) : (
        <div
          id="no-verified-deadline-notice"
          className="rounded-xl border border-slate-200 bg-slate-50 p-6 text-center space-y-2"
        >
          <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-slate-200 text-slate-600">
            <Calendar className="h-5 w-5" aria-hidden="true" />
          </div>
          <h3 className="text-sm font-semibold text-slate-900">
            No verified deadline was identified from the available sources.
          </h3>
          <p className="text-xs text-slate-500 max-w-lg mx-auto">
            {dates.explanation ||
              'Deadlines vary depending on specific dispute thresholds, whether administrative grievances must be filed first, or whether contractual limitation clauses exist. Confirm deadlines directly with an attorney.'}
          </p>
        </div>
      )}
    </section>
  );
};
