import os
from typing import List, Set
from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import Field

class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )

    # Server settings
    port: int = Field(default=8000, alias="PORT")
    environment: str = Field(default="development", alias="ENVIRONMENT")
    log_level: str = Field(default="INFO", alias="LOG_LEVEL")
    api_v1_prefix: str = "/api/v1"

    # CORS
    allowed_origins: str = Field(default="*", alias="ALLOWED_ORIGINS")

    # Gemini settings
    gemini_api_key: str = Field(default="", alias="GEMINI_API_KEY")
    gemini_model: str = "gemini-3.8-flash"
    gemini_embedding_model: str = "gemini-embedding-2-preview"
    gemini_timeout_seconds: float = 60.0
    gemini_max_retries: int = 2

    # Firebase / Firestore settings
    firebase_project_id: str = Field(default="", alias="FIREBASE_PROJECT_ID")
    firebase_credentials_path: str = Field(default="", alias="FIREBASE_CREDENTIALS_PATH")
    google_application_credentials: str = Field(default="", alias="GOOGLE_APPLICATION_CREDENTIALS")

    # Security & Input Limits
    max_upload_size_bytes: int = 10 * 1024 * 1024  # 10 MB
    allowed_upload_extensions: Set[str] = {".txt", ".pdf", ".docx", ".md"}
    max_narrative_length: int = 15000
    max_document_text_length: int = 100000

    # Rate Limiting
    rate_limit_requests_per_minute: int = 60

    @property
    def cors_origins_list(self) -> List[str]:
        if self.allowed_origins == "*":
            return ["*"]
        return [o.strip() for o in self.allowed_origins.split(",") if o.strip()]

settings = Settings()
