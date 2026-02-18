"""
E-commerce API - Products, Cart, Orders, Coupons, GiftCards, Loyalty
"""
from fastapi import APIRouter, Depends, HTTPException, Form, File, UploadFile
from sqlalchemy.orm import Session
from typing import List, Optional
from pydantic import BaseModel
from decimal import Decimal
import uuid, json, random, string, os, shutil
from datetime import datetime, date, timedelta

from app.db.session import SessionLocal
from app.models.ecommerce import Product, Order, OrderItem, Coupon, GiftCard, LoyaltyUser
from app.models.user import User
from app.models.cms import Notification
from app.schemas.ecommerce import ProductResponse, OrderResponse

router = APIRouter()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# ================================================
# PRODUCTS
# ================================================
@router.get("/products", response_model=List[ProductResponse])
def get_products(category: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(Product).filter(Product.status == 1)
    if category and category != "all":
        query = query.filter(Product.category == category)
    return query.all()


@router.get("/products/categories")
def get_product_categories(db: Session = Depends(get_db)):
    rows = db.query(Product.category).distinct().filter(Product.status == 1).all()
    return [r[0] for r in rows if r[0]]


@router.get("/products/{product_id}", response_model=ProductResponse)
def get_product(product_id: int, db: Session = Depends(get_db)):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product


# ================================================
# COUPONS
# ================================================
class CouponCheckRequest(BaseModel):
    coupon_code: str
    user_id: int = 0
    section: str = ""  # "store", "lab", "nursing", "appointments" — for section validation


@router.post("/coupons/check")
def check_coupon(req: CouponCheckRequest, db: Session = Depends(get_db)):
    """Validate a coupon code and return discount info."""
    coupon = db.query(Coupon).filter(Coupon.coupon == req.coupon_code, Coupon.active == True).first()
    if not coupon:
        raise HTTPException(status_code=404, detail="كوبون غير صالح")

    # Check if already used by this user (for non-reusable coupons)
    if coupon.reusable == 0:
        used_users = json.loads(coupon.users or "[]")
        if req.user_id in used_users:
            raise HTTPException(status_code=400, detail="تم استخدام هذا الكوبون مسبقاً")

    # Check section targeting
    applicable = json.loads(coupon.applicable_sections or "[]") if coupon.applicable_sections else []
    if applicable and req.section and req.section not in applicable:
        raise HTTPException(status_code=400, detail=f"هذا الكوبون غير صالح لقسم {'المتجر' if req.section == 'store' else 'التحاليل' if req.section == 'lab' else 'التمريض' if req.section == 'nursing' else 'الاستشارات'}")

    return {
        "valid": True,
        "coupon": coupon.coupon,
        "discount": float(coupon.discount) if coupon.discount else 0,
        "applicable_sections": applicable,
    }


@router.get("/coupons")
def get_coupons(db: Session = Depends(get_db)):
    """Get all active coupons (admin)."""
    coupons = db.query(Coupon).order_by(Coupon.created_at.desc()).all()
    return [{
        "id": c.id,
        "coupon": c.coupon,
        "discount": float(c.discount) if c.discount else 0,
        "reusable": c.reusable,
        "active": c.active,
        "max_uses": c.max_uses,
        "created_at": c.created_at.isoformat() if c.created_at else None,
    } for c in coupons]


# ================================================
# ORDERS
# ================================================

class OrderItemCreate(BaseModel):
    product_id: int
    quantity: int = 1


class CreateOrderRequest(BaseModel):
    items: List[OrderItemCreate]
    payment_method: str = "card"
    user_name: Optional[str] = None
    user_phone: Optional[str] = None
    shipping_name: Optional[str] = None
    shipping_phone: Optional[str] = None
    shipping_address: Optional[str] = None
    address: Optional[str] = None
    notes: Optional[str] = None
    coupon_code: Optional[str] = None


@router.post("/orders")
def create_order(req: CreateOrderRequest, user_id: int = 0, db: Session = Depends(get_db)):
    """Create a new order with items."""
    if not req.items:
        raise HTTPException(status_code=400, detail="Order must have items")

    # For now use a default user if not authenticated
    actual_user_id = user_id if user_id > 0 else 52

    # Get user info
    user = db.query(User).filter(User.id == actual_user_id).first()
    user_name = req.shipping_name or req.user_name or (user.name if user else "عميل")
    user_phone = req.shipping_phone or req.user_phone or (user.phone if user else "")

    # Calculate order totals
    subtotal = Decimal("0")
    order_items = []

    for item in req.items:
        product = db.query(Product).filter(Product.id == item.product_id).first()
        if not product:
            raise HTTPException(status_code=404, detail=f"Product {item.product_id} not found")

        effective_price = product.offer_price if product.offer_price and product.offer_price > 0 else product.price
        item_total = effective_price * item.quantity
        subtotal += item_total

        order_items.append({
            "product_id": product.id,
            "product_name": product.title,
            "product_category": product.category,
            "quantity": item.quantity,
            "unit_price": effective_price,
            "total_price": item_total,
        })

        # Reduce stock
        if product.stock >= item.quantity:
            product.stock -= item.quantity

    # Handle coupon discount
    discount_amount = Decimal("0")
    coupon_id_str = None
    if req.coupon_code:
        coupon = db.query(Coupon).filter(Coupon.coupon == req.coupon_code, Coupon.active == True).first()
        if coupon and coupon.discount:
            discount_amount = subtotal * Decimal(str(coupon.discount)) / Decimal("100")
            coupon_id_str = req.coupon_code
            # Mark coupon as used for this user
            used_users = json.loads(coupon.users or "[]")
            if actual_user_id not in used_users:
                used_users.append(actual_user_id)
                coupon.users = json.dumps(used_users)

    total_amount = subtotal - discount_amount

    # Create order
    order_number = f"ORD-{str(uuid.uuid4().hex)[:8].upper()}"
    new_order = Order(
        order_number=order_number,
        user_id=actual_user_id,
        order_type="market",
        subtotal=subtotal,
        discount_amount=discount_amount,
        total_amount=total_amount,
        currency="EGP",
        payment_status="pending" if req.payment_method == "cod" else "paid",
        payment_method=req.payment_method,
        status="confirmed",
        coupon_id=coupon_id_str,
    )
    db.add(new_order)
    db.flush()  # Get the order ID

    # Create order items
    for oi in order_items:
        db_item = OrderItem(
            order_id=new_order.id,
            item_type="product",
            product_id=oi["product_id"],
            product_name=oi["product_name"],
            product_category=oi.get("product_category"),
            quantity=oi["quantity"],
            unit_price=oi["unit_price"],
            total_price=oi["total_price"],
        )
        db.add(db_item)

    db.commit()
    db.refresh(new_order)

    return {
        "status": "success",
        "order": {
            "id": new_order.id,
            "order_number": new_order.order_number,
            "total_amount": float(new_order.total_amount),
            "discount_amount": float(new_order.discount_amount),
            "status": new_order.status,
            "payment_status": new_order.payment_status,
            "items_count": len(order_items),
        }
    }


@router.get("/orders")
def get_orders(user_id: int = 52, db: Session = Depends(get_db)):
    """Get orders for a user with seller details."""
    from app.models.seller import SellerSettings
    orders = db.query(Order).filter(Order.user_id == user_id).order_by(Order.created_at.desc()).all()
    result = []
    for o in orders:
        items = db.query(OrderItem).filter(OrderItem.order_id == o.id).all()
        items_data = []
        for item in items:
            item_dict = {
                "product_name": item.product_name,
                "product_category": item.product_category,
                "quantity": item.quantity,
                "unit_price": float(item.unit_price),
                "total_price": float(item.total_price),
            }
            # Get seller info from product
            if item.product_id:
                product = db.query(Product).filter(Product.id == item.product_id).first()
                if product and product.seller:
                    item_dict["seller_name"] = product.seller
                    item_dict["product_sku"] = product.sku or ""
                    # Get seller settings for detailed info
                    seller_user = db.query(User).filter(User.name == product.seller).first()
                    if seller_user:
                        settings = db.query(SellerSettings).filter(SellerSettings.seller_id == seller_user.id).first()
                        if settings:
                            item_dict["seller_company"] = settings.store_name or product.seller
                            item_dict["seller_phone"] = settings.business_phone or ""
                            item_dict["seller_email"] = settings.business_email or ""
                            item_dict["seller_address"] = settings.business_address or ""
            items_data.append(item_dict)

        # Get customer info
        customer = db.query(User).filter(User.id == o.user_id).first()
        result.append({
            "id": o.id,
            "order_number": o.order_number,
            "order_type": o.order_type,
            "subtotal": float(o.subtotal) if o.subtotal else 0,
            "discount_amount": float(o.discount_amount) if o.discount_amount else 0,
            "total_amount": float(o.total_amount) if o.total_amount else 0,
            "status": o.status,
            "payment_status": o.payment_status,
            "payment_method": o.payment_method,
            "coupon_id": o.coupon_id,
            "created_at": o.created_at.isoformat() if o.created_at else None,
            "customer_name": customer.name if customer else "",
            "customer_phone": customer.phone if customer else "",
            "customer_email": customer.email if customer else "",
            "items": items_data,
        })
    return result


@router.get("/orders/{order_id}")
def get_order_detail(order_id: int, db: Session = Depends(get_db)):
    """Get detailed order information."""
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    items = db.query(OrderItem).filter(OrderItem.order_id == order.id).all()
    return {
        "id": order.id,
        "order_number": order.order_number,
        "order_type": order.order_type,
        "subtotal": float(order.subtotal) if order.subtotal else 0,
        "discount_amount": float(order.discount_amount) if order.discount_amount else 0,
        "total_amount": float(order.total_amount) if order.total_amount else 0,
        "status": order.status,
        "payment_status": order.payment_status,
        "payment_method": order.payment_method,
        "payment_reference": order.payment_reference,
        "coupon_id": order.coupon_id,
        "created_at": order.created_at.isoformat() if order.created_at else None,
        "items": [{
            "id": item.id,
            "product_name": item.product_name,
            "product_category": item.product_category,
            "quantity": item.quantity,
            "unit_price": float(item.unit_price),
            "total_price": float(item.total_price),
        } for item in items],
    }


@router.put("/orders/{order_id}/status")
def update_order_status(order_id: int, status: str, db: Session = Depends(get_db)):
    """Update order status (admin) and send tracking notification."""
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    old_status = order.status
    order.status = status

    # Create order tracking notification
    status_messages = {
        "confirmed": ("✅ تم تأكيد طلبك", f"طلبك رقم #{order.id} تم تأكيده وجاري تجهيزه. شكراً لثقتك بنا!"),
        "processing": ("📦 جاري تجهيز طلبك", f"طلبك رقم #{order.id} قيد التجهيز وسيتم شحنه قريباً."),
        "shipped": ("🚚 تم شحن طلبك", f"طلبك رقم #{order.id} في الطريق إليك! متوقع الوصول خلال 2-5 أيام عمل."),
        "delivered": ("🎉 تم توصيل طلبك", f"طلبك رقم #{order.id} تم توصيله بنجاح. نتمنى أن ينال إعجابك!"),
        "cancelled": ("❌ تم إلغاء الطلب", f"طلبك رقم #{order.id} تم إلغاؤه. سيتم استرداد المبلغ خلال 3-5 أيام عمل."),
    }
    if status in status_messages:
        title, message = status_messages[status]
        notif = Notification(
            title=title,
            message=message,
            type="order",
            target_audience="user",
            is_active=True,
        )
        db.add(notif)

    db.commit()
    return {"status": "success", "order_status": status, "previous_status": old_status}


# ================================================
# GIFT CARDS
# ================================================
@router.get("/gift-cards")
def get_gift_cards(user_id: int = 0, db: Session = Depends(get_db)):
    """Get gift cards for a user or all (admin)."""
    query = db.query(GiftCard)
    cards = query.all()
    return [{
        "id": c.id,
        "order_id": c.order_id,
        "code": c.code,
        "status": c.status,
        "used": c.used,
        "activated_at": c.activated_at.isoformat() if c.activated_at else None,
    } for c in cards]


class GiftCardActivateRequest(BaseModel):
    code: str


@router.post("/gift-cards/activate")
def activate_gift_card(req: GiftCardActivateRequest, db: Session = Depends(get_db)):
    """Activate a gift card by code."""
    card = db.query(GiftCard).filter(GiftCard.code == req.code).first()
    if not card:
        raise HTTPException(status_code=404, detail="بطاقة هدية غير صالحة")
    if card.used == 1:
        raise HTTPException(status_code=400, detail="تم استخدام هذه البطاقة مسبقاً")
    card.status = 1
    card.used = 1
    card.activated_at = datetime.utcnow()
    db.commit()
    return {"status": "success", "message": "تم تفعيل البطاقة بنجاح"}


# ================================================
# LOYALTY CARDS
# ================================================
@router.get("/loyalty")
def get_loyalty_status(user_id: int = 52, db: Session = Depends(get_db)):
    """Get loyalty card status for a user."""
    today = date.today()
    active = db.query(LoyaltyUser).filter(
        LoyaltyUser.user_id == user_id,
        LoyaltyUser.end_date >= today,
    ).first()
    if active:
        return {
            "active": True,
            "subscription_type": active.subscription_type,
            "start_date": active.start_date.isoformat(),
            "end_date": active.end_date.isoformat(),
            "days_remaining": (active.end_date - today).days,
        }
    return {"active": False, "subscription_type": None}


class LoyaltySubscribeRequest(BaseModel):
    user_id: int
    subscription_type: str  # silverLoyaltyCard, goldLoyaltyCard
    months: int = 1


@router.post("/loyalty/subscribe")
def subscribe_loyalty(req: LoyaltySubscribeRequest, db: Session = Depends(get_db)):
    """Subscribe user to a loyalty card."""
    today = date.today()
    end_date = today + timedelta(days=30 * req.months)

    loyalty = LoyaltyUser(
        user_id=req.user_id,
        subscription_type=req.subscription_type,
        start_date=today,
        end_date=end_date,
    )
    db.add(loyalty)
    db.commit()
    return {
        "status": "success",
        "subscription_type": req.subscription_type,
        "start_date": today.isoformat(),
        "end_date": end_date.isoformat(),
    }


# ================================================
# MEMBERSHIP SERVICE USAGE TRACKING
# ================================================
@router.get("/membership/usage/{user_id}")
def get_membership_usage(user_id: int, db: Session = Depends(get_db)):
    """Get all services used with membership card discounts."""
    from app.models.membership import MembershipServiceUsage, UserMembership
    usages = db.query(MembershipServiceUsage).filter(
        MembershipServiceUsage.user_id == user_id
    ).order_by(MembershipServiceUsage.created_at.desc()).all()

    total_saved = sum(float(u.discount_amount or 0) for u in usages)
    return {
        "usages": [{
            "id": u.id,
            "service_type": u.service_type,
            "service_name": u.service_name,
            "original_price": float(u.original_price or 0),
            "discounted_price": float(u.discounted_price or 0),
            "discount_amount": float(u.discount_amount or 0),
            "created_at": u.created_at.isoformat() if u.created_at else None,
        } for u in usages],
        "total_saved": total_saved,
        "usage_count": len(usages),
    }


@router.post("/membership/usage")
def track_membership_usage(data: dict, db: Session = Depends(get_db)):
    """Record a service used with membership discount."""
    from app.models.membership import MembershipServiceUsage
    usage = MembershipServiceUsage(
        user_id=data["user_id"],
        membership_id=data["membership_id"],
        service_type=data["service_type"],
        service_name=data.get("service_name", ""),
        original_price=data.get("original_price", 0),
        discounted_price=data.get("discounted_price", 0),
        discount_amount=data.get("discount_amount", 0),
        reference_id=data.get("reference_id"),
    )
    db.add(usage)
    db.commit()
    return {"status": "success", "id": usage.id}


# ================================================
# MARKETING MESSAGES
# ================================================
@router.get("/marketing/messages")
def get_marketing_messages(status: Optional[str] = None, db: Session = Depends(get_db)):
    """List marketing messages/campaigns."""
    from app.models.membership import MarketingMessage
    q = db.query(MarketingMessage)
    if status:
        q = q.filter(MarketingMessage.status == status)
    msgs = q.order_by(MarketingMessage.created_at.desc()).all()
    return [{
        "id": m.id, "title": m.title, "body": m.body,
        "channel": m.channel, "target_audience": m.target_audience,
        "image_url": m.image_url, "link_url": m.link_url,
        "status": m.status, "sent_count": m.sent_count,
        "opened_count": m.opened_count,
        "scheduled_at": m.scheduled_at.isoformat() if m.scheduled_at else None,
        "sent_at": m.sent_at.isoformat() if m.sent_at else None,
        "created_at": m.created_at.isoformat() if m.created_at else None,
    } for m in msgs]


@router.post("/marketing/messages")
def create_marketing_message(data: dict, db: Session = Depends(get_db)):
    """Create a new marketing message/campaign."""
    from app.models.membership import MarketingMessage
    msg = MarketingMessage(
        title=data["title"],
        body=data["body"],
        channel=data.get("channel", "push"),
        target_audience=data.get("target_audience", "all"),
        image_url=data.get("image_url"),
        link_url=data.get("link_url"),
        status=data.get("status", "draft"),
        created_by=data.get("created_by"),
    )
    db.add(msg)
    db.commit()
    return {"status": "success", "id": msg.id, "message": "تم إنشاء الرسالة التسويقية"}


@router.put("/marketing/messages/{msg_id}/send")
def send_marketing_message(msg_id: int, db: Session = Depends(get_db)):
    """Mark a marketing message as sent (simulates sending via WhatsApp/email/push)."""
    from app.models.membership import MarketingMessage
    from app.models.user import User
    msg = db.query(MarketingMessage).filter(MarketingMessage.id == msg_id).first()
    if not msg:
        raise HTTPException(404, "الرسالة غير موجودة")

    # Count target users
    target_q = db.query(User)
    if msg.target_audience and msg.target_audience != "all":
        if msg.target_audience.startswith("country:"):
            country = msg.target_audience.split(":")[1]
            target_q = target_q.filter(User.country == country)
        elif msg.target_audience == "vip":
            target_q = target_q.filter(User.role == "vip")

    user_count = target_q.count()
    msg.status = "sent"
    msg.sent_at = datetime.utcnow()
    msg.sent_count = user_count

    # Create in-app notifications for all target users
    from app.models.cms import Notification
    users = target_q.all()
    for u in users:
        notif = Notification(
            user_id=u.id, title=msg.title, message=msg.body,
            type="marketing", active=True
        )
        db.add(notif)

    db.commit()
    return {"status": "success", "sent_count": user_count}


# ================================================
# MULTI-CURRENCY PRICING
# ================================================
@router.get("/consultation/packages")
def get_consultation_packages(country: str = "SA", db: Session = Depends(get_db)):
    """Get consultation packages with pricing for the user's country."""
    from app.models.membership import ConsultationPackage
    packages = db.query(ConsultationPackage).filter(
        ConsultationPackage.active == True
    ).order_by(ConsultationPackage.sort_order).all()

    currency_map = {"EG": "EGP", "SA": "SAR", "AE": "AED", "OM": "OMR"}
    currency = currency_map.get(country, "SAR")

    return [{
        "id": p.id,
        "name_ar": p.name_ar, "name_en": p.name_en,
        "description_ar": p.description_ar, "description_en": p.description_en,
        "features_ar": json.loads(p.features_ar or "[]"),
        "features_en": json.loads(p.features_en or "[]"),
        "price": getattr(p, f"price_{country.lower()}", p.price_sa) or p.price_sa,
        "currency": currency,
        "duration": p.duration, "icon": p.icon,
    } for p in packages]


# ================================================
# ADMIN ATTACHMENTS
# ================================================
@router.post("/admin/attachments")
def upload_admin_attachments(
    record_type: str = Form(...),  # medical_profile, order, product
    record_id: int = Form(...),
    files: List[UploadFile] = File(...),
    db: Session = Depends(get_db)
):
    """Upload multiple attachments for admin use."""
    os.makedirs("media/attachments", exist_ok=True)
    uploaded = []
    for f in files:
        ext = os.path.splitext(f.filename)[1]
        fname = f"{uuid.uuid4().hex}{ext}"
        path = f"media/attachments/{fname}"
        with open(path, "wb") as out:
            shutil.copyfileobj(f.file, out)
        uploaded.append(f"/media/attachments/{fname}")

    # Update the record's attachments field
    if record_type == "medical_profile":
        from app.models.membership import MedicalProfile
        rec = db.query(MedicalProfile).filter(MedicalProfile.id == record_id).first()
        if rec:
            existing = json.loads(rec.attachments or "[]") if rec.attachments else []
            existing.extend(uploaded)
            rec.attachments = json.dumps(existing)
            db.commit()

    return {"status": "success", "files": uploaded, "count": len(uploaded)}
