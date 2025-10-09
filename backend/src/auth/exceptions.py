from fastapi import HTTPException


class LoginCodeExpired(HTTPException):
    def __init__(self):
        super().__init__(
            status_code=400,
            detail="Invalid or expired login code !"
        )


class InvalidToken(HTTPException):
    def __init__(self):
        super().__init__(
            status_code=401,
            detail="Invalid token !"
        )

    
class InvalidPassword(HTTPException):
    def __init__(self):
        super().__init__(
            status_code=401,
            detail="Invalid password !"
        )


class InvalidLoginCode(HTTPException):
    def __init__(self):
        super().__init__(
            status_code=401,
            detail="Invalid login code !"
        )


class EmailNotVerified(HTTPException):
    def __init__(self):
        super().__init__(
            status_code=403,
            detail="Email unverified. Please verify your email first !"
        )

