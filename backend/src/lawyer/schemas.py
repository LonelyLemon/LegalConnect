import uuid
from datetime import datetime
from decimal import Decimal
from typing import Optional, List
from pydantic import BaseModel, Field

from src.user.schemas import UserResponse


class SpecialtyResponse(BaseModel):
    id: uuid.UUID
    name: str

    class Config:
        from_attributes = True


class LawyerProfileResponse(BaseModel):
    user_id: uuid.UUID
    bio: Optional[str] = None
    years_experience: Optional[int] = None
    price_per_session_cents: Optional[int] = None
    currency: str = "VND"
    province: Optional[str] = None
    rating_avg: Decimal = Decimal("0.00")
    rating_count: int = 0
    specialties: List[SpecialtyResponse] = []
    user: UserResponse

    class Config:
        from_attributes = True


class LawyerProfileCreate(BaseModel):
    bio: Optional[str] = None
    years_experience: Optional[int] = Field(None, ge=0, le=50)
    price_per_session_cents: Optional[int] = Field(None, ge=0)
    currency: str = "VND"
    province: Optional[str] = None
    specialty_ids: List[uuid.UUID] = []


class LawyerProfileUpdate(BaseModel):
    bio: Optional[str] = None
    years_experience: Optional[int] = Field(None, ge=0, le=50)
    price_per_session_cents: Optional[int] = Field(None, ge=0)
    currency: Optional[str] = None
    province: Optional[str] = None
    specialty_ids: Optional[List[uuid.UUID]] = None


class LawyerAvailabilityCreate(BaseModel):
    start_at: datetime
    end_at: datetime


class LawyerAvailabilityResponse(BaseModel):
    id: uuid.UUID
    lawyer_user_id: uuid.UUID
    start_at: datetime
    end_at: datetime
    is_booked: bool

    class Config:
        from_attributes = True


class ReviewCreate(BaseModel):
    appointment_id: uuid.UUID
    rating: Decimal = Field(..., ge=1.0, le=5.0)
    comment: Optional[str] = None


class ReviewResponse(BaseModel):
    id: uuid.UUID
    appointment_id: uuid.UUID
    client_id: uuid.UUID
    lawyer_id: uuid.UUID
    rating: Decimal
    comment: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True


class LawyerSearchFilters(BaseModel):
    province: Optional[str] = None
    specialty_ids: Optional[List[uuid.UUID]] = None
    min_price_cents: Optional[int] = Field(None, ge=0)
    max_price_cents: Optional[int] = Field(None, ge=0)
    min_rating: Optional[Decimal] = Field(None, ge=0.0, le=5.0)
    min_experience_years: Optional[int] = Field(None, ge=0)
    search_query: Optional[str] = None


class LawyerSearchResponse(BaseModel):
    lawyers: List[LawyerProfileResponse]
    total: int
    page: int
    page_size: int
    total_pages: int
