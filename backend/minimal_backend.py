from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

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

@app.get("/")
async def root():
    return {
        "message": "GDPR Hub Lite API",
        "version": "1.0.0",
        "status": "active"
    }

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "service": "gdpr-hub-lite"
    }

# Authentication endpoints
@app.post("/api/v1/auth/register")
async def register():
    return {"message": "Register endpoint - TODO"}

@app.post("/api/v1/auth/login")
async def login():
    return {"message": "Login endpoint - TODO"}

# DSAR endpoints
@app.get("/api/v1/requests")
async def get_requests():
    return {"message": "Get requests endpoint - TODO"}

@app.post("/api/v1/requests")
async def create_request():
    return {"message": "Create request endpoint - TODO"}

# Webhook endpoints
@app.post("/api/v1/webhooks/shopify")
async def shopify_webhook():
    return {"message": "Shopify webhook endpoint - TODO"}

@app.post("/api/v1/webhooks/woocommerce")
async def woocommerce_webhook():
    return {"message": "WooCommerce webhook endpoint - TODO"}

if __name__ == "__main__":
    uvicorn.run("minimal_backend:app", host="127.0.0.1", port=8010, reload=True)
