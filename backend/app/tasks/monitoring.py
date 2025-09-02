from celery import shared_task
from datetime import datetime, timedelta
from ..database import get_session
from ..models import DataBreachReport, EmailNotification
from ..tasks.email import queue_email_notification

@shared_task
def check_breach_sla_deadlines():
    """Check for breaches approaching or past 72h deadline"""
    
    with get_session() as session:
        # Find breaches that are reportable but not yet reported
        overdue_breaches = session.query(DataBreachReport).filter(
            DataBreachReport.reportable == True,
            DataBreachReport.authority_notified_at.is_(None),
            DataBreachReport.sla_deadline < datetime.utcnow()
        ).all()
        
        # Find breaches approaching deadline (within 24h)
        approaching_breaches = session.query(DataBreachReport).filter(
            DataBreachReport.reportable == True,
            DataBreachReport.authority_notified_at.is_(None),
            DataBreachReport.sla_deadline >= datetime.utcnow(),
            DataBreachReport.sla_deadline <= datetime.utcnow() + timedelta(hours=24)
        ).all()
        
        # Send alerts for overdue breaches
        for breach in overdue_breaches:
            queue_email_notification(
                user_id=breach.user_id,
                email_type="breach_sla_overdue",
                recipient_email="dpo@company.com",  # TODO: Get from config
                subject=f"URGENT: Breach {breach.id} Past 72h Deadline",
                content=f"Breach {breach.id} is {datetime.utcnow() - breach.sla_deadline} past the 72h reporting deadline!"
            )
        
        # Send warnings for approaching breaches
        for breach in approaching_breaches:
            hours_remaining = (breach.sla_deadline - datetime.utcnow()).total_seconds() / 3600
            queue_email_notification(
                user_id=breach.user_id,
                email_type="breach_sla_warning",
                recipient_email="dpo@company.com",  # TODO: Get from config
                subject=f"WARNING: Breach {breach.id} Approaching 72h Deadline",
                content=f"Breach {breach.id} deadline in {hours_remaining:.1f} hours"
            )
    
    return {
        "overdue_count": len(overdue_breaches),
        "approaching_count": len(approaching_breaches)
    }

@shared_task
def check_dsar_sla_deadlines():
    """Check for DSAR requests approaching deadlines (7/14/28 days)"""
    
    with get_session() as session:
        from ..models import DSARRequest
        
        # DSAR deadlines: 7 days for access, 14 days for rectification, 28 days for erasure
        now = datetime.utcnow()
        
        # Access requests (7 days)
        overdue_access = session.query(DSARRequest).filter(
            DSARRequest.request_type == "access",
            DSARRequest.status.in_(["pending", "processing"]),
            DSARRequest.created_at < now - timedelta(days=7)
        ).all()
        
        # Rectification requests (14 days)
        overdue_rectification = session.query(DSARRequest).filter(
            DSARRequest.request_type == "rectification",
            DSARRequest.status.in_(["pending", "processing"]),
            DSARRequest.created_at < now - timedelta(days=14)
        ).all()
        
        # Erasure requests (28 days)
        overdue_erasure = session.query(DSARRequest).filter(
            DSARRequest.request_type == "erasure",
            DSARRequest.status.in_(["pending", "processing"]),
            DSARRequest.created_at < now - timedelta(days=28)
        ).all()
        
        # Send notifications
        for request in overdue_access + overdue_rectification + overdue_erasure:
            queue_email_notification(
                user_id=request.user_id,
                email_type="dsar_sla_overdue",
                recipient_email="dpo@company.com",  # TODO: Get from config
                subject=f"DSAR Request {request.id} Past Deadline",
                content=f"DSAR request {request.id} ({request.request_type}) is overdue"
            )
    
    return {
        "overdue_access": len(overdue_access),
        "overdue_rectification": len(overdue_rectification),
        "overdue_erasure": len(overdue_erasure)
    }

@shared_task
def cleanup_old_data():
    """Clean up old data according to retention policies"""
    
    with get_session() as session:
        # Delete old email notifications (90 days)
        cutoff_date = datetime.utcnow() - timedelta(days=90)
        deleted_emails = session.query(EmailNotification).filter(
            EmailNotification.created_at < cutoff_date,
            EmailNotification.status.in_(["sent", "failed"])
        ).delete()
        
        # Archive old audit logs (1 year)
        audit_cutoff = datetime.utcnow() - timedelta(days=365)
        from ..models import AuditLog
        old_audit_logs = session.query(AuditLog).filter(
            AuditLog.created_at < audit_cutoff
        ).all()
        
        # TODO: Move to archive storage instead of deletion
        for log in old_audit_logs:
            # Archive logic here
            pass
    
    return {
        "deleted_emails": deleted_emails,
        "archived_audit_logs": len(old_audit_logs)
    }
