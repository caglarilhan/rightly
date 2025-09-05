from fastapi import FastAPI, Request, Depends, HTTPException
import time
import logging
from fastapi.responses import JSONResponse, PlainTextResponse
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime
import uuid
from .core.config import settings
from .core.database import create_db_and_tables
from app.routes.v1.api import api_router

app = FastAPI(
    title="GDPR Hub Lite API",
    description="Küçük işletmeler için GDPR DSAR otomasyonu - DSAR request yönetimi, export ve compliance tracking",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json"
)

# CORS ayarları
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
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
        "env": settings.ENVIRONMENT,
        "version": "1.0.0",
        "database": "sqlite",
        "timestamp": datetime.utcnow().isoformat()
    }

@app.get("/") 
def version(): 
    return {"name": "gdpr-hub-lite", "version": "0.1.0"}

# Include v1 API router
app.include_router(api_router, prefix="/api/v1")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=9011, reload=True)
