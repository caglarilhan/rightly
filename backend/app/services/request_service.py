from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from typing import List, Optional
from datetime import datetime, timedelta
import json
import logging

from app.models.request import Request, RequestStatus
from app.models.account import Account
from app.schemas.request import RequestCreate, RequestUpdate, RequestResponse
from app.core.logging import log_gdpr_event

logger = logging.getLogger(__name__)

class RequestService:
    def __init__(self, db: AsyncSession):
        self.db = db
    
    async def create_request(self, request_data: RequestCreate) -> RequestResponse:
        """Yeni DSAR talebi oluştur"""
        # Account'u bul (email ile)
        account_query = select(Account).where(Account.email == request_data.account_email)
        result = await self.db.execute(account_query)
        account = result.scalar_one_or_none()
        
        if not account:
            raise ValueError("Account bulunamadı")
        
        # Yeni talep oluştur
        new_request = Request(
            account_id=account.id,
            request_type=request_data.request_type,
            subject_email=request_data.subject_email,
            subject_name=request_data.subject_name,
            subject_phone=request_data.subject_phone,
            subject_address=request_data.subject_address,
            description=request_data.description,
            additional_info=json.dumps(request_data.additional_info) if request_data.additional_info else None,
            due_date=datetime.utcnow() + timedelta(days=30)  # GDPR 30 gün kuralı
        )
        
        self.db.add(new_request)
        await self.db.commit()
        await self.db.refresh(new_request)
        
        # Audit log
        log_gdpr_event(
            event_type="request_created",
            subject_email=request_data.subject_email,
            request_id=str(new_request.id),
            details={
                "request_type": request_data.request_type.value,
                "account_id": account.id
            }
        )
        
        return RequestResponse.from_orm(new_request)
    
    async def get_request(self, request_id: int) -> Optional[RequestResponse]:
        """DSAR talebini getir"""
        query = select(Request).where(Request.id == request_id)
        result = await self.db.execute(query)
        request = result.scalar_one_or_none()
        
        if request:
            return RequestResponse.from_orm(request)
        return None
    
    async def list_requests(
        self, 
        skip: int = 0, 
        limit: int = 100, 
        status: Optional[RequestStatus] = None
    ) -> List[RequestResponse]:
        """DSAR taleplerini listele"""
        query = select(Request)
        
        if status:
            query = query.where(Request.status == status)
        
        query = query.offset(skip).limit(limit)
        result = await self.db.execute(query)
        requests = result.scalars().all()
        
        return [RequestResponse.from_orm(req) for req in requests]
    
    async def update_request(self, request_id: int, request_data: RequestUpdate) -> Optional[RequestResponse]:
        """DSAR talebini güncelle"""
        query = select(Request).where(Request.id == request_id)
        result = await self.db.execute(query)
        request = result.scalar_one_or_none()
        
        if not request:
            return None
        
        # Güncelleme
        for field, value in request_data.dict(exclude_unset=True).items():
            if field == "additional_info" and value:
                setattr(request, field, json.dumps(value))
            else:
                setattr(request, field, value)
        
        await self.db.commit()
        await self.db.refresh(request)
        
        return RequestResponse.from_orm(request)
    
    async def delete_request(self, request_id: int) -> bool:
        """DSAR talebini sil"""
        query = select(Request).where(Request.id == request_id)
        result = await self.db.execute(query)
        request = result.scalar_one_or_none()
        
        if not request:
            return False
        
        await self.db.delete(request)
        await self.db.commit()
        
        return True
    
    async def update_request_status(self, request_id: int, status: RequestStatus) -> bool:
        """Talep durumunu güncelle"""
        query = select(Request).where(Request.id == request_id)
        result = await self.db.execute(query)
        request = result.scalar_one_or_none()
        
        if not request:
            return False
        
        old_status = request.status
        request.status = status
        await self.db.commit()
        
        # Audit log
        log_gdpr_event(
            event_type="request_status_updated",
            subject_email=request.subject_email,
            request_id=str(request_id),
            details={
                "old_status": old_status.value,
                "new_status": status.value
            }
        )
        
        return True
