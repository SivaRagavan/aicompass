from fastapi import APIRouter, Depends, HTTPException, status
from pymongo.database import Database

from app.db.mongodb import get_db
from app.db.models import UserDocument
from app.schemas.auth import RegisterRequest, LoginRequest, AuthResponse, UserResponse
from app.security import create_access_token, hash_password, verify_password

router = APIRouter(prefix="/api/auth", tags=["auth"])


@router.post("/register", response_model=AuthResponse)
async def register(body: RegisterRequest, db: Database = Depends(get_db)):
    existing_user = db.users.find_one({"email": body.email})
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered"
        )

    hashed_password = hash_password(body.password)
    user_doc = UserDocument.create(email=body.email, password=hashed_password)
    result = db.users.insert_one(user_doc)
    user_id = str(result.inserted_id)

    token = create_access_token({"id": user_id, "email": body.email})

    return AuthResponse(
        user=UserResponse(id=user_id, email=body.email),
        token=token,
    )


@router.post("/login", response_model=AuthResponse)
async def login(body: LoginRequest, db: Database = Depends(get_db)):
    user = db.users.find_one({"email": body.email})
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials"
        )

    if not verify_password(body.password, user["password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials"
        )

    user_id = str(user["_id"])
    token = create_access_token({"id": user_id, "email": user["email"]})

    return AuthResponse(
        user=UserResponse(id=user_id, email=user["email"]),
        token=token,
    )
