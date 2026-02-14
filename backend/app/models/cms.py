from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text
from sqlalchemy.sql import func
from app.db.base_class import Base


class Banner(Base):
    __tablename__ = "sukarak_banners"

    id = Column(Integer, primary_key=True, index=True)
    image_url = Column(String(512), nullable=False)
    link = Column(String(512))
    title = Column(String(255), default="")
    active = Column(Boolean(), default=True)
    sort_order = Column(Integer, default=0)
    target_type = Column(String(50), default="internal")  # internal, external, none
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class Notification(Base):
    __tablename__ = "sukarak_notifications"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    details = Column(Text, nullable=False)
    image_url = Column(String(512))
    type = Column(String(50), default="general")  # general, promo, health_tip, update
    target = Column(String(50), default="all")  # all, users, sellers, admins
    is_read = Column(Boolean(), default=False)
    active = Column(Boolean(), default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class AppSetting(Base):
    __tablename__ = "sukarak_settings"

    id = Column(Integer, primary_key=True, index=True)
    key = Column(String(100), unique=True, nullable=False, index=True)
    value = Column(Text, nullable=False)
    label = Column(String(255))  # Display label
    setting_group = Column("setting_group", String(50), default="general")  # general, payment, notifications, appearance
    type = Column(String(20), default="text")  # text, number, boolean, textarea, color
    updated_at = Column(DateTime(timezone=True), onupdate=func.now(), server_default=func.now())

