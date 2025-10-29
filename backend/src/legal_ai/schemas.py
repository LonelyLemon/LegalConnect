from __future__ import annotations

from datetime import datetime
from typing import List
from uuid import UUID, uuid4

from pydantic import BaseModel, Field


class RelatedQuestion(BaseModel):
    question: str
    score: float = Field(ge=0.0, le=1.0)


class LegalAIQueryRequest(BaseModel):
    question: str = Field(min_length=1, max_length=2048)
    session_id: UUID = Field(default_factory=uuid4)


class LegalAIResponse(BaseModel):
    answer: str
    confidence: float = Field(ge=0.0, le=1.0)
    is_fallback: bool
    suggestions: List[RelatedQuestion]
    links: List[str]
    disclaimer: str
    model_id: str
    model_version: str
    latency_ms: int
    asked_at: datetime