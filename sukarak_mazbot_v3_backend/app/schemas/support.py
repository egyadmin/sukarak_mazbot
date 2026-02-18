from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class SupportTicketCreate(BaseModel):
    subject: str
    message: str
    priority: Optional[str] = "medium"

class SupportTicketReply(BaseModel):
    admin_reply: str
    status: Optional[str] = "replied"

class SupportTicketClose(BaseModel):
    status: Optional[str] = "closed"

class SupportTicketRate(BaseModel):
    rating: int  # 1-5
    rating_comment: Optional[str] = None

class SupportTicketResponse(BaseModel):
    id: int
    user_id: int
    subject: str
    message: str
    status: str
    priority: str
    admin_reply: Optional[str] = None
    replied_at: Optional[datetime] = None
    closed_at: Optional[datetime] = None
    rating: Optional[int] = None
    rating_comment: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
