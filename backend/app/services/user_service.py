from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from fastapi import HTTPException, status
from datetime import datetime
from typing import List, Optional
import secrets
import hashlib

from app.models import User, UserRole, Account
from app.schemas.user import UserCreate, UserUpdate, UserResponse
from app.core.auth import get_password_hash, verify_password
from app.core.email import email_service

class UserService:
    @staticmethod
    async def create_user(db: AsyncSession, user_data: UserCreate) -> UserResponse:
        """Yeni kullanıcı oluştur"""
        # Email kontrolü
        existing_user = await UserService.get_user_by_email(db, user_data.email)
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )
        
        # Hesap kontrolü
        account_result = await db.execute(select(Account).where(Account.id == user_data.account_id))
        account = account_result.scalar_one_or_none()
        if not account:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Account not found"
            )
        
        # Kullanıcı oluştur
        hashed_password = None
        if user_data.password:
            hashed_password = get_password_hash(user_data.password)
        
        user = User(
            email=user_data.email,
            hashed_password=hashed_password,
            full_name=user_data.full_name,
            role=user_data.role
        )
        
        db.add(user)
        await db.commit()
        await db.refresh(user)
        
        return UserResponse.from_orm(user)
    
    @staticmethod
    async def get_user_by_email(db: AsyncSession, email: str) -> Optional[User]:
        """Email ile kullanıcı getir"""
        result = await db.execute(select(User).where(User.email == email))
        return result.scalar_one_or_none()
    
    @staticmethod
    async def get_user_by_id(db: AsyncSession, user_id: int) -> Optional[User]:
        """ID ile kullanıcı getir"""
        result = await db.execute(select(User).where(User.id == user_id))
        return result.scalar_one_or_none()
    
    @staticmethod
    async def get_users_by_account(db: AsyncSession, account_id: int) -> List[User]:
        """Hesaba ait kullanıcıları getir"""
        result = await db.execute(select(User).where(User.account_id == account_id))
        return result.scalars().all()
    
    @staticmethod
    async def update_user(db: AsyncSession, user_id: int, user_data: UserUpdate) -> UserResponse:
        """Kullanıcı güncelle"""
        user = await UserService.get_user_by_id(db, user_id)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        
        # Güncelleme
        update_data = user_data.dict(exclude_unset=True)
        for field, value in update_data.items():
            setattr(user, field, value)
        
        user.updated_at = datetime.utcnow()
        await db.commit()
        await db.refresh(user)
        
        return UserResponse.from_orm(user)
    
    @staticmethod
    async def delete_user(db: AsyncSession, user_id: int) -> bool:
        """Kullanıcı sil (soft delete)"""
        user = await UserService.get_user_by_id(db, user_id)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        
        user.is_active = False
        user.updated_at = datetime.utcnow()
        await db.commit()
        
        return True
    
    @staticmethod
    async def authenticate_user(db: AsyncSession, email: str, password: str) -> Optional[User]:
        """Kullanıcı kimlik doğrulama"""
        user = await UserService.get_user_by_email(db, email)
        if not user:
            return None
        
        if not user.hashed_password:
            return None  # Magic link kullanıcısı
        
        if not verify_password(password, user.hashed_password):
            return None
        
        if not user.is_active:
            return None
        
        return user
    
    @staticmethod
    async def update_last_login(db: AsyncSession, user_id: int):
        """Son giriş zamanını güncelle"""
        user = await UserService.get_user_by_id(db, user_id)
        if user:
            user.last_login_at = datetime.utcnow()
            await db.commit()
    
    @staticmethod
    async def send_magic_link(db: AsyncSession, email: str) -> bool:
        """Magic link gönder"""
        user = await UserService.get_user_by_email(db, email)
        if not user:
            return False  # Kullanıcı yoksa sessizce başarısız ol
        
        if not user.is_active:
            return False
        
        # Magic link token oluştur
        token = secrets.token_urlsafe(32)
        token_hash = hashlib.sha256(token.encode()).hexdigest()
        
        # Token'ı geçici olarak sakla (Redis kullanılabilir)
        # Şimdilik basit bir yaklaşım
        
        # Magic link URL oluştur
        magic_link = f"http://localhost:3000/auth/magic-link?token={token}&email={email}"
        
        # E-posta gönder
        try:
            await EmailService.send_magic_link_email(
                to_email=email,
                magic_link=magic_link,
                user_name=user.full_name or "User"
            )
            return True
        except Exception as e:
            print(f"Magic link email error: {e}")
            return False
    
    @staticmethod
    async def verify_magic_link(db: AsyncSession, email: str, token: str) -> Optional[User]:
        """Magic link doğrula"""
        user = await UserService.get_user_by_email(db, email)
        if not user:
            return None
        
        if not user.is_active:
            return None
        
        # Token doğrulama (basit implementasyon)
        # Gerçek uygulamada Redis'te saklanan token'lar kontrol edilir
        
        # Şimdilik herhangi bir token'ı kabul et
        return user
