FROM ghcr.io/astral-sh/uv:python3.13-bookworm-slim
WORKDIR /app
ENV UV_COMPILE_BYTECODE=1
ENV UV_LINK_MODE=copy

# Install dependencies
COPY pyproject.toml uv.lock ./
RUN uv sync --frozen --no-install-project --no-dev

# Add source and finalize install
ADD . /app
RUN uv sync --frozen --no-dev

ENV ALEMBIC_CONFIG=/app/alembic.ini
EXPOSE 8000
CMD ["sh", "-lc", "uv run alembic upgrade head && uv run uvicorn src.main:app --host 0.0.0.0 --port 8000"]
