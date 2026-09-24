# Rights & Remedy Navigator

Rights & Remedy Navigator is a GenAI-powered legal information and assistance platform that helps users understand legal documents and situations, identify important information, organize evidence, explore possible next steps, and prepare questions for legal professionals.

## Problem

Legal information and contracts are often dense, complex, and difficult to navigate without professional assistance. Everyday individuals dealing with tenancy issues, employment disputes, or consumer contracts often struggle to understand their rights, identify critical clauses or deadlines, organize needed evidence, or formulate informed questions for an attorney.

## Solution

The platform makes basic legal information and document review accessible. Users can either upload or paste legal documents to simplify language and uncover obligations and risks, or describe a real-world legal situation to extract facts, explore potentially relevant rights and options, build an evidence checklist, and generate tailored questions for a lawyer. The system provides assistance and information, never replacing professional legal advice.

## How It Works

```
User has a legal document or legal problem
       ↓
Understand the information (Plain-language summaries & fact extraction)
       ↓
Identify important facts / clauses (Obligations, risks, deadlines, inconsistencies)
       ↓
Ask questions (Document Q&A & clarifying situation intake questions)
       ↓
Understand possible options (Relevant rights, remedies & 5-stage Remedy Path)
       ↓
Generate actionable checklist (Evidence tracking & next steps)
       ↓
Prepare for legal professional help (Tailored consultation questions)
```

## Key Features

- **Document Analysis:** Upload PDF, DOCX, TXT/Markdown or paste clauses for plain-language explanations.
- **Clause, Obligation & Risk Identification:** Pinpoint mandatory duties, critical terms, unilateral clauses, and potential risks.
- **Inconsistency Detection:** Detect conflicting provisions or ambiguous definitions within agreements.
- **Document Q&A:** Ask targeted questions against uploaded agreements with clause citations.
- **Legal Situation Intake:** Describe a situation in natural language with automated fact extraction.
- **Targeted Clarifying Questions:** AI generates 2–4 focused questions to resolve essential ambiguities.
- **Potentially Relevant Rights & Options:** Explore applicable rights and avenues of relief framed in qualified terms.
- **Remedy Path:** Practical 5-stage progression from early fact-gathering to negotiation and escalation.
- **Evidence & Action Checklist:** Interactive tracking of documents and records you have or still need.
- **Lawyer Preparation:** Structured, prioritized questions to maximize consultation time with an attorney.

## How GenAI Is Used

Google Gemini processes unstructured text to:
- Translate complex legal terminology into plain, accessible language.
- Extract structured facts and generate targeted clarifying questions.
- Identify contractual obligations, risks, and inconsistencies.
- Synthesize actionable checklists and lawyer consultation questions.

## RAG / Legal Source Grounding

Where statutory rights and remedies are presented, the system connects explanations to authoritative legal citations (statutes, administrative codes, and official regulatory guidance) and verifies citation references rather than inventing legal rules or filing deadlines.

## Architecture

```
React 19 + TypeScript (Vite, Tailwind CSS, Lucide)
       ↓
Node.js / Express API  ⇄  FastAPI Python Backend (PyMuPDF, python-docx)
       ↓
Legal Analysis & Retrieval Engine (Citation validation, fact extraction)
       ↓
Google Gemini API (Structured JSON output, temperature 0.1)
       ↓
Firebase (Authentication & Cloud Firestore for persistent case management)
```

## Example

1. **User provides a rental agreement/problem:** A tenant uploads a residential lease excerpt and notes an unreturned security deposit.
2. **System explains relevant information:** Translates deposit return clauses into plain terms and flags statutory timelines (e.g., 21-day return requirement in California).
3. **Highlights evidence & clauses:** Flags inspection notices, move-out photos, and payment receipts in an interactive checklist.
4. **Gives possible next steps:** Suggests sending a formal written itemization request before formal dispute escalation.
5. **Prepares lawyer questions:** Generates tailored questions regarding local small claims limits and statutory bad-faith penalties.

## Technology Stack

- **Frontend:** React 19, TypeScript, Vite, Tailwind CSS, React Router, Vitest
- **Backend:** Node.js Express, Python 3.11, FastAPI, Pydantic, Pytest
- **AI & Cloud:** Google Gemini API (`@google/genai`), Firebase Auth & Firestore

## Security & Privacy

- Client-side and server-side file type and size validation (PDF, DOCX, TXT up to 10MB).
- Prompt isolation fences (`<untrusted_user_narrative>`, `<untrusted_document_content>`) to prevent prompt injection.
- No storage of sensitive financial credentials or government identification numbers.

## Running Locally

```bash
# Install dependencies
npm install

# Configure environment variables
cp .env.example .env
# Set GEMINI_API_KEY in .env

# Run development server (Vite + Express on port 3000)
npm run dev

# Run test suites
npm test                     # Frontend Vitest suite (20 tests)
backend\.venv\Scripts\pytest # Backend Pytest suite (35 tests)
```

## Disclaimer

Rights & Remedy Navigator provides legal information, document analysis assistance, and organizational tools. It does not provide legal advice, representation, or attorney-client relationships. Users should consult a qualified legal professional for advice regarding their specific legal situation.
