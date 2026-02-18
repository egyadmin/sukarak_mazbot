"""Medical Tests & Nursing Services models."""
from sqlalchemy import Column, Integer, String, DateTime, Text, ForeignKey, Float, Boolean
from sqlalchemy.sql import func
from app.db.base_class import Base


class MedicalTest(Base):
    """Patient medical test records."""
    __tablename__ = "sukarak_medical_tests"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("sukarak_users.id"), nullable=False)
    name = Column(String(255), nullable=False)        # e.g. HbA1c, CBC
    lab = Column(String(255))                          # Lab name
    date = Column(String(50))                          # Test date
    result = Column(String(255))                       # Test result
    status = Column(String(20), default="pending")     # pending, completed
    notes = Column(Text)
    attachments = Column(Text)                         # JSON list of file paths
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class NursingService(Base):
    """Available nursing/lab services."""
    __tablename__ = "sukarak_nursing_services"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    title_en = Column(String(255))
    price = Column(Float, default=0)                   # السعر الافتراضي
    duration = Column(String(50))
    icon = Column(String(10))
    color = Column(String(100))
    category = Column(String(100), default="other")
    service_type = Column(String(50), default="nursing")
    active = Column(Integer, default=1)
    description = Column(Text, nullable=True)

    # === Country-based pricing (عملة حسب البلد) ===
    price_eg = Column(Float, nullable=True)            # سعر بالجنيه المصري
    price_sa = Column(Float, nullable=True)            # سعر بالريال السعودي
    price_ae = Column(Float, nullable=True)            # سعر بالدرهم الإماراتي
    price_kw = Column(Float, nullable=True)            # سعر بالدينار الكويتي

    # === Lab owner (links to lab user who owns this service) ===
    owner_id = Column(Integer, ForeignKey("sukarak_users.id"), nullable=True)


class NursingBooking(Base):
    """Patient nursing service bookings."""
    __tablename__ = "sukarak_nursing_bookings"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("sukarak_users.id"), nullable=False)
    service_id = Column(Integer, ForeignKey("sukarak_nursing_services.id"), nullable=False)
    service_name = Column(String(255))
    date = Column(String(50), nullable=False)
    time = Column(String(20))
    address = Column(String(500), nullable=False)
    notes = Column(Text)
    nurse_name = Column(String(255))
    status = Column(String(20), default="pending")     # pending, confirmed, completed, cancelled
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class NursingSchedule(Base):
    """Nurse/technician available time slots on specific dates."""
    __tablename__ = "sukarak_nursing_schedules"

    id = Column(Integer, primary_key=True, index=True)
    nurse_id = Column(Integer, ForeignKey("sukarak_users.id"), nullable=False)
    date = Column(String(50), nullable=False)           # تاريخ محدد YYYY-MM-DD
    start_time = Column(String(10), nullable=False)     # وقت البداية HH:MM
    end_time = Column(String(10), nullable=False)       # وقت النهاية HH:MM
    is_available = Column(Boolean, default=True)        # متاح أم لا
    notes = Column(Text, nullable=True)                 # ملاحظات
    created_at = Column(DateTime(timezone=True), server_default=func.now())

