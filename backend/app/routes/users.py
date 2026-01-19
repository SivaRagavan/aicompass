from fastapi import APIRouter, Depends

from app.schemas.users import UserResponse
from app.security import get_current_user

router = APIRouter(prefix="/api/auth", tags=["auth"])


@router.get("/me", response_model=UserResponse)
async def me(user: dict = Depends(get_current_user)):
    return UserResponse(id=str(user["_id"]), email=user["email"])
