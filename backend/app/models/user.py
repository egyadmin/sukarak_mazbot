from sqlalchemy import Column, Integer, String, Boolean, Float, DateTime, Text
from sqlalchemy.sql import func
from app.db.base_class import Base

class User(Base):
    __tablename__ = "sukarak_users"

    id = Column(Integer, primary_key=True, index=True)
    firebase_uid = Column(String(255), unique=True, index=True, nullable=True)
    name = Column(String(255), nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=False)
    phone = Column(String(255), unique=True, index=True)
    password = Column(String(255), nullable=True)
    age = Column(String(10))
    weight = Column(String(10))
    country = Column(String(255))
    shape = Column(String(255))
    login_method = Column(String(50), default="email")  # email or google
    role = Column(String(20), default="user")  # user, admin, moderator, doctor, seller, nurse
    profile_image = Column(String(1024), nullable=True)

    # === Seller-specific fields (only used when role=seller) ===
    admin_display_name = Column(String(255), nullable=True)   # اسم مميز للبائع - يظهر في لوحة الأدمن فقط
    app_display_name = Column(String(255), nullable=True)     # اسم البائع في التطبيق - يظهر في تفاصيل المنتج
    seller_department = Column(String(100), nullable=True)    # القسم: diabetes_care, medical_tests, home_nursing
    seller_address = Column(Text, nullable=True)              # عنوان البائع

    # === Wallet & Loyalty ===
    wallet_balance = Column(Float, default=0.0)               # رصيد المحفظة
    loyalty_points = Column(Integer, default=0)               # نقاط الولاء

    is_active = Column(Boolean(), default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
