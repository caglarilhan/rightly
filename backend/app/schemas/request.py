from pydantic import BaseModel, EmailStr
from typing import Optional, Dict, Any
from datetime import datetime
from enum import Enum

from app.models import RequestType, RequestStatus

class RequestBase(BaseModel):
    request_type: RequestType
    subject_email: EmailStr
    subject_name: Optional[str] = None
    subject_phone: Optional[str] = None
    subject_address: Optional[str] = None
    description: Optional[str] = None
    additional_info: Optional[Dict[str, Any]] = None

class RequestCreate(RequestBase):
    account_email: EmailStr  # Hangi account'a ait olduğunu belirtmek için

class RequestUpdate(BaseModel):
    request_type: Optional[RequestType] = None
    subject_email: Optional[EmailStr] = None
    subject_name: Optional[str] = None
    subject_phone: Optional[str] = None
    subject_address: Optional[str] = None
    description: Optional[str] = None
    additional_info: Optional[Dict[str, Any]] = None
    status: Optional[RequestStatus] = None

class RequestResponse(RequestBase):
    id: int
    account_id: int
    status: RequestStatus
    due_date: datetime
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
