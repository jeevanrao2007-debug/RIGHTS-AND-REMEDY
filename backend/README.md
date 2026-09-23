# Rights & Remedy Navigator - Backend

A secure, source-grounded legal information backend built with **Python 3.11+**, **FastAPI**, **Cloud Firestore**, and the **Gemini API (Google GenAI SDK)**.

> **CRITICAL LEGAL NOTICE**: This system is strictly an informational legal navigation and education tool. It does **NOT** provide professional legal advice, legal representation, or definitive claim guarantees.

---

## Architecture Overview

```
backend/
├── app/
│   ├── api/v1/                  # Clean FastAPI REST endpoints
│   │   ├── health.py            # Health and liveness probe
│   │   ├── intake.py            # Legal situation intake & follow-ups
│   │   ├── analysis.py          # Grounded legal analysis pipeline
│   │   ├── cases.py             # Case management & evidence tracking
│   │   ├── documents.py         # Multi-mode legal document intelligence
│   │   └── sources.py           # Authoritative legal source explorer
│   ├── core/                    # Core configuration and error handling
│   │   ├── config.py            # Pydantic Settings
│   │   ├── logging.py           # Safe JSON logging with PII/secret masking
│   │   └── errors.py            # Standardized exception hierarchy
│   ├── middleware/              # Security and observability middleware
│   │   ├── request_id.py        # Unique request ID tracing
│   │   ├── rate_limit.py        # Sliding-window rate limiter
│   │   └── auth.py              # Firebase Admin SDK token authentication
│   ├── models/                  # Internal data structures
│   ├── repositories/            # Storage abstraction with ownership enforcement
│   │   ├── case_repository.py   # Cloud Firestore + local fallback
│   │   ├── document_repository.py
│   │   └── source_repository.py # Verified statutory corpus
│   ├── schemas/                 # Strict Pydantic input/output schemas
│   │   ├── intake.py
│   │   ├── analysis.py
│   │   ├── cases.py
│   │   └── documents.py
│   ├── security/                # Security enforcement
│   │   ├── validation.py        # MIME, size, filename & magic-bytes checks
│   │   ├── prompt_security.py   # Delimiter defense against prompt injection
│   │   └── output_security.py   # Non-definitive legal language auditor
│   ├── services/                # Business logic & AI orchestration
│   │   ├── embedding_service.py # Vector embeddings with caching
│   │   ├── retrieval_service.py # Semantic & metadata-filtered statutory RAG
│   │   ├── citation_service.py  # Validation & hallucination rejection
│   │   ├── gemini_service.py    # Structured generation with retry controls
│   │   ├── remedy_service.py    # 5-stage non-prescriptive remedy path
│   │   ├── intake_service.py    # Fact extraction with preserved uncertainty
│   │   ├── legal_analysis_service.py
│   │   └── document_service.py  # PyMuPDF/docx safe text extraction
│   └── main.py                  # Application factory and route mounting
├── tests/                       # Complete automated test suite
│   ├── conftest.py              # Test client fixtures & mock auth
│   ├── unit/                    # Schemas, validation, citations, RAG
│   ├── integration/             # End-to-end API route tests
│   └── security/                # Auth isolation & prompt injection tests
├── Dockerfile                   # Production container for Cloud Run
├── requirements.txt             # Python dependencies
└── firestore.rules              # Enforced Firestore security rules
```

---

## Security & Grounding Directives

1. **Authoritative Ground Truth**: Gemini's pretrained weights are never treated as legal authority. All substantive claims and rights are grounded in statutory sources retrieved from the verified legal corpus.
2. **Citation Validation Service**: Any generated citation that does not match the retrieved source set is explicitly rejected. Hallucinated statutes or case numbers are rejected.
3. **No Definitive Advice Assertions**: Claims such as *"You will win"*, *"You definitely have a claim"*, or *"You should sue"* are strictly audited and replaced with qualified, informational legal language.
4. **Server-Side Authorization**: Case records are partition-isolated by authenticated Firebase UID. User A is strictly forbidden from accessing User B's records.
5. **Prompt Injection Defense**: User situations and document contents are strictly treated as untrusted data using delimiter tags (`<untrusted_user_narrative>`, `<untrusted_document_content>`) so adversarial instructions cannot hijack system instructions.

---

## API Endpoints

| Method | Path | Description |
| :--- | :--- | :--- |
| `GET` | `/api/v1/health` | Health and readiness check |
| `POST` | `/api/v1/intake` | Analyze situation, extract facts & targeted follow-ups |
| `POST` | `/api/v1/intake/questions` | Submit follow-up answers to refine factual basis |
| `POST` | `/api/v1/analysis` | Perform source-grounded legal analysis and remedy path |
| `GET` | `/api/v1/cases` | List user cases (paginated, auth verified) |
| `GET` | `/api/v1/cases/{id}` | Retrieve case by ID (strict ownership check) |
| `PATCH`| `/api/v1/cases/{id}/evidence/{evidence_id}` | Update evidence checklist item status |
| `DELETE`| `/api/v1/cases/{id}` | Delete case (strict ownership check) |
| `POST` | `/api/v1/documents` | Upload PDF/DOCX/TXT file with magic-bytes check |
| `POST` | `/api/v1/documents/{id}/analyze` | Multi-mode document intelligence analysis |
| `GET` | `/api/v1/sources/{id}` | Retrieve authoritative statutory source details |

---

## Running Locally

```bash
# 1. Create and activate virtual environment
python3 -m venv venv
source venv/bin/activate

# 2. Install dependencies
pip install -r requirements.txt

# 3. Configure environment
cp .env.example .env

# 4. Start local development server
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

## Running Tests

```bash
pytest
```
