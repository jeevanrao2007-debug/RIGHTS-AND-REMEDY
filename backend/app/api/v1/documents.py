from fastapi import APIRouter, UploadFile, File, Form, Depends, Path
from typing import Optional
from app.schemas.documents import (
    DocumentUploadResponse,
    DocumentAnalyzeRequest,
    DocumentAnalysisResult,
    DocumentAnalysisMode
)
from app.services.document_service import document_service
from app.middleware.auth import get_optional_user, AuthenticatedUser

router = APIRouter(prefix="/documents", tags=["Document Review"])

@router.post("", response_model=DocumentUploadResponse)
async def upload_document(
    file: UploadFile = File(...),
    case_id: Optional[str] = Form(default=None),
    user: Optional[AuthenticatedUser] = Depends(get_optional_user)
):
    """
    Safely uploads and parses legal document files (PDF, DOCX, TXT).
    Validates magic bytes and extracts plain text without script execution.
    """
    user_id = user.uid if user else "anonymous-session"
    content = await file.read()
    return await document_service.upload_document(
        filename=file.filename or "uploaded_document",
        content=content,
        user_id=user_id,
        case_id=case_id
    )

@router.post("/{document_id}/analyze", response_model=DocumentAnalysisResult)
async def analyze_uploaded_document(
    document_id: str = Path(...),
    request: DocumentAnalyzeRequest = DocumentAnalyzeRequest(),
    user: Optional[AuthenticatedUser] = Depends(get_optional_user)
):
    """
    Runs multi-mode document intelligence on an uploaded document.
    """
    user_id = user.uid if user else "anonymous-session"
    return await document_service.analyze_document(
        document_id=document_id,
        request=request,
        user_id=user_id
    )

# Direct compatibility route for frontend direct paste
@router.post("/analyze", response_model=DocumentAnalysisResult)
async def analyze_document_direct(
    request: DocumentAnalyzeRequest,
    user: Optional[AuthenticatedUser] = Depends(get_optional_user)
):
    user_id = user.uid if user else "anonymous-session"
    return await document_service.analyze_document(
        document_id="direct_text",
        request=request,
        user_id=user_id
    )
