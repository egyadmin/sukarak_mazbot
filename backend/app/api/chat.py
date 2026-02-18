"""
Internal WebSocket Chat & WebRTC Signaling Server
No external services - everything runs internally.
"""
from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Depends
from sqlalchemy.orm import Session
from typing import Dict, List, Optional
from datetime import datetime
import json
import uuid

from app.db.session import SessionLocal
from app.models.user import User

router = APIRouter()


class ConnectionManager:
    """Manages WebSocket connections for chat and WebRTC signaling."""

    def __init__(self):
        self.chat_rooms: Dict[str, List[dict]] = {}
        self.active_connections: Dict[str, WebSocket] = {}
        self.user_names: Dict[str, str] = {}
        self.user_roles: Dict[str, str] = {}
        self.call_sessions: Dict[str, dict] = {}
        self.message_history: Dict[str, List[dict]] = {}

    async def connect(self, websocket: WebSocket, user_id: str, user_name: str, role: str = "user"):
        await websocket.accept()
        self.active_connections[user_id] = websocket
        self.user_names[user_id] = user_name
        self.user_roles[user_id] = role
        await self.broadcast_online_users()

    async def disconnect(self, user_id: str, user_name: str = ""):
        self.active_connections.pop(user_id, None)
        self.user_names.pop(user_id, None)
        self.user_roles.pop(user_id, None)
        for room_id in list(self.chat_rooms.keys()):
            was_in_room = any(c.get("user_id") == user_id for c in self.chat_rooms[room_id])
            self.chat_rooms[room_id] = [
                c for c in self.chat_rooms[room_id] if c.get("user_id") != user_id
            ]
            if was_in_room:
                for member in self.chat_rooms[room_id]:
                    ws = self.active_connections.get(member["user_id"])
                    if ws:
                        try:
                            await ws.send_json({
                                "type": "user_left",
                                "user_id": user_id,
                                "name": user_name,
                                "room_id": room_id,
                            })
                        except Exception:
                            pass

    async def join_room(self, room_id: str, user_id: str, user_name: str, role: str = "user"):
        if room_id not in self.chat_rooms:
            self.chat_rooms[room_id] = []
        already = any(m["user_id"] == user_id for m in self.chat_rooms[room_id])
        if not already:
            self.chat_rooms[room_id].append({"user_id": user_id, "name": user_name, "role": role})
        if room_id not in self.message_history:
            self.message_history[room_id] = []
        for member in self.chat_rooms[room_id]:
            if member["user_id"] != user_id:
                ws = self.active_connections.get(member["user_id"])
                if ws:
                    try:
                        await ws.send_json({
                            "type": "user_joined",
                            "user_id": user_id,
                            "name": user_name,
                            "role": role,
                            "room_id": room_id,
                        })
                    except Exception:
                        pass

    def get_room_members(self, room_id: str) -> List[dict]:
        return self.chat_rooms.get(room_id, [])

    async def send_to_room(self, room_id: str, message: dict):
        if room_id in self.message_history:
            self.message_history[room_id].append(message)
            if len(self.message_history[room_id]) > 200:
                self.message_history[room_id] = self.message_history[room_id][-200:]

        if room_id in self.chat_rooms:
            for member in self.chat_rooms[room_id]:
                ws = self.active_connections.get(member["user_id"])
                if ws:
                    try:
                        await ws.send_json(message)
                    except Exception:
                        pass

    async def send_to_user(self, user_id: str, message: dict):
        ws = self.active_connections.get(user_id)
        if ws:
            try:
                await ws.send_json(message)
            except Exception:
                pass

    async def broadcast_online_users(self):
        online = [{"user_id": uid, "name": self.user_names.get(uid, uid), "role": self.user_roles.get(uid, "user")} for uid in self.active_connections]
        msg = {"type": "online_users", "users": online}
        for uid, ws in list(self.active_connections.items()):
            try:
                await ws.send_json(msg)
            except Exception:
                pass

    async def broadcast_status(self, user_id: str, user_name: str, status: str):
        msg = {"type": "user_status", "user_id": user_id, "name": user_name, "status": status}
        for uid, ws in list(self.active_connections.items()):
            try:
                await ws.send_json(msg)
            except Exception:
                pass

    def get_online_users(self):
        return [{"user_id": uid, "name": self.user_names.get(uid, uid), "role": self.user_roles.get(uid, "user")} for uid in self.active_connections]

    def get_room_history(self, room_id: str) -> List[dict]:
        return self.message_history.get(room_id, [])


manager = ConnectionManager()


@router.websocket("/ws/{user_id}")
async def websocket_endpoint(websocket: WebSocket, user_id: str):
    """Main WebSocket endpoint for chat and WebRTC signaling."""
    user_name = websocket.query_params.get("name", f"User_{user_id}")
    role = websocket.query_params.get("role", "user")
    await manager.connect(websocket, user_id, user_name, role)

    try:
        await websocket.send_json({
            "type": "online_users",
            "users": manager.get_online_users()
        })

        while True:
            data = await websocket.receive_json()
            msg_type = data.get("type", "")

            if msg_type == "chat_message":
                room_id = data.get("room_id", "general")
                message = {
                    "type": "chat_message",
                    "room_id": room_id,
                    "user_id": user_id,
                    "name": user_name,
                    "role": role,
                    "text": data.get("text", ""),
                    "timestamp": datetime.utcnow().isoformat(),
                    "id": str(uuid.uuid4())[:8]
                }
                await manager.send_to_room(room_id, message)

            elif msg_type == "join_room":
                room_id = data.get("room_id", "general")
                await manager.join_room(room_id, user_id, user_name, role)
                history = manager.get_room_history(room_id)
                await websocket.send_json({
                    "type": "room_history",
                    "room_id": room_id,
                    "messages": history[-50:]
                })
                members = manager.get_room_members(room_id)
                await websocket.send_json({
                    "type": "room_members",
                    "room_id": room_id,
                    "members": [{"user_id": m["user_id"], "name": m["name"], "role": m.get("role", "user")} for m in members]
                })

            elif msg_type == "call_initiate":
                target_id = data.get("target_id")
                session_id = str(uuid.uuid4())[:12]
                call_type = data.get("call_type", "video")

                manager.call_sessions[session_id] = {
                    "caller_id": user_id,
                    "caller_name": user_name,
                    "callee_id": target_id,
                    "call_type": call_type,
                    "status": "ringing",
                    "created_at": datetime.utcnow().isoformat()
                }

                await manager.send_to_user(target_id, {
                    "type": "incoming_call",
                    "session_id": session_id,
                    "caller_id": user_id,
                    "caller_name": user_name,
                    "call_type": call_type
                })

                await websocket.send_json({
                    "type": "call_ringing",
                    "session_id": session_id,
                    "target_id": target_id
                })

            elif msg_type == "call_accept":
                session_id = data.get("session_id")
                session = manager.call_sessions.get(session_id)
                if session:
                    session["status"] = "connected"
                    await manager.send_to_user(session["caller_id"], {
                        "type": "call_accepted",
                        "session_id": session_id
                    })

            elif msg_type == "call_reject":
                session_id = data.get("session_id")
                session = manager.call_sessions.get(session_id)
                if session:
                    session["status"] = "rejected"
                    await manager.send_to_user(session["caller_id"], {
                        "type": "call_rejected",
                        "session_id": session_id
                    })
                    del manager.call_sessions[session_id]

            elif msg_type == "call_end":
                session_id = data.get("session_id")
                session = manager.call_sessions.get(session_id)
                if session:
                    other_id = session["caller_id"] if user_id != session["caller_id"] else session["callee_id"]
                    await manager.send_to_user(other_id, {
                        "type": "call_ended",
                        "session_id": session_id
                    })
                    del manager.call_sessions[session_id]

            elif msg_type in ("offer", "answer", "ice_candidate"):
                target_id = data.get("target_id")
                if target_id:
                    await manager.send_to_user(target_id, {
                        "type": msg_type,
                        "from_id": user_id,
                        "session_id": data.get("session_id"),
                        "data": data.get("data")
                    })
                else:
                    room_id = data.get("room_id")
                    if room_id and room_id in manager.chat_rooms:
                        for member in manager.chat_rooms[room_id]:
                            if member["user_id"] != user_id:
                                await manager.send_to_user(member["user_id"], {
                                    "type": msg_type,
                                    "from_id": user_id,
                                    "session_id": data.get("session_id"),
                                    "data": data.get("data"),
                                    "room_id": room_id,
                                })

            elif msg_type == "get_online_users":
                await websocket.send_json({
                    "type": "online_users",
                    "users": manager.get_online_users()
                })

    except WebSocketDisconnect:
        await manager.disconnect(user_id, user_name)
        await manager.broadcast_online_users()
    except Exception as e:
        await manager.disconnect(user_id, user_name)
        await manager.broadcast_online_users()
        print(f"WebSocket error for {user_id}: {e}")
