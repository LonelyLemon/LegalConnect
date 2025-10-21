from __future__ import annotations

from pathlib import Path

import pytest

from src.legal_ai.config import LegalAIConfig
from src.legal_ai.data import LegalQAExample
from src.legal_ai.knowledge_base import LegalKnowledgeBase
from src.legal_ai.llm_client import LLMClient
from src.legal_ai.schemas import LegalAIQueryRequest
from src.legal_ai.service import LegalChatbotService


class DummyLLMClient(LLMClient):
    def __init__(self, response: str) -> None:
        self.response = response
        self.calls: list[list[dict[str, str]]] = []

    async def generate(self, *, messages, model, temperature, max_output_tokens):
        self.calls.append(messages)
        return self.response


@pytest.fixture
def config() -> LegalAIConfig:
    return LegalAIConfig(
        dataset_path=Path("/tmp/does-not-matter.csv"),
        model_id="test-model",
        provider_base_url="http://localhost",
        api_key=None,
        temperature=0.1,
        max_output_tokens=128,
        confidence_threshold=0.2,
        suggestion_count=3,
        disclaimer="Không phải tư vấn pháp lý.",
        log_sample_rate=1.0,
    )


def build_service(config: LegalAIConfig, *, llm_response: str | None) -> LegalChatbotService:
    examples = [
        LegalQAExample(question="Thủ tục kết hôn là gì?", answer="Thủ tục kết hôn gồm 3 bước."),
        LegalQAExample(question="Thừa kế theo pháp luật", answer="Quy định tại Bộ luật dân sự."),
    ]
    knowledge_base = LegalKnowledgeBase(examples)
    llm = DummyLLMClient(llm_response or "") if llm_response is not None else None
    return LegalChatbotService(config=config, llm_client=llm, knowledge_base=knowledge_base)


@pytest.mark.asyncio
async def test_answer_uses_llm_when_confident(config: LegalAIConfig) -> None:
    service = build_service(config, llm_response="Câu trả lời chính xác.")
    response = await service.answer(
        LegalAIQueryRequest(question="Thủ tục kết hôn là gì?")
    )
    assert not response.is_fallback
    assert response.answer == "Câu trả lời chính xác."
    assert response.confidence >= config.confidence_threshold


@pytest.mark.asyncio
async def test_answer_falls_back_when_low_confidence(config: LegalAIConfig) -> None:
    config.confidence_threshold = 0.9
    service = build_service(config, llm_response="Không dùng")
    response = await service.answer(
        LegalAIQueryRequest(question="Tôi cần tư vấn thuế doanh nghiệp")
    )
    assert response.is_fallback
    assert "Xin lỗi" in response.answer
    assert response.suggestions