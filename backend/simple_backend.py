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

@app.get("/healthz")
async def healthz():
    return {"ok": True, "env": "dev"}

@app.get("/api/v1/test")
async def test_api():
    return {
        "message": "API v1 çalışıyor!",
        "endpoints": ["auth", "requests", "accounts", "sources", "webhooks", "billing"]
    }

if __name__ == "__main__":
    uvicorn.run("simple_backend:app", host="127.0.0.1", port=8001, reload=True)
