import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    port = int(os.getenv("PORT", 8001))
    env = os.getenv("ENV", "dev")
    db_url = os.getenv("DATABASE_URL", "sqlite:///./gdpr_hub_lite.db")
    redis_url = os.getenv("REDIS_URL", "redis://localhost:6379/0")
    shopify_webhook_secret = os.getenv("SHOPIFY_WEBHOOK_SECRET", "")
    stripe_secret_key = os.getenv("STRIPE_SECRET_KEY", "")
    stripe_wh_secret = os.getenv("STRIPE_WEBHOOK_SECRET", "")
    r2 = {
        "endpoint": os.getenv("R2_ENDPOINT_URL", ""),
        "region": os.getenv("R2_REGION", "auto"),
        "bucket": os.getenv("R2_BUCKET", ""),
        "ak": os.getenv("R2_ACCESS_KEY_ID", ""),
        "sk": os.getenv("R2_SECRET_ACCESS_KEY", ""),
    }

settings = Settings()
