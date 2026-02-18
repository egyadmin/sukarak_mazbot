"""Medical Tests & Nursing Services models."""
from sqlalchemy import Column, Integer, String, DateTime, Text, ForeignKey, Float
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
    """Available nursing services."""
    __tablename__ = "sukarak_nursing_services"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    title_en = Column(String(255))
    price = Column(Float, default=0)
    duration = Column(String(50))                      # e.g. "30 دقيقة"
    icon = Column(String(10))                          # emoji icon
    color = Column(String(100))                        # gradient class
    active = Column(Integer, default=1)


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
