from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from datetime import datetime, timedelta
import json
from typing import Optional
from pydantic import BaseModel
from ..database import get_session
from ..models import DataBreachReport, BreachEvent, User
from ..auth import get_current_user
from ..tasks.email import queue_email_notification

router = APIRouter(prefix="/api/v1/breaches", tags=["breach"])

class BreachCreate(BaseModel):
    breach_type: str
    description: str
    affected_data: dict
    affected_individuals: int
    start_date: Optional[datetime] = None

class BreachTriage(BaseModel):
    risk_level: str  # low, medium, high
    reportable: bool
    root_cause: Optional[str] = None
    remediation_measures: Optional[str] = None

class AuthorityNotice(BaseModel):
    authority_name: str
    authority_email: str
    dpo_contact: str
    likely_consequences: str
    measures_taken: str

class SubjectNotice(BaseModel):
    notification_template: str
    include_measures: bool = True
    include_contact: bool = True

@router.post("")
async def create_breach(
    breach_data: BreachCreate,
    user_id: str = Depends(get_current_user),
    background_tasks: BackgroundTasks = None
):
    """Create a new data breach report (GDPR Art.33)"""
    
    with get_session() as session:
        breach = DataBreachReport(
            user_id=int(user_id),
            breach_type=breach_data.breach_type,
            description=breach_data.description,
            affected_data=json.dumps(breach_data.affected_data),
            affected_individuals=breach_data.affected_individuals,
            discovery_date=datetime.utcnow(),
            start_date=breach_data.start_date,
            status="new"
        )
        session.add(breach)
        session.commit()
        
        # Log event
        event = BreachEvent(
            breach_id=breach.id,
            actor="user",
            action="created",
            payload=json.dumps({"user_id": user_id})
        )
        session.add(event)
        session.commit()
        
        # Queue notification to DPO
        if background_tasks:
            background_tasks.add_task(
                queue_email_notification,
                user_id=int(user_id),
                email_type="breach_detected",
                recipient_email="dpo@company.com",  # TODO: Get from config
                subject=f"Data Breach Detected - {breach.id}",
                content=f"New breach detected: {breach_data.description}"
            )
    
    return {
        "status": "created",
        "breach_id": breach.id,
        "discovery_date": breach.discovery_date.isoformat(),
        "next_step": "triage"
    }

@router.post("/{breach_id}/triage")
async def triage_breach(
    breach_id: int,
    triage_data: BreachTriage,
    user_id: str = Depends(get_current_user)
):
    """Triage breach and determine if reportable (GDPR Art.33)"""
    
    with get_session() as session:
        breach = session.query(DataBreachReport).filter(
            DataBreachReport.id == breach_id,
            DataBreachReport.user_id == int(user_id)
        ).first()
        
        if not breach:
            raise HTTPException(status_code=404, detail="Breach not found")
        
        # Update breach with triage results
        breach.risk_level = triage_data.risk_level
        breach.reportable = triage_data.reportable
        breach.root_cause = triage_data.root_cause
        breach.remediation_measures = triage_data.remediation_measures
        breach.status = "triage"
        
        # Set 72h SLA deadline if reportable
        if triage_data.reportable:
            breach.sla_deadline = breach.discovery_date + timedelta(hours=72)
        
        session.commit()
        
        # Log event
        event = BreachEvent(
            breach_id=breach.id,
            actor="user",
            action="triaged",
            payload=json.dumps({
                "risk_level": triage_data.risk_level,
                "reportable": triage_data.reportable
            })
        )
        session.add(event)
        session.commit()
    
    return {
        "status": "triaged",
        "risk_level": triage_data.risk_level,
        "reportable": triage_data.reportable,
        "sla_deadline": breach.sla_deadline.isoformat() if breach.sla_deadline else None
    }

@router.post("/{breach_id}/notify-authority")
async def notify_supervisory_authority(
    breach_id: int,
    notice_data: AuthorityNotice,
    user_id: str = Depends(get_current_user)
):
    """Notify supervisory authority (GDPR Art.33(3))"""
    
    with get_session() as session:
        breach = session.query(DataBreachReport).filter(
            DataBreachReport.id == breach_id,
            DataBreachReport.user_id == int(user_id)
        ).first()
        
        if not breach:
            raise HTTPException(status_code=404, detail="Breach not found")
        
        if not breach.reportable:
            raise HTTPException(status_code=400, detail="Breach is not reportable")
        
        # Check if within 72h deadline
        if breach.sla_deadline and datetime.utcnow() > breach.sla_deadline:
            # Log delay justification
            breach.notes = json.dumps({
                "authority_notification_delayed": True,
                "delay_reason": "Investigation required more time",
                "original_deadline": breach.sla_deadline.isoformat()
            })
        
        breach.authority_notified_at = datetime.utcnow()
        breach.status = "authority_notified"
        session.commit()
        
        # Log event
        event = BreachEvent(
            breach_id=breach.id,
            actor="user",
            action="authority_notified",
            payload=json.dumps({
                "authority": notice_data.authority_name,
                "dpo_contact": notice_data.dpo_contact
            })
        )
        session.add(event)
        session.commit()
    
    return {
        "status": "authority_notified",
        "notification_date": breach.authority_notified_at.isoformat(),
        "authority": notice_data.authority_name
    }

@router.post("/{breach_id}/notify-subjects")
async def notify_data_subjects(
    breach_id: int,
    notice_data: SubjectNotice,
    user_id: str = Depends(get_current_user)
):
    """Notify data subjects if high risk (GDPR Art.34)"""
    
    with get_session() as session:
        breach = session.query(DataBreachReport).filter(
            DataBreachReport.id == breach_id,
            DataBreachReport.user_id == int(user_id)
        ).first()
        
        if not breach:
            raise HTTPException(status_code=404, detail="Breach not found")
        
        if breach.risk_level != "high":
            raise HTTPException(status_code=400, detail="Only high-risk breaches require subject notification")
        
        breach.subjects_notified_at = datetime.utcnow()
        breach.status = "subjects_notified"
        session.commit()
        
        # Log event
        event = BreachEvent(
            breach_id=breach.id,
            actor="user",
            action="subjects_notified",
            payload=json.dumps({
                "template": notice_data.notification_template,
                "affected_count": breach.affected_individuals
            })
        )
        session.add(event)
        session.commit()
    
    return {
        "status": "subjects_notified",
        "notification_date": breach.subjects_notified_at.isoformat(),
        "affected_individuals": breach.affected_individuals
    }

@router.get("/{breach_id}/report.pdf")
async def breach_report_pdf(breach_id: int, user_id: str = Depends(get_current_user)):
    """Generate auditor-ready PDF report"""
    
    with get_session() as session:
        breach = session.query(DataBreachReport).filter(
            DataBreachReport.id == breach_id,
            DataBreachReport.user_id == int(user_id)
        ).first()
        
        if not breach:
            raise HTTPException(status_code=404, detail="Breach not found")
        
        # Get all events for timeline
        events = session.query(BreachEvent).filter(
            BreachEvent.breach_id == breach_id
        ).order_by(BreachEvent.timestamp).all()
    
    # TODO: Generate actual PDF
    # For now, return JSON structure
    return {
        "breach_id": breach.id,
        "type": breach.breach_type,
        "discovery_date": breach.discovery_date.isoformat(),
        "risk_level": breach.risk_level,
        "reportable": breach.reportable,
        "authority_notified": breach.authority_notified_at.isoformat() if breach.authority_notified_at else None,
        "subjects_notified": breach.subjects_notified_at.isoformat() if breach.subjects_notified_at else None,
        "timeline": [
            {
                "timestamp": event.timestamp.isoformat(),
                "action": event.action,
                "actor": event.actor
            }
            for event in events
        ],
        "remediation_measures": breach.remediation_measures,
        "notes": json.loads(breach.notes) if breach.notes else None
    }

@router.get("")
async def get_breach_reports(user_id: str = Depends(get_current_user)):
    """Get all breach reports for user"""
    
    with get_session() as session:
        breaches = session.query(DataBreachReport).filter(
            DataBreachReport.user_id == int(user_id)
        ).order_by(DataBreachReport.created_at.desc()).all()
    
    return {
        "breaches": [
            {
                "id": breach.id,
                "type": breach.breach_type,
                "description": breach.description,
                "risk_level": breach.risk_level,
                "status": breach.status,
                "discovery_date": breach.discovery_date.isoformat(),
                "sla_deadline": breach.sla_deadline.isoformat() if breach.sla_deadline else None,
                "affected_individuals": breach.affected_individuals
            }
            for breach in breaches
        ]
    }
