from fastapi import APIRouter, Depends, HTTPException, File, UploadFile, Form
from sqlalchemy.orm import Session
from sqlalchemy import func, desc, extract, case
from typing import List, Dict, Optional
import shutil
import os
import uuid
from datetime import datetime, timedelta
from app.db.session import SessionLocal

from app.models.user import User
from app.models.ecommerce import Product, Order, OrderItem
from app.models.health import SugarReading
from app.models.cms import Banner, Notification, AppSetting
from app.models.activity import ActivityLog, Permission, Appointment
from app.models.seller import SellerLicense
from app.models.membership import UserMembership, MembershipCard

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def log_activity(db, user_id, user_name, action, entity_type, entity_id=None, entity_name=None, details=None):
    """Helper to log admin activities."""
    db.add(ActivityLog(
        user_id=user_id, user_name=user_name, action=action,
        entity_type=entity_type, entity_id=entity_id,
        entity_name=entity_name, details=details
    ))
    db.commit()

# ================================================
# DASHBOARD STATS
# ================================================
@router.get("/stats")
def get_admin_stats(db: Session = Depends(get_db)):
    total_users = db.query(User).count()
    total_products = db.query(Product).count()
    total_orders = db.query(Order).count()
    total_revenue = db.query(func.sum(Order.total_amount)).scalar() or 0
    active_users = db.query(User).filter(User.is_active == True).count()
    pending_orders = db.query(Order).filter(Order.status == 'pending').count()
    completed_orders = db.query(Order).filter(Order.status == 'completed').count()
    sellers = db.query(User).filter(User.role == 'seller').count()
    
    return {
        "total_users": total_users,
        "active_users": active_users,
        "total_products": total_products,
        "total_orders": total_orders,
        "pending_orders": pending_orders,
        "completed_orders": completed_orders,
        "total_revenue": float(total_revenue),
        "sellers": sellers,
        "recent_activity_count": db.query(ActivityLog).count()
    }

@router.get("/recent-orders")
def get_recent_orders(db: Session = Depends(get_db)):
    return db.query(Order).order_by(Order.created_at.desc()).limit(10).all()

# ================================================
# ORDERS - Full Management
# ================================================
@router.get("/orders")
def get_all_orders(status: Optional[str] = None, db: Session = Depends(get_db)):
    q = db.query(Order).order_by(Order.created_at.desc())
    if status and status != 'all':
        q = q.filter(Order.status == status)
    orders = q.all()
    result = []
    for o in orders:
        user = db.query(User).filter(User.id == o.user_id).first()
        items = db.query(OrderItem).filter(OrderItem.order_id == o.id).all()
        
        # Determine service provider
        provider_name = ""
        provider_type = ""
        for item in items:
            if item.item_type == 'product' and item.product_id:
                prod = db.query(Product).filter(Product.id == item.product_id).first()
                if prod and prod.seller:
                    provider_name = prod.seller
                    # Check if seller is a user with a role
                    seller_user = db.query(User).filter(User.name == prod.seller).first()
                    if seller_user:
                        role_map = {'seller': 'بائع', 'doctor': 'طبيب', 'nurse': 'تمريض', 'admin': 'إدارة'}
                        provider_type = role_map.get(seller_user.role, seller_user.role)
                    else:
                        provider_type = "بائع"
                    break
            elif item.item_type == 'service':
                if item.service_type and 'nurse' in (item.service_type or '').lower():
                    provider_type = "تمريض"
                elif item.service_type and 'consult' in (item.service_type or '').lower():
                    provider_type = "طبيب"
                else:
                    provider_type = "خدمة"
                provider_name = item.service_name or item.product_name or ""
                break
        
        if not provider_type and o.order_type:
            type_map = {'market': 'بائع', 'service': 'خدمة', 'consultation': 'طبيب', 'nursing': 'تمريض'}
            provider_type = type_map.get(o.order_type, o.order_type)
        
        result.append({
            "id": o.id,
            "order_number": o.order_number,
            "user_id": o.user_id,
            "user_name": user.name if user else "غير معروف",
            "user_email": user.email if user else "",
            "user_phone": user.phone if user else "",
            "order_type": o.order_type,
            "provider_name": provider_name,
            "provider_type": provider_type,
            "subtotal": float(o.subtotal),
            "discount_amount": float(o.discount_amount or 0),
            "total_amount": float(o.total_amount),
            "currency": o.currency or "EGP",
            "payment_status": o.payment_status,
            "payment_method": o.payment_method,
            "status": o.status,
            "created_at": o.created_at.isoformat() if o.created_at else None,
            "items": [{
                "id": i.id,
                "product_name": i.product_name,
                "quantity": i.quantity,
                "unit_price": float(i.unit_price),
                "total_price": float(i.total_price)
            } for i in items],
            "items_count": len(items)
        })
    return result

@router.get("/orders/{order_id}")
def get_order_detail(order_id: int, db: Session = Depends(get_db)):
    o = db.query(Order).filter(Order.id == order_id).first()
    if not o:
        raise HTTPException(status_code=404, detail="Order not found")
    user = db.query(User).filter(User.id == o.user_id).first()
    items = db.query(OrderItem).filter(OrderItem.order_id == o.id).all()
    return {
        "id": o.id, "order_number": o.order_number,
        "user": {"id": user.id, "name": user.name, "email": user.email, "phone": user.phone} if user else None,
        "order_type": o.order_type, "subtotal": float(o.subtotal),
        "discount_amount": float(o.discount_amount or 0),
        "total_amount": float(o.total_amount), "currency": o.currency or "EGP",
        "payment_status": o.payment_status, "payment_method": o.payment_method,
        "status": o.status,
        "created_at": o.created_at.isoformat() if o.created_at else None,
        "items": [{"id": i.id, "product_name": i.product_name, "quantity": i.quantity,
                   "unit_price": float(i.unit_price), "total_price": float(i.total_price)} for i in items]
    }

@router.put("/orders/{order_id}/status")
def update_order_status(order_id: int, data: dict, db: Session = Depends(get_db)):
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    old_status = order.status
    order.status = data.get("status", order.status)
    if data.get("payment_status"):
        order.payment_status = data["payment_status"]
    log_activity(db, None, "المشرف", "update", "order", order.id, order.order_number,
                 f"تغيير الحالة من {old_status} إلى {order.status}")
    db.commit()
    return {"status": "success", "new_status": order.status}

# ================================================
# USERS - Full Management
# ================================================
@router.get("/users")
def get_all_users(db: Session = Depends(get_db)):
    users = db.query(User).order_by(User.created_at.desc()).all()
    return [{
        "id": u.id, "name": u.name, "email": u.email, "phone": u.phone,
        "role": u.role, "is_active": u.is_active, "country": u.country,
        "login_method": u.login_method, "age": u.age, "weight": u.weight,
        "wallet_balance": u.wallet_balance or 0.0,
        "loyalty_points": u.loyalty_points or 0,
        "admin_display_name": u.admin_display_name,
        "app_display_name": u.app_display_name,
        "seller_department": u.seller_department,
        "seller_address": u.seller_address,
        "created_at": u.created_at.isoformat() if u.created_at else None,
    } for u in users]

@router.post("/users")
def create_user(data: dict, db: Session = Depends(get_db)):
    """Create a new user from admin panel. Supports seller-specific fields."""
    import bcrypt
    existing = db.query(User).filter(User.email == data.get("email")).first()
    if existing:
        raise HTTPException(status_code=400, detail="البريد الإلكتروني مُستخدم بالفعل")
    hashed = bcrypt.hashpw(data.get("password", "User@123").encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
    new_user = User(
        name=data.get("name"), email=data.get("email"),
        phone=data.get("phone", ""), password=hashed,
        role=data.get("role", "user"), country=data.get("country", "eg"),
        is_active=data.get("is_active", True), login_method="email",
        # Seller-specific fields
        admin_display_name=data.get("admin_display_name"),
        app_display_name=data.get("app_display_name"),
        seller_department=data.get("seller_department"),
        seller_address=data.get("seller_address"),
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    log_activity(db, None, "المشرف", "create", "user", new_user.id, new_user.name, "إضافة مستخدم جديد")
    return {"status": "success", "id": new_user.id}

@router.get("/users/{user_id}")
def get_user_detail(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    result = {
        "id": user.id, "name": user.name, "email": user.email, "phone": user.phone,
        "role": user.role, "is_active": user.is_active, "country": user.country,
        "age": user.age, "weight": user.weight, "login_method": user.login_method,
        "created_at": user.created_at.isoformat() if user.created_at else None,
        # Seller-specific
        "admin_display_name": user.admin_display_name,
        "app_display_name": user.app_display_name,
        "seller_department": user.seller_department,
        "seller_address": user.seller_address,
    }
    # Include licenses if seller
    if user.role == 'seller':
        licenses = db.query(SellerLicense).filter(SellerLicense.seller_id == user.id).all()
        result["licenses"] = [{
            "id": lic.id, "file_name": lic.file_name, "file_url": lic.file_url,
            "file_type": lic.file_type, "license_type": lic.license_type,
            "license_number": lic.license_number, "status": lic.status,
            "expiry_date": lic.expiry_date.isoformat() if lic.expiry_date else None,
            "notes": lic.notes,
            "created_at": lic.created_at.isoformat() if lic.created_at else None,
        } for lic in licenses]
    return result

@router.put("/users/{user_id}")
def update_user(user_id: int, data: dict, db: Session = Depends(get_db)):
    """Update user details including seller-specific fields."""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    for field in ['name', 'email', 'phone', 'role', 'country', 'age', 'weight',
                  'admin_display_name', 'app_display_name', 'seller_department', 'seller_address',
                  'wallet_balance', 'loyalty_points']:
        if field in data and data[field] is not None:
            setattr(user, field, data[field])
    log_activity(db, None, "المشرف", "update", "user", user.id, user.name, "تعديل بيانات المستخدم")
    db.commit()
    return {"status": "success"}

@router.put("/users/{user_id}/password")
def change_user_password(user_id: int, data: dict, db: Session = Depends(get_db)):
    import bcrypt
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    hashed = bcrypt.hashpw(data.get("password", "").encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
    user.password = hashed
    log_activity(db, None, "المشرف", "update", "user", user.id, user.name, "تغيير كلمة المرور")
    db.commit()
    return {"status": "success"}

@router.put("/users/{user_id}/toggle-active")
def toggle_user_active(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    user.is_active = not user.is_active
    log_activity(db, None, "المشرف", "update", "user", user.id, user.name,
                 f"تفعيل/تعطيل المستخدم: {'نشط' if user.is_active else 'معطل'}")
    db.commit()
    return {"status": "success", "is_active": user.is_active}

@router.put("/users/{user_id}/role")
def update_user_role(user_id: int, data: dict, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    old_role = user.role
    user.role = data.get("role", user.role)
    log_activity(db, None, "المشرف", "update", "user", user.id, user.name,
                 f"تغيير الدور من {old_role} إلى {user.role}")
    db.commit()
    return {"status": "success", "role": user.role}

@router.delete("/users/{user_id}")
def delete_user(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    log_activity(db, None, "المشرف", "delete", "user", user.id, user.name, "حذف المستخدم")
    db.delete(user)
    db.commit()
    return {"status": "deleted"}

@router.put("/users/{user_id}/balance")
def update_user_balance(user_id: int, data: dict, db: Session = Depends(get_db)):
    """Update wallet balance and/or loyalty points for a user."""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    if "wallet_balance" in data:
        user.wallet_balance = float(data["wallet_balance"])
    if "loyalty_points" in data:
        user.loyalty_points = int(data["loyalty_points"])
    log_activity(db, None, "المشرف", "update", "user", user.id, user.name,
                 f"تحديث الرصيد: محفظة={user.wallet_balance}, نقاط={user.loyalty_points}")
    db.commit()
    return {
        "status": "success",
        "wallet_balance": user.wallet_balance,
        "loyalty_points": user.loyalty_points
    }

# ================================================
# PRODUCTS
# ================================================
@router.get("/products")
def get_all_products(db: Session = Depends(get_db)):
    return db.query(Product).all()

@router.delete("/products/{product_id}")
def delete_product(product_id: int, db: Session = Depends(get_db)):
    product = db.query(Product).filter(Product.id == product_id).first()
    if product:
        log_activity(db, None, "المشرف", "delete", "product", product.id, product.title, "حذف منتج")
        db.delete(product)
        db.commit()
    return {"status": "deleted"}

@router.put("/products/{product_id}")
def update_product(product_id: int, data: dict, db: Session = Depends(get_db)):
    """Update product details: category, sub_category, title, price, stock, brand, sku, dates, etc."""
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    for field in ['title', 'details', 'price', 'stock', 'category', 'sub_category', 'offer_price', 'seller', 'status', 'brand', 'sku', 'offer_start_date', 'offer_end_date']:
        if field in data and data[field] is not None:
            setattr(product, field, data[field])
    log_activity(db, None, "المشرف", "update", "product", product.id, product.title, "تعديل بيانات المنتج")
    db.commit()
    db.refresh(product)
    return {"status": "success", "id": product.id}

@router.post("/products")
def add_product(
    title: str = Form(...),
    details: str = Form(...),
    price: float = Form(...),
    stock: int = Form(...),
    category: str = Form(...),
    sub_category: Optional[str] = Form(None),
    brand: str = Form(...),
    sku: str = Form(...),
    offer_start_date: Optional[str] = Form(None),
    offer_end_date: Optional[str] = Form(None),
    image: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db)
):
    img_url = None
    if image:
        file_ext = os.path.splitext(image.filename)[1]
        file_name = f"{uuid.uuid4()}{file_ext}"
        os.makedirs("media/products", exist_ok=True)
        file_path = os.path.join("media/products", file_name)
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(image.file, buffer)
        img_url = f"/media/products/{file_name}"

    db_product = Product(
        title=title, details=details, price=price, stock=stock,
        category=category, sub_category=sub_category or "", img_url=img_url, seller="Admin",
        brand=brand, sku=sku,
        offer_start_date=offer_start_date if offer_start_date else None,
        offer_end_date=offer_end_date if offer_end_date else None
    )
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    log_activity(db, None, "المشرف", "create", "product", db_product.id, title, "إضافة منتج جديد")
    return db_product

# ================================================
# CMS - BANNERS
# ================================================
@router.get("/cms/banners")
def get_banners(db: Session = Depends(get_db)):
    return db.query(Banner).order_by(Banner.sort_order.asc()).all()

@router.post("/cms/banners")
def add_banner(
    link: str = Form(""),
    title: str = Form(""),
    target_type: str = Form("internal"),
    image: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    file_ext = os.path.splitext(image.filename)[1]
    file_name = f"banner_{uuid.uuid4()}{file_ext}"
    os.makedirs("media/cms", exist_ok=True)
    file_path = os.path.join("media/cms", file_name)
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(image.file, buffer)
    db_banner = Banner(
        image_url=f"/media/cms/{file_name}", link=link, title=title,
        target_type=target_type, active=True
    )
    db.add(db_banner)
    db.commit()
    db.refresh(db_banner)
    return db_banner

@router.put("/cms/banners/{banner_id}/toggle")
def toggle_banner(banner_id: int, db: Session = Depends(get_db)):
    banner = db.query(Banner).filter(Banner.id == banner_id).first()
    if not banner:
        raise HTTPException(status_code=404, detail="Banner not found")
    banner.active = not banner.active
    db.commit()
    return {"status": "success", "active": banner.active}

@router.delete("/cms/banners/{banner_id}")
def delete_banner(banner_id: int, db: Session = Depends(get_db)):
    banner = db.query(Banner).filter(Banner.id == banner_id).first()
    if not banner:
        raise HTTPException(status_code=404, detail="Banner not found")
    db.delete(banner)
    db.commit()
    return {"status": "deleted"}

# ================================================
# CMS - NOTIFICATIONS
# ================================================
@router.get("/cms/notifications")
def get_notifications(db: Session = Depends(get_db)):
    return db.query(Notification).order_by(Notification.created_at.desc()).all()

@router.post("/cms/notifications")
def add_notification(
    title: str = Form(...), details: str = Form(...),
    type: str = Form("general"), target: str = Form("all"),
    db: Session = Depends(get_db)
):
    db_notify = Notification(title=title, details=details, type=type, target=target, active=True)
    db.add(db_notify)
    db.commit()
    db.refresh(db_notify)
    log_activity(db, None, "المشرف", "create", "notification", db_notify.id, title, "إرسال إشعار")
    return db_notify

@router.put("/cms/notifications/{notif_id}/toggle")
def toggle_notification(notif_id: int, db: Session = Depends(get_db)):
    notif = db.query(Notification).filter(Notification.id == notif_id).first()
    if not notif:
        raise HTTPException(status_code=404, detail="Notification not found")
    notif.active = not notif.active
    db.commit()
    return {"status": "success", "active": notif.active}

@router.delete("/cms/notifications/{notif_id}")
def delete_notification(notif_id: int, db: Session = Depends(get_db)):
    notif = db.query(Notification).filter(Notification.id == notif_id).first()
    if not notif:
        raise HTTPException(status_code=404, detail="Notification not found")
    db.delete(notif)
    db.commit()
    return {"status": "deleted"}

# ================================================
# APP SETTINGS
# ================================================
@router.get("/settings")
def get_settings(db: Session = Depends(get_db)):
    settings = db.query(AppSetting).all()
    result = {}
    for s in settings:
        grp = s.setting_group or "general"
        if grp not in result:
            result[grp] = []
        result[grp].append({
            "id": s.id, "key": s.key, "value": s.value,
            "label": s.label, "group": grp, "type": s.type,
        })
    return result

@router.put("/settings")
def update_settings(updates: dict, db: Session = Depends(get_db)):
    for key, value in updates.items():
        setting = db.query(AppSetting).filter(AppSetting.key == key).first()
        if setting:
            setting.value = str(value)
        else:
            db.add(AppSetting(key=key, value=str(value), label=key))
    db.commit()
    log_activity(db, None, "المشرف", "update", "setting", None, None, f"تحديث {len(updates)} إعدادات")
    return {"status": "success", "updated": len(updates)}

@router.get("/settings/{key}")
def get_setting(key: str, db: Session = Depends(get_db)):
    setting = db.query(AppSetting).filter(AppSetting.key == key).first()
    if not setting:
        raise HTTPException(status_code=404, detail="Setting not found")
    return {"key": setting.key, "value": setting.value}

# ================================================
# ACTIVITY LOG
# ================================================
@router.get("/activity-log")
def get_activity_log(limit: int = 50, db: Session = Depends(get_db)):
    return db.query(ActivityLog).order_by(ActivityLog.created_at.desc()).limit(limit).all()

# ================================================
# PERMISSIONS / ROLES
# ================================================
@router.get("/permissions")
def get_permissions(db: Session = Depends(get_db)):
    perms = db.query(Permission).all()
    result = {}
    for p in perms:
        if p.role not in result:
            result[p.role] = {}
        result[p.role][p.module] = {
            "can_view": p.can_view, "can_create": p.can_create,
            "can_edit": p.can_edit, "can_delete": p.can_delete,
            "can_approve": p.can_approve
        }
    return result

@router.put("/permissions")
def update_permissions(data: dict, db: Session = Depends(get_db)):
    """Update permissions. Expects { role: { module: { can_view: bool, ... } } }"""
    for role, modules in data.items():
        for module, perms in modules.items():
            perm = db.query(Permission).filter(Permission.role == role, Permission.module == module).first()
            if perm:
                perm.can_view = perms.get("can_view", perm.can_view)
                perm.can_create = perms.get("can_create", perm.can_create)
                perm.can_edit = perms.get("can_edit", perm.can_edit)
                perm.can_delete = perms.get("can_delete", perm.can_delete)
                perm.can_approve = perms.get("can_approve", perm.can_approve)
            else:
                db.add(Permission(role=role, module=module, **perms))
    db.commit()
    log_activity(db, None, "المشرف", "update", "permission", None, None, "تحديث الصلاحيات")
    return {"status": "success"}

# ================================================
# REPORTS
# ================================================
@router.get("/reports/summary")
def get_reports_summary(db: Session = Depends(get_db)):
    """Comprehensive system reports."""
    total_users = db.query(User).count()
    active_users = db.query(User).filter(User.is_active == True).count()
    users_by_role = db.query(User.role, func.count(User.id)).group_by(User.role).all()
    
    total_orders = db.query(Order).count()
    total_revenue = float(db.query(func.sum(Order.total_amount)).scalar() or 0)
    avg_order_value = float(db.query(func.avg(Order.total_amount)).scalar() or 0)
    orders_by_status = db.query(Order.status, func.count(Order.id)).group_by(Order.status).all()
    orders_by_type = db.query(Order.order_type, func.count(Order.id)).group_by(Order.order_type).all()
    orders_by_payment = db.query(Order.payment_method, func.count(Order.id)).group_by(Order.payment_method).all()
    
    total_products = db.query(Product).count()
    products_by_category = db.query(Product.category, func.count(Product.id)).group_by(Product.category).all()
    low_stock = db.query(Product).filter(Product.stock < 10).count()
    out_of_stock = db.query(Product).filter(Product.stock == 0).count()
    total_stock_value = float(db.query(func.sum(Product.price * Product.stock)).scalar() or 0)
    
    top_products = db.query(
        OrderItem.product_name, func.sum(OrderItem.quantity).label('qty'),
        func.sum(OrderItem.total_price).label('revenue')
    ).group_by(OrderItem.product_name).order_by(desc('revenue')).limit(10).all()
    
    sugar_readings = db.query(SugarReading).count()
    
    return {
        "users": {
            "total": total_users,
            "active": active_users,
            "inactive": total_users - active_users,
            "by_role": {r: c for r, c in users_by_role}
        },
        "orders": {
            "total": total_orders,
            "total_revenue": total_revenue,
            "avg_order_value": round(avg_order_value, 2),
            "by_status": {s: c for s, c in orders_by_status},
            "by_type": {t: c for t, c in orders_by_type},
            "by_payment": {p: c for p, c in orders_by_payment}
        },
        "products": {
            "total": total_products,
            "by_category": {c: n for c, n in products_by_category},
            "low_stock": low_stock,
            "out_of_stock": out_of_stock,
            "total_stock_value": total_stock_value
        },
        "top_products": [{"name": n, "qty": int(q), "revenue": float(r)} for n, q, r in top_products],
        "health": {
            "sugar_readings": sugar_readings
        },
        "currency": "EGP"
    }

@router.get("/reports/orders-timeline")
def get_orders_timeline(db: Session = Depends(get_db)):
    """Order stats over time for charts."""
    orders = db.query(Order).order_by(Order.created_at.asc()).all()
    timeline = {}
    for o in orders:
        if o.created_at:
            key = o.created_at.strftime("%Y-%m")
            if key not in timeline:
                timeline[key] = {"count": 0, "revenue": 0}
            timeline[key]["count"] += 1
            timeline[key]["revenue"] += float(o.total_amount)
    return [{"month": k, **v} for k, v in timeline.items()]
    
    
# ================================================
# CONSULTATION PACKAGES REQUESTS
# ================================================
@router.get("/package-requests")
def get_package_requests(db: Session = Depends(get_db)):
    from app.models.membership import UserPackageOrder
    from app.models.user import User
    orders = db.query(UserPackageOrder).order_by(UserPackageOrder.created_at.desc()).all()
    result = []
    for o in orders:
        user = db.query(User).filter(User.id == o.user_id).first()
        result.append({
            "id": o.id,
            "user_id": o.user_id,
            "user_name": user.name if user else "غير معروف",
            "package_id": o.package_id,
            "package_name": o.package_name,
            "amount": o.amount,
            "currency": o.currency,
            "period": o.period,
            "status": o.status,
            "start_date": o.start_date,
            "end_date": o.end_date,
            "created_at": o.created_at.isoformat() if o.created_at else None
        })
    return result

@router.put("/package-requests/{order_id}/status")
def update_package_request_status(order_id: int, data: dict, db: Session = Depends(get_db)):
    from app.models.membership import UserPackageOrder
    order = db.query(UserPackageOrder).filter(UserPackageOrder.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    new_status = data.get("status", order.status)
    order.status = new_status
    
    user = db.query(User).filter(User.id == order.user_id).first()
    user_name = user.name if user else "المستخدم"
    
    # Send notification to user
    if new_status == "approved":
        # Set dates: start from today, end based on period
        today = datetime.now().strftime("%Y-%m-%d")
        order.start_date = today
        
        # Calculate end_date from period
        period = order.period or ""
        if "سنة" in period or "سنوي" in period or "year" in period.lower():
            end = datetime.now() + timedelta(days=365)
        elif "6" in period or "نصف" in period:
            end = datetime.now() + timedelta(days=180)
        elif "3" in period or "ثلاث" in period:
            end = datetime.now() + timedelta(days=90)
        else:
            end = datetime.now() + timedelta(days=30)
        order.end_date = end.strftime("%Y-%m-%d")
        
        # Send approval notification
        notif = Notification(
            title=f"✅ تم الموافقة على طلب باقة {order.package_name}",
            details=f"مرحباً {user_name}، تم الموافقة على طلبك لباقة {order.package_name}. الباقة مفعلة من {order.start_date} حتى {order.end_date}. يرجى إكمال عملية الدفع لتفعيل الباقة.",
            type="membership",
            target=f"user_{order.user_id}"
        )
        db.add(notif)
        
        # Log activity
        log_activity(db, None, "المشرف", "update", "package_order", order.id, 
                     f"موافقة على باقة {order.package_name} للعضو {user_name}", "تم الموافقة")
        
    elif new_status == "rejected":
        # Send rejection notification
        notif = Notification(
            title=f"❌ تم رفض طلب باقة {order.package_name}",
            details=f"عذراً {user_name}، تم رفض طلبك لباقة {order.package_name}. يمكنك التواصل مع الدعم لمزيد من التفاصيل.",
            type="membership",
            target=f"user_{order.user_id}"
        )
        db.add(notif)
        
        log_activity(db, None, "المشرف", "update", "package_order", order.id,
                     f"رفض باقة {order.package_name} للعضو {user_name}", "تم الرفض")
    
    db.commit()
    return {"status": "success", "message": f"تم {'الموافقة على' if new_status == 'approved' else 'رفض'} الطلب وإرسال إشعار للمستخدم"}


# ════════════════════════════════════════════════════════════
# SELLER LICENSES / ATTACHMENTS
# ════════════════════════════════════════════════════════════

@router.post("/users/{user_id}/licenses")
def upload_seller_license(
    user_id: int,
    license_type: str = Form("other"),
    license_number: str = Form(None),
    expiry_date: str = Form(None),
    notes: str = Form(None),
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    """Upload a license/attachment for a seller."""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Save file
    upload_dir = os.path.join(os.getcwd(), "uploads", "licenses")
    os.makedirs(upload_dir, exist_ok=True)
    ext = os.path.splitext(file.filename)[1] if file.filename else ".pdf"
    unique_name = f"{uuid.uuid4().hex}{ext}"
    file_path = os.path.join(upload_dir, unique_name)
    with open(file_path, "wb") as f:
        shutil.copyfileobj(file.file, f)

    file_url = f"/uploads/licenses/{unique_name}"
    file_type = ext.replace(".", "").lower()
    file_size = os.path.getsize(file_path)

    license_obj = SellerLicense(
        seller_id=user_id,
        file_name=file.filename or unique_name,
        file_url=file_url,
        file_type=file_type,
        file_size=file_size,
        license_type=license_type,
        license_number=license_number,
        expiry_date=datetime.strptime(expiry_date, "%Y-%m-%d") if expiry_date else None,
        notes=notes,
        status="pending"
    )
    db.add(license_obj)
    db.commit()
    db.refresh(license_obj)
    log_activity(db, None, "المشرف", "create", "license", license_obj.id, file.filename, f"رفع ترخيص للبائع {user.name}")
    return {"status": "success", "id": license_obj.id, "file_url": file_url}


@router.get("/users/{user_id}/licenses")
def get_seller_licenses(user_id: int, db: Session = Depends(get_db)):
    """Get all licenses for a seller."""
    licenses = db.query(SellerLicense).filter(SellerLicense.seller_id == user_id).order_by(desc(SellerLicense.created_at)).all()
    return [{
        "id": lic.id, "file_name": lic.file_name, "file_url": lic.file_url,
        "file_type": lic.file_type, "file_size": lic.file_size,
        "license_type": lic.license_type, "license_number": lic.license_number,
        "status": lic.status, "notes": lic.notes,
        "expiry_date": lic.expiry_date.isoformat() if lic.expiry_date else None,
        "created_at": lic.created_at.isoformat() if lic.created_at else None,
    } for lic in licenses]


@router.put("/users/{user_id}/licenses/{license_id}")
def update_seller_license(user_id: int, license_id: int, data: dict, db: Session = Depends(get_db)):
    """Update license status or details."""
    lic = db.query(SellerLicense).filter(SellerLicense.id == license_id, SellerLicense.seller_id == user_id).first()
    if not lic:
        raise HTTPException(status_code=404, detail="License not found")
    for field in ['status', 'license_type', 'license_number', 'notes']:
        if field in data and data[field] is not None:
            setattr(lic, field, data[field])
    if 'expiry_date' in data and data['expiry_date']:
        lic.expiry_date = datetime.strptime(data['expiry_date'], "%Y-%m-%d")
    db.commit()
    return {"status": "success"}


@router.delete("/users/{user_id}/licenses/{license_id}")
def delete_seller_license(user_id: int, license_id: int, db: Session = Depends(get_db)):
    """Delete a license file and record."""
    lic = db.query(SellerLicense).filter(SellerLicense.id == license_id, SellerLicense.seller_id == user_id).first()
    if not lic:
        raise HTTPException(status_code=404, detail="License not found")
    # Delete physical file
    file_path = os.path.join(os.getcwd(), lic.file_url.lstrip("/"))
    if os.path.exists(file_path):
        os.remove(file_path)
    db.delete(lic)
    db.commit()
    return {"status": "success"}


# ════════════════════════════════════════════════════════════
# MEMBERSHIP SUBSCRIBERS
# ════════════════════════════════════════════════════════════
@router.get("/memberships/subscribers")
def get_membership_subscribers(card_type: str = None, db: Session = Depends(get_db)):
    """Get all membership subscribers, optionally filtered by card_type."""
    query = db.query(UserMembership, User).join(User, User.id == UserMembership.user_id)
    if card_type:
        query = query.filter(UserMembership.card_type == card_type)
    query = query.order_by(UserMembership.created_at.desc())
    results = query.all()
    return [{
        "id": m.id,
        "user_id": m.user_id,
        "user_name": u.name,
        "user_email": u.email,
        "user_phone": u.phone,
        "card_type": m.card_type,
        "start_date": m.start_date,
        "end_date": m.end_date,
        "amount_paid": m.amount_paid,
        "currency": m.currency,
        "payment_method": m.payment_method,
        "status": m.status,
        "created_at": m.created_at.isoformat() if m.created_at else None,
    } for m, u in results]


@router.get("/memberships/subscribers/stats")
def get_membership_stats(db: Session = Depends(get_db)):
    """Get membership subscription statistics."""
    total = db.query(UserMembership).count()
    active = db.query(UserMembership).filter(UserMembership.status == "active").count()
    by_type = db.query(
        UserMembership.card_type, func.count(UserMembership.id)
    ).group_by(UserMembership.card_type).all()
    total_revenue = float(db.query(func.sum(UserMembership.amount_paid)).scalar() or 0)
    return {
        "total_subscribers": total,
        "active_subscribers": active,
        "by_type": {t: c for t, c in by_type},
        "total_revenue": total_revenue,
    }
