from fastapi import HTTPException


class RequestAlreadyExists(HTTPException):
    def __init__(self) -> None:
        super().__init__(
            status_code=409,
            detail="An active lawyer verification request already exists.",
        )


class RequestRoleForbidden(HTTPException):
    def __init__(self) -> None:
        super().__init__(
            status_code=403,
            detail="Only clients can submit lawyer verification requests.",
        )


class RequestUploadFailed(HTTPException):
    def __init__(self) -> None:
        super().__init__(
            status_code=500,
            detail="Failed to store verification documents. Please try again.",
        )


class RequestNotFound(HTTPException):
    def __init__(self) -> None:
        super().__init__(
            status_code=404,
            detail="Lawyer verification request not found.",
        )


class RequestForbidden(HTTPException):
    def __init__(self) -> None:
        super().__init__(
            status_code=403,
            detail="You do not have permission to perform this action.",
        )


class RequestAlreadyReviewed(HTTPException):
    def __init__(self) -> None:
        super().__init__(
            status_code=409,
            detail="This lawyer verification request has already been reviewed.",
        )


class RequestDocumentUnavailable(HTTPException):
    def __init__(self) -> None:
        super().__init__(
            status_code=500,
            detail="Unable to access verification documents. Please try again later.",
        )