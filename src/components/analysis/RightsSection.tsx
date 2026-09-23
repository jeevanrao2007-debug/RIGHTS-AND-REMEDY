import React from 'react';
import { Shield, BookOpen, ExternalLink, AlertCircle } from 'lucide-react';
import type { RelevantRight } from '../../types/legal';

interface RightsSectionProps {
  rights: RelevantRight[];
}

export const RightsSection: React.FC<RightsSectionProps> = ({ rights }) => {
  return (
    <section
      id="analysis-rights-section"
      aria-labelledby="rights-section-heading"
      className="space-y-4"
    >
      <div className="flex items-center justify-between">
        <div>
          <h2 id="rights-section-heading" className="text-xl font-bold tracking-tight text-slate-900">
            2. Potentially Relevant Rights
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Rights that may apply based on the facts provided. These represent legal protections under consideration, not guaranteed legal entitlements.
          </p>
        </div>
        <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-700">
          {rights.length} identified
        </span>
      </div>

      {rights.length === 0 ? (
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-6 text-center text-sm text-slate-500">
          No specific rights cataloged for this scenario yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {rights.map((right) => (
            <div
              key={right.id}
              className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-colors"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-slate-100 text-slate-800">
                      <Shield className="h-4 w-4" aria-hidden="true" />
                    </div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                      Potentially Relevant Right
                    </span>
                  </div>

                  <span
                    className={`rounded-xs px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                      right.sourceStatus === 'statutory'
                        ? 'bg-blue-50 text-blue-800 border border-blue-200'
                        : right.sourceStatus === 'verified'
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {right.sourceStatus}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 leading-snug">
                  {right.title}
                </h3>

                <div className="space-y-2 text-xs leading-relaxed text-slate-700">
                  <p className="bg-slate-50/90 rounded-lg p-3 border border-slate-100 text-slate-800">
                    <strong className="text-slate-900 block mb-1">Plain-Language Explanation:</strong>
                    {right.plainLanguageExplanation}
                  </p>

                  <p className="text-slate-600">
                    <strong className="text-slate-800 font-semibold">Why this may be relevant: </strong>
                    {right.whyRelevant}
                  </p>
                </div>
              </div>

              {/* Supporting Source Footer */}
              {right.supportingSource && (
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <div className="flex items-center gap-1.5 truncate max-w-[85%]">
                    <BookOpen className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                    <span className="truncate" title={right.supportingSource.title}>
                      <span className="font-semibold text-slate-700">{right.supportingSource.title}</span>
                      {right.supportingSource.authority ? ` • ${right.supportingSource.authority}` : ''}
                      {right.supportingSource.provision ? ` • ${right.supportingSource.provision}` : ''}
                    </span>
                  </div>

                  {right.supportingSource.url && (
                    <a
                      href={right.supportingSource.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-slate-700 hover:text-slate-900 flex items-center gap-1 text-[11px] font-medium"
                      title="Inspect Authority Source"
                    >
                      <span>Source</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
};
