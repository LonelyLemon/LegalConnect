from __future__ import annotations

from typing import List

from fastapi import APIRouter, Depends, File, Form, UploadFile, status
from sqlalchemy import select

from src.auth.dependencies import get_current_user
from src.core.database import SessionDep
from src.documentation.exceptions import (
    DocumentationDeletionFailed,
    DocumentationForbidden,
    DocumentationInvalidFile,
    DocumentationNotFound,
    DocumentationUploadFailed,
)
from src.documentation.models import LawDocumentation
from src.documentation.schemas import (
    DocumentationCreateResponse,
    DocumentationResponse,
)
from src.documentation.utils import (
    PDF_CONTENT_TYPE,
    build_document_key,
    delete_from_s3,
    generate_document_url,
    upload_to_s3,
)
from src.user.constants import UserRole
from src.user.models import User


documentation_route = APIRouter(
    prefix="/documentation",
    tags=["Documentation"],
)


async def _ensure_admin(user: User) -> None:
    if user.role != UserRole.ADMIN.value:
        raise DocumentationForbidden()


async def _build_response(document: LawDocumentation) -> DocumentationResponse:
    file_url = await generate_document_url(document.s3_key)
    return DocumentationResponse(
        id=document.id,
        display_name=document.display_name,
        original_filename=document.original_filename,
        content_type=document.content_type,
        uploaded_by_id=document.uploaded_by_id,
        create_at=document.create_at,
        updated_at=document.updated_at,
        file_url=file_url or "",
    )


@documentation_route.post("/",
                          response_model=DocumentationCreateResponse,
                          status_code=status.HTTP_201_CREATED)
async def upload_documentation(
    db: SessionDep,
    display_name: str = Form(..., min_length=1, max_length=255),
    document: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
) -> DocumentationCreateResponse:

    await _ensure_admin(current_user)

    incoming_type = (document.content_type or "").split(";")[0].lower()
    if incoming_type != PDF_CONTENT_TYPE:
        raise DocumentationInvalidFile()

    payload = await document.read()
    if not payload:
        raise DocumentationInvalidFile()

    storage_key = build_document_key(display_name, document.filename)
    uploaded_key = await upload_to_s3(payload, storage_key, PDF_CONTENT_TYPE)
    if not uploaded_key:
        raise DocumentationUploadFailed()

    record = LawDocumentation(
        display_name=display_name.strip(),
        s3_key=uploaded_key,
        original_filename=document.filename or "document.pdf",
        content_type=incoming_type or PDF_CONTENT_TYPE,
        uploaded_by_id=current_user.id,
    )

    db.add(record)
    try:
        await db.commit()
    except Exception:
        await db.rollback()
        await delete_from_s3(uploaded_key)
        raise

    await db.refresh(record)
    return await _build_response(record)


@documentation_route.get("/",
                         response_model=List[DocumentationResponse])
async def list_documentation(db: SessionDep) -> List[DocumentationResponse]:
    result = await db.execute(select(LawDocumentation))
    documents = result.scalars().all()
    responses: List[DocumentationResponse] = []
    for document in documents:
        responses.append(await _build_response(document))
    return responses


@documentation_route.get("/{document_id}",
                         response_model=DocumentationResponse)
async def get_documentation(document_id: str, db: SessionDep) -> DocumentationResponse:
    document = await db.get(LawDocumentation, document_id)
    if not document:
        raise DocumentationNotFound()
    return await _build_response(document)


@documentation_route.patch("/{document_id}",
                           response_model=DocumentationResponse)
async def update_documentation(
    db: SessionDep,
    document_id: str,
    display_name: str | None = Form(default=None),
    document: UploadFile | None = File(default=None),
    current_user: User = Depends(get_current_user),
) -> DocumentationResponse:

    await _ensure_admin(current_user)

    record = await db.get(LawDocumentation, document_id)
    if not record:
        raise DocumentationNotFound()

    new_key: str | None = None
    if document is not None:
        incoming_type = (document.content_type or "").split(";")[0].lower()
        if incoming_type != PDF_CONTENT_TYPE:
            raise DocumentationInvalidFile()
        payload = await document.read()
        if not payload:
            raise DocumentationInvalidFile()
        new_key = build_document_key(display_name or record.display_name, document.filename)
        uploaded_key = await upload_to_s3(payload, new_key, PDF_CONTENT_TYPE)
        if not uploaded_key:
            raise DocumentationUploadFailed()
        new_key = uploaded_key

    if display_name is not None:
        record.display_name = display_name.strip() or record.display_name

    if new_key:
        old_key = record.s3_key
        record.s3_key = new_key
        record.original_filename = document.filename or record.original_filename
        record.content_type = incoming_type or PDF_CONTENT_TYPE
        try:
            await db.commit()
        except Exception:
            await db.rollback()
            await delete_from_s3(new_key)
            raise
        await delete_from_s3(old_key)
    else:
        try:
            await db.commit()
        except Exception:
            await db.rollback()
            raise

    await db.refresh(record)
    return await _build_response(record)


@documentation_route.delete("/{document_id}")
async def delete_documentation(document_id: str, 
                               db: SessionDep, 
                               current_user: User = Depends(get_current_user)
                               ) -> None:

    await _ensure_admin(current_user)

    record = await db.get(LawDocumentation, document_id)
    if not record:
        raise DocumentationNotFound()

    key = record.s3_key
    await db.delete(record)
    try:
        await db.commit()
    except Exception:
        await db.rollback()
        raise

    deleted = await delete_from_s3(key)
    if not deleted:
        raise DocumentationDeletionFailed()

    return None