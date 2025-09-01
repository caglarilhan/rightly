from fastapi import FastAPI

app = FastAPI()

@app.get("/test")
def test():
    return {"message": "Test OK"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=9011)
