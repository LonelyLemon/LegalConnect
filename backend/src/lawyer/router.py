import uuid
from typing import List, Optional
from fastapi import APIRouter, Depends, Query, HTTPException, status
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload, joinedload
from sqlalchemy import and_, or_, func, desc, asc

from src.core.database import SessionDep
from src.auth.dependencies import get_current_user
from src.user.models import User
from src.user.constants import UserRole
from src.lawyer.models import (
    LawyerProfile, 
    Specialty, 
    LawyerSpecialty, 
    LawyerAvailability, 
    Review
)
from src.lawyer.schemas import (
    LawyerProfileResponse,
    LawyerProfileCreate,
    LawyerProfileUpdate,
    LawyerAvailabilityCreate,
    LawyerAvailabilityResponse,
    ReviewCreate,
    ReviewResponse,
    LawyerSearchFilters,
    LawyerSearchResponse,
    SpecialtyResponse
)

lawyer_route = APIRouter(
    tags=["Lawyer"],
    prefix="/lawyers"
)


# ================
# SPECIALTY ROUTES
# ================

@lawyer_route.get("/specialties", response_model=List[SpecialtyResponse])
async def get_specialties(db: SessionDep):
    """Get all available specialties"""
    result = await db.execute(select(Specialty).order_by(Specialty.name))
    specialties = result.scalars().all()
    return specialties


@lawyer_route.post("/specialties", response_model=SpecialtyResponse)
async def create_specialty(
    name: str,
    db: SessionDep,
    current_user: User = Depends(get_current_user)
):
    """Create a new specialty (Admin only)"""
    if current_user.role != UserRole.ADMIN.value:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only admins can create specialties"
        )
    
    # Check if specialty already exists
    result = await db.execute(select(Specialty).where(Specialty.name == name))
    existing_specialty = result.scalar_one_or_none()
    
    if existing_specialty:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Specialty with this name already exists"
        )
    
    new_specialty = Specialty(name=name)
    db.add(new_specialty)
    await db.commit()
    await db.refresh(new_specialty)
    
    return new_specialty


# ================
# LAWYER PROFILE ROUTES
# ================

@lawyer_route.post("/profile", response_model=LawyerProfileResponse)
async def create_lawyer_profile(
    profile_data: LawyerProfileCreate,
    db: SessionDep,
    current_user: User = Depends(get_current_user)
):
    """Create lawyer profile"""
    if current_user.role != UserRole.LAWYER.value:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only lawyers can create profiles"
        )
    
    # Check if profile already exists
    result = await db.execute(select(LawyerProfile).where(LawyerProfile.user_id == current_user.id))
    existing_profile = result.scalar_one_or_none()
    
    if existing_profile:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Lawyer profile already exists"
        )
    
    # Validate specialties exist
    if profile_data.specialty_ids:
        result = await db.execute(
            select(Specialty).where(Specialty.id.in_(profile_data.specialty_ids))
        )
        specialties = result.scalars().all()
        if len(specialties) != len(profile_data.specialty_ids):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="One or more specialties not found"
            )
    
    # Create lawyer profile
    lawyer_profile = LawyerProfile(
        user_id=current_user.id,
        bio=profile_data.bio,
        years_experience=profile_data.years_experience,
        price_per_session_cents=profile_data.price_per_session_cents,
        currency=profile_data.currency,
        province=profile_data.province
    )
    
    db.add(lawyer_profile)
    await db.flush()  # Get the ID
    
    # Add specialties
    if profile_data.specialty_ids:
        for specialty_id in profile_data.specialty_ids:
            lawyer_specialty = LawyerSpecialty(
                lawyer_user_id=lawyer_profile.user_id,
                specialty_id=specialty_id
            )
            db.add(lawyer_specialty)
    
    await db.commit()
    await db.refresh(lawyer_profile)
    
    # Load relationships for response
    result = await db.execute(
        select(LawyerProfile)
        .options(
            selectinload(LawyerProfile.specialties).selectinload(LawyerSpecialty.specialty),
            joinedload(LawyerProfile.user)
        )
        .where(LawyerProfile.user_id == current_user.id)
    )
    lawyer_profile = result.scalar_one()
    
    return lawyer_profile


@lawyer_route.get("/profile/me", response_model=LawyerProfileResponse)
async def get_my_lawyer_profile(
    db: SessionDep,
    current_user: User = Depends(get_current_user)
):
    """Get current user's lawyer profile"""
    if current_user.role != UserRole.LAWYER.value:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only lawyers can access this endpoint"
        )
    
    result = await db.execute(
        select(LawyerProfile)
        .options(
            selectinload(LawyerProfile.specialties).selectinload(LawyerSpecialty.specialty),
            joinedload(LawyerProfile.user)
        )
        .where(LawyerProfile.user_id == current_user.id)
    )
    lawyer_profile = result.scalar_one_or_none()
    
    if not lawyer_profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Lawyer profile not found"
        )
    
    return lawyer_profile


@lawyer_route.put("/profile/me", response_model=LawyerProfileResponse)
async def update_my_lawyer_profile(
    profile_data: LawyerProfileUpdate,
    db: SessionDep,
    current_user: User = Depends(get_current_user)
):
    """Update current user's lawyer profile"""
    if current_user.role != UserRole.LAWYER.value:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only lawyers can update profiles"
        )
    
    result = await db.execute(
        select(LawyerProfile)
        .options(
            selectinload(LawyerProfile.specialties).selectinload(LawyerSpecialty.specialty),
            joinedload(LawyerProfile.user)
        )
        .where(LawyerProfile.user_id == current_user.id)
    )
    lawyer_profile = result.scalar_one_or_none()
    
    if not lawyer_profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Lawyer profile not found"
        )
    
    # Update fields
    if profile_data.bio is not None:
        lawyer_profile.bio = profile_data.bio
    if profile_data.years_experience is not None:
        lawyer_profile.years_experience = profile_data.years_experience
    if profile_data.price_per_session_cents is not None:
        lawyer_profile.price_per_session_cents = profile_data.price_per_session_cents
    if profile_data.currency is not None:
        lawyer_profile.currency = profile_data.currency
    if profile_data.province is not None:
        lawyer_profile.province = profile_data.province
    
    # Update specialties if provided
    if profile_data.specialty_ids is not None:
        # Remove existing specialties
        await db.execute(
            select(LawyerSpecialty).where(LawyerSpecialty.lawyer_user_id == current_user.id)
        )
        
        # Add new specialties
        for specialty_id in profile_data.specialty_ids:
            lawyer_specialty = LawyerSpecialty(
                lawyer_user_id=current_user.id,
                specialty_id=specialty_id
            )
            db.add(lawyer_specialty)
    
    await db.commit()
    await db.refresh(lawyer_profile)
    
    return lawyer_profile


@lawyer_route.get("/{lawyer_id}", response_model=LawyerProfileResponse)
async def get_lawyer_profile(
    lawyer_id: uuid.UUID,
    db: SessionDep
):
    """Get lawyer profile by ID"""
    result = await db.execute(
        select(LawyerProfile)
        .options(
            selectinload(LawyerProfile.specialties).selectinload(LawyerSpecialty.specialty),
            joinedload(LawyerProfile.user)
        )
        .where(LawyerProfile.user_id == lawyer_id)
    )
    lawyer_profile = result.scalar_one_or_none()
    
    if not lawyer_profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Lawyer profile not found"
        )
    
    return lawyer_profile


# ================
# SEARCH & FILTER ROUTES
# ================

@lawyer_route.get("/", response_model=LawyerSearchResponse)
async def search_lawyers(
    db: SessionDep,
    page: int = Query(1, ge=1),
    page_size: int = Query(10, ge=1, le=100),
    province: Optional[str] = Query(None),
    specialty_ids: Optional[str] = Query(None),  # Comma-separated UUIDs
    min_price_cents: Optional[int] = Query(None, ge=0),
    max_price_cents: Optional[int] = Query(None, ge=0),
    min_rating: Optional[float] = Query(None, ge=0.0, le=5.0),
    min_experience_years: Optional[int] = Query(None, ge=0),
    search_query: Optional[str] = Query(None),
    sort_by: str = Query("rating_avg", regex="^(rating_avg|price_per_session_cents|years_experience)$"),
    sort_order: str = Query("desc", regex="^(asc|desc)$")
):
    """Search and filter lawyers with pagination"""
    
    # Build base query
    query = (
        select(LawyerProfile)
        .options(
            selectinload(LawyerProfile.specialties).selectinload(LawyerSpecialty.specialty),
            joinedload(LawyerProfile.user)
        )
    )
    
    # Apply filters
    filters = []
    
    if province:
        filters.append(LawyerProfile.province.ilike(f"%{province}%"))
    
    if specialty_ids:
        specialty_uuid_list = []
        try:
            specialty_uuid_list = [uuid.UUID(sid.strip()) for sid in specialty_ids.split(",")]
        except ValueError:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid specialty IDs format"
            )
        
        # Filter lawyers who have at least one of the specified specialties
        specialty_subquery = (
            select(LawyerSpecialty.lawyer_user_id)
            .where(LawyerSpecialty.specialty_id.in_(specialty_uuid_list))
        )
        filters.append(LawyerProfile.user_id.in_(specialty_subquery))
    
    if min_price_cents is not None:
        filters.append(LawyerProfile.price_per_session_cents >= min_price_cents)
    
    if max_price_cents is not None:
        filters.append(LawyerProfile.price_per_session_cents <= max_price_cents)
    
    if min_rating is not None:
        filters.append(LawyerProfile.rating_avg >= min_rating)
    
    if min_experience_years is not None:
        filters.append(LawyerProfile.years_experience >= min_experience_years)
    
    if search_query:
        search_filters = [
            LawyerProfile.bio.ilike(f"%{search_query}%"),
            LawyerProfile.province.ilike(f"%{search_query}%"),
            User.username.ilike(f"%{search_query}%"),
            User.email.ilike(f"%{search_query}%")
        ]
        filters.append(or_(*search_filters))
    
    if filters:
        query = query.where(and_(*filters))
    
    # Apply sorting
    if sort_by == "rating_avg":
        sort_column = LawyerProfile.rating_avg
    elif sort_by == "price_per_session_cents":
        sort_column = LawyerProfile.price_per_session_cents
    elif sort_by == "years_experience":
        sort_column = LawyerProfile.years_experience
    else:
        sort_column = LawyerProfile.rating_avg
    
    if sort_order == "desc":
        query = query.order_by(desc(sort_column))
    else:
        query = query.order_by(asc(sort_column))
    
    # Get total count
    count_query = select(func.count(LawyerProfile.user_id))
    if filters:
        count_query = count_query.where(and_(*filters))
    
    total_result = await db.execute(count_query)
    total = total_result.scalar()
    
    # Apply pagination
    offset = (page - 1) * page_size
    query = query.offset(offset).limit(page_size)
    
    # Execute query
    result = await db.execute(query)
    lawyers = result.scalars().all()
    
    # Calculate pagination info
    total_pages = (total + page_size - 1) // page_size
    
    return LawyerSearchResponse(
        lawyers=lawyers,
        total=total,
        page=page,
        page_size=page_size,
        total_pages=total_pages
    )


# ================
# AVAILABILITY ROUTES
# ================

@lawyer_route.post("/availability", response_model=LawyerAvailabilityResponse)
async def add_availability(
    availability_data: LawyerAvailabilityCreate,
    db: SessionDep,
    current_user: User = Depends(get_current_user)
):
    """Add availability slot for lawyer"""
    if current_user.role != UserRole.LAWYER.value:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only lawyers can add availability"
        )
    
    # Check if lawyer profile exists
    result = await db.execute(
        select(LawyerProfile).where(LawyerProfile.user_id == current_user.id)
    )
    lawyer_profile = result.scalar_one_or_none()
    
    if not lawyer_profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Lawyer profile not found"
        )
    
    # Validate time range
    if availability_data.start_at >= availability_data.end_at:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Start time must be before end time"
        )
    
    # Check for overlapping availability
    overlapping_query = select(LawyerAvailability).where(
        and_(
            LawyerAvailability.lawyer_user_id == current_user.id,
            LawyerAvailability.start_at < availability_data.end_at,
            LawyerAvailability.end_at > availability_data.start_at
        )
    )
    overlapping_result = await db.execute(overlapping_query)
    overlapping = overlapping_result.scalar_one_or_none()
    
    if overlapping:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Availability slot overlaps with existing slot"
        )
    
    availability = LawyerAvailability(
        lawyer_user_id=current_user.id,
        start_at=availability_data.start_at,
        end_at=availability_data.end_at
    )
    
    db.add(availability)
    await db.commit()
    await db.refresh(availability)
    
    return availability


@lawyer_route.get("/availability/me", response_model=List[LawyerAvailabilityResponse])
async def get_my_availability(
    db: SessionDep,
    current_user: User = Depends(get_current_user)
):
    """Get current lawyer's availability"""
    if current_user.role != UserRole.LAWYER.value:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only lawyers can access this endpoint"
        )
    
    result = await db.execute(
        select(LawyerAvailability)
        .where(LawyerAvailability.lawyer_user_id == current_user.id)
        .order_by(LawyerAvailability.start_at)
    )
    availability = result.scalars().all()
    
    return availability


# ================
# REVIEW ROUTES
# ================

@lawyer_route.post("/reviews", response_model=ReviewResponse)
async def create_review(
    review_data: ReviewCreate,
    db: SessionDep,
    current_user: User = Depends(get_current_user)
):
    """Create a review for a lawyer"""
    if current_user.role != UserRole.CLIENT.value:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only clients can create reviews"
        )
    
    # Check if review already exists for this appointment
    result = await db.execute(
        select(Review).where(Review.appointment_id == review_data.appointment_id)
    )
    existing_review = result.scalar_one_or_none()
    
    if existing_review:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Review already exists for this appointment"
        )
    
    # TODO: Validate that the appointment exists and belongs to the current user
    # This would require implementing the appointments model first
    
    review = Review(
        appointment_id=review_data.appointment_id,
        client_id=current_user.id,
        lawyer_id=uuid.UUID("00000000-0000-0000-0000-000000000000"),  # Placeholder - would come from appointment
        rating=review_data.rating,
        comment=review_data.comment
    )
    
    db.add(review)
    await db.commit()
    await db.refresh(review)
    
    return review


@lawyer_route.get("/{lawyer_id}/reviews", response_model=List[ReviewResponse])
async def get_lawyer_reviews(
    lawyer_id: uuid.UUID,
    db: SessionDep,
    page: int = Query(1, ge=1),
    page_size: int = Query(10, ge=1, le=100)
):
    """Get reviews for a specific lawyer"""
    offset = (page - 1) * page_size
    
    result = await db.execute(
        select(Review)
        .where(Review.lawyer_id == lawyer_id)
        .order_by(desc(Review.created_at))
        .offset(offset)
        .limit(page_size)
    )
    reviews = result.scalars().all()
    
    return reviews
