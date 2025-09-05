"""
Audit logging utilities
"""
from datetime import datetime
from typing import Optional, Dict, Any
from enum import Enum
import logging
import json

logger = logging.getLogger(__name__)

class AuditEventType(str, Enum):
    """Types of audit events"""
    USER_LOGIN = "user.login"
    USER_LOGOUT = "user.logout"
    USER_CREATE = "user.create"
    USER_UPDATE = "user.update"
    USER_DELETE = "user.delete"
    
    CONSENT_CREATE = "consent.create"
    CONSENT_UPDATE = "consent.update"
    CONSENT_WITHDRAW = "consent.withdraw"
    
    BREACH_CREATE = "breach.create"
    BREACH_UPDATE = "breach.update"
    BREACH_REPORT = "breach.report"
    
    DPIA_CREATE = "dpia.create"
    DPIA_ASSESS = "dpia.assess"
    DPIA_APPROVE = "dpia.approve"
    
    ROPA_CREATE = "ropa.create"
    ROPA_UPDATE = "ropa.update"
    ROPA_EXPORT = "ropa.export"
    
    EXPORT_CREATE = "export.create"
    EXPORT_DOWNLOAD = "export.download"
    
    ADMIN_IMPERSONATE = "admin.impersonate"
    ADMIN_ACTION = "admin.action"

class AuditSeverity(str, Enum):
    """Audit event severity levels"""
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"

class AuditLogger:
    """Audit logging service"""
    
    def __init__(self):
        self.logger = logging.getLogger("audit")
    
    async def log_event(
        self,
        event_type: AuditEventType,
        actor_user_id: Optional[int],
        organization_id: int,
        resource_type: str,
        resource_id: Optional[str] = None,
        details: Optional[Dict[str, Any]] = None,
        severity: AuditSeverity = AuditSeverity.MEDIUM,
        ip_address: Optional[str] = None,
        user_agent: Optional[str] = None
    ) -> None:
        """Log an audit event"""
        
        audit_data = {
            "timestamp": datetime.utcnow().isoformat(),
            "event_type": event_type.value,
            "actor_user_id": actor_user_id,
            "organization_id": organization_id,
            "resource_type": resource_type,
            "resource_id": resource_id,
            "details": details or {},
            "severity": severity.value,
            "ip_address": ip_address,
            "user_agent": user_agent
        }
        
        # Log to structured logger
        self.logger.info(
            f"Audit Event: {event_type.value}",
            extra=audit_data
        )
        
        # TODO: Store in database audit_events table
        # This would be implemented with proper database integration
    
    async def log_consent_event(
        self,
        actor_user_id: Optional[int],
        organization_id: int,
        subject_id: str,
        action: str,
        channel: str,
        details: Optional[Dict[str, Any]] = None,
        ip_address: Optional[str] = None,
        user_agent: Optional[str] = None
    ) -> None:
        """Log consent-related audit event"""
        
        event_type_map = {
            "opt_in": AuditEventType.CONSENT_CREATE,
            "opt_out": AuditEventType.CONSENT_WITHDRAW,
            "update": AuditEventType.CONSENT_UPDATE
        }
        
        event_type = event_type_map.get(action, AuditEventType.CONSENT_UPDATE)
        
        await self.log_event(
            event_type=event_type,
            actor_user_id=actor_user_id,
            organization_id=organization_id,
            resource_type="consent",
            resource_id=subject_id,
            details={
                "channel": channel,
                "action": action,
                **(details or {})
            },
            severity=AuditSeverity.MEDIUM,
            ip_address=ip_address,
            user_agent=user_agent
        )
    
    async def log_breach_event(
        self,
        actor_user_id: int,
        organization_id: int,
        breach_id: int,
        action: str,
        details: Optional[Dict[str, Any]] = None,
        ip_address: Optional[str] = None,
        user_agent: Optional[str] = None
    ) -> None:
        """Log breach-related audit event"""
        
        event_type_map = {
            "create": AuditEventType.BREACH_CREATE,
            "update": AuditEventType.BREACH_UPDATE,
            "report": AuditEventType.BREACH_REPORT
        }
        
        event_type = event_type_map.get(action, AuditEventType.BREACH_UPDATE)
        
        await self.log_event(
            event_type=event_type,
            actor_user_id=actor_user_id,
            organization_id=organization_id,
            resource_type="breach",
            resource_id=str(breach_id),
            details={
                "action": action,
                **(details or {})
            },
            severity=AuditSeverity.HIGH,
            ip_address=ip_address,
            user_agent=user_agent
        )

# Global audit logger instance
audit_logger = AuditLogger()
