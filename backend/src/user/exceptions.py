from fastapi import HTTPException


class UserNotFound(HTTPException):
    def __init__(self):
        super().__init__(
            status_code=404,
            detail="User not found !",
        )


class UserEmailExist(HTTPException):
    def __init__(self):
        super().__init__(
            status_code=409,
            detail="User email exist !",
        )


class InvalidPasswordMatch(HTTPException):
    def __init__(self):
        super().__init__(
            status_code=400,
            detail="Password confirm does not match !"
        )


class UnauthorizedRoleUpdate(HTTPException):
    def __init__(self):
        super().__init__(
            status_code=403,
            detail="You do not have permission to update user roles !",
        )


class InvalidRoleTransition(HTTPException):
    def __init__(self):
        super().__init__(
            status_code=400,
            detail="Invalid role transition requested !",
        )


class InvalidAvatarFile(HTTPException):
    def __init__(self):
        super().__init__(
            status_code=400,
            detail="Avatar must be a PNG or JPG image !",
        )


class AvatarUploadFailed(HTTPException):
    def __init__(self):
        super().__init__(
            status_code=500,
            detail="Failed to upload avatar !",
        )