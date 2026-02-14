from pydantic import BaseModel, EmailStr
from typing import Optional

class UserBase(BaseModel):
    email: Optional[EmailStr] = None
    name: Optional[str] = None
    phone: Optional[str] = None

class UserCreate(UserBase):
    email: EmailStr
    password: str
    name: str

class UserResponse(UserBase):
    id: int
    is_active: bool
    role: Optional[str] = "user"

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str
    user: Optional[dict] = None

class TokenPayload(BaseModel):
    sub: Optional[int] = None
