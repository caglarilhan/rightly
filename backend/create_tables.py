import asyncio
from app.core.database import engine, Base
from app.models.user import User
from app.models.account import Account
from app.models.request import Request
from app.models.audit_log import AuditLog
from app.models.source import Source
from app.models.export_bundle import ExportBundle
from app.models.billing import Plan, Subscription, Payment

async def create_tables():
    """Veritabanı tablolarını oluştur"""
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    print("Tablolar başarıyla oluşturuldu!")

if __name__ == "__main__":
    asyncio.run(create_tables())
