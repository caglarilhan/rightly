import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    port = int(os.getenv("PORT", 9011))
    app_env = os.getenv("APP_ENV", "dev")
    database_url = os.getenv("DATABASE_URL", "sqlite:///./app.db")
    redis_url = os.getenv("REDIS_URL", "redis://localhost:6380/0")
    jwt_secret = os.getenv("JWT_SECRET", "change-me")
    jwt_expire_min = int(os.getenv("JWT_EXPIRE_MIN", "30"))
    refresh_expire_days = int(os.getenv("REFRESH_EXPIRE_DAYS", "14"))
    allowed_origins = os.getenv("ALLOWED_ORIGINS", "http://localhost:3001")
    shopify_webhook_secret = os.getenv("SHOPIFY_WEBHOOK_SECRET", "")
    stripe_secret_key = os.getenv("STRIPE_SECRET_KEY", "")
    stripe_wh_secret = os.getenv("STRIPE_WEBHOOK_SECRET", "")
    r2_endpoint = os.getenv("R2_ENDPOINT", "")
    r2_bucket = os.getenv("R2_BUCKET", "")
    r2_access_key_id = os.getenv("R2_ACCESS_KEY_ID", "")
    r2_secret_access_key = os.getenv("R2_SECRET_ACCESS_KEY", "")

settings = Settings()
