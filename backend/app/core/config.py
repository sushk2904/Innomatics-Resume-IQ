from pydantic_settings import BaseSettings
from typing import List
import os
from pathlib import Path

class Settings(BaseSettings):
    # Application Settings
    APP_NAME: str = "ResumeIQ Backend"
    DEBUG: bool = True
    SECRET_KEY: str = "resumeiq-hackathon-secret-key-2025"
    
    # Database Settings
    DATABASE_URL: str = "sqlite:///./resumeiq.db"
    
    # CORS Settings
    ALLOWED_ORIGINS: List[str] = [
        "http://localhost:3000",    # React dev server
        "http://localhost:3001",    # Alternative React port
        "http://127.0.0.1:3000",   # Local IP
        "https://your-frontend.vercel.app",  # Production frontend
        "https://resumeiq-frontend.vercel.app"  # Your actual deployment
    ]
    
    # File Upload Settings
    MAX_FILE_SIZE: int = 10 * 1024 * 1024  # 10MB
    UPLOAD_DIR: Path = Path("uploads")
    ALLOWED_FILE_TYPES: List[str] = [".pdf", ".docx", ".doc"]
    
    # AI/ML Settings
    OPENAI_API_KEY: str = ""  # Set in .env file
    HUGGINGFACE_API_KEY: str = ""  # Set in .env file
    EMBEDDING_MODEL: str = "sentence-transformers/all-mpnet-base-v2"
    
    # Scoring Weights
    HARD_MATCH_WEIGHT: float = 0.4
    SOFT_MATCH_WEIGHT: float = 0.6
    
    # Analysis Settings
    MAX_ANALYSIS_TIME: int = 300  # 5 minutes in seconds
    BATCH_SIZE: int = 10
    
    # Security Settings
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    ALGORITHM: str = "HS256"
    
    # Redis Settings (optional, for caching)
    REDIS_URL: str = "redis://localhost:6379"
    REDIS_ENABLED: bool = False
    
    # Email Settings (for notifications)
    SMTP_HOST: str = "smtp.gmail.com"
    SMTP_PORT: int = 587
    SMTP_USERNAME: str = ""
    SMTP_PASSWORD: str = ""
    SMTP_FROM_EMAIL: str = "noreply@resumeiq.com"
    
    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"

# Global settings instance
_settings = None

def get_settings() -> Settings:
    """Get application settings (singleton pattern)"""
    global _settings
    if _settings is None:
        _settings = Settings()
        # Create upload directory if it doesn't exist
        _settings.UPLOAD_DIR.mkdir(exist_ok=True)
    return _settings

# Environment-specific configurations
class DevelopmentSettings(Settings):
    DEBUG: bool = True
    DATABASE_URL: str = "sqlite:///./resumeiq_dev.db"

class ProductionSettings(Settings):
    DEBUG: bool = False
    DATABASE_URL: str = "postgresql://user:password@localhost/resumeiq_prod"

class TestingSettings(Settings):
    DEBUG: bool = True
    DATABASE_URL: str = "sqlite:///./resumeiq_test.db"

def get_settings_for_env(environment: str = None) -> Settings:
    """Get settings based on environment"""
    if environment is None:
        environment = os.getenv("ENVIRONMENT", "development")
    
    if environment == "production":
        return ProductionSettings()
    elif environment == "testing":
        return TestingSettings()
    else:
        return DevelopmentSettings()
