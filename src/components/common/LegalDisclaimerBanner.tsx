import React from 'react';
import { AlertCircle } from 'lucide-react';

interface LegalDisclaimerBannerProps {
  variant?: 'compact' | 'full';
}

export const LegalDisclaimerBanner: React.FC<LegalDisclaimerBannerProps> = ({ variant = 'compact' }) => {
  if (variant === 'compact') {
    return (
      <div
        id="legal-disclaimer-compact"
        role="region"
        aria-label="Legal Information Notice"
        className="w-full border-b border-amber-200/80 bg-amber-50/90 py-2.5 px-4 text-center text-xs text-amber-950 font-normal leading-relaxed"
      >
        <div className="mx-auto flex max-w-7xl items-center justify-center gap-2">
          <AlertCircle className="h-4 w-4 shrink-0 text-amber-800" aria-hidden="true" />
          <span>
            <strong className="font-semibold text-amber-900">Legal Information Notice:</strong> Rights & Remedy Navigator provides legal information and research assistance, <span className="underline decoration-amber-400 font-semibold">not professional legal advice</span>. No attorney-client relationship is formed.
          </span>
        </div>
      </div>
    );
  }

  return (
    <div
      id="legal-disclaimer-full"
      role="region"
      aria-label="Comprehensive Legal Notice"
      className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-xs text-slate-700 leading-relaxed"
    >
      <div className="flex items-start gap-3">
        <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-slate-700" aria-hidden="true" />
        <div className="space-y-1">
          <h4 className="font-semibold text-slate-900">Legal Information & Responsibility Notice</h4>
          <p>
            The analyses, rights summaries, remedies, timelines, and checklists produced by this application are for informational, educational, and organizational purposes only. Laws and procedural deadlines vary significantly by jurisdiction and are subject to frequent statutory revision and judicial interpretation.
          </p>
          <p className="text-slate-600">
            This tool does not evaluate local court procedural rules or apply case law to private legal outcomes. For formal counsel or representation, always consult a licensed attorney authorized to practice law in your jurisdiction.
          </p>
        </div>
      </div>
    </div>
  );
};
