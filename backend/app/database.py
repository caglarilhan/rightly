# Database connection and session management
from sqlmodel import create_engine, Session, SQLModel
from .config import settings

# Create database engine
engine = create_engine(
    settings.database_url,
    echo=True if settings.app_env == "dev" else False,
    connect_args={"check_same_thread": False} if "sqlite" in settings.database_url else {}
)

# Create all tables
def create_db_and_tables():
    from .models import User, Account, DSARRequest, AuditLog, DataSource, Consent, ProcessingActivity, EmailNotification, EmailSuppression, DataBreachReport, BreachEvent, DownloadToken
    SQLModel.metadata.create_all(engine)

# Get database session
def get_session():
    with Session(engine) as session:
        yield session
