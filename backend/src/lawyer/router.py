import asyncio

from __future__ import annotations
from datetime import datetime, timezone
from typing import Iterable
from uuid import UUID

from fastapi import (
    APIRouter,
    Depends,
    File,
    Form,
    HTTPException,
    Query,
    UploadFile,
    status,
)
from sqlalchemy import select

from src.auth.dependencies import get_current_user
from src.core.database import SessionDep
from src.lawyer.constants import LawyerVerificationStatus
from src.lawyer.exceptions import (
    RequestAlreadyExists,
    RequestAlreadyReviewed,
    RequestDocumentUnavailable,
    RequestForbidden,
    RequestNotFound,
    RequestRoleForbidden,
    RequestUploadFailed,
)
from src.lawyer.models import LawyerVerificationRequest
from src.lawyer.schemas import (
    LawyerVerificationRequestDetailResponse,
    LawyerVerificationRequestRejectPayload,
    LawyerVerificationRequestSummaryResponse,
)
from src.lawyer.utils import (
    build_verification_document_key,
    delete_file_from_s3,
    generate_presigned_url,
    upload_file_to_s3,
)
from src.user.constants import UserRole
from src.user.models import User


DOCUMENT_COLUMN_NAMES: tuple[str, ...] = (
    "identity_card_front_url",
    "identity_card_back_url",
    "portrait_url",
    "law_certificate_url",
    "bachelor_degree_url",
)


lawyer_route = APIRouter(
    tags=["Lawyer"],
    prefix="/lawyer",
)


async def _generate_document_urls(
    request: LawyerVerificationRequest,
) -> dict[str, str]:
    tasks = {
        column: asyncio.create_task(
            generate_presigned_url(getattr(request, column))
        )
        for column in DOCUMENT_COLUMN_NAMES
    }

    results: dict[str, str] = {}
    for column, task in tasks.items():
        url = await task
        if not url:
            raise RequestDocumentUnavailable()
        results[column] = url
    return results


def _build_summary_response(
    request: LawyerVerificationRequest,
) -> LawyerVerificationRequestSummaryResponse:
    return LawyerVerificationRequestSummaryResponse(
        id=request.id,
        user_id=request.user_id,
        status=LawyerVerificationStatus(request.status),
        years_of_experience=request.years_of_experience,
        current_job_position=request.current_job_position,
        rejection_reason=request.rejection_reason,
        reviewed_by_admin_id=request.reviewed_by_admin_id,
        reviewed_at=request.reviewed_at,
        create_at=request.create_at,
        updated_at=request.updated_at,
    )


async def _build_detail_response(
    request: LawyerVerificationRequest,
) -> LawyerVerificationRequestDetailResponse:
    summary = _build_summary_response(request)
    document_urls = await _generate_document_urls(request)
    return LawyerVerificationRequestDetailResponse(
        **summary.model_dump(),
        **document_urls,
    )


async def _cleanup_uploaded_documents(keys: Iterable[str]) -> None:
    tasks = [asyncio.create_task(delete_file_from_s3(key)) for key in keys]
    if tasks:
        await asyncio.gather(*tasks, return_exceptions=True)


def _ensure_admin(user: User) -> None:
    if user.role != UserRole.ADMIN.value:
        raise RequestForbidden()


@lawyer_route.post(
    "/verification-requests",
    response_model=LawyerVerificationRequestDetailResponse,
    status_code=status.HTTP_201_CREATED,
)
async def create_lawyer_verification_request(
    db: SessionDep,
    identity_card_front: UploadFile = File(...),
    identity_card_back: UploadFile = File(...),
    portrait: UploadFile = File(...),
    law_certificate: UploadFile = File(...),
    bachelor_degree: UploadFile = File(...),
    years_of_experience: int = Form(...),
    current_job_position: str | None = Form(default=None),
    current_user: User = Depends(get_current_user),
) -> LawyerVerificationRequestDetailResponse:
    if current_user.role != UserRole.CLIENT.value:
        raise RequestRoleForbidden()

    if years_of_experience < 0:
        raise HTTPException(
            status_code=422,
            detail="Years of experience must be zero or greater.",
        )

    job_position_value = current_job_position.strip() if current_job_position else None
    if job_position_value and len(job_position_value) > 255:
        raise HTTPException(
            status_code=422,
            detail="Current job position must be 255 characters or fewer.",
        )
    current_job_position = job_position_value

    existing_request_result = await db.execute(
        select(LawyerVerificationRequest).where(
            LawyerVerificationRequest.user_id == current_user.id,
            LawyerVerificationRequest.status == LawyerVerificationStatus.PENDING.value,
        )
    )
    existing_request = existing_request_result.scalar_one_or_none()

    if existing_request:
        raise RequestAlreadyExists()

    documents = {
        "identity_card_front_url": identity_card_front,
        "identity_card_back_url": identity_card_back,
        "portrait_url": portrait,
        "law_certificate_url": law_certificate,
        "bachelor_degree_url": bachelor_degree,
    }

    uploaded_keys: dict[str, str] = {}

    try:
        for column, upload in documents.items():
            file_content = await upload.read()
            s3_key = build_verification_document_key(
                current_user.id,
                column.replace("_url", ""),
                upload.filename,
            )
            stored_key = await upload_file_to_s3(
                file_content,
                s3_key,
                upload.content_type or "application/octet-stream",
            )
            if not stored_key:
                raise RequestUploadFailed()
            uploaded_keys[column] = stored_key
    except RequestUploadFailed:
        await _cleanup_uploaded_documents(uploaded_keys.values())
        raise
    except Exception as exc:
        await _cleanup_uploaded_documents(uploaded_keys.values())
        raise RequestUploadFailed() from exc

    new_request = LawyerVerificationRequest(
        user_id=current_user.id,
        years_of_experience=years_of_experience,
        current_job_position=current_job_position,
        status=LawyerVerificationStatus.PENDING.value,
        **uploaded_keys,
    )

    db.add(new_request)
    try:
        await db.commit()
    except Exception as exc:
        await db.rollback()
        await _cleanup_uploaded_documents(uploaded_keys.values())
        raise RequestUploadFailed() from exc

    await db.refresh(new_request)

    return await _build_detail_response(new_request)


@lawyer_route.get(
    "/verification-requests/me",
    response_model=list[LawyerVerificationRequestSummaryResponse],
)
async def list_my_lawyer_verification_requests(
    db: SessionDep,
    current_user: User = Depends(get_current_user),
) -> list[LawyerVerificationRequestSummaryResponse]:
    result = await db.execute(
        select(LawyerVerificationRequest)
        .where(LawyerVerificationRequest.user_id == current_user.id)
        .order_by(LawyerVerificationRequest.create_at.desc())
    )

    requests = result.scalars().all()
    return [_build_summary_response(request) for request in requests]


@lawyer_route.get(
    "/verification-requests",
    response_model=list[LawyerVerificationRequestSummaryResponse],
)
async def list_lawyer_verification_requests(
    db: SessionDep,
    status_filter: LawyerVerificationStatus | None = Query(default=None, alias="status"),
    current_user: User = Depends(get_current_user),
) -> list[LawyerVerificationRequestSummaryResponse]:
    _ensure_admin(current_user)

    stmt = select(LawyerVerificationRequest)
    if status_filter:
        stmt = stmt.where(LawyerVerificationRequest.status == status_filter.value)

    stmt = stmt.order_by(LawyerVerificationRequest.create_at.desc())

    result = await db.execute(stmt)
    requests = result.scalars().all()

    return [_build_summary_response(request) for request in requests]


@lawyer_route.get(
    "/verification-requests/{request_id}",
    response_model=LawyerVerificationRequestDetailResponse,
)
async def get_lawyer_verification_request(
    request_id: UUID,
    db: SessionDep,
    current_user: User = Depends(get_current_user),
) -> LawyerVerificationRequestDetailResponse:
    request = await db.get(LawyerVerificationRequest, request_id)
    if not request:
        raise RequestNotFound()

    if current_user.role != UserRole.ADMIN.value and request.user_id != current_user.id:
        raise RequestForbidden()

    return await _build_detail_response(request)


@lawyer_route.patch(
    "/verification-requests/{request_id}/approve",
    response_model=LawyerVerificationRequestDetailResponse,
)
async def approve_lawyer_verification_request(
    request_id: UUID,
    db: SessionDep,
    current_user: User = Depends(get_current_user),
) -> LawyerVerificationRequestDetailResponse:
    _ensure_admin(current_user)

    request = await db.get(LawyerVerificationRequest, request_id)
    if not request:
        raise RequestNotFound()

    if request.status != LawyerVerificationStatus.PENDING.value:
        raise RequestAlreadyReviewed()

    request.status = LawyerVerificationStatus.APPROVED.value
    request.rejection_reason = None
    request.reviewed_by_admin_id = current_user.id
    request.reviewed_at = datetime.now(timezone.utc)

    user = await db.get(User, request.user_id)
    if user:
        user.role = UserRole.LAWYER.value

    await db.commit()
    await db.refresh(request)

    return await _build_detail_response(request)


@lawyer_route.patch(
    "/verification-requests/{request_id}/reject",
    response_model=LawyerVerificationRequestDetailResponse,
)
async def reject_lawyer_verification_request(
    request_id: UUID,
    payload: LawyerVerificationRequestRejectPayload,
    db: SessionDep,
    current_user: User = Depends(get_current_user),
) -> LawyerVerificationRequestDetailResponse:
    _ensure_admin(current_user)

    request = await db.get(LawyerVerificationRequest, request_id)
    if not request:
        raise RequestNotFound()

    if request.status != LawyerVerificationStatus.PENDING.value:
        raise RequestAlreadyReviewed()

    request.status = LawyerVerificationStatus.REJECTED.value
    request.rejection_reason = payload.rejection_reason
    request.reviewed_by_admin_id = current_user.id
    request.reviewed_at = datetime.now(timezone.utc)

    await db.commit()
    await db.refresh(request)

    return await _build_detail_response(request)