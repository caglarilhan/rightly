from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List
import logging

from app.core.database import get_db
from app.models.source import Source, SourceType, SourceStatus
from app.schemas.source import SourceCreate, SourceResponse, SourceUpdate
from app.services.source_service import SourceService

router = APIRouter()
logger = logging.getLogger(__name__)

@router.get("/", response_model=List[SourceResponse])
async def list_sources(
    account_id: int = None,
    skip: int = 0,
    limit: int = 100,
    db: AsyncSession = Depends(get_db)
):
    """Veri kaynaklarını listele"""
    try:
        source_service = SourceService(db)
        sources = await source_service.list_sources(
            account_id=account_id,
            skip=skip, 
            limit=limit
        )
        return sources
        
    except Exception as e:
        logger.error(f"Error listing sources: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Veri kaynakları listelenemedi"
        )

@router.post("/", response_model=SourceResponse, status_code=status.HTTP_201_CREATED)
async def create_source(
    source_data: SourceCreate,
    db: AsyncSession = Depends(get_db)
):
    """Yeni veri kaynağı oluştur"""
    try:
        source_service = SourceService(db)
        source = await source_service.create_source(source_data)
        
        logger.info(f"Created source {source.id} for account {source.account_id}")
        return source
        
    except ValueError as e:
        logger.error(f"Validation error creating source: {e}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except Exception as e:
        logger.error(f"Error creating source: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Veri kaynağı oluşturulamadı"
        )

@router.get("/{source_id}", response_model=SourceResponse)
async def get_source(
    source_id: int,
    db: AsyncSession = Depends(get_db)
):
    """Veri kaynağını getir"""
    try:
        source_service = SourceService(db)
        source = await source_service.get_source(source_id)
        
        if not source:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Veri kaynağı bulunamadı"
            )
        
        return source
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting source {source_id}: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Veri kaynağı getirilemedi"
        )

@router.put("/{source_id}", response_model=SourceResponse)
async def update_source(
    source_id: int,
    source_data: SourceUpdate,
    db: AsyncSession = Depends(get_db)
):
    """Veri kaynağını güncelle"""
    try:
        source_service = SourceService(db)
        source = await source_service.update_source(source_id, source_data)
        
        if not source:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Veri kaynağı bulunamadı"
            )
        
        return source
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating source {source_id}: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Veri kaynağı güncellenemedi"
        )

@router.delete("/{source_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_source(
    source_id: int,
    db: AsyncSession = Depends(get_db)
):
    """Veri kaynağını sil"""
    try:
        source_service = SourceService(db)
        success = await source_service.delete_source(source_id)
        
        if not success:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Veri kaynağı bulunamadı"
            )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting source {source_id}: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Veri kaynağı silinemedi"
        )
