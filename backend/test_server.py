from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

app = FastAPI(
    title="GDPR Hub Lite Test API",
    description="Test server for GDPR Hub Lite",
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
    return {"message": "GDPR Hub Lite Test API", "status": "running"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "gdpr-hub-lite-test"}

@app.get("/test")
async def test():
    return {"message": "Test endpoint çalışıyor!"}

if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8010)
