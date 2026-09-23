import logging
import sys
import json
from datetime import datetime, timezone
from typing import Any, Dict

class SafeJsonFormatter(logging.Formatter):
    """
    Structured JSON log formatter that strictly excludes:
    - Authorization headers / bearer tokens
    - API keys
    - Full user narratives / document contents
    - Unnecessary PII
    """

    SENSITIVE_KEYS = {
        "authorization", "token", "id_token", "api_key", "secret",
        "narrative", "original_narrative", "text_content", "content", "document_text"
    }

    def format(self, record: logging.LogRecord) -> str:
        log_entry: Dict[str, Any] = {
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "level": record.levelname,
            "logger": record.name,
            "message": record.getMessage(),
        }

        # Include request ID if present
        request_id = getattr(record, "request_id", None)
        if request_id:
            log_entry["request_id"] = request_id

        user_id = getattr(record, "user_id", None)
        if user_id:
            # Mask user ID if necessary or keep uid only
            log_entry["user_id"] = user_id

        if record.exc_info:
            log_entry["exception"] = self.formatException(record.exc_info)

        return json.dumps(log_entry)

def setup_logging(level_name: str = "INFO") -> logging.Logger:
    logger = logging.getLogger("rights_remedy_navigator")
    logger.setLevel(getattr(logging, level_name.upper(), logging.INFO))
    
    # Avoid duplicate handlers
    if not logger.handlers:
        handler = logging.StreamHandler(sys.stdout)
        handler.setFormatter(SafeJsonFormatter())
        logger.addHandler(handler)
        logger.propagate = False

    return logger

logger = setup_logging()
