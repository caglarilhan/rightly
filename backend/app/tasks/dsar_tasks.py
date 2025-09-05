from celery import current_task
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from datetime import datetime, timedelta
import logging
import json

from app.core.database import AsyncSessionLocal
from app.models import DSARRequest, RequestStatus
from app.services.export_service import ExportService
from app.services.email_service import EmailService
from app.core.logging import log_gdpr_event
from app.celery_app import celery_app

logger = logging.getLogger(__name__)

@celery_app.task
def process_dsar_request(request_id: int):
    """DSAR talebini işle"""
    try:
        logger.info(f"Processing DSAR request {request_id}")
        
        # Mock data collection (gerçek implementasyonda veri kaynaklarından çekilir)
        mock_data = {
            "customer_info": {
                "email": "customer@example.com",
                "name": "John Doe",
                "phone": "+1234567890",
                "address": "123 Main St, City, Country"
            },
            "orders": [
                {
                    "id": "ORD-001",
                    "date": "2023-01-15",
                    "total": 99.99,
                    "status": "completed"
                },
                {
                    "id": "ORD-002", 
                    "date": "2023-02-20",
                    "total": 149.99,
                    "status": "completed"
                }
            ],
            "preferences": {
                "newsletter": True,
                "marketing": False,
                "language": "en"
            }
        }
        
        # Export bundle oluştur
        export_service = ExportService()
        export_bundle = export_service.create_export_bundle(request_id, mock_data)
        
        # Status güncelle
        update_request_status(request_id, RequestStatus.COMPLETED)
        
        # Audit log
        log_gdpr_event(
            event_type="request_completed",
            subject_email="customer@example.com",
            request_id=str(request_id),
            details={"export_bundle_id": export_bundle.id}
        )
        
        logger.info(f"DSAR request {request_id} processed successfully")
        return {"status": "success", "request_id": request_id}
        
    except Exception as e:
        logger.error(f"Error processing DSAR request {request_id}: {e}")
        update_request_status(request_id, RequestStatus.REJECTED)
        return {"status": "error", "error": str(e)}

@celery_app.task
def send_dsar_notifications():
    """DSAR bildirimlerini gönder"""
    try:
        logger.info("Sending DSAR notifications")
        
        email_service = EmailService()
        export_service = ExportService()
        
        # Yeni talepler için onay e-postaları
        new_requests = get_requests_by_status(RequestStatus.NEW)
        for request in new_requests:
            email_service.send_dsar_confirmation(request)
            email_service.send_admin_notification(request)
        
        # Tamamlanan talepler için bildirimler
        completed_requests = get_requests_by_status(RequestStatus.COMPLETED)
        for request in completed_requests:
            # Download URL oluştur
            export_bundle = get_latest_export_bundle(request.id)
            if export_bundle:
                download_url = export_service.get_export_download_url(export_bundle)
                email_service.send_dsar_completion(request, download_url)
        
        # Yaklaşan deadline'lar için hatırlatmalar
        upcoming_deadlines = get_upcoming_deadlines()
        for request in upcoming_deadlines:
            email_service.send_dsar_reminder(request)
        
        logger.info(f"Sent notifications for {len(new_requests)} new, {len(completed_requests)} completed requests")
        return {"status": "success", "notifications_sent": len(new_requests) + len(completed_requests)}
        
    except Exception as e:
        logger.error(f"Error sending DSAR notifications: {e}")
        return {"status": "error", "error": str(e)}

@celery_app.task
def cleanup_expired_requests():
    """Süresi dolmuş talepleri temizle"""
    try:
        logger.info("Cleaning up expired requests")
        
        # 30 günden eski tamamlanmış talepleri bul
        cutoff_date = datetime.utcnow() - timedelta(days=30)
        expired_requests = get_expired_requests(cutoff_date)
        
        for request in expired_requests:
            # Export bundle'ları sil
            delete_export_bundles(request.id)
            
            # Status güncelle
            update_request_status(request.id, RequestStatus.EXPIRED)
            
            # Audit log
            log_gdpr_event(
                event_type="request_expired",
                subject_email=request.subject_email,
                request_id=str(request.id)
            )
        
        logger.info(f"Cleaned up {len(expired_requests)} expired requests")
        return {"status": "success", "cleaned_up": len(expired_requests)}
        
    except Exception as e:
        logger.error(f"Error cleaning up expired requests: {e}")
        return {"status": "error", "error": str(e)}

# Helper functions
async def get_requests_by_status(status: RequestStatus):
    """Status'a göre talepleri getir"""
    async with AsyncSessionLocal() as session:
        query = select(Request).where(Request.status == status)
        result = await session.execute(query)
        return result.scalars().all()

async def get_upcoming_deadlines():
    """Yaklaşan deadline'ları getir"""
    async with AsyncSessionLocal() as session:
        # 7 gün içinde deadline'ı olan talepler
        deadline = datetime.utcnow() + timedelta(days=7)
        query = select(Request).where(
            Request.due_date <= deadline,
            Request.status.in_([RequestStatus.NEW, RequestStatus.VERIFYING, RequestStatus.DISCOVERING])
        )
        result = await session.execute(query)
        return result.scalars().all()

async def get_expired_requests(cutoff_date: datetime):
    """Süresi dolmuş talepleri getir"""
    async with AsyncSessionLocal() as session:
        query = select(Request).where(
            Request.created_at <= cutoff_date,
            Request.status == RequestStatus.COMPLETED
        )
        result = await session.execute(query)
        return result.scalars().all()

async def update_request_status(request_id: int, status: RequestStatus):
    """Talep durumunu güncelle"""
    async with AsyncSessionLocal() as session:
        query = select(Request).where(Request.id == request_id)
        result = await session.execute(query)
        request = result.scalar_one_or_none()
        
        if request:
            request.status = status
            await session.commit()

async def get_latest_export_bundle(request_id: int):
    """En son export bundle'ı getir"""
    async with AsyncSessionLocal() as session:
        query = select(ExportBundle).where(ExportBundle.request_id == request_id).order_by(ExportBundle.created_at.desc())
        result = await session.execute(query)
        return result.scalar_one_or_none()

async def delete_export_bundles(request_id: int):
    """Export bundle'ları sil"""
    async with AsyncSessionLocal() as session:
        query = select(ExportBundle).where(ExportBundle.request_id == request_id)
        result = await session.execute(query)
        bundles = result.scalars().all()
        
        for bundle in bundles:
            await session.delete(bundle)
        
        await session.commit()
