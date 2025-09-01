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
