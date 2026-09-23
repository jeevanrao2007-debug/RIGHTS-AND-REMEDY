import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { HomePage } from './pages/HomePage';
import { IntakePage } from './pages/IntakePage';
import { DynamicQuestionsPage } from './pages/DynamicQuestionsPage';
import { AnalysisPage } from './pages/AnalysisPage';
import { DocumentsPage } from './pages/DocumentsPage';
import { CasesPage } from './pages/CasesPage';
import { SettingsPage } from './pages/SettingsPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <div className="flex min-h-screen flex-col bg-white text-slate-900 antialiased font-sans">
            <Navbar />
            <div className="flex-1">
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
            </div>
            <Footer />
          </div>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}
