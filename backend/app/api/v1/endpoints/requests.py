from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List
import logging

from app.core.database import get_db
from app.models import DSARRequest, RequestStatus
from app.schemas.request import RequestCreate, RequestResponse, RequestUpdate
from app.tasks.dsar_tasks import process_dsar_request

router = APIRouter()
logger = logging.getLogger(__name__)

@router.post("/", response_model=RequestResponse, status_code=status.HTTP_201_CREATED)
async def create_request(
    request_data: RequestCreate,
    db: AsyncSession = Depends(get_db)
):
    """Yeni DSAR talebi oluştur"""
    try:
        request_service = RequestService(db)
        request = await request_service.create_request(request_data)
        
        # Celery task'ını tetikle
        process_dsar_request.delay(request.id)
        
        logger.info(f"Created DSAR request {request.id} for {request.subject_email}")
        return request
        
    except ValueError as e:
        logger.error(f"Validation error creating DSAR request: {e}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except Exception as e:
        logger.error(f"Error creating DSAR request: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="DSAR talebi oluşturulamadı"
        )

@router.get("/{request_id}", response_model=RequestResponse)
async def get_request(
    request_id: int,
    db: AsyncSession = Depends(get_db)
):
    """DSAR talebini getir"""
    try:
        request_service = RequestService(db)
        request = await request_service.get_request(request_id)
        
        if not request:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="DSAR talebi bulunamadı"
            )
        
        return request
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting DSAR request {request_id}: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="DSAR talebi getirilemedi"
        )

@router.get("/", response_model=List[RequestResponse])
async def list_requests(
    skip: int = 0,
    limit: int = 100,
    status: RequestStatus = None,
    db: AsyncSession = Depends(get_db)
):
    """DSAR taleplerini listele"""
    try:
        request_service = RequestService(db)
        requests = await request_service.list_requests(skip=skip, limit=limit, status=status)
        return requests
        
    except Exception as e:
        logger.error(f"Error listing DSAR requests: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="DSAR talepleri listelenemedi"
        )

@router.put("/{request_id}", response_model=RequestResponse)
async def update_request(
    request_id: int,
    request_data: RequestUpdate,
    db: AsyncSession = Depends(get_db)
):
    """DSAR talebini güncelle"""
    try:
        request_service = RequestService(db)
        request = await request_service.update_request(request_id, request_data)
        
        if not request:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="DSAR talebi bulunamadı"
            )
        
        return request
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating DSAR request {request_id}: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="DSAR talebi güncellenemedi"
        )

@router.delete("/{request_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_request(
    request_id: int,
    db: AsyncSession = Depends(get_db)
):
    """DSAR talebini sil"""
    try:
        request_service = RequestService(db)
        success = await request_service.delete_request(request_id)
        
        if not success:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="DSAR talebi bulunamadı"
            )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting DSAR request {request_id}: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="DSAR talebi silinemedi"
        )
