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

    DATABASE_POOL_SIZE: int = 16
    DATABASE_POOL_TTL: int = 60 * 20    #20 minutes
    DATABASE_POOL_PRE_PING: bool = True

    TRUST_COOKIE: str
    TRUST_AUD: str
    TRUST_TTL_SEC: int = 30 * 24 * 3600 # 30 days

    CORS_ORIGIN: list[str] = ["*"]
    CORS_ORIGIN_REGEX: str | None = None
    CORS_HEADERS: list[str] = ["*"]

    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRES: int = 86400   #seconds
    REFRESH_TOKEN_EXPIRES: int = 30     #days

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