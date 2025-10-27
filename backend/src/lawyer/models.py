import uuid
from datetime import datetime

from sqlalchemy import ForeignKey, Integer, String, TIMESTAMP
from sqlalchemy.dialects.postgresql import ARRAY
from sqlalchemy.ext.mutable import MutableList
from sqlalchemy.orm import Mapped, mapped_column

from src.core.base_model import Base
from src.lawyer.constants import (
    LawyerVerificationStatus,
    MAX_DISPLAY_NAME_LENGTH,
    MAX_EDUCATION_LENGTH,
    MAX_JOB_POSITION_LENGTH,
    MAX_LANGUAGE_LENGTH,
    MAX_OFFICE_ADDRESS_LENGTH,
    MAX_PHONE_NUMBER_LENGTH,
    MAX_WEBSITE_LENGTH,
    MAX_REVOCATION_REASON_LENGTH,
)


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
    current_job_position: Mapped[str | None] = mapped_column(
        String(MAX_JOB_POSITION_LENGTH),
        nullable=True,
    )
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


class LawyerProfile(Base):
    __tablename__ = "lawyer_profile"

    user_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("user.id", ondelete="CASCADE"),
        nullable=False,
        unique=True,
    )
    display_name: Mapped[str] = mapped_column(
        String(MAX_DISPLAY_NAME_LENGTH),
        nullable=False,
    )
    phone_number: Mapped[str | None] = mapped_column(
        String(MAX_PHONE_NUMBER_LENGTH),
        nullable=True,
    )
    website_url: Mapped[str | None] = mapped_column(
        String(MAX_WEBSITE_LENGTH),
        nullable=True,
    )
    office_address: Mapped[str | None] = mapped_column(
        String(MAX_OFFICE_ADDRESS_LENGTH),
        nullable=True,
    )
    speaking_languages: Mapped[list[str]] = mapped_column(
        MutableList.as_mutable(ARRAY(String(MAX_LANGUAGE_LENGTH))),
        nullable=False,
        default=list,
    )
    education: Mapped[str | None] = mapped_column(
        String(MAX_EDUCATION_LENGTH),
        nullable=True,
    )
    current_level: Mapped[str | None] = mapped_column(
        String(MAX_JOB_POSITION_LENGTH),
        nullable=True,
    )
    years_of_experience: Mapped[int] = mapped_column(Integer, nullable=False, default=0)


class LawyerRoleRevocation(Base):
    __tablename__ = "lawyer_role_revocation"

    user_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("user.id", ondelete="CASCADE"),
        nullable=False,
    )
    revoked_by_admin_id: Mapped[uuid.UUID | None] = mapped_column(
        ForeignKey("user.id", ondelete="SET NULL"),
        nullable=True,
    )
    reason: Mapped[str] = mapped_column(
        String(MAX_REVOCATION_REASON_LENGTH),
        nullable=False,
    )