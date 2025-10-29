from fastapi import HTTPException, status


class BookingForbidden(HTTPException):
    def __init__(self, detail: str = "You are not allowed to perform this action.") -> None:
        super().__init__(
            status_code=status.HTTP_403_FORBIDDEN, 
            detail=detail
        )


class BookingNotFound(HTTPException):
    def __init__(self) -> None:
        super().__init__(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Booking request not found.",
        )


class ScheduleSlotNotFound(HTTPException):
    def __init__(self) -> None:
        super().__init__(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Schedule slot not found.",
        )


class CaseHistoryNotFound(HTTPException):
    def __init__(self) -> None:
        super().__init__(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Case history not found.",
        )


class ScheduleConflict(HTTPException):
    def __init__(self) -> None:
        super().__init__(
            status_code=status.HTTP_409_CONFLICT,
            detail="Schedule overlaps with an existing slot.",
        )


class ScheduleAlreadyBooked(HTTPException):
    def __init__(self) -> None:
        super().__init__(
            status_code=status.HTTP_409_CONFLICT,
            detail="The selected schedule is no longer available.",
        )


class BookingAlreadyReviewed(HTTPException):
    def __init__(self) -> None:
        super().__init__(
            status_code=status.HTTP_409_CONFLICT,
            detail="This booking request has already been processed.",
        )


class InvalidScheduleRange(HTTPException):
    def __init__(self) -> None:
        super().__init__(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="End time must be after start time.",
        )


class InvalidScheduleSelection(HTTPException):
    def __init__(self) -> None:
        super().__init__(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Desired schedule must be within the lawyer's available slots.",
        )


class InvalidBookingPayload(HTTPException):
    def __init__(self, detail: str) -> None:
        super().__init__(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=detail,
        )


class CaseStateUpdateForbidden(HTTPException):
    def __init__(self) -> None:
        super().__init__(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Case state can only transition to COMPLETED or CANCELLED.",
        )


class RatingAlreadySubmitted(HTTPException):
    def __init__(self) -> None:
        super().__init__(
            status_code=status.HTTP_409_CONFLICT,
            detail="You have already submitted a rating for this case.",
        )


class RatingNotAllowed(HTTPException):
    def __init__(self) -> None:
        super().__init__(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Ratings can only be submitted after the case is completed.",
        )


class RatingInvalidStars(HTTPException):
    def __init__(self) -> None:
        super().__init__(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Rating must be an integer between 1 and 5.",
        )


class AttachmentUploadFailed(HTTPException):
    def __init__(self) -> None:
        super().__init__(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Unable to store attachment. Please try again.",
        )
        