from sqlalchemy import Column, Integer, String, DateTime, Text, ForeignKey, Enum, Boolean
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.core.database import Base
import enum

class SourceType(enum.Enum):
    """Veri kaynağı türleri"""
    SHOPIFY = "shopify"
    WOOCOMMERCE = "woocommerce"
    GOOGLE_WORKSPACE = "google_workspace"
    STRIPE = "stripe"
    HUBSPOT = "hubspot"
    CUSTOM = "custom"

class SourceStatus(enum.Enum):
    """Kaynak durumları"""
    ACTIVE = "active"
    INACTIVE = "inactive"
    ERROR = "error"
    SYNCING = "syncing"

class Source(Base):
    """Veri kaynağı modeli"""
    __tablename__ = "sources"
    
    id = Column(Integer, primary_key=True, index=True)
    account_id = Column(Integer, ForeignKey("accounts.id"), nullable=False)
    
    # Kaynak bilgileri
    name = Column(String(255), nullable=False)
    source_type = Column(Enum(SourceType), nullable=False)
    status = Column(Enum(SourceStatus), default=SourceStatus.ACTIVE)
    
    # Bağlantı bilgileri
    connection_data = Column(Text, nullable=False)  # JSON string (API keys, URLs, etc.)
    last_sync_at = Column(DateTime(timezone=True), nullable=True)
    sync_interval = Column(Integer, default=3600)  # seconds
    
    # Ayarlar
    settings = Column(Text, nullable=True)  # JSON string
    is_enabled = Column(Boolean, default=True)
    
    # Zaman
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # İlişkiler
    account = relationship("Account", back_populates="sources")
    
    def __repr__(self):
        return f"<Source(id={self.id}, name='{self.name}', type='{self.source_type.value}')>"

