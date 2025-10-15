from typing import Any
from fastapi import HTTPException, status


class DetailedHTTPException(HTTPException):
    STATUS_CODE = status.HTTP_500_INTERNAL_SERVER_ERROR
    DETAIL = "Internal Server Error."

    def __init__(self, **kwargs: dict[str, Any]) -> None:
        super().__init__(
            status_code=self.STATUS_CODE,
            detail=self.DETAIL,
            **kwargs
        )

class InternalServerErrorException(DetailedHTTPException):
    pass


class NotAuthenticated(HTTPException):
    STATUS_CODE = status.HTTP_401_UNAUTHORIZED
    DETAIL = "User not authenticated."

    def __init__(self) -> None:
        super().__init__(
            headers={"WWW-Authenticate": "Bearer"}
        )


class BadRequestException(HTTPException):
    def __init__(self):
        super().__init__(
            status_code=400,
            detail="Bad Request."
        )

class NotFoundException(HTTPException):
    def __init__(self):
        super().__init__(
            status_code=404,
            detail="Not Found."
        )