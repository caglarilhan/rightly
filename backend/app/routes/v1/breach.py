"""
Data breach management API endpoints
"""
from fastapi import APIRouter, Depends, HTTPException, status, Request
from typing import List, Optional
from datetime import datetime
import logging

from app.deps import get_current_user, get_optional_current_user
from app.models import User
from app.models import Breach, BreachSystem
from app.models import BreachSeverity, BreachStatus
from app.schemas.breach import (
    BreachCreate, BreachResponse, BreachUpdate,
    BreachSystemCreate, BreachSystemResponse,
    BreachListResponse
)
from app.services.breach_service import BreachService
from app.observability.audit import audit_logger

logger = logging.getLogger(__name__)
router = APIRouter()

@router.post("/breaches", response_model=BreachResponse)
async def create_breach(
    breach_data: BreachCreate,
    request: Request,
    current_user: User = Depends(get_current_user)
):
    """Create a new data breach record"""
    try:
        service = BreachService()
        
        # Create breach
        breach = await service.create_breach(
            organization_id=current_user.organization_id,
            breach_data=breach_data,
            created_by=current_user.id
        )
        
        # Log audit event
        await audit_logger.log_breach_event(
            actor_user_id=current_user.id,
            organization_id=current_user.organization_id,
            breach_id=breach.id,
            action="create",
            details={"title": breach.title, "severity": breach.severity},
            ip_address=request.client.host if request.client else None,
            user_agent=request.headers.get("user-agent")
        )
        
        return BreachResponse.from_orm(breach)
        
    except Exception as e:
        logger.error(f"Error creating breach: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create breach"
        )

@router.get("/breaches", response_model=BreachListResponse)
async def list_breaches(
    status: Optional[BreachStatus] = None,
    severity: Optional[BreachSeverity] = None,
    limit: int = 100,
    offset: int = 0,
    current_user: Optional[User] = Depends(get_optional_current_user)
):
    """List breaches with filters"""
    try:
        service = BreachService()
        
        org_id = current_user.organization_id if current_user else 1
        breaches = await service.list_breaches(
            organization_id=org_id,
            status=status,
            severity=severity,
            limit=limit,
            offset=offset
        )
        
        return BreachListResponse(
            breaches=[BreachResponse.from_orm(b) for b in breaches["breaches"]],
            total=breaches["total"],
            limit=limit,
            offset=offset
        )
        
    except Exception as e:
        logger.error(f"Error listing breaches: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to list breaches"
        )

@router.get("/breaches/{breach_id}", response_model=BreachResponse)
async def get_breach(
    breach_id: int,
    current_user: User = Depends(get_current_user)
):
    """Get breach details"""
    try:
        service = BreachService()
        
        breach = await service.get_breach(
            organization_id=current_user.organization_id,
            breach_id=breach_id
        )
        
        if not breach:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Breach not found"
            )
        
        return BreachResponse.from_orm(breach)
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting breach: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to get breach"
        )

@router.patch("/breaches/{breach_id}", response_model=BreachResponse)
async def update_breach(
    breach_id: int,
    breach_update: BreachUpdate,
    request: Request,
    current_user: User = Depends(get_current_user)
):
    """Update breach details"""
    try:
        service = BreachService()
        
        # Update breach
        breach = await service.update_breach(
            organization_id=current_user.organization_id,
            breach_id=breach_id,
            breach_update=breach_update,
            updated_by=current_user.id
        )
        
        if not breach:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Breach not found"
            )
        
        # Log audit event
        await audit_logger.log_breach_event(
            actor_user_id=current_user.id,
            organization_id=current_user.organization_id,
            breach_id=breach_id,
            action="update",
            details=breach_update.dict(exclude_unset=True),
            ip_address=request.client.host if request.client else None,
            user_agent=request.headers.get("user-agent")
        )
        
        return BreachResponse.from_orm(breach)
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating breach: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update breach"
        )

@router.post("/breaches/{breach_id}/report")
async def report_breach_to_regulator(
    breach_id: int,
    request: Request,
    current_user: User = Depends(get_current_user)
):
    """Trigger regulator report generation"""
    try:
        service = BreachService()
        
        # Generate regulator report
        report_job = await service.generate_regulator_report(
            organization_id=current_user.organization_id,
            breach_id=breach_id,
            requested_by=current_user.id
        )
        
        # Log audit event
        await audit_logger.log_breach_event(
            actor_user_id=current_user.id,
            organization_id=current_user.organization_id,
            breach_id=breach_id,
            action="report",
            details={"report_job_id": report_job.id},
            ip_address=request.client.host if request.client else None,
            user_agent=request.headers.get("user-agent")
        )
        
        return {"message": "Regulator report generation started", "job_id": report_job.id}
        
    except Exception as e:
        logger.error(f"Error generating regulator report: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to generate regulator report"
        )

@router.post("/breaches/{breach_id}/systems", response_model=BreachSystemResponse)
async def add_breach_system(
    breach_id: int,
    system_data: BreachSystemCreate,
    request: Request,
    current_user: User = Depends(get_current_user)
):
    """Add affected system to breach"""
    try:
        service = BreachService()
        
        system = await service.add_breach_system(
            organization_id=current_user.organization_id,
            breach_id=breach_id,
            system_data=system_data
        )
        
        return BreachSystemResponse.from_orm(system)
        
    except Exception as e:
        logger.error(f"Error adding breach system: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to add breach system"
        )
