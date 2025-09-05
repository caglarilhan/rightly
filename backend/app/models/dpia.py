"""
DPIA (Data Protection Impact Assessment) models
"""
from sqlmodel import SQLModel, Field
from typing import Optional, List
from datetime import datetime
from app.models.enums import DpiaStatus, DpiaRiskLevel, LawfulBasis, Regulation

class Process(SQLModel, table=True):
    """Data processing activity"""
    
    id: Optional[int] = Field(default=None, primary_key=True)
    organization_id: int = Field(foreign_key="organization.id", index=True)
    
    # Basic info
    name: str
    description: str
    purpose: str
    
    # Legal basis
    lawful_basis: LawfulBasis
    regulation: Regulation = Field(default=Regulation.GDPR)
    
    # Data details
    data_categories: Optional[str] = Field(default=None)  # JSON array
    data_subjects: Optional[str] = Field(default=None)  # JSON array (customers, employees, etc.)
    
    # Processing details
    processing_activities: Optional[str] = Field(default=None)  # JSON array
    recipients: Optional[str] = Field(default=None)  # JSON array
    third_country_transfers: Optional[str] = Field(default=None)  # JSON array
    
    # Storage and retention
    storage_location: Optional[str] = None
    retention_period_days: Optional[int] = None
    deletion_method: Optional[str] = None
    
    # Security measures
    security_measures: Optional[str] = Field(default=None)  # JSON array
    access_controls: Optional[str] = Field(default=None)  # JSON array
    
    # Status
    status: str = Field(default="active")  # active, inactive, archived
    
    # Timestamps
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    
    # Additional data
    metadata: Optional[str] = Field(default=None)  # JSON string

class DpiaAssessment(SQLModel, table=True):
    """DPIA assessment record"""
    
    id: Optional[int] = Field(default=None, primary_key=True)
    organization_id: int = Field(foreign_key="organization.id", index=True)
    process_id: int = Field(foreign_key="process.id", index=True)
    
    # Assessment details
    assessment_date: datetime = Field(default_factory=datetime.utcnow)
    assessor_user_id: Optional[int] = Field(foreign_key="user.id")
    reviewer_user_id: Optional[int] = Field(foreign_key="user.id")
    
    # Risk assessment
    risk_score: float = Field(default=0.0)  # 0.0 to 1.0
    risk_level: DpiaRiskLevel = Field(default=DpiaRiskLevel.LOW)
    
    # Identified risks
    risks: Optional[str] = Field(default=None)  # JSON array
    risk_descriptions: Optional[str] = Field(default=None)  # JSON object
    
    # Mitigation measures
    mitigations: Optional[str] = Field(default=None)  # JSON array
    residual_risk: Optional[str] = None
    
    # Status
    status: DpiaStatus = Field(default=DpiaStatus.DRAFT)
    review_notes: Optional[str] = None
    
    # Timestamps
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    reviewed_at: Optional[datetime] = None
    
    # Additional data
    metadata: Optional[str] = Field(default=None)  # JSON string
