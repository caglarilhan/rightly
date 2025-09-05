from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlmodel import SQLModel
from app.core.config import settings
import logging

logger = logging.getLogger(__name__)

# Database URL'yi sync için düzenle (SQLite kullan)
database_url = "sqlite:///gdpr_hub_lite.db"

# Sync engine
engine = create_engine(
    database_url,
    echo=settings.DEBUG,
    pool_pre_ping=True,
    pool_recycle=300,
)

# Session factory
SessionLocal = sessionmaker(
    engine,
    expire_on_commit=False
)

# Note: We use SQLModel metadata; no Declarative Base required

# Dependency to get database session
def get_db():
    """Database session dependency"""
    with SessionLocal() as session:
        try:
            yield session
        except Exception as e:
            logger.error(f"Database session error: {e}")
            session.rollback()
            raise
        finally:
            session.close()

# Context manager for Celery tasks
def get_db_session():
    """Database session context manager for Celery tasks"""
    return SessionLocal()

# Database health check
def check_db_health():
    """Database sağlık kontrolü"""
    try:
        with engine.connect() as conn:
            conn.execute("SELECT 1")
        return True
    except Exception as e:
        logger.error(f"Database health check failed: {e}")
        return False

# Create database tables
def create_db_and_tables():
    """Create all database tables"""
    try:
        # Import models to ensure they are registered, then create all via SQLModel
        import app.models  # noqa: F401
        SQLModel.metadata.create_all(bind=engine)
        logger.info("Database tables created successfully")
    except Exception as e:
        logger.error(f"Failed to create database tables: {e}")
        raise
