from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List, Optional
import json
import logging

from app.models.source import Source, SourceStatus
from app.models.account import Account
from app.schemas.source import SourceCreate, SourceUpdate, SourceResponse

logger = logging.getLogger(__name__)

class SourceService:
    def __init__(self, db: AsyncSession):
        self.db = db
    
    async def create_source(self, source_data: SourceCreate) -> SourceResponse:
        """Yeni veri kaynağı oluştur"""
        # Account kontrolü
        account_query = select(Account).where(Account.id == source_data.account_id)
        result = await self.db.execute(account_query)
        account = result.scalar_one_or_none()
        
        if not account:
            raise ValueError("Account bulunamadı")
        
        # Yeni kaynak oluştur
        new_source = Source(
            account_id=source_data.account_id,
            name=source_data.name,
            source_type=source_data.source_type,
            connection_data=json.dumps(source_data.connection_data) if source_data.connection_data else None,
            status=SourceStatus.ACTIVE,
            is_enabled=True
        )
        
        self.db.add(new_source)
        await self.db.commit()
        await self.db.refresh(new_source)
        
        return SourceResponse.from_orm(new_source)
    
    async def get_source(self, source_id: int) -> Optional[SourceResponse]:
        """Veri kaynağını getir"""
        query = select(Source).where(Source.id == source_id)
        result = await self.db.execute(query)
        source = result.scalar_one_or_none()
        
        if source:
            return SourceResponse.from_orm(source)
        return None
    
    async def list_sources(
        self, 
        account_id: Optional[int] = None,
        skip: int = 0, 
        limit: int = 100
    ) -> List[SourceResponse]:
        """Veri kaynaklarını listele"""
        query = select(Source)
        
        if account_id:
            query = query.where(Source.account_id == account_id)
        
        query = query.offset(skip).limit(limit)
        result = await self.db.execute(query)
        sources = result.scalars().all()
        
        return [SourceResponse.from_orm(source) for source in sources]
    
    async def update_source(self, source_id: int, source_data: SourceUpdate) -> Optional[SourceResponse]:
        """Veri kaynağını güncelle"""
        query = select(Source).where(Source.id == source_id)
        result = await self.db.execute(query)
        source = result.scalar_one_or_none()
        
        if not source:
            return None
        
        # Güncelleme
        for field, value in source_data.dict(exclude_unset=True).items():
            if field == "connection_data" and value:
                setattr(source, field, json.dumps(value))
            else:
                setattr(source, field, value)
        
        await self.db.commit()
        await self.db.refresh(source)
        
        return SourceResponse.from_orm(source)
    
    async def delete_source(self, source_id: int) -> bool:
        """Veri kaynağını sil"""
        query = select(Source).where(Source.id == source_id)
        result = await self.db.execute(query)
        source = result.scalar_one_or_none()
        
        if not source:
            return False
        
        await self.db.delete(source)
        await self.db.commit()
        
        return True
    
    async def update_source_status(self, source_id: int, status: SourceStatus) -> bool:
        """Kaynak durumunu güncelle"""
        query = select(Source).where(Source.id == source_id)
        result = await self.db.execute(query)
        source = result.scalar_one_or_none()
        
        if not source:
            return False
        
        source.status = status
        await self.db.commit()
        
        return True


