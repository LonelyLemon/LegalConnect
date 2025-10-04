from fastapi import HTTPException, status


class VerificationEmailExpired(HTTPException):
    STATUS_CODE = status.HTTP_400_BAD_REQUEST
    DETAIL = "Invalid or expired verification token !"

class UserNotFound(HTTPException):
    STATUS_CODE = status.HTTP_404_NOT_FOUND
    DETAIL = "User not found !"

class UserEmailExist(HTTPException):
    STATUS_CODE = status.HTTP_409_CONFLICT
    DETAIL = "User email exist !"

class TooManyVerificationResend(HTTPException):
    STATUS_CODE = status.HTTP_429_TOO_MANY_REQUESTS
    DETAIL = "Too many verification resend !"

class InvalidPasswordMatch(HTTPException):
    STATUS_CODE = status.HTTP_400_BAD_REQUEST
    DETAIL = "Password confirm does not match !"
    