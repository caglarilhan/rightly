from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import Optional
import jwt
import datetime
import os

# Auth Models
class UserLogin(BaseModel):
    email: str
    password: Optional[str] = None

class UserRegister(BaseModel):
    email: str
    password: Optional[str] = None
    company_name: str

class User(BaseModel):
    id: int
    email: str
    company_name: str
    role: str = "admin"

# JWT Settings
SECRET_KEY = os.getenv("JWT_SECRET_KEY", "dev_secret_key")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# Mock Database (replace with real DB)
users_db = {}
accounts_db = {}

security = HTTPBearer()

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.datetime.utcnow() + datetime.timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def verify_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        payload = jwt.decode(credentials.credentials, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid token")
        return user_id
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

# Auth functions (not endpoints)
async def register(user: UserRegister):
    if user.email in users_db:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    user_id = len(users_db) + 1
    users_db[user.email] = {
        "id": user_id,
        "email": user.email,
        "company_name": user.company_name,
        "role": "admin"
    }
    
    # Create account
    account_id = len(accounts_db) + 1
    accounts_db[account_id] = {
        "id": account_id,
        "name": user.company_name,
        "plan": "free",
        "subscription_status": "active"
    }
    
    access_token = create_access_token(data={"sub": str(user_id)})
    return {"access_token": access_token, "token_type": "bearer"}

async def login(user: UserLogin):
    if user.email not in users_db:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    user_data = users_db[user.email]
    access_token = create_access_token(data={"sub": str(user_data["id"])})
    return {"access_token": access_token, "token_type": "bearer"}

async def get_current_user(user_id: str):
    for user in users_db.values():
        if str(user["id"]) == user_id:
            return user
    raise HTTPException(status_code=404, detail="User not found")

async def get_account(user_id: str):
    # Find user's account
    for account in accounts_db.values():
        if account["id"] == int(user_id):
            return account
    raise HTTPException(status_code=404, detail="Account not found")
