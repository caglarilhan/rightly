from sqlalchemy import Column, Integer, String, DateTime, Text, ForeignKey, Enum
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.core.database import Base
import enum

class RequestType(enum.Enum):
    """DSAR talep türleri"""
    ACCESS = "access"  # Veri erişimi
    PORTABILITY = "portability"  # Veri taşınabilirliği
    ERASURE = "erasure"  # Veri silme
    RECTIFICATION = "rectification"  # Veri düzeltme
    RESTRICTION = "restriction"  # İşlemeyi kısıtlama
    OBJECTION = "objection"  # İtiraz

class RequestStatus(enum.Enum):
    """Talep durumları"""
    NEW = "new"  # Yeni talep
    VERIFYING = "verifying"  # Kimlik doğrulama
    DISCOVERING = "discovering"  # Veri keşfi
    REVIEWING = "reviewing"  # İnceleme
    PACKAGING = "packaging"  # Paketleme
    DELIVERING = "delivering"  # Teslim
    ERASING = "erasing"  # Silme işlemi
    COMPLETED = "completed"  # Tamamlandı
    REJECTED = "rejected"  # Reddedildi
    EXPIRED = "expired"  # Süresi doldu

class Request(Base):
    """DSAR talep modeli"""
    __tablename__ = "requests"
    
    id = Column(Integer, primary_key=True, index=True)
    account_id = Column(Integer, ForeignKey("accounts.id"), nullable=False)
    
    # Talep bilgileri
    request_type = Column(Enum(RequestType), nullable=False)
    status = Column(Enum(RequestStatus), default=RequestStatus.NEW)
    
    # Subject (talep eden kişi) bilgileri
    subject_email = Column(String(255), nullable=False, index=True)
    subject_name = Column(String(255), nullable=True)
    subject_phone = Column(String(50), nullable=True)
    subject_address = Column(Text, nullable=True)
    
    # Talep detayları
    description = Column(Text, nullable=True)
    additional_info = Column(Text, nullable=True)  # JSON string
    
    # Zaman bilgileri
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    due_date = Column(DateTime(timezone=True), nullable=False)  # 30 gün sonrası
    
    # İlişkiler
    account = relationship("Account", back_populates="requests")
    audit_logs = relationship("AuditLog", back_populates="request")
    export_bundles = relationship("ExportBundle", back_populates="request")
    
    def __repr__(self):
        return f"<Request(id={self.id}, type='{self.request_type.value}', status='{self.status.value}')>"
