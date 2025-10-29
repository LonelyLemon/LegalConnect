from __future__ import annotations

from pathlib import Path
from uuid import uuid4

from aiobotocore.session import get_session
from botocore.exceptions import ClientError

from src.core.config import settings


DOCUMENTATION_ROOT = "law_documentation"
PDF_CONTENT_TYPE = "application/pdf"


def build_document_key(display_name: str, original_filename: str | None) -> str:
    suffix = Path(original_filename or "").suffix or ".pdf"
    sanitized_name = display_name.strip().lower().replace(" ", "-")
    unique = uuid4().hex
    return f"{DOCUMENTATION_ROOT}/{sanitized_name}-{unique}{suffix}"


async def upload_to_s3(file_bytes: bytes, key: str, content_type: str) -> str | None:
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
                Body=file_bytes,
                ContentType=content_type,
            )
            return key
        except ClientError:
            return None


async def delete_from_s3(key: str) -> bool:
    session = get_session()
    async with session.create_client(
        "s3",
        region_name=settings.AWS_REGION,
        aws_access_key_id=settings.AWS_ACCESS_KEY,
        aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
    ) as client:
        try:
            await client.delete_object(Bucket=settings.S3_BUCKET, Key=key)
            return True
        except ClientError:
            return False


async def generate_document_url(key: str, expires_in: int = 3600) -> str | None:
    session = get_session()
    async with session.create_client(
        "s3",
        region_name=settings.AWS_REGION,
        aws_access_key_id=settings.AWS_ACCESS_KEY,
        aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
    ) as client:
        try:
            return await client.generate_presigned_url(
                ClientMethod="get_object",
                Params={"Bucket": settings.S3_BUCKET, "Key": key},
                ExpiresIn=expires_in,
            )
        except ClientError:
            return None