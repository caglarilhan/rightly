from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List
import logging

from app.core.database import get_db
from app.models import Account
from app.schemas.account import AccountCreate, AccountResponse, AccountUpdate
from app.services.account_service import AccountService

router = APIRouter()
logger = logging.getLogger(__name__)

@router.post("/", response_model=AccountResponse, status_code=status.HTTP_201_CREATED)
async def create_account(
    account_data: AccountCreate,
    db: AsyncSession = Depends(get_db)
):
    """Yeni hesap oluştur"""
    try:
        account_service = AccountService(db)
        account = await account_service.create_account(account_data)
        
        logger.info(f"Created account {account.id} for {account.email}")
        return account
        
    except ValueError as e:
        logger.error(f"Validation error creating account: {e}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except Exception as e:
        logger.error(f"Error creating account: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Hesap oluşturulamadı"
        )

@router.get("/{account_id}", response_model=AccountResponse)
async def get_account(
    account_id: int,
    db: AsyncSession = Depends(get_db)
):
    """Hesabı getir"""
    try:
        account_service = AccountService(db)
        account = await account_service.get_account(account_id)
        
        if not account:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Hesap bulunamadı"
            )
        
        return account
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting account {account_id}: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Hesap getirilemedi"
        )

@router.get("/", response_model=List[AccountResponse])
async def list_accounts(
    skip: int = 0,
    limit: int = 100,
    db: AsyncSession = Depends(get_db)
):
    """Hesapları listele"""
    try:
        account_service = AccountService(db)
        accounts = await account_service.list_accounts(skip=skip, limit=limit)
        return accounts
        
    except Exception as e:
        logger.error(f"Error listing accounts: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Hesaplar listelenemedi"
        )

@router.put("/{account_id}", response_model=AccountResponse)
async def update_account(
    account_id: int,
    account_data: AccountUpdate,
    db: AsyncSession = Depends(get_db)
):
    """Hesabı güncelle"""
    try:
        account_service = AccountService(db)
        account = await account_service.update_account(account_id, account_data)
        
        if not account:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Hesap bulunamadı"
            )
        
        return account
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating account {account_id}: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Hesap güncellenemedi"
        )
