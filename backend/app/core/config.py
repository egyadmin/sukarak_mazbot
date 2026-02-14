from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    PROJECT_NAME: str = "Sukarak Mazboot"
    API_V1_STR: str = "/api/v1"
    SECRET_KEY: str = "your-super-secret-key-change-it-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days

    # Database
    DATABASE_URL: str = "sqlite:///./sukarak.db"


    class Config:
        env_file = ".env"

settings = Settings()
