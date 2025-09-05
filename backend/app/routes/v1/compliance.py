from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlmodel import SQLModel
from typing import List, Optional
from datetime import datetime, timedelta
import json

from app.core.database import get_db
from app.core.config import settings
from app.deps import get_optional_current_user
from app.models import User, Breach, ConsentEvent, DPIA, ROPA, ExportBundle

router = APIRouter(prefix="/compliance", tags=["compliance"])

# Response models
class ComplianceStatusResponse(SQLModel):
    region: str
    status: str  # "compliant", "non_compliant", "at_risk", "unknown"
    score: int  # 0-100
    last_updated: datetime
    issues: List[str] = []
    recommendations: List[str] = []

class RegionComplianceResponse(SQLModel):
    region: str
    region_name: str
    description: str
    status: ComplianceStatusResponse
    requirements: List[dict] = []
    deadlines: List[dict] = []

class MultiRegionComplianceResponse(SQLModel):
    regions: List[RegionComplianceResponse]
    overall_score: int
    critical_issues: int
    last_updated: datetime

@router.get("/status", response_model=MultiRegionComplianceResponse)
async def get_compliance_status(
    regions: Optional[List[str]] = Query(None, description="Filter by specific regions"),
    current_user: Optional[User] = Depends(get_optional_current_user),
    db: Session = Depends(get_db)
):
    """Get compliance status for multiple regions"""
    
    # Use requested regions or all supported regions
    target_regions = regions or settings.SUPPORTED_REGIONS
    
    # Validate regions
    invalid_regions = [r for r in target_regions if r not in settings.SUPPORTED_REGIONS]
    if invalid_regions:
        raise HTTPException(
            status_code=400, 
            detail=f"Unsupported regions: {invalid_regions}. Supported: {settings.SUPPORTED_REGIONS}"
        )
    
    # For development, use default organization
    organization_id = 1
    if current_user and current_user.organization_id:
        organization_id = current_user.organization_id
    
    region_compliance = []
    total_score = 0
    critical_issues = 0
    
    for region in target_regions:
        compliance = await get_region_compliance_status(region, organization_id, db)
        region_compliance.append(compliance)
        total_score += compliance.status.score
        critical_issues += len([issue for issue in compliance.status.issues if "critical" in issue.lower()])
    
    # Calculate overall score
    overall_score = total_score // len(target_regions) if target_regions else 0
    
    return MultiRegionComplianceResponse(
        regions=region_compliance,
        overall_score=overall_score,
        critical_issues=critical_issues,
        last_updated=datetime.utcnow()
    )

@router.get("/status/{region}", response_model=RegionComplianceResponse)
async def get_region_compliance_status(
    region: str,
    current_user: Optional[User] = Depends(get_optional_current_user),
    db: Session = Depends(get_db)
):
    """Get compliance status for a specific region"""
    
    if region not in settings.SUPPORTED_REGIONS:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported region: {region}. Supported: {settings.SUPPORTED_REGIONS}"
        )
    
    # For development, use default organization
    organization_id = 1
    if current_user and current_user.organization_id:
        organization_id = current_user.organization_id
    
    return await get_region_compliance_status(region, organization_id, db)

async def get_region_compliance_status(region: str, organization_id: int, db: Session) -> RegionComplianceResponse:
    """Internal function to get compliance status for a region"""
    
    # Get region info
    region_info = get_region_info(region)
    
    # Calculate compliance score based on data
    score = 0
    issues = []
    recommendations = []
    
    # Check breaches
    breach_count = db.query(Breach).filter(
        Breach.organization_id == organization_id,
        Breach.regulation == region.lower()
    ).count()
    
    if breach_count > 0:
        score -= 20
        issues.append(f"{breach_count} data breach(es) reported")
        recommendations.append("Review breach response procedures")
    
    # Check consent events
    consent_count = db.query(ConsentEvent).filter(
        ConsentEvent.organization_id == organization_id
    ).count()
    
    if consent_count == 0:
        score -= 15
        issues.append("No consent events recorded")
        recommendations.append("Implement consent management system")
    else:
        score += 10
    
    # Check DPIA records
    dpia_count = db.query(DPIA).filter(
        DPIA.organization_id == organization_id
    ).count()
    
    if dpia_count == 0:
        score -= 10
        issues.append("No DPIA records found")
        recommendations.append("Conduct Data Protection Impact Assessments")
    else:
        score += 5
    
    # Check ROPA records
    ropa_count = db.query(ROPA).filter(
        ROPA.organization_id == organization_id
    ).count()
    
    if ropa_count == 0:
        score -= 15
        issues.append("No ROPA records found")
        recommendations.append("Maintain Record of Processing Activities")
    else:
        score += 10
    
    # Ensure score is between 0-100
    score = max(0, min(100, score + 50))  # Base score of 50
    
    # Determine status
    if score >= 80:
        status = "compliant"
    elif score >= 60:
        status = "at_risk"
    else:
        status = "non_compliant"
    
    compliance_status = ComplianceStatusResponse(
        region=region,
        status=status,
        score=score,
        last_updated=datetime.utcnow(),
        issues=issues,
        recommendations=recommendations
    )
    
    return RegionComplianceResponse(
        region=region,
        region_name=region_info["name"],
        description=region_info["description"],
        status=compliance_status,
        requirements=get_region_requirements(region),
        deadlines=get_region_deadlines(region)
    )

def get_region_info(region: str) -> dict:
    """Get region information"""
    region_map = {
        "GDPR": {
            "name": "General Data Protection Regulation",
            "description": "European Union data protection regulation"
        },
        "CCPA": {
            "name": "California Consumer Privacy Act",
            "description": "California state privacy law"
        },
        "KVKK": {
            "name": "Kişisel Verilerin Korunması Kanunu",
            "description": "Turkish personal data protection law"
        },
        "LGPD": {
            "name": "Lei Geral de Proteção de Dados",
            "description": "Brazilian general data protection law"
        }
    }
    return region_map.get(region, {"name": region, "description": "Unknown region"})

def get_region_requirements(region: str) -> List[dict]:
    """Get region-specific requirements"""
    requirements_map = {
        "GDPR": [
            {"code": "consent_management", "name": "Consent Management", "required": True},
            {"code": "data_portability", "name": "Data Portability", "required": True},
            {"code": "right_to_be_forgotten", "name": "Right to be Forgotten", "required": True},
            {"code": "breach_notification", "name": "72h Breach Notification", "required": True},
            {"code": "dpo_appointment", "name": "DPO Appointment", "required": False},
            {"code": "dpia", "name": "Data Protection Impact Assessment", "required": False}
        ],
        "CCPA": [
            {"code": "consumer_rights", "name": "Consumer Rights", "required": True},
            {"code": "opt_out", "name": "Opt-out Mechanism", "required": True},
            {"code": "data_disclosure", "name": "Data Disclosure", "required": True},
            {"code": "breach_notification", "name": "Breach Notification", "required": True}
        ],
        "KVKK": [
            {"code": "explicit_consent", "name": "Explicit Consent", "required": True},
            {"code": "data_subject_rights", "name": "Data Subject Rights", "required": True},
            {"code": "breach_notification", "name": "72h Breach Notification", "required": True},
            {"code": "veri_sorumlusu", "name": "Data Controller Registration", "required": True}
        ],
        "LGPD": [
            {"code": "consent_management", "name": "Consent Management", "required": True},
            {"code": "data_subject_rights", "name": "Data Subject Rights", "required": True},
            {"code": "breach_notification", "name": "Breach Notification", "required": True},
            {"code": "dpo_appointment", "name": "DPO Appointment", "required": False}
        ]
    }
    return requirements_map.get(region, [])

def get_region_deadlines(region: str) -> List[dict]:
    """Get region-specific deadlines"""
    deadlines_map = {
        "GDPR": [
            {"type": "breach_notification", "deadline": "72 hours", "description": "Notify supervisory authority"},
            {"type": "dsar_response", "deadline": "30 days", "description": "Respond to data subject requests"},
            {"type": "dpo_notification", "deadline": "Immediate", "description": "Notify DPO of breaches"}
        ],
        "CCPA": [
            {"type": "consumer_request", "deadline": "45 days", "description": "Respond to consumer requests"},
            {"type": "breach_notification", "deadline": "Immediate", "description": "Notify affected consumers"}
        ],
        "KVKK": [
            {"type": "breach_notification", "deadline": "72 hours", "description": "Notify KVKK"},
            {"type": "data_subject_request", "deadline": "30 days", "description": "Respond to data subject requests"}
        ],
        "LGPD": [
            {"type": "breach_notification", "deadline": "Immediate", "description": "Notify ANPD"},
            {"type": "data_subject_request", "deadline": "15 days", "description": "Respond to data subject requests"}
        ]
    }
    return deadlines_map.get(region, [])

@router.get("/regions")
async def get_supported_regions():
    """Get list of supported compliance regions"""
    return {
        "regions": [
            {
                "code": region,
                "name": get_region_info(region)["name"],
                "description": get_region_info(region)["description"]
            }
            for region in settings.SUPPORTED_REGIONS
        ],
        "default_region": settings.DEFAULT_REGION
    }

@router.post("/auto-route")
async def auto_route_compliance(
    data_type: str,
    current_user: Optional[User] = Depends(get_optional_current_user),
    db: Session = Depends(get_db)
):
    """Auto-route compliance requirements based on data type and region"""
    
    # For development, use default organization
    organization_id = 1
    if current_user and current_user.organization_id:
        organization_id = current_user.organization_id
    
    # Simple auto-routing logic
    routing_rules = {
        "personal_data": ["GDPR", "KVKK", "LGPD"],
        "health_data": ["GDPR", "KVKK"],
        "financial_data": ["GDPR", "CCPA", "KVKK"],
        "biometric_data": ["GDPR", "KVKK"],
        "location_data": ["GDPR", "CCPA", "KVKK", "LGPD"]
    }
    
    applicable_regions = routing_rules.get(data_type, settings.SUPPORTED_REGIONS)
    
    return {
        "data_type": data_type,
        "applicable_regions": applicable_regions,
        "routing_recommendations": [
            {
                "region": region,
                "priority": "high" if region in ["GDPR", "KVKK"] else "medium",
                "requirements": get_region_requirements(region)
            }
            for region in applicable_regions
        ]
    }
