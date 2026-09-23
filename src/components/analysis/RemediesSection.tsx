import React from 'react';
import { Compass, CheckCircle2, AlertTriangle, BookOpen, ExternalLink } from 'lucide-react';
import type { LegalRemedy } from '../../types/legal';

interface RemediesSectionProps {
  remedies: LegalRemedy[];
}

export const RemediesSection: React.FC<RemediesSectionProps> = ({ remedies }) => {
  return (
    <section
      id="analysis-remedies-section"
      aria-labelledby="remedies-section-heading"
      className="space-y-4"
    >
      <div className="flex items-center justify-between">
        <div>
          <h2 id="remedies-section-heading" className="text-xl font-bold tracking-tight text-slate-900">
            3. Possible Remedies
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Structured options and potential legal recourse. Remedies are not guaranteed outcomes and depend on formal evidence and judicial or regulatory discretion.
          </p>
        </div>
        <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-700">
          {remedies.length} available pathways
        </span>
      </div>

      <div className="space-y-4">
        {remedies.map((remedy) => (
          <div
            key={remedy.id}
            className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs hover:border-slate-300 transition-colors"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="rounded-xs bg-slate-900 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
                    Possible Pathway
                  </span>
                  <h3 className="text-base font-bold text-slate-900">
                    {remedy.title}
                  </h3>
                </div>
                <p className="text-sm text-slate-700 leading-relaxed pt-1">
                  {remedy.description}
                </p>
              </div>
            </div>

            {/* Prerequisites & Relevant Evidence */}
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 rounded-lg bg-slate-50/80 p-4 border border-slate-100 text-xs">
              {remedy.prerequisites && remedy.prerequisites.length > 0 && (
                <div>
                  <h4 className="font-bold text-slate-900 flex items-center gap-1.5 mb-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-slate-600" />
                    <span>Prerequisites & Requirements</span>
                  </h4>
                  <ul className="space-y-1 text-slate-600 list-disc list-inside">
                    {remedy.prerequisites.map((p, i) => (
                      <li key={i}>{p}</li>
                    ))}
                  </ul>
                </div>
              )}

              {remedy.relevantEvidence && remedy.relevantEvidence.length > 0 && (
                <div>
                  <h4 className="font-bold text-slate-900 flex items-center gap-1.5 mb-1.5">
                    <Compass className="h-3.5 w-3.5 text-slate-600" />
                    <span>Relevant Evidence to Support</span>
                  </h4>
                  <ul className="space-y-1 text-slate-600 list-disc list-inside">
                    {remedy.relevantEvidence.map((e, i) => (
                      <li key={i}>{e}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Uncertainty Warning */}
            {remedy.uncertainty && (
              <div className="mt-3 flex items-start gap-2 rounded-lg bg-amber-50/70 border border-amber-200/60 p-3 text-xs text-amber-900">
                <AlertTriangle className="h-4 w-4 shrink-0 text-amber-700 mt-0.5" />
                <div>
                  <strong className="font-semibold">Uncertainty / Limitations: </strong>
                  <span>{remedy.uncertainty}</span>
                </div>
              </div>
            )}

            {/* Source Reference */}
            {remedy.supportingSource && (
              <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <div className="flex items-center gap-1.5">
                  <BookOpen className="h-3.5 w-3.5 text-slate-400" />
                  <span>Authority: {remedy.supportingSource.authority}</span>
                </div>
                {remedy.supportingSource.url && (
                  <a
                    href={remedy.supportingSource.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] text-slate-700 hover:text-slate-900 font-medium"
                  >
                    <span>View Statutory Source</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};
