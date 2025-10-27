from fastapi import HTTPException, status


class EmptyMessageNotAllowed(HTTPException):
    def __init__(self) -> None:
        super().__init__(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Message content cannot be empty."
        )


class MessageAcknowledgeForbidden(HTTPException):
    def __init__(self) -> None:
        super().__init__(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You cannot update acknowledgement for this message.",
        )


class ConversationAccessForbidden(HTTPException):
    def __init__(self) -> None:
        super().__init__(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You are not a participant in this conversation."
        )


class MessageNotFound(HTTPException):
    def __init__(self) -> None:
        super().__init__(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Message not found.",
        )


class ConversationNotFound(HTTPException):
    def __init__(self) -> None:
        super().__init__(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Conversation not found."
        )


class AttachmentTooLarge(HTTPException):
    def __init__(self, limit_bytes: int) -> None:
        super().__init__(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail=f"Attachment exceeds the maximum allowed size of {limit_bytes} bytes.",
        )


class AttachmentTypeNotAllowed(HTTPException):
    def __init__(self) -> None:
        super().__init__(
            status_code=status.HTTP_415_UNSUPPORTED_MEDIA_TYPE,
            detail="Attachment content type is not permitted.",
        )


class RateLimitExceeded(HTTPException):
    def __init__(self, retry_after: int) -> None:
        super().__init__(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail="Too many messages sent. Please slow down.",
            headers={"Retry-After": str(retry_after)},
        )


class AttachmentUploadFailed(HTTPException):
    def __init__(self) -> None:
        super().__init__(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to upload attachment. Please try again."
        )
