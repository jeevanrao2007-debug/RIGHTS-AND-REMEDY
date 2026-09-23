import pytest
from app.security.validation import validate_narrative_text, validate_uploaded_file
from app.core.errors import ValidationError

def test_validate_narrative_text():
    assert validate_narrative_text("  Valid narrative with more than ten characters.  ") == "Valid narrative with more than ten characters."
    
    with pytest.raises(ValidationError):
        validate_narrative_text("")

    with pytest.raises(ValidationError):
        validate_narrative_text("Short")

    with pytest.raises(ValidationError):
        validate_narrative_text("Null\x00byte text is invalid")

def test_validate_uploaded_file():
    # Valid PDF magic bytes
    pdf_bytes = b"%PDF-1.4\nTest PDF content..."
    cleaned_name, file_type = validate_uploaded_file("lease_agreement.pdf", pdf_bytes)
    assert cleaned_name == "lease_agreement.pdf"
    assert file_type == "pdf"

    # Invalid PDF magic bytes
    with pytest.raises(ValidationError):
        validate_uploaded_file("fake.pdf", b"Not a real pdf")

    # Path traversal attempt
    traversal_bytes = b"%PDF-1.4\ncontent"
    cleaned_name, _ = validate_uploaded_file("../../../etc/passwd.pdf", traversal_bytes)
    assert "../" not in cleaned_name

    # Disallowed extension
    with pytest.raises(ValidationError):
        validate_uploaded_file("malicious.exe", b"binary content")
