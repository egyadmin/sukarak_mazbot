from pydantic_settings import BaseSettings
from typing import Optional
import os

# Get the project root directory (parent of backend/)
_backend_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
_project_root = os.path.dirname(_backend_dir)
_db_path = os.path.join(_project_root, "sukarak.db")

class Settings(BaseSettings):
    PROJECT_NAME: str = "Sukarak Mazboot"
    API_V1_STR: str = "/api/v1"
    SECRET_KEY: str = "your-super-secret-key-change-it-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days

    # Database - absolute path to sukarak.db in backend folder
    DATABASE_URL: str = f"sqlite:///{_db_path}"


    class Config:
        env_file = ".env"

settings = Settings()

