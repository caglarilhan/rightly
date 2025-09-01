from sqlalchemy import Column, Integer, String, DateTime, Text, ForeignKey, Enum
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.core.database import Base
import enum

class ExportFormat(enum.Enum):
    """Export format türleri"""
    ZIP = "zip"
    PDF = "pdf"
    JSON = "json"
    CSV = "csv"

class ExportBundle(Base):
    """Export paket modeli"""
    __tablename__ = "export_bundles"
    
    id = Column(Integer, primary_key=True, index=True)
    request_id = Column(Integer, ForeignKey("requests.id"), nullable=False)
    
    # Paket bilgileri
    format = Column(Enum(ExportFormat), nullable=False)
    file_path = Column(String(500), nullable=False)  # R2/S3 path
    file_size = Column(Integer, nullable=True)  # bytes
    checksum = Column(String(64), nullable=True)  # SHA256
    
    # Metadata
    meta_data = Column(Text, nullable=True)  # JSON string
    expires_at = Column(DateTime(timezone=True), nullable=False)  # 30 gün sonrası
    
    # Zaman
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # İlişkiler
    request = relationship("Request", back_populates="export_bundles")
    
    def __repr__(self):
        return f"<ExportBundle(id={self.id}, format='{self.format.value}', request_id={self.request_id})>"
