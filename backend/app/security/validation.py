import re
import os
from typing import Tuple, Optional
from app.core.errors import ValidationError
from app.core.config import settings

# PDF header: %PDF-
PDF_MAGIC = b"%PDF"
# DOCX header: standard ZIP archive PK\x03\x04
DOCX_MAGIC = b"PK\x03\x04"

SAFE_FILENAME_REGEX = re.compile(r'^[a-zA-Z0-9_\-. ]+$')

def validate_narrative_text(text: str) -> str:
    """
    Validates user legal narrative input length and structure.
    """
    if not text or not text.strip():
        raise ValidationError("Situation narrative cannot be empty")

    cleaned = text.strip()
    if len(cleaned) < 10:
        raise ValidationError("Narrative is too short. Please provide at least 10 characters explaining your situation.")

    if len(cleaned) > settings.max_narrative_length:
        raise ValidationError(
            f"Narrative exceeds maximum allowed length of {settings.max_narrative_length} characters (received {len(cleaned)})."
        )

    # Reject null bytes or suspicious terminal control sequences
    if "\x00" in cleaned:
        raise ValidationError("Invalid characters detected in text")

    return cleaned

def validate_uploaded_file(filename: str, content: bytes, content_type: Optional[str] = None) -> Tuple[str, str]:
    """
    Validates file extension, size, filename security, and magic bytes.
    Returns: (cleaned_filename, verified_file_type)
    """
    if not filename:
        raise ValidationError("Filename must be provided")

    # Sanitize base filename and prevent path traversal
    base_name = os.path.basename(filename)
    if not SAFE_FILENAME_REGEX.match(base_name):
        # Clean filename to safe alphanumeric chars
        base_name = re.sub(r'[^a-zA-Z0-9_\-. ]', '_', base_name)
    
    if len(base_name) > 100:
        base_name = base_name[:96] + os.path.splitext(base_name)[1]

    ext = os.path.splitext(base_name)[1].lower()
    if ext not in settings.allowed_upload_extensions:
        raise ValidationError(
            f"Unsupported file format '{ext}'. Allowed formats: {', '.join(settings.allowed_upload_extensions)}"
        )

    if len(content) > settings.max_upload_size_bytes:
        raise ValidationError(
            f"File size ({len(content)} bytes) exceeds maximum limit of {settings.max_upload_size_bytes} bytes (10MB)"
        )

    if len(content) == 0:
        raise ValidationError("Uploaded file is empty")

    # Magic byte verification
    verified_type = "txt"
    if ext == ".pdf":
        if not content.startswith(PDF_MAGIC):
            raise ValidationError("File has .pdf extension but invalid PDF binary signature")
        verified_type = "pdf"
    elif ext == ".docx":
        if not content.startswith(DOCX_MAGIC):
            raise ValidationError("File has .docx extension but invalid DOCX binary signature")
        verified_type = "docx"
    elif ext in {".txt", ".md"}:
        try:
            content[:4096].decode("utf-8")
        except UnicodeDecodeError:
            raise ValidationError("Text file is not valid UTF-8 encoded text")
        verified_type = "txt"

    return base_name, verified_type
