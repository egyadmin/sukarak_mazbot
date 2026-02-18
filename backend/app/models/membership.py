"""Membership Cards, Social Links, Blog/Courses, and Medical Profile models."""
from sqlalchemy import Column, Integer, String, DateTime, Text, ForeignKey, Float, Boolean
from sqlalchemy.sql import func
from app.db.base_class import Base


class MembershipCard(Base):
    """Available membership card types (Silver, Gold, Platinum)."""
    __tablename__ = "sukarak_membership_cards"

    id = Column(Integer, primary_key=True, index=True)
    card_type = Column(String(50), unique=True, nullable=False)  # silver, gold, platinum
    name_ar = Column(String(255), nullable=False)
    name_en = Column(String(255), nullable=False)
    price_eg = Column(Float, default=0)
    price_sa = Column(Float, default=0)
    price_ae = Column(Float, default=0)
    price_om = Column(Float, default=0)
    price_other = Column(Float, default=0)
    features_ar = Column(Text)  # JSON array
    features_en = Column(Text)  # JSON array
    discount_percent = Column(Integer, default=0)
    icon = Column(String(10))
    active = Column(Boolean, default=True)
    sort_order = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class UserMembership(Base):
    """User membership subscriptions."""
    __tablename__ = "sukarak_user_memberships"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("sukarak_users.id"), nullable=False)
    card_type = Column(String(50), nullable=False)  # silver, gold, platinum
    start_date = Column(String(20), nullable=False)
    end_date = Column(String(20), nullable=False)
    amount_paid = Column(Float, default=0)
    currency = Column(String(10), default="SAR")
    payment_method = Column(String(50))
    status = Column(String(20), default="active")  # active, expired, cancelled
    is_gift = Column(Boolean, default=False)
    gifted_by = Column(Integer, nullable=True)
    gift_message = Column(Text, nullable=True)
    recipient_name = Column(String(255), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class SocialLink(Base):
    """Social media links configuration."""
    __tablename__ = "sukarak_social_links"

    id = Column(Integer, primary_key=True, index=True)
    platform = Column(String(50), nullable=False)  # facebook, tiktok, youtube, etc.
    name_ar = Column(String(100), nullable=False)
    name_en = Column(String(100), nullable=False)
    url = Column(String(1024), nullable=False)
    icon = Column(String(10))
    color = Column(String(100))
    active = Column(Boolean, default=True)
    sort_order = Column(Integer, default=0)


class BlogCourse(Base):
    """Udemy courses and educational content."""
    __tablename__ = "sukarak_blog_courses"

    id = Column(Integer, primary_key=True, index=True)
    title_ar = Column(String(255), nullable=False)
    title_en = Column(String(255))
    description_ar = Column(Text)
    description_en = Column(Text)
    url = Column(String(1024), nullable=False)
    icon = Column(String(10))
    platform = Column(String(50), default="udemy")  # udemy, youtube, etc.
    active = Column(Boolean, default=True)
    sort_order = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class BookLink(Base):
    """Book availability links by country."""
    __tablename__ = "sukarak_book_links"

    id = Column(Integer, primary_key=True, index=True)
    book_title_ar = Column(String(255), nullable=False)
    book_title_en = Column(String(255))
    country_code = Column(String(5), nullable=False)  # EG, SA, AE
    country_name_ar = Column(String(100))
    country_name_en = Column(String(100))
    url = Column(String(1024), nullable=False)
    flag_emoji = Column(String(10))
    active = Column(Boolean, default=True)
    sort_order = Column(Integer, default=0)


class MedicalProfile(Base):
    """Extended medical profile for users."""
    __tablename__ = "sukarak_medical_profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("sukarak_users.id"), unique=True, nullable=False)
    is_smoker = Column(Boolean, default=False)
    daily_exercise = Column(Boolean, default=False)
    diabetes_type = Column(String(50))  # type1, type2, gestational
    diagnosis_date = Column(String(20))  # YYYY-MM-DD
    blood_type = Column(String(10))  # A+, A-, B+, B-, AB+, AB-, O+, O-
    hba1c = Column(String(10))  # last HbA1c value
    insulin_type = Column(String(255))  # e.g., Lantus, NovoRapid
    height = Column(String(10))  # in cm
    medications = Column(Text)  # JSON list or text
    meals_per_day = Column(Integer, default=3)
    allergies = Column(Text)
    chronic_diseases = Column(Text)  # other chronic diseases
    emergency_contact = Column(String(50))  # emergency phone number
    medical_notes = Column(Text)
    attachments = Column(Text)  # JSON list of file paths/data
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class ConsultationPackage(Base):
    """Consultation/appointment packages with multi-currency pricing."""
    __tablename__ = "sukarak_consultation_packages"

    id = Column(Integer, primary_key=True, index=True)
    name_ar = Column(String(255), nullable=False)
    name_en = Column(String(255))
    description_ar = Column(Text)
    description_en = Column(Text)
    features_ar = Column(Text)  # JSON array
    features_en = Column(Text)  # JSON array
    price_eg = Column(Float, default=0)
    price_sa = Column(Float, default=0)
    price_ae = Column(Float, default=0)
    price_om = Column(Float, default=0)
    price_other = Column(Float, default=0)
    duration = Column(String(100))  # e.g., "3 months", "1 year"
    icon = Column(String(10))
    is_giftable = Column(Boolean, default=False)
    active = Column(Boolean, default=True)
    sort_order = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class UserFavorite(Base):
    """User favorites/wishlist."""
    __tablename__ = "sukarak_user_favorites"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("sukarak_users.id"), nullable=False)
    item_type = Column(String(50), nullable=False)  # product, service, course
    item_id = Column(Integer, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class UserPackageOrder(Base):
    """User package/subscription orders."""
    __tablename__ = "sukarak_user_package_orders"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("sukarak_users.id"), nullable=False)
    package_id = Column(String(50), nullable=False)  # basic, premium, annual, etc.
    package_name = Column(String(255))
    amount = Column(Float, default=0)
    currency = Column(String(10), default="SAR")
    period = Column(String(100))
    status = Column(String(20), default="active")  # active, expired, cancelled
    payment_method = Column(String(50), default="direct")
    start_date = Column(String(20))
    end_date = Column(String(20))
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class MembershipServiceUsage(Base):
    """Track services used with membership card discounts."""
    __tablename__ = "sukarak_membership_usage"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("sukarak_users.id"), nullable=False)
    membership_id = Column(Integer, ForeignKey("sukarak_user_memberships.id"), nullable=False)
    service_type = Column(String(50), nullable=False)  # consultation, lab, nursing, store
    service_name = Column(String(255))
    original_price = Column(Float, default=0)
    discounted_price = Column(Float, default=0)
    discount_amount = Column(Float, default=0)
    reference_id = Column(Integer)  # order_id, booking_id, etc.
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class MarketingMessage(Base):
    """Marketing messages/campaigns sent via WhatsApp, email, or push."""
    __tablename__ = "sukarak_marketing_messages"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    body = Column(Text, nullable=False)
    channel = Column(String(20), nullable=False)  # whatsapp, email, push, all
    target_audience = Column(String(50), default="all")  # all, vip, country:EG, membership:gold
    image_url = Column(String(512))
    link_url = Column(String(512))
    scheduled_at = Column(DateTime(timezone=True))
    sent_at = Column(DateTime(timezone=True))
    status = Column(String(20), default="draft")  # draft, scheduled, sent, cancelled
    sent_count = Column(Integer, default=0)
    opened_count = Column(Integer, default=0)
    created_by = Column(Integer, ForeignKey("sukarak_users.id"))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
