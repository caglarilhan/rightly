from sqlalchemy import Column, Integer, String, DateTime, Text, ForeignKey, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base
import enum

class AuditLogType(str, enum.Enum):
    REQUEST_CREATED = "request_created"
    REQUEST_UPDATED = "request_updated"
    REQUEST_COMPLETED = "request_completed"
    USER_LOGIN = "user_login"
    USER_LOGOUT = "user_logout"
    ACCOUNT_CREATED = "account_created"
    ACCOUNT_UPDATED = "account_updated"
    SOURCE_CONNECTED = "source_connected"
    SOURCE_DISCONNECTED = "source_disconnected"
    EXPORT_GENERATED = "export_generated"
    DATA_ACCESSED = "data_accessed"
    DATA_DELETED = "data_deleted"

class AuditLog(Base):
    __tablename__ = "audit_logs"
    
    id = Column(Integer, primary_key=True, index=True)
    request_id = Column(Integer, ForeignKey("requests.id"), nullable=True)
    account_id = Column(Integer, ForeignKey("accounts.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    
    event_type = Column(Enum(AuditLogType), nullable=False)
    actor = Column(String(255), nullable=False)  # user email or system
    action = Column(String(255), nullable=False)
    details = Column(Text, nullable=True)
    meta_data = Column(Text, nullable=True)  # JSON string
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    
    # Relationships
    request = relationship("Request", back_populates="audit_logs")
    account = relationship("Account", back_populates="audit_logs")
    user = relationship("User", back_populates="audit_logs")
    
    def __repr__(self):
        return f"<AuditLog(id={self.id}, type='{self.event_type}', actor='{self.actor}')>"


