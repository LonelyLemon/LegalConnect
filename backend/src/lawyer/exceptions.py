from fastapi import HTTPException, status


class LawyerProfileNotFound(HTTPException):
    def __init__(self):
        super().__init__(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Lawyer profile not found"
        )


class SpecialtyNotFound(HTTPException):
    def __init__(self):
        super().__init__(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Specialty not found"
        )


class SpecialtyAlreadyExists(HTTPException):
    def __init__(self):
        super().__init__(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Specialty with this name already exists"
        )


class LawyerProfileAlreadyExists(HTTPException):
    def __init__(self):
        super().__init__(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Lawyer profile already exists"
        )


class InvalidAvailabilityTime(HTTPException):
    def __init__(self):
        super().__init__(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid availability time range"
        )


class AvailabilityOverlap(HTTPException):
    def __init__(self):
        super().__init__(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Availability slot overlaps with existing slot"
        )


class ReviewAlreadyExists(HTTPException):
    def __init__(self):
        super().__init__(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Review already exists for this appointment"
        )
