from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session
from sqlmodel import SQLModel, select
from typing import List, Optional
from datetime import datetime, timedelta
import uuid
import json

from app.core.database import get_db
from app.deps import get_optional_current_user
from app.models import ExportBundle, User, Organization, Breach, ConsentEvent, DPIA, ROPA
from app.tasks.export_tasks import process_export_bundle

router = APIRouter(prefix="/exports", tags=["exports"])

# Response models
class ExportBundleResponse(SQLModel):
    id: int
    organization_id: int
    bundle_type: str
    region: str
    title: str
    description: Optional[str] = None
    status: str
    file_path: Optional[str] = None
    file_size: Optional[int] = None
    download_token: Optional[str] = None
    expires_at: Optional[datetime] = None
    created_by: Optional[int] = None
    created_at: datetime
    updated_at: datetime
    completed_at: Optional[datetime] = None

class ExportBundleCreate(SQLModel):
    bundle_type: str
    region: str
    title: str
    description: Optional[str] = None

class ExportBundleListResponse(SQLModel):
    bundles: List[ExportBundleResponse]
    total: int
    limit: int
    offset: int

@router.get("/bundles", response_model=List[ExportBundleResponse])
async def list_export_bundles(
    current_user: Optional[User] = Depends(get_optional_current_user),
    db: Session = Depends(get_db)
):
    """List export bundles"""
    # For development, use default organization if no user
    organization_id = 1
    if current_user and current_user.organization_id:
        organization_id = current_user.organization_id
    
    bundles = db.execute(
        select(ExportBundle).where(ExportBundle.organization_id == organization_id)
    ).scalars().all()
    
    return bundles

@router.post("/bundles", response_model=ExportBundleResponse)
async def create_export_bundle(
    bundle_data: ExportBundleCreate,
    background_tasks: BackgroundTasks,
    current_user: Optional[User] = Depends(get_optional_current_user),
    db: Session = Depends(get_db)
):
    """Create a new export bundle"""
    # For development, use default organization if no user
    organization_id = 1
    if current_user and current_user.organization_id:
        organization_id = current_user.organization_id
    
    # Create export bundle
    export_bundle = ExportBundle(
        organization_id=organization_id,
        bundle_type=bundle_data.bundle_type,
        region=bundle_data.region,
        title=bundle_data.title,
        description=bundle_data.description,
        status="pending",
        created_by=current_user.id if current_user else None
    )
    
    db.add(export_bundle)
    db.commit()
    db.refresh(export_bundle)
    
    # Start background task to generate bundle
    task = process_export_bundle.delay(export_bundle.id)
    
    return export_bundle

@router.get("/bundles/{bundle_id}", response_model=ExportBundleResponse)
async def get_export_bundle(
    bundle_id: int,
    current_user: Optional[User] = Depends(get_optional_current_user),
    db: Session = Depends(get_db)
):
    """Get export bundle by ID"""
    query = db.query(ExportBundle).filter(ExportBundle.id == bundle_id)
    
    # Filter by organization if user is authenticated
    if current_user and current_user.organization_id:
        query = query.filter(ExportBundle.organization_id == current_user.organization_id)
    
    bundle = query.first()
    if not bundle:
        raise HTTPException(status_code=404, detail="Export bundle not found")
    
    return ExportBundleResponse.from_orm(bundle)

@router.get("/bundles/{bundle_id}/download")
async def download_export_bundle(
    bundle_id: int,
    token: str,
    current_user: Optional[User] = Depends(get_optional_current_user),
    db: Session = Depends(get_db)
):
    """Download export bundle file"""
    query = db.query(ExportBundle).filter(ExportBundle.id == bundle_id)
    
    # Filter by organization if user is authenticated
    if current_user and current_user.organization_id:
        query = query.filter(ExportBundle.organization_id == current_user.organization_id)
    
    bundle = query.first()
    if not bundle:
        raise HTTPException(status_code=404, detail="Export bundle not found")
    
    # Check token and expiration
    if bundle.download_token != token:
        raise HTTPException(status_code=403, detail="Invalid download token")
    
    if bundle.expires_at and bundle.expires_at < datetime.utcnow():
        raise HTTPException(status_code=410, detail="Download link expired")
    
    if bundle.status != "completed":
        raise HTTPException(status_code=400, detail="Bundle not ready for download")
    
    # In a real implementation, you would return the file
    # For now, return a placeholder response
    return {
        "message": "Download would start here",
        "file_path": bundle.file_path,
        "file_size": bundle.file_size
    }

def generate_export_bundle(bundle_id: int):
    """Background task to generate export bundle"""
    # This would be implemented as a Celery task in production
    # For now, simulate the process
    print(f"Generating export bundle {bundle_id}...")
    
    # Simulate processing time
    import time
    time.sleep(2)
    
    # Update bundle status (in real implementation, this would be done via database)
    print(f"Export bundle {bundle_id} completed!")

@router.get("/regions")
async def get_supported_regions():
    """Get list of supported compliance regions"""
    return {
        "regions": [
            {"code": "GDPR", "name": "General Data Protection Regulation", "description": "European Union"},
            {"code": "CCPA", "name": "California Consumer Privacy Act", "description": "California, USA"},
            {"code": "KVKK", "name": "Kişisel Verilerin Korunması Kanunu", "description": "Turkey"},
            {"code": "LGPD", "name": "Lei Geral de Proteção de Dados", "description": "Brazil"}
        ]
    }

@router.get("/bundle-types")
async def get_bundle_types():
    """Get list of available bundle types"""
    return {
        "bundle_types": [
            {"code": "regulator_audit", "name": "Regulator Audit Package", "description": "Complete audit package for regulatory compliance"},
            {"code": "compliance_report", "name": "Compliance Report", "description": "Summary compliance status report"},
            {"code": "data_inventory", "name": "Data Inventory", "description": "Complete data processing inventory"}
        ]
    }
