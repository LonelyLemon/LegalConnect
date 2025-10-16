from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, Field

from src.lawyer.constants import LawyerVerificationStatus


class LawyerVerificationRequestSummaryResponse(BaseModel):
    id: UUID
    user_id: UUID
    status: LawyerVerificationStatus
    years_of_experience: int
    current_job_position: str | None
    rejection_reason: str | None
    reviewed_by_admin_id: UUID | None
    reviewed_at: datetime | None
    create_at: datetime
    updated_at: datetime


class LawyerVerificationRequestDetailResponse(LawyerVerificationRequestSummaryResponse):
    identity_card_front_url: str
    identity_card_back_url: str
    portrait_url: str
    law_certificate_url: str
    bachelor_degree_url: str


class LawyerVerificationRequestRejectPayload(BaseModel):
    rejection_reason: str = Field(..., max_length=500)