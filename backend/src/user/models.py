from datetime import datetime
from typing import Optional
from sqlalchemy import String, Boolean, DateTime
from sqlalchemy.orm import Mapped, mapped_column, relationship

from src.core.base_model import Base
from src.user.constants import UserRole


class User(Base):
    __tablename__ = "user"

    username: Mapped[str] = mapped_column(String(50), nullable=False)
    email: Mapped[str] = mapped_column(String(50), unique=True, index=True, nullable=False)
    hashed_password: Mapped[str] = mapped_column(String(255), nullable=False)
    phone_number: Mapped[str] = mapped_column(String(20), unique=True, nullable=True)
    address: Mapped[str] = mapped_column(String(200), nullable=True)
    role: Mapped[str] = mapped_column(String(20), nullable=False, default=UserRole.CLIENT.value)
    is_email_verified: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)
    email_verification_sent_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    
    # Relationships
    lawyer_profile: Mapped[Optional["LawyerProfile"]] = relationship("LawyerProfile", back_populates="user", uselist=False)