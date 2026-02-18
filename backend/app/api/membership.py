"""Membership, Social Links, Blog/Courses, Book Links, Medical Profile APIs."""
import json
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import text
from app.db.session import get_db
from app.models.membership import (
    MembershipCard, UserMembership, SocialLink, BlogCourse,
    BookLink, MedicalProfile, ConsultationPackage, UserFavorite
)

router = APIRouter(prefix="/membership", tags=["membership"])


# ====================
# SEED DATA ON STARTUP
# ====================
def seed_membership_data(db: Session):
    """Seed initial data from the old app into the new tables."""
    
    # --- Membership Cards ---
    if db.query(MembershipCard).count() == 0:
        cards = [
            MembershipCard(
                card_type="silver", name_ar="البطاقة الفضية", name_en="Silver Card",
                price_eg=1470, price_sa=115, price_ae=110, price_om=11, price_other=30,
                discount_percent=5, icon="⭐", sort_order=1,
                features_ar=json.dumps([
                    "خصم 5% على الخدمات المدفوعة",
                    "اشتراك مجاني في كورس السكري",
                    "تنبيهات ومتابعة دورية",
                    "نقاط تحفيزية على كل عملية شراء"
                ], ensure_ascii=False),
                features_en=json.dumps([
                    "5% discount on paid services",
                    "Free diabetes course subscription",
                    "Periodic alerts and follow-ups",
                    "Reward points on every purchase"
                ])
            ),
            MembershipCard(
                card_type="gold", name_ar="البطاقة الذهبية", name_en="Gold Card",
                price_eg=2450, price_sa=189, price_ae=184, price_om=19, price_other=50,
                discount_percent=10, icon="👑", sort_order=2,
                features_ar=json.dumps([
                    "خصم 10% على الخدمات المدفوعة",
                    "اشتراك مجاني بجميع الكورسات المدفوعة",
                    "نسخة مجانية من الدليل الشامل لمرضى السكري",
                    "نقاط تحفيزية على كل عملية شراء أو دعوة"
                ], ensure_ascii=False),
                features_en=json.dumps([
                    "10% discount on paid services",
                    "Free access to all paid courses",
                    "Free copy of Diabetes Comprehensive Guide",
                    "Reward points on every purchase or referral"
                ])
            ),
            MembershipCard(
                card_type="platinum", name_ar="البطاقة البلاتينية", name_en="Platinum Card",
                price_eg=4900, price_sa=349, price_ae=340, price_om=35, price_other=90,
                discount_percent=15, icon="💎", sort_order=3,
                features_ar=json.dumps([
                    "خصم 15% على جميع الخدمات",
                    "جميع مزايا البطاقة الذهبية",
                    "استشارة طبية شهرية مجانية",
                    "أولوية في حجز المواعيد",
                    "دعم فني مخصص 24/7"
                ], ensure_ascii=False),
                features_en=json.dumps([
                    "15% discount on all services",
                    "All Gold Card benefits",
                    "Free monthly medical consultation",
                    "Priority appointment booking",
                    "Dedicated 24/7 support"
                ])
            ),
        ]
        db.add_all(cards)

    # --- Social Links ---
    if db.query(SocialLink).count() == 0:
        links = [
            SocialLink(platform="facebook", name_ar="فيسبوك", name_en="Facebook",
                       url="https://www.facebook.com/share/1AgTgtA3HT/",
                       icon="📘", color="from-blue-600 to-blue-800", sort_order=1),
            SocialLink(platform="tiktok", name_ar="تيك توك", name_en="TikTok",
                       url="https://www.tiktok.com/@diabetes.association?_t=ZS-8wKcU9b9teJ&_r=1",
                       icon="🎵", color="from-gray-800 to-black", sort_order=2),
            SocialLink(platform="youtube", name_ar="يوتيوب", name_en="YouTube",
                       url="https://youtube.com/@diabetes.association?si=zkByS6yV9g5UST6L",
                       icon="📺", color="from-red-500 to-red-700", sort_order=3),
            SocialLink(platform="instagram", name_ar="إنستاجرام", name_en="Instagram",
                       url="https://www.instagram.com/diabetes.association?igsh=MXRuc3prYzF6YXVhYw==",
                       icon="📷", color="from-pink-500 to-orange-400", sort_order=4),
            SocialLink(platform="snapchat", name_ar="سناب شات", name_en="Snapchat",
                       url="https://www.snapchat.com/add/diabetes.care?share_id=djbd5DKCDEs&locale=en-US",
                       icon="👻", color="from-yellow-300 to-yellow-500", sort_order=5),
            SocialLink(platform="whatsapp", name_ar="واتساب الدعم", name_en="Support WhatsApp",
                       url="https://wa.me/201012345678",
                       icon="💬", color="from-emerald-500 to-green-600", sort_order=6),
        ]
        db.add_all(links)

    # --- Blog Courses (Udemy) ---
    if db.query(BlogCourse).count() == 0:
        courses = [
            BlogCourse(
                title_ar="الكورس التثقيفي لمرضى السكري", title_en="Diabetes Education Course",
                description_ar="تعلم كيفية إدارة السكري بشكل صحيح وآمن",
                description_en="Learn how to manage diabetes safely",
                url="https://www.udemy.com/course/jnihfygs/?referralCode=476E1EE82187F2E00EEF",
                icon="🎯", platform="udemy", sort_order=1
            ),
            BlogCourse(
                title_ar="الكورس الاحترافي في إدارة الوزن", title_en="Professional Weight Management",
                description_ar="استراتيجيات متقدمة للتحكم في الوزن",
                description_en="Advanced strategies for weight control",
                url="https://www.udemy.com/course/nnfltkmz/?referralCode=2E4181B9FFC242803EAA",
                icon="⚖️", platform="udemy", sort_order=2
            ),
            BlogCourse(
                title_ar="دبلوم التغذية الرياضية", title_en="Sports Nutrition Diploma",
                description_ar="التغذية المثلى للرياضيين ومرضى السكري",
                description_en="Optimal nutrition for athletes and diabetics",
                url="https://www.udemy.com/course/sports-nutrition-diploma/?referralCode=90261B91A42EFA1C92EC",
                icon="🏃", platform="udemy", sort_order=3
            ),
        ]
        db.add_all(courses)

    # --- Book Links ---
    if db.query(BookLink).count() == 0:
        books = [
            BookLink(
                book_title_ar="الدليل الشامل لمرضى السكري", book_title_en="Diabetes Comprehensive Guide",
                country_code="EG", country_name_ar="مصر", country_name_en="Egypt",
                flag_emoji="🇪🇬", sort_order=1,
                url="https://www.noon.com/en-eg/the-full-guide-of-diabetic/ZA91BBE2697E918F3CB87Z/p?utm_source=C1000094L&utm_medium=referral&sId=27e75884-9056-4fb8-8aef-b38b326cbeb2"
            ),
            BookLink(
                book_title_ar="الدليل الشامل لمرضى السكري", book_title_en="Diabetes Comprehensive Guide",
                country_code="SA", country_name_ar="السعودية", country_name_en="Saudi Arabia",
                flag_emoji="🇸🇦", sort_order=2,
                url="https://www.noon.com/en-sa/the-comprehensive-guide-for-diabetics-part-one-written-by-muhammad-al-nakrashi/Z7D1C1BAFFA88E53EE538Z/p?utm_source=C1000094L&utm_medium=referral&sId=6cc41ea8-7f88-48b2-b22e-b46df86deaad"
            ),
            BookLink(
                book_title_ar="الدليل الشامل لمرضى السكري", book_title_en="Diabetes Comprehensive Guide",
                country_code="AE", country_name_ar="الإمارات", country_name_en="UAE",
                flag_emoji="🇦🇪", sort_order=3,
                url="https://www.noon.com/en-ae/the-comprehensive-guide-for-diabetics-part-one-by-muhammad-al-nakrashi/Z6FA759FA31F83B3D99E4Z/p?utm_source=C1000094L&utm_medium=referral&sId=33c32f7d-d1b1-47b2-960d-5017d1b911db"
            ),
            BookLink(
                book_title_ar="الدليل الشامل لمرضى السكري", book_title_en="Diabetes Comprehensive Guide",
                country_code="JARIR", country_name_ar="مكتبات جرير", country_name_en="Jarir Bookstores",
                flag_emoji="📚", sort_order=4,
                url="https://www.jarir.com/default-category/arabic-books-643167.html"
            ),
        ]
        db.add_all(books)

    # --- Consultation Packages ---
    if db.query(ConsultationPackage).count() == 0:
        packages = [
            ConsultationPackage(
                name_ar="استشارة طبية", name_en="Medical Consultation",
                description_ar="استشارة مع الدكتور محمد النقراشي",
                description_en="Consultation with Dr. Mohamed El-Nakrashi",
                price_eg=490, price_sa=39, price_ae=37, price_om=4, price_other=10,
                duration="جلسة واحدة", icon="🩺", is_giftable=False, sort_order=1,
                features_ar=json.dumps(["جلسة خاصة", "تحديد متطلبات البرنامج", "مراجعة النظام العلاجي"], ensure_ascii=False),
                features_en=json.dumps(["Private session", "Program requirements", "Treatment review"])
            ),
            ConsultationPackage(
                name_ar="نظام غذائي مخصص", name_en="Custom Diet Plan",
                description_ar="نظام غذائي مخصص حسب حالتك",
                description_en="Customized diet plan for your condition",
                price_eg=1470, price_sa=115, price_ae=110, price_om=11, price_other=30,
                duration="شهر واحد", icon="🥗", is_giftable=True, sort_order=2,
                features_ar=json.dumps(["جلسة خاصة", "تحديد متطلبات البرنامج", "مراجعة النظام الغذائي والرياضي"], ensure_ascii=False),
                features_en=json.dumps(["Private session", "Program requirements", "Diet & sports review"])
            ),
            ConsultationPackage(
                name_ar="باقة المتابعة الأساسية", name_en="Basic Follow-up Package",
                description_ar="متابعة دورية أساسية",
                description_en="Basic periodic follow-up",
                price_eg=1960, price_sa=150, price_ae=147, price_om=15, price_other=40,
                duration="شهر واحد", icon="📋", is_giftable=True, sort_order=3,
                features_ar=json.dumps(["جلسة خاصة", "تحديد متطلبات البرنامج", "مراجعة النظام العلاجي", "مراجعة النظام الغذائي والرياضي"], ensure_ascii=False),
                features_en=json.dumps(["Private session", "Program requirements", "Treatment review", "Diet & sports review"])
            ),
            ConsultationPackage(
                name_ar="باقة المتابعة الشاملة", name_en="Comprehensive Follow-up",
                description_ar="رعاية ومتابعة دورية لمدة 3 شهور",
                description_en="Care and follow-up for 3 months",
                price_eg=3920, price_sa=300, price_ae=294, price_om=30, price_other=80,
                duration="3 شهور", icon="🏥", is_giftable=True, sort_order=4,
                features_ar=json.dumps([
                    "جلسة خاصة", "تحديد متطلبات البرنامج", "مراجعة النظام العلاجي",
                    "مراجعة النظام الغذائي والرياضي", "رعاية ومتابعة دورية لمدة 3 شهور",
                    "برامج متخصصة وشاملة لجميع الجوانب"
                ], ensure_ascii=False),
                features_en=json.dumps([
                    "Private session", "Program requirements", "Treatment review",
                    "Diet & sports review", "3-month periodic care",
                    "Comprehensive specialized programs"
                ])
            ),
            ConsultationPackage(
                name_ar="باقة الاشتراك السنوي", name_en="Annual Subscription",
                description_ar="اشتراك سنوي شامل",
                description_en="Comprehensive annual subscription",
                price_eg=9700, price_sa=745, price_ae=727, price_om=75, price_other=198,
                duration="سنة كاملة", icon="🌟", is_giftable=True, sort_order=5,
                features_ar=json.dumps([
                    "جلسات خاصة", "برامج متابعة شاملة",
                    "مراجعة دورية على مدار العام"
                ], ensure_ascii=False),
                features_en=json.dumps([
                    "Private sessions", "Comprehensive follow-up programs",
                    "Year-round periodic reviews"
                ])
            ),
        ]
        db.add_all(packages)

    db.commit()


# ====================
# API ENDPOINTS
# ====================

# --- Membership Cards ---
@router.get("/cards")
def get_membership_cards(db: Session = Depends(get_db)):
    """Get all active membership cards."""
    cards = db.query(MembershipCard).filter(MembershipCard.active == True).order_by(MembershipCard.sort_order).all()
    result = []
    for c in cards:
        result.append({
            "id": c.id,
            "card_type": c.card_type,
            "name_ar": c.name_ar,
            "name_en": c.name_en,
            "prices": {"EG": c.price_eg, "SA": c.price_sa, "AE": c.price_ae, "OM": c.price_om, "OTHER": c.price_other},
            "discount_percent": c.discount_percent,
            "features_ar": json.loads(c.features_ar) if c.features_ar else [],
            "features_en": json.loads(c.features_en) if c.features_en else [],
            "icon": c.icon,
        })
    return result


@router.post("/cards/admin/create")
def create_membership_card(data: dict, db: Session = Depends(get_db)):
    """Admin: Create a new membership card."""
    card = MembershipCard(
        card_type=data.get("card_type", "custom"),
        name_ar=data.get("name_ar", ""),
        name_en=data.get("name_en", ""),
        price_eg=data.get("price_eg", 0),
        price_sa=data.get("price_sa", 0),
        price_ae=data.get("price_ae", 0),
        price_om=data.get("price_om", 0),
        price_other=data.get("price_other", 0),
        discount_percent=data.get("discount_percent", 0),
        features_ar=json.dumps(data.get("features_ar", []), ensure_ascii=False),
        features_en=json.dumps(data.get("features_en", []), ensure_ascii=False),
        icon=data.get("icon", "⭐"),
        sort_order=data.get("sort_order", 99),
        active=True,
    )
    db.add(card)
    db.commit()
    db.refresh(card)
    return {"status": "success", "id": card.id, "message": "تم إنشاء البطاقة بنجاح"}


@router.put("/cards/admin/{card_id}")
def update_membership_card(card_id: int, data: dict, db: Session = Depends(get_db)):
    """Admin: Update a membership card."""
    card = db.query(MembershipCard).filter(MembershipCard.id == card_id).first()
    if not card:
        raise HTTPException(status_code=404, detail="Card not found")
    
    if "name_ar" in data: card.name_ar = data["name_ar"]
    if "name_en" in data: card.name_en = data["name_en"]
    if "card_type" in data: card.card_type = data["card_type"]
    if "price_eg" in data: card.price_eg = data["price_eg"]
    if "price_sa" in data: card.price_sa = data["price_sa"]
    if "price_ae" in data: card.price_ae = data["price_ae"]
    if "price_om" in data: card.price_om = data["price_om"]
    if "price_other" in data: card.price_other = data["price_other"]
    if "discount_percent" in data: card.discount_percent = data["discount_percent"]
    if "icon" in data: card.icon = data["icon"]
    if "sort_order" in data: card.sort_order = data["sort_order"]
    if "features_ar" in data: card.features_ar = json.dumps(data["features_ar"], ensure_ascii=False)
    if "features_en" in data: card.features_en = json.dumps(data["features_en"], ensure_ascii=False)
    if "active" in data: card.active = data["active"]
    
    db.commit()
    return {"status": "success", "message": "تم تحديث البطاقة بنجاح"}


@router.delete("/cards/admin/{card_id}")
def delete_membership_card(card_id: int, db: Session = Depends(get_db)):
    """Admin: Soft-delete (deactivate) a membership card."""
    card = db.query(MembershipCard).filter(MembershipCard.id == card_id).first()
    if not card:
        raise HTTPException(status_code=404, detail="Card not found")
    card.active = False
    db.commit()
    return {"status": "success", "message": "تم حذف البطاقة بنجاح"}


@router.put("/subscriptions/{sub_id}/cancel")
def cancel_subscription(sub_id: int, db: Session = Depends(get_db)):
    """Admin: Cancel a user subscription."""
    sub = db.query(UserMembership).filter(UserMembership.id == sub_id).first()
    if not sub:
        raise HTTPException(status_code=404, detail="Subscription not found")
    sub.status = "cancelled"
    db.commit()
    return {"status": "success", "message": "تم إلغاء الاشتراك بنجاح"}


@router.get("/cards/all")
def get_all_membership_cards(db: Session = Depends(get_db)):
    """Admin: Get ALL membership cards (including inactive)."""
    cards = db.query(MembershipCard).order_by(MembershipCard.sort_order).all()
    result = []
    for c in cards:
        result.append({
            "id": c.id,
            "card_type": c.card_type,
            "name_ar": c.name_ar,
            "name_en": c.name_en,
            "prices": {"EG": c.price_eg, "SA": c.price_sa, "AE": c.price_ae, "OM": c.price_om, "OTHER": c.price_other},
            "discount_percent": c.discount_percent,
            "features_ar": json.loads(c.features_ar) if c.features_ar else [],
            "features_en": json.loads(c.features_en) if c.features_en else [],
            "icon": c.icon,
            "active": c.active,
            "sort_order": c.sort_order,
        })
    return result


@router.post("/cards/subscribe")
def subscribe_to_card(data: dict, db: Session = Depends(get_db)):
    """Subscribe user to a membership card."""
    from datetime import datetime, timedelta
    user_id = data.get("user_id", 1)
    card_type = data.get("card_type")
    
    card = db.query(MembershipCard).filter(MembershipCard.card_type == card_type).first()
    if not card:
        raise HTTPException(status_code=404, detail="Card not found")
    
    # Check existing active membership
    existing = db.query(UserMembership).filter(
        UserMembership.user_id == user_id,
        UserMembership.status == "active"
    ).first()
    
    if existing:
        existing.status = "upgraded"
    
    now = datetime.now()
    membership = UserMembership(
        user_id=user_id,
        card_type=card_type,
        start_date=now.strftime("%Y-%m-%d"),
        end_date=(now + timedelta(days=365)).strftime("%Y-%m-%d"),
        amount_paid=data.get("amount", card.price_sa),
        currency=data.get("currency", "SAR"),
        payment_method=data.get("payment_method", "card"),
        status="active"
    )
    db.add(membership)
    db.commit()
    db.refresh(membership)
    return {"status": "success", "membership_id": membership.id, "message": "تم الاشتراك بنجاح"}


@router.get("/cards/search-users")
def search_users_for_gift(q: str = "", db: Session = Depends(get_db)):
    """Search users by name or phone for gifting."""
    from app.models.user import User
    if not q or len(q) < 2:
        return []
    results = db.query(User).filter(
        (User.name.ilike(f"%{q}%")) | (User.phone.ilike(f"%{q}%"))
    ).limit(10).all()
    return [{"id": u.id, "name": u.name, "phone": u.phone, "profile_image": u.profile_image} for u in results]


@router.post("/cards/gift")
def gift_membership_card(data: dict, db: Session = Depends(get_db)):
    """Gift a membership card to another user."""
    from datetime import datetime, timedelta
    gifter_id = data.get("gifter_id", 1)
    recipient_id = data.get("recipient_id")
    recipient_name = data.get("recipient_name", "")
    card_type = data.get("card_type")
    gift_message = data.get("gift_message", "")

    if not recipient_id or not card_type:
        raise HTTPException(status_code=400, detail="recipient_id and card_type are required")

    card = db.query(MembershipCard).filter(MembershipCard.card_type == card_type).first()
    if not card:
        raise HTTPException(status_code=404, detail="Card not found")

    from app.models.user import User
    recipient = db.query(User).filter(User.id == recipient_id).first()
    if not recipient:
        raise HTTPException(status_code=404, detail="Recipient user not found")

    existing = db.query(UserMembership).filter(
        UserMembership.user_id == recipient_id,
        UserMembership.status == "active"
    ).first()
    if existing:
        existing.status = "upgraded"

    now = datetime.now()
    membership = UserMembership(
        user_id=recipient_id,
        card_type=card_type,
        start_date=now.strftime("%Y-%m-%d"),
        end_date=(now + timedelta(days=365)).strftime("%Y-%m-%d"),
        amount_paid=data.get("amount", card.price_sa),
        currency=data.get("currency", "SAR"),
        payment_method="gift",
        status="active",
        is_gift=True,
        gifted_by=gifter_id,
        gift_message=gift_message,
        recipient_name=recipient_name or recipient.name,
    )
    db.add(membership)
    db.commit()
    db.refresh(membership)
    return {
        "status": "success",
        "membership_id": membership.id,
        "message": f"تم إهداء بطاقة {card.name_ar} بنجاح إلى {recipient.name}",
        "recipient_name": recipient.name,
    }


@router.get("/cards/my-subscription")
def get_my_subscription(user_id: int = 1, db: Session = Depends(get_db)):
    """Get user's active membership subscription."""
    sub = db.query(UserMembership).filter(
        UserMembership.user_id == user_id,
        UserMembership.status == "active"
    ).order_by(UserMembership.created_at.desc()).first()
    
    if not sub:
        return None
    
    card = db.query(MembershipCard).filter(MembershipCard.card_type == sub.card_type).first()
    return {
        "id": sub.id,
        "card_type": sub.card_type,
        "card_name_ar": card.name_ar if card else "",
        "card_name_en": card.name_en if card else "",
        "start_date": sub.start_date,
        "end_date": sub.end_date,
        "status": sub.status,
        "discount_percent": card.discount_percent if card else 0,
    }


# --- Social Links ---
@router.get("/social-links")
def get_social_links(db: Session = Depends(get_db)):
    """Get all active social media links."""
    links = db.query(SocialLink).filter(SocialLink.active == True).order_by(SocialLink.sort_order).all()
    return [{
        "id": l.id, "platform": l.platform,
        "name_ar": l.name_ar, "name_en": l.name_en,
        "url": l.url, "icon": l.icon, "color": l.color
    } for l in links]


# --- Blog Courses ---
@router.get("/courses")
def get_courses(db: Session = Depends(get_db)):
    """Get all active courses."""
    courses = db.query(BlogCourse).filter(BlogCourse.active == True).order_by(BlogCourse.sort_order).all()
    return [{
        "id": c.id, "title_ar": c.title_ar, "title_en": c.title_en,
        "description_ar": c.description_ar, "description_en": c.description_en,
        "url": c.url, "icon": c.icon, "platform": c.platform
    } for c in courses]


# --- Book Links ---
@router.get("/books")
def get_book_links(db: Session = Depends(get_db)):
    """Get all active book links."""
    books = db.query(BookLink).filter(BookLink.active == True).order_by(BookLink.sort_order).all()
    return [{
        "id": b.id, "book_title_ar": b.book_title_ar, "book_title_en": b.book_title_en,
        "country_code": b.country_code, "country_name_ar": b.country_name_ar,
        "country_name_en": b.country_name_en, "url": b.url, "flag_emoji": b.flag_emoji
    } for b in books]


# --- Consultation Packages ---
@router.get("/packages")
def get_consultation_packages(db: Session = Depends(get_db)):
    """Get all active consultation packages."""
    pkgs = db.query(ConsultationPackage).filter(ConsultationPackage.active == True).order_by(ConsultationPackage.sort_order).all()
    return [{
        "id": p.id, "name_ar": p.name_ar, "name_en": p.name_en,
        "description_ar": p.description_ar, "description_en": p.description_en,
        "features_ar": json.loads(p.features_ar) if p.features_ar else [],
        "features_en": json.loads(p.features_en) if p.features_en else [],
        "prices": {"EG": p.price_eg, "SA": p.price_sa, "AE": p.price_ae, "OM": p.price_om, "OTHER": p.price_other},
        "duration": p.duration, "icon": p.icon, "is_giftable": p.is_giftable,
    } for p in pkgs]


@router.post("/packages/order")
def order_package(data: dict, db: Session = Depends(get_db)):
    """Order a consultation package (or gift it)."""
    from datetime import datetime, timedelta
    from app.models.membership import UserPackageOrder
    
    user_id = data.get("user_id", 1)
    package_id = data.get("package_id", "")
    now = datetime.now()
    
    # Determine end date based on period
    period = data.get("period", "")
    if "سنة" in period or "year" in period.lower():
        end = now + timedelta(days=365)
    elif "3" in period:
        end = now + timedelta(days=90)
    else:
        end = now + timedelta(days=30)
    
    order = UserPackageOrder(
        user_id=user_id,
        package_id=package_id,
        package_name=data.get("package_name", ""),
        amount=data.get("amount", 0),
        currency=data.get("currency", "SAR"),
        period=period,
        status="pending",
        payment_method="direct",
        start_date=now.strftime("%Y-%m-%d"),
        end_date=end.strftime("%Y-%m-%d"),
    )
    db.add(order)
    db.commit()
    db.refresh(order)
    return {"status": "success", "message": "تم إرسال طلب تفعيل الباقة، بانتظار موافقة الإدارة", "order_id": order.id}


@router.get("/packages/my-orders")
def get_my_package_orders(user_id: int = 1, db: Session = Depends(get_db)):
    from app.models.membership import UserPackageOrder
    orders = db.query(UserPackageOrder).filter(UserPackageOrder.user_id == user_id).order_by(UserPackageOrder.created_at.desc()).all()
    return orders


# --- Medical Profile ---
@router.get("/medical-profile")
def get_medical_profile(user_id: int = 1, db: Session = Depends(get_db)):
    """Get user's medical profile."""
    profile = db.query(MedicalProfile).filter(MedicalProfile.user_id == user_id).first()
    if not profile:
        return {"user_id": user_id, "smoker": False, "daily_sport": False,
                "diabetes_type": "", "diagnosis_date": "", "blood_type": "",
                "hba1c": "", "insulin_type": "", "height": "",
                "medications": "", "meals_count": 3,
                "allergies": "", "chronic_diseases": "",
                "emergency_contact": "", "notes": "", "attachments": []}
    return {
        "user_id": profile.user_id,
        "smoker": profile.is_smoker or False,
        "daily_sport": profile.daily_exercise or False,
        "diabetes_type": profile.diabetes_type or "",
        "diagnosis_date": profile.diagnosis_date or "",
        "blood_type": profile.blood_type or "",
        "hba1c": profile.hba1c or "",
        "insulin_type": profile.insulin_type or "",
        "height": profile.height or "",
        "medications": profile.medications or "",
        "meals_count": profile.meals_per_day or 3,
        "allergies": profile.allergies or "",
        "chronic_diseases": profile.chronic_diseases or "",
        "emergency_contact": profile.emergency_contact or "",
        "notes": profile.medical_notes or "",
        "attachments": json.loads(profile.attachments) if profile.attachments else [],
    }


@router.put("/medical-profile")
def update_medical_profile(data: dict, db: Session = Depends(get_db)):
    """Update user's medical profile."""
    user_id = data.get("user_id", 1)
    profile = db.query(MedicalProfile).filter(MedicalProfile.user_id == user_id).first()
    
    if not profile:
        profile = MedicalProfile(user_id=user_id)
        db.add(profile)
    
    # Map frontend field names to model fields
    if "smoker" in data: profile.is_smoker = data["smoker"]
    if "is_smoker" in data: profile.is_smoker = data["is_smoker"]
    if "daily_sport" in data: profile.daily_exercise = data["daily_sport"]
    if "daily_exercise" in data: profile.daily_exercise = data["daily_exercise"]
    if "diabetes_type" in data: profile.diabetes_type = data["diabetes_type"]
    if "diagnosis_date" in data: profile.diagnosis_date = data["diagnosis_date"]
    if "blood_type" in data: profile.blood_type = data["blood_type"]
    if "hba1c" in data: profile.hba1c = data["hba1c"]
    if "insulin_type" in data: profile.insulin_type = data["insulin_type"]
    if "height" in data: profile.height = data["height"]
    if "medications" in data:
        meds = data["medications"]
        profile.medications = json.dumps(meds, ensure_ascii=False) if isinstance(meds, list) else meds
    if "meals_count" in data: profile.meals_per_day = data["meals_count"]
    if "meals_per_day" in data: profile.meals_per_day = data["meals_per_day"]
    if "allergies" in data: profile.allergies = data["allergies"]
    if "chronic_diseases" in data: profile.chronic_diseases = data["chronic_diseases"]
    if "emergency_contact" in data: profile.emergency_contact = data["emergency_contact"]
    if "notes" in data: profile.medical_notes = data["notes"]
    if "medical_notes" in data: profile.medical_notes = data["medical_notes"]
    if "attachments" in data:
        atts = data["attachments"]
        profile.attachments = json.dumps(atts, ensure_ascii=False) if isinstance(atts, list) else atts
    
    db.commit()
    return {"status": "success", "message": "تم تحديث الملف الطبي بنجاح"}


# --- Favorites ---
@router.get("/favorites")
def get_favorites(user_id: int = 1, db: Session = Depends(get_db)):
    """Get user's favorites."""
    favs = db.query(UserFavorite).filter(UserFavorite.user_id == user_id).all()
    return [{"id": f.id, "item_type": f.item_type, "item_id": f.item_id} for f in favs]


@router.post("/favorites")
def add_favorite(data: dict, db: Session = Depends(get_db)):
    """Add to favorites."""
    fav = UserFavorite(
        user_id=data.get("user_id", 1),
        item_type=data.get("item_type", "product"),
        item_id=data.get("item_id")
    )
    db.add(fav)
    db.commit()
    return {"status": "success", "message": "تمت الإضافة للمفضلة"}


@router.delete("/favorites/{fav_id}")
def remove_favorite(fav_id: int, db: Session = Depends(get_db)):
    """Remove from favorites."""
    fav = db.query(UserFavorite).filter(UserFavorite.id == fav_id).first()
    if fav:
        db.delete(fav)
        db.commit()
    return {"status": "success"}
