from sqlalchemy import Column, Integer, String, Boolean, Float, DateTime, ForeignKey, Text, Numeric, Date
from sqlalchemy.sql import func
from app.db.base_class import Base

class Product(Base):
    __tablename__ = "sukarak_mazbot_products"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    details = Column(String(512), nullable=False)
    price = Column(Numeric(10, 2), nullable=False)
    offer_price = Column(Numeric(10, 2), default=0)
    stock = Column(Integer, default=0)
    img_url = Column(String(512))
    images = Column(Text, default="[]")  # JSON array of additional image URLs
    category = Column(String(255))
    sub_category = Column(String(255))
    country = Column(String(255), default="[]")
    seller = Column(String(255))
    brand = Column(String(255), nullable=True)         # اسم الشركة المصنعة
    sku = Column(String(100), nullable=True)            # رقم المنتج / السيريال
    offer_start_date = Column(DateTime, nullable=True)  # تاريخ بداية العرض
    offer_end_date = Column(DateTime, nullable=True)    # تاريخ نهاية العرض
    returnable = Column(Boolean(), default=True)        # قابل للإرجاع
    status = Column(Integer, default=1)
    in_review = Column(Integer, default=0)

class Order(Base):
    __tablename__ = "sukarak_orders"

    id = Column(Integer, primary_key=True, index=True)
    order_number = Column(String(20), unique=True, index=True, nullable=False)
    user_id = Column(Integer, ForeignKey("sukarak_users.id"), nullable=False)
    order_type = Column(String(50))  # service, market, giftcard
    subtotal = Column(Numeric(10, 2), nullable=False)
    discount_amount = Column(Numeric(10, 2), default=0)
    total_amount = Column(Numeric(10, 2), nullable=False)
    currency = Column(String(3), default="EGP")
    payment_status = Column(String(50), default="pending")
    payment_method = Column(String(50), default="card")
    payment_reference = Column(String(100), nullable=True)
    status = Column(String(50), default="pending")
    coupon_id = Column(String(20), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now(), server_default=func.now())

class OrderItem(Base):
    __tablename__ = "sukarak_order_items"

    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("sukarak_orders.id"), nullable=False)
    item_type = Column(String(50))  # service, product, giftcard
    service_type = Column(String(50), nullable=True)  # consultationLevel1, silverLoyaltyCard, goldLoyaltyCard
    service_name = Column(String(255), nullable=True)
    product_id = Column(Integer, ForeignKey("sukarak_mazbot_products.id"), nullable=True)
    product_name = Column(String(255))
    product_category = Column(String(100), nullable=True)
    quantity = Column(Integer, default=1)
    unit_price = Column(Numeric(10, 2), nullable=False)
    total_price = Column(Numeric(10, 2), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class Coupon(Base):
    """Discount coupons."""
    __tablename__ = "sukarak_coupons"

    id = Column(Integer, primary_key=True, index=True)
    coupon = Column(String(255), unique=True, nullable=False, index=True)
    discount = Column(Numeric(5, 2), nullable=True)  # percentage
    reusable = Column(Integer, default=0)  # 0=single use, 1=reusable
    users = Column(Text, default="[]")  # JSON array of user IDs who used it
    max_uses = Column(Integer, default=0)  # 0 = unlimited
    active = Column(Boolean(), default=True)
    applicable_sections = Column(Text, default="[]")  # JSON: ["store","lab","nursing","appointments"] — empty=all
    vip_only = Column(Boolean(), default=False)  # VIP customers only
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class GiftCard(Base):
    """Gift cards generated from orders."""
    __tablename__ = "sukarak_gift_cards"

    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("sukarak_orders.id"), nullable=False)
    code = Column(String(20), unique=True, nullable=False, index=True)
    status = Column(Integer, default=0)  # 0=inactive, 1=active
    used = Column(Integer, default=0)  # 0=not used, 1=used
    activated_at = Column(DateTime(timezone=True), nullable=True)


class LoyaltyUser(Base):
    """User loyalty card subscriptions (silver/gold)."""
    __tablename__ = "sukarak_loyality_users"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("sukarak_users.id"), nullable=False)
    subscription_type = Column(String(50), nullable=False)  # silverLoyaltyCard, goldLoyaltyCard, giftLoyaltyCard
    start_date = Column(Date, nullable=False)
    end_date = Column(Date, nullable=False)
