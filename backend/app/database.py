# Database connection and session management
from sqlmodel import create_engine, Session, SQLModel
from .config import settings

# Create database engine
engine = create_engine(
    settings.db_url,
    echo=True if settings.env == "dev" else False,
    pool_pre_ping=True
)

# Create all tables
def create_db_and_tables():
    from .models import User, Account, DSARRequest, AuditLog, DataSource
    SQLModel.metadata.create_all(engine)

# Get database session
def get_session():
    with Session(engine) as session:
        yield session
