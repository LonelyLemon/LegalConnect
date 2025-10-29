from __future__ import annotations

import asyncio
import time
import uuid
from collections import defaultdict, deque
from typing import Deque

from src.chat.exceptions import RateLimitExceeded
from src.core.config import settings


class SlidingWindowRateLimiter:
    def __init__(self, max_events: int, window_seconds: int) -> None:
        self._max_events = max_events
        self._window = window_seconds
        self._events: dict[uuid.UUID, Deque[float]] = defaultdict(deque)
        self._lock = asyncio.Lock()

    async def hit(self, user_id: uuid.UUID) -> None:
        now = time.monotonic()
        async with self._lock:
            events = self._events[user_id]
            cutoff = now - self._window
            while events and events[0] < cutoff:
                events.popleft()

            if len(events) >= self._max_events:
                retry_after = max(int(events[0] + self._window - now), 1)
                raise RateLimitExceeded(retry_after)

            events.append(now)

    async def reset(self, user_id: uuid.UUID) -> None:
        async with self._lock:
            self._events.pop(user_id, None)


rate_limiter = SlidingWindowRateLimiter(
    max_events=settings.CHAT_RATE_LIMIT_MAX_EVENTS,
    window_seconds=settings.CHAT_RATE_LIMIT_WINDOW_SECONDS,
)