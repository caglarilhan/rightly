#!/usr/bin/env python3
"""
Test verisi oluşturma scripti
"""
import asyncio
import json
from datetime import datetime, timedelta
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker

from app.models import Account, Request, Source, AuditEvent, ExportBundle, User
from app.models.account import AccountStatus, AccountPlan
from app.models.request import RequestType, RequestStatus
from app.models.source import SourceType, SourceStatus
from app.models.audit_event import AuditEventType
from app.models.export_bundle import ExportFormat
from app.models.user import UserRole, UserStatus
from app.core.auth import AuthService

# Database URL
DATABASE_URL = "sqlite+aiosqlite:///./gdpr_hub_lite.db"

# Async engine
engine = create_async_engine(DATABASE_URL, echo=True)
AsyncSessionLocal = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)

async def create_test_data():
    """Test verisi oluştur"""
    async with AsyncSessionLocal() as db:
        print("Test verisi oluşturuluyor...")
        
        # 1. Test Account oluştur
        test_account = Account(
            email="test@example.com",
            company_name="Test Company Ltd",
            plan=AccountPlan.STARTER,
            status=AccountStatus.ACTIVE,
            shopify_domain="test-store.myshopify.com",
            woo_site_url="https://test-store.com",
            settings=json.dumps({
                "notification_email": "admin@testcompany.com",
                "auto_approve": False,
                "retention_days": 30
            })
        )
        
        db.add(test_account)
        await db.commit()
        await db.refresh(test_account)
        
        print(f"✅ Account oluşturuldu: {test_account.company_name}")
        
        # 2. Test User oluştur
        test_user = User(
            email="admin@testcompany.com",
            hashed_password=AuthService.get_password_hash("password123"),
            full_name="Test Admin",
            role=UserRole.ADMIN,
            status=UserStatus.ACTIVE,
            account_id=test_account.id,
            email_verified=True
        )
        
        db.add(test_user)
        await db.commit()
        await db.refresh(test_user)
        
        print(f"✅ User oluşturuldu: {test_user.email}")
        
        # 3. Test Sources oluştur
        shopify_source = Source(
            account_id=test_account.id,
            name="Shopify Store",
            source_type=SourceType.SHOPIFY,
            status=SourceStatus.ACTIVE,
            is_enabled=True,
            connection_data=json.dumps({
                "domain": "test-store.myshopify.com",
                "access_token": "test_token_123",
                "webhook_secret": "test_webhook_secret"
            }),
            last_sync_at=datetime.utcnow(),
            sync_interval=3600
        )
        
        woo_source = Source(
            account_id=test_account.id,
            name="WooCommerce Store",
            source_type=SourceType.WOOCOMMERCE,
            status=SourceStatus.ACTIVE,
            is_enabled=True,
            connection_data=json.dumps({
                "site_url": "https://test-store.com",
                "api_key": "test_api_key",
                "api_secret": "test_api_secret"
            }),
            last_sync_at=datetime.utcnow(),
            sync_interval=3600
        )
        
        db.add(shopify_source)
        db.add(woo_source)
        await db.commit()
        
        print("✅ Sources oluşturuldu")
        
        # 4. Test Requests oluştur
        due_date = datetime.utcnow() + timedelta(days=25)
        
        request1 = Request(
            account_id=test_account.id,
            request_type=RequestType.ACCESS,
            subject_email="customer1@example.com",
            subject_name="John Doe",
            subject_phone="+1234567890",
            description="Data access request from Shopify customer",
            status=RequestStatus.REVIEWING,
            due_date=due_date,
            additional_info=json.dumps({
                "source": "shopify",
                "customer_id": "12345",
                "order_count": 5
            })
        )
        
        request2 = Request(
            account_id=test_account.id,
            request_type=RequestType.ERASURE,
            subject_email="customer2@example.com",
            subject_name="Jane Smith",
            subject_phone="+0987654321",
            description="Data deletion request from WooCommerce customer",
            status=RequestStatus.NEW,
            due_date=due_date,
            additional_info=json.dumps({
                "source": "woocommerce",
                "customer_id": "67890",
                "order_count": 2
            })
        )
        
        request3 = Request(
            account_id=test_account.id,
            request_type=RequestType.ACCESS,
            subject_email="customer3@example.com",
            subject_name="Bob Johnson",
            description="Data access request",
            status=RequestStatus.COMPLETED,
            due_date=due_date,
            additional_info=json.dumps({
                "source": "manual",
                "notes": "Customer requested via email"
            })
        )
        
        db.add(request1)
        db.add(request2)
        db.add(request3)
        await db.commit()
        
        print("✅ Requests oluşturuldu")
        
        # 5. Test Audit Events oluştur
        audit1 = AuditEvent(
            request_id=request1.id,
            account_id=test_account.id,
            user_id=test_user.id,
            event_type=AuditEventType.REQUEST_CREATED,
            actor=test_user.email,
            action="Created DSAR request",
            details="Request created via Shopify webhook",
            meta_data=json.dumps({
                "webhook_source": "shopify",
                "customer_id": "12345"
            })
        )
        
        audit2 = AuditEvent(
            request_id=request1.id,
            account_id=test_account.id,
            user_id=test_user.id,
            event_type=AuditEventType.REQUEST_UPDATED,
            actor=test_user.email,
            action="Updated request status",
            details="Status changed from NEW to REVIEWING",
            meta_data=json.dumps({
                "old_status": "new",
                "new_status": "reviewing"
            })
        )
        
        audit3 = AuditEvent(
            request_id=request3.id,
            account_id=test_account.id,
            user_id=test_user.id,
            event_type=AuditEventType.EXPORT_GENERATED,
            actor=test_user.email,
            action="Generated export bundle",
            details="Export bundle created in ZIP format",
            meta_data=json.dumps({
                "format": "zip",
                "file_size": 2048576
            })
        )
        
        db.add(audit1)
        db.add(audit2)
        db.add(audit3)
        await db.commit()
        
        print("✅ Audit Events oluşturuldu")
        
        # 6. Test Export Bundles oluştur
        export1 = ExportBundle(
            request_id=request3.id,
            format=ExportFormat.ZIP,
            file_path="/exports/request_3_data.zip",
            file_size=2048576,
            checksum="sha256:abc123def456",
            expires_at=datetime.utcnow() + timedelta(days=30),
            meta_data=json.dumps({
                "included_sources": ["shopify", "woocommerce"],
                "file_count": 5,
                "generated_by": test_user.email
            })
        )
        
        export2 = ExportBundle(
            request_id=request3.id,
            format=ExportFormat.JSON,
            file_path="/exports/request_3_data.json",
            file_size=512000,
            checksum="sha256:def456ghi789",
            expires_at=datetime.utcnow() + timedelta(days=30),
            meta_data=json.dumps({
                "included_sources": ["shopify"],
                "record_count": 150,
                "generated_by": test_user.email
            })
        )
        
        db.add(export1)
        db.add(export2)
        await db.commit()
        
        print("✅ Export Bundles oluşturuldu")
        
        print("\n🎉 Test verisi başarıyla oluşturuldu!")
        print(f"📊 Özet:")
        print(f"   - Account: {test_account.company_name}")
        print(f"   - User: {test_user.email} (Admin)")
        print(f"   - Sources: 2 (Shopify + WooCommerce)")
        print(f"   - Requests: 3 (Access, Erasure, Completed)")
        print(f"   - Audit Events: 3")
        print(f"   - Export Bundles: 2")
        print(f"\n🔑 Test Kullanıcı Bilgileri:")
        print(f"   Email: {test_user.email}")
        print(f"   Password: password123")
        print(f"   Role: {test_user.role}")

if __name__ == "__main__":
    asyncio.run(create_test_data())
