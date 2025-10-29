from __future__ import annotations

from pathlib import Path
from uuid import UUID, uuid4

from aiobotocore.session import get_session
from botocore.exceptions import ClientError

from src.core.config import settings

CHAT_ATTACHMENT_ROOT = "chat_attachments"
DEFAULT_CONTENT_TYPE = "application/octet-stream"


def build_chat_attachment_key(conversation_id: UUID, original_filename: str | None) -> str:
    suffix = Path(original_filename or "").suffix
    unique_part = uuid4().hex
    return f"{CHAT_ATTACHMENT_ROOT}/{conversation_id}/{unique_part}{suffix}"


async def upload_attachment_to_s3(
    data: bytes,
    key: str,
    content_type: str | None,
) -> str | None:
    session = get_session()
    async with session.create_client(
        "s3",
        region_name=settings.AWS_REGION,
        aws_access_key_id=settings.AWS_ACCESS_KEY,
        aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
    ) as client:
        try:
            await client.head_bucket(Bucket=settings.S3_BUCKET)
            await client.put_object(
                Bucket=settings.S3_BUCKET,
                Key=key,
                Body=data,
                ContentType=content_type or DEFAULT_CONTENT_TYPE,
                ContentDisposition="attachment",
            )
            return key
        except ClientError:
            return None


async def generate_attachment_url(key: str, expires_in: int = 3600) -> str | None:
    session = get_session()
    async with session.create_client(
        "s3",
        region_name=settings.AWS_REGION,
        aws_access_key_id=settings.AWS_ACCESS_KEY,
        aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
    ) as client:
        try:
            url = await client.generate_presigned_url(
                ClientMethod="get_object",
                Params={
                    "Bucket": settings.S3_BUCKET,
                    "Key": key,
                },
                ExpiresIn=expires_in,
            )
            return url
        except ClientError:
            return None