import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Scale,
  ShieldCheck,
  ArrowRight,
  Globe,
  MapPin,
  Tag,
  AlertCircle,
  Lock,
} from 'lucide-react';
import { api } from '../services/api';
import type { SituationCategory } from '../types/legal';
import { LoadingState } from '../components/common/LoadingState';
import { ErrorState } from '../components/common/ErrorState';

const CATEGORIES: { value: SituationCategory | ''; label: string }[] = [
  { value: '', label: "I'm not sure (Auto-detect)" },
  { value: 'Employment', label: 'Employment (Wages, wrongful termination, discrimination)' },
  { value: 'Housing', label: 'Housing (Leases, deposits, repairs, evictions)' },
  { value: 'Consumer', label: 'Consumer (Defective goods, unfair charges, warranties)' },
  { value: 'Contract', label: 'Contract (Breach of agreement, services, deliverables)' },
  { value: 'Financial', label: 'Financial (Debt collection, loans, banking disputes)' },
  { value: 'Family', label: 'Family (Custody, divorce, maintenance)' },
  { value: 'Education', label: 'Education (Special needs, discipline, tuition)' },
  { value: 'Other', label: 'Other / General Civil Issue' },
];

const COUNTRIES = [
  'United States',
  'United Kingdom',
  'Canada',
  'Australia',
  'European Union',
  'India',
  'Other / International',
];

export const IntakePage: React.FC = () => {
  const navigate = useNavigate();

  const [narrative, setNarrative] = useState('');
  const [country, setCountry] = useState('United States');
  const [stateOrRegion, setStateOrRegion] = useState('');
  const [category, setCategory] = useState<SituationCategory | ''>('');
  const [validationError, setValidationError] = useState<string | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);
    setApiError(null);

    const trimmed = narrative.trim();
    if (!trimmed) {
      setValidationError('Please describe what happened in your situation.');
      return;
    }
    if (trimmed.length < 20) {
      setValidationError(
        'Please provide a bit more context (at least 20 characters) so we can understand the key facts.'
      );
      return;
    }

    setIsLoading(true);
    try {
      const response = await api.analyzeInitialSituation({
        narrative: trimmed,
        country,
        stateOrRegion: stateOrRegion.trim() || undefined,
        category: category || undefined,
      });

      // Cache intake draft in sessionStorage for the follow-up questions screen
      const draft = {
        narrative: trimmed,
        jurisdiction: {
          country,
          stateOrRegion: stateOrRegion.trim() || undefined,
        },
        category: category || response.category || 'Other',
        extractedFacts: response.extractedFacts,
        missingInformation: response.missingInformation,
        followUpQuestions: response.followUpQuestions,
      };

      sessionStorage.setItem('rrn_intake_draft', JSON.stringify(draft));
      navigate('/intake/questions');
    } catch (err: any) {
      setApiError(err.message || 'Failed to analyze situation. Please check your network and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16">
        <LoadingState
          stages={[
            'Understanding your situation...',
            'Extracting core facts and actors...',
            'Checking jurisdictional context...',
            'Identifying missing details and essential follow-ups...',
          ]}
          subtext="Preparing 2 to 4 focused questions to clarify your potential rights and options."
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Page Header */}
      <div className="space-y-2 border-b border-slate-200 pb-6">
        <div className="inline-flex items-center gap-1.5 rounded-md bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-800">
          <Scale className="h-3.5 w-3.5" aria-hidden="true" />
          <span>Step 1 of 2: Situation Intake</span>
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
          What happened?
        </h1>
        <p className="text-base text-slate-600">
          Describe your situation in your own words. You don't need to know legal terminology.
        </p>
      </div>

      {apiError && (
        <div className="mt-6">
          <ErrorState
            title="Analysis Notice"
            message={apiError}
            onRetry={() => setApiError(null)}
            actionText="Dismiss & Edit"
          />
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-8 space-y-8" id="intake-form">
        {/* Narrative Textarea */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label
              htmlFor="narrative-input"
              className="text-sm font-bold text-slate-900 flex items-center gap-1"
            >
              <span>Describe the events in detail</span>
              <span className="text-red-500" aria-hidden="true">*</span>
            </label>
            <span className="text-xs text-slate-500">
              {narrative.length} characters (min 20)
            </span>
          </div>

          <textarea
            id="narrative-input"
            rows={7}
            value={narrative}
            onChange={(e) => {
              setNarrative(e.target.value);
              if (validationError) setValidationError(null);
            }}
            placeholder="Describe your situation in your own words. You don't need to know legal terminology. For example: what occurred, when it started, who was involved, any agreements made, and what the other party did or failed to do."
            className="w-full rounded-xl border border-slate-300 bg-white p-4 text-base text-slate-900 placeholder:text-slate-400 focus:border-slate-900 focus:outline-hidden focus:ring-1 focus:ring-slate-900 transition-colors leading-relaxed shadow-xs"
            aria-required="true"
            aria-invalid={Boolean(validationError)}
            aria-describedby={validationError ? 'narrative-error' : undefined}
          />

          {validationError && (
            <p id="narrative-error" className="flex items-center gap-1.5 text-xs font-semibold text-red-600">
              <AlertCircle className="h-3.5 w-3.5" aria-hidden="true" />
              <span>{validationError}</span>
            </p>
          )}

          {/* Prompt suggestions */}
          <div className="flex flex-wrap gap-2 pt-1 text-xs text-slate-500">
            <span className="font-medium text-slate-700">Helpful to include:</span>
            <span className="rounded-sm bg-slate-100 px-2 py-0.5">Approximate dates</span>
            <span className="rounded-sm bg-slate-100 px-2 py-0.5">Written contracts or messages</span>
            <span className="rounded-sm bg-slate-100 px-2 py-0.5">Financial amounts involved</span>
            <span className="rounded-sm bg-slate-100 px-2 py-0.5">Prior responses received</span>
          </div>
        </div>

        {/* Jurisdiction & Classification Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 rounded-xl border border-slate-200 bg-slate-50/50 p-5">
          {/* Country Selection */}
          <div className="space-y-1.5">
            <label
              htmlFor="country-select"
              className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5"
            >
              <Globe className="h-3.5 w-3.5 text-slate-500" />
              <span>Jurisdiction (Country)</span>
            </label>
            <select
              id="country-select"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 focus:border-slate-900 focus:outline-hidden focus:ring-1 focus:ring-slate-900 shadow-xs"
            >
              {COUNTRIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <p className="text-[11px] text-slate-500">
              Legal protections and statutory authorities depend heavily on location.
            </p>
          </div>

          {/* State / Region Selection */}
          <div className="space-y-1.5">
            <label
              htmlFor="state-input"
              className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5"
            >
              <MapPin className="h-3.5 w-3.5 text-slate-500" />
              <span>State, Province, or County (Optional)</span>
            </label>
            <input
              type="text"
              id="state-input"
              value={stateOrRegion}
              onChange={(e) => setStateOrRegion(e.target.value)}
              placeholder="e.g. California, Ontario, London, NSW"
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-900 focus:outline-hidden focus:ring-1 focus:ring-slate-900 shadow-xs"
            />
            <p className="text-[11px] text-slate-500">
              Enables precise state or local municipal statutory citation.
            </p>
          </div>

          {/* Optional Situation Category */}
          <div className="md:col-span-2 space-y-1.5 pt-2 border-t border-slate-200">
            <label
              htmlFor="category-select"
              className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5"
            >
              <Tag className="h-3.5 w-3.5 text-slate-500" />
              <span>Situation Category (Optional)</span>
            </label>
            <select
              id="category-select"
              value={category}
              onChange={(e) => setCategory(e.target.value as SituationCategory | '')}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 focus:border-slate-900 focus:outline-hidden focus:ring-1 focus:ring-slate-900 shadow-xs"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat.value || 'none'} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
            <p className="text-[11px] text-slate-500">
              Leave on auto-detect if you are uncertain. The system will categorize based on your narrative.
            </p>
          </div>
        </div>

        {/* Privacy & Information Notice */}
        <div
          role="note"
          aria-label="Privacy and Information Notice"
          className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-xs text-slate-600 leading-relaxed space-y-1.5"
        >
          <div className="flex items-center gap-2 font-semibold text-slate-900">
            <Lock className="h-4 w-4 text-slate-700" />
            <span>Privacy & Information Notice</span>
          </div>
          <p>
            • Your narrative is processed to identify relevant statutes, remedies, and evidence requirements.
          </p>
          <p>
            • Do not include confidential bank account numbers, passwords, or government identification numbers (such as SSNs).
          </p>
          <p>
            • Rights & Remedy Navigator provides informational research and structured checklists, not licensed legal advice or representation.
          </p>
        </div>

        {/* Primary CTA Button */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-200">
          <div className="text-xs text-slate-500">
            Next: You'll answer 2 to 4 quick clarifying questions.
          </div>

          <button
            type="submit"
            id="analyze-situation-submit-button"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg bg-slate-900 px-7 py-3.5 text-base font-semibold text-white shadow-sm hover:bg-slate-800 focus:outline-hidden focus:ring-2 focus:ring-slate-900 focus:ring-offset-2 transition-colors cursor-pointer"
          >
            <span>Analyze My Situation</span>
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </form>
    </div>
  );
};
