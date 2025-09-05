"""
Dependencies for FastAPI application
"""
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from typing import Optional
import logging

from app.core.database import get_db
from app.core.auth import verify_token
from app.core.config import settings
from app.models import User

logger = logging.getLogger(__name__)

# Security schemes
strict_security = HTTPBearer()
optional_security = HTTPBearer(auto_error=False)

def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(strict_security),
    db: Session = Depends(get_db)
) -> User:
    """Get current authenticated user"""
    try:
        token = credentials.credentials
        user_id = verify_token(token)
        
        # Get user from database
        result = db.execute("SELECT * FROM user WHERE id = :user_id", {"user_id": user_id})
        user_data = result.fetchone()
        
        if not user_data:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="User not found"
            )
        
        return User(**user_data._asdict())
        
    except Exception as e:
        logger.error(f"Authentication error: {e}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials"
        )

def get_current_active_user(
    current_user: User = Depends(get_current_user)
) -> User:
    """Get current active user"""
    if not current_user.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Inactive user"
        )
    return current_user

def get_current_admin_user(
    current_user: User = Depends(get_current_active_user)
) -> User:
    """Get current admin user"""
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions"
        )
    return current_user

def get_optional_current_user(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(optional_security),
    db: Session = Depends(get_db)
) -> Optional[User]:
    """Return authenticated user if token provided; otherwise None. In development, endpoints may allow None."""
    if not credentials or not credentials.credentials:
        return None
    try:
        user_id = verify_token(credentials.credentials)
        result = db.execute("SELECT * FROM user WHERE id = :user_id", {"user_id": user_id})
        row = result.fetchone()
        return User(**row._asdict()) if row else None
    except Exception:
        # If token invalid treat as anonymous
        return None