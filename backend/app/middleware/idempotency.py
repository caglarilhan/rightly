import hashlib
import os
import redis
from fastapi import Request, HTTPException

_r = redis.from_url(os.getenv("REDIS_URL", "redis://localhost:6380/0"))
WINDOW_SEC = 60 * 10

async def guard_idempotency(request: Request, key_header: str | None = None, body_hash: bool = False):
    if key_header:
        header_value = request.headers.get(key_header)
        key = f"idemp:{header_value}" if header_value else None
    else:
        key = None

    if not key and body_hash:
        body = await request.body()
        key = "idemp:" + hashlib.sha256(body).hexdigest()

    if not key:
        # if nothing to key on, allow
        return

    ok = _r.set(name=key, value="1", ex=WINDOW_SEC, nx=True)
    if not ok:
        # duplicate; return idempotent success
        print(f"idempotent=skip key={key}")
        raise HTTPException(status_code=200, detail="Duplicate webhook")


