from __future__ import annotations

import secrets
import string

from .models import Room

_ROOM_ID_ALPHABET = string.ascii_lowercase + string.digits


def _generate_id(length: int = 6) -> str:
    return "".join(secrets.choice(_ROOM_ID_ALPHABET) for _ in range(length))


class RoomStore:
    def __init__(self) -> None:
        self._rooms: dict[str, Room] = {}

    def create_room(self) -> Room:
        room_id = _generate_id()
        while room_id in self._rooms:
            room_id = _generate_id()
        admin_token = secrets.token_urlsafe(16)
        room = Room(id=room_id, admin_token=admin_token)
        self._rooms[room_id] = room
        return room

    def get(self, room_id: str) -> Room | None:
        return self._rooms.get(room_id)


room_store = RoomStore()
