import os
from typing import Optional, Dict, Any
from pydantic import BaseModel
from fastapi import Request, Depends, Header
import firebase_admin
from firebase_admin import auth as firebase_auth, credentials

from app.core.config import settings
from app.core.errors import UnauthorizedError
from app.core.logging import logger

class AuthenticatedUser(BaseModel):
    uid: str
    email: Optional[str] = None
    email_verified: bool = False
    claims: Dict[str, Any] = {}

_firebase_app_initialized = False

def init_firebase_admin():
    global _firebase_app_initialized
    if _firebase_app_initialized or len(firebase_admin._apps) > 0:
        _firebase_app_initialized = True
        return

    try:
        cred_path = settings.firebase_credentials_path or settings.google_application_credentials
        if cred_path and os.path.exists(cred_path):
            cred = credentials.Certificate(cred_path)
            firebase_admin.initialize_app(cred, {
                'projectId': settings.firebase_project_id or None
            })
            logger.info("Firebase Admin SDK initialized with certificate")
        elif settings.firebase_project_id:
            firebase_admin.initialize_app(options={
                'projectId': settings.firebase_project_id
            })
            logger.info(f"Firebase Admin SDK initialized with projectId {settings.firebase_project_id}")
        else:
            # Try default credentials
            firebase_admin.initialize_app()
            logger.info("Firebase Admin SDK initialized with default application credentials")
        _firebase_app_initialized = True
    except Exception as e:
        logger.warning(f"Firebase Admin initialization deferred/failed: {str(e)}")

async def get_optional_user(
    request: Request,
    authorization: Optional[str] = Header(default=None)
) -> Optional[AuthenticatedUser]:
    """
    Returns the authenticated user if a valid Bearer token is provided,
    or None if no authorization header is present.
    """
    if not authorization:
        return None

    if not authorization.startswith("Bearer "):
        raise UnauthorizedError("Authorization header must begin with 'Bearer '")

    id_token = authorization.split("Bearer ")[1].strip()
    if not id_token:
        return None

    # Test mode / Mock token support for unit & security tests
    if os.getenv("TESTING") == "1" or settings.environment == "test":
        if id_token.startswith("mock_token_"):
            uid = id_token.replace("mock_token_", "")
            return AuthenticatedUser(uid=uid, email=f"{uid}@example.com", email_verified=True)
        raise UnauthorizedError("Invalid or expired Firebase ID token")

    # Real Firebase ID token verification
    init_firebase_admin()
    try:
        decoded_token = firebase_auth.verify_id_token(id_token, check_revoked=False)
        uid = decoded_token.get("uid")
        if not uid:
            raise UnauthorizedError("Invalid Firebase token: missing uid")
        
        return AuthenticatedUser(
            uid=uid,
            email=decoded_token.get("email"),
            email_verified=bool(decoded_token.get("email_verified", False)),
            claims=decoded_token
        )
    except Exception as e:
        logger.warning(f"Firebase token verification failed: {type(e).__name__}")
        raise UnauthorizedError("Invalid or expired Firebase ID token")

async def get_current_user(
    user: Optional[AuthenticatedUser] = Depends(get_optional_user)
) -> AuthenticatedUser:
    """
    Guarantees an authenticated user. Rejects with 401 Unauthorized if not authenticated.
    """
    if not user or not user.uid:
        raise UnauthorizedError("Authentication required to access this resource")
    return user
