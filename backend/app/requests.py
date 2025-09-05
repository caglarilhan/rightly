from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from typing import List
from app.models import User
from .core.database import get_db
from datetime import datetime, timedelta
import uuid

router = APIRouter(prefix="/api/v1/requests", tags=["requests"])

# Simple health check for requests
@router.get("/health")
async def health_check():
    return {"status": "ok", "service": "requests"}
