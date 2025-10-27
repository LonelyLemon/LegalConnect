from datetime import datetime
from decimal import Decimal
from typing import List, Optional
from sqlalchemy import String, Text, Integer, BigInteger, Numeric, Boolean, ForeignKey, Index
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.dialects.postgresql import UUID

from src.core.base_model import Base


class Specialty(Base):
    __tablename__ = "specialties"

    name: Mapped[str] = mapped_column(String(100), nullable=False, unique=True)


class LawyerProfile(Base):
    __tablename__ = "lawyer_profiles"

    user_id: Mapped[str] = mapped_column(
        UUID(as_uuid=True), 
        ForeignKey("user.id", ondelete="CASCADE"), 
        primary_key=True
    )
    bio: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    years_experience: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    price_per_session_cents: Mapped[Optional[int]] = mapped_column(BigInteger, nullable=True)
    currency: Mapped[str] = mapped_column(String(10), nullable=False, default="VND")
    province: Mapped[Optional[str]] = mapped_column(String(120), nullable=True)
    rating_avg: Mapped[Decimal] = mapped_column(Numeric(3, 2), nullable=False, default=Decimal("0.00"))
    rating_count: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    
    # Relationships
    user: Mapped["User"] = relationship("User", back_populates="lawyer_profile")
    specialties: Mapped[List["LawyerSpecialty"]] = relationship("LawyerSpecialty", back_populates="lawyer_profile")
    availability: Mapped[List["LawyerAvailability"]] = relationship("LawyerAvailability", back_populates="lawyer_profile")
    reviews: Mapped[List["Review"]] = relationship("Review", back_populates="lawyer_profile")


class LawyerSpecialty(Base):
    __tablename__ = "lawyer_specialties"

    lawyer_user_id: Mapped[str] = mapped_column(
        UUID(as_uuid=True), 
        ForeignKey("lawyer_profiles.user_id", ondelete="CASCADE"), 
        primary_key=True
    )
    specialty_id: Mapped[str] = mapped_column(
        UUID(as_uuid=True), 
        ForeignKey("specialties.id", ondelete="CASCADE"), 
        primary_key=True
    )
    
    # Relationships
    lawyer_profile: Mapped["LawyerProfile"] = relationship("LawyerProfile", back_populates="specialties")
    specialty: Mapped["Specialty"] = relationship("Specialty")

    __table_args__ = (
        Index("ix_lawyer_specialties_specialty_id", "specialty_id"),
    )


class LawyerAvailability(Base):
    __tablename__ = "lawyer_availability"

    lawyer_user_id: Mapped[str] = mapped_column(
        UUID(as_uuid=True), 
        ForeignKey("lawyer_profiles.user_id", ondelete="CASCADE"), 
        nullable=False
    )
    start_at: Mapped[datetime] = mapped_column(nullable=False)
    end_at: Mapped[datetime] = mapped_column(nullable=False)
    is_booked: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)
    
    # Relationships
    lawyer_profile: Mapped["LawyerProfile"] = relationship("LawyerProfile", back_populates="availability")

    __table_args__ = (
        Index("ix_lawyer_availability_lawyer_start", "lawyer_user_id", "start_at"),
    )


class Review(Base):
    __tablename__ = "reviews"

    appointment_id: Mapped[str] = mapped_column(
        UUID(as_uuid=True), 
        ForeignKey("appointments.id", ondelete="CASCADE"), 
        nullable=False,
        unique=True
    )
    client_id: Mapped[str] = mapped_column(
        UUID(as_uuid=True), 
        ForeignKey("user.id", ondelete="CASCADE"), 
        nullable=False
    )
    lawyer_id: Mapped[str] = mapped_column(
        UUID(as_uuid=True), 
        ForeignKey("lawyer_profiles.user_id", ondelete="CASCADE"), 
        nullable=False
    )
    rating: Mapped[Decimal] = mapped_column(Numeric(2, 1), nullable=False)
    comment: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    
    # Relationships
    lawyer_profile: Mapped["LawyerProfile"] = relationship("LawyerProfile", back_populates="reviews")
    client: Mapped["User"] = relationship("User", foreign_keys=[client_id])

    __table_args__ = (
        Index("ix_reviews_lawyer_rating", "lawyer_id", "rating"),
    )
