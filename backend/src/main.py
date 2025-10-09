import fastapi

from contextlib import asynccontextmanager
from pathlib import Path
from fastapi import Request
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from arq.connections import create_pool, RedisSettings
from starlette.middleware.cors import CORSMiddleware

from src.core.config import settings
from src.auth.router import auth_route
from src.user.router import user_route


THIS_DIR = Path(__file__).parent


@asynccontextmanager
async def lifespan(_app: fastapi.FastAPI):
    _app.state.arq_pool = await create_pool(RedisSettings())
    yield
    await _app.state.arq_pool.close()

app = fastapi.FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGIN,
    allow_origin_regex=settings.CORS_ORIGIN_REGEX,
    allow_credentials=True,
    allow_methods=("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"),
    allow_headers=settings.CORS_HEADERS,
)

app.include_router(auth_route)
app.include_router(user_route)