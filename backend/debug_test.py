from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def root():
    return {"message": "Backend çalışıyor!"}

@app.get("/healthz")
def healthz():
    return {"ok": True, "status": "active"}

if __name__ == "__main__":
    import uvicorn
    print("🚀 Backend başlatılıyor...")
    uvicorn.run(app, host="127.0.0.1", port=9011, log_level="debug")
