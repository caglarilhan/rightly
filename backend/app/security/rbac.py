"""
Role-Based Access Control (RBAC) utilities
"""
from enum import Enum
from typing import List, Set
from fastapi import HTTPException, status
import logging

logger = logging.getLogger(__name__)

class Permission(str, Enum):
    """System permissions"""
    # Consent permissions
    CONSENT_READ = "consent:read"
    CONSENT_WRITE = "consent:write"
    CONSENT_MANAGE = "consent:manage"
    
    # Breach permissions
    BREACH_READ = "breach:read"
    BREACH_WRITE = "breach:write"
    BREACH_MANAGE = "breach:manage"
    
    # DPIA permissions
    DPIA_READ = "dpia:read"
    DPIA_WRITE = "dpia:write"
    DPIA_REVIEW = "dpia:review"
    
    # ROPA permissions
    ROPA_READ = "ropa:read"
    ROPA_WRITE = "ropa:write"
    ROPA_EXPORT = "ropa:export"
    
    # Export permissions
    EXPORT_READ = "export:read"
    EXPORT_RUN = "export:run"
    EXPORT_DOWNLOAD = "export:download"
    
    # Admin permissions
    ADMIN_USERS = "admin:users"
    ADMIN_AUDIT = "admin:audit"
    ADMIN_IMPERSONATE = "admin:impersonate"
    ADMIN_ALL = "admin:*"

class Role(str, Enum):
    """User roles"""
    VIEWER = "viewer"
    USER = "user"
    MANAGER = "manager"
    ADMIN = "admin"
    SUPER_ADMIN = "super_admin"

# Role-permission mapping
ROLE_PERMISSIONS: Dict[Role, Set[Permission]] = {
    Role.VIEWER: {
        Permission.CONSENT_READ,
        Permission.BREACH_READ,
        Permission.DPIA_READ,
        Permission.ROPA_READ,
        Permission.EXPORT_READ,
    },
    Role.USER: {
        Permission.CONSENT_READ,
        Permission.CONSENT_WRITE,
        Permission.BREACH_READ,
        Permission.BREACH_WRITE,
        Permission.DPIA_READ,
        Permission.DPIA_WRITE,
        Permission.ROPA_READ,
        Permission.ROPA_WRITE,
        Permission.EXPORT_READ,
        Permission.EXPORT_RUN,
    },
    Role.MANAGER: {
        Permission.CONSENT_READ,
        Permission.CONSENT_WRITE,
        Permission.CONSENT_MANAGE,
        Permission.BREACH_READ,
        Permission.BREACH_WRITE,
        Permission.BREACH_MANAGE,
        Permission.DPIA_READ,
        Permission.DPIA_WRITE,
        Permission.DPIA_REVIEW,
        Permission.ROPA_READ,
        Permission.ROPA_WRITE,
        Permission.ROPA_EXPORT,
        Permission.EXPORT_READ,
        Permission.EXPORT_RUN,
        Permission.EXPORT_DOWNLOAD,
    },
    Role.ADMIN: {
        Permission.CONSENT_READ,
        Permission.CONSENT_WRITE,
        Permission.CONSENT_MANAGE,
        Permission.BREACH_READ,
        Permission.BREACH_WRITE,
        Permission.BREACH_MANAGE,
        Permission.DPIA_READ,
        Permission.DPIA_WRITE,
        Permission.DPIA_REVIEW,
        Permission.ROPA_READ,
        Permission.ROPA_WRITE,
        Permission.ROPA_EXPORT,
        Permission.EXPORT_READ,
        Permission.EXPORT_RUN,
        Permission.EXPORT_DOWNLOAD,
        Permission.ADMIN_USERS,
        Permission.ADMIN_AUDIT,
    },
    Role.SUPER_ADMIN: {
        Permission.ADMIN_ALL,  # Super admin has all permissions
    }
}

def get_permissions_for_role(role: Role) -> Set[Permission]:
    """Get permissions for a given role"""
    return ROLE_PERMISSIONS.get(role, set())

def has_permission(user_role: Role, required_permission: Permission) -> bool:
    """Check if user role has required permission"""
    if user_role == Role.SUPER_ADMIN:
        return True
    
    user_permissions = get_permissions_for_role(user_role)
    return required_permission in user_permissions

def require_permission(required_permission: Permission):
    """Decorator to require specific permission"""
    def decorator(func):
        def wrapper(*args, **kwargs):
            # This would be used with dependency injection in FastAPI
            # The actual user would be passed via dependency
            pass
        return wrapper
    return decorator

def check_permission(user_role: Role, permission: Permission) -> None:
    """Check permission and raise HTTPException if not authorized"""
    if not has_permission(user_role, permission):
        logger.warning(f"Permission denied: {user_role} lacks {permission}")
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=f"Insufficient permissions. Required: {permission}"
        )

def get_all_permissions() -> List[Permission]:
    """Get all available permissions"""
    return list(Permission)

def get_all_roles() -> List[Role]:
    """Get all available roles"""
    return list(Role)
