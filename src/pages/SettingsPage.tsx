import React, { useState } from 'react';
import {
  Settings,
  Shield,
  User,
  LogOut,
  LogIn,
  Key,
  Database,
  Trash2,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  FileText,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { LegalDisclaimerBanner } from '../components/common/LegalDisclaimerBanner';

export const SettingsPage: React.FC = () => {
  const { user, signInWithEmail, signUpWithEmail, signInWithGoogle, signOut, isFirebaseConfigured } =
    useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [authError, setAuthError] = useState<string | null>(null);
  const [authSuccess, setAuthSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setAuthSuccess(null);

    if (!email || !password) {
      setAuthError('Please enter both email and password.');
      return;
    }

    setIsSubmitting(true);
    try {
      if (authMode === 'signin') {
        await signInWithEmail(email, password);
        setAuthSuccess('Signed in successfully.');
      } else {
        await signUpWithEmail(email, password);
        setAuthSuccess('Account created and signed in.');
      }
      setEmail('');
      setPassword('');
    } catch (err: any) {
      setAuthError(err.message || 'Authentication failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setAuthError(null);
    setAuthSuccess(null);
    setIsSubmitting(true);
    try {
      await signInWithGoogle();
      setAuthSuccess('Signed in with Google successfully.');
    } catch (err: any) {
      setAuthError(err.message || 'Google Sign-In failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClearCache = () => {
    if (window.confirm('Clear your temporary intake drafts and local session cache?')) {
      sessionStorage.removeItem('rrn_intake_draft');
      alert('Local intake cache cleared.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20">
      <LegalDisclaimerBanner variant="compact" />

      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="space-y-2 border-b border-slate-200 pb-6">
          <div className="inline-flex items-center gap-1.5 rounded-md bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-800">
            <Settings className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Preferences & Data Governance</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
            Account & Settings
          </h1>
          <p className="text-sm text-slate-600">
            Manage your session identity, storage security, and external legal aid connections.
          </p>
        </div>

        {/* Account / Auth Card */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-900 text-white font-bold text-sm">
                <User className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  Current Session: {user?.displayName || user?.email || 'Guest Client'}
                </h2>
                <p className="text-xs text-slate-500">
                  Provider: {user?.provider === 'firebase' ? 'Firebase Authentication' : 'Secure Client Session'}
                </p>
              </div>
            </div>

            {user && (
              <button
                type="button"
                onClick={() => signOut()}
                id="sign-out-btn"
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <LogOut className="h-3.5 w-3.5 text-slate-400" />
                <span>Sign Out</span>
              </button>
            )}
          </div>

          {/* Sign In / Sign Up Form */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900">
              {authMode === 'signin' ? 'Sign in to sync your cases' : 'Create an account to save cases'}
            </h3>

            {authError && (
              <div
                role="alert"
                aria-live="assertive"
                className="rounded-lg bg-red-50 p-3 text-xs font-medium text-red-700 border border-red-200 flex items-center gap-2"
              >
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            {authSuccess && (
              <div
                role="status"
                aria-live="polite"
                className="rounded-lg bg-emerald-50 p-3 text-xs font-medium text-emerald-800 border border-emerald-200 flex items-center gap-2"
              >
                <CheckCircle2 className="h-4 w-4 shrink-0" />
                <span>{authSuccess}</span>
              </div>
            )}

            {/* Google Sign-In Button */}
            <div className="max-w-md pt-1">
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={isSubmitting}
                id="google-signin-btn"
                className="w-full inline-flex items-center justify-center gap-3 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-1 transition-all shadow-xs cursor-pointer disabled:opacity-50"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    fill="#4285F4"
                    d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.65v3.03h3.88c2.27-2.09 3.66-5.17 3.66-9.12z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.03c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.26v3.13C3.26 21.36 7.33 24 12 24z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.28 14.29c-.25-.72-.38-1.49-.38-2.29s.13-1.57.38-2.29V6.57H1.26C.46 8.17 0 9.99 0 12s.46 3.83 1.26 5.43l4.02-3.14z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.26 6.57l4.02 3.14c.95-2.83 3.6-4.96 6.72-4.96z"
                  />
                </svg>
                <span>Continue with Google</span>
              </button>

              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-slate-400 font-medium">Or continue with email</span>
                </div>
              </div>
            </div>

            <form onSubmit={handleAuthSubmit} className="space-y-4 max-w-md">
              <div className="space-y-1">
                <label htmlFor="settings-email-input" className="text-xs font-semibold text-slate-700 block">
                  Email Address
                </label>
                <input
                  id="settings-email-input"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  autoComplete="email"
                  required
                  className="w-full rounded-lg border border-slate-300 px-3.5 py-2 text-sm text-slate-900 focus:border-slate-900 focus:outline-hidden focus:ring-1 focus:ring-slate-900"
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="settings-password-input" className="text-xs font-semibold text-slate-700 block">
                  Password
                </label>
                <input
                  id="settings-password-input"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete={authMode === 'signin' ? 'current-password' : 'new-password'}
                  required
                  className="w-full rounded-lg border border-slate-300 px-3.5 py-2 text-sm text-slate-900 focus:border-slate-900 focus:outline-hidden focus:ring-1 focus:ring-slate-900"
                />
              </div>

              <div className="flex items-center gap-3 pt-1">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  id="auth-submit-button"
                  className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800 disabled:opacity-50 transition-colors cursor-pointer"
                >
                  <LogIn className="h-3.5 w-3.5" />
                  <span>{authMode === 'signin' ? 'Sign In' : 'Create Account'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setAuthMode(authMode === 'signin' ? 'signup' : 'signin')}
                  className="text-xs font-medium text-slate-600 hover:text-slate-900 underline cursor-pointer"
                >
                  {authMode === 'signin'
                    ? 'Need an account? Sign up'
                    : 'Already have an account? Sign in'}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Data & Privacy Controls */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Database className="h-5 w-5 text-slate-700" />
            <h2 className="text-base font-bold text-slate-900">
              Data & Local Storage Controls
            </h2>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            Case files are saved within your persistent repository. You can clear temporary drafts or cache stored in your browser session at any time.
          </p>

          <div className="pt-2">
            <button
              type="button"
              onClick={handleClearCache}
              id="clear-drafts-btn"
              className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer shadow-xs"
            >
              <Trash2 className="h-3.5 w-3.5 text-slate-400" />
              <span>Clear Local Intake Draft Cache</span>
            </button>
          </div>
        </div>

        {/* Official Legal Aid Link Directory */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Shield className="h-5 w-5 text-slate-700" />
            <h2 className="text-base font-bold text-slate-900">
              Free & Low-Cost Legal Aid Directories
            </h2>
          </div>

          <p className="text-xs text-slate-600">
            If you need legal representation or cannot afford a private attorney, these non-profit organizations provide qualified legal services:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            {[
              {
                name: 'Legal Services Corporation (USA)',
                desc: 'Nationwide directory of federally funded civil legal aid offices.',
                url: 'https://www.lsc.gov/find-legal-aid',
              },
              {
                name: 'USA.gov Legal Assistance',
                desc: 'Federal portal for consumer, employment, and civil rights resources.',
                url: 'https://www.usa.gov/legal-aid',
              },
              {
                name: 'Citizens Advice (UK)',
                desc: 'Free, confidential advice on consumer, housing, and civil law.',
                url: 'https://www.citizensadvice.org.uk/',
              },
              {
                name: 'Community Legal Centres (Australia)',
                desc: 'Independent community organizations providing free legal advice.',
                url: 'https://clcs.org.au/',
              },
            ].map((link, idx) => (
              <a
                key={idx}
                href={link.url}
                target="_blank"
                rel="noreferrer"
                className="group rounded-xl border border-slate-200 p-4 hover:border-slate-300 hover:bg-slate-50/60 transition-all flex flex-col justify-between space-y-2"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                      {link.name}
                    </h3>
                    <ExternalLink className="h-3.5 w-3.5 text-slate-400 group-hover:text-slate-700" />
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                    {link.desc}
                  </p>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Formal Disclaimer Reminder */}
        <LegalDisclaimerBanner variant="full" />
      </main>
    </div>
  );
};
