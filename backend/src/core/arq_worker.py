from arq import cron
from arq.connections import RedisSettings

from src.auth.utils import send_reset_email, send_login_otp_email, send_verification_email
from src.core.config import settings


class WorkerSettings:
    functions = {
        send_reset_email,
        send_login_otp_email,
        send_verification_email
    }

    redis_settings = RedisSettings(
        host=settings.REDIS_HOST,
        port=settings.REDIS_PORT,
        database=0
    )