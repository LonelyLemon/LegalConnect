from __future__ import annotations

import uuid
from collections.abc import Iterable

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from src.chat.exceptions import (
    ConversationAccessForbidden,
    ConversationNotFound,
    MessageAcknowledgeForbidden,
    MessageNotFound,
)
from src.chat.models import (
    ChatConversation,
    ChatMessage,
    ChatMessageReceipt,
    ChatParticipant,
)
from src.chat.schemas import MessageDeliveryStatus
from src.core.base_model import time_now


class ChatService:
    def __init__(self, db: AsyncSession) -> None:
        self.db = db

    async def get_conversation(self, conversation_id: uuid.UUID) -> ChatConversation:
        result = await self.db.execute(
            select(ChatConversation).where(ChatConversation.id == conversation_id)
        )
        conversation = result.scalar_one_or_none()
        if not conversation:
            raise ConversationNotFound()
        return conversation

    async def ensure_participant(
        self,
        conversation_id: uuid.UUID,
        user_id: uuid.UUID,
    ) -> ChatParticipant:
        stmt = select(ChatParticipant).where(
            ChatParticipant.conversation_id == conversation_id,
            ChatParticipant.user_id == user_id,
        )
        result = await self.db.execute(stmt)
        participant = result.scalar_one_or_none()
        if not participant:
            raise ConversationAccessForbidden()
        return participant

    async def get_participant_ids(self, conversation_id: uuid.UUID) -> list[uuid.UUID]:
        stmt = select(ChatParticipant.user_id).where(
            ChatParticipant.conversation_id == conversation_id
        )
        result = await self.db.execute(stmt)
        return [row[0] for row in result.all()]

    async def create_message(
        self,
        conversation: ChatConversation,
        sender_id: uuid.UUID,
        *,
        content: str | None,
        attachment_name: str | None = None,
        attachment_key: str | None = None,
        attachment_content_type: str | None = None,
        attachment_size: int | None = None,
        recipient_ids: Iterable[uuid.UUID],
    ) -> ChatMessage:
        message = ChatMessage(
            conversation_id=conversation.id,
            sender_id=sender_id,
            content=content,
            attachment_name=attachment_name,
            attachment_key=attachment_key,
            attachment_content_type=attachment_content_type,
            attachment_size=attachment_size,
        )
        conversation.last_message_at = time_now()
        self.db.add(message)
        await self.db.flush()
        await self._create_receipts(message, recipient_ids)
        return message

    async def _create_receipts(
        self,
        message: ChatMessage,
        recipient_ids: Iterable[uuid.UUID],
    ) -> None:
        for user_id in recipient_ids:
            if user_id == message.sender_id:
                continue
            receipt = ChatMessageReceipt(
                message_id=message.id,
                user_id=user_id,
            )
            self.db.add(receipt)
        await self.db.flush()

    async def acknowledge_message(
        self,
        message_id: uuid.UUID,
        user_id: uuid.UUID,
        status: MessageDeliveryStatus,
    ) -> ChatMessage:
        stmt = (
            select(ChatMessageReceipt)
            .options(selectinload(ChatMessageReceipt.message).selectinload(ChatMessage.receipts))
            .where(
                ChatMessageReceipt.message_id == message_id,
                ChatMessageReceipt.user_id == user_id,
            )
        )
        result = await self.db.execute(stmt)
        receipt = result.scalar_one_or_none()
        if not receipt:
            raise MessageAcknowledgeForbidden()

        now = time_now()
        if status is MessageDeliveryStatus.DELIVERED:
            if receipt.delivered_at is None:
                receipt.delivered_at = now
        elif status is MessageDeliveryStatus.READ:
            if receipt.delivered_at is None:
                receipt.delivered_at = now
            receipt.read_at = now
            participant = await self.ensure_participant(
                receipt.message.conversation_id,
                user_id,
            )
            if not participant.last_read_at or participant.last_read_at < now:
                participant.last_read_at = now
        else:  # pragma: no cover - defensive
            raise MessageNotFound()

        await self.db.flush()
        await self.db.refresh(receipt.message)
        return receipt.message

    async def mark_messages_delivered(
        self,
        messages: Iterable[ChatMessage],
        recipient_id: uuid.UUID,
    ) -> list[uuid.UUID]:
        now = time_now()
        updated: list[uuid.UUID] = []
        for message in messages:
            for receipt in message.receipts:
                if receipt.user_id == recipient_id and receipt.delivered_at is None:
                    receipt.delivered_at = now
                    updated.append(message.id)
        if updated:
            await self.db.flush()
        return updated

    async def load_message(self, message_id: uuid.UUID) -> ChatMessage:
        stmt = (
            select(ChatMessage)
            .options(selectinload(ChatMessage.receipts))
            .where(ChatMessage.id == message_id)
        )
        result = await self.db.execute(stmt)
        message = result.scalar_one_or_none()
        if not message:
            raise MessageNotFound()
        return message