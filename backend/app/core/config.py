from pydantic_settings import BaseSettings
from typing import Optional
import os

class Settings(BaseSettings):
    """Uygulama ayarları"""
    
    # Temel ayarlar
    APP_NAME: str = "GDPR Hub Lite"
    VERSION: str = "1.0.0"
    ENVIRONMENT: str = "development"
    DEBUG: bool = True
    
    # Database
    DATABASE_URL: str = "postgresql://user:password@localhost/gdpr_hub_lite"
    
    # Redis
    REDIS_URL: str = "redis://localhost:6379/0"
    
    # JWT
    SECRET_KEY: str = "your-secret-key-change-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # Shopify
    SHOPIFY_API_KEY: Optional[str] = None
    SHOPIFY_API_SECRET: Optional[str] = None
    SHOPIFY_SCOPES: str = "read_customers,read_orders,read_products"
    
    # Storage (Cloudflare R2)
    R2_ACCESS_KEY_ID: Optional[str] = None
    R2_SECRET_ACCESS_KEY: Optional[str] = None
    R2_BUCKET_NAME: str = "gdpr-hub-lite"
    R2_ENDPOINT_URL: str = "https://your-account-id.r2.cloudflarestorage.com"
    
    # Email
    SMTP_HOST: Optional[str] = None
    SMTP_PORT: int = 587
    SMTP_USER: Optional[str] = None
    SMTP_PASSWORD: Optional[str] = None
    FROM_EMAIL: str = "noreply@gdprhublite.com"
    
    # CORS
    ALLOWED_ORIGINS: list = ["http://localhost:3000", "http://localhost:8080"]
    
    # GDPR Ayarları
    DSAR_RESPONSE_DAYS: int = 30  # GDPR 30 gün kuralı
    DATA_RETENTION_DAYS: int = 30  # Export paketleri saklama süresi
    AUDIT_LOG_RETENTION_DAYS: int = 365  # Audit log saklama süresi
    
    class Config:
        env_file = ".env"
        case_sensitive = True

# Global settings instance
settings = Settings()

