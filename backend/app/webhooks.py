import os, json, base64, hashlib, hmac
import redis.asyncio as redis
from fastapi import APIRouter, Header, HTTPException, Request
from .tasks import discover, erase

router = APIRouter()
SHOPIFY_SECRET = os.environ.get("SHOPIFY_API_SECRET", "dev_secret")
REDIS_URL      = os.environ.get("REDIS_URL", "redis://127.0.0.1:6379/0")

def verify_hmac(raw: bytes, sig: str) -> bool:
	digest = hmac.new(SHOPIFY_SECRET.encode(), raw, hashlib.sha256).digest()
	return hmac.compare_digest(base64.b64encode(digest).decode(), sig or "")

@router.post("/webhooks/gdpr")
async def shopify_gdpr(
	request: Request,
	x_shopify_hmac_sha256: str = Header(None),
	x_shopify_topic: str = Header(None),
	x_shopify_shop_domain: str = Header(None),
):
	raw = await request.body()
	if not verify_hmac(raw, x_shopify_hmac_sha256):
		raise HTTPException(401, "bad_hmac")

	body_hash = hashlib.sha256(raw).hexdigest()
	key = f"idemp:{x_shopify_shop_domain}:{x_shopify_topic}:{body_hash}"

	r = await redis.from_url(REDIS_URL, encoding="utf-8", decode_responses=True)
	ok = await r.set(key, "1", ex=86400, nx=True)
	if not ok:
		return {"ok": True, "dedup": True}

	payload = json.loads(raw.decode() or "{}")

	if x_shopify_topic == "customers/data_request":
		discover.delay(payload.get("request_id", "req"), x_shopify_shop_domain, payload.get("email"))
	elif x_shopify_topic == "customers/redact":
		erase.delay(payload.get("request_id", "req"), x_shopify_shop_domain, payload)
	elif x_shopify_topic == "shop/redact":
		pass

	return {"ok": True}


