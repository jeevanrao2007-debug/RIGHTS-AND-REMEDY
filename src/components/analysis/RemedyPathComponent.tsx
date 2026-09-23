import React, { useState } from 'react';
import {
  ChevronDown,
  ChevronUp,
  FileSearch,
  BookOpen,
  FolderArchive,
  Send,
  Gavel,
  Info,
} from 'lucide-react';
import type { RemedyPathStep } from '../../types/legal';

interface RemedyPathComponentProps {
  steps: RemedyPathStep[];
}

const stageIcons: Record<string, React.ElementType> = {
  situation: FileSearch,
  understand_right: BookOpen,
  gather_evidence: FolderArchive,
  first_action: Send,
  escalation: Gavel,
};

const stageLabels: Record<string, string> = {
  situation: '1. Fact Clarification',
  understand_right: '2. Rights Assessment',
  gather_evidence: '3. Evidence Gathering',
  first_action: '4. First Action / Notice',
  escalation: '5. Escalation / Formal Action',
};

export const RemedyPathComponent: React.FC<RemedyPathComponentProps> = ({ steps }) => {
  // Default open first 2 steps
  const [expandedSteps, setExpandedSteps] = useState<Record<number, boolean>>({
    1: true,
    2: true,
  });

  const toggleStep = (num: number) => {
    setExpandedSteps((prev) => ({
      ...prev,
      [num]: !prev[num],
    }));
  };

  const expandAll = () => {
    const all: Record<number, boolean> = {};
    steps.forEach((s) => (all[s.stepNumber] = true));
    setExpandedSteps(all);
  };

  const collapseAll = () => {
    setExpandedSteps({});
  };

  return (
    <section
      id="analysis-remedy-path-section"
      aria-labelledby="remedy-path-heading"
      className="space-y-4"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h2 id="remedy-path-heading" className="text-xl font-bold tracking-tight text-slate-900">
            4. Remedy Pathway
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            A staged progression from fact gathering to formal resolution. Legal procedures vary; do not assume your case must follow every phase linearly.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={expandAll}
            className="text-xs font-medium text-slate-600 hover:text-slate-900 underline cursor-pointer"
          >
            Expand all
          </button>
          <span className="text-slate-300">•</span>
          <button
            type="button"
            onClick={collapseAll}
            className="text-xs font-medium text-slate-600 hover:text-slate-900 underline cursor-pointer"
          >
            Collapse all
          </button>
        </div>
      </div>

      {/* Procedure Notice */}
      <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs text-slate-600">
        <Info className="h-4 w-4 shrink-0 text-slate-400" />
        <span>
          Individual legal disputes depend on contractual clauses, mutual settlement opportunities, and jurisdictional courts. Click any step to inspect guidance.
        </span>
      </div>

      {/* Step Sequence */}
      <div className="space-y-3 pt-1">
        {steps.map((step, idx) => {
          const isExpanded = Boolean(expandedSteps[step.stepNumber]);
          const StepIcon = stageIcons[step.stage] || FileSearch;
          const stageBadge = stageLabels[step.stage] || `Step ${step.stepNumber}`;

          return (
            <div
              key={step.stepNumber}
              className={`rounded-xl border transition-all ${
                isExpanded
                  ? 'border-slate-300 bg-white shadow-xs'
                  : 'border-slate-200 bg-slate-50/70 hover:border-slate-300'
              }`}
            >
              {/* Clickable Header */}
              <button
                type="button"
                onClick={() => toggleStep(step.stepNumber)}
                aria-expanded={isExpanded}
                id={`remedy-step-btn-${step.stepNumber}`}
                className="w-full text-left p-4.5 sm:p-5 flex items-start sm:items-center justify-between gap-4 cursor-pointer focus:outline-hidden focus:ring-2 focus:ring-slate-900 focus:ring-offset-2 rounded-xl"
              >
                <div className="flex items-start sm:items-center gap-3.5">
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg font-bold text-sm transition-colors ${
                      isExpanded
                        ? 'bg-slate-900 text-white'
                        : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    <StepIcon className="h-5 w-5" aria-hidden="true" />
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-xs bg-slate-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-600">
                        {stageBadge}
                      </span>
                      <h3 className="text-sm sm:text-base font-bold text-slate-900">
                        {step.title}
                      </h3>
                    </div>
                    <p className="mt-1 text-xs text-slate-600 line-clamp-1 sm:line-clamp-none">
                      {step.summary}
                    </p>
                  </div>
                </div>

                <div className="shrink-0 p-1 text-slate-400 hover:text-slate-600">
                  {isExpanded ? (
                    <ChevronUp className="h-5 w-5" />
                  ) : (
                    <ChevronDown className="h-5 w-5" />
                  )}
                </div>
              </button>

              {/* Expandable Body */}
              {isExpanded && (
                <div className="px-5 pb-5 pt-1 border-t border-slate-100 space-y-3.5 text-xs text-slate-700">
                  <div className="bg-slate-50/90 rounded-lg p-3.5 border border-slate-100 leading-relaxed">
                    <strong className="text-slate-900 block font-semibold mb-1">
                      Detailed Procedural Guidance:
                    </strong>
                    {step.detailedGuidance}
                  </div>

                  {step.keyPoints && step.keyPoints.length > 0 && (
                    <div>
                      <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] mb-2">
                        Key Action Items for this Phase:
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {step.keyPoints.map((point, kIdx) => (
                          <div
                            key={kIdx}
                            className="flex items-start gap-2 rounded-md bg-white border border-slate-200/90 p-2.5"
                          >
                            <span className="text-emerald-600 font-bold">•</span>
                            <span className="text-slate-700">{point}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};
