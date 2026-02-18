"""
Seller Dashboard API - Comprehensive system for sellers.
Covers: Stats, Products, Orders, Notifications, Returns, Wallet, Reports, Customers, Settings
"""
from fastapi import APIRouter, Depends, HTTPException, File, UploadFile, Form, Query
from sqlalchemy.orm import Session
from sqlalchemy import func, desc, and_, extract, case
from typing import Optional, List
from datetime import datetime, timedelta
import os, uuid, shutil, json

from app.db.session import SessionLocal
from app.models.ecommerce import Product, Order, OrderItem, Coupon
from app.models.user import User
from app.models.seller import (
    SellerNotification, OrderStatusHistory, OrderReturn,
    SellerWallet, WalletTransaction, WithdrawalRequest, SellerSettings
)

router = APIRouter()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def get_seller_or_404(db, seller_id):
    seller = db.query(User).filter(User.id == seller_id).first()
    if not seller:
        raise HTTPException(404, "البائع غير موجود")
    return seller


def get_seller_product_ids(db, seller_name):
    return [p.id for p in db.query(Product).filter(Product.seller == seller_name).all()]


def create_notification(db, user_id, ntype, title, message, related_type=None, related_id=None, priority="medium"):
    notif = SellerNotification(
        user_id=user_id, type=ntype, title=title, message=message,
        related_type=related_type, related_id=related_id, priority=priority
    )
    db.add(notif)
    db.commit()
    return notif


# ════════════════════════════════════════════════════════════
# SELLER STATS (Enhanced)
# ════════════════════════════════════════════════════════════
@router.get("/stats")
def get_seller_stats(seller_id: int, period: str = "all", db: Session = Depends(get_db)):
    """Enhanced dashboard statistics with period filter."""
    seller = get_seller_or_404(db, seller_id)
    product_ids = get_seller_product_ids(db, seller.name)

    # Time filter
    now = datetime.utcnow()
    date_filter = None
    if period == "today":
        date_filter = now.replace(hour=0, minute=0, second=0, microsecond=0)
    elif period == "week":
        date_filter = now - timedelta(days=7)
    elif period == "month":
        date_filter = now - timedelta(days=30)
    elif period == "year":
        date_filter = now - timedelta(days=365)

    # Get orders
    if product_ids:
        order_ids_q = db.query(OrderItem.order_id).filter(OrderItem.product_id.in_(product_ids)).distinct()
        order_ids = [oid[0] for oid in order_ids_q.all()]
    else:
        order_ids = []

    orders_q = db.query(Order).filter(Order.id.in_(order_ids)) if order_ids else db.query(Order).filter(False)
    if date_filter:
        orders_q = orders_q.filter(Order.created_at >= date_filter)
    orders = orders_q.all()

    # Previous period for comparison
    prev_orders = []
    if date_filter:
        delta = now - date_filter
        prev_start = date_filter - delta
        prev_q = db.query(Order).filter(Order.id.in_(order_ids), Order.created_at >= prev_start, Order.created_at < date_filter)
        prev_orders = prev_q.all()

    total_revenue = sum(float(o.total_amount) for o in orders)
    prev_revenue = sum(float(o.total_amount) for o in prev_orders)
    revenue_growth = ((total_revenue - prev_revenue) / prev_revenue * 100) if prev_revenue > 0 else 0

    pending_orders = len([o for o in orders if o.status in ('confirmed', 'processing')])
    shipped_orders = len([o for o in orders if o.status == 'shipped'])
    delivered_orders = len([o for o in orders if o.status == 'delivered'])
    cancelled_orders = len([o for o in orders if o.status == 'cancelled'])

    products = db.query(Product).filter(Product.seller == seller.name).all()
    settings = db.query(SellerSettings).filter(SellerSettings.seller_id == seller_id).first()
    low_threshold = settings.low_stock_threshold if settings else 5

    # Top products (by order count)
    top_products = []
    if product_ids:
        top_q = db.query(
            OrderItem.product_id, OrderItem.product_name,
            func.sum(OrderItem.quantity).label('total_qty'),
            func.sum(OrderItem.total_price).label('total_sales')
        ).filter(OrderItem.product_id.in_(product_ids)).group_by(
            OrderItem.product_id, OrderItem.product_name
        ).order_by(desc('total_sales')).limit(5).all()

        top_products = [{"id": t[0], "name": t[1], "quantity": int(t[2]), "sales": float(t[3])} for t in top_q]

    # Monthly revenue chart (last 6 months)
    monthly_revenue = []
    for i in range(5, -1, -1):
        m_start = (now.replace(day=1) - timedelta(days=i * 30)).replace(day=1, hour=0, minute=0, second=0, microsecond=0)
        if i > 0:
            m_end = (now.replace(day=1) - timedelta(days=(i - 1) * 30)).replace(day=1, hour=0, minute=0, second=0, microsecond=0)
        else:
            m_end = now
        m_orders = [o for o in orders if o.created_at and m_start <= o.created_at < m_end] if not date_filter else []
        # For all-time stats, compute monthly
        if not date_filter and order_ids:
            m_orders_q = db.query(Order).filter(
                Order.id.in_(order_ids), Order.created_at >= m_start, Order.created_at < m_end
            ).all()
            m_rev = sum(float(o.total_amount) for o in m_orders_q)
        else:
            m_rev = sum(float(o.total_amount) for o in m_orders)
        monthly_revenue.append({
            "month": m_start.strftime("%b"),
            "revenue": m_rev if not date_filter else 0
        })

    # Unread notifications count
    unread_notifs = db.query(func.count(SellerNotification.id)).filter(
        SellerNotification.user_id == seller_id, SellerNotification.is_read == False
    ).scalar() or 0

    return {
        "seller_name": seller.name,
        "total_products": len(products),
        "active_products": len([p for p in products if p.status == 1]),
        "total_orders": len(orders),
        "pending_orders": pending_orders,
        "shipped_orders": shipped_orders,
        "delivered_orders": delivered_orders,
        "cancelled_orders": cancelled_orders,
        "total_revenue": total_revenue,
        "revenue_growth": int(float(revenue_growth) * 10) / 10,
        "low_stock": len([p for p in products if p.stock < low_threshold]),
        "top_products": top_products,
        "monthly_revenue": monthly_revenue,
        "unread_notifications": unread_notifs,
        "period": period,
    }


# ════════════════════════════════════════════════════════════
# SELLER PRODUCTS (Full CRUD)
# ════════════════════════════════════════════════════════════
@router.get("/products")
def get_seller_products(seller_id: int, status: Optional[str] = None, category: Optional[str] = None,
                        sort: str = "newest", db: Session = Depends(get_db)):
    seller = get_seller_or_404(db, seller_id)
    q = db.query(Product).filter(Product.seller == seller.name)
    if status == "active":
        q = q.filter(Product.status == 1)
    elif status == "inactive":
        q = q.filter(Product.status == 0)
    if category:
        q = q.filter(Product.category == category)
    if sort == "newest":
        q = q.order_by(Product.id.desc())
    elif sort == "price_high":
        q = q.order_by(Product.price.desc())
    elif sort == "price_low":
        q = q.order_by(Product.price.asc())
    elif sort == "stock_low":
        q = q.order_by(Product.stock.asc())

    products = q.all()
    return [{
        "id": p.id, "title": p.title, "details": p.details,
        "price": float(p.price), "offer_price": float(p.offer_price or 0),
        "stock": p.stock, "img_url": p.img_url,
        "images": json.loads(p.images or "[]") if p.images else [],
        "category": p.category, "sub_category": p.sub_category,
        "status": p.status, "in_review": p.in_review,
        "returnable": getattr(p, 'returnable', True),
    } for p in products]


@router.post("/products")
def add_seller_product(
    seller_id: int = Form(...), title: str = Form(...),
    details: str = Form(...), price: float = Form(...),
    stock: int = Form(...), category: str = Form(...),
    sub_category: Optional[str] = Form(None),
    offer_price: Optional[float] = Form(None),
    brand: str = Form(...),
    sku: str = Form(...),
    offer_start_date: Optional[str] = Form(None),
    offer_end_date: Optional[str] = Form(None),
    image: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db)
):
    seller = get_seller_or_404(db, seller_id)
    img_url = None
    if image:
        ext = os.path.splitext(image.filename)[1]
        fname = f"{uuid.uuid4().hex}{ext}"
        path = f"media/products/{fname}"
        os.makedirs("media/products", exist_ok=True)
        with open(path, "wb") as f:
            shutil.copyfileobj(image.file, f)
        img_url = f"/media/products/{fname}"

    product = Product(
        title=title, details=details, price=price,
        offer_price=offer_price or price,
        stock=stock, category=category, sub_category=sub_category or "",
        seller=seller.name,
        brand=brand, sku=sku,
        offer_start_date=offer_start_date if offer_start_date else None,
        offer_end_date=offer_end_date if offer_end_date else None,
        img_url=img_url, status=1, in_review=0
    )
    db.add(product)
    db.commit()
    db.refresh(product)
    return {"status": "success", "id": product.id, "message": "تم إضافة المنتج بنجاح"}


@router.put("/products/{product_id}")
def update_seller_product(
    product_id: int,
    title: Optional[str] = Form(None),
    details: Optional[str] = Form(None),
    price: Optional[float] = Form(None),
    stock: Optional[int] = Form(None),
    category: Optional[str] = Form(None),
    sub_category: Optional[str] = Form(None),
    offer_price: Optional[float] = Form(None),
    brand: Optional[str] = Form(None),
    sku: Optional[str] = Form(None),
    offer_start_date: Optional[str] = Form(None),
    offer_end_date: Optional[str] = Form(None),
    returnable: Optional[str] = Form(None),
    image: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db)
):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(404, "المنتج غير موجود")
    
    # Update fields if provided
    if title is not None: product.title = title
    if details is not None: product.details = details
    if price is not None: product.price = price
    if stock is not None: product.stock = stock
    if category is not None: product.category = category
    if sub_category is not None: product.sub_category = sub_category
    if offer_price is not None: product.offer_price = offer_price
    if brand is not None: product.brand = brand
    if sku is not None: product.sku = sku
    if offer_start_date is not None: product.offer_start_date = offer_start_date if offer_start_date else None
    if offer_end_date is not None: product.offer_end_date = offer_end_date if offer_end_date else None
    if returnable is not None: product.returnable = returnable in ("1", "true", "True")
    
    # Handle image upload on edit
    if image:
        ext = os.path.splitext(image.filename)[1]
        fname = f"{uuid.uuid4().hex}{ext}"
        path = f"media/products/{fname}"
        os.makedirs("media/products", exist_ok=True)
        with open(path, "wb") as f:
            shutil.copyfileobj(image.file, f)
        product.img_url = f"/media/products/{fname}"
    
    db.commit()
    return {"status": "success", "message": "تم تحديث المنتج"}


@router.put("/products/{product_id}/toggle")
def toggle_product_status(product_id: int, db: Session = Depends(get_db)):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(404, "المنتج غير موجود")
    product.status = 0 if product.status == 1 else 1
    db.commit()
    return {"status": "success", "active": product.status == 1}


@router.post("/products/{product_id}/duplicate")
def duplicate_product(product_id: int, db: Session = Depends(get_db)):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(404, "المنتج غير موجود")
    new_product = Product(
        title=f"{product.title} (نسخة)", details=product.details,
        price=product.price, offer_price=product.offer_price,
        stock=product.stock, img_url=product.img_url,
        images=product.images,
        category=product.category, sub_category=product.sub_category,
        seller=product.seller, status=0, in_review=0,
        returnable=getattr(product, 'returnable', True),
    )
    db.add(new_product)
    db.commit()
    return {"status": "success", "id": new_product.id, "message": "تم نسخ المنتج بنجاح"}


@router.post("/products/{product_id}/images")
def upload_product_images(
    product_id: int,
    images: List[UploadFile] = File(...),
    db: Session = Depends(get_db)
):
    """Upload additional images for a product."""
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(404, "المنتج غير موجود")
    existing = json.loads(product.images or "[]") if product.images else []
    os.makedirs("media/products", exist_ok=True)
    for img in images:
        ext = os.path.splitext(img.filename)[1]
        fname = f"{uuid.uuid4().hex}{ext}"
        path = f"media/products/{fname}"
        with open(path, "wb") as f:
            shutil.copyfileobj(img.file, f)
        existing.append(f"/media/products/{fname}")
    product.images = json.dumps(existing)
    db.commit()
    return {"status": "success", "images": existing, "message": f"تم رفع {len(images)} صورة"}


@router.delete("/products/{product_id}")
def delete_seller_product(product_id: int, db: Session = Depends(get_db)):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(404, "المنتج غير موجود")
    db.delete(product)
    db.commit()
    return {"status": "success", "message": "تم حذف المنتج"}


# ════════════════════════════════════════════════════════════
# SELLER ORDERS (Advanced)
# ════════════════════════════════════════════════════════════
@router.get("/orders")
def get_seller_orders(seller_id: int, status: Optional[str] = None,
                      search: Optional[str] = None, date_from: Optional[str] = None,
                      date_to: Optional[str] = None, db: Session = Depends(get_db)):
    seller = get_seller_or_404(db, seller_id)
    product_ids = get_seller_product_ids(db, seller.name)
    if not product_ids:
        return []

    order_ids = [oid[0] for oid in db.query(OrderItem.order_id).filter(
        OrderItem.product_id.in_(product_ids)
    ).distinct().all()]
    if not order_ids:
        return []

    q = db.query(Order).filter(Order.id.in_(order_ids)).order_by(Order.created_at.desc())
    if status and status != 'all':
        q = q.filter(Order.status == status)
    if date_from:
        q = q.filter(Order.created_at >= date_from)
    if date_to:
        q = q.filter(Order.created_at <= date_to)

    orders = q.all()
    result = []
    for o in orders:
        user = db.query(User).filter(User.id == o.user_id).first()
        items = db.query(OrderItem).filter(
            OrderItem.order_id == o.id, OrderItem.product_id.in_(product_ids)
        ).all()
        seller_subtotal = sum(float(i.total_price) for i in items)

        # Search filter
        if search:
            s = str(search)
            search_match = (
                s in str(o.order_number or '') or
                s in str(user.name if user else '') or
                any(s in str(i.product_name or '') for i in items)
            )
            if not search_match:
                continue

        # Get status history
        history = db.query(OrderStatusHistory).filter(
            OrderStatusHistory.order_id == o.id
        ).order_by(OrderStatusHistory.created_at.desc()).all()

        result.append({
            "id": o.id,
            "order_number": o.order_number,
            "user_id": o.user_id,
            "user_name": user.name if user else "غير معروف",
            "status": o.status,
            "payment_method": o.payment_method,
            "payment_status": o.payment_status,
            "seller_total": seller_subtotal,
            "total_amount": float(o.total_amount),
            "subtotal": float(o.subtotal) if o.subtotal else float(o.total_amount),
            "discount_amount": float(o.discount_amount) if o.discount_amount else 0,
            "created_at": o.created_at.isoformat() if o.created_at else None,
            "updated_at": o.updated_at.isoformat() if o.updated_at else None,
            "items": [{
                "id": i.id, "product_id": i.product_id,
                "product_name": i.product_name, "quantity": i.quantity,
                "unit_price": float(i.unit_price), "total_price": float(i.total_price),
            } for i in items],
            "history": [{
                "old_status": h.old_status, "new_status": h.new_status,
                "notes": h.notes, "changed_by": h.changed_by_role,
                "created_at": h.created_at.isoformat() if h.created_at else None,
            } for h in history],
        })
    return result


@router.put("/orders/{order_id}/status")
def update_seller_order_status(order_id: int, status: str,
                               seller_id: Optional[int] = None,
                               notes: Optional[str] = None,
                               tracking_number: Optional[str] = None,
                               db: Session = Depends(get_db)):
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(404, "الطلب غير موجود")

    valid_transitions = {
        'confirmed': ['processing'],
        'processing': ['shipped'],
        'shipped': ['delivered'],
    }
    allowed = valid_transitions.get(order.status, [])
    if status not in allowed and status != 'cancelled':
        raise HTTPException(400, f"لا يمكن تغيير الحالة من {order.status} إلى {status}")

    old_status = order.status
    order.status = status
    if status == 'delivered':
        order.payment_status = 'paid'

    # Record status history
    history = OrderStatusHistory(
        order_id=order_id, old_status=old_status, new_status=status,
        changed_by_user_id=seller_id, changed_by_role="seller", notes=notes
    )
    db.add(history)

    # Notify customer
    status_labels = {
        'processing': 'قيد التجهيز',
        'shipped': 'تم الشحن',
        'delivered': 'تم التوصيل',
        'cancelled': 'تم الإلغاء',
    }
    if order.user_id:
        create_notification(
            db, order.user_id,
            f"order_{status}",
            f"تحديث طلبك #{order.order_number}",
            f"تم تحديث حالة طلبك إلى: {status_labels.get(status, status)}",
            related_type="order", related_id=order.id
        )

    db.commit()
    return {"status": "success", "new_status": status}


# ════════════════════════════════════════════════════════════
# NOTIFICATIONS
# ════════════════════════════════════════════════════════════
@router.get("/notifications")
def get_notifications(seller_id: int, unread_only: bool = False,
                      limit: int = 50, db: Session = Depends(get_db)):
    q = db.query(SellerNotification).filter(SellerNotification.user_id == seller_id)
    if unread_only:
        q = q.filter(SellerNotification.is_read == False)
    notifs = q.order_by(SellerNotification.created_at.desc()).limit(limit).all()
    return [{
        "id": n.id, "type": n.type, "title": n.title, "message": n.message,
        "related_type": n.related_type, "related_id": n.related_id,
        "is_read": n.is_read, "priority": n.priority,
        "created_at": n.created_at.isoformat() if n.created_at else None,
    } for n in notifs]


@router.get("/notifications/count")
def get_unread_count(seller_id: int, db: Session = Depends(get_db)):
    count = db.query(func.count(SellerNotification.id)).filter(
        SellerNotification.user_id == seller_id, SellerNotification.is_read == False
    ).scalar() or 0
    return {"unread_count": count}


@router.put("/notifications/{notif_id}/read")
def mark_notification_read(notif_id: int, db: Session = Depends(get_db)):
    notif = db.query(SellerNotification).filter(SellerNotification.id == notif_id).first()
    if notif:
        notif.is_read = True
        notif.read_at = datetime.utcnow()
        db.commit()
    return {"status": "success"}


@router.put("/notifications/read-all")
def mark_all_read(seller_id: int, db: Session = Depends(get_db)):
    db.query(SellerNotification).filter(
        SellerNotification.user_id == seller_id, SellerNotification.is_read == False
    ).update({"is_read": True, "read_at": datetime.utcnow()})
    db.commit()
    return {"status": "success"}


@router.delete("/notifications/{notif_id}")
def delete_notification(notif_id: int, db: Session = Depends(get_db)):
    n = db.query(SellerNotification).filter(SellerNotification.id == notif_id).first()
    if n:
        db.delete(n)
        db.commit()
    return {"status": "success"}


# ════════════════════════════════════════════════════════════
# RETURNS & REFUNDS
# ════════════════════════════════════════════════════════════
@router.get("/returns")
def get_seller_returns(seller_id: int, status: Optional[str] = None, db: Session = Depends(get_db)):
    q = db.query(OrderReturn).filter(OrderReturn.seller_id == seller_id)
    if status:
        q = q.filter(OrderReturn.status == status)
    returns = q.order_by(OrderReturn.created_at.desc()).all()
    result = []
    for r in returns:
        user = db.query(User).filter(User.id == r.user_id).first()
        order = db.query(Order).filter(Order.id == r.order_id).first()
        result.append({
            "id": r.id, "return_number": r.return_number,
            "order_number": order.order_number if order else "--",
            "user_name": user.name if user else "غير معروف",
            "type": r.type, "status": r.status,
            "reason": r.reason, "reason_details": r.reason_details,
            "refund_amount": float(r.refund_amount) if r.refund_amount else 0,
            "items": json.loads(r.items) if r.items else [],
            "created_at": r.created_at.isoformat() if r.created_at else None,
        })
    return result


@router.put("/returns/{return_id}/approve")
def approve_return(return_id: int, refund_amount: float, db: Session = Depends(get_db)):
    ret = db.query(OrderReturn).filter(OrderReturn.id == return_id).first()
    if not ret:
        raise HTTPException(404, "طلب الإرجاع غير موجود")
    ret.status = "approved"
    ret.refund_amount = refund_amount
    ret.approved_at = datetime.utcnow()
    create_notification(db, ret.user_id, "return_approved",
                        f"تمت الموافقة على طلب الإرجاع #{ret.return_number}",
                        f"تمت الموافقة على إرجاعك بمبلغ {refund_amount} ج.م",
                        "return", ret.id)
    db.commit()
    return {"status": "success"}


@router.put("/returns/{return_id}/reject")
def reject_return(return_id: int, reason: str, db: Session = Depends(get_db)):
    ret = db.query(OrderReturn).filter(OrderReturn.id == return_id).first()
    if not ret:
        raise HTTPException(404, "طلب الإرجاع غير موجود")
    ret.status = "rejected"
    ret.rejection_reason = reason
    ret.rejected_at = datetime.utcnow()
    create_notification(db, ret.user_id, "return_rejected",
                        f"تم رفض طلب الإرجاع #{ret.return_number}",
                        f"السبب: {reason}", "return", ret.id)
    db.commit()
    return {"status": "success"}


# ════════════════════════════════════════════════════════════
# WALLET & FINANCIAL
# ════════════════════════════════════════════════════════════
@router.get("/wallet")
def get_wallet(seller_id: int, db: Session = Depends(get_db)):
    wallet = db.query(SellerWallet).filter(SellerWallet.seller_id == seller_id).first()
    if not wallet:
        wallet = SellerWallet(seller_id=seller_id)
        db.add(wallet)
        db.commit()
        db.refresh(wallet)
    return {
        "available_balance": float(wallet.available_balance or 0),
        "pending_balance": float(wallet.pending_balance or 0),
        "total_earned": float(wallet.total_earned or 0),
        "total_withdrawn": float(wallet.total_withdrawn or 0),
        "bank_name": wallet.bank_name,
        "account_number": wallet.account_number,
        "account_name": wallet.account_name,
        "iban": wallet.iban,
    }


@router.put("/wallet/bank-info")
def update_bank_info(seller_id: int, data: dict, db: Session = Depends(get_db)):
    wallet = db.query(SellerWallet).filter(SellerWallet.seller_id == seller_id).first()
    if not wallet:
        wallet = SellerWallet(seller_id=seller_id)
        db.add(wallet)
    for key in ["bank_name", "account_number", "account_name", "iban"]:
        if key in data:
            setattr(wallet, key, data[key])
    db.commit()
    return {"status": "success"}


@router.get("/wallet/transactions")
def get_transactions(seller_id: int, limit: int = 50, db: Session = Depends(get_db)):
    txns = db.query(WalletTransaction).filter(
        WalletTransaction.seller_id == seller_id
    ).order_by(WalletTransaction.created_at.desc()).limit(limit).all()
    return [{
        "id": t.id, "type": t.type, "amount": float(t.amount),
        "description": t.description, "status": t.status,
        "balance_after": float(t.balance_after) if t.balance_after else 0,
        "created_at": t.created_at.isoformat() if t.created_at else None,
    } for t in txns]


@router.post("/wallet/withdraw")
def request_withdrawal(seller_id: int, amount: float, db: Session = Depends(get_db)):
    wallet = db.query(SellerWallet).filter(SellerWallet.seller_id == seller_id).first()
    if not wallet or float(wallet.available_balance or 0) < amount:
        raise HTTPException(400, "الرصيد غير كافي")
    req_number = f"WD-{uuid.uuid4().hex[:8].upper()}"
    wr = WithdrawalRequest(
        seller_id=seller_id, request_number=req_number, amount=amount,
        bank_name=wallet.bank_name, account_number=wallet.account_number,
        account_name=wallet.account_name, iban=wallet.iban
    )
    db.add(wr)
    wallet.available_balance = float(wallet.available_balance) - amount
    wallet.pending_balance = float(wallet.pending_balance or 0) + amount
    db.commit()
    return {"status": "success", "request_number": req_number}


@router.get("/wallet/withdrawals")
def get_withdrawals(seller_id: int, db: Session = Depends(get_db)):
    wds = db.query(WithdrawalRequest).filter(
        WithdrawalRequest.seller_id == seller_id
    ).order_by(WithdrawalRequest.created_at.desc()).all()
    return [{
        "id": w.id, "request_number": w.request_number,
        "amount": float(w.amount), "status": w.status,
        "bank_name": w.bank_name,
        "created_at": w.created_at.isoformat() if w.created_at else None,
    } for w in wds]


# ════════════════════════════════════════════════════════════
# CUSTOMERS
# ════════════════════════════════════════════════════════════
@router.get("/customers")
def get_seller_customers(seller_id: int, db: Session = Depends(get_db)):
    seller = get_seller_or_404(db, seller_id)
    product_ids = get_seller_product_ids(db, seller.name)
    if not product_ids:
        return []

    # Get unique customer IDs who ordered seller's products
    customer_orders = db.query(
        Order.user_id,
        func.count(Order.id).label('order_count'),
        func.sum(Order.total_amount).label('total_spent'),
        func.max(Order.created_at).label('last_order')
    ).join(OrderItem, Order.id == OrderItem.order_id).filter(
        OrderItem.product_id.in_(product_ids)
    ).group_by(Order.user_id).all()

    customers = []
    for co in customer_orders:
        user = db.query(User).filter(User.id == co[0]).first()
        if user:
            customers.append({
                "id": user.id, "name": user.name,
                "order_count": co[1], "total_spent": float(co[2]),
                "last_order": co[3].isoformat() if co[3] else None,
                "profile_image": user.profile_image,
            })
    return sorted(customers, key=lambda x: x['total_spent'], reverse=True)


# ════════════════════════════════════════════════════════════
# REPORTS & ANALYTICS
# ════════════════════════════════════════════════════════════
@router.get("/reports/sales")
def get_sales_report(seller_id: int, period: str = "month", db: Session = Depends(get_db)):
    seller = get_seller_or_404(db, seller_id)
    product_ids = get_seller_product_ids(db, seller.name)
    if not product_ids:
        return {
            "total_sales": 0, "total_orders": 0, "avg_order_value": 0,
            "return_rate": 0, "by_category": {}, "daily": [],
            "top_products": [], "delivered": 0, "cancelled": 0,
            "conversion_rate": 0, "pending_orders": 0, "processing_orders": 0,
            "total_products": len(product_ids), "low_stock_count": 0,
            "total_customers": 0, "repeat_customers": 0,
        }

    now = datetime.utcnow()
    if period == "week":
        start = now - timedelta(days=7)
        group_format = "%Y-%m-%d"
    elif period == "month":
        start = now - timedelta(days=30)
        group_format = "%Y-%m-%d"
    elif period == "year":
        start = now - timedelta(days=365)
        group_format = "%Y-%m"
    else:
        start = now - timedelta(days=365 * 10)
        group_format = "%Y-%m"

    order_ids = [oid[0] for oid in db.query(OrderItem.order_id).filter(
        OrderItem.product_id.in_(product_ids)
    ).distinct().all()]

    orders = db.query(Order).filter(
        Order.id.in_(order_ids), Order.created_at >= start
    ).all() if order_ids else []

    # Group by date
    daily = {}
    for o in orders:
        if not o.created_at:
            continue
        key = o.created_at.strftime(group_format)
        if key not in daily:
            daily[key] = {"date": key, "orders": 0, "revenue": 0}
        daily[key]["orders"] += 1
        daily[key]["revenue"] += float(o.total_amount or 0)

    total_revenue = sum(float(o.total_amount or 0) for o in orders)
    total_orders = len(orders)
    delivered = len([o for o in orders if o.status == 'delivered'])
    cancelled = len([o for o in orders if o.status == 'cancelled'])
    pending = len([o for o in orders if o.status in ('confirmed', 'pending')])
    processing = len([o for o in orders if o.status == 'processing'])

    # Returns count
    returns_count = db.query(func.count(OrderReturn.id)).filter(
        OrderReturn.seller_id == seller_id
    ).scalar() or 0
    _return_pct: float = float(returns_count) / float(total_orders) * 100.0 if total_orders else 0.0
    return_rate = int(_return_pct * 10) / 10

    # Sales by category
    by_category = {}
    items_in_orders = db.query(
        Product.category, func.sum(OrderItem.total_price)
    ).join(Product, OrderItem.product_id == Product.id).filter(
        OrderItem.order_id.in_([o.id for o in orders]),
        OrderItem.product_id.in_(product_ids)
    ).group_by(Product.category).all() if orders else []
    for cat, total in items_in_orders:
        _cat_val: float = float(total or 0)
        by_category[cat or "other"] = int(_cat_val * 100) / 100

    # Top products
    top_prods = db.query(
        OrderItem.product_name,
        func.sum(OrderItem.total_price).label('sales'),
        func.sum(OrderItem.quantity).label('qty')
    ).filter(
        OrderItem.order_id.in_([o.id for o in orders]),
        OrderItem.product_id.in_(product_ids)
    ).group_by(OrderItem.product_name).order_by(desc('sales')).limit(10).all() if orders else []

    # Customers
    customer_ids = list(set(o.user_id for o in orders if o.user_id))
    repeat_customers = 0
    if customer_ids:
        from collections import Counter
        user_order_counts = Counter(o.user_id for o in orders if o.user_id)
        repeat_customers = sum(1 for c in user_order_counts.values() if c > 1)

    # Low stock
    low_stock = db.query(func.count(Product.id)).filter(
        Product.id.in_(product_ids), Product.stock <= 5
    ).scalar() or 0

    return {
        "total_sales": int(float(total_revenue) * 100) / 100,
        "total_orders": total_orders,
        "avg_order_value": int(float(total_revenue) / float(total_orders) * 100) / 100 if total_orders else 0,
        "return_rate": return_rate,
        "by_category": by_category,
        "daily": sorted(daily.values(), key=lambda x: x["date"]),
        "top_products": [{"name": p[0], "sales": int(float(p[1] or 0) * 100) / 100, "quantity": int(p[2] or 0)} for p in top_prods],
        "delivered": delivered,
        "cancelled": cancelled,
        "pending_orders": pending,
        "processing_orders": processing,
        "conversion_rate": int(float(delivered) / float(total_orders) * 1000) / 10 if total_orders else 0,
        "total_products": len(product_ids),
        "low_stock_count": low_stock,
        "total_customers": len(customer_ids),
        "repeat_customers": repeat_customers,
        "returns_count": returns_count,
    }


@router.get("/reports/products")
def get_products_report(seller_id: int, db: Session = Depends(get_db)):
    seller = get_seller_or_404(db, seller_id)
    product_ids = get_seller_product_ids(db, seller.name)
    if not product_ids:
        return []

    report = db.query(
        OrderItem.product_id, OrderItem.product_name,
        func.sum(OrderItem.quantity).label('total_qty'),
        func.sum(OrderItem.total_price).label('total_revenue'),
        func.count(OrderItem.id).label('order_count')
    ).filter(OrderItem.product_id.in_(product_ids)).group_by(
        OrderItem.product_id, OrderItem.product_name
    ).order_by(desc('total_revenue')).all()

    products = db.query(Product).filter(Product.id.in_(product_ids)).all()
    stock_map = {p.id: p.stock for p in products}

    return [{
        "product_id": r[0], "product_name": r[1],
        "total_quantity": int(r[2]), "total_revenue": float(r[3]),
        "order_count": r[4], "current_stock": stock_map.get(r[0], 0),
    } for r in report]


# ════════════════════════════════════════════════════════════
# SELLER SETTINGS
# ════════════════════════════════════════════════════════════
@router.get("/settings")
def get_seller_settings(seller_id: int, db: Session = Depends(get_db)):
    seller = get_seller_or_404(db, seller_id)
    settings = db.query(SellerSettings).filter(SellerSettings.seller_id == seller_id).first()
    if not settings:
        settings = SellerSettings(seller_id=seller_id, store_name=seller.name)
        db.add(settings)
        db.commit()
        db.refresh(settings)
    return {
        "store_name": settings.store_name,
        "store_description": settings.store_description,
        "store_logo": settings.store_logo,
        "business_phone": settings.business_phone or seller.phone,
        "business_email": settings.business_email or seller.email,
        "business_address": settings.business_address,
        "commission_rate": float(settings.commission_rate or 10),
        "low_stock_threshold": settings.low_stock_threshold,
        "notify_new_order": settings.notify_new_order,
        "notify_order_status": settings.notify_order_status,
        "notify_low_stock": settings.notify_low_stock,
        "notify_reviews": settings.notify_reviews,
        "notify_email": settings.notify_email,
        "notify_sms": settings.notify_sms,
        "auto_confirm_orders": settings.auto_confirm_orders,
        "seller_name": seller.name,
        "seller_email": seller.email,
        "seller_phone": seller.phone,
        "profile_image": seller.profile_image,
        "country": seller.country,
    }


@router.put("/settings")
def update_seller_settings(seller_id: int, data: dict, db: Session = Depends(get_db)):
    settings = db.query(SellerSettings).filter(SellerSettings.seller_id == seller_id).first()
    if not settings:
        settings = SellerSettings(seller_id=seller_id)
        db.add(settings)

    allowed = [
        "store_name", "store_description", "business_phone", "business_email",
        "business_address", "low_stock_threshold", "notify_new_order",
        "notify_order_status", "notify_low_stock", "notify_reviews",
        "notify_email", "notify_sms", "auto_confirm_orders"
    ]
    for key in allowed:
        if key in data:
            setattr(settings, key, data[key])
    # Update country on user model directly
    if "country" in data:
        seller = get_seller_or_404(db, seller_id)
        seller.country = data["country"]
    db.commit()
    return {"status": "success", "message": "تم حفظ الإعدادات"}


@router.put("/settings/profile")
def update_seller_profile(seller_id: int, data: dict, db: Session = Depends(get_db)):
    seller = get_seller_or_404(db, seller_id)
    if "name" in data:
        seller.name = data["name"]
    if "email" in data:
        seller.email = data["email"]
    if "phone" in data:
        seller.phone = data["phone"]
    db.commit()
    return {"status": "success", "message": "تم تحديث الملف الشخصي"}


@router.put("/settings/password")
def change_password(seller_id: int, data: dict, db: Session = Depends(get_db)):
    seller = get_seller_or_404(db, seller_id)
    if seller.password and seller.password != data.get("old_password"):
        raise HTTPException(400, "كلمة المرور الحالية غير صحيحة")
    seller.password = data.get("new_password")
    db.commit()
    return {"status": "success", "message": "تم تغيير كلمة المرور"}


@router.put("/change-password")
def change_seller_password(data: dict, db: Session = Depends(get_db)):
    """Simple password change by seller_id."""
    import bcrypt
    seller = get_seller_or_404(db, data.get("seller_id"))
    new_pw = data.get("password", "")
    if not new_pw or len(new_pw) < 4:
        raise HTTPException(400, "كلمة المرور قصيرة جداً")
    hashed = bcrypt.hashpw(new_pw.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
    seller.password = hashed
    db.commit()
    return {"status": "success", "message": "تم تغيير كلمة المرور بنجاح"}


# ═══════════════════════════════════════════════════════════════
# RETURNS MANAGEMENT
# ═══════════════════════════════════════════════════════════════

@router.get("/returns")
def get_seller_returns(seller_id: int, db: Session = Depends(get_db)):
    """Get all returns for a seller."""
    get_seller_or_404(db, seller_id)
    returns = db.query(OrderReturn).filter(
        OrderReturn.seller_id == seller_id
    ).order_by(desc(OrderReturn.created_at)).all()

    result = []
    for r in returns:
        order = db.query(Order).filter(Order.id == r.order_id).first()
        # Parse items JSON for product names
        product_name = None
        try:
            items = json.loads(r.items) if r.items else []
            if items:
                product_name = items[0].get("product_name", None)
        except Exception:
            pass

        result.append({
            "id": r.id,
            "order_id": r.order_id,
            "order_number": order.order_number if order else f"ORD-{r.order_id}",
            "order_date": order.created_at.isoformat() if order and order.created_at else None,
            "return_number": r.return_number,
            "type": r.type,
            "status": r.status if r.status != "requested" else "pending",
            "reason": r.reason_details or r.reason,
            "product_name": product_name,
            "refund_amount": float(r.refund_amount or 0),
            "created_at": r.created_at.isoformat() if r.created_at else None,
        })
    return result


@router.put("/returns/{return_id}/approve")
def approve_return(return_id: int, seller_id: int, db: Session = Depends(get_db)):
    """Approve a return request."""
    get_seller_or_404(db, seller_id)
    ret = db.query(OrderReturn).filter(
        OrderReturn.id == return_id,
        OrderReturn.seller_id == seller_id
    ).first()
    if not ret:
        raise HTTPException(404, "طلب الإرجاع غير موجود")
    if ret.status not in ("requested", "pending", "pending_approval"):
        raise HTTPException(400, "لا يمكن الموافقة على هذا الطلب")

    ret.status = "approved"
    ret.approved_at = datetime.utcnow()
    db.commit()

    # Notify the customer
    create_notification(
        db, ret.user_id, "return_approved",
        "تمت الموافقة على طلب الإرجاع",
        f"تمت الموافقة على طلب الإرجاع رقم {ret.return_number}",
        related_type="return", related_id=ret.id
    )
    return {"status": "success", "message": "تم قبول الإرجاع"}


@router.put("/returns/{return_id}/reject")
def reject_return(return_id: int, seller_id: int, reason: str = "", db: Session = Depends(get_db)):
    """Reject a return request."""
    get_seller_or_404(db, seller_id)
    ret = db.query(OrderReturn).filter(
        OrderReturn.id == return_id,
        OrderReturn.seller_id == seller_id
    ).first()
    if not ret:
        raise HTTPException(404, "طلب الإرجاع غير موجود")
    if ret.status not in ("requested", "pending", "pending_approval"):
        raise HTTPException(400, "لا يمكن رفض هذا الطلب")

    ret.status = "rejected"
    ret.rejected_at = datetime.utcnow()
    ret.rejection_reason = reason or "تم الرفض من قبل البائع"
    db.commit()

    create_notification(
        db, ret.user_id, "return_rejected",
        "تم رفض طلب الإرجاع",
        f"تم رفض طلب الإرجاع رقم {ret.return_number}",
        related_type="return", related_id=ret.id
    )
    return {"status": "success", "message": "تم رفض الإرجاع"}
