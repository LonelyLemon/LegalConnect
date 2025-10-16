import uuid

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
    UserRoleUpdate,
    ForgetPasswordRequest
)
from src.user.exceptions import (
    UserEmailExist,
    UserNotFound,
    InvalidPasswordMatch,
    UnauthorizedRoleUpdate,
    InvalidRoleTransition
)
from src.user.constants import UserRole

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
        raise UserEmailExist()

    hashed_pw = hash_password(user.password)
    new_user = User(
        username = user.username,
        email = email_norm,
        hashed_password = hashed_pw,
        role = UserRole.CLIENT.value,
        is_email_verified = True,
        email_verification_sent_at = None,
    )

    db.add(new_user)
    await db.commit()
    await db.refresh(new_user)

    return new_user

#      END REGISTER ROUTE      #

#---------------------------------------------------------------#

#      USER MANAGEMENT ROUTE      #

@user_route.get('/me', response_model=UserResponse)
async def get_user(current_user: User = Depends(get_current_user)):
    return current_user


@user_route.put('/update', response_model=UserResponse)
async def update_user(db: SessionDep, 
                      update_request: UserUpdate, 
                      current_user: User = Depends(get_current_user)):
    
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

@user_route.patch('/{user_id}/role', response_model=UserResponse)
async def update_user_role(user_id: uuid.UUID,
                           payload: UserRoleUpdate,
                           db: SessionDep,
                           current_user: User = Depends(get_current_user)):
    if current_user.role != UserRole.ADMIN.value:
        raise UnauthorizedRoleUpdate()

    if payload.role != UserRole.LAWYER:
        raise InvalidRoleTransition()

    result = await db.execute(select(User).where(User.id == user_id))
    target_user = result.scalar_one_or_none()
    if not target_user:
        raise UserNotFound()

    if target_user.role != UserRole.CLIENT.value:
        raise InvalidRoleTransition()

    target_user.role = payload.role.value

    await db.commit()
    await db.refresh(target_user)

    return target_user

#      END USER MANAGEMENT ROUTE      #

#---------------------------------------------------------------#

#      FORGET PASSWORD ROUTE      #

@user_route.post('/forget-password')
async def forget_password(db: SessionDep,
                          payload: ForgetPasswordRequest):
    email_norm = payload.email.strip().lower()
    result = await db.execute(select(User).where(User.email == email_norm))
    user = result.scalar_one_or_none()
    if not user:
        raise UserNotFound()
    
    redis = await create_pool(RedisSettings(host= settings.REDIS_HOST, port=settings.REDIS_PORT))
    reset_token = create_reset_token(user.email)
    await redis.enqueue_job("send_reset_email", user.email, reset_token)

    return {"message": "Reset email sent"}


@user_route.post('/reset-password', response_model=UserResponse)
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