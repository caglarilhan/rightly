# Database Models
from sqlmodel import SQLModel, Field, create_engine, Session, select
from typing import Optional, List
from datetime import datetime
import uuid
import json

# User Model
class User(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    email: str = Field(unique=True, index=True)
    full_name: str
    company_name: str
    is_active: bool = Field(default=True)
    is_verified: bool = Field(default=False)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

# Account Model (for billing)
class Account(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="user.id")
    stripe_customer_id: Optional[str] = None
    subscription_status: str = Field(default="free")  # free, trial, active, cancelled
    trial_ends_at: Optional[datetime] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

# DSAR Request Model
class DSARRequest(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    request_id: str = Field(default_factory=lambda: str(uuid.uuid4()), unique=True, index=True)
    user_id: int = Field(foreign_key="user.id")
    request_type: str  # access, deletion, rectification
    subject_email: str
    subject_name: str
    status: str = Field(default="pending")  # pending, processing, completed, rejected
    description: Optional[str] = None
    additional_info: Optional[str] = None  # JSON string
    due_date: datetime
    completed_at: Optional[datetime] = None
    source: str = Field(default="manual")  # manual, shopify, woocommerce
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

# Audit Log Model
class AuditLog(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: Optional[int] = Field(foreign_key="user.id")
    action: str
    resource_type: str
    resource_id: Optional[str] = None
    details: Optional[str] = None  # JSON string
    ip_address: Optional[str] = None
    user_agent: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)

# Data Source Model
class DataSource(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="user.id")
    name: str
    type: str  # shopify, woocommerce, custom
    config: str  # JSON string
    is_active: bool = Field(default=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

# Email Notification Model
class EmailNotification(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="user.id")
    type: str  # dsar_received, dsar_completed, consent_updated, export_ready, breach_notification
    recipient_email: str
    subject: str
    content: str
    status: str = Field(default="pending")  # pending, sent, failed, suppressed
    sent_at: Optional[datetime] = None
    retry_count: int = Field(default=0)
    idempotency_key: Optional[str] = None  # Prevent duplicate sends
    last_error: Optional[str] = None
    template_version: str = Field(default="v1")  # Template versioning
    language: str = Field(default="en")  # i18n support
    created_at: datetime = Field(default_factory=datetime.utcnow)

# Email Suppression List
class EmailSuppression(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    email: str = Field(unique=True)
    reason: str  # bounce, complaint, manual, hard_bounce
    created_at: datetime = Field(default_factory=datetime.utcnow)
    expires_at: Optional[datetime] = None  # For temporary suppressions

# GDPR Consent Model
class Consent(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="user.id")
    consent_type: str  # marketing, analytics, necessary, third_party
    status: str  # granted, denied, withdrawn
    ip_address: Optional[str] = None
    user_agent: Optional[str] = None
    granted_at: Optional[datetime] = None
    withdrawn_at: Optional[datetime] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

# Data Processing Activity Model
class ProcessingActivity(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="user.id")
    activity_name: str
    purpose: str
    legal_basis: str  # consent, legitimate_interest, contract, legal_obligation
    data_categories: str  # JSON string of data categories
    retention_period: str
    third_parties: str  # JSON string of third parties
    is_active: bool = Field(default=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

# Data Breach Report Model (GDPR Art.33/34 compliant)
class DataBreachReport(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="user.id")
    breach_type: str  # unauthorized_access, data_loss, system_breach, misdelivery
    description: str
    affected_data: str  # JSON string of affected data
    affected_individuals: int
    discovery_date: datetime
    start_date: Optional[datetime] = None  # When breach started
    risk_level: Optional[str] = None  # low, medium, high
    reportable: Optional[bool] = None  # Whether to report to authority
    authority_notified_at: Optional[datetime] = None
    subjects_notified_at: Optional[datetime] = None
    status: str = Field(default="new")  # new, triage, authority_notified, subjects_notified, remediation, closed
    root_cause: Optional[str] = None
    remediation_measures: Optional[str] = None
    notes: Optional[str] = None  # JSON string for additional notes
    sla_deadline: Optional[datetime] = None  # 72h deadline for reporting
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

# Breach Event Log (for audit trail)
class BreachEvent(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    breach_id: int = Field(foreign_key="databreachreport.id")
    actor: str  # user, system, authority
    action: str  # created, triaged, authority_notified, subjects_notified, closed
    payload: Optional[str] = None  # JSON string with event details
    timestamp: datetime = Field(default_factory=datetime.utcnow)

# Single-use download token for export bundles
class DownloadToken(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    request_id: int  # FK to export/DSAR request
    token: str = Field(index=True, unique=True)
    object_key: str
    expires_at: datetime
    used_at: Optional[datetime] = None
    revoked: bool = Field(default=False)
    created_at: datetime = Field(default_factory=datetime.utcnow)
