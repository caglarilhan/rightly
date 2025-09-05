"""
Celery tasks for Data Breach Management
"""
from celery import current_task
from datetime import datetime, timedelta
from typing import List, Optional
import logging

from app.core.celery_app import celery_app
from app.core.database import get_db_session
from app.models import Breach, BreachSystem, User, Organization
from app.core.config import settings

logger = logging.getLogger(__name__)

@celery_app.task(bind=True, name="breach.send_72h_reminder")
def send_72h_breach_reminder(self, breach_id: int):
    """
    Send 72-hour breach notification reminder
    """
    try:
        with get_db_session() as db:
            breach = db.query(Breach).filter(Breach.id == breach_id).first()
            if not breach:
                logger.error(f"Breach {breach_id} not found")
                return {"status": "error", "message": "Breach not found"}
            
            # Check if already notified
            if breach.notified_at:
                logger.info(f"Breach {breach_id} already notified")
                return {"status": "skipped", "message": "Already notified"}
            
            # Check if within 72h window
            now = datetime.utcnow()
            if breach.discovered_at:
                time_diff = now - breach.discovered_at
                if time_diff > timedelta(hours=72):
                    logger.warning(f"Breach {breach_id} notification window expired")
                    return {"status": "expired", "message": "Notification window expired"}
            
            # Send notification (placeholder)
            logger.info(f"Sending 72h breach notification for breach {breach_id}")
            
            # Update breach status
            breach.notified_at = now
            breach.status = "notified"
            db.commit()
            
            return {
                "status": "success",
                "message": f"72h notification sent for breach {breach_id}",
                "breach_id": breach_id,
                "notified_at": now.isoformat()
            }
            
    except Exception as exc:
        logger.error(f"Error sending 72h breach reminder: {exc}")
        raise self.retry(exc=exc, countdown=60, max_retries=3)

@celery_app.task(bind=True, name="breach.check_pending_breaches")
def check_pending_breaches(self):
    """
    Check for breaches that need 72h notifications
    """
    try:
        with get_db_session() as db:
            # Find breaches that need notification
            cutoff_time = datetime.utcnow() - timedelta(hours=72)
            
            pending_breaches = db.query(Breach).filter(
                Breach.status == "pending",
                Breach.discovered_at <= cutoff_time,
                Breach.notified_at.is_(None)
            ).all()
            
            logger.info(f"Found {len(pending_breaches)} breaches needing notification")
            
            # Schedule notifications
            for breach in pending_breaches:
                send_72h_breach_reminder.delay(breach.id)
            
            return {
                "status": "success",
                "message": f"Scheduled notifications for {len(pending_breaches)} breaches",
                "count": len(pending_breaches)
            }
            
    except Exception as exc:
        logger.error(f"Error checking pending breaches: {exc}")
        raise self.retry(exc=exc, countdown=300, max_retries=3)

@celery_app.task(bind=True, name="breach.escalate_overdue_breaches")
def escalate_overdue_breaches(self):
    """
    Escalate breaches that are overdue for notification
    """
    try:
        with get_db_session() as db:
            # Find overdue breaches
            cutoff_time = datetime.utcnow() - timedelta(hours=72)
            
            overdue_breaches = db.query(Breach).filter(
                Breach.status == "pending",
                Breach.discovered_at <= cutoff_time,
                Breach.notified_at.is_(None)
            ).all()
            
            logger.warning(f"Found {len(overdue_breaches)} overdue breaches")
            
            # Escalate to DPO/Admin
            for breach in overdue_breaches:
                breach.status = "overdue"
                breach.escalated_at = datetime.utcnow()
                
                # TODO: Send escalation email to DPO
                logger.warning(f"Escalating overdue breach {breach.id}")
            
            db.commit()
            
            return {
                "status": "success",
                "message": f"Escalated {len(overdue_breaches)} overdue breaches",
                "count": len(overdue_breaches)
            }
            
    except Exception as exc:
        logger.error(f"Error escalating overdue breaches: {exc}")
        raise self.retry(exc=exc, countdown=300, max_retries=3)

@celery_app.task(bind=True, name="breach.generate_breach_report")
def generate_breach_report(self, breach_id: int, report_type: str = "regulator"):
    """
    Generate breach report for regulatory submission
    """
    try:
        with get_db_session() as db:
            breach = db.query(Breach).filter(Breach.id == breach_id).first()
            if not breach:
                logger.error(f"Breach {breach_id} not found")
                return {"status": "error", "message": "Breach not found"}
            
            # Generate report content (placeholder)
            report_data = {
                "breach_id": breach.id,
                "organization": breach.organization.name if breach.organization else "Unknown",
                "discovered_at": breach.discovered_at.isoformat() if breach.discovered_at else None,
                "description": breach.description,
                "affected_records": breach.affected_records,
                "severity": breach.severity,
                "status": breach.status,
                "report_type": report_type,
                "generated_at": datetime.utcnow().isoformat()
            }
            
            logger.info(f"Generated {report_type} report for breach {breach_id}")
            
            return {
                "status": "success",
                "message": f"Generated {report_type} report for breach {breach_id}",
                "report_data": report_data
            }
            
    except Exception as exc:
        logger.error(f"Error generating breach report: {exc}")
        raise self.retry(exc=exc, countdown=60, max_retries=3)
