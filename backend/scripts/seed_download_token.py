import os
import uuid
import datetime as dt
from sqlmodel import SQLModel, create_engine, Session
from sqlmodel import Field
from typing import Optional

DB = os.getenv("DATABASE_URL", "sqlite:///./app.db")
engine = create_engine(DB)

class DownloadToken(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    request_id: int
    token: str
    object_key: str
    expires_at: dt.datetime
    used_at: Optional[dt.datetime] = None
    revoked: bool = False
    created_at: dt.datetime = Field(default_factory=lambda: dt.datetime.utcnow())

SQLModel.metadata.create_all(engine)

tok = str(uuid.uuid4())
with Session(engine) as s:
    dtok = DownloadToken(
        request_id=1,
        token=tok,
        object_key=os.getenv("SEED_OBJECT_KEY", "exports/demo-export.zip"),
        expires_at=dt.datetime.utcnow() + dt.timedelta(hours=24),
    )
    s.add(dtok)
    s.commit()

print(f"TOKEN_UUID={tok}")


