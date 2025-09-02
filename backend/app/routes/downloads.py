from fastapi import APIRouter, HTTPException
from fastapi.responses import RedirectResponse
from sqlmodel import select
from uuid import UUID
from datetime import datetime, timezone
from ..database import get_session
from ..models import DownloadToken
from ..services.r2 import presign_get_url
from ..services.export_links import mark_used

router = APIRouter(prefix="/api/v1/downloads", tags=["downloads"])

@router.get("/{token}")
def download_once(token: UUID):
    with get_session() as sess:
        row = sess.exec(select(DownloadToken).where(DownloadToken.token == str(token))).first()
        if not row:
            raise HTTPException(404, "Token not found")
        if row.revoked:
            raise HTTPException(410, "Token revoked")
        if row.used_at:
            raise HTTPException(410, "Token already used")
        if datetime.now(timezone.utc) > row.expires_at.replace(tzinfo=timezone.utc):
            raise HTTPException(410, "Token expired")

        url = presign_get_url(row.object_key, expires_seconds=900)
        mark_used(str(token))
        return RedirectResponse(url, status_code=302)

@router.post("/{token}/revoke")
def revoke(token: UUID):
    with get_session() as sess:
        row = sess.exec(select(DownloadToken).where(DownloadToken.token == str(token))).first()
        if not row:
            raise HTTPException(404)
        row.revoked = True
        sess.add(row)
        sess.commit()
        return {"ok": True}


