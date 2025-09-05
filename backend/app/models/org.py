"""
Organization model
"""
from sqlmodel import SQLModel, Field
from typing import Optional, List
from datetime import datetime
from app.models.enums import Regulation

class Organization(SQLModel, table=True):
    """Organization model"""
    
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str = Field(index=True)
    slug: str = Field(unique=True, index=True)
    region_default: Regulation = Field(default=Regulation.GDPR)
    
    # Contact information
    contact_email: Optional[str] = None
    contact_phone: Optional[str] = None
    address: Optional[str] = None
    
    # Compliance settings
    dpo_name: Optional[str] = None
    dpo_email: Optional[str] = None
    dpo_phone: Optional[str] = None
    
    # Subscription info
    plan_type: str = Field(default="free")
    subscription_status: str = Field(default="active")
    
    # Timestamps
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    
    # Settings
    settings: Optional[str] = Field(default=None)  # JSON string
    is_active: bool = Field(default=True)
