"""
Lab Tests Administration API
Dashboard endpoints for managing lab test services, bookings and technicians.
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import Optional
from pydantic import BaseModel
from datetime import datetime

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

class LabServiceCreate(BaseModel):
    title: str
    title_en: Optional[str] = None
    price: float = 0
    duration: Optional[str] = None
    icon: Optional[str] = "🧪"
    color: Optional[str] = "from-blue-500 to-indigo-500"
    category: Optional[str] = "blood"
    service_type: Optional[str] = "lab"
    description: Optional[str] = None
    owner_id: Optional[int] = None
    # Country-based pricing
    price_eg: Optional[float] = None
    price_sa: Optional[float] = None
    price_ae: Optional[float] = None
    price_kw: Optional[float] = None


class LabServiceUpdate(BaseModel):
    title: Optional[str] = None
    title_en: Optional[str] = None
    price: Optional[float] = None
    duration: Optional[str] = None
    icon: Optional[str] = None
    color: Optional[str] = None
    category: Optional[str] = None
    service_type: Optional[str] = None
    active: Optional[int] = None
    description: Optional[str] = None
    price_eg: Optional[float] = None
    price_sa: Optional[float] = None
    price_ae: Optional[float] = None
    price_kw: Optional[float] = None


class BookingStatusUpdate(BaseModel):
    status: str
    technician_name: Optional[str] = None


# ════════════════════════════════════════
# DASHBOARD STATS
# ════════════════════════════════════════

@router.get("/stats")
def get_lab_stats(db: Session = Depends(get_db)):
    """Get lab dashboard statistics."""
    total_services = db.query(NursingService).filter(NursingService.service_type == "lab").count()
    active_services = db.query(NursingService).filter(
        NursingService.service_type == "lab", NursingService.active == 1
    ).count()
    total_bookings = db.query(NursingBooking).join(NursingService).filter(
        NursingService.service_type == "lab"
    ).count()
    pending_bookings = db.query(NursingBooking).join(NursingService).filter(
        NursingService.service_type == "lab", NursingBooking.status == "pending"
    ).count()
    confirmed_bookings = db.query(NursingBooking).join(NursingService).filter(
        NursingService.service_type == "lab", NursingBooking.status == "confirmed"
    ).count()
    completed_bookings = db.query(NursingBooking).join(NursingService).filter(
        NursingService.service_type == "lab", NursingBooking.status == "completed"
    ).count()
    revenue = db.query(func.sum(NursingService.price)).join(NursingBooking).filter(
        NursingService.service_type == "lab", NursingBooking.status.in_(["confirmed", "completed"])
    ).scalar() or 0
    technicians = db.query(User).filter(User.role == "lab").count()

    return {
        "total_services": total_services,
        "active_services": active_services,
        "total_bookings": total_bookings,
        "pending_bookings": pending_bookings,
        "confirmed_bookings": confirmed_bookings,
        "completed_bookings": completed_bookings,
        "revenue": float(revenue),
        "technicians": technicians,
    }


# ════════════════════════════════════════
# SERVICES MANAGEMENT
# ════════════════════════════════════════

CURRENCY_MAP = {
    "eg": {"code": "EGP", "symbol": "ج.م", "field": "price_eg"},
    "sa": {"code": "SAR", "symbol": "ر.س", "field": "price_sa"},
    "ae": {"code": "AED", "symbol": "د.إ", "field": "price_ae"},
    "kw": {"code": "KWD", "symbol": "د.ك", "field": "price_kw"},
}


@router.get("/services")
def list_lab_services(country: Optional[str] = None, owner_id: Optional[int] = None, db: Session = Depends(get_db)):
    """Get all lab test services. Use ?country=eg to get localized price."""
    q = db.query(NursingService).filter(NursingService.service_type == "lab")
    if owner_id:
        q = q.filter(NursingService.owner_id == owner_id)
    services = q.order_by(NursingService.id.desc()).all()

    currency = CURRENCY_MAP.get(country, {"code": "EGP", "symbol": "ج.م", "field": "price_eg"}) if country else None

    result = []
    for s in services:
        item = {
            "id": s.id, "title": s.title, "title_en": s.title_en,
            "price": s.price, "duration": s.duration, "icon": s.icon,
            "color": s.color, "category": s.category,
            "service_type": s.service_type, "active": s.active,
            "description": s.description, "owner_id": s.owner_id,
            "price_eg": s.price_eg, "price_sa": s.price_sa,
            "price_ae": s.price_ae, "price_kw": s.price_kw,
        }
        # If country specified, set localized_price
        if currency:
            local_price = getattr(s, currency["field"], None)
            item["localized_price"] = local_price if local_price else s.price
            item["currency_code"] = currency["code"]
            item["currency_symbol"] = currency["symbol"]
        result.append(item)
    return result


@router.post("/services")
def create_lab_service(data: LabServiceCreate, db: Session = Depends(get_db)):
    """Add a new lab test service."""
    svc = NursingService(
        title=data.title, title_en=data.title_en,
        price=data.price, duration=data.duration,
        icon=data.icon or "🧪", color=data.color,
        category=data.category or "blood",
        service_type="lab", active=1,
        description=data.description, owner_id=data.owner_id,
        price_eg=data.price_eg, price_sa=data.price_sa,
        price_ae=data.price_ae, price_kw=data.price_kw,
    )
    db.add(svc)
    db.commit()
    db.refresh(svc)
    return {"status": "success", "id": svc.id, "title": svc.title}


@router.put("/services/{service_id}")
def update_lab_service(service_id: int, data: LabServiceUpdate, db: Session = Depends(get_db)):
    """Update a lab test service."""
    svc = db.query(NursingService).filter(NursingService.id == service_id, NursingService.service_type == "lab").first()
    if not svc:
        raise HTTPException(status_code=404, detail="Service not found")
    for field in ['title', 'title_en', 'price', 'duration', 'icon', 'color', 'category', 'active',
                  'description', 'price_eg', 'price_sa', 'price_ae', 'price_kw']:
        val = getattr(data, field, None)
        if val is not None:
            setattr(svc, field, val)
    db.commit()
    return {"status": "success"}


@router.put("/services/{service_id}/toggle")
def toggle_lab_service(service_id: int, db: Session = Depends(get_db)):
    """Toggle lab service active status."""
    svc = db.query(NursingService).filter(NursingService.id == service_id, NursingService.service_type == "lab").first()
    if not svc:
        raise HTTPException(status_code=404, detail="Service not found")
    svc.active = 0 if svc.active else 1
    db.commit()
    return {"status": "success", "active": svc.active}


@router.delete("/services/{service_id}")
def delete_lab_service(service_id: int, db: Session = Depends(get_db)):
    """Delete a lab test service."""
    svc = db.query(NursingService).filter(NursingService.id == service_id, NursingService.service_type == "lab").first()
    if not svc:
        raise HTTPException(status_code=404, detail="Service not found")
    db.delete(svc)
    db.commit()
    return {"status": "deleted"}


# ════════════════════════════════════════
# BOOKINGS MANAGEMENT
# ════════════════════════════════════════

@router.get("/bookings")
def list_lab_bookings(status: Optional[str] = None, db: Session = Depends(get_db)):
    """Get all lab test bookings with filters."""
    q = db.query(NursingBooking).join(NursingService).filter(NursingService.service_type == "lab")
    if status and status != "all":
        q = q.filter(NursingBooking.status == status)
    bookings = q.order_by(NursingBooking.created_at.desc()).all()

    result = []
    for b in bookings:
        user = db.query(User).filter(User.id == b.user_id).first()
        svc = db.query(NursingService).filter(NursingService.id == b.service_id).first()
        result.append({
            "id": b.id,
            "user_id": b.user_id,
            "user_name": user.name if user else "غير معروف",
            "user_phone": user.phone if user else "",
            "service_id": b.service_id,
            "service_name": b.service_name or (svc.title if svc else ""),
            "service_price": svc.price if svc else 0,
            "date": b.date,
            "time": b.time,
            "address": b.address,
            "notes": b.notes,
            "technician_name": b.nurse_name,
            "status": b.status,
            "created_at": b.created_at.isoformat() if b.created_at else None,
        })
    return result


@router.post("/bookings")
def create_lab_booking(data: dict, db: Session = Depends(get_db)):
    """Create a new lab test booking from user."""
    service = db.query(NursingService).filter(
        NursingService.id == data.get("service_id"),
        NursingService.service_type == "lab"
    ).first()
    if not service:
        raise HTTPException(status_code=404, detail="Service not found")

    booking = NursingBooking(
        user_id=data.get("user_id", 52),
        service_id=service.id,
        service_name=service.title,
        date=data.get("date", datetime.now().strftime("%Y-%m-%d")),
        time=data.get("time", "09:00"),
        address=data.get("address", ""),
        notes=data.get("notes", ""),
        status="pending",
    )
    db.add(booking)
    db.commit()
    db.refresh(booking)
    return {"status": "success", "id": booking.id}


@router.put("/bookings/{booking_id}/status")
def update_lab_booking_status(booking_id: int, data: BookingStatusUpdate, db: Session = Depends(get_db)):
    """Update lab booking status and optionally assign technician."""
    booking = db.query(NursingBooking).filter(NursingBooking.id == booking_id).first()
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    booking.status = data.status
    if data.technician_name:
        booking.nurse_name = data.technician_name
    db.commit()
    return {"status": "success"}


@router.put("/bookings/{booking_id}/assign")
def assign_technician(booking_id: int, data: dict, db: Session = Depends(get_db)):
    """Assign a lab technician to a booking."""
    booking = db.query(NursingBooking).filter(NursingBooking.id == booking_id).first()
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    booking.nurse_name = data.get("technician_name", "")
    if booking.status == "pending":
        booking.status = "confirmed"
    db.commit()
    return {"status": "success"}


@router.put("/bookings/{booking_id}/schedule")
def update_lab_booking_schedule(booking_id: int, data: dict, db: Session = Depends(get_db)):
    """Update booking appointment date, time, and optionally assign technician."""
    booking = db.query(NursingBooking).filter(NursingBooking.id == booking_id).first()
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    if data.get("date"):
        booking.date = data["date"]
    if data.get("time"):
        booking.time = data["time"]
    if data.get("technician_name"):
        booking.nurse_name = data["technician_name"]
    if booking.status == "pending":
        booking.status = "confirmed"
    db.commit()
    return {"status": "success"}


@router.delete("/bookings/{booking_id}")
def delete_lab_booking(booking_id: int, db: Session = Depends(get_db)):
    """Delete a lab booking."""
    booking = db.query(NursingBooking).filter(NursingBooking.id == booking_id).first()
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    db.delete(booking)
    db.commit()
    return {"status": "deleted"}


# ════════════════════════════════════════
# LAB TECHNICIANS MANAGEMENT
# ════════════════════════════════════════

@router.get("/technicians")
def list_technicians(db: Session = Depends(get_db)):
    """Get all users with lab role."""
    techs = db.query(User).filter(User.role == "lab").order_by(User.id.desc()).all()
    return [{
        "id": t.id, "name": t.name, "email": t.email, "phone": t.phone,
        "is_active": t.is_active,
        "created_at": t.created_at.isoformat() if t.created_at else None,
    } for t in techs]


@router.post("/technicians")
def create_technician(data: dict, db: Session = Depends(get_db)):
    """Create a new lab technician user."""
    import bcrypt
    existing = db.query(User).filter(User.email == data.get("email")).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already exists")
    hashed = bcrypt.hashpw(data.get("password", "Lab@123").encode("utf-8"), bcrypt.gensalt()).decode("utf-8")
    tech = User(
        name=data.get("name"), email=data.get("email"),
        phone=data.get("phone", ""), password=hashed,
        role="lab", country="eg", is_active=True, login_method="email",
    )
    db.add(tech)
    db.commit()
    db.refresh(tech)
    return {"status": "success", "id": tech.id}


@router.put("/technicians/{tech_id}/toggle")
def toggle_technician(tech_id: int, db: Session = Depends(get_db)):
    """Toggle technician active status."""
    tech = db.query(User).filter(User.id == tech_id, User.role == "lab").first()
    if not tech:
        raise HTTPException(status_code=404, detail="Technician not found")
    tech.is_active = not tech.is_active
    db.commit()
    return {"status": "success", "is_active": tech.is_active}


@router.delete("/technicians/{tech_id}")
def delete_technician(tech_id: int, db: Session = Depends(get_db)):
    """Delete a lab technician."""
    tech = db.query(User).filter(User.id == tech_id, User.role == "lab").first()
    if not tech:
        raise HTTPException(status_code=404, detail="Technician not found")
    db.delete(tech)
    db.commit()
    return {"status": "deleted"}
