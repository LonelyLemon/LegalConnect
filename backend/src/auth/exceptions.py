from fastapi import HTTPException


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

