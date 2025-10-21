import pytest
import pytest_asyncio
from typing import AsyncGenerator
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine

from src.chat.models import ChatConversation, ChatParticipant
from src.chat.schemas import MessageDeliveryStatus
from src.chat.services import ChatService
from src.core.base_model import Base
from src.user.models import User


@pytest_asyncio.fixture
async def session() -> AsyncGenerator[AsyncSession, None]:
    engine = create_async_engine("sqlite+aiosqlite:///:memory:", future=True)
    async_session = async_sessionmaker(engine, expire_on_commit=False)

    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    async with async_session() as session:
        yield session

    await engine.dispose()


@pytest.mark.asyncio
async def test_message_flow_with_receipts(session: AsyncSession) -> None:
    service = ChatService(session)

    sender = User(
        username="alice",
        email="alice@example.com",
        hashed_password="hashed",
    )
    recipient = User(
        username="bob",
        email="bob@example.com",
        hashed_password="hashed",
    )
    conversation = ChatConversation()
    session.add_all([sender, recipient, conversation])
    await session.flush()

    session.add_all(
        [
            ChatParticipant(conversation_id=conversation.id, user_id=sender.id),
            ChatParticipant(conversation_id=conversation.id, user_id=recipient.id),
        ]
    )
    await session.flush()

    participant_ids = [sender.id, recipient.id]
    message = await service.create_message(
        conversation,
        sender.id,
        content="Xin chào",
        recipient_ids=participant_ids,
    )
    await session.commit()
    await session.refresh(message, attribute_names=["receipts"])
    assert len(message.receipts) == 1
    assert message.receipts[0].user_id == recipient.id
    assert message.receipts[0].delivered_at is None

    updated = await service.mark_messages_delivered([message], recipient.id)
    assert message.id in updated
    await session.commit()

    message = await service.load_message(message.id)
    receipt = next(r for r in message.receipts if r.user_id == recipient.id)
    assert receipt.delivered_at is not None
    assert receipt.read_at is None

    acked = await service.acknowledge_message(
        message.id,
        recipient.id,
        MessageDeliveryStatus.READ,
    )
    await session.commit()
    await session.refresh(acked, attribute_names=["receipts"])
    receipt = next(r for r in acked.receipts if r.user_id == recipient.id)
    assert receipt.read_at is not None

    participant = await service.ensure_participant(conversation.id, recipient.id)
    assert participant.last_read_at is not None