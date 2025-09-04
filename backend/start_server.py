import uvicorn
from main import app

if __name__ == "__main__":
    print("Starting GDPR Hub Lite API server...")
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8003,
        reload=True,
        log_level="info"
    )





