from __future__ import annotations

from functools import lru_cache

from src.legal_ai.service import LegalChatbotService


@lru_cache(maxsize=1)
def get_chatbot_service() -> LegalChatbotService:
    return LegalChatbotService.from_settings()