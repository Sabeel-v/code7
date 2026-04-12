from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "Business Pro API"
    SECRET_KEY: str = "your-super-secret-key-change-me"  # Should be changed in production
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 1 week

    # Use a default fallback or read from environment variable
    DATABASE_URL: str = "postgresql://user:password@localhost/business_pro_db"

    class Config:
        env_file = ".env"

settings = Settings()
