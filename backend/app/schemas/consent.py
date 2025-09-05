"""
Consent schemas
"""
from pydantic import BaseModel, Field, EmailStr
from typing import Optional, List
from datetime import datetime
from app.models import ConsentStatus, ConsentChannel

class ConsentEventCreate(BaseModel):
    """Create consent event request"""
    subject_id: str = Field(..., description="Subject identifier (email, phone, etc.)")
    channel: ConsentChannel = Field(..., description="Consent channel")
    purpose: str = Field(..., description="Purpose of consent")
    status: ConsentStatus = Field(..., description="Consent status")
    source: Optional[str] = Field(None, description="Source of consent")
    campaign_id: Optional[str] = Field(None, description="Campaign identifier")
    metadata: Optional[dict] = Field(None, description="Additional metadata")

class ConsentEventResponse(BaseModel):
    """Consent event response"""
    id: int
    organization_id: int
    subject_id: str
    channel: ConsentChannel
    purpose: str
    status: ConsentStatus
    source: Optional[str]
    campaign_id: Optional[str]
    ip_address: Optional[str]
    user_agent: Optional[str]
    occurred_at: datetime
    created_at: datetime
    metadata: Optional[dict]

    class Config:
        from_attributes = True

class PreferenceUpdate(BaseModel):
    """Update preferences request"""
    email_opt_in: Optional[bool] = None
    sms_opt_in: Optional[bool] = None
    push_opt_in: Optional[bool] = None
    phone_opt_in: Optional[bool] = None
    marketing_email: Optional[bool] = None
    marketing_sms: Optional[bool] = None
    marketing_push: Optional[bool] = None
    frequency_email: Optional[str] = None
    frequency_sms: Optional[str] = None
    preferences: Optional[dict] = None

class PreferenceResponse(BaseModel):
    """Preference response"""
    id: int
    organization_id: int
    subject_id: str
    email_opt_in: bool
    sms_opt_in: bool
    push_opt_in: bool
    phone_opt_in: bool
    marketing_email: bool
    marketing_sms: bool
    marketing_push: bool
    frequency_email: str
    frequency_sms: str
    created_at: datetime
    updated_at: datetime
    preferences: Optional[dict]

    class Config:
        from_attributes = True

class ConsentHistoryResponse(BaseModel):
    """Consent history response"""
    subject_id: str
    events: List[ConsentEventResponse]
    current_preferences: Optional[PreferenceResponse]
