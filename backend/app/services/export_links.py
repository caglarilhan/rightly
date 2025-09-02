import uuid
import datetime as dt
from sqlmodel import select
from ..database import get_session
from ..models import DownloadToken

TTL_HOURS = 24

def create_download_token(request_id: int, object_key: str) -> str:
    with get_session() as sess:
        tok = DownloadToken(
            request_id=request_id,
            token=str(uuid.uuid4()),
            object_key=object_key,
            expires_at=dt.datetime.utcnow() + dt.timedelta(hours=TTL_HOURS),
        )
        sess.add(tok)
        sess.commit()
        sess.refresh(tok)
        return str(tok.token)

def mark_used(token: str):
    with get_session() as sess:
        row = sess.exec(select(DownloadToken).where(DownloadToken.token == token)).first()
        if row:
            row.used_at = dt.datetime.utcnow()
            sess.add(row)
            sess.commit()

def revoke_token(token: str):
    with get_session() as sess:
        row = sess.exec(select(DownloadToken).where(DownloadToken.token == token)).first()
        if row:
            row.revoked = True
            sess.add(row)
            sess.commit()


