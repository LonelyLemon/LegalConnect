from src.core.base_model import Base
from src.user.models import User
from src.lawyer.models import (
    LawyerProfile, 
    LawyerVerificationRequest,
    LawyerRoleRevocation,
)
from src.chat.models import  (
    ChatConversation,
    ChatParticipant,
    ChatMessage,
    ChatMessageReceipt,
)
from src.documentation.models import LawDocumentation
from src.booking.models import (
    LawyerScheduleSlot,
    LawyerRating,
    BookingRequest,
    CaseHistory
)