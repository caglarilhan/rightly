"""
Enums for vNext compliance features
"""
from enum import Enum

class BreachSeverity(str, Enum):
    """Data breach severity levels"""
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"

class BreachStatus(str, Enum):
    """Data breach status"""
    DETECTED = "detected"
    INVESTIGATING = "investigating"
    REPORTED = "reported"
    RESOLVED = "resolved"
    CLOSED = "closed"

class ConsentStatus(str, Enum):
    """Consent status"""
    OPT_IN = "opt_in"
    OPT_OUT = "opt_out"
    WITHDRAWN = "withdrawn"

class ConsentChannel(str, Enum):
    """Consent channel types"""
    EMAIL = "email"
    SMS = "sms"
    PUSH = "push"
    WEB = "web"
    PHONE = "phone"

class DpiaStatus(str, Enum):
    """DPIA assessment status"""
    DRAFT = "draft"
    IN_PROGRESS = "in_progress"
    REVIEW = "review"
    APPROVED = "approved"
    REJECTED = "rejected"

class DpiaRiskLevel(str, Enum):
    """DPIA risk levels"""
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    VERY_HIGH = "very_high"

class ExportStatus(str, Enum):
    """Export job status"""
    PENDING = "pending"
    RUNNING = "running"
    COMPLETED = "completed"
    FAILED = "failed"
    EXPIRED = "expired"

class ExportType(str, Enum):
    """Export types"""
    REGULATOR_BUNDLE = "regulator_bundle"
    CONSENT_HISTORY = "consent_history"
    BREACH_REPORT = "breach_report"
    DPIA_ASSESSMENT = "dpia_assessment"
    ROPA_INVENTORY = "ropa_inventory"

class ExportFormat(str, Enum):
    """Export formats"""
    PDF = "pdf"
    JSON = "json"
    CSV = "csv"
    ZIP = "zip"

class Regulation(str, Enum):
    """Supported regulations"""
    GDPR = "gdpr"
    CCPA = "ccpa"
    KVKK = "kvkk"
    LGPD = "lgpd"
    PIPEDA = "pipeda"

class ProcessStatus(str, Enum):
    """Process status"""
    ACTIVE = "active"
    INACTIVE = "inactive"
    ARCHIVED = "archived"

class LawfulBasis(str, Enum):
    """GDPR lawful basis for processing"""
    CONSENT = "consent"
    CONTRACT = "contract"
    LEGAL_OBLIGATION = "legal_obligation"
    VITAL_INTERESTS = "vital_interests"
    PUBLIC_TASK = "public_task"
    LEGITIMATE_INTERESTS = "legitimate_interests"
