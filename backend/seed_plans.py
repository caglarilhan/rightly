import asyncio
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, text
from app.core.database import get_db
from app.models.billing import Plan, PlanType
from decimal import Decimal

async def seed_plans():
    """Başlangıç planlarını oluştur"""
    print("Planlar oluşturuluyor...")
    
    async for db in get_db():
        # Mevcut planları kontrol et
        existing_plans = await db.execute(select(Plan))
        count = len(existing_plans.scalars().all())
        
        if count > 0:
            print("Planlar zaten mevcut.")
            return
        
        # Planları oluştur
        plans = [
            Plan(
                name="Free Plan",
                type=PlanType.FREE,
                price_monthly=Decimal("0.00"),
                price_yearly=Decimal("0.00"),
                currency="USD",
                max_dsar_requests=10,
                max_users=1,
                max_sources=1,
                features='["Basic DSAR", "Email support"]',
                is_active=True
            ),
            Plan(
                name="Starter Plan",
                type=PlanType.STARTER,
                price_monthly=Decimal("29.00"),
                price_yearly=Decimal("290.00"),
                currency="USD",
                max_dsar_requests=100,
                max_users=5,
                max_sources=3,
                features='["Advanced DSAR", "Priority support", "Export formats"]',
                is_active=True
            ),
            Plan(
                name="Pro Plan",
                type=PlanType.PRO,
                price_monthly=Decimal("99.00"),
                price_yearly=Decimal("990.00"),
                currency="USD",
                max_dsar_requests=1000,
                max_users=20,
                max_sources=10,
                features='["Unlimited DSAR", "24/7 support", "API access", "Custom exports"]',
                is_active=True
            ),
            Plan(
                name="Agency Plan",
                type=PlanType.AGENCY,
                price_monthly=Decimal("299.00"),
                price_yearly=Decimal("2990.00"),
                currency="USD",
                max_dsar_requests=10000,
                max_users=100,
                max_sources=50,
                features='["White label", "Custom integrations", "Dedicated manager", "SLA"]',
                is_active=True
            )
        ]
        
        for plan in plans:
            db.add(plan)
        
        await db.commit()
        print(f"{len(plans)} plan oluşturuldu!")
        break

if __name__ == "__main__":
    asyncio.run(seed_plans())
