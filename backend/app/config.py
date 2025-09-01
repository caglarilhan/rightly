import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    port = int(os.getenv("PORT", 9011))
    env = os.getenv("APP_ENV", "dev")
    db_url = os.getenv("DATABASE_URL", "postgresql+psycopg://rightly:password@localhost:5433/rightly")
    redis_url = os.getenv("REDIS_URL", "redis://localhost:6380/0")
    jwt_secret = os.getenv("JWT_SECRET", "change-me")
    jwt_expire_min = int(os.getenv("JWT_EXPIRE_MIN", "30"))
    refresh_expire_days = int(os.getenv("REFRESH_EXPIRE_DAYS", "14"))
    allowed_origins = os.getenv("ALLOWED_ORIGINS", "http://localhost:3001")
    shopify_webhook_secret = os.getenv("SHOPIFY_WEBHOOK_SECRET", "")
    stripe_secret_key = os.getenv("STRIPE_SECRET_KEY", "")
    stripe_wh_secret = os.getenv("STRIPE_WEBHOOK_SECRET", "")
    r2 = {
        "endpoint": os.getenv("R2_ENDPOINT", ""),
        "bucket": os.getenv("R2_BUCKET", ""),
        "ak": os.getenv("R2_ACCESS_KEY_ID", ""),
        "sk": os.getenv("R2_SECRET_ACCESS_KEY", ""),
    }

settings = Settings()
