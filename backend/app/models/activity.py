"""Activity Log & Permission models for workflow tracking and RBAC."""
from sqlalchemy import Column, Integer, String, DateTime, Text, ForeignKey, Boolean
from sqlalchemy.sql import func
from app.db.base_class import Base


class ActivityLog(Base):
    """Tracks all admin/system activities for audit trail."""
    __tablename__ = "sukarak_activity_log"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("sukarak_users.id"), nullable=True)
    user_name = Column(String(255))
    action = Column(String(100), nullable=False)  # create, update, delete, approve, reject, login, etc.
    entity_type = Column(String(50))  # user, product, order, notification, banner, setting
    entity_id = Column(Integer, nullable=True)
    entity_name = Column(String(255))
    details = Column(Text)
    ip_address = Column(String(50))
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class Permission(Base):
    """Role-based permissions."""
    __tablename__ = "sukarak_permissions"

    id = Column(Integer, primary_key=True, index=True)
    role = Column(String(50), nullable=False, index=True)  # admin, doctor, seller, moderator
    module = Column(String(50), nullable=False)  # dashboard, products, users, orders, chat, settings, reports
    can_view = Column(Boolean(), default=False)
    can_create = Column(Boolean(), default=False)
    can_edit = Column(Boolean(), default=False)
    can_delete = Column(Boolean(), default=False)
    can_approve = Column(Boolean(), default=False)


class Appointment(Base):
    """Doctor-Patient appointments for video/audio sessions."""
    __tablename__ = "sukarak_appointments"

    id = Column(Integer, primary_key=True, index=True)
    doctor_id = Column(Integer, ForeignKey("sukarak_users.id"), nullable=False)
    patient_id = Column(Integer, ForeignKey("sukarak_users.id"), nullable=False)
    doctor_name = Column(String(255))
    patient_name = Column(String(255))
    appointment_type = Column(String(20), default="video")  # video, audio, chat
    status = Column(String(20), default="scheduled")  # scheduled, in_progress, completed, cancelled
    scheduled_at = Column(DateTime(timezone=True), nullable=False)
    notes = Column(Text)
    duration_minutes = Column(Integer, default=30)
    session_request = Column(String(20), default="none")  # none, pending, approved, rejected
    session_room_id = Column(String(100), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
