from pathlib import Path
from pydantic import computed_field, PostgresDsn
from pydantic_core import MultiHostUrl
from pydantic_settings import BaseSettings, SettingsConfigDict

from src.core.constants import Environment

BASE_DIR = Path(__file__).resolve().parents[3]

class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=BASE_DIR / ".env", env_ignore_empty=True, extra="ignore"
    )

    APP_KEY: str
    ENVIRONMENT: Environment = Environment.LOCAL

    POSTGRES_DB: str
    POSTGRES_USER: str
    POSTGRES_PASSWORD: str
    POSTGRES_PORT: int
    POSTGRES_HOST: str
    SQLALCHEMY_DATABASE_URL: str

    MAIL_SERVER: str = "smtp.sendgrid.net"
    MAIL_PORT: int = 2525
    MAIL_USERNAME: str
    MAIL_PASSWORD: str
    MAIL_FROM: str
    MAIL_TLS: bool = True
    FRONTEND_URL: str

    REDIS_HOST: str
    REDIS_PORT: int

    AWS_ACCESS_KEY: str
    AWS_SECRET_ACCESS_KEY: str
    AWS_REGION: str
    S3_BUCKET: str

    CHAT_ATTACHMENT_MAX_BYTES: int = 10 * 1024 * 1024
    CHAT_ATTACHMENT_ALLOWED_CONTENT_TYPES: list[str] = [
        "image/png",
        "image/jpeg",
        "image/webp",
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ]
    CHAT_RATE_LIMIT_MAX_EVENTS: int = 30
    CHAT_RATE_LIMIT_WINDOW_SECONDS: int = 10

    DATABASE_POOL_SIZE: int = 16
    DATABASE_POOL_TTL: int = 60 * 20    #20 minutes
    DATABASE_POOL_PRE_PING: bool = True

    CORS_ORIGIN: list[str] = ["*"]
    CORS_ORIGIN_REGEX: str | None = None
    CORS_HEADERS: list[str] = ["*"]

    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRES: int = 86400   #seconds
    REFRESH_TOKEN_EXPIRES: int = 30     #days

    ADMIN_EMAIL: str = "fallfree498@gmail.com"
    ADMIN_USERNAME: str = "Admin"
    ADMIN_PASSWORD: str = "Admin123!"

    LEGAL_AI_MODEL_ID: str = "legal-connect-vi-law-qa"
    LEGAL_AI_PROVIDER_BASE_URL: str | None = None
    LEGAL_AI_API_KEY: str | None = None
    LEGAL_AI_TEMPERATURE: float = 0.1
    LEGAL_AI_MAX_OUTPUT_TOKENS: int = 800
    LEGAL_AI_CONFIDENCE_THRESHOLD: float = 0.42
    LEGAL_AI_SUGGESTION_COUNT: int = 3
    LEGAL_AI_DISCLAIMER: str = (
        "Câu trả lời do AI cung cấp chỉ mang tính tham khảo và không thay thế tư vấn pháp lý chuyên nghiệp."
    )
    LEGAL_AI_DATASET_PATH: str = str(BASE_DIR / "backend" / "data" / "vi-law-qa-3161.csv")
    LEGAL_AI_LOG_SAMPLE_RATE: float = 1.0

    @computed_field
    @property
    def ASYNC_DATABASE_URI(self) -> PostgresDsn:
        return MultiHostUrl.build(
            scheme="postgresql+asyncpg",
            username=self.POSTGRES_USER,
            password=self.POSTGRES_PASSWORD,
            host=self.POSTGRES_HOST,
            port=self.POSTGRES_PORT,
            path=self.POSTGRES_DB
        )
    
settings = Settings()