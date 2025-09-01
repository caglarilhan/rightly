from pydantic import BaseModel, EmailStr
from typing import Optional, Dict, Any
from datetime import datetime

class AccountBase(BaseModel):
    """Temel account şeması"""
    email: EmailStr
    company_name: Optional[str] = None

class AccountCreate(AccountBase):
    """Yeni account oluşturma şeması"""
    pass

class AccountUpdate(BaseModel):
    """Account güncelleme şeması"""
    email: Optional[EmailStr] = None
    company_name: Optional[str] = None
    plan: Optional[str] = None
    status: Optional[str] = None
    settings: Optional[Dict[str, Any]] = None

class AccountResponse(AccountBase):
    """Account yanıt şeması"""
    id: int
    plan: str
    status: str
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True

