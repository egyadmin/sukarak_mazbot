from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List

class SugarReadingBase(BaseModel):
    reading: float
    test_type: str

class SugarReadingCreate(SugarReadingBase):
    measured_at: Optional[str] = None  # ISO datetime string

class SugarReadingResponse(SugarReadingBase):
    id: int
    user_id: int
    created_at: datetime

    class Config:
        from_attributes = True

class InsulinRecordBase(BaseModel):
    reading: float
    test_type: Optional[str] = None

class InsulinRecordCreate(InsulinRecordBase):
    pass

class InsulinRecordResponse(InsulinRecordBase):
    id: int
    user_id: int
    created_at: datetime

    class Config:
        from_attributes = True

class ExerciseRecordBase(BaseModel):
    type: str
    duration: int

class ExerciseRecordCreate(ExerciseRecordBase):
    pass

class ExerciseRecordResponse(ExerciseRecordBase):
    id: int
    user_id: int
    created_at: datetime

    class Config:
        from_attributes = True

class MealRecordBase(BaseModel):
    type: str
    contents: str
    calories: float

class MealRecordCreate(MealRecordBase):
    pass

class MealRecordResponse(MealRecordBase):
    id: int
    user_id: int
    created_at: datetime

    class Config:
        from_attributes = True
