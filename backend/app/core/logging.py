import logging
import sys
from datetime import datetime
from app.core.config import settings

def setup_logging():
    """Logging konfigürasyonu"""
    
    # Log formatı
    log_format = "%(asctime)s - %(name)s - %(levelname)s - %(message)s"
    
    # Log seviyesi
    log_level = logging.DEBUG if settings.DEBUG else logging.INFO
    
    # Root logger konfigürasyonu
    logging.basicConfig(
        level=log_level,
        format=log_format,
        handlers=[
            logging.StreamHandler(sys.stdout),
            logging.FileHandler(f"logs/gdpr_hub_lite_{datetime.now().strftime('%Y%m%d')}.log")
        ]
    )
    
    # Third-party logger'ları sustur
    logging.getLogger("uvicorn.access").setLevel(logging.WARNING)
    logging.getLogger("sqlalchemy.engine").setLevel(logging.WARNING)
    
    # GDPR Hub Lite logger'ı
    logger = logging.getLogger("gdpr_hub_lite")
    logger.setLevel(log_level)
    
    return logger

# Audit logging için özel logger
def get_audit_logger():
    """Audit log için özel logger"""
    audit_logger = logging.getLogger("audit")
    audit_logger.setLevel(logging.INFO)
    
    # Audit log dosyası
    audit_handler = logging.FileHandler(f"logs/audit_{datetime.now().strftime('%Y%m%d')}.log")
    audit_handler.setFormatter(logging.Formatter("%(asctime)s - %(message)s"))
    audit_logger.addHandler(audit_handler)
    
    return audit_logger

# GDPR event logging
def log_gdpr_event(event_type: str, subject_email: str, request_id: str, details: dict = None):
    """GDPR olaylarını logla"""
    audit_logger = get_audit_logger()
    
    log_entry = {
        "event_type": event_type,
        "subject_email": subject_email,
        "request_id": request_id,
        "timestamp": datetime.utcnow().isoformat(),
        "details": details or {}
    }
    
    audit_logger.info(f"GDPR_EVENT: {log_entry}")
    
    return log_entry

