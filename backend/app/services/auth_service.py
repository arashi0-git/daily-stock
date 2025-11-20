from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.security import create_access_token, get_password_hash, verify_password
from app.models.user import User
from app.repositories.user_repository import UserRepository
from app.schemas.auth import AuthResponse, LoginRequest, RegisterRequest


class AuthService:
    def __init__(self, session: AsyncSession):
        self.repository = UserRepository(session)

    async def login(self, data: LoginRequest) -> tuple[AuthResponse, str]:
        user = await self.repository.get_by_email(data.email)

        # Timing attack mitigation
        password_valid = False
        if user:
            password_valid = verify_password(data.password, user.hashed_password)
        else:
            # Dummy verification to consume time
            # Use a pre-computed or cheap dummy hash to avoid double penalty,
            # but for now following the pattern of ensuring verify_password is called.
            # To avoid making "user not found" significantly slower (hash + verify vs verify),
            # we should ideally use a constant dummy hash.
            # For simplicity and safety, we'll generate one.
            verify_password(data.password, get_password_hash("dummy"))

        if not user or not password_valid:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect email or password",
                headers={"WWW-Authenticate": "Bearer"},
            )
        access_token = create_access_token(subject=user.id)
        return AuthResponse(userId=user.id, email=user.email), access_token

    async def register(self, data: RegisterRequest) -> tuple[AuthResponse, str]:
        existing_user = await self.repository.get_by_email(data.email)
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered",
            )

        hashed_password = get_password_hash(data.password)
        user = User(email=data.email, hashed_password=hashed_password)
        created_user = await self.repository.create(user)

        access_token = create_access_token(subject=created_user.id)
        return AuthResponse(userId=created_user.id, email=created_user.email), access_token
