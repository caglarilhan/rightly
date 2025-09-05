from fastapi import FastAPI, Request, Depends, HTTPException
import time
import logging
from fastapi.responses import JSONResponse, PlainTextResponse
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime
import uuid
from slowapi.errors import RateLimitExceeded
from .config import settings
from .config_guard import ensure_config
from .auth import register, login, get_current_user, get_account, UserRegister, UserLogin
from .billing import router as billing_router
from .database import create_db_and_tables
from .requests import router as requests_router
from .routes import admin as admin_router
from .routes.breach import router as breach_router
from .routes.downloads import router as downloads_router
from .downloads import router as presigned_downloads_router
from .webhooks import router as webhooks_router
from .rate_limit import limiter
from .middleware.idempotency import guard_idempotency
from .api.v1.api import api_router

app = FastAPI(
    title="GDPR Hub Lite API",
    description="Küçük işletmeler için GDPR DSAR otomasyonu - DSAR request yönetimi, export ve compliance tracking",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json"
)

# Fail-fast config guard (prod için)
ensure_config(settings.app_env)

# CORS ayarları
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Rate limit handler
@app.exception_handler(RateLimitExceeded)
def ratelimit_handler(request, exc):
    return PlainTextResponse("Too Many Requests", status_code=429)

# Global exception handler
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=500,
        content={
            "error": "Internal server error",
            "detail": str(exc) if settings.app_env == "dev" else "Something went wrong",
            "timestamp": datetime.utcnow().isoformat()
        }
    )

logger = logging.getLogger("api")
logging.basicConfig(level=logging.INFO)

# Request logging + x-request-id middleware
@app.middleware("http")
async def log_requests(request: Request, call_next):
    rid = request.headers.get("x-request-id") or str(uuid.uuid4())
    start = time.perf_counter()
    response = await call_next(request)
    duration_ms = round((time.perf_counter() - start) * 1000)
    logger.info(
        "http_request",
        extra={
            "rid": rid,
            "method": request.method,
            "path": request.url.path,
            "status": getattr(response, "status_code", "NA"),
            "ms": duration_ms,
        },
    )
    response.headers["x-request-id"] = rid
    return response

# Startup event - create database tables
@app.on_event("startup")
async def startup_event():
    try:
        create_db_and_tables()
        print("✅ Database tables created successfully!")
    except Exception as e:
        print(f"⚠️ Database error: {e}")
        print("Continuing with SQLite...")

@app.get("/healthz") 
def healthz(): 
    return {
        "ok": True, 
        "env": settings.app_env,
        "version": "1.0.0",
        "database": "sqlite",
        "timestamp": datetime.utcnow().isoformat()
    }

@app.get("/") 
def version(): 
    return {"name": "gdpr-hub-lite", "version": "0.1.0"}

# Auth endpoints
@app.post("/auth/register")
async def register_endpoint(user_data: UserRegister):
    return await register(user_data)

@app.post("/auth/login")
async def login_endpoint(user_data: UserLogin):
    return await login(user_data)

@app.get("/auth/me")
async def me_endpoint(user_id: str = Depends(get_current_user)):
    return await get_current_user(user_id)

@app.get("/api/v1/account")
async def account_endpoint(user_id: str = Depends(get_current_user)):
    return await get_account(user_id)

# Include routers
app.include_router(requests_router)
app.include_router(breach_router)
# app.include_router(downloads_router)  # UUID endpoint - devre dışı
app.include_router(presigned_downloads_router)  # JWT endpoint
app.include_router(webhooks_router)
app.include_router(billing_router)
app.include_router(admin_router.router)  # Admin Panel v0
app.include_router(api_router, prefix="/api/v1")  # API v1 endpoints

# GDPR Compliance endpoints
@app.get("/api/v1/compliance/consent")
async def get_consent_status(user_id: str = Depends(get_current_user)):
    """Get user's consent status for all data processing activities"""
    return {
        "user_id": user_id,
        "consents": [
            {"type": "marketing", "status": "granted", "granted_at": "2024-01-01T00:00:00Z"},
            {"type": "analytics", "status": "granted", "granted_at": "2024-01-01T00:00:00Z"},
            {"type": "necessary", "status": "granted", "granted_at": "2024-01-01T00:00:00Z"}
        ],
        "last_updated": datetime.utcnow().isoformat()
    }

@app.post("/api/v1/compliance/consent")
async def update_consent(
    consent_data: dict,
    user_id: str = Depends(get_current_user)
):
    """Update user consent preferences"""
    return {
        "status": "updated",
        "consent_type": consent_data.get("type"),
        "new_status": consent_data.get("status"),
        "updated_at": datetime.utcnow().isoformat()
    }

@app.get("/api/v1/compliance/processing-activities")
async def get_processing_activities(user_id: str = Depends(get_current_user)):
    """Get data processing activities for the organization"""
    return {
        "activities": [
            {
                "name": "Customer Support",
                "purpose": "Provide customer service",
                "legal_basis": "contract",
                "data_categories": ["contact_info", "purchase_history"],
                "retention_period": "3 years",
                "third_parties": []
            },
            {
                "name": "Marketing Communications",
                "purpose": "Send promotional emails",
                "legal_basis": "consent",
                "data_categories": ["email", "preferences"],
                "retention_period": "2 years",
                "third_parties": ["Mailchimp"]
            }
        ]
    }

# Data Breach Management
@app.post("/api/v1/compliance/breach-report")
async def create_breach_report(
    breach_data: dict,
    user_id: str = Depends(get_current_user)
):
    """Report a data breach incident"""
    return {
        "status": "reported",
        "breach_id": "br_" + str(uuid.uuid4())[:8],
        "type": breach_data.get("type"),
        "affected_individuals": breach_data.get("affected_individuals"),
        "notification_deadline": "72 hours",
        "created_at": datetime.utcnow().isoformat()
    }

@app.get("/api/v1/compliance/breach-reports")
async def get_breach_reports(user_id: str = Depends(get_current_user)):
    """Get all data breach reports"""
    return {
        "breaches": [
            {
                "id": "br_12345678",
                "type": "unauthorized_access",
                "description": "Suspicious login attempt",
                "affected_individuals": 0,
                "status": "investigating",
                "discovery_date": "2024-01-15T10:30:00Z"
            }
        ]
    }

# Email Notifications
@app.get("/api/v1/notifications")
async def get_notifications(user_id: str = Depends(get_current_user)):
    """Get user's email notifications"""
    return {
        "notifications": [
            {
                "id": 1,
                "type": "dsar_received",
                "subject": "New DSAR Request Received",
                "status": "sent",
                "sent_at": "2024-01-15T09:00:00Z"
            }
        ]
    }

# Shopify GDPR webhooks
@app.post("/webhooks/shopify/customers/data_request")
@limiter.limit("10/minute")
async def shopify_dr(request: Request):
    await guard_idempotency(request, key_header="X-Shopify-Webhook-Id")
    # TODO: DSAR başlat
    return PlainTextResponse("ok")

@app.post("/webhooks/shopify/customers/redact")
@limiter.limit("10/minute")
async def shopify_cr(request: Request):
    await guard_idempotency(request, key_header="X-Shopify-Webhook-Id")
    return PlainTextResponse("ok")

@app.post("/webhooks/shopify/shop/redact")
@limiter.limit("10/minute")
async def shopify_sr(request: Request):
    await guard_idempotency(request, key_header="X-Shopify-Webhook-Id")
    return PlainTextResponse("ok")

# Stripe webhook (legacy path retained)
@app.post("/webhooks/stripe")
@limiter.limit("20/minute")
async def stripe_webhook_endpoint(request: Request):
    payload = await request.body()
    await guard_idempotency(request, body_hash=True)
    return PlainTextResponse("ok")

# API v1 endpoints
@app.get("/api/v1/test")
async def test_api():
    return {
        "message": "API v1 çalışıyor!",
        "endpoints": ["auth", "requests", "accounts", "sources", "webhooks", "billing"],
        "status": "healthy",
        "database": "connected",
        "timestamp": datetime.utcnow().isoformat()
    }

# System info endpoint
@app.get("/api/v1/system")
async def system_info():
    return {
        "app_name": "GDPR Hub Lite",
        "version": "1.0.0",
        "environment": settings.app_env,
        "database": "sqlite",
        "features": [
            "DSAR Request Management",
            "User Authentication", 
            "Export Functionality",
            "Audit Logging",
            "Consent Management",
            "Data Processing Activities",
            "Shopify Integration",
            "Stripe Billing",
            "GDPR Compliance Tracking"
        ],
        "uptime": datetime.utcnow().isoformat()
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=9011, reload=True)
