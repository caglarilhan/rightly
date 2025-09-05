"""
Breach schemas
"""
from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
from app.models import BreachSeverity, BreachStatus

class BreachCreate(BaseModel):
    """Create breach request"""
    title: str = Field(..., description="Breach title")
    description: str = Field(..., description="Breach description")
    severity: BreachSeverity = Field(..., description="Breach severity")
    started_at: datetime = Field(..., description="When breach started")
    detected_at: datetime = Field(..., description="When breach was detected")
    affected_count: int = Field(0, description="Number of affected individuals")
    data_types: Optional[List[str]] = Field(None, description="Types of data affected")
    response_plan: Optional[str] = Field(None, description="Response plan")
    mitigation_actions: Optional[List[str]] = Field(None, description="Mitigation actions")
    metadata: Optional[dict] = Field(None, description="Additional metadata")

class BreachUpdate(BaseModel):
    """Update breach request"""
    title: Optional[str] = None
    description: Optional[str] = None
    severity: Optional[BreachSeverity] = None
    status: Optional[BreachStatus] = None
    reported_at: Optional[datetime] = None
    affected_count: Optional[int] = None
    data_types: Optional[List[str]] = None
    response_plan: Optional[str] = None
    mitigation_actions: Optional[List[str]] = None
    notification_sent: Optional[bool] = None
    metadata: Optional[dict] = None

class BreachResponse(BaseModel):
    """Breach response"""
    id: int
    organization_id: int
    title: str
    description: str
    severity: BreachSeverity
    started_at: datetime
    detected_at: datetime
    reported_at: Optional[datetime]
    status: BreachStatus
    affected_count: int
    data_types: Optional[List[str]]
    countdown_deadline: datetime
    response_plan: Optional[str]
    mitigation_actions: Optional[List[str]]
    notification_sent: bool
    created_at: datetime
    updated_at: datetime
    metadata: Optional[dict]

    class Config:
        from_attributes = True

class BreachSystemCreate(BaseModel):
    """Create breach system request"""
    system_name: str = Field(..., description="System name")
    system_type: str = Field(..., description="System type")
    owner: Optional[str] = Field(None, description="System owner")
    contact_email: Optional[str] = Field(None, description="Contact email")
    data_categories: Optional[List[str]] = Field(None, description="Data categories")
    estimated_records: Optional[int] = Field(None, description="Estimated records")
    encryption_status: Optional[str] = Field(None, description="Encryption status")
    containment_status: Optional[str] = Field("not_contained", description="Containment status")
    remediation_actions: Optional[List[str]] = Field(None, description="Remediation actions")
    notes: Optional[str] = Field(None, description="Additional notes")

class BreachSystemResponse(BaseModel):
    """Breach system response"""
    id: int
    breach_id: int
    system_name: str
    system_type: str
    owner: Optional[str]
    contact_email: Optional[str]
    data_categories: Optional[List[str]]
    estimated_records: Optional[int]
    encryption_status: Optional[str]
    containment_status: str
    remediation_actions: Optional[List[str]]
    created_at: datetime
    updated_at: datetime
    notes: Optional[str]

    class Config:
        from_attributes = True

class BreachListResponse(BaseModel):
    """Breach list response"""
    breaches: List[BreachResponse]
    total: int
    limit: int
    offset: int
