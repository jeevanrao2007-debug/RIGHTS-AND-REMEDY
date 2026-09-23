# Rights & Remedy Navigator

> **AI for Legal Assistance & Access**  
> Source-grounded, accessible, and structured legal intelligence to help individuals understand their civil rights, explore realistic remedies, prepare evidence, and organize questions for licensed attorneys.

Live Production Deployment: [https://rights-and-remedy.web.app](https://rights-and-remedy.web.app)

---

## Overview

Unlike generic conversational chatbots that may hallucinate legal advice or invent statutory deadlines, **Rights & Remedy Navigator** enforces a rigorous, non-definitive, source-grounded problem-solving workflow:

```
USER'S REAL-LIFE SITUATION (Natural Language)
        ↓
FACT EXTRACTION & JURISDICTION GROUNDING
        ↓
IDENTIFY MISSING INFORMATION
        ↓
TARGETED FOLLOW-UP QUESTIONS (With rationales explaining why each detail matters)
        ↓
STATUTORY RETRIEVAL (RAG & Cosine Similarity)
        ↓
POTENTIALLY RELEVANT RIGHTS (Grounded in authoritative law)
        ↓
POSSIBLE REMEDIES (With prerequisites and procedural uncertainties)
        ↓
INTERACTIVE EVIDENCE CHECKLIST (Have / Need / Unsure tracking)
        ↓
VERIFIED STATUTORY DEADLINES (Conservative; zero invented dates)
        ↓
5-STAGE SIGNATURE REMEDY PATH
        ↓
TAILORED QUESTIONS FOR A LICENSED LAWYER
```

---

## Key Features

1. **Structured Situation Intake**: Accepts natural-language narratives without requiring formal legal jargon. Automatically detects civil domains (Housing, Employment, Consumer, Contracts, Family, etc.).
2. **Dynamic Clarifying Questionnaire**: Formulates 2 to 4 focused, high-impact follow-up questions to pinpoint critical statutory triggers.
3. **Source-Grounded Statutory Intelligence**: Connects claims with verified state and federal statutes, regulations, and official guidance. Rejects hallucinated citations.
4. **Interactive Evidence Checklist**: Real-time tracking of essential records (leases, paystubs, email trails, receipts) with persistent storage.
5. **Conservative Deadline Tracking**: Enforces strict verified timelines. If no verified statutory timeline is definitively confirmed, explicitly notes that no deadline was identified.
6. **Multi-Mode Document Intelligence**: Securely parses and reviews contracts, leases, and formal notices across 7 distinct analytical modes (Plain-English translation, obligations, critical clauses, potential risks, deadlines, inconsistencies, and targeted clause inquiries).
7. **Accessible & Responsive**: WCAG 2.2 AA compliant with full keyboard navigation, screen-reader semantics (`role="radiogroup"`, `role="radio"`), visible focus rings, and high-contrast color choices.

---

## Architecture

The project features a unified, resilient architecture:

```
┌──────────────────────────────────────────────────────────────┐
│                    React 19 + TypeScript                     │
│         Vite • TailwindCSS • Lucide Icons • Motion           │
└──────────────────────────────┬───────────────────────────────┘
                               │
            ┌──────────────────┴──────────────────┐
            ▼                                     ▼
 ┌───────────────────────┐            ┌────────────────────────┐
 │   Firebase Services   │            │   Unified API Gateway  │
 │  • Firebase Auth      │            │      (server.ts)       │
 │  • Cloud Firestore    │            └───────────┬────────────┘
 └───────────────────────┘                        │
                      ┌───────────────────────────┴───────────────────────────┐
                      ▼                                                       ▼
        ┌───────────────────────────┐                           ┌───────────────────────────┐
        │   Python FastAPI Engine   │ (When running)            │   Resilient Fallback      │
        │  • Statutory Embeddings   │ ◄─────────────────────────┤  • Google Gemini 2.5/Flash│
        │  • PyMuPDF / docx parsing │                           │  • Deterministic Legal    │
        │  • Citation Verifier      │                           │    Knowledge Base         │
        └───────────────────────────┘                           └───────────────────────────┘
```

---

## Security & Privacy

- **Server-Side Tenant & Case Isolation**: Strict ownership validation prevents Insecure Direct Object References (IDOR). Users can only view, update, or delete their own cases.
- **Untrusted Input Delimiters**: User narratives and document contents are strictly encapsulated in `<untrusted_user_narrative>` delimiters with XML escaping to prevent prompt injection.
- **Safe Document Processing**: File uploads validate magic bytes via PyMuPDF/python-docx with strict 10MB limits, preventing macro or script execution.
- **No Secret Leaks**: Zero API keys or service account tokens are exposed to frontend clients.

---

## Quick Start (Local Development)

### Prerequisites
- **Node.js**: v18+ (tested on Node v20/v24)
- **Python**: 3.10+ (optional, for statutory RAG engine)

### Option 1: One-Click Startup (Windows)
Double-click [`run.bat`](run.bat) or run in terminal:
```cmd
run.bat
```
This automatically installs dependencies, creates `.env` from template, launches the server on `http://localhost:3000`, and opens your default browser.

### Option 2: Standard Terminal
1. Install Node dependencies:
   ```bash
   npm install --legacy-peer-deps
   ```

2. Configure environment:
   ```bash
   cp .env.example .env
   # Add your GEMINI_API_KEY in .env
   ```

3. Start development server:
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` in your browser.

---

## Running the Automated Test Suites

### Frontend Tests (Vitest & React Testing Library)
```bash
npm test
```
*Executes 16 tests across 8 test suites covering intake, dynamic questionnaires, document uploads, evidence checklists, and accessibility.*

### Backend Tests (pytest)
```bash
backend\.venv\Scripts\pytest backend\tests
```
*Executes 27 tests covering statutory RAG, citation validation, prompt injection defense, document magic-byte validation, and IDOR prevention.*

### TypeScript Validation
```bash
npm run lint
```
*Ensures 0 type errors across all TypeScript files.*

### Production Build
```bash
npm run build
```

---

## Deployment

Configured for **Firebase Hosting**:
```bash
npx firebase-tools deploy --only hosting --project rights-and-remedy
```

---

## Legal Information Disclaimer

Rights & Remedy Navigator provides structured legal research and information for educational and organizational purposes only. It does not provide legal representation, does not form an attorney-client relationship, and is not a substitute for counsel from a licensed attorney in your jurisdiction.
