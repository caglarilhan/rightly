"""
Meta API endpoints (health, version, etc.)
"""
from fastapi import APIRouter
from datetime import datetime
import logging

from app.core.config import settings
from app.core.database import check_db_health

logger = logging.getLogger(__name__)
router = APIRouter()

@router.get("/healthz")
async def health_check():
    """Health check endpoint"""
    try:
        # Database health check
        db_healthy = check_db_health()
        
        # Overall status
        status = "healthy" if db_healthy else "degraded"
        
        return {
            "status": status,
            "timestamp": datetime.utcnow().isoformat(),
            "service": "gdpr-hub-lite",
            "database": "healthy" if db_healthy else "unhealthy",
            "version": settings.VERSION,
            "environment": settings.ENVIRONMENT
        }
        
    except Exception as e:
        logger.error(f"Health check failed: {e}")
        return {
            "status": "unhealthy",
            "timestamp": datetime.utcnow().isoformat(),
            "service": "gdpr-hub-lite",
            "error": str(e),
            "version": settings.VERSION
        }

@router.get("/version")
async def get_version():
    """Get application version"""
    return {
        "version": settings.VERSION,
        "app_name": settings.APP_NAME,
        "environment": settings.ENVIRONMENT,
        "build_time": datetime.utcnow().isoformat()
    }
