from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "FinTrack API"
    API_V1_STR: str = "/api/v1"
    SECRET_KEY: str = "MUST_BE_OVERRIDDEN_IN_PRODUCTION"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    POSTGRES_URL: str = "postgresql://localhost:5432/fintrack"
    REDIS_URL: str = "redis://localhost:6379"
    
    class Config:
        env_file = ".env"

settings = Settings()
