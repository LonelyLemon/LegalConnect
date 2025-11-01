import asyncio

from datetime import datetime, timedelta, timezone
from typing import Final
from sqlalchemy import select
from src.auth.services import hash_password
from src.booking.models import (
    BookingRequest,
    CaseHistory,
    LawyerRating,
    LawyerScheduleSlot,
)
from src.chat.models import ChatConversation, ChatMessage, ChatParticipant
from src.core.database import DATABASE_URL, SessionLocal
from src.lawyer.models import LawyerProfile
from src.user.models import User

# Demo constants ----------------------------------------------------------------
CLIENT_EMAIL: Final[str] = "demo_client@example.com"
LAWYER_EMAIL: Final[str] = "demo_lawyer@example.com"
DEMO_PASSWORD: Final[str] = "Demo123!"


async def seed_data() -> None:
    """Seed demo data used during development."""
    print("=== SEED FILE VERSION: DEBUG2025 ===", flush=True)
    print("DATABASE_URL:", DATABASE_URL, flush=True)
    try:
        print("🌱 Seeding demo data...", flush=True)
        async with SessionLocal() as session:
            existing_users = await session.execute(
                select(User.email).where(User.email.in_([CLIENT_EMAIL, LAWYER_EMAIL]))
            )
            existing_emails = {email for (email,) in existing_users}

            if {CLIENT_EMAIL, LAWYER_EMAIL}.issubset(existing_emails):
                print("✅ Demo users already exist. Skipping seed.", flush=True)
                return
            
            # ------------------------------------------------------------------
            # 1. Create demo users
            # ------------------------------------------------------------------
            print("Creating demo users…", flush=True)
            client = User(
                username="demo_client",
                email=CLIENT_EMAIL,
                hashed_password=hash_password(DEMO_PASSWORD),
                role="client",
                is_email_verified=True,
            )
            lawyer = User(
                username="demo_lawyer",
                email=LAWYER_EMAIL,
                hashed_password=hash_password(DEMO_PASSWORD),
                role="lawyer",
                is_email_verified=True,
            )
            session.add_all([client, lawyer])
            await session.flush()
            print(f"Demo user ids -> client: {client.id}, lawyer: {lawyer.id}", flush=True)

            # ------------------------------------------------------------------
            # 2. Create lawyer profile & availability
            # ------------------------------------------------------------------
            profile = LawyerProfile(
                user_id=lawyer.id,
                display_name="Luật sư Nguyễn Văn A",
                phone_number="0123456789",
                office_address="123 Nguyễn Huệ, Quận 1, TP.HCM",
                website_url="https://luatsunguyenvana.vn",
                education="Cử nhân Luật - Đại học Luật TP.HCM",
                current_level="Luật sư cao cấp",
                years_of_experience=10,
                speaking_languages=["Tiếng Việt", "English"],
            )
            session.add(profile)
            now = datetime.now(timezone.utc)
            slot = LawyerScheduleSlot(
                lawyer_id=lawyer.id,
                start_time=now + timedelta(hours=2),
                end_time=now + timedelta(hours=3),
                is_booked=False,
            )
            session.add(slot)
            await session.flush()

            # ------------------------------------------------------------------
            # 3. Create booking request & case history
            # ------------------------------------------------------------------
            booking = BookingRequest(
                client_id=client.id,
                lawyer_id=lawyer.id,
                schedule_slot_id=slot.id,
                title="Tư vấn hợp đồng lao động",
                short_description="Xin tư vấn điều khoản chấm dứt hợp đồng sớm.",
                desired_start_time=now + timedelta(days=1),
                desired_end_time=now + timedelta(days=1, hours=1),
                status="pending",
            )
            session.add(booking)
            await session.flush()
            case = CaseHistory(
                booking_request_id=booking.id,
                lawyer_id=lawyer.id,
                client_id=client.id,
                title="Tư vấn hợp đồng lao động",
                description="Luật sư đã hỗ trợ xem xét điều khoản vi phạm.",
                state="completed",
                attachment_keys=[],
                lawyer_note="Khách hàng hợp tác tốt.",
                client_note="Tư vấn rất rõ ràng.",
                started_at=now,
                ending_time=now + timedelta(days=1),
            )
            session.add(case)
            await session.flush()
            rating = LawyerRating(
                case_history_id=case.id,
                lawyer_id=lawyer.id,
                client_id=client.id,
                stars=5,
            )
            session.add(rating)

            # ------------------------------------------------------------------
            # 4. Create chat conversation between client and lawyer
            # ------------------------------------------------------------------
            conversation = ChatConversation(last_message_at=now)
            session.add(conversation)
            await session.flush()
            session.add_all(
                [
                    ChatParticipant(conversation_id=conversation.id, user_id=client.id),
                    ChatParticipant(conversation_id=conversation.id, user_id=lawyer.id),
                ]
            )

            session.add(
                ChatMessage(
                    conversation_id=conversation.id,
                    sender_id=client.id,
                    content="Xin chào luật sư, tôi muốn hỏi về hợp đồng lao động.",
                )
            )
            await session.commit()
            print("✅ Demo data inserted successfully!", flush=True)
    except Exception as exc:
        print("SEED ERROR:", exc, flush=True)
        raise

if __name__ == "__main__":
    asyncio.run(seed_data())