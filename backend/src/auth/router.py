import uuid

from fastapi import Depends, APIRouter, Request, Response, Body
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.future import select
from jose import JWTError
from arq import create_pool
from arq.connections import RedisSettings

from src.core.database import SessionDep
from src.core.config import settings
from src.core.constants import Environment
from src.core.exceptions import NotAuthenticated

from src.auth.services import (
    create_access_token,
    create_refresh_token,
    decode_token,
    verify_password,
    create_trust_token,
    verify_trust_token
)
from src.auth.exceptions import (
    InvalidToken, 
    EmailNotVerified,
    InvalidPassword,
    LoginCodeExpired
)

from src.user.exceptions import UserNotFound
from src.user.models import User

auth_route = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)


#      LOGIN ROUTE      #

@auth_route.post('/login')
async def login(request: Request, 
                db: SessionDep,
                login_request: OAuth2PasswordRequestForm = Depends()):
    result = await db.execute(select(User).where(User.email == login_request.username))
    user = result.scalar_one_or_none()

    if not user:
        raise UserNotFound()
    if not getattr(user, "is_email_verified", False):
        raise EmailNotVerified()
    if not verify_password(login_request.password, user.hashed_password):
        raise InvalidPassword()
    
    tdv = request.cookies.get(settings.TRUST_COOKIE)
    if tdv and verify_trust_token(tdv, str(user.id), request.headers.get("user-agent", "")):
        access_token = create_access_token(data={"sub": user.email})
        refresh_token = create_refresh_token(data={"sub": user.email})
        return {"access_token": access_token, "refresh_token": refresh_token, "token_type": "bearer"}
    
    code = f"{uuid.uuid4().int % 1_000_000:06d}"
    redis = await create_pool(RedisSettings(host = settings.REDIS_HOST, port = settings.REDIS_PORT))
    key = f"login_otp:{user.id}"
    await redis.setex(key, 5 * 60, code)
    await redis.enqueue_job("send_login_otp_email", user.email, code)

    return {"otp_required": True, "user_id": str(user.id)}


@auth_route.post('/login/verify')
async def login_verify(request: Request,
                       response: Response,
                       db: SessionDep,
                       user_id: str = Body(...),
                       code: str = Body(...),
                       remember: bool = Body(...)):
    redis = await create_pool(RedisSettings(host=settings.REDIS_HOST, port=settings.REDIS_PORT))

    key = f"login_otp:{user_id}"
    stored = await redis.get(key)
    if not stored:
        raise LoginCodeExpired()
    
    stored_code = stored.decode() if isinstance(stored, (bytes, bytearray)) else str(stored)
    code = code.strip()

    if code != stored_code:
        raise LoginCodeExpired()
    await redis.delete(key)

    result = await db.execute(select(User).where(User.id == uuid.UUID(user_id)))
    user = result.scalar_one_or_none()
    if not user:
        raise UserNotFound()
    
    access_token = create_access_token(data={"sub": user.email})
    refresh_token = create_refresh_token(data={"sub": user.email})

    if remember:
        trust = create_trust_token(user_id, request.headers.get("user-agent",""))
        response.set_cookie(
            settings.TRUST_COOKIE, trust,
            max_age=settings.TRUST_TTL_SEC, httponly=True, samesite="lax",
            secure=settings.ENVIRONMENT in (Environment.STAGING, Environment.PRODUCTION)
        )

    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer"
    }

#      END LOGIN ROUTE      #

#---------------------------------------------------------------#

#      REFRESH TOKEN ROUTE      #

@auth_route.post('/refresh')
async def refresh_token(refresh_token: str):
    try:
        payload = decode_token(refresh_token)
        email: str = payload.get("sub")
        token_type: str = payload.get("type")
        if not email or token_type != "refresh":
            raise InvalidToken()
    except JWTError:
        raise NotAuthenticated()

    access_token = create_access_token(data={"sub": email})
    return {
        "access_token": access_token,
        "token_type": "bearer"
    }

#      END REFRESH TOKEN ROUTE      #
