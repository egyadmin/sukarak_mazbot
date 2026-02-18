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
from app.models.services import NursingService, NursingBooking, NursingSchedule
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
    category: Optional[str] = "other"
    service_type: Optional[str] = "nursing"


class NursingServiceUpdate(BaseModel):
    title: Optional[str] = None
    title_en: Optional[str] = None
    price: Optional[float] = None
    duration: Optional[str] = None
    icon: Optional[str] = None
    color: Optional[str] = None
    category: Optional[str] = None
    service_type: Optional[str] = None
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

    today_str = datetime.now().strftime("%Y-%m-%d")
    today_bookings = db.query(NursingBooking).filter(NursingBooking.date == today_str).count()

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
        "active_services": total_services,
        "total_bookings": total_bookings,
        "today_bookings": today_bookings,
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
def list_all_services(service_type: Optional[str] = None, db: Session = Depends(get_db)):
    """Get all services (including inactive), optionally filtered by type."""
    q = db.query(NursingService)
    if service_type:
        q = q.filter(NursingService.service_type == service_type)
    services = q.all()
    return [{
        "id": s.id,
        "title": s.title,
        "title_en": s.title_en,
        "price": s.price,
        "duration": s.duration,
        "icon": s.icon,
        "color": s.color,
        "category": s.category,
        "service_type": s.service_type,
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
        category=data.category,
        service_type=data.service_type,
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
    for field in ['title', 'title_en', 'price', 'duration', 'icon', 'color', 'category', 'service_type', 'active']:
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


@router.put("/bookings/{booking_id}/schedule")
def update_booking_schedule(booking_id: int, data: dict, db: Session = Depends(get_db)):
    """Update booking appointment date, time, and optionally assign nurse."""
    booking = db.query(NursingBooking).filter(NursingBooking.id == booking_id).first()
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    if data.get("date"):
        booking.date = data["date"]
    if data.get("time"):
        booking.time = data["time"]
    if data.get("nurse_name"):
        booking.nurse_name = data["nurse_name"]
    if data.get("notes"):
        booking.notes = data["notes"]
    db.commit()
    return {"status": "updated"}


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


# ════════════════════════════════════════
# SCHEDULE MANAGEMENT (date-based)
# ════════════════════════════════════════

class ScheduleCreate(BaseModel):
    nurse_id: int
    date: str           # YYYY-MM-DD
    start_time: str     # HH:MM
    end_time: str       # HH:MM
    notes: Optional[str] = None


class ScheduleUpdate(BaseModel):
    date: Optional[str] = None
    start_time: Optional[str] = None
    end_time: Optional[str] = None
    is_available: Optional[bool] = None
    notes: Optional[str] = None


@router.get("/schedules")
def list_schedules(nurse_id: Optional[int] = None, date: Optional[str] = None, db: Session = Depends(get_db)):
    """List all schedules, optionally filtered by nurse or date."""
    q = db.query(NursingSchedule)
    if nurse_id:
        q = q.filter(NursingSchedule.nurse_id == nurse_id)
    if date:
        q = q.filter(NursingSchedule.date == date)
    slots = q.order_by(NursingSchedule.date, NursingSchedule.start_time).all()
    result = []
    for s in slots:
        nurse = db.query(User).filter(User.id == s.nurse_id).first()
        result.append({
            "id": s.id,
            "nurse_id": s.nurse_id,
            "nurse_name": nurse.name if nurse else "",
            "date": s.date,
            "start_time": s.start_time,
            "end_time": s.end_time,
            "is_available": s.is_available,
            "notes": s.notes,
            "created_at": s.created_at.isoformat() if s.created_at else None,
        })
    return result


@router.post("/schedules")
def create_schedule(data: ScheduleCreate, db: Session = Depends(get_db)):
    """Add a new available time slot for a nurse."""
    nurse = db.query(User).filter(User.id == data.nurse_id, User.role == "nurse").first()
    if not nurse:
        raise HTTPException(status_code=404, detail="Nurse not found")

    slot = NursingSchedule(
        nurse_id=data.nurse_id,
        date=data.date,
        start_time=data.start_time,
        end_time=data.end_time,
        is_available=True,
        notes=data.notes,
    )
    db.add(slot)
    db.commit()
    db.refresh(slot)
    return {"status": "success", "id": slot.id}


@router.post("/schedules/bulk")
def create_bulk_schedules(data: dict, db: Session = Depends(get_db)):
    """Add multiple time slots at once (for a whole week, etc)."""
    nurse_id = data.get("nurse_id")
    slots_data = data.get("slots", [])
    nurse = db.query(User).filter(User.id == nurse_id, User.role == "nurse").first()
    if not nurse:
        raise HTTPException(status_code=404, detail="Nurse not found")

    created = []
    for s in slots_data:
        slot = NursingSchedule(
            nurse_id=nurse_id,
            date=s.get("date"),
            start_time=s.get("start_time"),
            end_time=s.get("end_time"),
            is_available=True,
            notes=s.get("notes"),
        )
        db.add(slot)
        created.append(slot)
    db.commit()
    return {"status": "success", "count": len(created)}


@router.put("/schedules/{slot_id}")
def update_schedule(slot_id: int, data: ScheduleUpdate, db: Session = Depends(get_db)):
    """Update a schedule slot."""
    slot = db.query(NursingSchedule).filter(NursingSchedule.id == slot_id).first()
    if not slot:
        raise HTTPException(status_code=404, detail="Slot not found")
    for field in ['date', 'start_time', 'end_time', 'is_available', 'notes']:
        val = getattr(data, field, None)
        if val is not None:
            setattr(slot, field, val)
    db.commit()
    return {"status": "updated"}


@router.delete("/schedules/{slot_id}")
def delete_schedule(slot_id: int, db: Session = Depends(get_db)):
    """Delete a schedule slot."""
    slot = db.query(NursingSchedule).filter(NursingSchedule.id == slot_id).first()
    if not slot:
        raise HTTPException(status_code=404, detail="Slot not found")
    db.delete(slot)
    db.commit()
    return {"status": "deleted"}


@router.get("/available-slots")
def get_available_slots(date: Optional[str] = None, db: Session = Depends(get_db)):
    """Get available time slots for the app booking view.
    Returns available nurse slots for a given date or upcoming dates."""
    q = db.query(NursingSchedule).filter(NursingSchedule.is_available == True)
    if date:
        q = q.filter(NursingSchedule.date == date)
    else:
        today = datetime.now().strftime("%Y-%m-%d")
        q = q.filter(NursingSchedule.date >= today)

    slots = q.order_by(NursingSchedule.date, NursingSchedule.start_time).all()

    # Check which slots are already booked
    result = []
    for s in slots:
        booked = db.query(NursingBooking).filter(
            NursingBooking.date == s.date,
            NursingBooking.time == s.start_time,
            NursingBooking.nurse_name != None,
            NursingBooking.status.in_(["pending", "confirmed"]),
        ).first()
        if not booked:
            nurse = db.query(User).filter(User.id == s.nurse_id).first()
            result.append({
                "id": s.id,
                "nurse_id": s.nurse_id,
                "nurse_name": nurse.name if nurse else "",
                "date": s.date,
                "start_time": s.start_time,
                "end_time": s.end_time,
            })
    return result
