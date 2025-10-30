import asyncio
from datetime import datetime, timedelta
from src.core.database import SessionLocal, DATABASE_URL
from src.auth.services import hash_password
from src.user.models import User
from src.lawyer.models import LawyerProfile
from src.booking.models import LawyerScheduleSlot, BookingRequest, CaseHistory, LawyerRating
from src.chat.models import ChatConversation, ChatParticipant, ChatMessage

async def seed_data():
    print("DEBUG: DATABASE_URL =", DATABASE_URL)
    try:
        print("🌱 Seeding demo data...")
        async with SessionLocal() as session:
            exists = await session.execute(User.__table__.select().where(User.email == "demo_client@example.com"))
            row = exists.first()
            print("DEBUG: row:", row)
            if row:
                print("✅ Demo data already exists.")
                return

            # Client & Lawyer
            client = User(
                username="demo_client",
                email="demo_client@example.com",
                hashed_password=hash_password("Demo123!"),
                role="client",
                is_email_verified=True,
            )

            lawyer = User(
                username="demo_lawyer",
                email="demo_lawyer@example.com",
                hashed_password=hash_password("Demo123!"),
                role="lawyer",
                is_email_verified=True,
            )
            session.add_all([client, lawyer])
            await session.flush()

            # Lawyer profile
            profile = LawyerProfile(
                user_id=lawyer.id,
                display_name="Luật sư Nguyễn Văn A",
                phone_number="0123456789",
                office_address="123 Nguyễn Huệ, Q.1, TP.HCM",
                website_url="https://luatsunguyenvana.vn",
                education="Cử nhân Luật - ĐH Luật TP.HCM",
                current_level="Luật sư cao cấp",
                years_of_experience=10,
                speaking_languages=["Tiếng Việt", "English"],
            )
            session.add(profile)

            # Schedule slot
            now = datetime.utcnow()
            slot = LawyerScheduleSlot(
                lawyer_id=lawyer.id,
                start_time=now + timedelta(hours=2),
                end_time=now + timedelta(hours=3),
                is_booked=False,
            )
            session.add(slot)
            await session.flush()

            # Booking request
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

            # Case history
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

            # Rating
            rating = LawyerRating(
                case_history_id=case.id,
                lawyer_id=lawyer.id,
                client_id=client.id,
                stars=5,
            )
            session.add(rating)

            # Chat
            conv = ChatConversation(last_message_at=now)
            session.add(conv)
            await session.flush()

            part1 = ChatParticipant(conversation_id=conv.id, user_id=client.id)
            part2 = ChatParticipant(conversation_id=conv.id, user_id=lawyer.id)
            session.add_all([part1, part2])

            msg = ChatMessage(
                conversation_id=conv.id,
                sender_id=client.id,
                content="Xin chào luật sư, tôi muốn hỏi về hợp đồng lao động.",
            )
            session.add(msg)

            await session.commit()
            print("✅ Demo data inserted successfully.")
    except Exception as e:
        print("SEED ERROR:", e)
        import traceback
        traceback.print_exc()
        raise

if __name__ == "__main__":
    asyncio.run(seed_data())
