"""
Seed Lab Test Services & Nursing Services into the database.
Also seeds default app visibility settings.
"""
import sqlite3
import os

DB_PATH = os.path.join(os.path.dirname(__file__), "sukarak.db")

lab_services = [
    # Blood Tests (blood)
    {"title": "تحليل صورة دم كاملة CBC", "title_en": "Complete Blood Count (CBC)", "price": 120, "duration": "30 دقيقة", "icon": "🩸", "category": "blood", "service_type": "lab"},
    {"title": "تحليل سرعة الترسيب ESR", "title_en": "Erythrocyte Sedimentation Rate", "price": 80, "duration": "20 دقيقة", "icon": "🩸", "category": "blood", "service_type": "lab"},
    {"title": "تحليل فصيلة الدم", "title_en": "Blood Type Test", "price": 100, "duration": "15 دقيقة", "icon": "🩸", "category": "blood", "service_type": "lab"},
    {"title": "تحليل نسبة الهيموجلوبين", "title_en": "Hemoglobin Test", "price": 60, "duration": "15 دقيقة", "icon": "🩸", "category": "blood", "service_type": "lab"},
    {"title": "تحليل الصفائح الدموية", "title_en": "Platelet Count", "price": 90, "duration": "20 دقيقة", "icon": "🩸", "category": "blood", "service_type": "lab"},

    # Diabetes Tests (diabetes)
    {"title": "تحليل السكر الصائم FBS", "title_en": "Fasting Blood Sugar", "price": 50, "duration": "10 دقائق", "icon": "🔬", "category": "diabetes", "service_type": "lab"},
    {"title": "تحليل السكر التراكمي HbA1c", "title_en": "HbA1c Test", "price": 150, "duration": "15 دقيقة", "icon": "🔬", "category": "diabetes", "service_type": "lab"},
    {"title": "تحليل السكر العشوائي RBS", "title_en": "Random Blood Sugar", "price": 40, "duration": "10 دقائق", "icon": "🔬", "category": "diabetes", "service_type": "lab"},
    {"title": "اختبار تحمل الجلوكوز GTT", "title_en": "Glucose Tolerance Test", "price": 200, "duration": "2 ساعة", "icon": "🔬", "category": "diabetes", "service_type": "lab"},
    {"title": "تحليل الأنسولين", "title_en": "Insulin Level Test", "price": 180, "duration": "20 دقيقة", "icon": "🔬", "category": "diabetes", "service_type": "lab"},

    # Hormones Tests (hormones)
    {"title": "تحليل هرمونات الغدة الدرقية TSH", "title_en": "Thyroid Stimulating Hormone", "price": 200, "duration": "20 دقيقة", "icon": "💊", "category": "hormones", "service_type": "lab"},
    {"title": "تحليل T3 و T4", "title_en": "T3 & T4 Test", "price": 250, "duration": "20 دقيقة", "icon": "💊", "category": "hormones", "service_type": "lab"},
    {"title": "تحليل هرمون البرولاكتين", "title_en": "Prolactin Hormone", "price": 180, "duration": "20 دقيقة", "icon": "💊", "category": "hormones", "service_type": "lab"},
    {"title": "تحليل هرمون الكورتيزول", "title_en": "Cortisol Level", "price": 220, "duration": "20 دقيقة", "icon": "💊", "category": "hormones", "service_type": "lab"},

    # Liver & Kidney Tests (liver_kidney)
    {"title": "وظائف الكبد ALT/AST", "title_en": "Liver Function Test (ALT/AST)", "price": 180, "duration": "20 دقيقة", "icon": "🧪", "category": "liver_kidney", "service_type": "lab"},
    {"title": "وظائف الكلى (يوريا وكرياتينين)", "title_en": "Kidney Function (Urea & Creatinine)", "price": 150, "duration": "20 دقيقة", "icon": "🧪", "category": "liver_kidney", "service_type": "lab"},
    {"title": "تحليل الألبومين", "title_en": "Albumin Test", "price": 100, "duration": "15 دقيقة", "icon": "🧪", "category": "liver_kidney", "service_type": "lab"},
    {"title": "تحليل البيليروبين", "title_en": "Bilirubin Test", "price": 120, "duration": "15 دقيقة", "icon": "🧪", "category": "liver_kidney", "service_type": "lab"},
    {"title": "تحليل حمض اليوريك", "title_en": "Uric Acid Test", "price": 90, "duration": "15 دقيقة", "icon": "🧪", "category": "liver_kidney", "service_type": "lab"},

    # Vitamins & Minerals (vitamins)
    {"title": "تحليل فيتامين D", "title_en": "Vitamin D Test", "price": 250, "duration": "20 دقيقة", "icon": "💉", "category": "vitamins", "service_type": "lab"},
    {"title": "تحليل فيتامين B12", "title_en": "Vitamin B12 Test", "price": 200, "duration": "20 دقيقة", "icon": "💉", "category": "vitamins", "service_type": "lab"},
    {"title": "تحليل الحديد وفيريتين", "title_en": "Iron & Ferritin Test", "price": 180, "duration": "20 دقيقة", "icon": "💉", "category": "vitamins", "service_type": "lab"},
    {"title": "تحليل الكالسيوم والمغنيسيوم", "title_en": "Calcium & Magnesium Test", "price": 160, "duration": "15 دقيقة", "icon": "💉", "category": "vitamins", "service_type": "lab"},
    {"title": "تحليل الزنك", "title_en": "Zinc Level Test", "price": 140, "duration": "15 دقيقة", "icon": "💉", "category": "vitamins", "service_type": "lab"},

    # Other Services (other)
    {"title": "تحليل البول الكامل", "title_en": "Complete Urinalysis", "price": 80, "duration": "15 دقيقة", "icon": "📋", "category": "other", "service_type": "lab"},
    {"title": "تحليل الدهون الشامل", "title_en": "Lipid Profile", "price": 200, "duration": "20 دقيقة", "icon": "📋", "category": "other", "service_type": "lab"},
    {"title": "تحليل CRP (بروتين سي التفاعلي)", "title_en": "C-Reactive Protein (CRP)", "price": 120, "duration": "15 دقيقة", "icon": "📋", "category": "other", "service_type": "lab"},
]

nursing_services = [
    # Injections & IV (injections)
    {"title": "حقن عضل وريد", "title_en": "Intramuscular & IV Injection", "price": 80, "duration": "15 دقيقة", "icon": "💉", "color": "from-sky-400 to-blue-500", "category": "injections", "service_type": "nursing"},
    {"title": "تركيب محاليل وريدية", "title_en": "IV Fluid Administration", "price": 150, "duration": "ساعة", "icon": "💉", "color": "from-sky-400 to-blue-500", "category": "injections", "service_type": "nursing"},
    {"title": "حقن أنسولين", "title_en": "Insulin Injection", "price": 60, "duration": "10 دقائق", "icon": "💉", "color": "from-sky-400 to-blue-500", "category": "injections", "service_type": "nursing"},
    {"title": "تركيب كانيولا", "title_en": "Cannula Insertion", "price": 100, "duration": "15 دقيقة", "icon": "💉", "color": "from-sky-400 to-blue-500", "category": "injections", "service_type": "nursing"},

    # Sugar & BP Monitoring (monitoring)
    {"title": "متابعة مستوى السكر", "title_en": "Blood Sugar Monitoring", "price": 50, "duration": "30 دقيقة", "icon": "📊", "color": "from-rose-400 to-pink-500", "category": "monitoring", "service_type": "nursing"},
    {"title": "قياس ضغط الدم", "title_en": "Blood Pressure Measurement", "price": 40, "duration": "15 دقيقة", "icon": "📊", "color": "from-rose-400 to-pink-500", "category": "monitoring", "service_type": "nursing"},
    {"title": "متابعة يومية للسكر والضغط", "title_en": "Daily Sugar & BP Monitoring", "price": 200, "duration": "زيارة يومية", "icon": "📊", "color": "from-rose-400 to-pink-500", "category": "monitoring", "service_type": "nursing"},

    # Wound & Burn Dressing (wounds)
    {"title": "تضميد جروح", "title_en": "Wound Dressing", "price": 100, "duration": "30 دقيقة", "icon": "🩹", "color": "from-amber-400 to-orange-500", "category": "wounds", "service_type": "nursing"},
    {"title": "تضميد حروق", "title_en": "Burn Dressing", "price": 120, "duration": "45 دقيقة", "icon": "🩹", "color": "from-amber-400 to-orange-500", "category": "wounds", "service_type": "nursing"},
    {"title": "إزالة غرز جراحية", "title_en": "Suture Removal", "price": 80, "duration": "20 دقيقة", "icon": "🩹", "color": "from-amber-400 to-orange-500", "category": "wounds", "service_type": "nursing"},
    {"title": "رعاية قدم السكري", "title_en": "Diabetic Foot Care", "price": 150, "duration": "45 دقيقة", "icon": "🩹", "color": "from-amber-400 to-orange-500", "category": "wounds", "service_type": "nursing"},

    # Other Services (other)
    {"title": "تركيب قسطرة بولية", "title_en": "Urinary Catheter Insertion", "price": 200, "duration": "30 دقيقة", "icon": "🏥", "color": "from-violet-400 to-purple-500", "category": "other", "service_type": "nursing"},
    {"title": "سحب عينات دم منزلية", "title_en": "Home Blood Sample Collection", "price": 100, "duration": "15 دقيقة", "icon": "🏥", "color": "from-violet-400 to-purple-500", "category": "other", "service_type": "nursing"},
    {"title": "رعاية ما بعد العمليات", "title_en": "Post-Operative Care", "price": 300, "duration": "ساعة", "icon": "🏥", "color": "from-violet-400 to-purple-500", "category": "other", "service_type": "nursing"},
]

# Default app settings for admin control
app_settings = [
    {"key": "show_nursing_section", "value": "true", "label": "إظهار قسم التمريض المنزلي", "group": "appearance", "type": "boolean"},
    {"key": "show_lab_section", "value": "true", "label": "إظهار قسم التحاليل الطبية", "group": "appearance", "type": "boolean"},
    {"key": "show_market_section", "value": "true", "label": "إظهار قسم المتجر", "group": "appearance", "type": "boolean"},
    {"key": "show_membership_section", "value": "true", "label": "إظهار قسم العضوية", "group": "appearance", "type": "boolean"},
    {"key": "show_appointments_section", "value": "true", "label": "إظهار قسم المواعيد", "group": "appearance", "type": "boolean"},
    {"key": "show_reports_section", "value": "true", "label": "إظهار قسم التقارير", "group": "appearance", "type": "boolean"},
    {"key": "show_banner_slider", "value": "true", "label": "إظهار شريط الإعلانات", "group": "appearance", "type": "boolean"},
    {"key": "app_maintenance_mode", "value": "false", "label": "وضع الصيانة (إيقاف التطبيق مؤقتاً)", "group": "general", "type": "boolean"},
    {"key": "store_currency", "value": "SAR", "label": "عملة المتجر", "group": "general", "type": "text"},
    {"key": "support_phone", "value": "+966500000000", "label": "رقم الدعم الفني", "group": "general", "type": "text"},
    {"key": "support_email", "value": "support@sukarak.com", "label": "بريد الدعم الفني", "group": "general", "type": "text"},
]


def seed():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    # ═══ Seed Lab Services ═══
    cursor.execute("SELECT COUNT(*) FROM sukarak_nursing_services WHERE service_type = 'lab'")
    lab_count = cursor.fetchone()[0]
    if lab_count == 0:
        print(f"[SEED] Inserting {len(lab_services)} lab test services...")
        for svc in lab_services:
            cursor.execute("""
                INSERT INTO sukarak_nursing_services (title, title_en, price, duration, icon, category, service_type, active)
                VALUES (?, ?, ?, ?, ?, ?, ?, 1)
            """, (svc["title"], svc["title_en"], svc["price"], svc["duration"], svc["icon"], svc["category"], svc["service_type"]))
        print(f"[OK] Seeded {len(lab_services)} lab services.")
    else:
        print(f"[INFO] Lab services already exist ({lab_count}). Skipping.")

    # ═══ Seed Nursing Services ═══
    cursor.execute("SELECT COUNT(*) FROM sukarak_nursing_services WHERE service_type = 'nursing'")
    nursing_count = cursor.fetchone()[0]
    if nursing_count == 0:
        print(f"[SEED] Inserting {len(nursing_services)} nursing services...")
        for svc in nursing_services:
            cursor.execute("""
                INSERT INTO sukarak_nursing_services (title, title_en, price, duration, icon, color, category, service_type, active)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1)
            """, (svc["title"], svc["title_en"], svc["price"], svc["duration"], svc["icon"], svc.get("color", ""), svc["category"], svc["service_type"]))
        print(f"[OK] Seeded {len(nursing_services)} nursing services.")
    else:
        print(f"[INFO] Nursing services already exist ({nursing_count}). Skipping.")

    # ═══ Seed App Settings ═══
    cursor.execute("SELECT COUNT(*) FROM sukarak_settings")
    settings_count = cursor.fetchone()[0]
    if settings_count == 0:
        print(f"[SEED] Inserting {len(app_settings)} app settings...")
        for s in app_settings:
            cursor.execute("""
                INSERT INTO sukarak_settings (key, value, label, setting_group, type)
                VALUES (?, ?, ?, ?, ?)
            """, (s["key"], s["value"], s["label"], s["group"], s["type"]))
        print(f"[OK] Seeded {len(app_settings)} app settings.")
    else:
        print(f"[INFO] App settings already exist ({settings_count}). Skipping.")

    conn.commit()
    conn.close()
    print("[DONE] All seeds complete!")


if __name__ == "__main__":
    seed()
