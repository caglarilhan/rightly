from sqlalchemy import Column, Integer, String, DateTime, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base
import enum

class AccountStatus(str, enum.Enum):
    ACTIVE = "active"
    INACTIVE = "inactive"
    SUSPENDED = "suspended"
    TRIAL = "trial"

class AccountPlan(str, enum.Enum):
    FREE = "free"
    STARTER = "starter"
    PRO = "pro"
    AGENCY = "agency"

class Account(Base):
    __tablename__ = "accounts"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    company_name = Column(String, nullable=False)
    plan = Column(Enum(AccountPlan), default=AccountPlan.FREE)
    status = Column(Enum(AccountStatus), default=AccountStatus.ACTIVE)
    
    # Integration fields
    shopify_domain = Column(String, nullable=True)
    shopify_access_token = Column(String, nullable=True)
    woo_site_url = Column(String, nullable=True)
    woo_api_key = Column(String, nullable=True)
    
    # Settings (JSON)
    settings = Column(String, nullable=True)  # JSON string
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    requests = relationship("Request", back_populates="account")
    sources = relationship("Source", back_populates="account")
    audit_logs = relationship("AuditLog", back_populates="account")
    
    def __repr__(self):
        return f"<Account(id={self.id}, company='{self.company_name}', plan='{self.plan}')>"
