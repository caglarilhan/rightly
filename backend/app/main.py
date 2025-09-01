from fastapi import FastAPI, Request, Depends, HTTPException
from fastapi.responses import JSONResponse, PlainTextResponse
from fastapi.middleware.cors import CORSMiddleware
from .config import settings
from .auth import register, login, get_current_user, get_account, UserRegister, UserLogin
from .billing import create_checkout_session, stripe_webhook, get_plans, update_subscription, CreateCheckoutSession, SubscriptionUpdate

app = FastAPI(
    title="GDPR Hub Lite API",
    description="Küçük işletmeler için GDPR DSAR otomasyonu",
    version="1.0.0"
)

# CORS ayarları
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/healthz") 
def healthz(): 
    return {"ok": True, "env": settings.env}

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

# Billing endpoints
@app.post("/billing/create-checkout-session")
async def billing_checkout(data: CreateCheckoutSession):
    return await create_checkout_session(data)

@app.post("/billing/webhook")
async def billing_webhook(request: dict):
    return await stripe_webhook(request)

@app.get("/billing/plans")
async def billing_plans():
    return await get_plans()

@app.post("/billing/update-subscription")
async def billing_update(data: SubscriptionUpdate):
    return await update_subscription(data)

# Shopify GDPR webhooks
@app.post("/webhooks/shopify/customers/data_request")
async def shopify_dr(req: Request):
    body = await req.json()
    # TODO: DSAR başlat
    return PlainTextResponse("ok")

@app.post("/webhooks/shopify/customers/redact")
async def shopify_cr(req: Request):
    return PlainTextResponse("ok")

@app.post("/webhooks/shopify/shop/redact")
async def shopify_sr(req: Request):
    return PlainTextResponse("ok")

# Stripe webhook (billing)
@app.post("/webhooks/stripe")
async def stripe_webhook_endpoint(req: Request):
    payload = await req.body()
    # TODO: subscription status güncelle
    return PlainTextResponse("ok")

# API v1 endpoints
@app.get("/api/v1/test")
async def test_api():
    return {
        "message": "API v1 çalışıyor!",
        "endpoints": ["auth", "requests", "accounts", "sources", "webhooks", "billing"]
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=settings.port, reload=True)
