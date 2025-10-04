import uuid

from datetime import datetime, timezone
from fastapi import APIRouter, Depends, Body
from sqlalchemy.future import select
from arq import create_pool
from arq.connections import RedisSettings

from src.core.database import SessionDep
from src.core.config import settings

from src.user.models import User
from src.user.schemas import (
    UserCreate, 
    UserResponse, 
    UserUpdate,
    ForgetPasswordRequest
)
from src.user.exceptions import (
    UserEmailExist,
    TooManyVerificationResend,
    VerificationEmailExpired,
    UserNotFound,
    InvalidPasswordMatch
)

from src.auth.services import (
    hash_password, 
    create_reset_token, 
    verify_reset_token
)
from src.auth.dependencies import get_current_user

user_route = APIRouter (
    tags=["User"],
    prefix="/users"
)


#       REGISTER ROUTE      #

@user_route.post('/register', response_model=UserResponse)
async def register(user: UserCreate, 
                   db: SessionDep):
    
    email_norm = user.email.strip().lower()
    result = await db.execute(select(User).where(User.email == email_norm))
    existed_user = result.scalar_one_or_none()

    if existed_user:
        if getattr(existed_user, "is_email_verified", False):
            raise UserEmailExist()
        redis = await create_pool(RedisSettings(host= settings.REDIS_HOST, port=settings.REDIS_PORT))
        throttle_key = f"verify_resend_throttle: {existed_user.id}"
        if not await redis.get(throttle_key):
            await redis.setex(throttle_key, 60, "1")
            token = str(uuid.uuid4())
            await redis.setex(f"verify: {token}", 24 * 3600, str(existed_user.id))
            if hasattr(existed_user, "email_verification_sent_at"):
                existed_user.email_verification_sent_at = datetime.now(timezone.utc)
                await db.commit(existed_user)
            verfication_link = f"{settings.FRONTEND_URL}/verify-email?token={token}"
            await redis.enqueue_job("send_verification_email", existed_user.email, verfication_link)

    hashed_pw = hash_password(user.password)
    new_user = User(
        username = user.username,
        email = user.email,
        hashed_password = hashed_pw,
        is_email_verified = False,
        email_verification_sent_at = datetime.now(timezone.utc)
    )

    db.add(new_user)
    await db.commit()
    await db.refresh(new_user)

    redis = await create_pool(RedisSettings(host= settings.REDIS_HOST, port=settings.REDIS_PORT))
    token = str(uuid.uuid4())
    verfication_link = f"{settings.FRONTEND_URL}/verify-email?token={token}"
    await redis.enqueue_job("send_verification_email", existed_user.email, verfication_link)

    return new_user

#      END REGISTER ROUTE      #

#---------------------------------------------------------------#

#      VERIFY USER ROUTE      #

@user_route.post('/verify-email')
async def verify_email(db: SessionDep,
                       token: str):

    redis = await create_pool(RedisSettings(host= settings.REDIS_HOST, port=settings.REDIS_PORT))

    user_id = await redis.get(f"verify:{token}")
    if not user_id:
        raise VerificationEmailExpired()
    
    user_id_str = user_id.decode()
    try:
        user_uuid = uuid.UUID(user_id_str)
    except ValueError:
        raise VerificationEmailExpired()
    
    await redis.delete(f"verify:{token}")

    result = await db.execute(select(User).where(User.id == user_uuid))
    user = result.scalar_one_or_none()
    if not user:
        raise UserNotFound()
    
    if user.is_email_verified == False:
        user.is_email_verified = True
        await db.commit()
        await db.refresh(user)

    return {"message": "Email verified successfully"}


@user_route.post('resend-verification')
async def resend_verification(db: SessionDep, 
                              email: str = Body(..., embed=True)):
    email_norm = email.strip().lower()
    result = await db.execute(select(User).where(User.email == email_norm))
    user = result.scalar_one_or_none()

    if not user:
        raise UserNotFound()
    
    if getattr(user, "is_email_verified", False):
        return {"message": "Email is already verified"}

    redis = await create_pool(RedisSettings(host= settings.REDIS_HOST, port=settings.REDIS_PORT))
    throttle_key = f"verify_resend_throttle:{user.id}"
    if await redis.get(throttle_key):
        raise TooManyVerificationResend()
    await redis.setex(throttle_key, 60, "1")

    token = str(uuid.uuid4())
    await redis.setex(f"verify:{token}", 24 * 3600, str(user.id))

    if hasattr(user, "email_verification_sent_at"):
        user.email_verification_sent_at = datetime.now(timezone.utc)
        await db.commit()
        await db.refresh(user)

    verification_link = f"{settings.FRONTEND_URL}/verify-email?token={token}"
    await redis.enqueue_job("send_verification_email", user.email, verification_link)

    return {"message": "Verification email resent"}

#      END VERIFY USER ROUTE      #

#---------------------------------------------------------------#

#      USER MANAGEMENT ROUTE      #

@user_route.get('/me')
async def get_user(current_user: UserResponse = Depends(get_current_user)):
    return current_user


@user_route.put('/user')
async def update_user(db: SessionDep, 
                      update_request: UserUpdate, 
                      current_user: UserResponse = Depends(get_current_user)):
    
    result = await db.execute(select(User).where(User.id == current_user.id))
    curr_user = result.scalar_one_or_none()
    if not curr_user:
        raise UserNotFound()
    
    update_data = update_request.model_dump(exclude_unset=True)
    if "password" in update_data:
        update_data["hashed_password"] = hash_password(update_data.pop("password"))
    for key, value in update_data.items():
        setattr(curr_user, key, value)

    await db.commit()
    await db.refresh(curr_user)

    return curr_user

#      END USER MANAGEMENT ROUTE      #

#---------------------------------------------------------------#

#      FORGET PASSWORD ROUTE      #

@user_route.post('/password/forget')
async def forget_password(db: SessionDep,
                          payload: ForgetPasswordRequest):
    
    result = await db.execute(select(User).where(User.email == payload.email))
    user = result.scalar_one_or_none()
    if not user:
        raise UserNotFound()
    
    redis = await create_pool(RedisSettings(host= settings.REDIS_HOST, port=settings.REDIS_PORT))
    reset_token = create_reset_token(user.email)
    await redis.enqueue_job("send_reset_email", user.email, reset_token)

    return {"message": "Reset email sent"}


@user_route.post('/password/reset')
async def reset_password(db: SessionDep, 
                         token: str, 
                         new_password: str = Body(...), 
                         confirm_password: str = Body(...)):
    if new_password != confirm_password:
        raise InvalidPasswordMatch()
    
    email = verify_reset_token(token)

    result = await db.execute(select(User).where(User.email == email))
    user = result.scalar_one_or_none()
    if not user:
        raise UserNotFound()
    
    user.hashed_password = hash_password(new_password)
    await db.commit()
    await db.refresh(user)

    return user

#      END FORGET PASSWORD ROUTE      #

#---------------------------------------------------------------#