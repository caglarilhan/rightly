from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import HTTPBearer
import logging

router = APIRouter(prefix="/admin", tags=["admin"])
security = HTTPBearer()

logger = logging.getLogger(__name__)

@router.get("/check")
async def admin_check():
    """Admin panel health check"""
    return {
        "status": "ok",
        "message": "Admin panel accessible",
        "timestamp": datetime.utcnow().isoformat()
    }

@router.post("/impersonate")
async def admin_impersonate():
    """Admin impersonation endpoint"""
    return {
        "status": "ok",
        "message": "Impersonation started",
        "ttl": 3600,
        "timestamp": datetime.utcnow().isoformat()
    }
