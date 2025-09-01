from pydantic import BaseModel
from typing import Optional, Dict, Any
from datetime import datetime
from enum import Enum

from app.models.source import SourceType, SourceStatus

class SourceBase(BaseModel):
    name: str
    source_type: SourceType
    connection_data: Optional[Dict[str, Any]] = None

class SourceCreate(SourceBase):
    account_id: int

class SourceUpdate(BaseModel):
    name: Optional[str] = None
    source_type: Optional[SourceType] = None
    connection_data: Optional[Dict[str, Any]] = None
    status: Optional[SourceStatus] = None
    is_enabled: Optional[bool] = None

class SourceResponse(SourceBase):
    id: int
    account_id: int
    status: SourceStatus
    is_enabled: bool
    last_sync_at: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


