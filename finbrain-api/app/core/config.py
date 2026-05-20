"""FinBrain API — Core configuration."""

from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""

    # Database
    postgres_url: str = "postgresql://finbrain:finbrain@localhost:5432/finbrain"

    # Redis
    redis_url: str = "redis://localhost:6379"

    # Auth
    jwt_secret: str = "change-me-to-a-256-bit-secret-in-production"
    jwt_algorithm: str = "HS256"
    jwt_expire_minutes: int = 1440

    # Anthropic
    anthropic_api_key: str = ""

    # App
    app_env: str = "development"
    app_debug: bool = True
    cors_origins: str = "http://localhost:3000"

    model_config = {"env_file": ".env", "env_file_encoding": "utf-8"}


settings = Settings()
