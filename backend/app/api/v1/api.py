from fastapi import APIRouter

from app.api.v1.endpoints import requests, accounts, sources, webhooks, auth, billing

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["authentication"])
api_router.include_router(requests.router, prefix="/requests", tags=["requests"])
api_router.include_router(accounts.router, prefix="/accounts", tags=["accounts"])
api_router.include_router(sources.router, prefix="/sources", tags=["sources"])
api_router.include_router(webhooks.router, prefix="/webhooks", tags=["webhooks"])
api_router.include_router(billing.router, prefix="/billing", tags=["billing"])
