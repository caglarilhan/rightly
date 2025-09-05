"""
Data breach models
"""
from sqlmodel import SQLModel, Field
from typing import Optional, List
from datetime import datetime
from app.models.enums import BreachSeverity, BreachStatus, Regulation

class Breach(SQLModel, table=True):
    """Data breach record"""
    
    id: Optional[int] = Field(default=None, primary_key=True)
    organization_id: int = Field(foreign_key="organization.id", index=True)
    
    # Basic info
    title: str
    description: str
    severity: BreachSeverity
    
    # Timeline
    started_at: datetime
    detected_at: datetime
    reported_at: Optional[datetime] = None
    
    # Status and progress
    status: BreachStatus = Field(default=BreachStatus.DETECTED)
    
    # Impact assessment
    affected_count: int = Field(default=0)
    data_types: Optional[str] = Field(default=None)  # JSON array
    
    # Regulatory requirements
    regulation: Regulation = Field(default=Regulation.GDPR)
    countdown_deadline: datetime  # 72 hours from detection
    
    # Response details
    response_plan: Optional[str] = None
    mitigation_actions: Optional[str] = None  # JSON array
    notification_sent: bool = Field(default=False)
    
    # Timestamps
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    
    # Additional data
    metadata: Optional[str] = Field(default=None)  # JSON string

class BreachSystem(SQLModel, table=True):
    """Systems affected by breach"""
    
    id: Optional[int] = Field(default=None, primary_key=True)
    breach_id: int = Field(foreign_key="breach.id", index=True)
    
    # System details
    system_name: str
    system_type: str  # database, api, file_storage, etc.
    owner: Optional[str] = None
    contact_email: Optional[str] = None
    
    # Impact details
    data_categories: Optional[str] = None  # JSON array
    estimated_records: Optional[int] = None
    encryption_status: Optional[str] = None
    
    # Response
    containment_status: str = Field(default="not_contained")  # not_contained, contained, verified
    remediation_actions: Optional[str] = None  # JSON array
    
    # Timestamps
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    
    # Additional data
    notes: Optional[str] = None
