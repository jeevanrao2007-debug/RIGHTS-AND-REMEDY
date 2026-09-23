import React, { useState, useMemo, useCallback } from 'react';
import { CheckCircle, AlertCircle, HelpCircle, FileCheck, Check, Clock } from 'lucide-react';
import type { EvidenceItem, EvidenceStatus } from '../../types/legal';
import { api } from '../../services/api';

interface EvidenceChecklistComponentProps {
  caseId: string;
  items: EvidenceItem[];
  onStatusChange?: (itemId: string, newStatus: EvidenceStatus) => void;
}

export const EvidenceChecklistComponent: React.FC<EvidenceChecklistComponentProps> = ({
  caseId,
  items: initialItems,
  onStatusChange,
}) => {
  const [items, setItems] = useState<EvidenceItem[]>(initialItems);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const handleStatusSelect = useCallback(
    async (itemId: string, status: EvidenceStatus) => {
      // Optimistic UI update
      setItems((prev) =>
        prev.map((it) => (it.id === itemId ? { ...it, status } : it))
      );
      if (onStatusChange) {
        onStatusChange(itemId, status);
      }

      setUpdatingId(itemId);
      try {
        await api.updateEvidenceStatus(caseId, itemId, status);
      } catch (e) {
        console.warn('Failed to persist evidence status to server, kept locally:', e);
      } finally {
        setUpdatingId(null);
      }
    },
    [caseId, onStatusChange]
  );

  const { haveCount, needCount, notSureCount } = useMemo(() => {
    let have = 0,
      need = 0,
      notSure = 0;
    for (const item of items) {
      if (item.status === 'have') have++;
      else if (item.status === 'need') need++;
      else if (item.status === 'not_sure') notSure++;
    }
    return { haveCount: have, needCount: need, notSureCount: notSure };
  }, [items]);

  return (
    <section
      id="analysis-evidence-checklist-section"
      aria-labelledby="evidence-checklist-heading"
      className="space-y-4"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h2
            id="evidence-checklist-heading"
            className="text-xl font-bold tracking-tight text-slate-900"
          >
            5. Evidence Checklist
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Evidence that may be useful to establish claims or defend against deductions.
          </p>
        </div>

        {/* Progress Counters */}
        <div className="flex items-center gap-2 text-xs">
          <span className="rounded-md bg-emerald-50 px-2.5 py-1 font-semibold text-emerald-800 border border-emerald-200">
            {haveCount} Have it
          </span>
          <span className="rounded-md bg-amber-50 px-2.5 py-1 font-semibold text-amber-800 border border-amber-200">
            {needCount} Need it
          </span>
          <span className="rounded-md bg-slate-100 px-2.5 py-1 font-semibold text-slate-600">
            {notSureCount} Unsure
          </span>
        </div>
      </div>

      <div className="space-y-3">
        {items.map((item) => {
          return (
            <div
              key={item.id}
              className={`rounded-xl border p-4 sm:p-5 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                item.status === 'have'
                  ? 'border-emerald-200 bg-emerald-50/20'
                  : item.status === 'need'
                  ? 'border-amber-200 bg-amber-50/20'
                  : 'border-slate-200 bg-white'
              }`}
            >
              <div className="space-y-1 max-w-xl">
                <div className="flex items-center gap-2">
                  <FileCheck
                    className={`h-4 w-4 shrink-0 ${
                      item.status === 'have'
                        ? 'text-emerald-600'
                        : item.status === 'need'
                        ? 'text-amber-600'
                        : 'text-slate-400'
                    }`}
                  />
                  <h3 className="text-sm font-bold text-slate-900 leading-snug">
                    {item.name}
                  </h3>
                </div>
                <p className="text-xs text-slate-600 pl-6 leading-relaxed">
                  <strong className="text-slate-800 font-semibold">Why it may matter: </strong>
                  {item.whyItMatters}
                </p>
              </div>

              {/* Status Radio / Buttons */}
              <div
                role="group"
                aria-label={`Status for ${item.name}`}
                className="flex items-center gap-1.5 self-start md:self-auto pl-6 md:pl-0 shrink-0"
              >
                {/* Have it */}
                <button
                  type="button"
                  onClick={() => handleStatusSelect(item.id, 'have')}
                  id={`evidence-${item.id}-have`}
                  className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
                    item.status === 'have'
                      ? 'border-emerald-700 bg-emerald-700 text-white shadow-xs'
                      : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {item.status === 'have' && <Check className="h-3.5 w-3.5" />}
                  <span>Have it</span>
                </button>

                {/* Need it */}
                <button
                  type="button"
                  onClick={() => handleStatusSelect(item.id, 'need')}
                  id={`evidence-${item.id}-need`}
                  className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
                    item.status === 'need'
                      ? 'border-amber-700 bg-amber-700 text-white shadow-xs'
                      : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {item.status === 'need' && <AlertCircle className="h-3.5 w-3.5" />}
                  <span>Need it</span>
                </button>

                {/* Not sure */}
                <button
                  type="button"
                  onClick={() => handleStatusSelect(item.id, 'not_sure')}
                  id={`evidence-${item.id}-not_sure`}
                  className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
                    item.status === 'not_sure'
                      ? 'border-slate-800 bg-slate-800 text-white shadow-xs'
                      : 'border-slate-200 bg-white text-slate-500 hover:bg-slate-50'
                  }`}
                >
                  {item.status === 'not_sure' && <HelpCircle className="h-3.5 w-3.5" />}
                  <span>Not sure</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
