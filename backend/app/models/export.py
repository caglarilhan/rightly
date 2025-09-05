"""
Export job models
"""
from sqlmodel import SQLModel, Field
from typing import Optional, List
from datetime import datetime
from app.models.enums import ExportStatus, ExportType, ExportFormat

class ExportJob(SQLModel, table=True):
    """Export job record"""
    
    id: Optional[int] = Field(default=None, primary_key=True)
    organization_id: int = Field(foreign_key="organization.id", index=True)
    
    # Job details
    job_type: ExportType
    export_format: ExportFormat
    status: ExportStatus = Field(default=ExportStatus.PENDING)
    
    # Scope and filters
    scope: Optional[str] = Field(default=None)  # JSON object with filters
    timeframe_from: Optional[datetime] = None
    timeframe_to: Optional[datetime] = None
    
    # Request details
    requested_by: int = Field(foreign_key="user.id")
    request_reason: Optional[str] = None
    
    # Execution details
    started_at: Optional[datetime] = None
    finished_at: Optional[datetime] = None
    duration_seconds: Optional[int] = None
    
    # Output details
    file_path: Optional[str] = None
    file_size_bytes: Optional[int] = None
    download_url: Optional[str] = None
    download_expires_at: Optional[datetime] = None
    
    # Error handling
    error_message: Optional[str] = None
    retry_count: int = Field(default=0)
    max_retries: int = Field(default=3)
    
    # Timestamps
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    
    # Additional data
    metadata: Optional[str] = Field(default=None)  # JSON string

class RegulatorExport(SQLModel, table=True):
    """Regulator export bundle"""
    
    id: Optional[int] = Field(default=None, primary_key=True)
    organization_id: int = Field(foreign_key="organization.id", index=True)
    
    # Export details
    export_type: str  # breach_report, consent_audit, dpia_summary, etc.
    regulation: str  # gdpr, ccpa, kvkk, etc.
    
    # Scope
    breach_id: Optional[int] = Field(foreign_key="breach.id")
    timeframe_from: datetime
    timeframe_to: datetime
    
    # File details
    file_path: str
    file_size_bytes: int
    file_checksum: str
    download_url: str
    download_expires_at: datetime
    
    # Status
    status: str = Field(default="ready")  # ready, downloaded, expired
    
    # Timestamps
    created_at: datetime = Field(default_factory=datetime.utcnow)
    downloaded_at: Optional[datetime] = None
    
    # Additional data
    metadata: Optional[str] = Field(default=None)  # JSON string
