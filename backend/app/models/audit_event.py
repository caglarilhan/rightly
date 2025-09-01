from sqlalchemy import Column, Integer, String, DateTime, Text, ForeignKey, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base
import enum

class AuditEventType(str, enum.Enum):
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

class AuditEvent(Base):
    __tablename__ = "audit_events"
    
    id = Column(Integer, primary_key=True, index=True)
    request_id = Column(Integer, ForeignKey("requests.id"), nullable=True)
    account_id = Column(Integer, ForeignKey("accounts.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    
    event_type = Column(Enum(AuditEventType), nullable=False)
    actor = Column(String, nullable=False)  # user email or system
    action = Column(String, nullable=False)
    details = Column(Text, nullable=True)
    meta_data = Column(Text, nullable=True)  # JSON string
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    request = relationship("Request", back_populates="audit_events")
    account = relationship("Account")
    user = relationship("User", back_populates="audit_events")
    
    def __repr__(self):
        return f"<AuditEvent(id={self.id}, type='{self.event_type}', actor='{self.actor}')>"
