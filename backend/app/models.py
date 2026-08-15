from __future__ import annotations

from dataclasses import dataclass, field
from typing import Optional

FIB_SERIES: list[str] = ["1", "2", "3", "5", "8"]


@dataclass
class Participant:
    id: str
    name: str
    is_admin: bool
    vote: Optional[str] = None

    def public_dict(self, revealed: bool) -> dict:
        return {
            "id": self.id,
            "name": self.name,
            "is_admin": self.is_admin,
            "has_voted": self.vote is not None,
            "vote": self.vote if revealed else None,
        }


@dataclass
class Room:
    id: str
    admin_token: str
    revealed: bool = False
    participants: dict[str, Participant] = field(default_factory=dict)

    def public_dict(self) -> dict:
        return {
            "room_id": self.id,
            "revealed": self.revealed,
            "fib_series": FIB_SERIES,
            "participants": [p.public_dict(self.revealed) for p in self.participants.values()],
        }
