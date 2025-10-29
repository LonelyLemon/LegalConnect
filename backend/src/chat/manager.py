from __future__ import annotations

import asyncio
import json
import uuid
from collections import defaultdict
from datetime import datetime
from typing import Iterable

from fastapi import WebSocket

from src.core.base_model import time_now


class ConnectionManager:
    def __init__(self) -> None:

        self._connections: dict[uuid.UUID, set[WebSocket]] = defaultdict(set)
        self._last_seen: dict[uuid.UUID, datetime] = {}
        self._lock = asyncio.Lock()


    async def connect(self, user_id: uuid.UUID, websocket: WebSocket) -> None:
        async with self._lock:
            self._connections[user_id].add(websocket)
            self._last_seen[user_id] = time_now()


    async def disconnect(self, user_id: uuid.UUID, websocket: WebSocket) -> None:
        async with self._lock:
            connections = self._connections.get(user_id)

            if not connections:
                return
            connections.discard(websocket)

            if not connections:
                self._connections.pop(user_id, None)
                self._last_seen[user_id] = time_now()


    async def send_json(self, user_id: uuid.UUID, payload: dict) -> None:
        message = json.dumps(payload, default=str)
        async with self._lock:
            connections = list(self._connections.get(user_id, set()))
        for connection in connections:
            try:
                await connection.send_text(message)
            except RuntimeError:
                await self.disconnect(user_id, connection)


    async def broadcast(self, user_ids: Iterable[uuid.UUID], payload: dict) -> None:
        for user_id in user_ids:
            await self.send_json(user_id, payload)


    async def snapshot_connections(self) -> dict[uuid.UUID, set[WebSocket]]:
        async with self._lock:
            return {user_id: set(conns) for user_id, conns in self._connections.items()}


    async def is_online(self, user_id: uuid.UUID) -> bool:
        async with self._lock:
            return user_id in self._connections


    async def get_online_user_ids(self, user_ids: Iterable[uuid.UUID] | None = None) -> set[uuid.UUID]:
        async with self._lock:
            if user_ids is None:
                return set(self._connections.keys())
            return {user_id for user_id in user_ids if user_id in self._connections}


    async def get_last_seen(self, user_id: uuid.UUID) -> datetime | None:
        async with self._lock:
            return self._last_seen.get(user_id)


manager = ConnectionManager()