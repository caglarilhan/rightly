from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import uvicorn
from datetime import datetime
import os

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

# CORS ayarları
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Production'da spesifik domain'ler
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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
async def health_check():
    """Sağlık kontrolü"""
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat(),
        "service": "gdpr-hub-lite"
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
        host="127.0.0.1",
        port=8010,
        reload=True,
        log_level="info"
    )

