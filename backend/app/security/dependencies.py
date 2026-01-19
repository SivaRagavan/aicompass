from typing import Optional

from bson import ObjectId
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from pymongo.database import Database

from app.db.mongodb import get_db
from app.security.tokens import verify_token

security = HTTPBearer(auto_error=False)


def get_current_user_id(
    credentials: HTTPAuthorizationCredentials = Depends(security),
) -> Optional[str]:
    if not credentials:
        return None

    token = credentials.credentials
    payload = verify_token(token)
    if payload is None:
        return None

    return payload.get("id")


def require_auth(user_id: Optional[str] = Depends(get_current_user_id)) -> str:
    if user_id is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Unauthorized",
        )
    return user_id


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Database = Depends(get_db),
) -> dict:
    if not credentials:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Unauthorized",
        )

    token = credentials.credentials
    payload = verify_token(token)
    if payload is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token",
        )

    user_id = payload.get("id")
    if user_id is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token",
        )

    try:
        user = db.users.find_one({"_id": ObjectId(user_id)})
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid user ID",
        )

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found",
        )

    return user
