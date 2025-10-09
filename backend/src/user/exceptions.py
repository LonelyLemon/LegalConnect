from fastapi import HTTPException


class VerificationEmailExpired(HTTPException):
    def __init__(self):
        super().__init__(
            status_code=400,
            detail="Invalid or expired verification token !"
        )


class UserNotFound(HTTPException):
    def __init__(self):
        super().__init__(
            status_code=404,
            detail="User not found !"
        )


class UserEmailExist(HTTPException):
    def __init__(self):
        super().__init__(
            status_code=409,
            detail="User email exist !"
        )


class TooManyVerificationResend(HTTPException):
    def __init__(self):
        super().__init__(
            status_code=429,
            detail="Too many verification resend !"
        )


class InvalidPasswordMatch(HTTPException):
    def __init__(self):
        super().__init__(
            status_code=400,
            detail="Password confirm does not match !"
        )
    