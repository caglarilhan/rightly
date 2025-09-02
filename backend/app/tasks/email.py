from celery import shared_task
from datetime import datetime, timedelta
import uuid
import json
from typing import Optional
from ..database import get_session
from ..models import EmailNotification, EmailSuppression

class TransientError(Exception):
    """Temporary error that should be retried"""
    pass

class PermanentError(Exception):
    """Permanent error that should not be retried"""
    pass

def is_suppressed(email: str) -> bool:
    """Check if email is in suppression list"""
    with get_session() as session:
        suppression = session.query(EmailSuppression).filter(
            EmailSuppression.email == email,
            (EmailSuppression.expires_at.is_(None) | (EmailSuppression.expires_at > datetime.utcnow()))
        ).first()
        return suppression is not None

def acquire_idempotency(key: str) -> bool:
    """Try to acquire idempotency lock"""
    # In production, use Redis for distributed locking
    # For now, simple database check
    with get_session() as session:
        existing = session.query(EmailNotification).filter(
            EmailNotification.idempotency_key == key,
            EmailNotification.status.in_(["sent", "failed"])
        ).first()
        return existing is None

def mark_sent(outbox_id: int, sent_at: datetime):
    """Mark email as sent"""
    with get_session() as session:
        notification = session.query(EmailNotification).filter(
            EmailNotification.id == outbox_id
        ).first()
        if notification:
            notification.status = "sent"
            notification.sent_at = sent_at
            session.commit()

def mark_failed(outbox_id: int, error: str):
    """Mark email as failed"""
    with get_session() as session:
        notification = session.query(EmailNotification).filter(
            EmailNotification.id == outbox_id
        ).first()
        if notification:
            notification.status = "failed"
            notification.last_error = error
            session.commit()

def send_via_provider(to: str, subject: str, template: str, payload: dict) -> bool:
    """Send email via configured provider (Postmark/SendGrid)"""
    # TODO: Implement actual email provider integration
    # For now, simulate success
    print(f"📧 Sending email to {to}: {subject}")
    return True

@shared_task(bind=True, max_retries=5, default_retry_delay=15)
def send_email_task(self, outbox_id: int):
    """Production-grade email sending task with idempotency and retry"""
    
    # 1) Load notification
    with get_session() as session:
        notification = session.query(EmailNotification).filter(
            EmailNotification.id == outbox_id
        ).first()
        
        if not notification:
            return "notification_not_found"
    
    # 2) Check suppression
    if is_suppressed(notification.recipient_email):
        return mark_failed(outbox_id, "email_suppressed")
    
    # 3) Check idempotency
    if notification.idempotency_key and not acquire_idempotency(notification.idempotency_key):
        return "duplicate_send"
    
    # 4) Send email
    try:
        payload = {
            "type": notification.type,
            "template_version": notification.template_version,
            "language": notification.language,
            "content": notification.content
        }
        
        success = send_via_provider(
            to=notification.recipient_email,
            subject=notification.subject,
            template=notification.type,
            payload=payload
        )
        
        if success:
            return mark_sent(outbox_id, datetime.utcnow())
        else:
            raise TransientError("Provider returned failure")
            
    except TransientError as e:
        # Exponential backoff: 15s, 30s, 60s, 120s, 240s
        countdown = min(15 * (2 ** self.request.retries), 3600)
        raise self.retry(exc=e, countdown=countdown)
        
    except PermanentError as e:
        return mark_failed(outbox_id, str(e))
        
    except Exception as e:
        # Unknown error - treat as transient
        countdown = min(15 * (2 ** self.request.retries), 3600)
        raise self.retry(exc=TransientError(str(e)), countdown=countdown)

def queue_email_notification(
    user_id: int,
    email_type: str,
    recipient_email: str,
    subject: str,
    content: str,
    language: str = "en"
) -> str:
    """Queue an email notification with idempotency"""
    
    idempotency_key = f"{user_id}_{email_type}_{recipient_email}_{datetime.utcnow().strftime('%Y%m%d')}"
    
    with get_session() as session:
        notification = EmailNotification(
            user_id=user_id,
            type=email_type,
            recipient_email=recipient_email,
            subject=subject,
            content=content,
            language=language,
            idempotency_key=idempotency_key
        )
        session.add(notification)
        session.commit()
        
        # Queue the task
        send_email_task.delay(notification.id)
        
        return idempotency_key
