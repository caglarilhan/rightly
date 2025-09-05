"""
Main API router for v1 endpoints
"""
from fastapi import APIRouter

from app.routes.v1 import consent, breach, meta, export, compliance

# Create main API router
api_router = APIRouter()

# Include sub-routers
api_router.include_router(consent.router, tags=["consent"])
api_router.include_router(breach.router, tags=["breach"])
api_router.include_router(meta.router, tags=["meta"])
api_router.include_router(export.router, tags=["export"])
api_router.include_router(compliance.router, tags=["compliance"])
