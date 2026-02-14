from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
import os, uuid
from sqlalchemy.orm import Session
from typing import List
from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from app.db.session import SessionLocal
from app.models.health import SugarReading, InsulinRecord, ExerciseRecord, MealRecord, DrugRecord, MedicineReminder
from app.models.activity import Appointment
from app.models.user import User
from app.schemas.health import (
    SugarReadingCreate, SugarReadingResponse,
    InsulinRecordCreate, InsulinRecordResponse,
    ExerciseRecordCreate, ExerciseRecordResponse,
    MealRecordCreate, MealRecordResponse
)

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Temporary dummy user ID until Auth is fully integrated in frontend
DUMMY_USER_ID = 52


# ═══════════════════════════════════════
# USER PROFILE
# ═══════════════════════════════════════
class ProfileUpdate(BaseModel):
    name: Optional[str] = None
    phone: Optional[str] = None
    age: Optional[str] = None
    weight: Optional[str] = None
    country: Optional[str] = None

@router.get("/profile")
def get_profile(user_id: int = 0, db: Session = Depends(get_db)):
    uid = user_id if user_id > 0 else DUMMY_USER_ID
    user = db.query(User).filter(User.id == uid).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Count health data
    sugar_count = db.query(SugarReading).filter(SugarReading.user_id == uid).count()
    drug_count = db.query(DrugRecord).filter(DrugRecord.user_id == uid).count()
    appt_count = db.query(Appointment).filter(Appointment.patient_id == uid).count()
    
    return {
        "id": user.id,
        "name": user.name,
        "email": user.email,
        "phone": user.phone,
        "age": user.age,
        "weight": user.weight,
        "country": user.country,
        "role": user.role,
        "profile_image": user.profile_image,
        "login_method": user.login_method or "email",
        "is_active": user.is_active,
        "created_at": user.created_at.isoformat() if user.created_at else None,
        "wallet_balance": user.wallet_balance or 0.0,
        "loyalty_points": user.loyalty_points or 0,
        "stats": {
            "sugar_readings": sugar_count,
            "medications": drug_count,
            "appointments": appt_count,
        }
    }

@router.put("/profile")
def update_profile(data: ProfileUpdate, user_id: int = 0, db: Session = Depends(get_db)):
    uid = user_id if user_id > 0 else DUMMY_USER_ID
    user = db.query(User).filter(User.id == uid).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    if data.name is not None:
        user.name = data.name
    if data.phone is not None:
        user.phone = data.phone
    if data.age is not None:
        user.age = data.age
    if data.weight is not None:
        user.weight = data.weight
    if data.country is not None:
        user.country = data.country
    db.commit()
    return {"status": "success"}


@router.post("/profile/image")
async def upload_profile_image(file: UploadFile = File(...), user_id: int = 0, db: Session = Depends(get_db)):
    uid = user_id if user_id > 0 else DUMMY_USER_ID
    user = db.query(User).filter(User.id == uid).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    os.makedirs("media/profiles", exist_ok=True)
    ext = file.filename.split(".")[-1] if "." in file.filename else "jpg"
    filename = f"{uid}_{uuid.uuid4().hex[:8]}.{ext}"
    filepath = f"media/profiles/{filename}"
    
    content = await file.read()
    with open(filepath, "wb") as f:
        f.write(content)
    
    user.profile_image = f"/media/profiles/{filename}"
    db.commit()
    return {"status": "success", "image_url": user.profile_image}


@router.get("/sugar", response_model=List[SugarReadingResponse])
def get_sugar_readings(db: Session = Depends(get_db)):
    return db.query(SugarReading).filter(SugarReading.user_id == DUMMY_USER_ID).order_by(SugarReading.created_at.desc()).all()

@router.post("/sugar", response_model=SugarReadingResponse)
def create_sugar_reading(reading_in: SugarReadingCreate, db: Session = Depends(get_db)):
    db_obj = SugarReading(
        user_id=DUMMY_USER_ID,
        reading=reading_in.reading,
        test_type=reading_in.test_type
    )
    if reading_in.measured_at:
        try:
            db_obj.created_at = datetime.fromisoformat(reading_in.measured_at)
        except Exception:
            pass
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj

@router.get("/insulin", response_model=List[InsulinRecordResponse])
def get_insulin_records(db: Session = Depends(get_db)):
    return db.query(InsulinRecord).filter(InsulinRecord.user_id == DUMMY_USER_ID).all()

@router.post("/insulin", response_model=InsulinRecordResponse)
def create_insulin_record(record_in: InsulinRecordCreate, db: Session = Depends(get_db)):
    db_obj = InsulinRecord(
        user_id=DUMMY_USER_ID,
        reading=record_in.reading,
        test_type=record_in.test_type
    )
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj

@router.get("/exercise", response_model=List[ExerciseRecordResponse])
def get_exercise_records(db: Session = Depends(get_db)):
    return db.query(ExerciseRecord).filter(ExerciseRecord.user_id == DUMMY_USER_ID).all()

@router.post("/exercise", response_model=ExerciseRecordResponse)
def create_exercise_record(record_in: ExerciseRecordCreate, db: Session = Depends(get_db)):
    db_obj = ExerciseRecord(
        user_id=DUMMY_USER_ID,
        type=record_in.type,
        duration=record_in.duration
    )
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj


# ================================================
# APPOINTMENTS
# ================================================
class AppointmentCreate(BaseModel):
    doctor_name: str
    specialization: Optional[str] = None
    appointment_type: str = "video"
    scheduled_at: str  # ISO datetime string
    notes: Optional[str] = None
    duration_minutes: int = 30


@router.get("/appointments")
def get_appointments(db: Session = Depends(get_db)):
    appts = db.query(Appointment).filter(
        (Appointment.patient_id == DUMMY_USER_ID) | (Appointment.doctor_id == DUMMY_USER_ID)
    ).order_by(Appointment.scheduled_at.desc()).all()
    return [{
        "id": a.id,
        "doctor_name": a.doctor_name or "طبيب",
        "patient_name": a.patient_name or "مريض",
        "appointment_type": a.appointment_type,
        "status": a.status,
        "scheduled_at": a.scheduled_at.isoformat() if a.scheduled_at else None,
        "notes": a.notes,
        "duration_minutes": a.duration_minutes,
    } for a in appts]


@router.post("/appointments")
def create_appointment(data: AppointmentCreate, db: Session = Depends(get_db)):
    appt = Appointment(
        doctor_id=1,  # Default doctor
        patient_id=DUMMY_USER_ID,
        doctor_name=data.doctor_name,
        patient_name="المستخدم",
        appointment_type=data.appointment_type,
        scheduled_at=datetime.fromisoformat(data.scheduled_at),
        notes=data.notes,
        duration_minutes=data.duration_minutes,
    )
    db.add(appt)
    db.commit()
    db.refresh(appt)
    return {"status": "success", "id": appt.id}


@router.put("/appointments/{appt_id}/cancel")
def cancel_appointment(appt_id: int, db: Session = Depends(get_db)):
    appt = db.query(Appointment).filter(Appointment.id == appt_id).first()
    if not appt:
        raise HTTPException(status_code=404, detail="Appointment not found")
    appt.status = "cancelled"
    db.commit()
    return {"status": "success"}


# ================================================
# REFERENCE DATA - Foods & Sports
# ================================================
from app.models.reference import FoodReference, SportReference, FoodType

@router.get("/foods")
def get_foods(type: Optional[str] = None, db: Session = Depends(get_db)):
    q = db.query(FoodReference)
    if type:
        q = q.filter(FoodReference.type == type)
    foods = q.all()
    return [{
        "id": f.id,
        "name": f.name,
        "type": f.type,
        "serving": f.serving,
        "glycemic_index": f.glycemic_index,
        "calories": f.calories,
        "carb": f.carb,
        "protein": f.protein,
        "fats": f.fats,
    } for f in foods]


@router.get("/foods/categories")
def get_food_categories(db: Session = Depends(get_db)):
    cats = db.query(FoodReference.type).distinct().all()
    return [c[0] for c in cats if c[0]]


# ════════════════════════════════════════
# FOOD TYPES - Allowed / Prohibited
# ════════════════════════════════════════

@router.get("/food-types")
def get_food_types(food_class: Optional[str] = None, category: Optional[str] = None, db: Session = Depends(get_db)):
    """Get food classifications (allowed / limited / prohibited)."""
    # Auto-seed if empty
    count = db.query(FoodType).count()
    if count == 0:
        _seed_food_types(db)

    q = db.query(FoodType)
    if food_class:
        q = q.filter(FoodType.food_class == food_class)
    if category:
        q = q.filter(FoodType.type == category)
    items = q.order_by(FoodType.food_class, FoodType.type, FoodType.name).all()
    return [{
        "id": f.id,
        "name": f.name,
        "type": f.type,
        "class": f.food_class,
    } for f in items]


@router.get("/food-types/classes")
def get_food_classes(db: Session = Depends(get_db)):
    """Get distinct food classes."""
    count = db.query(FoodType).count()
    if count == 0:
        _seed_food_types(db)
    classes = db.query(FoodType.food_class).distinct().all()
    return [c[0] for c in classes if c[0]]


@router.get("/food-types/categories")
def get_food_type_categories(db: Session = Depends(get_db)):
    """Get distinct categories within food types."""
    cats = db.query(FoodType.type).distinct().all()
    return [c[0] for c in cats if c[0]]


def _seed_food_types(db: Session):
    """Seed food_types from original database data."""
    data = [
        ("الإجاص (Pear)", "الفواكه", "أطعمة مسموحة"),
        ("الأرز البني (Brown Rice)", "الحبوب والبذور", "أطعمة مسموحة"),
        ("الباذنجان (Eggplant)", "الخضروات", "أطعمة مسموحة"),
        ("البروكلي (Broccoli)", "الخضروات", "أطعمة مسموحة"),
        ("البطاطا", "الخضروات", "أطعمة مسموحة"),
        ("التفاح (Apple)", "الفواكه", "أطعمة مسموحة"),
        ("التونة (Tuna)", "الأسماك", "أطعمة مسموحة"),
        ("الجبن القريش (Cottage Cheese)", "منتجات الالبان", "أطعمة مسموحة"),
        ("الجزر (Carrot)", "الخضروات", "أطعمة مسموحة"),
        ("الجوز (Walnuts)", "المكسرات", "أطعمة مسموحة"),
        ("الحليب قليل الدسم (Low-Fat Milk)", "منتجات الالبان", "أطعمة مسموحة"),
        ("الخضروات الورقية", "الخضروات", "أطعمة مسموحة"),
        ("الخوخ (Peach)", "الفواكه", "أطعمة مسموحة"),
        ("الزبادي الطبيعي (Plain Yogurt)", "منتجات الالبان", "أطعمة مسموحة"),
        ("الزبادي اليوناني (Greek Yogurt)", "منتجات الالبان", "أطعمة مسموحة"),
        ("السبانخ (Spinach)", "الخضروات", "أطعمة مسموحة"),
        ("السلمون (Salmon)", "الأسماك", "أطعمة مسموحة"),
        ("الشعير (Barley)", "الحبوب والبذور", "أطعمة مسموحة"),
        ("الشوكولاتة الداكنة (Dark Chocolate)", "سناكس", "أطعمة مسموحة"),
        ("العدس (Lentils)", "البقوليات", "أطعمة مسموحة"),
        ("الفاصوليا الخضراء (Green Beans)", "الخضروات", "أطعمة مسموحة"),
        ("الفراولة (Strawberries)", "الفواكه", "أطعمة مسموحة"),
        ("الفشار (Popcorn)", "سناكس", "أطعمة مسموحة"),
        ("الفلفل الرومي (Bell Pepper)", "الخضروات", "أطعمة مسموحة"),
        ("الكوسا (Zucchini)", "الخضروات", "أطعمة مسموحة"),
        ("الكينوا (Quinoa)", "الحبوب والبذور", "أطعمة مسموحة"),
        ("اللوز (Almonds)", "المكسرات", "أطعمة مسموحة"),
        ("المكسرات المختلطة (Mixed Nuts)", "المكسرات", "أطعمة مسموحة"),
        ("بابا غنوج", "المقبلات", "أطعمة مسموحة"),
        ("باذنجان مخلل", "المقبلات", "أطعمة مسموحة"),
        ("باذنجان مطبوخ", "الخضروات", "أطعمة مسموحة"),
        ("بامية مطبوخة", "الخضروات", "أطعمة مسموحة"),
        ("بذور الشيا (Chia Seeds)", "الحبوب والبذور", "أطعمة مسموحة"),
        ("بذور الكتان", "الحبوب والبذور", "أطعمة مسموحة"),
        ("بروكلي", "الخضروات", "أطعمة مسموحة"),
        ("بسلة خضراء (البازلاء)", "الخضروات", "أطعمة مسموحة"),
        ("بصارة", "البقوليات", "أطعمة مسموحة"),
        ("بيض مسلوق (Boiled Egg)", "منتجات البيض", "أطعمة مسموحة"),
        ("تونة معلبة بالماء", "الأسماك", "أطعمة مسموحة"),
        ("جبن قريش", "الاجبان", "أطعمة مسموحة"),
        ("جزر", "الخضروات", "أطعمة مسموحة"),
        ("جمبري", "الأسماك", "أطعمة مسموحة"),
        ("حليب خالي الدسم", "منتجات الالبان", "أطعمة مسموحة"),
        ("حمص مسلوق", "البقوليات", "أطعمة مسموحة"),
        ("رنجة", "الأسماك", "أطعمة مسموحة"),
        ("زبادي (اللبن الرائب)", "منتجات الالبان", "أطعمة مسموحة"),
        ("زبادي يوناني قليل الدسم", "منتجات الالبان", "أطعمة مسموحة"),
        ("زيتون أسود", "المقبلات", "أطعمة مسموحة"),
        ("سبانخ", "الخضروات", "أطعمة مسموحة"),
        ("سبانخ مطبوخة", "الخضروات", "أطعمة مسموحة"),
        ("سلطة خضار", "الخضروات", "أطعمة مسموحة"),
        ("سلمون مشوي", "الأسماك", "أطعمة مسموحة"),
        ("سمك فيليه", "الأسماك", "أطعمة مسموحة"),
        ("سمك مشوي", "الأسماك", "أطعمة مسموحة"),
        ("شوربة خضار", "الشوربات", "أطعمة مسموحة"),
        ("شوربة سمك", "الشوربات", "أطعمة مسموحة"),
        ("شوربة اللحم", "الشوربات", "أطعمة مسموحة"),
        ("صدر دجاج مشوي", "اللحوم", "أطعمة مسموحة"),
        ("صدور الدجاج (Chicken Breast)", "اللحوم", "أطعمة مسموحة"),
        ("طماطم", "الخضروات", "أطعمة مسموحة"),
        ("عدس مطبوخ", "البقوليات", "أطعمة مسموحة"),
        ("فاصوليا مطبوخة", "البقوليات", "أطعمة مسموحة"),
        ("فستق", "المكسرات", "أطعمة مسموحة"),
        ("فلفل أحمر", "الخضروات", "أطعمة مسموحة"),
        ("فول مدمس", "البقوليات", "أطعمة مسموحة"),
        ("قرنبيط مطبوخ", "الخضروات", "أطعمة مسموحة"),
        ("كبدة الدجاج", "اللحوم", "أطعمة مسموحة"),
        ("كوسة مطبوخة", "الخضروات", "أطعمة مسموحة"),
        ("لحم بقري مشوي", "اللحوم", "أطعمة مسموحة"),
        ("لوبيا مطبوخة", "البقوليات", "أطعمة مسموحة"),
        ("لوز", "المكسرات", "أطعمة مسموحة"),
        ("مكرونة قمح كامل", "المكرونات", "أطعمة مسموحة"),
        ("ملوخية", "الخضروات", "أطعمة مسموحة"),
        ("الخيار", "الخضروات", "أطعمة مسموحة"),
        ("الفلفل", "الخضروات", "أطعمة مسموحة"),
        ("الخس", "الخضروات", "أطعمة مسموحة"),
        ("البصل", "الخضروات", "أطعمة مسموحة"),
        ("الثوم", "الخضروات", "أطعمة مسموحة"),
        ("الفجل", "الخضروات", "أطعمة مسموحة"),
        ("التفاح الأخضر", "الفواكه", "أطعمة مسموحة"),
        ("التوت", "الفواكه", "أطعمة مسموحة"),
        ("الجريب فروت", "الفواكه", "أطعمة مسموحة"),
        ("الكمثرى", "الفواكه", "أطعمة مسموحة"),
        ("الرمان", "الفواكه", "أطعمة مسموحة"),
        ("البابايا", "الفواكه", "أطعمة مسموحة"),
        ("الأفوكادو", "الفواكه", "أطعمة مسموحة"),
        ("خبز القمح الكامل", "الحبوب والبذور", "أطعمة مسموحة"),
        ("الدخن", "الحبوب والبذور", "أطعمة مسموحة"),
        ("اللحوم قليلة الدهون", "اللحوم", "أطعمة مسموحة"),
        ("البيض", "منتجات البيض", "أطعمة مسموحة"),
        ("السردين", "الأسماك", "أطعمة مسموحة"),
        ("الماكريل", "الأسماك", "أطعمة مسموحة"),
        ("زيت بذر الكتان", "الزيوت والدهون", "أطعمة مسموحة"),
        ("زيت جوز الهند", "الزيوت والدهون", "أطعمة مسموحة"),
        ("زيت الكانولا", "الزيوت والدهون", "أطعمة مسموحة"),
        ("زيت السمسم", "الزيوت والدهون", "أطعمة مسموحة"),
        ("زيت الزيتون", "الزيوت والدهون", "أطعمة مسموحة"),
        ("زيت الزيتون البكر", "الزيوت والدهون", "أطعمة مسموحة"),
        ("الفاصولياء البيضاء", "البقوليات", "أطعمة مسموحة"),
        ("الفاصولياء الحمراء", "البقوليات", "أطعمة مسموحة"),
        ("فول الصويا", "البقوليات", "أطعمة مسموحة"),
        ("عين الجمل", "المكسرات", "أطعمة مسموحة"),
        ("بذور عباد الشمس", "الحبوب والبذور", "أطعمة مسموحة"),
        ("بذور اليقطين", "الحبوب والبذور", "أطعمة مسموحة"),
        ("القرفة", "الأعشاب والتوابل", "أطعمة مسموحة"),
        ("الكركم", "الأعشاب والتوابل", "أطعمة مسموحة"),
        ("الزنجبيل", "الأعشاب والتوابل", "أطعمة مسموحة"),
        ("الزعتر", "الأعشاب والتوابل", "أطعمة مسموحة"),
        ("الريحان", "الأعشاب والتوابل", "أطعمة مسموحة"),
        ("النعناع", "الأعشاب والتوابل", "أطعمة مسموحة"),
        ("حبة البركة", "الأعشاب والتوابل", "أطعمة مسموحة"),
        ("الكمون", "الأعشاب والتوابل", "أطعمة مسموحة"),
        ("الماء", "المشروبات والعصائر", "أطعمة مسموحة"),
        ("الشاي الأخضر", "المشروبات والعصائر", "أطعمة مسموحة"),
        ("شاي الأعشاب", "المشروبات والعصائر", "أطعمة مسموحة"),
        ("قهوة بدون سكر", "المشروبات والعصائر", "أطعمة مسموحة"),
        ("مشروب القرفة", "المشروبات والعصائر", "أطعمة مسموحة"),
        ("مشروب الزنجبيل", "المشروبات والعصائر", "أطعمة مسموحة"),
        ("مشروب الليمون", "المشروبات والعصائر", "أطعمة مسموحة"),
        ("مشروب النعناع", "المشروبات والعصائر", "أطعمة مسموحة"),
        ("عصير الفراولة", "المشروبات والعصائر", "أطعمة مسموحة"),
        ("عصير الرمان", "المشروبات والعصائر", "أطعمة مسموحة"),
        ("عصير التفاح", "المشروبات والعصائر", "أطعمة مسموحة"),
        ("عصير البرتقال بدون سكر", "المشروبات والعصائر", "أطعمة مسموحة"),
        ("حليب الشوفان", "المشروبات والعصائر", "أطعمة مسموحة"),
        ("خبز من الحبوب الكاملة", "المخبوزات", "أطعمة مسموحة"),
        ("أرز بسمتي", "الحبوب والبذور", "أطعمة مسموحة"),
        ("بطاطس مشوية", "الخضروات", "أطعمة مسموحة"),
        ("بطاطس مسلوقة", "الخضروات", "أطعمة مسموحة"),
        ("الكاجو", "المكسرات", "أطعمة مسموحة"),
        ("ورق عنب", "الخضروات", "أطعمة مسموحة"),
        ("خبز النخالة", "المخبوزات", "أطعمة مسموحة"),
        ("خبز الشوفان", "المخبوزات", "أطعمة مسموحة"),
        ("خبز اللوز", "المخبوزات", "أطعمة مسموحة"),
        ("ترمس", "البقوليات", "أطعمة مسموحة"),
        ("الجوافه", "الفواكه", "أطعمة مسموحة"),
        ("اليوسفي", "الفواكه", "أطعمة مسموحة"),
        ("التين الشوكى", "الفواكه", "أطعمة مسموحة"),
        ("التوت البري", "الفواكه", "أطعمة مسموحة"),
        ("الفول السوداني", "المكسرات", "أطعمة مسموحة"),
        ("جوز الهند", "الفواكه", "أطعمة مسموحة"),
        ("كبدة بقر", "اللحوم", "أطعمة مسموحة"),
        ("سلطة رنجة", "الأسماك", "أطعمة مسموحة"),
        ("زبدة الفول السوداني", "الزيوت والدهون", "أطعمة مسموحة"),
        # ═══ أطعمة مسموحة بكميات قليلة ═══
        ("الأرز الأبيض (White Rice)", "الحبوب والبذور", "أطعمة مسموحة بكميات قليلة"),
        ("الأناناس (Pineapple)", "الفواكه", "أطعمة مسموحة بكميات قليلة"),
        ("البرتقال (Orange)", "الفواكه", "أطعمة مسموحة بكميات قليلة"),
        ("البطاطا الحلوة (Sweet Potato)", "الخضروات", "أطعمة مسموحة بكميات قليلة"),
        ("البطيخ (Watermelon)", "الفواكه", "أطعمة مسموحة بكميات قليلة"),
        ("التمر (Dates)", "السكريات والحلويات", "أطعمة مسموحة بكميات قليلة"),
        ("الخبز الأسمر", "المخبوزات", "أطعمة مسموحة بكميات قليلة"),
        ("الذرة (Corn)", "الحبوب والبذور", "أطعمة مسموحة بكميات قليلة"),
        ("الشمام (Cantaloupe)", "الفواكه", "أطعمة مسموحة بكميات قليلة"),
        ("الشوفان (Oats)", "الحبوب والبذور", "أطعمة مسموحة بكميات قليلة"),
        ("العسل (Honey)", "السكريات والحلويات", "أطعمة مسموحة بكميات قليلة"),
        ("العنب (Grapes)", "الفواكه", "أطعمة مسموحة بكميات قليلة"),
        ("الكيوي (Kiwi)", "الفواكه", "أطعمة مسموحة بكميات قليلة"),
        ("المانجو (Mango)", "الفواكه", "أطعمة مسموحة بكميات قليلة"),
        ("المشمش (Apricot)", "الفواكه", "أطعمة مسموحة بكميات قليلة"),
        ("الموز الاخضر (Banana)", "الفواكه", "أطعمة مسموحة بكميات قليلة"),
        ("أرز أبيض", "الحبوب والبذور", "أطعمة مسموحة بكميات قليلة"),
        ("باذنجان مقلي", "الخضروات", "أطعمة مسموحة بكميات قليلة"),
        ("بطيخ", "الفواكه", "أطعمة مسموحة بكميات قليلة"),
        ("بيض مقلي", "منتجات البيض", "أطعمة مسموحة بكميات قليلة"),
        ("توست السن", "المخبوزات", "أطعمة مسموحة بكميات قليلة"),
        ("جبن فيتا", "الاجبان", "أطعمة مسموحة بكميات قليلة"),
        ("حلاوة طحينية", "السكريات والحلويات", "أطعمة مسموحة بكميات قليلة"),
        ("خبز قمح كامل", "المخبوزات", "أطعمة مسموحة بكميات قليلة"),
        ("شوربة كريمة دجاج", "الشوربات", "أطعمة مسموحة بكميات قليلة"),
        ("شوربة لسان عصفور", "الشوربات", "أطعمة مسموحة بكميات قليلة"),
        ("شوفان مطبوخ", "الحبوب والبذور", "أطعمة مسموحة بكميات قليلة"),
        ("عسل أبيض", "السكريات والحلويات", "أطعمة مسموحة بكميات قليلة"),
        ("عسل أسود", "السكريات والحلويات", "أطعمة مسموحة بكميات قليلة"),
        ("فلافل", "البقوليات", "أطعمة مسموحة بكميات قليلة"),
        ("لانشون بقري", "اللحوم", "أطعمة مسموحة بكميات قليلة"),
        ("لانشون دجاج", "اللحوم", "أطعمة مسموحة بكميات قليلة"),
        ("مربى", "السكريات والحلويات", "أطعمة مسموحة بكميات قليلة"),
        ("معكرونة مسلوقة", "المكرونات", "أطعمة مسموحة بكميات قليلة"),
        ("مكرونة", "المكرونات", "أطعمة مسموحة بكميات قليلة"),
        ("البلح", "الفواكه", "أطعمة مسموحة بكميات قليلة"),
        ("التين البرشومي", "الفواكه", "أطعمة مسموحة بكميات قليلة"),
        ("الكرز", "الفواكه", "أطعمة مسموحة بكميات قليلة"),
        ("جبن كامل الدسم", "الاجبان", "أطعمة مسموحة بكميات قليلة"),
        ("اللحوم الدهنية", "اللحوم", "أطعمة مسموحة بكميات قليلة"),
        ("المعكرونة الكاملة", "المكرونات", "أطعمة مسموحة بكميات قليلة"),
        ("صيادية السمك", "الأسماك", "أطعمة مسموحة بكميات قليلة"),
        # ═══ أطعمة ممنوعة ═══
        ("البسكويت (Crackers)", "سناكس", "أطعمة ممنوعة"),
        ("البيتزا (Pizza)", "المخبوزات", "أطعمة ممنوعة"),
        ("الخبز الأبيض", "المخبوزات", "أطعمة ممنوعة"),
        ("السكر الأبيض (White Sugar)", "السكريات والحلويات", "أطعمة ممنوعة"),
        ("الكرواسون (Croissant)", "المخبوزات", "أطعمة ممنوعة"),
        ("الكورن فليكس (Corn Flakes)", "الحبوب والبذور", "أطعمة ممنوعة"),
        ("باتون ساليه", "سناكس", "أطعمة ممنوعة"),
        ("باتيه سادة", "المخبوزات", "أطعمة ممنوعة"),
        ("توست أبيض", "المخبوزات", "أطعمة ممنوعة"),
        ("جبن اسطنبولي", "الاجبان", "أطعمة ممنوعة"),
        ("جبن الشيدر", "الاجبان", "أطعمة ممنوعة"),
        ("جبن المثلثات", "الاجبان", "أطعمة ممنوعة"),
        ("جبن رومي", "الاجبان", "أطعمة ممنوعة"),
        ("جبن موتزاريلا", "الاجبان", "أطعمة ممنوعة"),
        ("خبز بلدي", "المخبوزات", "أطعمة ممنوعة"),
        ("خبز شامي", "المخبوزات", "أطعمة ممنوعة"),
        ("خبز فينو", "المخبوزات", "أطعمة ممنوعة"),
        ("رغيف خبز ابيض", "المخبوزات", "أطعمة ممنوعة"),
        ("سمك مقلي", "الأسماك", "أطعمة ممنوعة"),
        ("طبق كشري", "المكرونات", "أطعمة ممنوعة"),
        ("فطير مشلتت", "المخبوزات", "أطعمة ممنوعة"),
        ("كورن فليكس", "الحبوب والبذور", "أطعمة ممنوعة"),
        ("معكرونة من الدقيق الأبيض", "المكرونات", "أطعمة ممنوعة"),
        ("الزبادي المحلّى كامل الدسم", "منتجات الالبان", "أطعمة ممنوعة"),
        ("الفواكة المجففة", "الفواكه", "أطعمة ممنوعة"),
        ("العصائر المركزة", "المشروبات والعصائر", "أطعمة ممنوعة"),
        ("الزبيب", "الفواكه", "أطعمة ممنوعة"),
        ("المشمش المجفف", "الفواكه", "أطعمة ممنوعة"),
        ("الصودا", "المشروبات والعصائر", "أطعمة ممنوعة"),
        ("مشروبات الطاقة", "المشروبات والعصائر", "أطعمة ممنوعة"),
        ("المشروبات الغازية", "المشروبات والعصائر", "أطعمة ممنوعة"),
        ("عصير محلي بالسكر", "المشروبات والعصائر", "أطعمة ممنوعة"),
        ("البيبسي", "المشروبات والعصائر", "أطعمة ممنوعة"),
        ("شاي محلي بالسكر", "المشروبات والعصائر", "أطعمة ممنوعة"),
        ("قهوة محلاة بالسكر", "المشروبات والعصائر", "أطعمة ممنوعة"),
        ("الحلويات الغربية", "السكريات والحلويات", "أطعمة ممنوعة"),
        ("الآيس كريم", "السكريات والحلويات", "أطعمة ممنوعة"),
        ("الشوكولاتة المحلّاة بالسكر", "السكريات والحلويات", "أطعمة ممنوعة"),
        ("المعجنات", "المقبلات", "أطعمة ممنوعة"),
        ("بقلاوة", "السكريات والحلويات", "أطعمة ممنوعة"),
        ("كنافة", "السكريات والحلويات", "أطعمة ممنوعة"),
        ("قطايف", "السكريات والحلويات", "أطعمة ممنوعة"),
        ("الدوناتس", "السكريات والحلويات", "أطعمة ممنوعة"),
        ("الكعك المحلّى", "السكريات والحلويات", "أطعمة ممنوعة"),
        ("البسكويت المحلّى", "السكريات والحلويات", "أطعمة ممنوعة"),
        ("الأطعمة المعلبة", "اخري", "أطعمة ممنوعة"),
        ("الأطعمة المصنعة", "اخري", "أطعمة ممنوعة"),
        ("الشوربات المعلبة", "الشوربات", "أطعمة ممنوعة"),
        ("الصلصات الجاهزة", "الأعشاب والتوابل", "أطعمة ممنوعة"),
        ("الوجبات المجمدة", "اخري", "أطعمة ممنوعة"),
        ("الشيبسي", "سناكس", "أطعمة ممنوعة"),
        ("اللحوم المدخنة", "اللحوم", "أطعمة ممنوعة"),
        ("الوجبات السريعة", "اخري", "أطعمة ممنوعة"),
        ("اللحوم المعلبة", "اخري", "أطعمة ممنوعة"),
        ("المارغرين الصلب", "الزيوت والدهون", "أطعمة ممنوعة"),
        ("مخبوزات تحتوي على زيوت مهدرجة", "المخبوزات", "أطعمة ممنوعة"),
        ("الأطعمة المقلية", "اخري", "أطعمة ممنوعة"),
        ("البطاطس المقلية", "الخضروات", "أطعمة ممنوعة"),
        ("الدجاج المقلي", "اللحوم", "أطعمة ممنوعة"),
        ("نقانق الدجاج", "اللحوم", "أطعمة ممنوعة"),
        ("سمبوسك", "المقبلات", "أطعمة ممنوعة"),
        # ═══ سناكات مسموحة ═══
        ("الزبادي اليوناني مع التوت", "سناكس", "سناكات مسموحة"),
        ("بيض مسلوق", "سناكس", "سناكات مسموحة"),
        ("مكسرات غير مملحة", "سناكس", "سناكات مسموحة"),
        ("فشار بدون إضافات", "سناكس", "سناكات مسموحة"),
        ("شرائح تفاح مع زبدة الفول السوداني", "سناكس", "سناكات مسموحة"),
        ("خضروات طازجة مع حمص", "سناكس", "سناكات مسموحة"),
        ("جبن قريش مع شرائح الطماطم", "سناكس", "سناكات مسموحة"),
        ("بودينج بذور الشيا", "سناكس", "سناكات مسموحة"),
        ("شرائح خيار مع جبن قليل الدسم", "سناكس", "سناكات مسموحة"),
        ("سلطة ورقيات خضراء", "سناكس", "سناكات مسموحة"),
        # ═══ سناكات ممنوعة ═══
        ("الكعك المحلى", "سناكس", "سناكات ممنوعة"),
        ("رقائق البطاطس (الشيبسي)", "سناكس", "سناكات ممنوعة"),
        ("بسكويت الشوكولاتة", "سناكس", "سناكات ممنوعة"),
        ("حبوب الإفطار السكرية", "سناكس", "سناكات ممنوعة"),
        ("المشروبات الغازية والعصائر المحلاة", "سناكس", "سناكات ممنوعة"),
        ("المعجنات المحلاة", "سناكس", "سناكات ممنوعة"),
        ("الحلويات الشرقية", "سناكس", "سناكات ممنوعة"),
        ("الآيس كريم", "سناكس", "سناكات ممنوعة"),
        ("الفواكه المجففة", "سناكس", "سناكات ممنوعة"),
        ("الزبادي المحلى والمنكّه", "سناكس", "سناكات ممنوعة"),
        ("الشوكولاتة بالحليب", "سناكس", "سناكات ممنوعة"),
        ("المخبوزات التجارية", "سناكس", "سناكات ممنوعة"),
        ("المقرمشات المملحة", "سناكس", "سناكات ممنوعة"),
        ("الحلويات الجيلاتينية", "سناكس", "سناكات ممنوعة"),
    ]
    seen = set()
    for name, typ, cls in data:
        key = (name.strip(), typ, cls)
        if key not in seen:
            seen.add(key)
            db.add(FoodType(name=name.strip(), type=typ, food_class=cls))
    db.commit()


@router.get("/sports")
def get_sports(type: Optional[str] = None, db: Session = Depends(get_db)):
    q = db.query(SportReference)
    if type:
        q = q.filter(SportReference.type == type)
    sports = q.all()
    return [{
        "id": s.id,
        "name": s.name,
        "type": s.type,
        "details": s.details,
    } for s in sports]


# ================================================
# DRUGS / MEDICATIONS
# ================================================
from app.models.health import DrugRecord, MealRecord

class DrugCreate(BaseModel):
    name: str
    form: Optional[str] = None
    frequency: Optional[str] = None
    serving: Optional[str] = None
    concentration: Optional[str] = None


@router.get("/drugs")
def get_drugs(db: Session = Depends(get_db)):
    drugs = db.query(DrugRecord).filter(DrugRecord.user_id == DUMMY_USER_ID).all()
    return [{
        "id": d.id,
        "name": d.name,
        "form": d.form,
        "frequency": d.frequency,
        "serving": d.serving,
        "concentration": d.concentration,
        "created_at": d.created_at.isoformat() if d.created_at else None,
    } for d in drugs]


@router.post("/drugs")
def add_drug(data: DrugCreate, db: Session = Depends(get_db)):
    drug = DrugRecord(
        user_id=DUMMY_USER_ID,
        name=data.name,
        form=data.form,
        frequency=data.frequency,
        serving=data.serving,
        concentration=data.concentration,
    )
    db.add(drug)
    db.commit()
    db.refresh(drug)
    return {"status": "success", "id": drug.id}


@router.delete("/drugs/{drug_id}")
def delete_drug(drug_id: int, db: Session = Depends(get_db)):
    drug = db.query(DrugRecord).filter(DrugRecord.id == drug_id).first()
    if not drug:
        raise HTTPException(status_code=404, detail="Drug not found")
    db.delete(drug)
    db.commit()
    return {"status": "success"}


# ================================================
# MEALS
# ================================================
class MealCreate(BaseModel):
    type: str  # breakfast, lunch, dinner, snack
    contents: Optional[str] = None
    calories: float = 0

@router.get("/meals")
def get_meals(db: Session = Depends(get_db)):
    meals = db.query(MealRecord).filter(MealRecord.user_id == DUMMY_USER_ID).order_by(MealRecord.created_at.desc()).all()
    return [{
        "id": m.id,
        "type": m.type,
        "contents": m.contents,
        "calories": m.calories,
        "created_at": m.created_at.isoformat() if m.created_at else None,
    } for m in meals]


@router.post("/meals")
def add_meal(data: MealCreate, db: Session = Depends(get_db)):
    meal = MealRecord(
        user_id=DUMMY_USER_ID,
        type=data.type,
        contents=data.contents,
        calories=data.calories,
    )
    db.add(meal)
    db.commit()
    db.refresh(meal)
    return {"status": "success", "id": meal.id}


# ════════════════════════════════════════
# DOCTORS
# ════════════════════════════════════════
@router.get("/doctors")
def get_doctors(db: Session = Depends(get_db)):
    """Get all users with role 'doctor'."""
    doctors = db.query(User).filter(User.role == "doctor", User.is_active == True).all()
    return [{
        "id": d.id,
        "name": d.name,
        "email": d.email,
        "phone": d.phone,
        "specialization": d.shape or "طبيب عام",  # reuse shape field for specialization
        "profile_image": d.profile_image,
    } for d in doctors]


# ════════════════════════════════════════
# APPOINTMENTS
# ════════════════════════════════════════
class AppointmentCreate(BaseModel):
    doctor_id: int
    doctor_name: str
    appointment_type: str = "video"  # video, audio, chat
    scheduled_at: str  # ISO datetime
    notes: Optional[str] = None
    duration_minutes: int = 30

@router.get("/appointments")
def get_appointments(db: Session = Depends(get_db)):
    """Get appointments for current user."""
    appts = db.query(Appointment).filter(
        Appointment.patient_id == DUMMY_USER_ID
    ).order_by(Appointment.scheduled_at.desc()).all()
    return [{
        "id": a.id,
        "doctor_id": a.doctor_id,
        "doctor_name": a.doctor_name,
        "patient_name": a.patient_name,
        "appointment_type": a.appointment_type,
        "status": a.status,
        "scheduled_at": a.scheduled_at.isoformat() if a.scheduled_at else None,
        "notes": a.notes,
        "duration_minutes": a.duration_minutes,
        "created_at": a.created_at.isoformat() if a.created_at else None,
    } for a in appts]


@router.post("/appointments")
def create_appointment(data: AppointmentCreate, db: Session = Depends(get_db)):
    """Book a new appointment. Status = pending (needs doctor approval)."""
    patient = db.query(User).filter(User.id == DUMMY_USER_ID).first()
    try:
        sched = datetime.fromisoformat(data.scheduled_at)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid date format")
    
    appt = Appointment(
        doctor_id=data.doctor_id,
        patient_id=DUMMY_USER_ID,
        doctor_name=data.doctor_name,
        patient_name=patient.name if patient else "مريض",
        appointment_type=data.appointment_type,
        status="pending",  # needs doctor approval
        scheduled_at=sched,
        notes=data.notes,
        duration_minutes=data.duration_minutes,
    )
    db.add(appt)
    db.commit()
    db.refresh(appt)
    return {"status": "success", "id": appt.id}


@router.put("/appointments/{appt_id}/cancel")
def cancel_appointment(appt_id: int, db: Session = Depends(get_db)):
    appt = db.query(Appointment).filter(Appointment.id == appt_id).first()
    if not appt:
        raise HTTPException(status_code=404, detail="Appointment not found")
    appt.status = "cancelled"
    db.commit()
    return {"status": "success"}


@router.put("/appointments/{appt_id}/approve")
def approve_appointment(appt_id: int, db: Session = Depends(get_db)):
    """Doctor approves the appointment."""
    appt = db.query(Appointment).filter(Appointment.id == appt_id).first()
    if not appt:
        raise HTTPException(status_code=404, detail="Appointment not found")
    appt.status = "scheduled"
    db.commit()
    return {"status": "success"}


@router.put("/appointments/{appt_id}/complete")
def complete_appointment(appt_id: int, db: Session = Depends(get_db)):
    appt = db.query(Appointment).filter(Appointment.id == appt_id).first()
    if not appt:
        raise HTTPException(status_code=404, detail="Appointment not found")
    appt.status = "completed"
    db.commit()
    return {"status": "success"}


# ════════════════════════════════════════
# DOCTOR DASHBOARD (all patients for a doctor)
# ════════════════════════════════════════
@router.get("/doctor/patients")
def get_doctor_patients(doctor_id: int = 0, db: Session = Depends(get_db)):
    """Get all patients who have appointments with this doctor."""
    if doctor_id == 0:
        doctor_id = 1  # default first doctor
    
    # Get unique patient IDs from appointments
    patient_ids = db.query(Appointment.patient_id).filter(
        Appointment.doctor_id == doctor_id
    ).distinct().all()
    patient_ids = [pid[0] for pid in patient_ids]
    
    patients = db.query(User).filter(User.id.in_(patient_ids)).all() if patient_ids else []
    result = []
    for p in patients:
        sugar_avg = db.query(SugarReading).filter(SugarReading.user_id == p.id).count()
        result.append({
            "id": p.id,
            "name": p.name,
            "phone": p.phone,
            "age": p.age,
            "weight": p.weight,
            "sugar_readings_count": sugar_avg,
        })
    return result


@router.get("/doctor/appointments")
def get_doctor_appointments(doctor_id: int = 0, db: Session = Depends(get_db)):
    """Get all appointments for a doctor."""
    if doctor_id == 0:
        doctor_id = 1
    appts = db.query(Appointment).filter(
        Appointment.doctor_id == doctor_id
    ).order_by(Appointment.scheduled_at.desc()).all()
    return [{
        "id": a.id,
        "patient_id": a.patient_id,
        "patient_name": a.patient_name,
        "appointment_type": a.appointment_type,
        "status": a.status,
        "scheduled_at": a.scheduled_at.isoformat() if a.scheduled_at else None,
        "notes": a.notes,
        "duration_minutes": a.duration_minutes,
        "created_at": a.created_at.isoformat() if a.created_at else None,
    } for a in appts]

# ═══════════════════════════════════════════════════════
# MEDICINE REMINDERS CRUD
# ═══════════════════════════════════════════════════════
import json

class ReminderCreate(BaseModel):
    name: str
    dose: Optional[str] = ''
    times: List[str] = ['08:00']
    days: List[int] = [0,1,2,3,4,5,6]
    notes: Optional[str] = ''

class ReminderUpdate(BaseModel):
    name: Optional[str] = None
    dose: Optional[str] = None
    times: Optional[List[str]] = None
    days: Optional[List[int]] = None
    notes: Optional[str] = None
    active: Optional[bool] = None

@router.get("/reminders")
def get_reminders(db: Session = Depends(get_db)):
    items = db.query(MedicineReminder).filter(
        MedicineReminder.user_id == DUMMY_USER_ID
    ).order_by(MedicineReminder.created_at.desc()).all()
    return [{
        "id": r.id,
        "name": r.name,
        "dose": r.dose or '',
        "times": json.loads(r.times) if r.times else ['08:00'],
        "days": json.loads(r.days) if r.days else [0,1,2,3,4,5,6],
        "notes": r.notes or '',
        "active": bool(r.active),
        "createdAt": r.created_at.isoformat() if r.created_at else None,
    } for r in items]

@router.post("/reminders")
def create_reminder(data: ReminderCreate, db: Session = Depends(get_db)):
    r = MedicineReminder(
        user_id=DUMMY_USER_ID,
        name=data.name,
        dose=data.dose,
        times=json.dumps(data.times),
        days=json.dumps(data.days),
        notes=data.notes,
        active=1,
    )
    db.add(r)
    db.commit()
    db.refresh(r)
    return {
        "id": r.id,
        "name": r.name,
        "dose": r.dose or '',
        "times": json.loads(r.times) if r.times else [],
        "days": json.loads(r.days) if r.days else [],
        "notes": r.notes or '',
        "active": bool(r.active),
        "createdAt": r.created_at.isoformat() if r.created_at else None,
    }

@router.put("/reminders/{reminder_id}")
def update_reminder(reminder_id: int, data: ReminderUpdate, db: Session = Depends(get_db)):
    r = db.query(MedicineReminder).filter(MedicineReminder.id == reminder_id).first()
    if not r:
        raise HTTPException(status_code=404, detail="Reminder not found")
    if data.name is not None: r.name = data.name
    if data.dose is not None: r.dose = data.dose
    if data.times is not None: r.times = json.dumps(data.times)
    if data.days is not None: r.days = json.dumps(data.days)
    if data.notes is not None: r.notes = data.notes
    if data.active is not None: r.active = 1 if data.active else 0
    db.commit()
    db.refresh(r)
    return {"status": "updated", "id": r.id}

@router.delete("/reminders/{reminder_id}")
def delete_reminder(reminder_id: int, db: Session = Depends(get_db)):
    r = db.query(MedicineReminder).filter(MedicineReminder.id == reminder_id).first()
    if not r:
        raise HTTPException(status_code=404, detail="Reminder not found")
    db.delete(r)
    db.commit()
    return {"status": "deleted"}
