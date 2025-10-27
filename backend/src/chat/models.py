from __future__ import annotations

import uuid
from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, Integer, String, Text, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from src.user.models import User
from src.core.base_model import Base


class ChatConversation(Base):
    __tablename__ = "chat_conversations"

    last_message_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)

    participants: Mapped[list["ChatParticipant"]] = relationship(
        "ChatParticipant",
        back_populates="conversation",
        cascade="all, delete-orphan",
        lazy="selectin",
    )
    messages: Mapped[list["ChatMessage"]] = relationship(
        "ChatMessage",
        back_populates="conversation",
        cascade="all, delete-orphan",
        lazy="selectin",
    )


class ChatParticipant(Base):
    __tablename__ = "chat_participants"
    __table_args__ = (
        UniqueConstraint(
            "conversation_id",
            "user_id",
            name="uq_chat_participant_membership",
        ),
    )

    conversation_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("chat_conversations.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    user_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("user.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    last_read_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)

    conversation: Mapped[ChatConversation] = relationship(
        "ChatConversation",
        back_populates="participants",
        lazy="joined",
    )
    user: Mapped["User"] = relationship(
        "User",
        lazy="joined",
    )


class ChatMessage(Base):
    __tablename__ = "chat_messages"

    conversation_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("chat_conversations.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    sender_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("user.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    content: Mapped[str | None] = mapped_column(Text, nullable=True)
    attachment_name: Mapped[str | None] = mapped_column(String(255), nullable=True)
    attachment_key: Mapped[str | None] = mapped_column(String(512), nullable=True)
    attachment_content_type: Mapped[str | None] = mapped_column(String(100), nullable=True)
    attachment_size: Mapped[int | None] = mapped_column(Integer, nullable=True)

    conversation: Mapped[ChatConversation] = relationship(
        "ChatConversation",
        back_populates="messages",
        lazy="joined",
    )
    sender: Mapped["User"] = relationship(
        "User",
        lazy="joined",
    )
    receipts: Mapped[list["ChatMessageReceipt"]] = relationship(
        "ChatMessageReceipt",
        back_populates="message",
        cascade="all, delete-orphan",
        lazy="selectin",
    )


class ChatMessageReceipt(Base):
    __tablename__ = "chat_message_receipts"
    __table_args__ = (
        UniqueConstraint(
            "message_id",
            "user_id",
            name="uq_chat_message_receipt",
        ),
    )

    message_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("chat_messages.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    user_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("user.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    delivered_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    read_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)

    message: Mapped[ChatMessage] = relationship(
        "ChatMessage",
        back_populates="receipts",
        lazy="joined",
    )