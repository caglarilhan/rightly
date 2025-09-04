# app/observability/audit.py
from functools import wraps
from fastapi import Request
from datetime import datetime
from typing import Optional
import json

async def write_audit(
    org_id: str,
    actor_user_id: str,
    acting_as_user_id: Optional[str],
    action: str,
    resource: Optional[str],
    severity: str = "INFO",
    details: Optional[dict] = None,
    ip: Optional[str] = None,
    ua: Optional[str] = None,
    request_id: Optional[str] = None
):
    """Write audit event to database"""
    # Mock audit writing - replace with actual DB insert
    audit_event = {
        "org_id": org_id,
        "actor_user_id": actor_user_id,
        "acting_as_user_id": acting_as_user_id,
        "action": action,
        "resource": resource,
        "severity": severity,
        "details": details or {},
        "ip": ip,
        "user_agent": ua,
        "request_id": request_id,
        "created_at": datetime.utcnow().isoformat()
    }
    
    # Log to console for now - replace with DB insert
    print(f"AUDIT [{severity}]: {action} by {actor_user_id} -> {acting_as_user_id or 'self'}")
    if details:
        print(f"  Details: {json.dumps(details, indent=2)}")

def audit(action: str, resource: str = None, severity: str = "INFO"):
    def decorator(fn):
        @wraps(fn)
        async def wrapper(*args, **kwargs):
            request: Request = kwargs.get("request")
            ctx = kwargs.get("ctx")  # endpoint'te ctx: AuthCtx parametre olarak iste
            
            # Call the original function
            resp = await fn(*args, **kwargs)
            
            # Write audit log
            if ctx:
                await write_audit(
                    org_id=ctx.org_id,
                    actor_user_id=ctx.user.id,
                    acting_as_user_id=ctx.acting_user.id if ctx.acting_user.id != ctx.user.id else None,
                    action=action,
                    resource=resource,
                    severity=severity,
                    details={
                        "path": str(request.url) if request else None,
                        "method": request.method if request else None,
                        "response_status": getattr(resp, "status_code", 200)
                    },
                    ip=request.client.host if request and request.client else None,
                    ua=request.headers.get("user-agent") if request else None,
                    request_id=ctx.request_id
                )
            
            return resp
        return wrapper
    return decorator
