from __future__ import annotations

from pathlib import Path
from typing import Optional
from uuid import UUID, uuid4

from aiobotocore.session import get_session
from botocore.exceptions import ClientError

from src.core.config import settings


DOCUMENT_ROOT_FOLDER = "lawyer_verifications"
DEFAULT_CONTENT_TYPE = "application/octet-stream"


def build_verification_document_key(
    user_id: UUID,
    document_name: str,
    original_filename: str | None,
) -> str:

    sanitized_document = (
        document_name.strip().lower().replace(" ", "-").replace("_", "-")
    )
    suffix = Path(original_filename or "").suffix
    unique_part = uuid4().hex
    return f"{DOCUMENT_ROOT_FOLDER}/{user_id}/{sanitized_document}-{unique_part}{suffix}"


async def upload_file_to_s3(file_obj: bytes, s3_key: str, content_type: str) -> Optional[str]:
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
                Key=s3_key,
                Body=file_obj,
                ContentType=content_type or DEFAULT_CONTENT_TYPE,
            )
            return s3_key
        except ClientError as exc:
            print("Upload error: ", {exc})
            return None


async def delete_file_from_s3(s3_key: str) -> bool:
    session = get_session()
    async with session.create_client(
        "s3",
        region_name=settings.AWS_REGION,
        aws_access_key_id=settings.AWS_ACCESS_KEY,
        aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
    ) as client:
        try:
            await client.delete_object(Bucket=settings.S3_BUCKET, Key=s3_key)
            return True
        except ClientError as exc:
            print("Delete failed: ", {exc})
            return False


async def generate_presigned_url(filename: str, expires_in: int = 3600) -> Optional[str]:
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
                    "Key": filename,
                },
                ExpiresIn=expires_in,
            )
            return url
        except ClientError as exc:
            print("Generate presigned URL error: ", {exc})
            return None