import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  FileText,
  ShieldAlert,
  Compass,
  CheckSquare,
  HelpCircle,
  BookOpen,
  Scale,
  Sparkles,
  Lock,
  Layers,
  Search,
  AlertTriangle,
  FileCheck2,
} from 'lucide-react';
import { LegalDisclaimerBanner } from '../components/common/LegalDisclaimerBanner';

export const HomePage: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Top Concise Disclaimer */}
      <LegalDisclaimerBanner variant="compact" />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-slate-900 text-white py-20 lg:py-28">
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

        <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-800/80 px-3.5 py-1.5 text-xs font-medium text-slate-300 mb-8 backdrop-blur-xs">
            <Scale className="h-3.5 w-3.5 text-emerald-400" aria-hidden="true" />
            <span>AI for Legal Assistance & Access</span>
          </div>

          <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl text-white max-w-4xl mx-auto leading-tight sm:leading-none">
            <span className="block">Understand your situation.</span>
            <span className="block text-slate-200 mt-2">Know your possible options.</span>
            <span className="block text-emerald-400 mt-2">Take the next step.</span>
          </h1>

          <p className="mt-8 text-lg sm:text-xl text-slate-300 max-w-3xl mx-auto font-normal leading-relaxed">
            Rights & Remedy Navigator helps you understand legal information and documents, identify important facts and clauses, organize evidence, explore possible next steps, and prepare questions for legal professionals.
          </p>

          {/* Action CTAs */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/intake"
              id="hero-primary-cta"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 rounded-lg bg-emerald-500 px-6 py-3.5 text-base font-semibold text-slate-950 shadow-sm hover:bg-emerald-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2 focus:ring-offset-slate-900 transition-colors"
            >
              <span>Tell us what happened</span>
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>

            <Link
              to="/documents"
              id="hero-secondary-cta"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 rounded-lg border border-slate-700 bg-slate-800/90 px-6 py-3.5 text-base font-medium text-white hover:bg-slate-700 focus:outline-hidden focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 focus:ring-offset-slate-900 transition-colors"
            >
              <FileText className="h-4 w-4 text-slate-300" aria-hidden="true" />
              <span>Analyze a legal document</span>
            </Link>
          </div>

          {/* Trust Guarantees */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400">
            <div className="flex items-center gap-1.5">
              <Lock className="h-3.5 w-3.5 text-slate-400" />
              <span>Private & Non-Commercial</span>
            </div>
            <div className="flex items-center gap-1.5">
              <BookOpen className="h-3.5 w-3.5 text-slate-400" />
              <span>Grounded in Official Statutes</span>
            </div>
            <div className="flex items-center gap-1.5">
              <ShieldAlert className="h-3.5 w-3.5 text-slate-400" />
              <span>Verified Deadline Identification</span>
            </div>
          </div>
        </div>
      </section>

      {/* User Journey Flow Section */}
      <section className="py-16 sm:py-20 bg-slate-50 border-b border-slate-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              The User Journey
            </h2>
            <p className="mt-2 text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              From Complex Legal Questions to Practical Next Steps
            </p>
            <p className="mt-3 text-base text-slate-600">
              Navigate contracts, leases, policies, and civil legal situations through a clear, structured assistance workflow.
            </p>
          </div>

          {/* 6-Step Visual Journey */}
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md">
                  Step 1
                </span>
                <BookOpen className="h-5 w-5 text-slate-400" />
              </div>
              <h3 className="text-base font-semibold text-slate-900">
                Understand the Information
              </h3>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                Translate dense legal documents into plain English summaries or organize your personal narrative into core established facts.
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md">
                  Step 2
                </span>
                <Search className="h-5 w-5 text-slate-400" />
              </div>
              <h3 className="text-base font-semibold text-slate-900">
                Identify Facts & Clauses
              </h3>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                Pinpoint mandatory duties, critical terms, unilateral clauses, potential legal risks, deadlines, and internal inconsistencies.
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md">
                  Step 3
                </span>
                <HelpCircle className="h-5 w-5 text-slate-400" />
              </div>
              <h3 className="text-base font-semibold text-slate-900">
                Ask Questions & Clarify
              </h3>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                Query uploaded documents directly with clause citations, or answer 2 to 4 targeted intake questions to resolve missing details.
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md">
                  Step 4
                </span>
                <Scale className="h-5 w-5 text-slate-400" />
              </div>
              <h3 className="text-base font-semibold text-slate-900">
                Understand Possible Options
              </h3>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                Explore potentially relevant rights and actionable remedies backed by statutes, with prerequisites and procedural uncertainties stated.
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md">
                  Step 5
                </span>
                <CheckSquare className="h-5 w-5 text-slate-400" />
              </div>
              <h3 className="text-base font-semibold text-slate-900">
                Generate Actionable Checklist
              </h3>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                Track evidence you have or still need with interactive status toggles, and review concrete immediate and short-term next steps.
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md">
                  Step 6
                </span>
                <FileCheck2 className="h-5 w-5 text-slate-400" />
              </div>
              <h3 className="text-base font-semibold text-slate-900">
                Prepare for a Legal Professional
              </h3>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                Export case-tailored, prioritized questions to maximize every minute and dollar of a formal attorney consultation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Two Core Capabilities: Documents + Situations */}
      <section className="py-16 sm:py-20 bg-white border-b border-slate-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Capability 1: Document Intelligence */}
            <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-8 space-y-5 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 rounded-md bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">
                  <FileText className="h-4 w-4" />
                  <span>Document Intelligence</span>
                </div>
                <h3 className="text-2xl font-bold text-slate-900">
                  Analyze & Compare Legal Documents
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Provide PDF, Word (DOCX), text files, or pasted contract clauses to extract insights across 7 dedicated analysis modes:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2 text-xs text-slate-700">
                  <div className="flex items-center gap-2 bg-white p-2.5 rounded-lg border border-slate-200">
                    <span className="h-2 w-2 rounded-full bg-emerald-500 shrink-0" />
                    <span>Plain English simplification</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white p-2.5 rounded-lg border border-slate-200">
                    <span className="h-2 w-2 rounded-full bg-emerald-500 shrink-0" />
                    <span>Obligation identification</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white p-2.5 rounded-lg border border-slate-200">
                    <span className="h-2 w-2 rounded-full bg-emerald-500 shrink-0" />
                    <span>Important clause highlights</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white p-2.5 rounded-lg border border-slate-200">
                    <span className="h-2 w-2 rounded-full bg-emerald-500 shrink-0" />
                    <span>Potential risk & trap detection</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white p-2.5 rounded-lg border border-slate-200">
                    <span className="h-2 w-2 rounded-full bg-emerald-500 shrink-0" />
                    <span>Dates, deadlines & notice windows</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white p-2.5 rounded-lg border border-slate-200">
                    <span className="h-2 w-2 rounded-full bg-emerald-500 shrink-0" />
                    <span>Inconsistency & ambiguity check</span>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  to="/documents"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-slate-900 hover:text-emerald-600 transition-colors"
                >
                  <span>Open Document Review</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            {/* Capability 2: Situation Intake & Strategy */}
            <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-8 space-y-5 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 rounded-md bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-800">
                  <Compass className="h-4 w-4" />
                  <span>Situation Assistance</span>
                </div>
                <h3 className="text-2xl font-bold text-slate-900">
                  Navigate Real-World Legal Problems
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Describe what happened in your own words. The system structures your facts, asks focused clarifying questions, and maps out your possible next steps:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2 text-xs text-slate-700">
                  <div className="flex items-center gap-2 bg-white p-2.5 rounded-lg border border-slate-200">
                    <span className="h-2 w-2 rounded-full bg-emerald-500 shrink-0" />
                    <span>Automated fact extraction</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white p-2.5 rounded-lg border border-slate-200">
                    <span className="h-2 w-2 rounded-full bg-emerald-500 shrink-0" />
                    <span>2–4 targeted clarifying questions</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white p-2.5 rounded-lg border border-slate-200">
                    <span className="h-2 w-2 rounded-full bg-emerald-500 shrink-0" />
                    <span>Potentially relevant legal rights</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white p-2.5 rounded-lg border border-slate-200">
                    <span className="h-2 w-2 rounded-full bg-emerald-500 shrink-0" />
                    <span>Interactive 5-stage Remedy Path</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white p-2.5 rounded-lg border border-slate-200">
                    <span className="h-2 w-2 rounded-full bg-emerald-500 shrink-0" />
                    <span>Evidence checklist (Have/Need)</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white p-2.5 rounded-lg border border-slate-200">
                    <span className="h-2 w-2 rounded-full bg-emerald-500 shrink-0" />
                    <span>Prioritized questions for a lawyer</span>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  to="/intake"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-slate-900 hover:text-emerald-600 transition-colors"
                >
                  <span>Start Situation Intake</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Statutory Rigor & Qualified Language Section */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 rounded-md bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Statutory Rigor Without False Certainty</span>
              </div>
              <h2 className="text-3xl font-bold tracking-tight text-slate-900">
                No invented dates. No guaranteed outcomes.
              </h2>
              <p className="text-base text-slate-600 leading-relaxed">
                Legal situations are sensitive and high-stakes. Rights & Remedy Navigator adheres strictly to verified sources and qualified language. When a deadline is verified by statute (such as security deposit turnaround or agency filing windows), it cites the triggering event. If no deadline is verified, it states so plainly.
              </p>

              <div className="space-y-3 pt-2">
                <div className="flex items-start gap-3">
                  <div className="mt-1 h-5 w-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 text-xs font-bold">
                    ✓
                  </div>
                  <p className="text-sm text-slate-700">
                    <strong className="font-semibold text-slate-900">Potentially Relevant Rights:</strong> Clear explanations of protections that may apply without asserting unproven legal certainty.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="mt-1 h-5 w-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 text-xs font-bold">
                    ✓
                  </div>
                  <p className="text-sm text-slate-700">
                    <strong className="font-semibold text-slate-900">Document Analysis Modes:</strong> Upload contracts, leases, or notices to pinpoint obligations, critical clauses, and potential risks.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="mt-1 h-5 w-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 text-xs font-bold">
                    ✓
                  </div>
                  <p className="text-sm text-slate-700">
                    <strong className="font-semibold text-slate-900">Consultation Preparation:</strong> Prepares focused questions and an organized brief before speaking with licensed legal counsel.
                  </p>
                </div>
              </div>

              <div className="pt-4">
                <Link
                  to="/intake"
                  id="home-secondary-intake-link"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-slate-900 hover:text-emerald-600 transition-colors"
                >
                  <span>Start your legal intake analysis</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            {/* Simulated Structured Dashboard Card */}
            <div className="lg:col-span-6">
              <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-6 shadow-md">
                <div className="flex items-center justify-between border-b border-slate-200 pb-4 mb-4">
                  <div className="flex items-center gap-2">
                    <span className="rounded-md bg-slate-900 px-2.5 py-1 text-xs font-semibold text-white">
                      Housing
                    </span>
                    <span className="text-xs text-slate-500 font-medium">California, USA</span>
                  </div>
                  <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    Active Case Analysis
                  </span>
                </div>

                <div className="space-y-4">
                  <div className="rounded-lg bg-white p-4 border border-slate-200">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      Potentially Relevant Right
                    </h4>
                    <p className="text-sm font-semibold text-slate-900 mt-1">
                      Right to Timely Return of Deposit or Itemized Deductions
                    </p>
                    <p className="text-xs text-slate-600 mt-1">
                      Cal. Civ. Code § 1950.5(g)(1) requires itemized accounting within 21 calendar days of vacating.
                    </p>
                  </div>

                  <div className="rounded-lg bg-white p-4 border border-slate-200">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      Verified Statutory Deadline
                    </h4>
                    <p className="text-sm font-semibold text-amber-900 mt-1">
                      21 Calendar Days from Key Surrender
                    </p>
                    <p className="text-xs text-slate-600 mt-1">
                      Trigger: Physical return of keys and possession of premises.
                    </p>
                  </div>

                  <div className="rounded-lg bg-white p-4 border border-slate-200">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      Actionable Remedy Path
                    </h4>
                    <div className="flex items-center gap-2 mt-2 text-xs font-medium text-slate-700 overflow-x-auto pb-1">
                      <span className="bg-slate-100 px-2 py-1 rounded-sm text-slate-900 font-semibold">1. Facts</span>
                      <span>→</span>
                      <span className="bg-slate-100 px-2 py-1 rounded-sm text-slate-900 font-semibold">2. Rights</span>
                      <span>→</span>
                      <span className="bg-slate-100 px-2 py-1 rounded-sm text-slate-900 font-semibold">3. Evidence</span>
                      <span>→</span>
                      <span className="bg-emerald-100 text-emerald-900 px-2 py-1 rounded-sm font-bold">4. Demand</span>
                      <span>→</span>
                      <span className="bg-slate-100 px-2 py-1 rounded-sm text-slate-900 font-semibold">5. Escalation</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
