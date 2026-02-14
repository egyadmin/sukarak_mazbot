"""
Seller-specific models: Notifications, Wallet, Returns, Status History, Withdrawals
"""
from sqlalchemy import Column, Integer, String, Boolean, Float, DateTime, ForeignKey, Text, Numeric, Date, JSON
from sqlalchemy.sql import func
from app.db.base_class import Base


class SellerNotification(Base):
    """Push/Email/SMS notifications for sellers."""
    __tablename__ = "sukarak_seller_notifications"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("sukarak_users.id"), nullable=False, index=True)

    # Notification type
    type = Column(String(50), nullable=False)  # new_order, order_confirmed, order_shipped, etc.

    # Content
    title = Column(String(255), nullable=False)
    message = Column(Text, nullable=False)

    # Related entity
    related_type = Column(String(50))  # order, product, message, return
    related_id = Column(Integer)

    # Status
    is_read = Column(Boolean, default=False)
    read_at = Column(DateTime(timezone=True), nullable=True)

    # Channels
    sent_push = Column(Boolean, default=False)
    sent_email = Column(Boolean, default=False)
    sent_sms = Column(Boolean, default=False)

    # Priority: low, medium, high
    priority = Column(String(20), default="medium")

    created_at = Column(DateTime(timezone=True), server_default=func.now())


class OrderStatusHistory(Base):
    """Track all status changes on an order."""
    __tablename__ = "sukarak_order_status_history"

    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("sukarak_orders.id"), nullable=False, index=True)

    old_status = Column(String(50))
    new_status = Column(String(50), nullable=False)

    changed_by_user_id = Column(Integer, ForeignKey("sukarak_users.id"))
    changed_by_role = Column(String(20))  # customer, seller, admin

    notes = Column(Text)

    created_at = Column(DateTime(timezone=True), server_default=func.now())


class OrderReturn(Base):
    """Returns and refund requests."""
    __tablename__ = "sukarak_order_returns"

    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("sukarak_orders.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("sukarak_users.id"), nullable=False)
    seller_id = Column(Integer, ForeignKey("sukarak_users.id"), nullable=False)

    return_number = Column(String(50), unique=True, nullable=False)

    # Type: refund, replacement, exchange
    type = Column(String(20), nullable=False, default="refund")

    # Status
    status = Column(String(30), default="requested")
    # requested → pending_approval → approved/rejected → processing → completed

    # Reason
    reason = Column(String(50), nullable=False)  # defective, wrong_item, not_as_described, changed_mind, other
    reason_details = Column(Text)

    # Items returned (JSON array)
    items = Column(Text)  # JSON: [{product_id, product_name, quantity, reason}]

    # Financial
    refund_amount = Column(Numeric(10, 2))
    refund_method = Column(String(50))

    # Timestamps
    approved_at = Column(DateTime(timezone=True))
    rejected_at = Column(DateTime(timezone=True))
    rejection_reason = Column(Text)
    completed_at = Column(DateTime(timezone=True))

    # Attachments (JSON array of image URLs)
    attachments = Column(Text)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now(), server_default=func.now())


class SellerWallet(Base):
    """Seller financial wallet."""
    __tablename__ = "sukarak_seller_wallet"

    id = Column(Integer, primary_key=True, index=True)
    seller_id = Column(Integer, ForeignKey("sukarak_users.id"), unique=True, nullable=False)

    available_balance = Column(Numeric(10, 2), default=0)
    pending_balance = Column(Numeric(10, 2), default=0)
    total_earned = Column(Numeric(10, 2), default=0)
    total_withdrawn = Column(Numeric(10, 2), default=0)

    # Bank info
    bank_name = Column(String(100))
    account_number = Column(String(100))
    account_name = Column(String(100))
    iban = Column(String(100))

    updated_at = Column(DateTime(timezone=True), onupdate=func.now(), server_default=func.now())


class WalletTransaction(Base):
    """Financial transactions for seller wallet."""
    __tablename__ = "sukarak_wallet_transactions"

    id = Column(Integer, primary_key=True, index=True)
    seller_id = Column(Integer, ForeignKey("sukarak_users.id"), nullable=False, index=True)
    order_id = Column(Integer, ForeignKey("sukarak_orders.id"), nullable=True)

    # Type: credit, debit, commission, refund, withdrawal, adjustment
    type = Column(String(30), nullable=False)

    amount = Column(Numeric(10, 2), nullable=False)
    description = Column(Text)

    # Status: pending, completed, failed
    status = Column(String(20), default="completed")

    balance_after = Column(Numeric(10, 2))

    created_at = Column(DateTime(timezone=True), server_default=func.now())


class WithdrawalRequest(Base):
    """Seller withdrawal/payout requests."""
    __tablename__ = "sukarak_withdrawal_requests"

    id = Column(Integer, primary_key=True, index=True)
    seller_id = Column(Integer, ForeignKey("sukarak_users.id"), nullable=False)

    request_number = Column(String(50), unique=True, nullable=False)
    amount = Column(Numeric(10, 2), nullable=False)

    # Bank details (snapshot at time of request)
    bank_name = Column(String(100))
    account_number = Column(String(100))
    account_name = Column(String(100))
    iban = Column(String(100))

    # Status: pending, approved, processing, completed, rejected
    status = Column(String(20), default="pending")

    approved_by = Column(Integer, ForeignKey("sukarak_users.id"), nullable=True)
    approved_at = Column(DateTime(timezone=True))
    processed_at = Column(DateTime(timezone=True))
    rejection_reason = Column(Text)
    transfer_reference = Column(String(100))

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now(), server_default=func.now())


class SellerSettings(Base):
    """Seller profile and store settings."""
    __tablename__ = "sukarak_seller_settings"

    id = Column(Integer, primary_key=True, index=True)
    seller_id = Column(Integer, ForeignKey("sukarak_users.id"), unique=True, nullable=False)

    # Store info
    store_name = Column(String(255))
    store_description = Column(Text)
    store_logo = Column(String(512))
    store_banner = Column(String(512))

    # Contact
    business_phone = Column(String(50))
    business_email = Column(String(255))
    business_address = Column(Text)

    # Working hours
    working_hours = Column(Text)  # JSON

    # Platform commission rate (set by admin)
    commission_rate = Column(Numeric(5, 2), default=10.0)

    # Notification preferences
    notify_new_order = Column(Boolean, default=True)
    notify_order_status = Column(Boolean, default=True)
    notify_low_stock = Column(Boolean, default=True)
    notify_reviews = Column(Boolean, default=True)
    notify_email = Column(Boolean, default=True)
    notify_sms = Column(Boolean, default=False)

    # Auto-confirm orders
    auto_confirm_orders = Column(Boolean, default=False)

    # Low stock threshold
    low_stock_threshold = Column(Integer, default=5)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now(), server_default=func.now())


class SellerLicense(Base):
    """Seller licenses and attachments (business permits, certificates, etc.)."""
    __tablename__ = "sukarak_seller_licenses"

    id = Column(Integer, primary_key=True, index=True)
    seller_id = Column(Integer, ForeignKey("sukarak_users.id"), nullable=False, index=True)

    # File details
    file_name = Column(String(255), nullable=False)       # اسم الملف الأصلي
    file_url = Column(String(1024), nullable=False)        # رابط الملف المحفوظ
    file_type = Column(String(50), nullable=True)          # pdf, image, doc
    file_size = Column(Integer, nullable=True)             # حجم الملف بالبايتات

    # License metadata
    license_type = Column(String(100), nullable=True)      # business_license, health_permit, commerce_register, other
    license_number = Column(String(100), nullable=True)    # رقم الرخصة
    expiry_date = Column(DateTime, nullable=True)          # تاريخ انتهاء الصلاحية
    notes = Column(Text, nullable=True)                    # ملاحظات

    # Status: pending, approved, rejected, expired
    status = Column(String(20), default="pending")

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now(), server_default=func.now())
