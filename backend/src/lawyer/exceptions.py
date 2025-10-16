from fastapi import HTTPException


class LawyerVerificationRequestAlreadyExists(HTTPException):
    def __init__(self) -> None:
        super().__init__(
            status_code=409,
            detail="An active lawyer verification request already exists.",
        )


class LawyerVerificationRequestRoleForbidden(HTTPException):
    def __init__(self) -> None:
        super().__init__(
            status_code=403,
            detail="Only clients can submit lawyer verification requests.",
        )


class LawyerVerificationRequestUploadFailed(HTTPException):
    def __init__(self) -> None:
        super().__init__(
            status_code=500,
            detail="Failed to store verification documents. Please try again.",
        )


class LawyerVerificationRequestNotFound(HTTPException):
    def __init__(self) -> None:
        super().__init__(
            status_code=404,
            detail="Lawyer verification request not found.",
        )


class LawyerVerificationRequestForbidden(HTTPException):
    def __init__(self) -> None:
        super().__init__(
            status_code=403,
            detail="You do not have permission to perform this action.",
        )


class LawyerVerificationRequestAlreadyReviewed(HTTPException):
    def __init__(self) -> None:
        super().__init__(
            status_code=409,
            detail="This lawyer verification request has already been reviewed.",
        )


class LawyerVerificationRequestDocumentUnavailable(HTTPException):
    def __init__(self) -> None:
        super().__init__(
            status_code=500,
            detail="Unable to access verification documents. Please try again later.",
        )