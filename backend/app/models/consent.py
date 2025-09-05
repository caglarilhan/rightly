"""
Consent and preference models
"""
from sqlmodel import SQLModel, Field
from typing import Optional, List
from datetime import datetime
from app.models.enums import ConsentStatus, ConsentChannel

class ConsentEvent(SQLModel, table=True):
    """Consent event tracking"""
    
    id: Optional[int] = Field(default=None, primary_key=True)
    organization_id: int = Field(foreign_key="organization.id", index=True)
    subject_id: str = Field(index=True)  # User identifier (email, phone, etc.)
    
    # Consent details
    channel: ConsentChannel
    purpose: str
    status: ConsentStatus
    
    # Source tracking
    source: Optional[str] = None  # Where consent was given (website, app, etc.)
    campaign_id: Optional[str] = None
    
    # Technical details
    ip_address: Optional[str] = None
    user_agent: Optional[str] = None
    
    # Timestamps
    occurred_at: datetime = Field(default_factory=datetime.utcnow)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    
    # Additional data
    metadata: Optional[str] = Field(default=None)  # JSON string

class Preference(SQLModel, table=True):
    """User preferences"""
    
    id: Optional[int] = Field(default=None, primary_key=True)
    organization_id: int = Field(foreign_key="organization.id", index=True)
    subject_id: str = Field(index=True)
    
    # Preference settings
    email_opt_in: bool = Field(default=False)
    sms_opt_in: bool = Field(default=False)
    push_opt_in: bool = Field(default=False)
    phone_opt_in: bool = Field(default=False)
    
    # Marketing preferences
    marketing_email: bool = Field(default=False)
    marketing_sms: bool = Field(default=False)
    marketing_push: bool = Field(default=False)
    
    # Communication frequency
    frequency_email: str = Field(default="weekly")  # daily, weekly, monthly, never
    frequency_sms: str = Field(default="monthly")
    
    # Timestamps
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    
    # Additional preferences
    preferences: Optional[str] = Field(default=None)  # JSON string
