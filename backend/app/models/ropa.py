"""
ROPA (Record of Processing Activities) models
"""
from sqlmodel import SQLModel, Field
from typing import Optional, List
from datetime import datetime
from app.models.enums import Regulation

class RopaRecord(SQLModel, table=True):
    """ROPA record"""
    
    id: Optional[int] = Field(default=None, primary_key=True)
    organization_id: int = Field(foreign_key="organization.id", index=True)
    process_id: int = Field(foreign_key="process.id", index=True)
    
    # Controller information
    controller_name: str
    controller_address: Optional[str] = None
    controller_contact: Optional[str] = None
    
    # Processor information
    processor_name: Optional[str] = None
    processor_address: Optional[str] = None
    processor_contact: Optional[str] = None
    processor_agreement: Optional[str] = None  # DPA reference
    
    # DPO information
    dpo_name: Optional[str] = None
    dpo_contact: Optional[str] = None
    dpo_email: Optional[str] = None
    
    # Processing details
    processing_purposes: Optional[str] = Field(default=None)  # JSON array
    data_categories: Optional[str] = Field(default=None)  # JSON array
    data_subjects: Optional[str] = Field(default=None)  # JSON array
    
    # Recipients
    recipients: Optional[str] = Field(default=None)  # JSON array
    third_country_transfers: Optional[str] = Field(default=None)  # JSON array
    
    # Retention and security
    retention_period: Optional[str] = None
    security_measures: Optional[str] = Field(default=None)  # JSON array
    
    # Regulatory compliance
    regulation: Regulation = Field(default=Regulation.GDPR)
    article_30_compliant: bool = Field(default=False)
    
    # Status
    status: str = Field(default="draft")  # draft, reviewed, approved, archived
    
    # Timestamps
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    last_reviewed: Optional[datetime] = None
    
    # Additional data
    notes: Optional[str] = None
    metadata: Optional[str] = Field(default=None)  # JSON string
