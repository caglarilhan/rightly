from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from typing import List
from .models import DSARRequest, User
from .database import get_session
from .auth import verify_token
from datetime import datetime, timedelta
import uuid

router = APIRouter(prefix="/api/v1/requests", tags=["requests"])

# Create DSAR request
@router.post("/")
async def create_request(
    request_data: dict,
    user_id: str = Depends(verify_token),
    session: Session = Depends(get_session)
):
    # Calculate due date (30 days from now)
    due_date = datetime.utcnow() + timedelta(days=30)
    
    dsar_request = DSARRequest(
        user_id=int(user_id),
        request_type=request_data.get("request_type", "access"),
        subject_email=request_data.get("subject_email"),
        subject_name=request_data.get("subject_name"),
        description=request_data.get("description"),
        additional_info=request_data.get("additional_info"),
        due_date=due_date,
        source=request_data.get("source", "manual")
    )
    
    session.add(dsar_request)
    session.commit()
    session.refresh(dsar_request)
    
    return {
        "id": dsar_request.id,
        "request_id": dsar_request.request_id,
        "status": dsar_request.status,
        "due_date": dsar_request.due_date.isoformat()
    }

# Get user's DSAR requests
@router.get("/")
async def get_requests(
    user_id: str = Depends(verify_token),
    session: Session = Depends(get_session)
) -> List[dict]:
    requests = session.exec(
        select(DSARRequest).where(DSARRequest.user_id == int(user_id))
    ).all()
    
    return [
        {
            "id": req.id,
            "request_id": req.request_id,
            "request_type": req.request_type,
            "subject_email": req.subject_email,
            "subject_name": req.subject_name,
            "status": req.status,
            "due_date": req.due_date.isoformat(),
            "source": req.source,
            "created_at": req.created_at.isoformat()
        }
        for req in requests
    ]

# Get specific DSAR request
@router.get("/{request_id}")
async def get_request(
    request_id: str,
    user_id: str = Depends(verify_token),
    session: Session = Depends(get_session)
):
    request = session.exec(
        select(DSARRequest).where(
            DSARRequest.request_id == request_id,
            DSARRequest.user_id == int(user_id)
        )
    ).first()
    
    if not request:
        raise HTTPException(status_code=404, detail="Request not found")
    
    return {
        "id": request.id,
        "request_id": request.request_id,
        "request_type": request.request_type,
        "subject_email": request.subject_email,
        "subject_name": request.subject_name,
        "status": request.status,
        "description": request.description,
        "additional_info": request.additional_info,
        "due_date": request.due_date.isoformat(),
        "source": request.source,
        "created_at": request.created_at.isoformat(),
        "updated_at": request.updated_at.isoformat()
    }

# Update DSAR request status
@router.patch("/{request_id}")
async def update_request(
    request_id: str,
    status: str,
    user_id: str = Depends(verify_token),
    session: Session = Depends(get_session)
):
    request = session.exec(
        select(DSARRequest).where(
            DSARRequest.request_id == request_id,
            DSARRequest.user_id == int(user_id)
        )
    ).first()
    
    if not request:
        raise HTTPException(status_code=404, detail="Request not found")
    
    request.status = status
    request.updated_at = datetime.utcnow()
    
    if status == "completed":
        request.completed_at = datetime.utcnow()
    
    session.add(request)
    session.commit()
    session.refresh(request)
    
    return {"status": "updated", "new_status": request.status}
