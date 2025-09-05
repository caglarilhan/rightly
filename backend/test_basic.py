#!/usr/bin/env python3
"""
Basic pytest suite for GDPR Hub Lite
Tests core functionality and API endpoints
"""

import pytest
import json
from datetime import datetime, timedelta
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from app.main import app
from app.core.database import SessionLocal, engine
from app.models import User, Organization, ConsentEvent, Breach, DPIA, ROPA, ExportBundle
from sqlmodel import SQLModel

# Test client
client = TestClient(app)

@pytest.fixture(scope="function")
def db_session():
    """Create a test database session"""
    # Create tables
    SQLModel.metadata.create_all(bind=engine)
    
    # Create session
    session = SessionLocal()
    
    yield session
    
    # Cleanup
    session.close()

@pytest.fixture(scope="function")
def sample_organization(db_session: Session):
    """Create a sample organization for testing"""
    org = Organization(
        name="Test Corp",
        domain="test.com",
        industry="Technology",
        size="small",
        region="GDPR",
        dpo_name="Test DPO",
        dpo_email="dpo@test.com",
        privacy_policy_url="https://test.com/privacy",
        data_retention_days=365,
        created_at=datetime.utcnow()
    )
    db_session.add(org)
    db_session.commit()
    db_session.refresh(org)
    return org

@pytest.fixture(scope="function")
def sample_user(db_session: Session, sample_organization: Organization):
    """Create a sample user for testing"""
    user = User(
        email="test@test.com",
        name="Test User",
        role="admin",
        organization_id=sample_organization.id,
        is_active=True,
        created_at=datetime.utcnow()
    )
    db_session.add(user)
    db_session.commit()
    db_session.refresh(user)
    return user

class TestHealthEndpoints:
    """Test health check endpoints"""
    
    def test_root_endpoint(self):
        """Test root endpoint"""
        response = client.get("/")
        assert response.status_code == 200
        data = response.json()
        assert data["name"] == "gdpr-hub-lite"
        assert data["version"] == "0.1.0"
    
    def test_healthz_endpoint(self):
        """Test health check endpoint"""
        response = client.get("/healthz")
        assert response.status_code == 200
        data = response.json()
        assert data["ok"] is True
        assert data["env"] == "development"
        assert data["database"] == "sqlite"
    
    def test_api_healthz_endpoint(self):
        """Test API health check endpoint"""
        response = client.get("/api/v1/healthz")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "healthy"
        assert data["database"] == "healthy"

class TestConsentEndpoints:
    """Test consent management endpoints"""
    
    def test_list_consents(self):
        """Test listing consent events"""
        response = client.get("/api/v1/consents")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
    
    def test_list_consents_with_filters(self):
        """Test listing consent events with filters"""
        response = client.get("/api/v1/consents?channel=website&status=granted")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
    
    def test_create_consent_event(self):
        """Test creating a consent event"""
        consent_data = {
            "user_email": "test@example.com",
            "consent_type": "marketing",
            "status": "granted",
            "channel": "website",
            "source": "privacy_banner",
            "ip_address": "192.168.1.100",
            "user_agent": "Mozilla/5.0",
            "consent_text": "I agree to marketing",
            "legal_basis": "consent"
        }
        response = client.post("/api/v1/consents", json=consent_data)
        assert response.status_code == 201
        data = response.json()
        assert data["user_email"] == "test@example.com"
        assert data["consent_type"] == "marketing"
        assert data["status"] == "granted"

class TestBreachEndpoints:
    """Test breach management endpoints"""
    
    def test_list_breaches(self):
        """Test listing breaches"""
        response = client.get("/api/v1/breaches")
        assert response.status_code == 200
        data = response.json()
        assert "breaches" in data
        assert "total" in data
        assert isinstance(data["breaches"], list)
    
    def test_list_breaches_with_filters(self):
        """Test listing breaches with filters"""
        response = client.get("/api/v1/breaches?status=detected&severity=high")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data["breaches"], list)
    
    def test_create_breach(self):
        """Test creating a breach"""
        breach_data = {
            "title": "Test Breach",
            "description": "Test breach description",
            "severity": "medium",
            "started_at": datetime.utcnow().isoformat(),
            "detected_at": datetime.utcnow().isoformat(),
            "affected_count": 100,
            "data_types": ["email", "name"],
            "regulation": "gdpr",
            "countdown_deadline": (datetime.utcnow() + timedelta(hours=72)).isoformat()
        }
        response = client.post("/api/v1/breaches", json=breach_data)
        assert response.status_code == 201
        data = response.json()
        assert data["title"] == "Test Breach"
        assert data["severity"] == "medium"
        assert data["status"] == "detected"

class TestExportEndpoints:
    """Test export bundle endpoints"""
    
    def test_list_export_bundles(self):
        """Test listing export bundles"""
        response = client.get("/api/v1/exports/bundles")
        assert response.status_code == 200
        data = response.json()
        assert "bundles" in data
        assert "total" in data
        assert isinstance(data["bundles"], list)
    
    def test_get_supported_regions(self):
        """Test getting supported regions"""
        response = client.get("/api/v1/exports/regions")
        assert response.status_code == 200
        data = response.json()
        assert "regions" in data
        assert isinstance(data["regions"], list)
        assert len(data["regions"]) > 0
    
    def test_get_bundle_types(self):
        """Test getting bundle types"""
        response = client.get("/api/v1/exports/bundle-types")
        assert response.status_code == 200
        data = response.json()
        assert "bundle_types" in data
        assert isinstance(data["bundle_types"], list)
        assert len(data["bundle_types"]) > 0
    
    def test_create_export_bundle(self):
        """Test creating an export bundle"""
        bundle_data = {
            "bundle_type": "regulator_audit",
            "region": "GDPR",
            "title": "Test Audit Package",
            "description": "Test audit package description"
        }
        response = client.post("/api/v1/exports/bundles", json=bundle_data)
        assert response.status_code == 201
        data = response.json()
        assert data["bundle_type"] == "regulator_audit"
        assert data["region"] == "GDPR"
        assert data["title"] == "Test Audit Package"
        assert data["status"] == "pending"

class TestComplianceEndpoints:
    """Test compliance endpoints"""
    
    def test_get_supported_regions(self):
        """Test getting supported compliance regions"""
        response = client.get("/api/v1/compliance/regions")
        assert response.status_code == 200
        data = response.json()
        assert "regions" in data
        assert "default_region" in data
        assert isinstance(data["regions"], list)
        assert len(data["regions"]) > 0
    
    def test_get_compliance_status(self):
        """Test getting compliance status"""
        response = client.get("/api/v1/compliance/status")
        assert response.status_code == 200
        data = response.json()
        assert "regions" in data
        assert "overall_score" in data
        assert "critical_issues" in data
        assert "last_updated" in data
        assert isinstance(data["regions"], list)
    
    def test_get_compliance_status_with_region_filter(self):
        """Test getting compliance status with region filter"""
        response = client.get("/api/v1/compliance/status?regions=GDPR&regions=CCPA")
        assert response.status_code == 200
        data = response.json()
        assert len(data["regions"]) == 2
    
    def test_get_region_compliance_status(self):
        """Test getting compliance status for specific region"""
        response = client.get("/api/v1/compliance/status/GDPR")
        assert response.status_code == 200
        data = response.json()
        assert data["region"] == "GDPR"
        assert "status" in data
        assert "requirements" in data
        assert "deadlines" in data
    
    def test_auto_route_compliance(self):
        """Test auto-routing compliance requirements"""
        response = client.post("/api/v1/compliance/auto-route?data_type=personal_data")
        assert response.status_code == 200
        data = response.json()
        assert data["data_type"] == "personal_data"
        assert "applicable_regions" in data
        assert "routing_recommendations" in data
        assert isinstance(data["applicable_regions"], list)

class TestDataModels:
    """Test data model functionality"""
    
    def test_organization_creation(self, db_session: Session):
        """Test organization model creation"""
        org = Organization(
            name="Test Org",
            domain="test.org",
            industry="Technology",
            size="medium",
            region="GDPR",
            dpo_name="Test DPO",
            dpo_email="dpo@test.org",
            privacy_policy_url="https://test.org/privacy",
            data_retention_days=365,
            created_at=datetime.utcnow()
        )
        db_session.add(org)
        db_session.commit()
        db_session.refresh(org)
        
        assert org.id is not None
        assert org.name == "Test Org"
        assert org.domain == "test.org"
        assert org.region == "GDPR"
    
    def test_consent_event_creation(self, db_session: Session, sample_organization: Organization):
        """Test consent event model creation"""
        consent = ConsentEvent(
            organization_id=sample_organization.id,
            user_email="test@example.com",
            consent_type="marketing",
            status="granted",
            channel="website",
            source="privacy_banner",
            ip_address="192.168.1.100",
            user_agent="Mozilla/5.0",
            consent_text="I agree to marketing",
            legal_basis="consent",
            created_at=datetime.utcnow()
        )
        db_session.add(consent)
        db_session.commit()
        db_session.refresh(consent)
        
        assert consent.id is not None
        assert consent.user_email == "test@example.com"
        assert consent.consent_type == "marketing"
        assert consent.status == "granted"
    
    def test_breach_creation(self, db_session: Session, sample_organization: Organization):
        """Test breach model creation"""
        breach = Breach(
            organization_id=sample_organization.id,
            title="Test Breach",
            description="Test breach description",
            severity="medium",
            started_at=datetime.utcnow(),
            detected_at=datetime.utcnow(),
            affected_count=100,
            data_types=json.dumps(["email", "name"]),
            regulation="gdpr",
            countdown_deadline=datetime.utcnow() + timedelta(hours=72),
            created_at=datetime.utcnow()
        )
        db_session.add(breach)
        db_session.commit()
        db_session.refresh(breach)
        
        assert breach.id is not None
        assert breach.title == "Test Breach"
        assert breach.severity == "medium"
        assert breach.status == "detected"
    
    def test_dpia_creation(self, db_session: Session, sample_organization: Organization):
        """Test DPIA model creation"""
        dpia = DPIA(
            organization_id=sample_organization.id,
            title="Test DPIA",
            description="Test DPIA description",
            processing_activity="Test processing activity",
            risk_level="medium",
            risk_score=50,
            status="draft",
            created_at=datetime.utcnow()
        )
        db_session.add(dpia)
        db_session.commit()
        db_session.refresh(dpia)
        
        assert dpia.id is not None
        assert dpia.title == "Test DPIA"
        assert dpia.risk_level == "medium"
        assert dpia.status == "draft"
    
    def test_ropa_creation(self, db_session: Session, sample_organization: Organization):
        """Test ROPA model creation"""
        ropa = ROPA(
            organization_id=sample_organization.id,
            activity_name="Test Activity",
            purpose="Test purpose",
            description="Test description",
            legal_basis="consent",
            data_subjects="customers",
            status="active",
            created_at=datetime.utcnow()
        )
        db_session.add(ropa)
        db_session.commit()
        db_session.refresh(ropa)
        
        assert ropa.id is not None
        assert ropa.activity_name == "Test Activity"
        assert ropa.legal_basis == "consent"
        assert ropa.status == "active"
    
    def test_export_bundle_creation(self, db_session: Session, sample_organization: Organization):
        """Test export bundle model creation"""
        bundle = ExportBundle(
            organization_id=sample_organization.id,
            bundle_type="regulator_audit",
            region="GDPR",
            title="Test Bundle",
            description="Test bundle description",
            status="pending",
            created_at=datetime.utcnow()
        )
        db_session.add(bundle)
        db_session.commit()
        db_session.refresh(bundle)
        
        assert bundle.id is not None
        assert bundle.bundle_type == "regulator_audit"
        assert bundle.region == "GDPR"
        assert bundle.status == "pending"

class TestErrorHandling:
    """Test error handling"""
    
    def test_invalid_region(self):
        """Test invalid region handling"""
        response = client.get("/api/v1/compliance/status/INVALID")
        assert response.status_code == 400
        data = response.json()
        assert "detail" in data
        assert "Unsupported region" in data["detail"]
    
    def test_invalid_bundle_type(self):
        """Test invalid bundle type handling"""
        bundle_data = {
            "bundle_type": "invalid_type",
            "region": "GDPR",
            "title": "Test Bundle"
        }
        response = client.post("/api/v1/exports/bundles", json=bundle_data)
        # Should still create the bundle (validation happens in business logic)
        assert response.status_code == 201
    
    def test_missing_required_fields(self):
        """Test missing required fields handling"""
        consent_data = {
            "user_email": "test@example.com",
            # Missing required fields
        }
        response = client.post("/api/v1/consents", json=consent_data)
        assert response.status_code == 422  # Validation error

if __name__ == "__main__":
    pytest.main([__file__, "-v"])
