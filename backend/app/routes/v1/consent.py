"""
Consent management API endpoints
"""
from fastapi import APIRouter, Depends, HTTPException, status, Request
from typing import List, Optional
from datetime import datetime
import logging

from app.deps import get_current_user, get_optional_current_user
from app.models import User
from app.models import ConsentEvent, Preference
from app.models import ConsentStatus, ConsentChannel
from app.schemas.consent import (
    ConsentEventCreate, ConsentEventResponse, 
    PreferenceUpdate, PreferenceResponse,
    ConsentHistoryResponse
)
from app.services.consent_service import ConsentService
from app.observability.audit import audit_logger

logger = logging.getLogger(__name__)
router = APIRouter()

@router.post("/consents/event", response_model=ConsentEventResponse)
async def create_consent_event(
    consent_data: ConsentEventCreate,
    request: Request,
    current_user: User = Depends(get_current_user)
):
    """Create a new consent event"""
    try:
        service = ConsentService()
        
        # Create consent event
        consent_event = await service.create_consent_event(
            organization_id=current_user.organization_id,
            consent_data=consent_data,
            actor_user_id=current_user.id,
            ip_address=request.client.host if request.client else None,
            user_agent=request.headers.get("user-agent")
        )
        
        # Log audit event
        await audit_logger.log_consent_event(
            actor_user_id=current_user.id,
            organization_id=current_user.organization_id,
            subject_id=consent_data.subject_id,
            action="create",
            channel=consent_data.channel,
            details={"purpose": consent_data.purpose},
            ip_address=request.client.host if request.client else None,
            user_agent=request.headers.get("user-agent")
        )
        
        return ConsentEventResponse.from_orm(consent_event)
        
    except Exception as e:
        logger.error(f"Error creating consent event: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create consent event"
        )

@router.get("/consents/subject/{subject_id}", response_model=ConsentHistoryResponse)
async def get_consent_history(
    subject_id: str,
    current_user: User = Depends(get_current_user)
):
    """Get consent history for a subject"""
    try:
        service = ConsentService()
        
        # Get consent history
        history = await service.get_consent_history(
            organization_id=current_user.organization_id,
            subject_id=subject_id
        )
        
        return ConsentHistoryResponse(
            subject_id=subject_id,
            events=history["events"],
            current_preferences=history["preferences"]
        )
        
    except Exception as e:
        logger.error(f"Error getting consent history: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to get consent history"
        )

@router.put("/preferences/{subject_id}", response_model=PreferenceResponse)
async def update_preferences(
    subject_id: str,
    preferences: PreferenceUpdate,
    request: Request,
    current_user: User = Depends(get_current_user)
):
    """Update user preferences"""
    try:
        service = ConsentService()
        
        # Update preferences
        updated_preferences = await service.update_preferences(
            organization_id=current_user.organization_id,
            subject_id=subject_id,
            preferences=preferences,
            actor_user_id=current_user.id,
            ip_address=request.client.host if request.client else None,
            user_agent=request.headers.get("user-agent")
        )
        
        return PreferenceResponse.from_orm(updated_preferences)
        
    except Exception as e:
        logger.error(f"Error updating preferences: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update preferences"
        )

@router.get("/consents", response_model=List[ConsentEventResponse])
async def list_consent_events(
    channel: Optional[ConsentChannel] = None,
    status: Optional[ConsentStatus] = None,
    limit: int = 100,
    offset: int = 0,
    current_user: Optional[User] = Depends(get_optional_current_user)
):
    """List consent events with filters"""
    try:
        service = ConsentService()
        
        org_id = current_user.organization_id if current_user else 1
        events = await service.list_consent_events(
            organization_id=org_id,
            channel=channel,
            status=status,
            limit=limit,
            offset=offset
        )
        
        return [ConsentEventResponse.from_orm(event) for event in events]
        
    except Exception as e:
        logger.error(f"Error listing consent events: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to list consent events"
        )
