from fastapi import FastAPI, HTTPException, Depends, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
import uvicorn
from datetime import datetime
import os
import logging
import time

from app.core.config import settings
from app.core.database import engine, Base
from app.api.v1.api import api_router
from app.core.logging import setup_logging

# Logging setup
setup_logging()

# FastAPI uygulaması
app = FastAPI(
    title="GDPR Hub Lite API",
    description="Küçük işletmeler için GDPR DSAR otomasyonu",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Security middleware
app.add_middleware(
    TrustedHostMiddleware, 
    allowed_hosts=["localhost", "127.0.0.1", "*.vercel.app"]
)

# CORS ayarları
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Production'da spesifik domain'ler
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request timing middleware
@app.middleware("http")
async def add_process_time_header(request: Request, call_next):
    """Request timing middleware"""
    start_time = time.time()
    response = await call_next(request)
    process_time = time.time() - start_time
    response.headers["X-Process-Time"] = str(process_time)
    return response

# Global error handlers
@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    """HTTP exception handler"""
    logger = logging.getLogger(__name__)
    logger.error(f"HTTP {exc.status_code}: {exc.detail} - {request.url}")
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "error": exc.detail,
            "status_code": exc.status_code,
            "timestamp": datetime.utcnow().isoformat()
        }
    )

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    """Validation error handler"""
    logger = logging.getLogger(__name__)
    logger.error(f"Validation error: {exc.errors()} - {request.url}")
    return JSONResponse(
        status_code=422,
        content={
            "error": "Validation error",
            "details": exc.errors(),
            "timestamp": datetime.utcnow().isoformat()
        }
    )

@app.exception_handler(Exception)
async def general_exception_handler(request: Request, exc: Exception):
    """General exception handler"""
    logger = logging.getLogger(__name__)
    logger.error(f"Unhandled exception: {str(exc)} - {request.url}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={
            "error": "Internal server error",
            "timestamp": datetime.utcnow().isoformat()
        }
    )

# Startup ve shutdown events
@app.on_event("startup")
async def startup_event():
    """Uygulama başlangıcında çalışır"""
    logger = logging.getLogger(__name__)
    logger.info("🚀 GDPR Hub Lite API başlatılıyor...")
    
    # Database tablolarını oluştur
    try:
        async with engine.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)
        logger.info("✅ Database tabloları oluşturuldu")
    except Exception as e:
        logger.error(f"❌ Database tabloları oluşturulamadı: {e}")

@app.on_event("shutdown")
async def shutdown_event():
    """Uygulama kapanırken çalışır"""
    logger = logging.getLogger(__name__)
    logger.info("🛑 GDPR Hub Lite API kapatılıyor...")
    
    # Database bağlantısını kapat
    try:
        await engine.dispose()
        logger.info("✅ Database bağlantısı kapatıldı")
    except Exception as e:
        logger.error(f"❌ Database bağlantısı kapatılamadı: {e}")

# API router'ı ekle
app.include_router(api_router, prefix="/api/v1")

@app.get("/")
async def root():
    """Ana endpoint"""
    return {
        "message": "GDPR Hub Lite API",
        "version": "1.0.0",
        "status": "active",
        "timestamp": datetime.utcnow().isoformat()
    }

@app.get("/health")
@app.get("/healthz")
async def health_check():
    """Sağlık kontrolü"""
    from app.core.database import check_db_health
    
    # Database sağlık kontrolü
    db_healthy = await check_db_health()
    
    # Genel durum
    status = "healthy" if db_healthy else "degraded"
    
    return {
        "status": status,
        "timestamp": datetime.utcnow().isoformat(),
        "service": "gdpr-hub-lite",
        "database": "healthy" if db_healthy else "unhealthy",
        "version": "1.0.0"
    }

@app.get("/version")
async def version():
    """Versiyon bilgisi"""
    return {
        "version": "1.0.0",
        "build": os.getenv("BUILD_ID", "local"),
        "environment": settings.ENVIRONMENT
    }

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=9011,
        reload=True,
        log_level="info"
    )

