from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List, Optional
import logging

from app.models.account import Account
from app.schemas.account import AccountCreate, AccountUpdate, AccountResponse

logger = logging.getLogger(__name__)

class AccountService:
    def __init__(self, db: AsyncSession):
        self.db = db
    
    async def create_account(self, account_data: AccountCreate) -> AccountResponse:
        """Yeni hesap oluştur"""
        # Email kontrolü
        existing_query = select(Account).where(Account.email == account_data.email)
        result = await self.db.execute(existing_query)
        existing_account = result.scalar_one_or_none()
        
        if existing_account:
            raise ValueError("Bu email adresi zaten kullanımda")
        
        # Yeni hesap oluştur
        new_account = Account(
            email=account_data.email,
            company_name=account_data.company_name,
            plan="free"  # Başlangıç planı
        )
        
        self.db.add(new_account)
        await self.db.commit()
        await self.db.refresh(new_account)
        
        return AccountResponse.from_orm(new_account)
    
    async def get_account(self, account_id: int) -> Optional[AccountResponse]:
        """Hesabı getir"""
        query = select(Account).where(Account.id == account_id)
        result = await self.db.execute(query)
        account = result.scalar_one_or_none()
        
        if account:
            return AccountResponse.from_orm(account)
        return None
    
    async def list_accounts(self, skip: int = 0, limit: int = 100) -> List[AccountResponse]:
        """Hesapları listele"""
        query = select(Account).offset(skip).limit(limit)
        result = await self.db.execute(query)
        accounts = result.scalars().all()
        
        return [AccountResponse.from_orm(account) for account in accounts]
    
    async def update_account(self, account_id: int, account_data: AccountUpdate) -> Optional[AccountResponse]:
        """Hesabı güncelle"""
        query = select(Account).where(Account.id == account_id)
        result = await self.db.execute(query)
        account = result.scalar_one_or_none()
        
        if not account:
            return None
        
        # Güncelleme
        for field, value in account_data.dict(exclude_unset=True).items():
            setattr(account, field, value)
        
        await self.db.commit()
        await self.db.refresh(account)
        
        return AccountResponse.from_orm(account)
    
    async def get_account_by_email(self, email: str) -> Optional[AccountResponse]:
        """Email ile hesap getir"""
        query = select(Account).where(Account.email == email)
        result = await self.db.execute(query)
        account = result.scalar_one_or_none()
        
        if account:
            return AccountResponse.from_orm(account)
        return None


