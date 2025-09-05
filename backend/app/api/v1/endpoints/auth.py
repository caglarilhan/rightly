import logging
from datetime import timedelta
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.core.database import get_db
from app.core.auth import (
    verify_password, get_password_hash, create_access_token, 
    create_magic_link_token, create_verification_token, create_password_reset_token,
    verify_token, get_current_user, ACCESS_TOKEN_EXPIRE_MINUTES
)
# # from app.core.email import email_service
from app.models import User, UserRole
from app.schemas.auth import (
    UserCreate, User as UserSchema, Token, LoginRequest, 
    MagicLinkRequest, PasswordResetRequest, PasswordResetConfirm,
    EmailVerificationRequest, ChangePasswordRequest
)

router = APIRouter()
logger = logging.getLogger(__name__)

@router.post("/register", response_model=UserSchema)
async def register(
    user_data: UserCreate,
    db: AsyncSession = Depends(get_db)
):
    """Kullanıcı kaydı"""
    # Email kontrolü
    result = await db.execute(select(User).where(User.email == user_data.email))
    existing_user = result.scalar_one_or_none()
    
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Yeni kullanıcı oluştur
    hashed_password = None
    if user_data.password:
        hashed_password = get_password_hash(user_data.password)
    
    # Verification token oluştur
    verification_token = create_verification_token(user_data.email)
    
    new_user = User(
        email=user_data.email,
        hashed_password=hashed_password,
        full_name=user_data.full_name,
        role=user_data.role,
        email_verification_token=verification_token,
        is_verified=False
    )
    
    db.add(new_user)
    await db.commit()
    await db.refresh(new_user)
    
    # Verification email gönder (şimdilik devre dışı)
    # email_service.send_verification_email(user_data.email, verification_token)
    
    return new_user

@router.post("/login", response_model=Token)
async def login(
    login_data: LoginRequest,
    db: AsyncSession = Depends(get_db)
):
    """Kullanıcı girişi"""
    # Kullanıcıyı bul
    result = await db.execute(select(User).where(User.email == login_data.email))
    user = result.scalar_one_or_none()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )
    
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Account is inactive"
        )
    
    # Şifre kontrolü (eğer şifre varsa)
    if login_data.password:
        if not user.hashed_password or not verify_password(login_data.password, user.hashed_password):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect email or password"
            )
    else:
        # Magic link login - şifre olmadan
        if user.hashed_password:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Password required for this account"
            )
    
    # Email verification kontrolü
    if not user.is_verified:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Please verify your email first"
        )
    
    # Last login güncelle
    from datetime import datetime
    user.last_login = datetime.utcnow()
    await db.commit()
    
    # Access token oluştur
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "expires_in": ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        "user": {
            "id": user.id,
            "email": user.email,
            "full_name": user.full_name,
            "role": user.role,
            "is_active": user.is_active,
            "is_verified": user.is_verified,
            "last_login": user.last_login,
            "created_at": user.created_at
        }
    }

@router.post("/magic-link")
async def send_magic_link(
    magic_link_data: MagicLinkRequest,
    db: AsyncSession = Depends(get_db)
):
    """Magic link gönder"""
    # Kullanıcıyı bul
    result = await db.execute(select(User).where(User.email == magic_link_data.email))
    user = result.scalar_one_or_none()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Account is inactive"
        )
    
    # Magic link token oluştur
    magic_link_token = create_magic_link_token(magic_link_data.email)
    
    # Email gönder (şimdilik devre dışı)
    # success = email_service.send_magic_link(
    #     magic_link_data.email, 
    #     magic_link_token, 
    #     magic_link_data.redirect_url
    # )
    # 
    # if not success:
    #     raise HTTPException(
    #         status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
    #         detail="Failed to send magic link"
    #     )
    
    return {"message": "Magic link sent successfully"}

@router.post("/magic-link/verify", response_model=Token)
async def verify_magic_link(
    token: str,
    db: AsyncSession = Depends(get_db)
):
    """Magic link doğrulama"""
    try:
        # Token doğrula
        token_data = verify_token(token, "magic_link")
        
        # Kullanıcıyı bul
        result = await db.execute(select(User).where(User.email == token_data.email))
        user = result.scalar_one_or_none()
        
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        
        if not user.is_active:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Account is inactive"
            )
        
        # Last login güncelle
        from datetime import datetime
        user.last_login = datetime.utcnow()
        await db.commit()
        
        # Access token oluştur
        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            data={"sub": user.email}, expires_delta=access_token_expires
        )
        
        return {
            "access_token": access_token,
            "token_type": "bearer",
            "expires_in": ACCESS_TOKEN_EXPIRE_MINUTES * 60,
            "user": {
                "id": user.id,
                "email": user.email,
                "full_name": user.full_name,
                "role": user.role,
                "is_active": user.is_active,
                "is_verified": user.is_verified,
                "last_login": user.last_login,
                "created_at": user.created_at
            }
        }
        
    except HTTPException:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired magic link"
        )

@router.post("/verify-email")
async def verify_email(
    verification_data: EmailVerificationRequest,
    db: AsyncSession = Depends(get_db)
):
    """Email doğrulama"""
    try:
        # Token doğrula
        token_data = verify_token(verification_data.token, "verification")
        
        # Kullanıcıyı bul
        result = await db.execute(select(User).where(User.email == token_data.email))
        user = result.scalar_one_or_none()
        
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        
        # Email'i doğrula
        user.is_verified = True
        user.email_verification_token = None
        await db.commit()
        
        return {"message": "Email verified successfully"}
        
    except HTTPException:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired verification token"
        )

@router.post("/forgot-password")
async def forgot_password(
    reset_data: PasswordResetRequest,
    db: AsyncSession = Depends(get_db)
):
    """Şifre sıfırlama talebi"""
    # Kullanıcıyı bul
    result = await db.execute(select(User).where(User.email == reset_data.email))
    user = result.scalar_one_or_none()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Account is inactive"
        )
    
    # Reset token oluştur
    reset_token = create_password_reset_token(reset_data.email)
    user.password_reset_token = reset_token
    await db.commit()
    
    # Email gönder (şimdilik devre dışı)
    # success = email_service.send_password_reset(reset_data.email, reset_token)
    # 
    # if not success:
    #     raise HTTPException(
    #         status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
    #         detail="Failed to send password reset email"
    #     )
    
    return {"message": "Password reset email sent successfully"}

@router.post("/reset-password")
async def reset_password(
    reset_data: PasswordResetConfirm,
    db: AsyncSession = Depends(get_db)
):
    """Şifre sıfırlama"""
    try:
        # Token doğrula
        token_data = verify_token(reset_data.token, "password_reset")
        
        # Kullanıcıyı bul
        result = await db.execute(select(User).where(User.email == token_data.email))
        user = result.scalar_one_or_none()
        
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        
        # Şifreyi güncelle
        user.hashed_password = get_password_hash(reset_data.new_password)
        user.password_reset_token = None
        await db.commit()
        
        return {"message": "Password reset successfully"}
        
    except HTTPException:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired reset token"
        )

@router.post("/change-password")
async def change_password(
    password_data: ChangePasswordRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Şifre değiştirme"""
    # Mevcut şifre kontrolü
    if not current_user.hashed_password or not verify_password(password_data.current_password, current_user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Incorrect current password"
        )
    
    # Yeni şifre kontrolü
    if verify_password(password_data.new_password, current_user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="New password must be different from current password"
        )
    
    # Şifreyi güncelle
    current_user.hashed_password = get_password_hash(password_data.new_password)
    await db.commit()
    
    return {"message": "Password changed successfully"}

@router.get("/me", response_model=UserSchema)
async def get_current_user_info(current_user: User = Depends(get_current_user)):
    """Mevcut kullanıcı bilgileri"""
    return current_user

@router.post("/refresh", response_model=Token)
async def refresh_token(current_user: User = Depends(get_current_user)):
    """Token yenileme"""
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": current_user.email}, expires_delta=access_token_expires
    )
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "expires_in": ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        "user": current_user
    }
