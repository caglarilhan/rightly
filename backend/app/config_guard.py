import os
import sys

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
    if app_env and app_env.lower() in {"dev", "development", "test"}:
        return  # development'ta esnek bırak
    missing = [k for k in REQUIRED_ENVS if not os.getenv(k)]
    if missing:
        sys.stderr.write(f"[FATAL] Missing envs: {', '.join(missing)}\n")
        sys.exit(2)


