import asyncio
from fastapi import FastAPI
from fastapi.testclient import TestClient
from app.api.v1.endpoints.auth import router

app = FastAPI()
app.include_router(router, prefix="/auth")

client = TestClient(app)

def test_register():
    """Register endpoint'ini test et"""
    response = client.post("/auth/register", json={
        "email": "test6@example.com",
        "full_name": "Test User 6",
        "password": "testpass123"
    })
    print(f"Register Status: {response.status_code}")
    print(f"Register Response: {response.text}")

def test_login():
    """Login endpoint'ini test et"""
    response = client.post("/auth/login", json={
        "email": "test5@example.com",
        "password": "testpass123"
    })
    print(f"Login Status: {response.status_code}")
    print(f"Login Response: {response.text}")

if __name__ == "__main__":
    test_register()
    print("\n" + "="*50 + "\n")
    test_login()
