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


class LawyerVerificationRequestInvalidExperience(HTTPException):
    def __init__(self) -> None:
        super().__init__(
            status_code=422,
            detail="Years of experience must be zero or greater.",
        )


class LawyerVerificationRequestInvalidJobPosition(HTTPException):
    def __init__(self) -> None:
        super().__init__(
            status_code=422,
            detail="Current job position must be 255 characters or fewer.",
        )


class LawyerProfileForbidden(HTTPException):
    def __init__(self) -> None:
        super().__init__(
            status_code=403,
            detail="You do not have permission to modify this lawyer profile.",
        )


class LawyerProfileNotFound(HTTPException):
    def __init__(self) -> None:
        super().__init__(
            status_code=404,
            detail="Lawyer profile not found.",
        )


class LawyerProfileInvalidLanguages(HTTPException):
    def __init__(self) -> None:
        super().__init__(
            status_code=422,
            detail="Speaking languages must contain at least one non-empty value.",
        )


class LawyerProfileInvalidField(HTTPException):
    def __init__(self, detail: str) -> None:
        super().__init__(
            status_code=422,
            detail=detail,
        )


class LawyerRoleRevocationTargetNotFound(HTTPException):
    def __init__(self) -> None:
        super().__init__(
            status_code=404,
            detail="Lawyer not found.",
        )


class LawyerRoleRevocationInvalidReason(HTTPException):
    def __init__(self) -> None:
        super().__init__(
            status_code=422,
            detail="Revocation reason must not be empty.",
        )


class LawyerRoleRevocationInvalidRole(HTTPException):
    def __init__(self) -> None:
        super().__init__(
            status_code=409,
            detail="User does not currently hold the lawyer role.",
        )