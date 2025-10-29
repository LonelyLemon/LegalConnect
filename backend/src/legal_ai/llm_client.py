from __future__ import annotations

from abc import ABC, abstractmethod
from typing import Any

import httpx


class LLMClient(ABC):
    @abstractmethod
    async def generate(self,
                       *,
                       messages: list[dict[str, str]],
                       model: str,
                       temperature: float,
                       max_output_tokens: int
                       ) -> str:
        raise NotImplementedError


class OpenAICompatibleClient(LLMClient):
    def __init__(self, base_url: str, api_key: str | None) -> None:
        self._base_url = base_url.rstrip("/")
        self._api_key = api_key

    async def generate(self,
                       *,
                       messages: list[dict[str, str]],
                       model: str,
                       temperature: float,
                       max_output_tokens: int
                       ) -> str:
        
        headers: dict[str, str] = {}

        if self._api_key:
            headers["Authorization"] = f"Bearer {self._api_key}"
            
        payload: dict[str, Any] = {
            "model": model,
            "temperature": temperature,
            "max_tokens": max_output_tokens,
            "messages": messages,
        }

        async with httpx.AsyncClient(base_url=self._base_url, timeout=30) as client:
            response = await client.post("/v1/chat/completions", json=payload, headers=headers)
            response.raise_for_status()
            data = response.json()
            choices = data.get("choices", [])
            if not choices:
                raise RuntimeError("No choices returned by LLM provider")
            message = choices[0].get("message", {})
            content = message.get("content")
            if not content:
                raise RuntimeError("LLM response missing content")
            return str(content)