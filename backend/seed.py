#!/usr/bin/env python3
"""
Seed script for GDPR Hub Lite
Creates sample data for development and testing
"""

import sys
import os
from datetime import datetime, timedelta
import json

# Add the backend directory to Python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from sqlalchemy.orm import Session
from app.core.database import SessionLocal, engine
from app.models import (
    User, Organization, ConsentEvent, Preference, Breach, BreachSystem,
    DPIA, ROPA, ExportBundle
)
from sqlmodel import SQLModel

def create_sample_organization(db: Session) -> Organization:
    """Create a sample organization"""
    org = Organization(
        name="Acme Corp",
        slug="acme-corp",
        domain="acme.com",
        industry="Technology",
        size="medium",
        region="GDPR",
        dpo_name="Jane Smith",
        dpo_email="dpo@acme.com",
        privacy_policy_url="https://acme.com/privacy",
        data_retention_days=365,
        created_at=datetime.utcnow()
    )
    db.add(org)
    db.commit()
    db.refresh(org)
    return org

def create_sample_users(db: Session, org: Organization) -> list[User]:
    """Create sample users"""
    users = []
    
    # Admin user
    admin = User(
        email="admin@acme.com",
        full_name="Admin User",
        company_name="Acme Corp",
        role="admin",
        organization_id=org.id,
        is_active=True,
        created_at=datetime.utcnow()
    )
    db.add(admin)
    users.append(admin)
    
    # DPO user
    dpo = User(
        email="dpo@acme.com",
        full_name="Jane Smith",
        company_name="Acme Corp",
        role="admin",  # Use admin role instead of dpo
        organization_id=org.id,
        is_active=True,
        created_at=datetime.utcnow()
    )
    db.add(dpo)
    users.append(dpo)
    
    # Regular user
    user = User(
        email="user@acme.com",
        full_name="John Doe",
        company_name="Acme Corp",
        role="user",
        organization_id=org.id,
        is_active=True,
        created_at=datetime.utcnow()
    )
    db.add(user)
    users.append(user)
    
    db.commit()
    for u in users:
        db.refresh(u)
    
    return users

def create_sample_consent_events(db: Session, org: Organization) -> list[ConsentEvent]:
    """Create sample consent events"""
    events = []
    
    # Marketing consent
    marketing_consent = ConsentEvent(
        organization_id=org.id,
        subject_id="customer@example.com",
        channel="website",
        purpose="marketing",
        status="granted",
        source="privacy_banner",
        ip_address="192.168.1.100",
        user_agent="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)",
        occurred_at=datetime.utcnow() - timedelta(days=30),
        created_at=datetime.utcnow() - timedelta(days=30)
    )
    db.add(marketing_consent)
    events.append(marketing_consent)
    
    # Analytics consent
    analytics_consent = ConsentEvent(
        organization_id=org.id,
        subject_id="customer@example.com",
        channel="website",
        purpose="analytics",
        status="granted",
        source="cookie_banner",
        ip_address="192.168.1.100",
        user_agent="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)",
        occurred_at=datetime.utcnow() - timedelta(days=25),
        created_at=datetime.utcnow() - timedelta(days=25)
    )
    db.add(analytics_consent)
    events.append(analytics_consent)
    
    # Withdrawn consent
    withdrawn_consent = ConsentEvent(
        organization_id=org.id,
        subject_id="customer2@example.com",
        channel="email",
        purpose="marketing",
        status="withdrawn",
        source="unsubscribe_link",
        ip_address="192.168.1.101",
        user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
        occurred_at=datetime.utcnow() - timedelta(days=10),
        created_at=datetime.utcnow() - timedelta(days=10)
    )
    db.add(withdrawn_consent)
    events.append(withdrawn_consent)
    
    db.commit()
    for event in events:
        db.refresh(event)
    
    return events

def create_sample_preferences(db: Session, org: Organization) -> list[Preference]:
    """Create sample user preferences"""
    preferences = []
    
    # Customer 1 preferences
    pref1 = Preference(
        organization_id=org.id,
        subject_id="customer@example.com",
        email_opt_in=True,
        sms_opt_in=False,
        push_opt_in=True,
        phone_opt_in=False,
        marketing_email=True,
        marketing_sms=False,
        marketing_push=True,
        frequency_email="weekly",
        frequency_sms="monthly",
        created_at=datetime.utcnow() - timedelta(days=30),
        updated_at=datetime.utcnow() - timedelta(days=5)
    )
    db.add(pref1)
    preferences.append(pref1)
    
    # Customer 2 preferences
    pref2 = Preference(
        organization_id=org.id,
        subject_id="customer2@example.com",
        email_opt_in=False,
        sms_opt_in=True,
        push_opt_in=False,
        phone_opt_in=True,
        marketing_email=False,
        marketing_sms=True,
        marketing_push=False,
        frequency_email="monthly",
        frequency_sms="weekly",
        created_at=datetime.utcnow() - timedelta(days=25),
        updated_at=datetime.utcnow() - timedelta(days=3)
    )
    db.add(pref2)
    preferences.append(pref2)
    
    db.commit()
    for pref in preferences:
        db.refresh(pref)
    
    return preferences

def create_sample_breaches(db: Session, org: Organization) -> list[Breach]:
    """Create sample data breaches"""
    breaches = []
    
    # Recent breach
    recent_breach = Breach(
        organization_id=org.id,
        title="Database Access Incident",
        description="Unauthorized access to customer database",
        severity="high",
        started_at=datetime.utcnow() - timedelta(hours=48),
        detected_at=datetime.utcnow() - timedelta(hours=24),
        reported_at=datetime.utcnow() - timedelta(hours=12),
        status="investigating",
        affected_count=1500,
        data_types=json.dumps(["email", "name", "phone"]),
        regulation="gdpr",
        countdown_deadline=datetime.utcnow() + timedelta(hours=24),
        response_plan="Contain access, notify authorities, assess impact",
        mitigation_actions=json.dumps(["Reset passwords", "Review access logs", "Enhance monitoring"]),
        notification_sent=False,
        created_at=datetime.utcnow() - timedelta(hours=48),
        updated_at=datetime.utcnow() - timedelta(hours=1)
    )
    db.add(recent_breach)
    breaches.append(recent_breach)
    
    # Resolved breach
    resolved_breach = Breach(
        organization_id=org.id,
        title="Email Server Compromise",
        description="Phishing attack compromised email server",
        severity="medium",
        started_at=datetime.utcnow() - timedelta(days=30),
        detected_at=datetime.utcnow() - timedelta(days=29),
        reported_at=datetime.utcnow() - timedelta(days=28),
        status="resolved",
        affected_count=50,
        data_types=json.dumps(["email"]),
        regulation="gdpr",
        countdown_deadline=datetime.utcnow() - timedelta(days=25),
        response_plan="Isolate server, restore from backup, notify users",
        mitigation_actions=json.dumps(["Server isolation", "Backup restoration", "User notification"]),
        notification_sent=True,
        created_at=datetime.utcnow() - timedelta(days=30),
        updated_at=datetime.utcnow() - timedelta(days=25)
    )
    db.add(resolved_breach)
    breaches.append(resolved_breach)
    
    db.commit()
    for breach in breaches:
        db.refresh(breach)
    
    return breaches

def create_sample_breach_systems(db: Session, breaches: list[Breach]) -> list[BreachSystem]:
    """Create sample breach systems"""
    systems = []
    
    # System for recent breach
    if breaches:
        system = BreachSystem(
            breach_id=breaches[0].id,
            system_name="Customer Database",
            system_type="database",
            owner="IT Team",
            contact_email="it@acme.com",
            data_categories=json.dumps(["personal_data", "contact_info"]),
            estimated_records=1500,
            encryption_status="encrypted_at_rest",
            containment_status="contained",
            remediation_actions=json.dumps(["Access revoked", "Logs reviewed", "Monitoring enhanced"]),
            created_at=datetime.utcnow() - timedelta(hours=24),
            updated_at=datetime.utcnow() - timedelta(hours=1),
            notes="MySQL database containing customer information"
        )
        db.add(system)
        systems.append(system)
    
    db.commit()
    for sys in systems:
        db.refresh(sys)
    
    return systems

def create_sample_dpias(db: Session, org: Organization) -> list[DPIA]:
    """Create sample DPIA records"""
    dpias = []
    
    # High-risk DPIA
    high_risk_dpia = DPIA(
        organization_id=org.id,
        title="Customer Analytics Platform",
        description="AI-powered customer behavior analysis",
        processing_activity="Customer data analysis for marketing optimization",
        risk_level="high",
        risk_score=85,
        status="review",
        due_date=datetime.utcnow() + timedelta(days=30),
        data_categories=json.dumps(["behavioral_data", "demographic_data", "purchase_history"]),
        data_subjects=json.dumps(["customers", "website_visitors"]),
        legal_basis="legitimate_interests",
        safeguards=json.dumps(["Data minimization", "Pseudonymization", "Access controls"]),
        mitigation_measures=json.dumps(["Regular audits", "Staff training", "Technical safeguards"]),
        dpo_consulted=True,
        stakeholders=json.dumps(["Marketing Team", "Legal Team", "IT Security"]),
        created_at=datetime.utcnow() - timedelta(days=15),
        updated_at=datetime.utcnow() - timedelta(days=2)
    )
    db.add(high_risk_dpia)
    dpias.append(high_risk_dpia)
    
    # Medium-risk DPIA
    medium_risk_dpia = DPIA(
        organization_id=org.id,
        title="Employee Performance Tracking",
        description="HR system for tracking employee performance",
        processing_activity="Employee performance evaluation and reporting",
        risk_level="medium",
        risk_score=45,
        status="approved",
        completed_at=datetime.utcnow() - timedelta(days=5),
        data_categories=json.dumps(["performance_data", "personal_data"]),
        data_subjects=json.dumps(["employees"]),
        legal_basis="contract",
        safeguards=json.dumps(["Access controls", "Data retention policies"]),
        mitigation_measures=json.dumps(["Regular reviews", "Employee training"]),
        dpo_consulted=False,
        stakeholders=json.dumps(["HR Team", "Management"]),
        created_at=datetime.utcnow() - timedelta(days=45),
        updated_at=datetime.utcnow() - timedelta(days=5)
    )
    db.add(medium_risk_dpia)
    dpias.append(medium_risk_dpia)
    
    db.commit()
    for dpia in dpias:
        db.refresh(dpia)
    
    return dpias

def create_sample_ropas(db: Session, org: Organization) -> list[ROPA]:
    """Create sample ROPA records"""
    ropas = []
    
    # Customer management ROPA
    customer_ropa = ROPA(
        organization_id=org.id,
        activity_name="Customer Relationship Management",
        purpose="Managing customer relationships and providing customer support",
        description="Processing customer data for CRM purposes",
        legal_basis="contract",
        legitimate_interests=None,
        data_categories=json.dumps(["contact_info", "communication_history", "preferences"]),
        special_categories=None,
        data_subjects="customers",
        data_subject_rights=json.dumps(["access", "rectification", "erasure", "portability"]),
        recipients=json.dumps(["customer_service", "sales_team"]),
        third_countries=None,
        transfer_safeguards=None,
        retention_period="7 years",
        retention_criteria="Business relationship duration + legal requirements",
        security_measures=json.dumps(["encryption", "access_controls", "audit_logs"]),
        status="active",
        last_reviewed=datetime.utcnow() - timedelta(days=30),
        next_review=datetime.utcnow() + timedelta(days=335),
        data_controller="Acme Corp",
        data_processor=None,
        joint_controllers=None,
        created_at=datetime.utcnow() - timedelta(days=90),
        updated_at=datetime.utcnow() - timedelta(days=30)
    )
    db.add(customer_ropa)
    ropas.append(customer_ropa)
    
    # Marketing ROPA
    marketing_ropa = ROPA(
        organization_id=org.id,
        activity_name="Marketing Communications",
        purpose="Sending marketing communications and promotional materials",
        description="Processing customer data for marketing purposes",
        legal_basis="consent",
        legitimate_interests=None,
        data_categories=json.dumps(["email", "name", "preferences", "behavioral_data"]),
        special_categories=None,
        data_subjects="customers",
        data_subject_rights=json.dumps(["access", "rectification", "erasure", "objection"]),
        recipients=json.dumps(["marketing_team"]),
        third_countries=None,
        transfer_safeguards=None,
        retention_period="3 years",
        retention_criteria="Consent validity period",
        security_measures=json.dumps(["encryption", "consent_management", "opt_out_mechanism"]),
        status="active",
        last_reviewed=datetime.utcnow() - timedelta(days=15),
        next_review=datetime.utcnow() + timedelta(days=350),
        data_controller="Acme Corp",
        data_processor=None,
        joint_controllers=None,
        created_at=datetime.utcnow() - timedelta(days=60),
        updated_at=datetime.utcnow() - timedelta(days=15)
    )
    db.add(marketing_ropa)
    ropas.append(marketing_ropa)
    
    db.commit()
    for ropa in ropas:
        db.refresh(ropa)
    
    return ropas

def create_sample_export_bundles(db: Session, org: Organization) -> list[ExportBundle]:
    """Create sample export bundles"""
    bundles = []
    
    # Completed GDPR audit bundle
    gdpr_bundle = ExportBundle(
        organization_id=org.id,
        bundle_type="regulator_audit",
        region="GDPR",
        title="GDPR Compliance Audit Package",
        description="Complete GDPR compliance documentation for regulatory audit",
        status="completed",
        file_path="/exports/gdpr_audit_2024.zip",
        file_size=15728640,  # 15MB
        download_token="gdpr_audit_token_123",
        expires_at=datetime.utcnow() + timedelta(days=7),
        created_by=1,  # Admin user
        created_at=datetime.utcnow() - timedelta(days=5),
        updated_at=datetime.utcnow() - timedelta(days=5),
        completed_at=datetime.utcnow() - timedelta(days=5)
    )
    db.add(gdpr_bundle)
    bundles.append(gdpr_bundle)
    
    # Pending CCPA report
    ccpa_bundle = ExportBundle(
        organization_id=org.id,
        bundle_type="compliance_report",
        region="CCPA",
        title="CCPA Compliance Status Report",
        description="Current CCPA compliance status and recommendations",
        status="pending",
        created_by=1,  # Admin user
        created_at=datetime.utcnow() - timedelta(hours=2)
    )
    db.add(ccpa_bundle)
    bundles.append(ccpa_bundle)
    
    db.commit()
    for bundle in bundles:
        db.refresh(bundle)
    
    return bundles

def main():
    """Main seed function"""
    print("🌱 Starting GDPR Hub Lite seed process...")
    
    # Create database tables
    print("📊 Creating database tables...")
    SQLModel.metadata.create_all(bind=engine)
    
    # Create database session
    db = SessionLocal()
    
    try:
        # Create sample data
        print("🏢 Creating sample organization...")
        org = create_sample_organization(db)
        print(f"✅ Created organization: {org.name} (ID: {org.id})")
        
        print("👥 Creating sample users...")
        users = create_sample_users(db, org)
        print(f"✅ Created {len(users)} users")
        
        print("📝 Creating sample consent events...")
        consent_events = create_sample_consent_events(db, org)
        print(f"✅ Created {len(consent_events)} consent events")
        
        print("⚙️ Creating sample preferences...")
        preferences = create_sample_preferences(db, org)
        print(f"✅ Created {len(preferences)} preferences")
        
        print("🚨 Creating sample breaches...")
        breaches = create_sample_breaches(db, org)
        print(f"✅ Created {len(breaches)} breaches")
        
        print("💻 Creating sample breach systems...")
        breach_systems = create_sample_breach_systems(db, breaches)
        print(f"✅ Created {len(breach_systems)} breach systems")
        
        print("📋 Creating sample DPIAs...")
        dpias = create_sample_dpias(db, org)
        print(f"✅ Created {len(dpias)} DPIAs")
        
        print("📊 Creating sample ROPAs...")
        ropas = create_sample_ropas(db, org)
        print(f"✅ Created {len(ropas)} ROPAs")
        
        print("📦 Creating sample export bundles...")
        export_bundles = create_sample_export_bundles(db, org)
        print(f"✅ Created {len(export_bundles)} export bundles")
        
        print("\n🎉 Seed process completed successfully!")
        print(f"📈 Summary:")
        print(f"   - Organization: {org.name}")
        print(f"   - Users: {len(users)}")
        print(f"   - Consent Events: {len(consent_events)}")
        print(f"   - Preferences: {len(preferences)}")
        print(f"   - Breaches: {len(breaches)}")
        print(f"   - Breach Systems: {len(breach_systems)}")
        print(f"   - DPIAs: {len(dpias)}")
        print(f"   - ROPAs: {len(ropas)}")
        print(f"   - Export Bundles: {len(export_bundles)}")
        
    except Exception as e:
        print(f"❌ Error during seed process: {e}")
        db.rollback()
        raise
    finally:
        db.close()

if __name__ == "__main__":
    main()
