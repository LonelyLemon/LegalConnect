import uuid
from datetime import datetime

from sqlalchemy import ForeignKey, Integer, String, TIMESTAMP
from sqlalchemy.orm import Mapped, mapped_column

from src.core.base_model import Base
from src.lawyer.constants import LawyerVerificationStatus


class LawyerVerificationRequest(Base):
    __tablename__ = "lawyer_verification_request"

    user_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("user.id", ondelete="CASCADE"),
        nullable=False,
    )
    identity_card_front_url: Mapped[str] = mapped_column(String(255), nullable=False)
    identity_card_back_url: Mapped[str] = mapped_column(String(255), nullable=False)
    portrait_url: Mapped[str] = mapped_column(String(255), nullable=False)
    law_certificate_url: Mapped[str] = mapped_column(String(255), nullable=False)
    bachelor_degree_url: Mapped[str] = mapped_column(String(255), nullable=False)
    years_of_experience: Mapped[int] = mapped_column(Integer, nullable=False)
    current_job_position: Mapped[str | None] = mapped_column(String(255), nullable=True)
    status: Mapped[str] = mapped_column(
        String(20),
        nullable=False,
        default=LawyerVerificationStatus.PENDING.value,
    )
    rejection_reason: Mapped[str | None] = mapped_column(String(500), nullable=True)
    reviewed_by_admin_id: Mapped[uuid.UUID | None] = mapped_column(
        ForeignKey("user.id", ondelete="SET NULL"),
        nullable=True,
    )
    reviewed_at: Mapped[datetime | None] = mapped_column(
        TIMESTAMP(timezone=True),
        nullable=True,
        default=None,
    )