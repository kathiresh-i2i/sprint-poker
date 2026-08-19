from __future__ import annotations

import os
from datetime import datetime, timedelta, timezone

from pydantic import BaseModel, ConfigDict
from sqlalchemy import Boolean, DateTime, ForeignKey, Integer, String, and_, case, func, select
from sqlalchemy.orm import DeclarativeBase, Mapped, Session, mapped_column, relationship
from sqlalchemy import create_engine

DB_PATH = os.path.join(os.path.dirname(__file__), "metrics.db")
ACTIVE_WINDOW = timedelta(minutes=5)

engine = create_engine(f"sqlite:///{DB_PATH}", connect_args={"check_same_thread": False})


class Base(DeclarativeBase):
    pass


class RoomMetric(Base):
    __tablename__ = "rooms_metrics"

    room_id: Mapped[str] = mapped_column(String, primary_key=True)
    created_at: Mapped[datetime] = mapped_column(DateTime)
    admin_name: Mapped[str | None] = mapped_column(String, nullable=True)
    last_active_at: Mapped[datetime] = mapped_column(DateTime)

    participants: Mapped[list["ParticipantMetric"]] = relationship(
        back_populates="room", cascade="all, delete-orphan"
    )


class ParticipantMetric(Base):
    __tablename__ = "room_participants_metrics"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    room_id: Mapped[str] = mapped_column(ForeignKey("rooms_metrics.room_id"))
    participant_name: Mapped[str] = mapped_column(String)
    is_admin: Mapped[bool] = mapped_column(Boolean, default=False)
    joined_at: Mapped[datetime] = mapped_column(DateTime)
    left_at: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)

    room: Mapped["RoomMetric"] = relationship(back_populates="participants")


class RoomMetricOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    room_id: str
    created_at: datetime
    admin_name: str | None
    last_active_at: datetime
    total_participants: int
    current_participants: int
    status: str


class AdminMetricsResponse(BaseModel):
    total_rooms: int
    rooms: list[RoomMetricOut]


def _utcnow() -> datetime:
    return datetime.now(timezone.utc).replace(tzinfo=None)


def init_db() -> None:
    Base.metadata.create_all(engine)


def record_room_created(room_id: str) -> None:
    now = _utcnow()
    with Session(engine) as session:
        if session.get(RoomMetric, room_id) is not None:
            return
        session.add(RoomMetric(room_id=room_id, created_at=now, last_active_at=now))
        session.commit()


def record_participant_joined(room_id: str, name: str, is_admin: bool) -> int:
    now = _utcnow()
    with Session(engine) as session:
        participant = ParticipantMetric(
            room_id=room_id,
            participant_name=name,
            is_admin=is_admin,
            joined_at=now,
        )
        session.add(participant)

        room = session.get(RoomMetric, room_id)
        if room is not None:
            room.last_active_at = now
            if is_admin:
                room.admin_name = name

        session.commit()
        return participant.id


def record_participant_left(participant_row_id: int) -> None:
    with Session(engine) as session:
        participant = session.get(ParticipantMetric, participant_row_id)
        if participant is not None:
            participant.left_at = _utcnow()
            session.commit()


def touch_room_activity(room_id: str) -> None:
    with Session(engine) as session:
        room = session.get(RoomMetric, room_id)
        if room is not None:
            room.last_active_at = _utcnow()
            session.commit()


def get_rooms_summary() -> AdminMetricsResponse:
    with Session(engine) as session:
        is_current = and_(ParticipantMetric.id.is_not(None), ParticipantMetric.left_at.is_(None))
        stmt = (
            select(
                RoomMetric.room_id,
                RoomMetric.created_at,
                RoomMetric.admin_name,
                RoomMetric.last_active_at,
                func.count(ParticipantMetric.id).label("total_participants"),
                func.sum(case((is_current, 1), else_=0)).label("current_participants"),
            )
            .outerjoin(ParticipantMetric, ParticipantMetric.room_id == RoomMetric.room_id)
            .group_by(RoomMetric.room_id)
            .order_by(RoomMetric.created_at.desc())
        )

        now = _utcnow()
        rooms = []
        for row in session.execute(stmt):
            is_active = (now - row.last_active_at) <= ACTIVE_WINDOW
            rooms.append(
                RoomMetricOut(
                    room_id=row.room_id,
                    created_at=row.created_at,
                    admin_name=row.admin_name,
                    last_active_at=row.last_active_at,
                    total_participants=row.total_participants,
                    current_participants=row.current_participants or 0,
                    status="active" if is_active else "idle",
                )
            )

        return AdminMetricsResponse(total_rooms=len(rooms), rooms=rooms)
