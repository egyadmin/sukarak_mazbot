from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import desc
from typing import List, Optional
from datetime import datetime
import threading
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

from app.db.session import SessionLocal
from app.models.support import SupportTicket
from app.models.user import User
from app.schemas.support import SupportTicketCreate, SupportTicketResponse, SupportTicketReply, SupportTicketClose, SupportTicketRate

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Temporary dummy user ID until Auth is fully integrated
DUMMY_USER_ID = 52

# Email config - update these with real SMTP credentials
SUPPORT_EMAIL = "support@sukarakmazbot.com"
SMTP_HOST = "smtp.gmail.com"
SMTP_PORT = 587
SMTP_USER = ""  # Set your SMTP username
SMTP_PASS = ""  # Set your SMTP app password


def send_support_email_async(subject: str, message: str, priority: str, ticket_id: int):
    """Send email notification to support team in background thread."""
    def _send():
        try:
            if not SMTP_USER or not SMTP_PASS:
                print(f"[SUPPORT EMAIL] SMTP not configured - Ticket #{ticket_id}: {subject}")
                return

            priority_map = {"low": "🟢 منخفضة", "medium": "🟡 متوسطة", "high": "🔴 عالية"}
            priority_label = priority_map.get(priority, priority)

            html_body = f"""
            <div dir="rtl" style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f8fafc; padding: 20px; border-radius: 16px;">
                <div style="background: linear-gradient(135deg, #10b981, #059669); padding: 20px; border-radius: 12px; color: white; text-align: center; margin-bottom: 20px;">
                    <h1 style="margin: 0; font-size: 20px;">🎫 تذكرة دعم جديدة #{ticket_id}</h1>
                    <p style="margin: 5px 0 0; opacity: 0.8; font-size: 12px;">سُكَّرك مضبوط - نظام الدعم الفني</p>
                </div>
                <div style="background: white; padding: 20px; border-radius: 12px; border: 1px solid #e2e8f0;">
                    <table style="width: 100%; border-collapse: collapse;">
                        <tr>
                            <td style="padding: 8px 0; font-weight: bold; color: #374151;">الموضوع:</td>
                            <td style="padding: 8px 0; color: #1f2937;">{subject}</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px 0; font-weight: bold; color: #374151;">الأولوية:</td>
                            <td style="padding: 8px 0;">{priority_label}</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px 0; font-weight: bold; color: #374151;">التاريخ:</td>
                            <td style="padding: 8px 0; color: #6b7280;">{datetime.now().strftime('%Y-%m-%d %H:%M')}</td>
                        </tr>
                    </table>
                    <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 16px 0;">
                    <h3 style="color: #374151; margin: 0 0 8px;">الرسالة:</h3>
                    <p style="color: #4b5563; line-height: 1.6; background: #f9fafb; padding: 12px; border-radius: 8px;">{message}</p>
                </div>
                <p style="text-align: center; color: #9ca3af; font-size: 11px; margin-top: 16px;">
                    يمكنك الرد على هذه التذكرة من لوحة التحكم
                </p>
            </div>
            """

            msg = MIMEMultipart("alternative")
            msg["Subject"] = f"[تذكرة دعم #{ticket_id}] {subject}"
            msg["From"] = SMTP_USER
            msg["To"] = SUPPORT_EMAIL
            msg.attach(MIMEText(html_body, "html", "utf-8"))

            with smtplib.SMTP(SMTP_HOST, SMTP_PORT) as server:
                server.starttls()
                server.login(SMTP_USER, SMTP_PASS)
                server.send_message(msg)

            print(f"[SUPPORT EMAIL] ✅ Sent for ticket #{ticket_id}")
        except Exception as e:
            print(f"[SUPPORT EMAIL] ❌ Failed: {e}")

    thread = threading.Thread(target=_send, daemon=True)
    thread.start()


# ================================================
# USER ENDPOINTS
# ================================================

@router.post("/tickets", response_model=SupportTicketResponse)
def create_ticket(ticket_in: SupportTicketCreate, db: Session = Depends(get_db)):
    db_ticket = SupportTicket(
        user_id=DUMMY_USER_ID,
        subject=ticket_in.subject,
        message=ticket_in.message,
        priority=ticket_in.priority
    )
    db.add(db_ticket)
    db.commit()
    db.refresh(db_ticket)

    # Send email notification to support team in background
    send_support_email_async(
        subject=ticket_in.subject,
        message=ticket_in.message,
        priority=ticket_in.priority or "medium",
        ticket_id=db_ticket.id
    )

    return db_ticket

@router.get("/tickets/my", response_model=List[SupportTicketResponse])
def get_my_tickets(db: Session = Depends(get_db)):
    return db.query(SupportTicket).filter(SupportTicket.user_id == DUMMY_USER_ID).order_by(desc(SupportTicket.created_at)).all()

# ================================================
# ADMIN ENDPOINTS
# ================================================

@router.get("/admin/tickets", response_model=List[SupportTicketResponse])
def get_all_tickets(db: Session = Depends(get_db)):
    return db.query(SupportTicket).order_by(desc(SupportTicket.created_at)).all()

@router.put("/admin/tickets/{ticket_id}/reply", response_model=SupportTicketResponse)
def reply_to_ticket(ticket_id: int, reply_in: SupportTicketReply, db: Session = Depends(get_db)):
    db_ticket = db.query(SupportTicket).filter(SupportTicket.id == ticket_id).first()
    if not db_ticket:
        raise HTTPException(status_code=404, detail="Ticket not found")

    db_ticket.admin_reply = reply_in.admin_reply
    db_ticket.status = reply_in.status
    db_ticket.replied_at = datetime.now()

    # Create in-app notification for the user
    try:
        from app.models.cms import Notification
        notif = Notification(
            title=f"رد على تذكرة الدعم: {db_ticket.subject}",
            details=reply_in.admin_reply[:200],
            type="support_reply",
            target="users",
            is_read=False,
            active=True
        )
        db.add(notif)
    except Exception as e:
        print(f"Failed to create notification: {e}")

    db.commit()
    db.refresh(db_ticket)
    return db_ticket

@router.put("/admin/tickets/{ticket_id}/close", response_model=SupportTicketResponse)
def close_ticket(ticket_id: int, db: Session = Depends(get_db)):
    """Admin closes a ticket after resolution."""
    db_ticket = db.query(SupportTicket).filter(SupportTicket.id == ticket_id).first()
    if not db_ticket:
        raise HTTPException(status_code=404, detail="Ticket not found")

    db_ticket.status = "closed"
    db_ticket.closed_at = datetime.now()

    # Notify user that ticket is closed
    try:
        from app.models.cms import Notification
        notif = Notification(
            title=f"تم إغلاق تذكرة الدعم: {db_ticket.subject}",
            details="تم إغلاق تذكرتك. نرجو تقييم تجربتك مع فريق الدعم.",
            type="support_closed",
            target="users",
            is_read=False,
            active=True
        )
        db.add(notif)
    except Exception as e:
        print(f"Failed to create notification: {e}")

    db.commit()
    db.refresh(db_ticket)
    return db_ticket


# ================================================
# USER RATING ENDPOINT
# ================================================

@router.put("/tickets/{ticket_id}/rate", response_model=SupportTicketResponse)
def rate_ticket(ticket_id: int, rate_in: SupportTicketRate, db: Session = Depends(get_db)):
    """User rates a closed ticket."""
    db_ticket = db.query(SupportTicket).filter(
        SupportTicket.id == ticket_id,
        SupportTicket.user_id == DUMMY_USER_ID
    ).first()
    if not db_ticket:
        raise HTTPException(status_code=404, detail="Ticket not found")
    if db_ticket.status != "closed":
        raise HTTPException(status_code=400, detail="Only closed tickets can be rated")
    if rate_in.rating < 1 or rate_in.rating > 5:
        raise HTTPException(status_code=400, detail="Rating must be 1-5")

    db_ticket.rating = rate_in.rating
    db_ticket.rating_comment = rate_in.rating_comment
    db.commit()
    db.refresh(db_ticket)
    return db_ticket
