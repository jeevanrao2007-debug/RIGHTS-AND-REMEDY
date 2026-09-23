import React from 'react';
import { Link } from 'react-router-dom';
import { Scale, ExternalLink } from 'lucide-react';
import { LegalDisclaimerBanner } from '../common/LegalDisclaimerBanner';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-200 bg-white text-slate-600">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 space-y-8">
        <LegalDisclaimerBanner variant="full" />

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pt-4 border-t border-slate-100">
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2 text-slate-900 font-semibold">
              <Scale className="h-5 w-5 text-slate-900" aria-hidden="true" />
              <span>Rights & Remedy Navigator</span>
            </div>
            <p className="text-sm text-slate-600 max-w-md leading-relaxed">
              Empowering individuals to understand legal concepts, organize relevant facts and documentation, explore possible statutory remedies, and prepare informed questions for licensed legal counsel.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-900">Navigation</h4>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <Link to="/intake" className="hover:text-slate-900 transition-colors">
                  Situation Intake
                </Link>
              </li>
              <li>
                <Link to="/documents" className="hover:text-slate-900 transition-colors">
                  Document Analysis
                </Link>
              </li>
              <li>
                <Link to="/cases" className="hover:text-slate-900 transition-colors">
                  Case Repository
                </Link>
              </li>
              <li>
                <Link to="/settings" className="hover:text-slate-900 transition-colors">
                  Account & Settings
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-900">
              Authoritative Resources
            </h4>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <a
                  href="https://www.usa.gov/legal-aid"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 hover:text-slate-900 transition-colors"
                >
                  <span>Legal Aid Finder (USA)</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://www.lsc.gov/"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 hover:text-slate-900 transition-colors"
                >
                  <span>Legal Services Corp</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://www.citizensadvice.org.uk/"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 hover:text-slate-900 transition-colors"
                >
                  <span>Citizens Advice (UK)</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-slate-100 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Rights & Remedy Navigator. Built for public legal literacy.</p>
          <p>Strictly informational • Non-confidential research platform</p>
        </div>
      </div>
    </footer>
  );
};
