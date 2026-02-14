from sqlalchemy import Column, Integer, String, Text
from app.db.base_class import Base

class SportReference(Base):
    __tablename__ = "sport_db"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    type = Column(String(255), nullable=False)  # Allowed, Prohibited
    details = Column(Text)

class FoodReference(Base):
    __tablename__ = "food_db"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    type = Column(String(255))  # Category
    serving = Column(String(255))
    glycemic_index = Column(String(50))
    calories = Column(String(50))
    carb = Column(String(50))
    protein = Column(String(50))
    fats = Column(String(50))


class FoodType(Base):
    """Food classification: allowed / limited / prohibited for diabetics."""
    __tablename__ = "food_types"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    type = Column(String(255))       # Category (الخضروات, الفواكه, etc.)
    food_class = Column("class", String(255))  # أطعمة مسموحة / ممنوعة / مسموحة بكميات قليلة
