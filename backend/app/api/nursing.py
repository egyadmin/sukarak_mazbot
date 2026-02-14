"""
Nursing Administration API
Full dashboard endpoints for managing nursing services, bookings and nurses.
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import Optional
from pydantic import BaseModel
from datetime import datetime
import random

from app.db.session import SessionLocal
from app.models.services import NursingService, NursingBooking
from app.models.user import User

router = APIRouter()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# ════════════════════════════════════════
# SCHEMAS
# ════════════════════════════════════════

class NursingServiceCreate(BaseModel):
    title: str
    title_en: Optional[str] = None
    price: float = 0
    duration: Optional[str] = None
    icon: Optional[str] = "🏥"
    color: Optional[str] = "from-teal-500 to-emerald-500"


class NursingServiceUpdate(BaseModel):
    title: Optional[str] = None
    title_en: Optional[str] = None
    price: Optional[float] = None
    duration: Optional[str] = None
    icon: Optional[str] = None
    color: Optional[str] = None
    active: Optional[int] = None


class BookingStatusUpdate(BaseModel):
    status: str  # pending, confirmed, completed, cancelled
    nurse_name: Optional[str] = None


# ════════════════════════════════════════
# DASHBOARD STATS
# ════════════════════════════════════════

@router.get("/stats")
def get_nursing_stats(db: Session = Depends(get_db)):
    """Get nursing dashboard statistics."""
    total_services = db.query(NursingService).filter(NursingService.active == 1).count()
    total_bookings = db.query(NursingBooking).count()
    pending_bookings = db.query(NursingBooking).filter(NursingBooking.status == "pending").count()
    confirmed_bookings = db.query(NursingBooking).filter(NursingBooking.status == "confirmed").count()
    completed_bookings = db.query(NursingBooking).filter(NursingBooking.status == "completed").count()
    cancelled_bookings = db.query(NursingBooking).filter(NursingBooking.status == "cancelled").count()
    total_nurses = db.query(User).filter(User.role == "nurse").count()
    active_nurses = db.query(User).filter(User.role == "nurse", User.is_active == True).count()

    # Revenue from completed bookings
    completed_ids = db.query(NursingBooking.service_id).filter(
        NursingBooking.status.in_(["confirmed", "completed"])
    ).all()
    total_revenue = 0
    for (sid,) in completed_ids:
        svc = db.query(NursingService).filter(NursingService.id == sid).first()
        if svc:
            total_revenue += svc.price or 0

    return {
        "total_services": total_services,
        "total_bookings": total_bookings,
        "pending_bookings": pending_bookings,
        "confirmed_bookings": confirmed_bookings,
        "completed_bookings": completed_bookings,
        "cancelled_bookings": cancelled_bookings,
        "total_nurses": total_nurses,
        "active_nurses": active_nurses,
        "total_revenue": total_revenue,
    }


# ════════════════════════════════════════
# SERVICES MANAGEMENT
# ════════════════════════════════════════

@router.get("/services")
def list_all_services(db: Session = Depends(get_db)):
    """Get all nursing services (including inactive)."""
    services = db.query(NursingService).all()
    return [{
        "id": s.id,
        "title": s.title,
        "title_en": s.title_en,
        "price": s.price,
        "duration": s.duration,
        "icon": s.icon,
        "color": s.color,
        "active": s.active,
    } for s in services]


@router.post("/services")
def create_service(data: NursingServiceCreate, db: Session = Depends(get_db)):
    """Add a new nursing service."""
    svc = NursingService(
        title=data.title,
        title_en=data.title_en,
        price=data.price,
        duration=data.duration,
        icon=data.icon,
        color=data.color,
        active=1,
    )
    db.add(svc)
    db.commit()
    db.refresh(svc)
    return {"status": "success", "id": svc.id}


@router.put("/services/{service_id}")
def update_service(service_id: int, data: NursingServiceUpdate, db: Session = Depends(get_db)):
    """Update a nursing service."""
    svc = db.query(NursingService).filter(NursingService.id == service_id).first()
    if not svc:
        raise HTTPException(status_code=404, detail="Service not found")
    for field in ['title', 'title_en', 'price', 'duration', 'icon', 'color', 'active']:
        val = getattr(data, field, None)
        if val is not None:
            setattr(svc, field, val)
    db.commit()
    return {"status": "updated"}


@router.put("/services/{service_id}/toggle")
def toggle_service(service_id: int, db: Session = Depends(get_db)):
    """Toggle service active status."""
    svc = db.query(NursingService).filter(NursingService.id == service_id).first()
    if not svc:
        raise HTTPException(status_code=404, detail="Service not found")
    svc.active = 0 if svc.active == 1 else 1
    db.commit()
    return {"status": "success", "active": svc.active}


@router.delete("/services/{service_id}")
def delete_service(service_id: int, db: Session = Depends(get_db)):
    """Delete a nursing service."""
    svc = db.query(NursingService).filter(NursingService.id == service_id).first()
    if not svc:
        raise HTTPException(status_code=404, detail="Service not found")
    db.delete(svc)
    db.commit()
    return {"status": "deleted"}


# ════════════════════════════════════════
# BOOKINGS MANAGEMENT
# ════════════════════════════════════════

@router.get("/bookings")
def list_all_bookings(status: Optional[str] = None, db: Session = Depends(get_db)):
    """Get all nursing bookings with filters."""
    q = db.query(NursingBooking).order_by(NursingBooking.created_at.desc())
    if status and status != "all":
        q = q.filter(NursingBooking.status == status)
    bookings = q.all()
    result = []
    for b in bookings:
        user = db.query(User).filter(User.id == b.user_id).first()
        svc = db.query(NursingService).filter(NursingService.id == b.service_id).first()
        result.append({
            "id": b.id,
            "user_id": b.user_id,
            "user_name": user.name if user else "غير معروف",
            "user_phone": user.phone if user else "",
            "user_email": user.email if user else "",
            "service_id": b.service_id,
            "service_name": b.service_name or (svc.title if svc else ""),
            "service_price": svc.price if svc else 0,
            "date": b.date,
            "time": b.time,
            "address": b.address,
            "nurse_name": b.nurse_name,
            "status": b.status,
            "notes": b.notes,
            "created_at": b.created_at.isoformat() if b.created_at else None,
        })
    return result


@router.post("/bookings")
def create_booking(data: dict, db: Session = Depends(get_db)):
    """Create a new nursing booking from user."""
    service_id = data.get("service_id")
    svc = db.query(NursingService).filter(NursingService.id == service_id).first()
    
    # Auto-assign an available nurse
    available_nurses = db.query(User).filter(User.role == "nurse", User.is_active == True).all()
    nurse_name = None
    if available_nurses:
        nurse = random.choice(available_nurses)
        nurse_name = nurse.name
    
    booking = NursingBooking(
        user_id=data.get("user_id", 1),
        service_id=service_id,
        service_name=data.get("service_name") or (svc.title if svc else ""),
        date=data.get("date"),
        time=data.get("time"),
        address=data.get("address"),
        notes=data.get("notes"),
        nurse_name=nurse_name,
        status="pending",
    )
    db.add(booking)
    db.commit()
    db.refresh(booking)
    return {
        "status": "success",
        "id": booking.id,
        "nurse_name": nurse_name or "سيتم التعيين قريباً",
    }


@router.put("/bookings/{booking_id}/status")
def update_booking_status(booking_id: int, data: BookingStatusUpdate, db: Session = Depends(get_db)):
    """Update booking status and optionally assign nurse."""
    booking = db.query(NursingBooking).filter(NursingBooking.id == booking_id).first()
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    booking.status = data.status
    if data.nurse_name:
        booking.nurse_name = data.nurse_name
    db.commit()
    return {"status": "updated", "new_status": booking.status}


@router.put("/bookings/{booking_id}/assign")
def assign_nurse(booking_id: int, data: dict, db: Session = Depends(get_db)):
    """Assign a nurse to a booking."""
    booking = db.query(NursingBooking).filter(NursingBooking.id == booking_id).first()
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    booking.nurse_name = data.get("nurse_name", booking.nurse_name)
    if booking.status == "pending":
        booking.status = "confirmed"
    db.commit()
    return {"status": "assigned", "nurse_name": booking.nurse_name}


@router.delete("/bookings/{booking_id}")
def delete_booking(booking_id: int, db: Session = Depends(get_db)):
    """Delete a booking."""
    booking = db.query(NursingBooking).filter(NursingBooking.id == booking_id).first()
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    db.delete(booking)
    db.commit()
    return {"status": "deleted"}


# ════════════════════════════════════════
# NURSES MANAGEMENT
# ════════════════════════════════════════

@router.get("/nurses")
def list_nurses(db: Session = Depends(get_db)):
    """Get all users with nurse role."""
    nurses = db.query(User).filter(User.role == "nurse").order_by(User.created_at.desc()).all()
    return [{
        "id": n.id,
        "name": n.name,
        "email": n.email,
        "phone": n.phone,
        "is_active": n.is_active,
        "created_at": n.created_at.isoformat() if n.created_at else None,
    } for n in nurses]


@router.post("/nurses")
def create_nurse(data: dict, db: Session = Depends(get_db)):
    """Create a new nurse user."""
    import bcrypt
    existing = db.query(User).filter(User.email == data.get("email")).first()
    if existing:
        raise HTTPException(status_code=400, detail="البريد الإلكتروني مُستخدم بالفعل")
    hashed = bcrypt.hashpw(data.get("password", "Nurse@123").encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
    nurse = User(
        name=data.get("name"),
        email=data.get("email"),
        phone=data.get("phone", ""),
        password=hashed,
        role="nurse",
        is_active=True,
        login_method="email",
    )
    db.add(nurse)
    db.commit()
    db.refresh(nurse)
    return {"status": "success", "id": nurse.id}


@router.put("/nurses/{nurse_id}/toggle")
def toggle_nurse(nurse_id: int, db: Session = Depends(get_db)):
    """Toggle nurse active status."""
    nurse = db.query(User).filter(User.id == nurse_id, User.role == "nurse").first()
    if not nurse:
        raise HTTPException(status_code=404, detail="Nurse not found")
    nurse.is_active = not nurse.is_active
    db.commit()
    return {"status": "success", "is_active": nurse.is_active}


@router.delete("/nurses/{nurse_id}")
def delete_nurse(nurse_id: int, db: Session = Depends(get_db)):
    """Delete a nurse."""
    nurse = db.query(User).filter(User.id == nurse_id, User.role == "nurse").first()
    if not nurse:
        raise HTTPException(status_code=404, detail="Nurse not found")
    db.delete(nurse)
    db.commit()
    return {"status": "deleted"}
