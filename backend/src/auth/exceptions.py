from fastapi import HTTPException, status


class LoginCodeExpired(HTTPException):
    STATUS_CODE = status.HTTP_400_BAD_REQUEST
    DETAIL = "Invalid or expired login code !"

class InvalidToken(HTTPException):
    STATUS_CODE = status.HTTP_401_UNAUTHORIZED
    DETAIL = "Invalid Token !"
    
    
class InvalidPassword(HTTPException):
    STATUS_CODE = status.HTTP_401_UNAUTHORIZED
    DETAIL = "Invalid Password !" 


class InvalidLoginCode(HTTPException):
    STATUS_CODE = status.HTTP_401_UNAUTHORIZED
    DETAIL = "Invalid login code !"


class EmailNotVerified(HTTPException):
    STATUS_CODE = status.HTTP_403_FORBIDDEN
    DETAIL = "Email unverified. Please verify your email first !"

