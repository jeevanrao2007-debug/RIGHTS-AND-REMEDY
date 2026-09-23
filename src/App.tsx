import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { LoadingState } from './components/common/LoadingState';

// Lazy-loaded route components for high performance code splitting
const HomePage = React.lazy(() => import('./pages/HomePage').then((m) => ({ default: m.HomePage })));
const IntakePage = React.lazy(() => import('./pages/IntakePage').then((m) => ({ default: m.IntakePage })));
const DynamicQuestionsPage = React.lazy(() => import('./pages/DynamicQuestionsPage').then((m) => ({ default: m.DynamicQuestionsPage })));
const AnalysisPage = React.lazy(() => import('./pages/AnalysisPage').then((m) => ({ default: m.AnalysisPage })));
const DocumentsPage = React.lazy(() => import('./pages/DocumentsPage').then((m) => ({ default: m.DocumentsPage })));
const CasesPage = React.lazy(() => import('./pages/CasesPage').then((m) => ({ default: m.CasesPage })));
const SettingsPage = React.lazy(() => import('./pages/SettingsPage').then((m) => ({ default: m.SettingsPage })));

function RouteFallback() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-20">
      <LoadingState
        stages={['Loading application view...']}
        subtext="Please wait a moment while the screen loads."
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="flex min-h-screen flex-col bg-white text-slate-900 antialiased font-sans">
          {/* Accessibility: Skip to main content link for keyboard and screen reader navigation */}
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:rounded-md focus:bg-slate-900 focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2"
          >
            Skip to main content
          </a>
          <Navbar />
          <main id="main-content" tabIndex={-1} className="flex-1 focus:outline-none">
            <React.Suspense fallback={<RouteFallback />}>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/intake" element={<IntakePage />} />
                <Route path="/intake/questions" element={<DynamicQuestionsPage />} />
                <Route path="/analysis/:caseId" element={<AnalysisPage />} />
                <Route path="/documents" element={<DocumentsPage />} />
                <Route path="/cases" element={<CasesPage />} />
                <Route path="/cases/:caseId" element={<AnalysisPage />} />
                <Route path="/settings" element={<SettingsPage />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </React.Suspense>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}
