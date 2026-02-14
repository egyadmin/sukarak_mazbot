from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Text
from sqlalchemy.sql import func
from app.db.base_class import Base

class SugarReading(Base):
    __tablename__ = "sugar_readings"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("sukarak_users.id"), nullable=False)
    reading = Column(Float, nullable=False)
    test_type = Column(String(100))  # fasting, random, etc.
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class InsulinRecord(Base):
    __tablename__ = "insulin_records"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("sukarak_users.id"), nullable=False)
    reading = Column(Float, nullable=False)  # actual DB column (was 'units')
    test_type = Column(String(100))  # actual DB column (was 'insulin_type')
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class ExerciseRecord(Base):
    __tablename__ = "excercise_records"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("sukarak_users.id"), nullable=False)
    type = Column(String(255), nullable=False)
    duration = Column(Integer)  # in minutes
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class MealRecord(Base):
    __tablename__ = "meal_records"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("sukarak_users.id"), nullable=False)
    type = Column(String(255))
    contents = Column(Text)  # JSON string
    calories = Column(Float, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class DrugRecord(Base):
    __tablename__ = "drugs_records"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("sukarak_users.id"), nullable=False)
    name = Column(String(255), nullable=False)
    form = Column(String(100))
    frequency = Column(String(100))
    serving = Column(String(100))
    concentration = Column(String(100))
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class MedicineReminder(Base):
    __tablename__ = "medicine_reminders"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("sukarak_users.id"), nullable=False)
    name = Column(String(255), nullable=False)
    dose = Column(String(255))
    times = Column(Text)  # JSON array of times e.g. ["08:00", "20:00"]
    days = Column(Text)   # JSON array of days e.g. [0,1,2,3,4,5,6]
    notes = Column(Text)
    active = Column(Integer, default=1)  # 1=active, 0=inactive
    created_at = Column(DateTime(timezone=True), server_default=func.now())
