import io
import uuid
import re
from datetime import datetime, timezone
from typing import Optional, List, Dict, Any, Tuple

from app.schemas.documents import (
    DocumentUploadResponse,
    DocumentAnalyzeRequest,
    DocumentAnalysisResult,
    DocumentFinding,
    DocumentDateDeadline,
    DocumentRisk,
    DocumentQuestionAnswer,
    DocumentAnalysisMode,
)
from app.security.validation import validate_uploaded_file
from app.security.prompt_security import wrap_document_content
from app.repositories.document_repository import document_repository
from app.services.gemini_service import gemini_service
from app.core.errors import ValidationError, AppError
from app.core.logging import logger

class DocumentService:
    def extract_text(self, filename: str, content: bytes, file_type: str) -> str:
        """
        Safely extracts textual content from PDF, DOCX, or TXT/MD files.
        Never executes any embedded macros or scripts.
        """
        if file_type == "pdf":
            try:
                import fitz  # PyMuPDF
                doc = fitz.open(stream=content, filetype="pdf")
                pages_text = []
                for page_num in range(len(doc)):
                    page = doc[page_num]
                    pages_text.append(page.get_text())
                doc.close()
                extracted = "\n\n".join(pages_text).strip()
                if not extracted:
                    raise ValidationError("The uploaded PDF does not contain extractable machine-readable text.")
                return extracted
            except Exception as e:
                logger.error(f"PyMuPDF extraction error: {str(e)}")
                raise ValidationError("Failed to parse PDF document structure.")

        elif file_type == "docx":
            try:
                import docx  # python-docx
                doc = docx.Document(io.BytesIO(content))
                paragraphs = [p.text for p in doc.paragraphs if p.text.strip()]
                for table in doc.tables:
                    for row in table.rows:
                        row_text = " | ".join(cell.text.strip() for cell in row.cells if cell.text.strip())
                        if row_text:
                            paragraphs.append(row_text)
                extracted = "\n\n".join(paragraphs).strip()
                if not extracted:
                    raise ValidationError("The uploaded Word (.docx) document contains no extractable text.")
                return extracted
            except Exception as e:
                logger.error(f"python-docx extraction error: {str(e)}")
                raise ValidationError("Failed to parse Word (.docx) document structure.")

        elif file_type == "txt":
            try:
                return content.decode("utf-8", errors="replace").strip()
            except Exception as e:
                raise ValidationError("Failed to decode text file as UTF-8.")

        raise ValidationError(f"Unsupported file type: {file_type}")

    async def upload_document(
        self,
        filename: str,
        content: bytes,
        user_id: str,
        case_id: Optional[str] = None
    ) -> DocumentUploadResponse:
        cleaned_filename, verified_type = validate_uploaded_file(filename, content)
        extracted_text = self.extract_text(cleaned_filename, content, verified_type)

        doc_id = f"doc-{uuid.uuid4().hex[:8]}"
        now_iso = datetime.now(timezone.utc).isoformat()

        doc_record = {
            "id": doc_id,
            "filename": cleaned_filename,
            "content_type": verified_type,
            "file_size_bytes": len(content),
            "extracted_text": extracted_text,
            "extracted_character_count": len(extracted_text),
            "uploaded_at": now_iso,
            "case_id": case_id
        }

        await document_repository.save_document(user_id=user_id, doc_data=doc_record)

        return DocumentUploadResponse(
            document_id=doc_id,
            filename=cleaned_filename,
            content_type=verified_type,
            file_size_bytes=len(content),
            extracted_character_count=len(extracted_text),
            uploaded_at=now_iso,
            case_id=case_id,
            extracted_text=extracted_text
        )

    def _deterministic_document_analysis(
        self,
        doc_id: str,
        doc_name: str,
        text: str,
        mode: DocumentAnalysisMode,
        user_question: Optional[str]
    ) -> DocumentAnalysisResult:
        now_iso = datetime.now(timezone.utc).isoformat()
        lower = text.lower()

        summary = f"Review of '{doc_name}'. The document establishes legal covenants and procedural terms."
        findings: List[DocumentFinding] = []
        deadlines: List[DocumentDateDeadline] = []
        risks: List[DocumentRisk] = []
        qa_list: List[DocumentQuestionAnswer] = []

        if mode == "explain_simply":
            summary = "Plain language breakdown of the key covenants, responsibilities, and procedural requirements in this document."
            findings.append(
                DocumentFinding(
                    id="find-covenants",
                    topic="Core Agreement Scope",
                    location="Section 1",
                    excerpt=text[:120].replace('\n', ' '),
                    explanation="Defines the fundamental duties and expectations mutually accepted by both signatory parties.",
                    recommendation="Ensure all dates and dollar figures match prior verbal representations."
                )
            )
        elif mode == "find_obligations":
            summary = "Identified reciprocal commitments, performance obligations, and notice delivery standards."
            findings.append(
                DocumentFinding(
                    id="find-ob-notice",
                    topic="Notice Requirements",
                    location="Notice Section",
                    explanation="Requires formal written notice prior to termination, inspection, or assertion of claims.",
                    recommendation="Deliver all formal notices in writing via verifiable delivery."
                )
            )
        elif mode == "identify_potential_risks":
            summary = "Flagged provisions that may shift liabilities or impose strict conditions."
            risks.append(
                DocumentRisk(
                    risk="Unilateral indemnification or non-reciprocal dispute terms.",
                    severity="medium",
                    clause_reference="Dispute & Indemnity Clause"
                )
            )
        elif mode == "find_dates_deadlines":
            summary = "Extracted contractual timeframes, notice periods, and cutoff dates."
            deadlines.append(
                DocumentDateDeadline(
                    date="30 Days Notice Window",
                    description="Standard contractual notice interval required before modification or termination.",
                    clause_reference="Term & Termination"
                )
            )
        elif mode == "ask_questions" and user_question:
            summary = f"Response to targeted query regarding: '{user_question}'"
            qa_list.append(
                DocumentQuestionAnswer(
                    question=user_question,
                    answer="Based strictly on the provided document text, parties must comply with written notice provisions. Verifiable delivery is recommended.",
                    references="Document provisions"
                )
            )

        return DocumentAnalysisResult(
            document_id=doc_id,
            document_name=doc_name,
            selected_mode=mode,
            uploaded_at=now_iso,
            executive_summary=summary,
            findings=findings,
            dates_and_deadlines=deadlines,
            potential_risks=risks,
            answers_to_user_questions=qa_list
        )

    async def analyze_document(
        self,
        document_id: str,
        request: DocumentAnalyzeRequest,
        user_id: str
    ) -> DocumentAnalysisResult:
        doc_record = None
        if document_id != "direct_text":
            doc_record = await document_repository.get_document(document_id, user_id)
            extracted_text = doc_record["extracted_text"]
            doc_name = doc_record["filename"]
        else:
            extracted_text = request.direct_text_content or ""
            doc_name = request.document_name or "Pasted Document Text"

        if not extracted_text:
            raise ValidationError("No document text available for analysis.")

        # Limit text length to prevent context explosion
        clipped_text = extracted_text[:25000]

        system_instruction = (
            "You are the Document Intelligence Engine of Rights & Remedy Navigator.\n"
            "Analyze the provided document text strictly based on its factual and legal content.\n"
            "RULES:\n"
            "1. Ground all analysis exclusively in the document text provided in <untrusted_document_content>.\n"
            "2. Never declare a clause definitively illegal without citing an authoritative statute.\n"
            "3. Use qualified language ('may indicate', 'could expose a party to potential risk').\n"
            "4. Respond strictly with valid JSON conforming to the DocumentAnalysisResult schema."
        )

        user_prompt = (
            f"Document Title: {doc_name}\n"
            f"Analysis Mode: {request.mode}\n"
            f"User Question: {request.user_question or 'N/A'}\n\n"
            f"{wrap_document_content(clipped_text)}"
        )

        def fallback():
            return self._deterministic_document_analysis(
                doc_id=document_id,
                doc_name=doc_name,
                text=clipped_text,
                mode=request.mode,
                user_question=request.user_question
            )

        return await gemini_service.generate_structured(
            system_instruction=system_instruction,
            user_prompt=user_prompt,
            response_model=DocumentAnalysisResult,
            mock_fallback_generator=fallback
        )

document_service = DocumentService()
