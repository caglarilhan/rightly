from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime
from app.models import UserRole

class UserBase(BaseModel):
    email: EmailStr
    full_name: Optional[str] = None
    role: UserRole = UserRole.VIEWER

class UserCreate(UserBase):
    password: Optional[str] = None  # Magic link için opsiyonel

class UserUpdate(BaseModel):
    email: Optional[EmailStr] = None
    full_name: Optional[str] = None
    role: Optional[UserRole] = None
    is_active: Optional[bool] = None

class UserResponse(UserBase):
    id: int
    is_active: bool
    is_verified: bool
    last_login: Optional[datetime] = None
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class UserLogin(BaseModel):
    email: EmailStr
    password: Optional[str] = None  # Magic link için opsiyonel

class UserLoginResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse

class MagicLinkRequest(BaseModel):
    email: EmailStr

class MagicLinkResponse(BaseModel):
    message: str
    email: EmailStr
