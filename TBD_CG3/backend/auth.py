from passlib.context import CryptContext
from datetime import datetime, timedelta
from jose import jwt
import os
import requests
from fastapi import HTTPException, Header, Depends
from dotenv import load_dotenv
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from uuid import UUID

# Load .env file
load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60
SUPABASE_URL = os.getenv("SUPABASE_URL")  
PROJECT_ID = SUPABASE_URL.replace("https://", "").split(".")[0]

JWKS_URL = f"https://{PROJECT_ID}.supabase.co/auth/v1/jwks"

JWKS = requests.get(JWKS_URL).json()

security = HTTPBearer()


pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str):
    # Truncate to 72 bytes (bcrypt limit)
    return pwd_context.hash(password[:72])


def verify_password(plain, hashed):
    return pwd_context.verify(plain, hashed)

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


def get_current_user_id(credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload.get("sub")

        if not user_id:
            raise HTTPException(status_code=401, detail="Invalid token")

        # Validate UUID format
        try:
            user_id = UUID(user_id)
        except:
            raise HTTPException(status_code=401, detail="Token sub is not a valid UUID")

        return {"id": user_id}

    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Invalid token")