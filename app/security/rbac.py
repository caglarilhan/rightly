# app/security/rbac.py
from fastapi import Depends, HTTPException, status, Request
from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime, timezone
import hashlib
import json

# Mock database session - replace with your actual DB
async def get_session():
    # Mock session for now
    return None

class User(BaseModel):
    id: str
    org_id: str
    email: str
    full_name: Optional[str] = None
    is_active: bool = True
    is_super_admin: bool = False

class AuthCtx(BaseModel):
    user: User              # gerçek giriş yapan
    acting_user: User       # etkili kullanıcı (impersonate varsa bu)
    org_id: str
    perms: List[str]
    request_id: Optional[str] = None

async def resolve_user_from_request(request: Request, db) -> Optional[User]:
    # Mock user resolution - replace with your actual auth
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        return None
    
    # Mock user for testing
    return User(
        id="admin-user-id",
        org_id="org-123",
        email="admin@rightly.com",
        full_name="Admin User",
        is_super_admin=True
    )

async def get_user_by_id(user_id: str, db) -> Optional[User]:
    # Mock user lookup - replace with actual DB query
    return User(
        id=user_id,
        org_id="org-123",
        email="user@rightly.com",
        full_name="Target User"
    )

async def fetch_effective_permissions(user_id: str, org_id: str, db) -> List[str]:
    # Mock permissions - replace with actual DB query
    # For super admin, return all permissions
    return [
        "admin.users.read",
        "admin.users.write", 
        "admin.users.impersonate",
        "admin.roles.read",
        "admin.roles.write",
        "admin.flags.read",
        "admin.flags.toggle",
        "admin.audit.view",
        "admin.billing.view",
        "admin.health.view"
    ]

async def get_auth_ctx(request: Request, db=Depends(get_session)) -> AuthCtx:
    # burada mevcut auth'unu çöz (JWT/Cookie)
    user = await resolve_user_from_request(request, db)
    if not user or not user.is_active:
        raise HTTPException(status_code=401, detail="unauthenticated")

    org_id = str(user.org_id)
    request_id = request.headers.get("x-request-id")

    # impersonation var mı?
    sid = request.cookies.get("impersonation_sid") or request.headers.get("x-impersonation-sid")
    acting_user = user
    if sid:
        # Mock session lookup - replace with actual DB query
        # sess = await db.fetch_one("SELECT * FROM impersonation_sessions WHERE id=$1 AND expires_at>now()", sid)
        # if sess and str(sess["admin_user_id"]) == str(user.id):
        #     acting_user = await get_user_by_id(sess["target_user_id"], db)
        pass

    perms = await fetch_effective_permissions(user.id, org_id, db)
    return AuthCtx(user=user, acting_user=acting_user, org_id=org_id, perms=perms, request_id=request_id)

def require_perms(*need: str):
    async def _inner(ctx: AuthCtx = Depends(get_auth_ctx)):
        if ctx.user.is_super_admin:
            return ctx
        missing = [p for p in need if p not in ctx.perms]
        if missing:
            raise HTTPException(status_code=403, detail=f"missing permissions: {missing}")
        return ctx
    return _inner

def hash_ip(ip: str) -> str:
    if not ip:
        return ""
    return hashlib.sha256(ip.encode()).hexdigest()[:16]

def hash_ua(user_agent: str) -> str:
    if not user_agent:
        return ""
    return hashlib.sha256(user_agent.encode()).hexdigest()[:16]
