from enum import StrEnum

class UserRole(StrEnum):
    CLIENT = "client"
    LAWYER = "lawyer"
    ADMIN = "admin"
    