import os
import sys
import redis

REQUIRED_ENVS = [
    "DATABASE_URL",
    "R2_ENDPOINT_URL",
    "R2_BUCKET",
    "R2_ACCESS_KEY_ID",
    "R2_SECRET_ACCESS_KEY",
    "STRIPE_SECRET_KEY",
    "STRIPE_WEBHOOK_SECRET",
    "REDIS_URL",
]

def ensure_config(app_env: str | None = None):
    # Development ortamında esnek davran
    is_dev = app_env and app_env.lower() in {"dev", "development", "test"}

    missing = [k for k in REQUIRED_ENVS if not os.getenv(k)]
    if missing and not is_dev:
        sys.stderr.write(f"[FATAL] Missing envs: {', '.join(missing)}\n")
        sys.exit(2)

    # Prod ortamında Redis bağlantısını doğrula (fail-fast)
    if not is_dev:
        try:
            redis_url = os.getenv("REDIS_URL")
            if not redis_url:
                raise RuntimeError("REDIS_URL is empty")
            r = redis.from_url(redis_url)
            if r.ping() is not True:
                raise RuntimeError("Redis PING failed")
        except Exception as e:
            sys.stderr.write(f"[FATAL] Redis connectivity failed: {e}\n")
            sys.exit(2)


