"""
Structured logging configuration
"""
import logging
import sys
from typing import Dict, Any
import json
from datetime import datetime

class StructuredFormatter(logging.Formatter):
    """Custom formatter for structured JSON logs"""
    
    def format(self, record: logging.LogRecord) -> str:
        log_data = {
            "timestamp": datetime.utcnow().isoformat(),
            "level": record.levelname,
            "logger": record.name,
            "message": record.getMessage(),
        }
        
        # Add extra fields if present
        if hasattr(record, 'request_id'):
            log_data['request_id'] = record.request_id
        if hasattr(record, 'user_id'):
            log_data['user_id'] = record.user_id
        if hasattr(record, 'organization_id'):
            log_data['organization_id'] = record.organization_id
        
        # Add exception info if present
        if record.exc_info:
            log_data['exception'] = self.formatException(record.exc_info)
        
        return json.dumps(log_data)

def setup_logging(level: str = "INFO") -> None:
    """Setup structured logging"""
    
    # Create logger
    logger = logging.getLogger()
    logger.setLevel(getattr(logging, level.upper()))
    
    # Remove existing handlers
    for handler in logger.handlers[:]:
        logger.removeHandler(handler)
    
    # Create console handler
    console_handler = logging.StreamHandler(sys.stdout)
    console_handler.setLevel(getattr(logging, level.upper()))
    
    # Set formatter
    formatter = StructuredFormatter()
    console_handler.setFormatter(formatter)
    
    # Add handler to logger
    logger.addHandler(console_handler)
    
    # Set specific logger levels
    logging.getLogger("uvicorn").setLevel(logging.INFO)
    logging.getLogger("uvicorn.access").setLevel(logging.INFO)
    logging.getLogger("sqlalchemy.engine").setLevel(logging.WARNING)
    logging.getLogger("celery").setLevel(logging.INFO)

def get_logger(name: str) -> logging.Logger:
    """Get a logger instance"""
    return logging.getLogger(name)

class RequestLogger:
    """Logger with request context"""
    
    def __init__(self, name: str):
        self.logger = logging.getLogger(name)
    
    def log_request(
        self,
        method: str,
        path: str,
        status_code: int,
        duration_ms: float,
        request_id: str,
        user_id: Optional[int] = None,
        organization_id: Optional[int] = None
    ) -> None:
        """Log HTTP request"""
        
        extra = {
            'request_id': request_id,
            'user_id': user_id,
            'organization_id': organization_id
        }
        
        self.logger.info(
            f"{method} {path} {status_code} {duration_ms:.2f}ms",
            extra=extra
        )
    
    def log_error(
        self,
        error: Exception,
        request_id: str,
        user_id: Optional[int] = None,
        organization_id: Optional[int] = None
    ) -> None:
        """Log error with context"""
        
        extra = {
            'request_id': request_id,
            'user_id': user_id,
            'organization_id': organization_id
        }
        
        self.logger.error(
            f"Error: {str(error)}",
            exc_info=True,
            extra=extra
        )
