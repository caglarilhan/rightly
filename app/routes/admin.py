# app/routes/admin.py
from fastapi import APIRouter, Depends, Response, Request, HTTPException
from datetime import timedelta, datetime, timezone
import secrets
from typing import List, Optional
from pydantic import BaseModel

from app.security.rbac import AuthCtx, require_perms, get_auth_ctx, hash_ip, hash_ua
from app.observability.audit import audit

router = APIRouter(prefix="/admin", tags=["admin"])

# Request/Response models
class ImpersonateRequest(BaseModel):
    user_id: str
    reason: str

class SetRolesRequest(BaseModel):
    role_ids: List[str]

class ToggleFlagRequest(BaseModel):
    key: str
    enabled: bool

class UserResponse(BaseModel):
    id: str
    email: str
    full_name: Optional[str]
    is_active: bool
    is_super_admin: bool
    org_id: str
    created_at: str

class AuditEventResponse(BaseModel):
    id: int
    action: str
    resource: Optional[str]
    severity: str
    actor_user_id: str
    acting_as_user_id: Optional[str]
    details: dict
    ip: Optional[str]
    created_at: str

class FeatureFlagResponse(BaseModel):
    key: str
    description: str
    enabled: bool

# Mock data functions - replace with actual DB queries
async def list_org_users(org_id: str) -> List[UserResponse]:
    return [
        UserResponse(
            id="user-1",
            email="admin@rightly.com",
            full_name="Admin User",
            is_active=True,
            is_super_admin=True,
            org_id=org_id,
            created_at="2024-01-01T00:00:00Z"
        ),
        UserResponse(
            id="user-2", 
            email="user@rightly.com",
            full_name="Regular User",
            is_active=True,
            is_super_admin=False,
            org_id=org_id,
            created_at="2024-01-02T00:00:00Z"
        )
    ]

async def set_user_roles(user_id: str, org_id: str, role_ids: List[str]):
    # Mock role assignment - replace with actual DB update
    print(f"Setting roles {role_ids} for user {user_id} in org {org_id}")

async def create_impersonation_session(
    admin_user_id: str, 
    target_user_id: str, 
    org_id: str, 
    reason: str, 
    session_id: str, 
    expires_at: datetime,
    ip_hash: str = "",
    ua_hash: str = ""
):
    # Mock session creation - replace with actual DB insert
    print(f"Creating impersonation session {session_id} for {admin_user_id} -> {target_user_id}")

async def delete_impersonation_sessions_for_admin(admin_user_id: str):
    # Mock session deletion - replace with actual DB delete
    print(f"Deleting impersonation sessions for admin {admin_user_id}")

async def list_audit(org_id: str, page: int = 1, limit: int = 50) -> List[AuditEventResponse]:
    return [
        AuditEventResponse(
            id=1,
            action="admin.users.read",
            resource="users",
            severity="INFO",
            actor_user_id="admin-user-id",
            acting_as_user_id=None,
            details={"path": "/admin/users"},
            ip="127.0.0.1",
            created_at="2024-01-01T00:00:00Z"
        )
    ]

async def list_org_flags(org_id: str) -> List[FeatureFlagResponse]:
    return [
        FeatureFlagResponse(
            key="admin_panel",
            description="Admin panel access",
            enabled=True
        ),
        FeatureFlagResponse(
            key="ai_copilot",
            description="AI assistant features", 
            enabled=False
        )
    ]

async def set_org_flag(org_id: str, key: str, enabled: bool):
    # Mock flag toggle - replace with actual DB update
    print(f"Setting flag {key} = {enabled} for org {org_id}")

# Admin endpoints
@router.get("/check")
async def admin_check(ctx: AuthCtx = Depends(require_perms("admin.audit.view"))):
    return {
        "ok": True, 
        "user": str(ctx.user.id), 
        "acting": str(ctx.acting_user.id), 
        "org": ctx.org_id,
        "is_super_admin": ctx.user.is_super_admin,
        "permissions": ctx.perms
    }

@router.get("/users")
@audit("admin.users.read", resource="users")
async def list_users(ctx: AuthCtx = Depends(require_perms("admin.users.read"))):
    # org scoped liste
    users = await list_org_users(ctx.org_id)
    return {"items": users}

@router.post("/users/{user_id}/roles")
@audit("admin.users.write", resource="users")
async def set_roles(
    user_id: str, 
    payload: SetRolesRequest, 
    ctx: AuthCtx = Depends(require_perms("admin.users.write"))
):
    await set_user_roles(user_id, ctx.org_id, payload.role_ids)
    return {"ok": True}

@router.post("/impersonate")
@audit("admin.impersonate.start", resource="users", severity="HIGH")
async def start_impersonation(
    payload: ImpersonateRequest, 
    response: Response, 
    request: Request, 
    ctx: AuthCtx = Depends(require_perms("admin.users.impersonate"))
):
    target_id = payload.user_id
    reason = payload.reason
    
    if not target_id or not reason:
        raise HTTPException(400, "user_id and reason required")
    
    # TTL 30dk
    expires = datetime.now(timezone.utc) + timedelta(minutes=30)
    sid = str(secrets.token_urlsafe(24))
    
    await create_impersonation_session(
        ctx.user.id, 
        target_id, 
        ctx.org_id, 
        reason, 
        sid, 
        expires,
        ip_hash=hash_ip(request.client.host if request.client else ""),
        ua_hash=hash_ua(request.headers.get("user-agent", ""))
    )
    
    # cookie (HttpOnly + Secure + SameSite=Strict)
    response.set_cookie(
        "impersonation_sid", 
        sid, 
        max_age=1800, 
        httponly=True, 
        secure=True, 
        samesite="strict"
    )
    
    return {"ok": True, "sid": sid, "expires_at": expires.isoformat()}

@router.delete("/impersonate")
@audit("admin.impersonate.stop", resource="users", severity="HIGH")
async def stop_impersonation(
    response: Response, 
    ctx: AuthCtx = Depends(require_perms("admin.users.impersonate"))
):
    await delete_impersonation_sessions_for_admin(ctx.user.id)
    response.delete_cookie("impersonation_sid")
    return {"ok": True}

@router.get("/audit")
async def get_audit(
    page: int = 1, 
    limit: int = 50, 
    ctx: AuthCtx = Depends(require_perms("admin.audit.view"))
):
    items = await list_audit(ctx.org_id, page, limit)
    return {"items": items, "page": page, "limit": limit}

@router.get("/flags")
async def list_flags(ctx: AuthCtx = Depends(require_perms("admin.flags.read"))):
    return {"items": await list_org_flags(ctx.org_id)}

@router.post("/flags/toggle")
@audit("admin.flags.toggle", resource="flags")
async def toggle_flag(
    payload: ToggleFlagRequest, 
    ctx: AuthCtx = Depends(require_perms("admin.flags.toggle"))
):
    key = payload.key
    enabled = payload.enabled
    
    await set_org_flag(ctx.org_id, key, bool(enabled))
    return {"ok": True}

@router.get("/health")
async def admin_health(ctx: AuthCtx = Depends(require_perms("admin.health.view"))):
    return {
        "status": "healthy",
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "admin_user": ctx.user.email,
        "acting_as": ctx.acting_user.email if ctx.acting_user.id != ctx.user.id else None
    }
