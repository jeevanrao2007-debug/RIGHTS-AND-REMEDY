import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  FolderGit2,
  PlusCircle,
  MapPin,
  Tag,
  ArrowRight,
  Trash2,
  Calendar,
  AlertCircle,
  FileCheck2,
} from 'lucide-react';
import { api } from '../services/api';
import type { CaseListItem } from '../types/legal';
import { LoadingState } from '../components/common/LoadingState';
import { ErrorState } from '../components/common/ErrorState';
import { LegalDisclaimerBanner } from '../components/common/LegalDisclaimerBanner';

export const CasesPage: React.FC = () => {
  const [cases, setCases] = useState<CaseListItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const loadCases = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await api.getCases();
      setCases(data);
    } catch (err: any) {
      setError(err.message || 'Unable to fetch your cases.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCases();
  }, [loadCases]);

  const handleDelete = useCallback(
    async (e: React.MouseEvent, id: string) => {
      e.preventDefault();
      e.stopPropagation();

      if (!window.confirm('Are you sure you want to remove this case from your history?')) {
        return;
      }

      setDeletingId(id);
      try {
        await api.deleteCase(id);
        setCases((prev) => prev.filter((c) => c.id !== id));
      } catch (err: any) {
        alert(err.message || 'Failed to delete case.');
      } finally {
        setDeletingId(null);
      }
    },
    []
  );

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20">
      <LegalDisclaimerBanner variant="compact" />

      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
        {/* Page Title & New Case Action */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-md bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-800">
              <FolderGit2 className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Case Repository</span>
            </div>
            <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-slate-900">
              My Legal Cases
            </h1>
            <p className="text-sm text-slate-600">
              Review and manage your analyzed legal situations, evidence checklists, and strategy frameworks.
            </p>
          </div>

          <Link
            to="/intake"
            id="cases-new-intake-btn"
            className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 shadow-xs transition-colors self-start sm:self-auto"
          >
            <PlusCircle className="h-4 w-4" />
            <span>New Situation Intake</span>
          </Link>
        </div>

        {error && (
          <ErrorState
            title="Unable to Load Cases"
            message={error}
            onRetry={loadCases}
          />
        )}

        {isLoading ? (
          <div className="py-16">
            <LoadingState
              stages={['Retrieving your stored case files...']}
              message="Loading case portfolio..."
              subtext="Accessing your encrypted situation analyses."
            />
          </div>
        ) : cases.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center space-y-4">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-500">
              <FolderGit2 className="h-6 w-6" aria-hidden="true" />
            </div>
            <h3 className="text-base font-bold text-slate-900">
              No saved cases yet
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto">
              Start by describing an employment, housing, consumer, or contract issue. Your structured dashboard and evidence checklist will appear here.
            </p>
            <div className="pt-2">
              <Link
                to="/intake"
                className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-500 shadow-xs transition-colors"
              >
                <span>Start your first intake</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-4" id="cases-list-container">
            {cases.map((c) => (
              <div
                key={c.id}
                className="group rounded-xl border border-slate-200 bg-white p-5 sm:p-6 shadow-xs hover:border-slate-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-2 max-w-2xl">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-xs bg-slate-900 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
                      {c.category}
                    </span>

                    <span className="rounded-xs bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-700">
                      {c.jurisdiction.country}
                      {c.jurisdiction.stateOrRegion ? ` • ${c.jurisdiction.stateOrRegion}` : ''}
                    </span>

                    <span className="text-[11px] text-slate-400">
                      Created {new Date(c.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <Link
                    to={`/analysis/${c.id}`}
                    className="text-base sm:text-lg font-bold text-slate-900 hover:text-emerald-700 transition-colors block"
                  >
                    {c.title}
                  </Link>

                  <div className="flex items-center gap-3 text-xs text-slate-500 pt-0.5">
                    <span className="flex items-center gap-1 font-medium text-slate-700">
                      <FileCheck2 className="h-3.5 w-3.5 text-emerald-600" />
                      <span>{c.checklistCompletedCount} of {c.checklistTotalCount} evidence items checked</span>
                    </span>
                    <span>•</span>
                    <span className="capitalize text-slate-600">{c.status} status</span>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 self-end sm:self-center shrink-0">
                  <Link
                    to={`/analysis/${c.id}`}
                    id={`view-case-${c.id}`}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-800 hover:bg-slate-50 transition-colors shadow-xs"
                  >
                    <span>View Dashboard</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>

                  <button
                    type="button"
                    onClick={(e) => handleDelete(e, c.id)}
                    disabled={deletingId === c.id}
                    id={`delete-case-${c.id}`}
                    title="Delete this case"
                    className="p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};
