import re
from typing import List, Tuple

# Disallowed definitive legal statements that breach the legal-information boundary
DEFINITIVE_CLAIMS = [
    (re.compile(r"\byou will win\b", re.IGNORECASE), "you may have options under"),
    (re.compile(r"\byou definitely have a claim\b", re.IGNORECASE), "a potential legal issue is presented"),
    (re.compile(r"\byou should sue\b", re.IGNORECASE), "one possible legal pathway to consider is initiating formal proceedings"),
    (re.compile(r"\bthis definitely violates the law\b", re.IGNORECASE), "this conduct may conflict with statutory provisions"),
    (re.compile(r"\byou are guaranteed\b", re.IGNORECASE), "the law may provide potential protection for"),
    (re.compile(r"\bI advise you to\b", re.IGNORECASE), "one potential step you might explore with an attorney is to"),
    (re.compile(r"\bas your attorney\b", re.IGNORECASE), "as an informational reference tool"),
]

def sanitize_legal_output_text(text: str) -> str:
    """
    Scans generated text and replaces definitive legal advice assertions
    with qualified informational legal language.
    """
    if not text:
        return ""
        
    sanitized = text
    for pattern, replacement in DEFINITIVE_CLAIMS:
        sanitized = pattern.sub(replacement, sanitized)
        
    return sanitized

def audit_legal_output_compliance(text: str) -> Tuple[bool, List[str]]:
    """
    Audits text to verify compliance with legal information guidelines.
    Returns (is_compliant, violations_list).
    """
    violations = []
    for pattern, _ in DEFINITIVE_CLAIMS:
        matches = pattern.findall(text)
        if matches:
            violations.append(f"Found definitive assertion: '{matches[0]}'")
            
    return len(violations) == 0, violations
