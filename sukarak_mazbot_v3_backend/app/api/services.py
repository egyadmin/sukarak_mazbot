"""
Medical Tests & Nursing Services API
"""
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime
import json, os, uuid

from app.db.session import SessionLocal
from app.models.services import MedicalTest, NursingService, NursingBooking
from app.models.user import User

router = APIRouter()

DUMMY_USER_ID = 52

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# ════════════════════════════════════════
# MEDICAL TESTS
# ════════════════════════════════════════

class MedicalTestCreate(BaseModel):
    name: str
    lab: Optional[str] = None
    date: Optional[str] = None
    result: Optional[str] = None
    notes: Optional[str] = None

class MedicalTestUpdate(BaseModel):
    result: Optional[str] = None
    status: Optional[str] = None
    notes: Optional[str] = None


def _parse_attachments(att_str):
    """Parse JSON attachments string to list."""
    if not att_str:
        return []
    try:
        return json.loads(att_str)
    except:
        return []


def _test_to_dict(t):
    """Convert MedicalTest to dict with attachments."""
    return {
        "id": t.id,
        "name": t.name,
        "lab": t.lab,
        "date": t.date,
        "result": t.result,
        "status": t.status,
        "notes": t.notes,
        "attachments": _parse_attachments(t.attachments),
        "created_at": t.created_at.isoformat() if t.created_at else None,
    }


@router.get("/medical-tests")
def get_medical_tests(db: Session = Depends(get_db)):
    """Get all medical tests for the current user."""
    tests = db.query(MedicalTest).filter(
        MedicalTest.user_id == DUMMY_USER_ID
    ).order_by(MedicalTest.created_at.desc()).all()
    return [_test_to_dict(t) for t in tests]


@router.post("/medical-tests")
def create_medical_test(data: MedicalTestCreate, db: Session = Depends(get_db)):
    """Add a new medical test."""
    test = MedicalTest(
        user_id=DUMMY_USER_ID,
        name=data.name,
        lab=data.lab,
        date=data.date or datetime.now().strftime("%Y-%m-%d"),
        result=data.result or "",
        status="completed" if data.result else "pending",
        notes=data.notes,
        attachments="[]",
    )
    db.add(test)
    db.commit()
    db.refresh(test)
    return _test_to_dict(test)


@router.put("/medical-tests/{test_id}")
def update_medical_test(test_id: int, data: MedicalTestUpdate, db: Session = Depends(get_db)):
    """Update a test result or status."""
    test = db.query(MedicalTest).filter(MedicalTest.id == test_id).first()
    if not test:
        raise HTTPException(status_code=404, detail="Test not found")
    if data.result is not None:
        test.result = data.result
        test.status = "completed"
    if data.status is not None:
        test.status = data.status
    if data.notes is not None:
        test.notes = data.notes
    db.commit()
    return {"status": "updated"}


@router.delete("/medical-tests/{test_id}")
def delete_medical_test(test_id: int, db: Session = Depends(get_db)):
    """Delete a medical test."""
    test = db.query(MedicalTest).filter(MedicalTest.id == test_id).first()
    if not test:
        raise HTTPException(status_code=404, detail="Test not found")
    # Delete associated files
    for att in _parse_attachments(test.attachments):
        filepath = att.get("path", "")
        if filepath and os.path.exists(filepath):
            try:
                os.remove(filepath)
            except:
                pass
    db.delete(test)
    db.commit()
    return {"status": "deleted"}


@router.post("/medical-tests/{test_id}/upload")
async def upload_test_file(test_id: int, file: UploadFile = File(...), db: Session = Depends(get_db)):
    """Upload an image or PDF attachment for a medical test."""
    test = db.query(MedicalTest).filter(MedicalTest.id == test_id).first()
    if not test:
        raise HTTPException(status_code=404, detail="Test not found")

    # Validate file type
    allowed_types = ["image/jpeg", "image/png", "image/webp", "image/gif", "application/pdf"]
    if file.content_type not in allowed_types:
        raise HTTPException(status_code=400, detail=f"File type not allowed. Allowed: jpg, png, webp, pdf")

    # Validate file size (10MB max)
    contents = await file.read()
    if len(contents) > 10 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="File too large. Max 10MB")

    # Generate unique filename
    ext = file.filename.split(".")[-1] if "." in file.filename else "bin"
    unique_name = f"{uuid.uuid4().hex[:12]}.{ext}"
    save_path = f"media/tests/{unique_name}"

    # Save file
    with open(save_path, "wb") as f:
        f.write(contents)

    # Update attachments in DB
    current = _parse_attachments(test.attachments)
    new_attachment = {
        "name": file.filename,
        "path": save_path,
        "url": f"/media/tests/{unique_name}",
        "type": file.content_type,
        "size": len(contents),
    }
    current.append(new_attachment)
    test.attachments = json.dumps(current)
    db.commit()

    return {
        "status": "uploaded",
        "attachment": new_attachment,
        "total": len(current),
    }


@router.delete("/medical-tests/{test_id}/attachments/{index}")
def delete_test_attachment(test_id: int, index: int, db: Session = Depends(get_db)):
    """Delete a specific attachment by index."""
    test = db.query(MedicalTest).filter(MedicalTest.id == test_id).first()
    if not test:
        raise HTTPException(status_code=404, detail="Test not found")

    current = _parse_attachments(test.attachments)
    if index < 0 or index >= len(current):
        raise HTTPException(status_code=400, detail="Invalid attachment index")

    # Delete the file
    removed = current.pop(index)
    filepath = removed.get("path", "")
    if filepath and os.path.exists(filepath):
        try:
            os.remove(filepath)
        except:
            pass

    test.attachments = json.dumps(current)
    db.commit()
    return {"status": "deleted", "remaining": len(current)}


# ════════════════════════════════════════
# NURSING SERVICES
# ════════════════════════════════════════

@router.get("/nursing/services")
def get_nursing_services(db: Session = Depends(get_db)):
    """Get all available nursing services."""
    services = db.query(NursingService).filter(NursingService.active == 1).all()
    if not services:
        # Seed default services if none exist
        defaults = [
            {"title": "قياس السكر والضغط", "title_en": "Sugar & BP Check", "price": 50, "duration": "30 دقيقة", "icon": "🩺", "color": "from-teal-500 to-emerald-500"},
            {"title": "الحقن والمحاليل", "title_en": "Injections & IV", "price": 75, "duration": "20 دقيقة", "icon": "💉", "color": "from-blue-500 to-indigo-500"},
            {"title": "تغيير الضمادات", "title_en": "Wound Dressing", "price": 100, "duration": "45 دقيقة", "icon": "🩹", "color": "from-orange-500 to-amber-500"},
            {"title": "سحب عينات دم", "title_en": "Blood Sample", "price": 80, "duration": "15 دقيقة", "icon": "🧪", "color": "from-red-500 to-rose-500"},
            {"title": "رعاية ما بعد العمليات", "title_en": "Post-Op Care", "price": 200, "duration": "60 دقيقة", "icon": "🏥", "color": "from-purple-500 to-violet-500"},
            {"title": "خدمات أخرى", "title_en": "Other Services", "price": 150, "duration": "45 دقيقة", "icon": "➕", "color": "from-cyan-500 to-blue-500"},
        ]
        for d in defaults:
            svc = NursingService(**d)
            db.add(svc)
        db.commit()
        services = db.query(NursingService).filter(NursingService.active == 1).all()

    return [{
        "id": s.id,
        "title": s.title,
        "title_en": s.title_en,
        "price": str(int(s.price)) if s.price else "0",
        "duration": s.duration,
        "icon": s.icon,
        "color": s.color,
    } for s in services]


# ════════════════════════ NURSING BOOKINGS ════════════════════════

class NursingBookingCreate(BaseModel):
    service_id: int
    service_name: Optional[str] = None
    date: str
    time: Optional[str] = None
    address: str
    notes: Optional[str] = None


@router.get("/nursing/bookings")
def get_nursing_bookings(db: Session = Depends(get_db)):
    """Get all nursing bookings for the user."""
    bookings = db.query(NursingBooking).filter(
        NursingBooking.user_id == DUMMY_USER_ID
    ).order_by(NursingBooking.created_at.desc()).all()
    return [{
        "id": b.id,
        "service_name": b.service_name,
        "date": b.date,
        "time": b.time,
        "address": b.address,
        "nurse_name": b.nurse_name,
        "status": b.status,
        "notes": b.notes,
        "created_at": b.created_at.isoformat() if b.created_at else None,
    } for b in bookings]


@router.post("/nursing/bookings")
def create_nursing_booking(data: NursingBookingCreate, db: Session = Depends(get_db)):
    """Book a nursing service."""
    # Get service info
    svc = db.query(NursingService).filter(NursingService.id == data.service_id).first()
    service_name = data.service_name or (svc.title if svc else "خدمة تمريض")

    # Auto-assign a nurse name
    nurses = ["أ. فاطمة أحمد", "أ. نورا محمد", "أ. سارة عبدالله", "أ. مريم خالد"]
    import random
    nurse = random.choice(nurses)

    booking = NursingBooking(
        user_id=DUMMY_USER_ID,
        service_id=data.service_id,
        service_name=service_name,
        date=data.date,
        time=data.time,
        address=data.address,
        notes=data.notes,
        nurse_name=nurse,
        status="confirmed",
    )
    db.add(booking)
    db.commit()
    db.refresh(booking)
    return {
        "id": booking.id,
        "service_name": booking.service_name,
        "date": booking.date,
        "time": booking.time,
        "nurse_name": booking.nurse_name,
        "status": booking.status,
    }


@router.delete("/nursing/bookings/{booking_id}")
def cancel_nursing_booking(booking_id: int, db: Session = Depends(get_db)):
    """Cancel a nursing booking."""
    booking = db.query(NursingBooking).filter(NursingBooking.id == booking_id).first()
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    booking.status = "cancelled"
    db.commit()
    return {"status": "cancelled"}
