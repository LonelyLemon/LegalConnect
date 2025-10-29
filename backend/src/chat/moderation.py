from __future__ import annotations

import re
from typing import Iterable

from fastapi import HTTPException, status

BANNED_PATTERNS: tuple[re.Pattern[str], ...] = (
    re.compile(r"https?://[^\s]+", re.IGNORECASE),
)


def validate_message_content(content: str, *, max_length: int = 4000) -> None:
    if not content.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Message content cannot be empty.",
        )

    if len(content) > max_length:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail="Message is too long.",
        )

    for pattern in BANNED_PATTERNS:
        if pattern.search(content):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Links are not allowed in chat messages at this time.",
            )


def validate_attachment_content_type(content_type: str | None, allowed: Iterable[str]) -> None:
    if not content_type:
        raise HTTPException(
            status_code=status.HTTP_415_UNSUPPORTED_MEDIA_TYPE,
            detail="Attachment content type is missing.",
        )

    if content_type not in allowed:
        raise HTTPException(
            status_code=status.HTTP_415_UNSUPPORTED_MEDIA_TYPE,
            detail="Attachment content type is not permitted.",
        )