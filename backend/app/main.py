from __future__ import annotations

import secrets

from fastapi import FastAPI, HTTPException, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from .connection_manager import connection_manager
from .models import FIB_SERIES, Participant
from .room_store import room_store

app = FastAPI(title="Sprint Poker API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


class CreateRoomResponse(BaseModel):
    room_id: str
    admin_token: str


@app.get("/")
def health_check() -> dict:
    return {"status": "ok"}


@app.post("/rooms", response_model=CreateRoomResponse)
def create_room() -> CreateRoomResponse:
    room = room_store.create_room()
    return CreateRoomResponse(room_id=room.id, admin_token=room.admin_token)


@app.get("/rooms/{room_id}")
def get_room(room_id: str) -> dict:
    room = room_store.get(room_id)
    if room is None:
        raise HTTPException(status_code=404, detail="Room not found")
    admin = next((p for p in room.participants.values() if p.is_admin), None)
    return {"room_id": room.id, "admin_name": admin.name if admin else None}


@app.websocket("/ws/rooms/{room_id}")
async def room_socket(websocket: WebSocket, room_id: str) -> None:
    room = room_store.get(room_id)
    if room is None:
        await websocket.close(code=4004, reason="Room not found")
        return

    await websocket.accept()
    participant_id: str | None = None

    try:
        while True:
            message = await websocket.receive_json()
            msg_type = message.get("type")

            if msg_type == "join":
                name = str(message.get("name", "")).strip()[:40] or "Anonymous"
                admin_token = message.get("admin_token")
                is_admin = bool(admin_token) and admin_token == room.admin_token
                participant_id = secrets.token_urlsafe(8)
                room.participants[participant_id] = Participant(
                    id=participant_id, name=name, is_admin=is_admin
                )
                connection_manager.add(room_id, participant_id, websocket)
                await websocket.send_json(
                    {
                        "type": "welcome",
                        "participant_id": participant_id,
                        "is_admin": is_admin,
                        "fib_series": FIB_SERIES,
                    }
                )
                await connection_manager.broadcast(
                    room_id, {"type": "state", "room": room.public_dict()}
                )

            elif msg_type == "vote":
                if participant_id is None or participant_id not in room.participants:
                    continue
                participant = room.participants[participant_id]
                if participant.is_admin:
                    continue
                value = message.get("value")
                if value not in FIB_SERIES:
                    continue
                participant.vote = value
                await connection_manager.broadcast(
                    room_id, {"type": "state", "room": room.public_dict()}
                )

            elif msg_type == "reveal":
                if participant_id is None:
                    continue
                participant = room.participants.get(participant_id)
                if participant is None or not participant.is_admin:
                    continue
                room.revealed = True
                await connection_manager.broadcast(
                    room_id, {"type": "state", "room": room.public_dict()}
                )

            elif msg_type == "reset":
                if participant_id is None:
                    continue
                participant = room.participants.get(participant_id)
                if participant is None or not participant.is_admin:
                    continue
                room.revealed = False
                for p in room.participants.values():
                    p.vote = None
                await connection_manager.broadcast(
                    room_id, {"type": "state", "room": room.public_dict()}
                )

    except WebSocketDisconnect:
        pass
    finally:
        if participant_id is not None:
            connection_manager.remove(room_id, participant_id)
            room.participants.pop(participant_id, None)
            await connection_manager.broadcast(
                room_id, {"type": "state", "room": room.public_dict()}
            )
