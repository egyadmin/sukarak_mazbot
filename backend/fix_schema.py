"""Full fix for the ACTUAL database at project root."""
import sqlite3
import sys
import os

sys.stdout.reconfigure(encoding="utf-8")
DB = os.path.join(r"E:\dr.moahmed\Sukarak-Mazbot\Sukarak-Mazbot", "sukarak.db")

conn = sqlite3.connect(DB)
c = conn.cursor()

# ═══════════════════════════════════════════════
# 1. FIX sukarak_nursing_services SCHEMA
# ═══════════════════════════════════════════════
c.execute("PRAGMA table_info(sukarak_nursing_services)")
cols = [col[1] for col in c.fetchall()]
print("Current columns:", cols)

if "service_type" not in cols:
    c.execute('ALTER TABLE sukarak_nursing_services ADD COLUMN service_type VARCHAR(50) DEFAULT "nursing"')
    print("[FIX] Added: service_type")
    # Mark all existing as "lab" since they were lab tests
    c.execute('UPDATE sukarak_nursing_services SET service_type = "lab"')

if "category" not in cols:
    c.execute('ALTER TABLE sukarak_nursing_services ADD COLUMN category VARCHAR(100) DEFAULT "other"')
    print("[FIX] Added: category")

conn.commit()

# ═══════════════════════════════════════════════
# 2. UPDATE LAB SERVICE CATEGORIES
# ═══════════════════════════════════════════════
c.execute("SELECT id, title FROM sukarak_nursing_services WHERE service_type = 'lab'")
for rid, title in c.fetchall():
    cat = "other"
    if any(k in title for k in ["دم", "هيموجلوبين", "صفائح", "ترسيب", "ESR", "CBC", "تخثر"]):
        cat = "blood"
    elif any(k in title for k in ["سكر", "جلوكوز", "أنسولين", "HbA1c"]):
        cat = "diabetes"
    elif any(k in title for k in ["هرمون", "درقية", "TSH", "T3", "T4", "برولاكتين", "كورتيزول"]):
        cat = "hormones"
    elif any(k in title for k in ["كبد", "كلى", "ألبومين", "بيليروبين", "يوريك", "يوريا", "كرياتينين", "ALT", "AST"]):
        cat = "liver_kidney"
    elif any(k in title for k in ["فيتامين", "حديد", "فيريتين", "كالسيوم", "مغنيسيوم", "زنك"]):
        cat = "vitamins"
    c.execute("UPDATE sukarak_nursing_services SET category = ? WHERE id = ?", (cat, rid))
conn.commit()

# ═══════════════════════════════════════════════
# 3. SEED NURSING SERVICES
# ═══════════════════════════════════════════════
c.execute("SELECT COUNT(*) FROM sukarak_nursing_services WHERE service_type = 'nursing'")
if c.fetchone()[0] == 0:
    nursing = [
        ("حقن عضل وريد", "IM & IV Injection", 80, "15 دقيقة", "💉", "from-sky-400 to-blue-500", "injections", "nursing"),
        ("تركيب محاليل وريدية", "IV Fluid Administration", 150, "ساعة", "💉", "from-sky-400 to-blue-500", "injections", "nursing"),
        ("حقن أنسولين", "Insulin Injection", 60, "10 دقائق", "💉", "from-sky-400 to-blue-500", "injections", "nursing"),
        ("تركيب كانيولا", "Cannula Insertion", 100, "15 دقيقة", "💉", "from-sky-400 to-blue-500", "injections", "nursing"),
        ("متابعة مستوى السكر", "Blood Sugar Monitoring", 50, "30 دقيقة", "📊", "from-rose-400 to-pink-500", "monitoring", "nursing"),
        ("قياس ضغط الدم", "Blood Pressure Measurement", 40, "15 دقيقة", "📊", "from-rose-400 to-pink-500", "monitoring", "nursing"),
        ("متابعة يومية للسكر والضغط", "Daily Sugar & BP Monitoring", 200, "زيارة يومية", "📊", "from-rose-400 to-pink-500", "monitoring", "nursing"),
        ("تضميد جروح", "Wound Dressing", 100, "30 دقيقة", "🩹", "from-amber-400 to-orange-500", "wounds", "nursing"),
        ("تضميد حروق", "Burn Dressing", 120, "45 دقيقة", "🩹", "from-amber-400 to-orange-500", "wounds", "nursing"),
        ("إزالة غرز جراحية", "Suture Removal", 80, "20 دقيقة", "🩹", "from-amber-400 to-orange-500", "wounds", "nursing"),
        ("رعاية قدم السكري", "Diabetic Foot Care", 150, "45 دقيقة", "🩹", "from-amber-400 to-orange-500", "wounds", "nursing"),
        ("تركيب قسطرة بولية", "Urinary Catheter", 200, "30 دقيقة", "🏥", "from-violet-400 to-purple-500", "other", "nursing"),
        ("سحب عينات دم منزلية", "Home Blood Sample", 100, "15 دقيقة", "🏥", "from-violet-400 to-purple-500", "other", "nursing"),
        ("رعاية ما بعد العمليات", "Post-Op Care", 300, "ساعة", "🏥", "from-violet-400 to-purple-500", "other", "nursing"),
    ]
    for s in nursing:
        c.execute("""INSERT INTO sukarak_nursing_services 
            (title, title_en, price, duration, icon, color, category, service_type, active)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1)""", s)
    print(f"[SEED] {len(nursing)} nursing services inserted")
    conn.commit()

# ═══════════════════════════════════════════════
# 4. SETTINGS TABLE
# ═══════════════════════════════════════════════
c.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='sukarak_settings'")
if not c.fetchone():
    c.execute("""CREATE TABLE sukarak_settings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        key VARCHAR(100) UNIQUE NOT NULL,
        value TEXT NOT NULL,
        label VARCHAR(255),
        setting_group VARCHAR(50) DEFAULT 'general',
        type VARCHAR(20) DEFAULT 'text',
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )""")
    conn.commit()
    print("[FIX] Created sukarak_settings table")

c.execute("SELECT COUNT(*) FROM sukarak_settings")
if c.fetchone()[0] == 0:
    settings = [
        ("show_nursing_section", "true", "إظهار قسم التمريض المنزلي", "appearance", "boolean"),
        ("show_lab_section", "true", "إظهار قسم التحاليل الطبية", "appearance", "boolean"),
        ("show_market_section", "true", "إظهار قسم المتجر", "appearance", "boolean"),
        ("show_membership_section", "true", "إظهار قسم العضوية", "appearance", "boolean"),
        ("show_appointments_section", "true", "إظهار قسم المواعيد", "appearance", "boolean"),
        ("show_reports_section", "true", "إظهار قسم التقارير", "appearance", "boolean"),
        ("show_banner_slider", "true", "إظهار شريط الإعلانات", "appearance", "boolean"),
        ("app_maintenance_mode", "false", "وضع الصيانة", "general", "boolean"),
        ("store_currency", "SAR", "عملة المتجر", "general", "text"),
        ("support_phone", "+966500000000", "رقم الدعم الفني", "contact", "text"),
        ("support_email", "support@sukarak.com", "بريد الدعم الفني", "contact", "text"),
    ]
    for s in settings:
        c.execute("INSERT INTO sukarak_settings (key, value, label, setting_group, type) VALUES (?, ?, ?, ?, ?)", s)
    conn.commit()
    print(f"[SEED] {len(settings)} app settings inserted")

# ═══════════════════════════════════════════════
# 5. FINAL VERIFICATION
# ═══════════════════════════════════════════════
c.execute("PRAGMA table_info(sukarak_nursing_services)")
print("\nFinal columns:", [col[1] for col in c.fetchall()])

c.execute("SELECT category, COUNT(*) FROM sukarak_nursing_services WHERE service_type = 'lab' GROUP BY category")
print("Lab categories:", dict(c.fetchall()))

c.execute("SELECT category, COUNT(*) FROM sukarak_nursing_services WHERE service_type = 'nursing' GROUP BY category")
print("Nursing categories:", dict(c.fetchall()))

c.execute("SELECT COUNT(*) FROM sukarak_settings")
print(f"Settings: {c.fetchone()[0]}")

conn.close()
print("\n[DONE] All fixes applied!")
