"""
Celery tasks for Export Bundle Management
"""
from celery import current_task
from datetime import datetime, timedelta
from typing import Dict, Any, Optional
import logging
import json
import zipfile
import io
import os

from app.core.celery_app import celery_app
from app.core.database import get_db_session
from app.models import ExportBundle, Organization, User, ConsentEvent, Breach, DPIA, ROPA
from app.core.config import settings

logger = logging.getLogger(__name__)

@celery_app.task(bind=True, name="export.process_export_bundle")
def process_export_bundle(self, bundle_id: int):
    """
    Process export bundle generation
    """
    try:
        with get_db_session() as db:
            bundle = db.query(ExportBundle).filter(ExportBundle.id == bundle_id).first()
            if not bundle:
                logger.error(f"Export bundle {bundle_id} not found")
                return {"status": "error", "message": "Bundle not found"}
            
            # Update status to processing
            bundle.status = "processing"
            db.commit()
            
            # Generate export data based on bundle type
            export_data = {}
            
            if bundle.bundle_type == "regulator_audit":
                export_data = generate_regulator_audit_data(db, bundle)
            elif bundle.bundle_type == "compliance_report":
                export_data = generate_compliance_report_data(db, bundle)
            elif bundle.bundle_type == "data_inventory":
                export_data = generate_data_inventory_data(db, bundle)
            
            # Create ZIP file
            zip_buffer = create_export_zip(export_data, bundle)
            
            # Save file (placeholder - would save to S3/R2)
            file_path = f"/exports/{bundle.region}_{bundle.bundle_type}_{bundle.id}.zip"
            bundle.file_path = file_path
            bundle.file_size = len(zip_buffer.getvalue())
            bundle.status = "completed"
            bundle.completed_at = datetime.utcnow()
            
            # Generate download token
            bundle.download_token = f"token_{bundle.id}_{datetime.utcnow().timestamp()}"
            bundle.expires_at = datetime.utcnow() + timedelta(days=7)
            
            db.commit()
            
            logger.info(f"Successfully processed export bundle {bundle_id}")
            
            return {
                "status": "success",
                "message": f"Export bundle {bundle_id} processed successfully",
                "bundle_id": bundle_id,
                "file_path": file_path,
                "file_size": bundle.file_size
            }
            
    except Exception as exc:
        logger.error(f"Error processing export bundle: {exc}")
        # Update bundle status to failed
        try:
            with get_db_session() as db:
                bundle = db.query(ExportBundle).filter(ExportBundle.id == bundle_id).first()
                if bundle:
                    bundle.status = "failed"
                    db.commit()
        except:
            pass
        raise self.retry(exc=exc, countdown=60, max_retries=3)

def generate_regulator_audit_data(db, bundle: ExportBundle) -> Dict[str, Any]:
    """Generate regulator audit data"""
    org_id = bundle.organization_id
    
    # Collect all compliance data
    consent_events = db.query(ConsentEvent).filter(ConsentEvent.organization_id == org_id).all()
    breaches = db.query(Breach).filter(Breach.organization_id == org_id).all()
    dpia_records = db.query(DPIA).filter(DPIA.organization_id == org_id).all()
    ropa_records = db.query(ROPA).filter(ROPA.organization_id == org_id).all()
    
    return {
        "audit_info": {
            "region": bundle.region,
            "organization_id": org_id,
            "generated_at": datetime.utcnow().isoformat(),
            "bundle_id": bundle.id
        },
        "consent_events": [
            {
                "id": ce.id,
                "subject_id": ce.subject_id,
                "purpose": ce.purpose,
                "status": ce.status,
                "occurred_at": ce.occurred_at.isoformat() if ce.occurred_at else None,
                "source": ce.source
            } for ce in consent_events
        ],
        "breaches": [
            {
                "id": b.id,
                "description": b.description,
                "discovered_at": b.discovered_at.isoformat() if b.discovered_at else None,
                "severity": b.severity,
                "status": b.status,
                "affected_records": b.affected_records
            } for b in breaches
        ],
        "dpia_records": [
            {
                "id": d.id,
                "title": d.title,
                "status": d.status,
                "risk_level": d.risk_level,
                "created_at": d.created_at.isoformat() if d.created_at else None
            } for d in dpia_records
        ],
        "ropa_records": [
            {
                "id": r.id,
                "activity_name": r.activity_name,
                "purpose": r.purpose,
                "legal_basis": r.legal_basis,
                "status": r.status
            } for r in ropa_records
        ]
    }

def generate_compliance_report_data(db, bundle: ExportBundle) -> Dict[str, Any]:
    """Generate compliance status report"""
    org_id = bundle.organization_id
    
    # Calculate compliance metrics
    total_consents = db.query(ConsentEvent).filter(ConsentEvent.organization_id == org_id).count()
    active_consents = db.query(ConsentEvent).filter(
        ConsentEvent.organization_id == org_id,
        ConsentEvent.status == "granted"
    ).count()
    
    total_breaches = db.query(Breach).filter(Breach.organization_id == org_id).count()
    resolved_breaches = db.query(Breach).filter(
        Breach.organization_id == org_id,
        Breach.status == "resolved"
    ).count()
    
    return {
        "compliance_summary": {
            "region": bundle.region,
            "organization_id": org_id,
            "generated_at": datetime.utcnow().isoformat(),
            "consent_rate": (active_consents / total_consents * 100) if total_consents > 0 else 0,
            "breach_resolution_rate": (resolved_breaches / total_breaches * 100) if total_breaches > 0 else 0,
            "total_consents": total_consents,
            "total_breaches": total_breaches
        },
        "recommendations": [
            "Implement automated consent management",
            "Set up breach notification alerts",
            "Conduct regular DPIA assessments",
            "Maintain up-to-date ROPA records"
        ]
    }

def generate_data_inventory_data(db, bundle: ExportBundle) -> Dict[str, Any]:
    """Generate data inventory report"""
    org_id = bundle.organization_id
    
    # Collect data processing activities
    ropa_records = db.query(ROPA).filter(ROPA.organization_id == org_id).all()
    
    return {
        "data_inventory": {
            "region": bundle.region,
            "organization_id": org_id,
            "generated_at": datetime.utcnow().isoformat(),
            "processing_activities": [
                {
                    "id": r.id,
                    "activity_name": r.activity_name,
                    "purpose": r.purpose,
                    "data_categories": r.data_categories,
                    "legal_basis": r.legal_basis,
                    "retention_period": r.retention_period
                } for r in ropa_records
            ]
        }
    }

def create_export_zip(export_data: Dict[str, Any], bundle: ExportBundle) -> io.BytesIO:
    """Create ZIP file from export data"""
    zip_buffer = io.BytesIO()
    
    with zipfile.ZipFile(zip_buffer, 'w', zipfile.ZIP_DEFLATED) as zip_file:
        # Add main data file
        zip_file.writestr(
            f"{bundle.region}_{bundle.bundle_type}_data.json",
            json.dumps(export_data, indent=2, default=str)
        )
        
        # Add metadata file
        metadata = {
            "bundle_id": bundle.id,
            "bundle_type": bundle.bundle_type,
            "region": bundle.region,
            "title": bundle.title,
            "generated_at": datetime.utcnow().isoformat(),
            "version": "1.0"
        }
        zip_file.writestr("metadata.json", json.dumps(metadata, indent=2))
        
        # Add README
        readme_content = f"""
# {bundle.title}

This export bundle contains compliance data for {bundle.region} region.

## Contents
- {bundle.region}_{bundle.bundle_type}_data.json: Main compliance data
- metadata.json: Bundle metadata
- README.txt: This file

## Generated
Generated on: {datetime.utcnow().isoformat()}
Bundle ID: {bundle.id}
Region: {bundle.region}
Type: {bundle.bundle_type}
"""
        zip_file.writestr("README.txt", readme_content)
    
    zip_buffer.seek(0)
    return zip_buffer

@celery_app.task(bind=True, name="export.cleanup_expired_bundles")
def cleanup_expired_bundles(self):
    """
    Clean up expired export bundles
    """
    try:
        with get_db_session() as db:
            # Find expired bundles
            expired_bundles = db.query(ExportBundle).filter(
                ExportBundle.expires_at < datetime.utcnow(),
                ExportBundle.status == "completed"
            ).all()
            
            logger.info(f"Found {len(expired_bundles)} expired bundles to cleanup")
            
            # Delete expired bundles
            for bundle in expired_bundles:
                # TODO: Delete actual files from storage
                db.delete(bundle)
            
            db.commit()
            
            return {
                "status": "success",
                "message": f"Cleaned up {len(expired_bundles)} expired bundles",
                "count": len(expired_bundles)
            }
            
    except Exception as exc:
        logger.error(f"Error cleaning up expired bundles: {exc}")
        raise self.retry(exc=exc, countdown=300, max_retries=3)
