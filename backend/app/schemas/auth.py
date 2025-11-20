from pydantic import BaseModel, EmailStr


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class RegisterRequest(BaseModel):
    email: EmailStr
    password: str


class AuthResponse(BaseModel):
    userId: str
    email: EmailStr


class TokenData(BaseModel):
    sub: str | None = None
