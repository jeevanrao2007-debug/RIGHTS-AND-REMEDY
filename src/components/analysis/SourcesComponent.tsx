import React from 'react';
import { BookOpen, ExternalLink, ShieldCheck, AlertCircle, FileText } from 'lucide-react';
import type { LegalSource } from '../../types/legal';

interface SourcesComponentProps {
  sources: LegalSource[];
}

export const SourcesComponent: React.FC<SourcesComponentProps> = ({ sources }) => {
  return (
    <section
      id="analysis-sources-section"
      aria-labelledby="sources-section-heading"
      className="space-y-4"
    >
      <div className="flex items-center justify-between">
        <div>
          <h2 id="sources-section-heading" className="text-xl font-bold tracking-tight text-slate-900">
            8. Authoritative Legal Sources & Citations
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Verified statutory provisions, administrative codes, and official agency manuals referenced in this analysis.
          </p>
        </div>
        <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-700">
          {sources.length} sources
        </span>
      </div>

      {sources.length === 0 ? (
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-6 text-center text-xs text-slate-500">
          No explicit sources cataloged.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sources.map((source) => {
            const isUnsupported = source.status === 'unsupported';

            return (
              <div
                key={source.id}
                className={`rounded-xl border p-5 shadow-xs transition-colors flex flex-col justify-between ${
                  isUnsupported
                    ? 'border-amber-300 bg-amber-50/40'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <span
                      className={`rounded-xs px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                        isUnsupported
                          ? 'bg-amber-100 text-amber-900 border border-amber-300'
                          : source.status === 'statutory'
                          ? 'bg-blue-50 text-blue-800 border border-blue-200'
                          : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      }`}
                    >
                      {source.status}
                    </span>

                    <span className="text-[11px] font-medium text-slate-400 capitalize">
                      {source.sourceType.replace('_', ' ')}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 leading-snug">
                    {source.title}
                  </h3>

                  <div className="text-xs text-slate-600 space-y-1 pt-1">
                    <p>
                      <strong className="text-slate-800 font-semibold">Authority: </strong>
                      {source.authority}
                    </p>
                    {source.provision && (
                      <p>
                        <strong className="text-slate-800 font-semibold">Provision / Section: </strong>
                        <span className="font-mono text-slate-800 bg-slate-100 px-1 py-0.5 rounded-xs">
                          {source.provision}
                        </span>
                      </p>
                    )}
                    {source.dateOrVersion && (
                      <p className="text-slate-500 text-[11px]">
                        Edition/Date: {source.dateOrVersion}
                      </p>
                    )}
                    {isUnsupported && (
                      <div className="flex items-start gap-1.5 pt-1 text-amber-800 font-medium">
                        <AlertCircle className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                        <span>This claim currently lacks verified statutory citation.</span>
                      </div>
                    )}
                  </div>
                </div>

                {source.url && (
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-end">
                    <a
                      href={source.url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-900 hover:text-emerald-700 transition-colors"
                    >
                      <span>Official Source Record</span>
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};
