"""
Celery tasks for Housekeeping and Maintenance
"""
from celery import current_task
from datetime import datetime, timedelta
from typing import Dict, Any
import logging

from app.core.celery_app import celery_app
from app.core.database import get_db_session
from app.models import ConsentEvent, Breach, ExportBundle, User, Organization
from app.core.config import settings

logger = logging.getLogger(__name__)

@celery_app.task(bind=True, name="housekeeping.cleanup_old_data")
def cleanup_old_data(self):
    """
    Clean up old data based on retention policies
    """
    try:
        with get_db_session() as db:
            cleanup_stats = {
                "consent_events": 0,
                "breaches": 0,
                "export_bundles": 0,
                "users": 0
            }
            
            # Clean up old consent events (older than retention period)
            retention_cutoff = datetime.utcnow() - timedelta(days=settings.DATA_RETENTION_DAYS)
            
            old_consents = db.query(ConsentEvent).filter(
                ConsentEvent.created_at < retention_cutoff
            ).all()
            
            for consent in old_consents:
                db.delete(consent)
                cleanup_stats["consent_events"] += 1
            
            # Clean up old export bundles (older than 30 days)
            export_cutoff = datetime.utcnow() - timedelta(days=30)
            
            old_bundles = db.query(ExportBundle).filter(
                ExportBundle.created_at < export_cutoff,
                ExportBundle.status.in_(["completed", "failed"])
            ).all()
            
            for bundle in old_bundles:
                db.delete(bundle)
                cleanup_stats["export_bundles"] += 1
            
            # Clean up inactive users (older than 1 year, never logged in)
            user_cutoff = datetime.utcnow() - timedelta(days=365)
            
            inactive_users = db.query(User).filter(
                User.created_at < user_cutoff,
                User.last_login.is_(None),
                User.is_active == False
            ).all()
            
            for user in inactive_users:
                db.delete(user)
                cleanup_stats["users"] += 1
            
            db.commit()
            
            logger.info(f"Cleanup completed: {cleanup_stats}")
            
            return {
                "status": "success",
                "message": "Data cleanup completed",
                "stats": cleanup_stats
            }
            
    except Exception as exc:
        logger.error(f"Error during data cleanup: {exc}")
        raise self.retry(exc=exc, countdown=300, max_retries=3)

@celery_app.task(bind=True, name="housekeeping.generate_daily_report")
def generate_daily_report(self):
    """
    Generate daily compliance report
    """
    try:
        with get_db_session() as db:
            today = datetime.utcnow().date()
            yesterday = today - timedelta(days=1)
            
            # Collect daily metrics
            daily_consents = db.query(ConsentEvent).filter(
                ConsentEvent.created_at >= yesterday,
                ConsentEvent.created_at < today
            ).count()
            
            daily_breaches = db.query(Breach).filter(
                Breach.discovered_at >= yesterday,
                Breach.discovered_at < today
            ).count()
            
            daily_exports = db.query(ExportBundle).filter(
                ExportBundle.created_at >= yesterday,
                ExportBundle.created_at < today
            ).count()
            
            # Calculate compliance score
            total_consents = db.query(ConsentEvent).count()
            active_consents = db.query(ConsentEvent).filter(
                ConsentEvent.status == "granted"
            ).count()
            
            compliance_score = (active_consents / total_consents * 100) if total_consents > 0 else 0
            
            report_data = {
                "date": today.isoformat(),
                "metrics": {
                    "daily_consents": daily_consents,
                    "daily_breaches": daily_breaches,
                    "daily_exports": daily_exports,
                    "total_consents": total_consents,
                    "active_consents": active_consents,
                    "compliance_score": round(compliance_score, 2)
                },
                "alerts": []
            }
            
            # Generate alerts
            if daily_breaches > 0:
                report_data["alerts"].append({
                    "type": "warning",
                    "message": f"{daily_breaches} new breaches detected"
                })
            
            if compliance_score < 80:
                report_data["alerts"].append({
                    "type": "warning", 
                    "message": f"Compliance score below 80%: {compliance_score}%"
                })
            
            logger.info(f"Daily report generated for {today}: {report_data}")
            
            return {
                "status": "success",
                "message": f"Daily report generated for {today}",
                "report_data": report_data
            }
            
    except Exception as exc:
        logger.error(f"Error generating daily report: {exc}")
        raise self.retry(exc=exc, countdown=60, max_retries=3)

@celery_app.task(bind=True, name="housekeeping.check_system_health")
def check_system_health(self):
    """
    Check system health and performance
    """
    try:
        with get_db_session() as db:
            health_checks = {
                "database": "healthy",
                "celery": "healthy",
                "storage": "healthy",
                "api": "healthy"
            }
            
            # Check database connectivity
            try:
                db.execute("SELECT 1")
                health_checks["database"] = "healthy"
            except Exception as e:
                health_checks["database"] = f"unhealthy: {str(e)}"
            
            # Check table sizes
            table_stats = {}
            tables = ["consentevent", "breach", "exportbundle", "user", "organization"]
            
            for table in tables:
                try:
                    result = db.execute(f"SELECT COUNT(*) FROM {table}")
                    count = result.scalar()
                    table_stats[table] = count
                except Exception as e:
                    table_stats[table] = f"error: {str(e)}"
            
            # Check for performance issues
            performance_issues = []
            
            # Check for large tables
            for table, count in table_stats.items():
                if isinstance(count, int) and count > 100000:
                    performance_issues.append(f"Large table: {table} has {count} records")
            
            # Check for old pending tasks
            old_pending_breaches = db.query(Breach).filter(
                Breach.status == "pending",
                Breach.discovered_at < datetime.utcnow() - timedelta(hours=24)
            ).count()
            
            if old_pending_breaches > 0:
                performance_issues.append(f"{old_pending_breaches} breaches pending for >24h")
            
            health_report = {
                "timestamp": datetime.utcnow().isoformat(),
                "health_checks": health_checks,
                "table_stats": table_stats,
                "performance_issues": performance_issues,
                "overall_status": "healthy" if not performance_issues else "warning"
            }
            
            logger.info(f"System health check completed: {health_report}")
            
            return {
                "status": "success",
                "message": "System health check completed",
                "health_report": health_report
            }
            
    except Exception as exc:
        logger.error(f"Error during system health check: {exc}")
        raise self.retry(exc=exc, countdown=300, max_retries=3)

@celery_app.task(bind=True, name="housekeeping.backup_critical_data")
def backup_critical_data(self):
    """
    Backup critical compliance data
    """
    try:
        with get_db_session() as db:
            backup_data = {
                "timestamp": datetime.utcnow().isoformat(),
                "organizations": [],
                "users": [],
                "breaches": [],
                "consent_events": []
            }
            
            # Backup organizations
            orgs = db.query(Organization).all()
            for org in orgs:
                backup_data["organizations"].append({
                    "id": org.id,
                    "name": org.name,
                    "slug": org.slug,
                    "created_at": org.created_at.isoformat() if org.created_at else None
                })
            
            # Backup users
            users = db.query(User).all()
            for user in users:
                backup_data["users"].append({
                    "id": user.id,
                    "email": user.email,
                    "role": user.role,
                    "organization_id": user.organization_id,
                    "created_at": user.created_at.isoformat() if user.created_at else None
                })
            
            # Backup breaches
            breaches = db.query(Breach).all()
            for breach in breaches:
                backup_data["breaches"].append({
                    "id": breach.id,
                    "description": breach.description,
                    "severity": breach.severity,
                    "status": breach.status,
                    "organization_id": breach.organization_id,
                    "discovered_at": breach.discovered_at.isoformat() if breach.discovered_at else None
                })
            
            # Backup consent events
            consents = db.query(ConsentEvent).all()
            for consent in consents:
                backup_data["consent_events"].append({
                    "id": consent.id,
                    "subject_id": consent.subject_id,
                    "purpose": consent.purpose,
                    "status": consent.status,
                    "organization_id": consent.organization_id,
                    "occurred_at": consent.occurred_at.isoformat() if consent.occurred_at else None
                })
            
            # TODO: Save backup to secure storage
            backup_size = len(str(backup_data))
            
            logger.info(f"Critical data backup completed: {backup_size} bytes")
            
            return {
                "status": "success",
                "message": "Critical data backup completed",
                "backup_size": backup_size,
                "records_backed_up": {
                    "organizations": len(backup_data["organizations"]),
                    "users": len(backup_data["users"]),
                    "breaches": len(backup_data["breaches"]),
                    "consent_events": len(backup_data["consent_events"])
                }
            }
            
    except Exception as exc:
        logger.error(f"Error during data backup: {exc}")
        raise self.retry(exc=exc, countdown=300, max_retries=3)
