from typing import Annotated

from fastapi import APIRouter, Depends, Response
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.core.database import get_db
from app.schemas.auth import AuthResponse, LoginRequest, RegisterRequest
from app.services.auth_service import AuthService

router = APIRouter()


@router.post("/login", response_model=AuthResponse)
async def login(
    data: LoginRequest,
    response: Response,
    session: Annotated[AsyncSession, Depends(get_db)],
) -> AuthResponse:
    service = AuthService(session)
    auth_response, access_token = await service.login(data)

    response.set_cookie(
        key="access_token",
        value=f"Bearer {access_token}",
        httponly=True,
        secure=settings.AUTH_COOKIE_SECURE,
        samesite="lax",
        max_age=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
    )
    return auth_response


@router.post("/register", response_model=AuthResponse)
async def register(
    data: RegisterRequest,
    response: Response,
    session: Annotated[AsyncSession, Depends(get_db)],
) -> AuthResponse:
    service = AuthService(session)
    auth_response, access_token = await service.register(data)

    response.set_cookie(
        key="access_token",
        value=f"Bearer {access_token}",
        httponly=True,
        secure=settings.AUTH_COOKIE_SECURE,
        samesite="lax",
        max_age=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
    )
    return auth_response
