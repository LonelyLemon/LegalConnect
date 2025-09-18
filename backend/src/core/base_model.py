import uuid

from datetime import datetime, timezone
from sqlalchemy import MetaData, TIMESTAMP
from sqlalchemy.orm import DeclarativeBase, Mapped, declared_attr, mapped_column

from src.core.constants import DB_NAMING_CONVENTION

metadata = MetaData(naming_convention=DB_NAMING_CONVENTION)

def time_now() -> datetime:
    return datetime.now(timezone.utc)

class Base(DeclarativeBase):
    __abstract__ = True
    metadata = metadata

    @declared_attr
    def __tablename__(cls) -> str:
        return cls.__name__.lower()
    
    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, index=True, nullable=False, default=uuid.uuid4)
    create_at: Mapped[datetime] = mapped_column(
        TIMESTAMP(timezone=True),
        default=time_now
    )
    updated_at: Mapped[datetime] = mapped_column(
        TIMESTAMP(timezone=True),
        default=time_now,
        onupdate=time_now
    )

    def to_dict(self) -> dict:
        return {
            column.name: getattr(self, column.name) for column in self.__table__.columns
        }