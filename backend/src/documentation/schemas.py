from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, Field


class DocumentationCreateResponse(BaseModel):
    id: UUID
    display_name: str
    original_filename: str
    content_type: str
    uploaded_by_id: UUID | None
    create_at: datetime
    updated_at: datetime
    file_url: str


class DocumentationUpdatePayload(BaseModel):
    display_name: str | None = Field(default=None, min_length=1, max_length=255)


class DocumentationResponse(DocumentationCreateResponse):
    pass