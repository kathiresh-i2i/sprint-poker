from __future__ import annotations

import logging

from fastapi import WebSocket

logger = logging.getLogger(__name__)


class ConnectionManager:
    def __init__(self) -> None:
        self._connections: dict[str, dict[str, WebSocket]] = {}

    def add(self, room_id: str, participant_id: str, websocket: WebSocket) -> None:
        self._connections.setdefault(room_id, {})[participant_id] = websocket

    def remove(self, room_id: str, participant_id: str) -> None:
        room_connections = self._connections.get(room_id)
        if not room_connections:
            return
        room_connections.pop(participant_id, None)
        if not room_connections:
            self._connections.pop(room_id, None)

    async def broadcast(self, room_id: str, message: dict) -> None:
        room_connections = self._connections.get(room_id, {})
        for participant_id, websocket in list(room_connections.items()):
            try:
                await websocket.send_json(message)
            except Exception:
                logger.info("Dropping dead connection for participant %s in room %s", participant_id, room_id)
                self.remove(room_id, participant_id)


connection_manager = ConnectionManager()
