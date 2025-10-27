from __future__ import annotations

import logging

from fastapi import APIRouter, Depends

from src.auth.dependencies import get_current_user
from src.legal_ai.dependencies import get_chatbot_service
from src.legal_ai.schemas import LegalAIQueryRequest, LegalAIResponse
from src.legal_ai.service import LegalChatbotService
from src.user.models import User

legal_ai_route = APIRouter( 
    tags=["Legal AI"],
    prefix="/legal-ai"
)

logger = logging.getLogger("legal_ai.api")


@legal_ai_route.post("/query", response_model=LegalAIResponse)
async def query_legal_ai(payload: LegalAIQueryRequest,
                         current_user: User = Depends(get_current_user),
                         service: LegalChatbotService = Depends(get_chatbot_service)
                         ) -> LegalAIResponse:
    
    logger.info(
        "legal_ai.request",
        extra={
            "user_id": str(current_user.id),
            "session_id": str(payload.session_id),
        },
    )
    return await service.answer(payload)


@legal_ai_route.get("/health")
async def legal_ai_health(service: LegalChatbotService = Depends(get_chatbot_service)) -> dict[str, object]:
    
    knowledge_base = service.knowledge_base

    return {
        "status": "ok",
        "model_id": service.config.model_id,
        "dataset_loaded": not knowledge_base.empty,
        "entries": len(knowledge_base),
    }