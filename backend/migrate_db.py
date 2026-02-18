"""Database migration script to add missing columns for recent updates.
Table names match the SQLAlchemy models exactly.
"""
import sqlite3
import os

db_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'sukarak.db')
if not os.path.exists(db_path):
    # Fallback to backend/sukarak.db
    db_path = os.path.join(os.path.dirname(__file__), 'sukarak.db')
print(f"Migrating database: {db_path}")

conn = sqlite3.connect(db_path)
cur = conn.cursor()

# Helper: add column if it doesn't exist
def add_column_if_missing(table, column, col_type, default=None):
    cur.execute(f"PRAGMA table_info([{table}])")
    cols = [r[1] for r in cur.fetchall()]
    if column not in cols:
        default_clause = f" DEFAULT {default}" if default is not None else ""
        cur.execute(f"ALTER TABLE [{table}] ADD COLUMN [{column}] {col_type}{default_clause}")
        print(f"  + Added {table}.{column} ({col_type})")
    else:
        print(f"  = {table}.{column} already exists")

# Helper: create table if missing
def ensure_table(create_sql, table_name):
    cur.execute(f"SELECT name FROM sqlite_master WHERE type='table' AND name='{table_name}'")
    if not cur.fetchone():
        cur.execute(create_sql)
        print(f"  + Created table: {table_name}")
    else:
        print(f"  = Table {table_name} already exists")

print("\n--- Ensuring all tables exist ---")

# sukarak_users
ensure_table("""
CREATE TABLE IF NOT EXISTS sukarak_users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    firebase_uid VARCHAR(255) UNIQUE,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(255) UNIQUE,
    password VARCHAR(255),
    age VARCHAR(10),
    weight VARCHAR(10),
    country VARCHAR(255),
    shape VARCHAR(255),
    login_method VARCHAR(50) DEFAULT 'email',
    role VARCHAR(20) DEFAULT 'user',
    profile_image VARCHAR(1024),
    admin_display_name VARCHAR(255),
    app_display_name VARCHAR(255),
    seller_department VARCHAR(100),
    seller_address TEXT,
    wallet_balance REAL DEFAULT 0.0,
    loyalty_points INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME
)""", "sukarak_users")

# sugar_readings
ensure_table("""
CREATE TABLE IF NOT EXISTS sugar_readings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL REFERENCES sukarak_users(id),
    reading REAL NOT NULL,
    test_type VARCHAR(100),
    unit VARCHAR(20) DEFAULT 'mg/dl',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)""", "sugar_readings")

# insulin_records
ensure_table("""
CREATE TABLE IF NOT EXISTS insulin_records (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL REFERENCES sukarak_users(id),
    reading REAL NOT NULL,
    test_type VARCHAR(100),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)""", "insulin_records")

# excercise_records (note: typo in original model)
ensure_table("""
CREATE TABLE IF NOT EXISTS excercise_records (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL REFERENCES sukarak_users(id),
    type VARCHAR(255) NOT NULL,
    duration INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)""", "excercise_records")

# meal_records
ensure_table("""
CREATE TABLE IF NOT EXISTS meal_records (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL REFERENCES sukarak_users(id),
    type VARCHAR(255),
    contents TEXT,
    calories REAL DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)""", "meal_records")

# drugs_records
ensure_table("""
CREATE TABLE IF NOT EXISTS drugs_records (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL REFERENCES sukarak_users(id),
    name VARCHAR(255) NOT NULL,
    form VARCHAR(100),
    frequency VARCHAR(100),
    serving VARCHAR(100),
    dosage_unit VARCHAR(50),
    concentration VARCHAR(100),
    concentration_unit VARCHAR(50),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)""", "drugs_records")

# medicine_reminders
ensure_table("""
CREATE TABLE IF NOT EXISTS medicine_reminders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL REFERENCES sukarak_users(id),
    name VARCHAR(255) NOT NULL,
    dose VARCHAR(255),
    times TEXT,
    days TEXT,
    notes TEXT,
    active INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)""", "medicine_reminders")

# sukarak_medical_profiles
ensure_table("""
CREATE TABLE IF NOT EXISTS sukarak_medical_profiles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL UNIQUE REFERENCES sukarak_users(id),
    is_smoker BOOLEAN DEFAULT 0,
    daily_exercise BOOLEAN DEFAULT 0,
    diabetes_type VARCHAR(50),
    diagnosis_date VARCHAR(20),
    blood_type VARCHAR(10),
    hba1c VARCHAR(10),
    insulin_type VARCHAR(255),
    height VARCHAR(10),
    medications TEXT,
    meals_per_day INTEGER DEFAULT 3,
    allergies TEXT,
    chronic_diseases TEXT,
    emergency_contact VARCHAR(50),
    medical_notes TEXT,
    attachments TEXT,
    updated_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)""", "sukarak_medical_profiles")

# sukarak_membership_cards
ensure_table("""
CREATE TABLE IF NOT EXISTS sukarak_membership_cards (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    card_type VARCHAR(50) NOT NULL UNIQUE,
    name_ar VARCHAR(255) NOT NULL,
    name_en VARCHAR(255) NOT NULL,
    price_eg REAL DEFAULT 0,
    price_sa REAL DEFAULT 0,
    price_ae REAL DEFAULT 0,
    price_om REAL DEFAULT 0,
    price_other REAL DEFAULT 0,
    features_ar TEXT,
    features_en TEXT,
    discount_percent INTEGER DEFAULT 0,
    icon VARCHAR(10),
    active BOOLEAN DEFAULT 1,
    sort_order INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)""", "sukarak_membership_cards")

# sukarak_user_memberships
ensure_table("""
CREATE TABLE IF NOT EXISTS sukarak_user_memberships (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL REFERENCES sukarak_users(id),
    card_type VARCHAR(50) NOT NULL,
    start_date VARCHAR(20) NOT NULL,
    end_date VARCHAR(20) NOT NULL,
    amount_paid REAL DEFAULT 0,
    currency VARCHAR(10) DEFAULT 'SAR',
    payment_method VARCHAR(50),
    status VARCHAR(20) DEFAULT 'active',
    is_gift BOOLEAN DEFAULT 0,
    gifted_by INTEGER,
    gift_message TEXT,
    recipient_name VARCHAR(255),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)""", "sukarak_user_memberships")

# sukarak_social_links
ensure_table("""
CREATE TABLE IF NOT EXISTS sukarak_social_links (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    platform VARCHAR(50) NOT NULL,
    name_ar VARCHAR(100) NOT NULL,
    name_en VARCHAR(100) NOT NULL,
    url VARCHAR(1024) NOT NULL,
    icon VARCHAR(10),
    color VARCHAR(100),
    active BOOLEAN DEFAULT 1,
    sort_order INTEGER DEFAULT 0
)""", "sukarak_social_links")

# sukarak_blog_courses
ensure_table("""
CREATE TABLE IF NOT EXISTS sukarak_blog_courses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title_ar VARCHAR(255) NOT NULL,
    title_en VARCHAR(255),
    description_ar TEXT,
    description_en TEXT,
    url VARCHAR(1024) NOT NULL,
    icon VARCHAR(10),
    platform VARCHAR(50) DEFAULT 'udemy',
    active BOOLEAN DEFAULT 1,
    sort_order INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)""", "sukarak_blog_courses")

# sukarak_book_links
ensure_table("""
CREATE TABLE IF NOT EXISTS sukarak_book_links (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    book_title_ar VARCHAR(255) NOT NULL,
    book_title_en VARCHAR(255),
    country_code VARCHAR(5) NOT NULL,
    country_name_ar VARCHAR(100),
    country_name_en VARCHAR(100),
    url VARCHAR(1024) NOT NULL,
    flag_emoji VARCHAR(10),
    active BOOLEAN DEFAULT 1,
    sort_order INTEGER DEFAULT 0
)""", "sukarak_book_links")

# sukarak_consultation_packages (from membership.py ConsultationPackage)
ensure_table("""
CREATE TABLE IF NOT EXISTS sukarak_consultation_packages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name_ar VARCHAR(255) NOT NULL,
    name_en VARCHAR(255),
    description_ar TEXT,
    description_en TEXT,
    features_ar TEXT,
    features_en TEXT,
    price_eg REAL DEFAULT 0,
    price_sa REAL DEFAULT 0,
    price_ae REAL DEFAULT 0,
    price_om REAL DEFAULT 0,
    price_other REAL DEFAULT 0,
    duration VARCHAR(100),
    icon VARCHAR(10),
    is_giftable BOOLEAN DEFAULT 0,
    active BOOLEAN DEFAULT 1,
    sort_order INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)""", "sukarak_consultation_packages")

# sukarak_user_favorites
ensure_table("""
CREATE TABLE IF NOT EXISTS sukarak_user_favorites (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL REFERENCES sukarak_users(id),
    item_type VARCHAR(50) NOT NULL,
    item_id INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)""", "sukarak_user_favorites")

# sukarak_user_package_orders
ensure_table("""
CREATE TABLE IF NOT EXISTS sukarak_user_package_orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL REFERENCES sukarak_users(id),
    package_id VARCHAR(50) NOT NULL,
    package_name VARCHAR(255),
    amount REAL DEFAULT 0,
    currency VARCHAR(10) DEFAULT 'SAR',
    period VARCHAR(100),
    status VARCHAR(20) DEFAULT 'active',
    payment_method VARCHAR(50) DEFAULT 'direct',
    start_date VARCHAR(20),
    end_date VARCHAR(20),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)""", "sukarak_user_package_orders")

# food_db
ensure_table("""
CREATE TABLE IF NOT EXISTS food_db (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(255),
    serving VARCHAR(255),
    glycemic_index VARCHAR(50),
    calories VARCHAR(50),
    carb VARCHAR(50),
    protein VARCHAR(50),
    fats VARCHAR(50)
)""", "food_db")

# food_types
ensure_table("""
CREATE TABLE IF NOT EXISTS food_types (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(255),
    class VARCHAR(255)
)""", "food_types")

# sport_db
ensure_table("""
CREATE TABLE IF NOT EXISTS sport_db (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(255) NOT NULL,
    details TEXT
)""", "sport_db")

# ===== FIXED TABLE NAMES (were generic, now match SQLAlchemy models) =====

# sukarak_appointments (was: appointments)
ensure_table("""
CREATE TABLE IF NOT EXISTS sukarak_appointments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    doctor_id INTEGER NOT NULL REFERENCES sukarak_users(id),
    patient_id INTEGER NOT NULL REFERENCES sukarak_users(id),
    doctor_name VARCHAR(255),
    patient_name VARCHAR(255),
    appointment_type VARCHAR(20) DEFAULT 'video',
    status VARCHAR(20) DEFAULT 'scheduled',
    scheduled_at DATETIME NOT NULL,
    notes TEXT,
    duration_minutes INTEGER DEFAULT 30,
    session_request VARCHAR(20) DEFAULT 'none',
    session_room_id VARCHAR(100),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)""", "sukarak_appointments")

# banner (from cms.py)
ensure_table("""
CREATE TABLE IF NOT EXISTS banner (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title VARCHAR(255),
    image_url VARCHAR(1024),
    link VARCHAR(1024),
    active BOOLEAN DEFAULT 1,
    sort_order INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)""", "banner")

# notification (from cms.py)
ensure_table("""
CREATE TABLE IF NOT EXISTS notification (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title VARCHAR(255),
    body TEXT,
    type VARCHAR(50),
    user_id INTEGER,
    read BOOLEAN DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)""", "notification")

# appsetting (from cms.py)
ensure_table("""
CREATE TABLE IF NOT EXISTS appsetting (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    key VARCHAR(255) UNIQUE NOT NULL,
    value TEXT,
    updated_at DATETIME
)""", "appsetting")

# sukarak_activity_log (was: activitylog)
ensure_table("""
CREATE TABLE IF NOT EXISTS sukarak_activity_log (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER REFERENCES sukarak_users(id),
    user_name VARCHAR(255),
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50),
    entity_id INTEGER,
    entity_name VARCHAR(255),
    details TEXT,
    ip_address VARCHAR(50),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)""", "sukarak_activity_log")

# sukarak_permissions (was: permission)
ensure_table("""
CREATE TABLE IF NOT EXISTS sukarak_permissions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    role VARCHAR(50) NOT NULL,
    module VARCHAR(50) NOT NULL,
    can_view BOOLEAN DEFAULT 0,
    can_create BOOLEAN DEFAULT 0,
    can_edit BOOLEAN DEFAULT 0,
    can_delete BOOLEAN DEFAULT 0,
    can_approve BOOLEAN DEFAULT 0
)""", "sukarak_permissions")

# sukarak_medical_tests (was: medicaltest)
ensure_table("""
CREATE TABLE IF NOT EXISTS sukarak_medical_tests (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL REFERENCES sukarak_users(id),
    name VARCHAR(255) NOT NULL,
    lab VARCHAR(255),
    date VARCHAR(50),
    result VARCHAR(255),
    status VARCHAR(20) DEFAULT 'pending',
    notes TEXT,
    attachments TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)""", "sukarak_medical_tests")

# sukarak_nursing_services (was: nursingservice)
ensure_table("""
CREATE TABLE IF NOT EXISTS sukarak_nursing_services (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title VARCHAR(255) NOT NULL,
    title_en VARCHAR(255),
    price REAL DEFAULT 0,
    duration VARCHAR(50),
    icon VARCHAR(10),
    color VARCHAR(100),
    category VARCHAR(100) DEFAULT 'other',
    service_type VARCHAR(50) DEFAULT 'nursing',
    active INTEGER DEFAULT 1
)""", "sukarak_nursing_services")

# sukarak_nursing_bookings (was: nursingbooking)
ensure_table("""
CREATE TABLE IF NOT EXISTS sukarak_nursing_bookings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL REFERENCES sukarak_users(id),
    service_id INTEGER NOT NULL REFERENCES sukarak_nursing_services(id),
    service_name VARCHAR(255),
    date VARCHAR(50) NOT NULL,
    time VARCHAR(20),
    address VARCHAR(500) NOT NULL,
    notes TEXT,
    nurse_name VARCHAR(255),
    status VARCHAR(20) DEFAULT 'pending',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)""", "sukarak_nursing_bookings")

# ===== E-commerce tables (FIXED names to match models) =====

# sukarak_mazbot_products (was: product)
ensure_table("""
CREATE TABLE IF NOT EXISTS sukarak_mazbot_products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title VARCHAR(255) NOT NULL,
    details VARCHAR(512) NOT NULL,
    price NUMERIC(10,2) NOT NULL,
    offer_price NUMERIC(10,2) DEFAULT 0,
    stock INTEGER DEFAULT 0,
    img_url VARCHAR(512),
    category VARCHAR(255),
    sub_category VARCHAR(255),
    country VARCHAR(255) DEFAULT '[]',
    seller VARCHAR(255),
    brand VARCHAR(255),
    sku VARCHAR(100),
    offer_start_date DATETIME,
    offer_end_date DATETIME,
    status INTEGER DEFAULT 1,
    in_review INTEGER DEFAULT 0
)""", "sukarak_mazbot_products")

# sukarak_orders (was: order)
ensure_table("""
CREATE TABLE IF NOT EXISTS sukarak_orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_number VARCHAR(20) UNIQUE NOT NULL,
    user_id INTEGER NOT NULL REFERENCES sukarak_users(id),
    order_type VARCHAR(50),
    subtotal NUMERIC(10,2) NOT NULL,
    discount_amount NUMERIC(10,2) DEFAULT 0,
    total_amount NUMERIC(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'EGP',
    payment_status VARCHAR(50) DEFAULT 'pending',
    payment_method VARCHAR(50) DEFAULT 'card',
    payment_reference VARCHAR(100),
    status VARCHAR(50) DEFAULT 'pending',
    coupon_id VARCHAR(20),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
)""", "sukarak_orders")

# sukarak_order_items (was: orderitem)
ensure_table("""
CREATE TABLE IF NOT EXISTS sukarak_order_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id INTEGER NOT NULL REFERENCES sukarak_orders(id),
    item_type VARCHAR(50),
    service_type VARCHAR(50),
    service_name VARCHAR(255),
    product_id INTEGER REFERENCES sukarak_mazbot_products(id),
    product_name VARCHAR(255),
    product_category VARCHAR(100),
    quantity INTEGER DEFAULT 1,
    unit_price NUMERIC(10,2) NOT NULL,
    total_price NUMERIC(10,2) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)""", "sukarak_order_items")

# sukarak_coupons (was: coupon)
ensure_table("""
CREATE TABLE IF NOT EXISTS sukarak_coupons (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    coupon VARCHAR(255) UNIQUE NOT NULL,
    discount NUMERIC(5,2),
    reusable INTEGER DEFAULT 0,
    users TEXT DEFAULT '[]',
    max_uses INTEGER DEFAULT 0,
    active BOOLEAN DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)""", "sukarak_coupons")

# sukarak_gift_cards (was: giftcard)
ensure_table("""
CREATE TABLE IF NOT EXISTS sukarak_gift_cards (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id INTEGER NOT NULL REFERENCES sukarak_orders(id),
    code VARCHAR(20) UNIQUE NOT NULL,
    status INTEGER DEFAULT 0,
    used INTEGER DEFAULT 0,
    activated_at DATETIME
)""", "sukarak_gift_cards")

# sukarak_loyality_users (was: loyaltyuser) — note: typo kept to match model
ensure_table("""
CREATE TABLE IF NOT EXISTS sukarak_loyality_users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER UNIQUE REFERENCES sukarak_users(id),
    subscription_type VARCHAR(50) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL
)""", "sukarak_loyality_users")

# Seller tables (FIXED names to match models)
for tbl, sql in [
    ("sellernotification", """CREATE TABLE IF NOT EXISTS sellernotification (
        id INTEGER PRIMARY KEY AUTOINCREMENT, seller_id INTEGER, title VARCHAR(255),
        body TEXT, type VARCHAR(50), read BOOLEAN DEFAULT 0, created_at DATETIME DEFAULT CURRENT_TIMESTAMP)"""),
    ("orderstatushistory", """CREATE TABLE IF NOT EXISTS orderstatushistory (
        id INTEGER PRIMARY KEY AUTOINCREMENT, order_id INTEGER, old_status VARCHAR(20),
        new_status VARCHAR(20), changed_by INTEGER, notes TEXT, created_at DATETIME DEFAULT CURRENT_TIMESTAMP)"""),
    ("orderreturn", """CREATE TABLE IF NOT EXISTS orderreturn (
        id INTEGER PRIMARY KEY AUTOINCREMENT, order_id INTEGER, user_id INTEGER,
        reason TEXT, status VARCHAR(20) DEFAULT 'pending', created_at DATETIME DEFAULT CURRENT_TIMESTAMP)"""),
    ("sellerwallet", """CREATE TABLE IF NOT EXISTS sellerwallet (
        id INTEGER PRIMARY KEY AUTOINCREMENT, seller_id INTEGER UNIQUE,
        balance REAL DEFAULT 0, pending REAL DEFAULT 0, created_at DATETIME DEFAULT CURRENT_TIMESTAMP)"""),
    ("wallettransaction", """CREATE TABLE IF NOT EXISTS wallettransaction (
        id INTEGER PRIMARY KEY AUTOINCREMENT, wallet_id INTEGER, amount REAL,
        type VARCHAR(20), description TEXT, created_at DATETIME DEFAULT CURRENT_TIMESTAMP)"""),
    ("withdrawalrequest", """CREATE TABLE IF NOT EXISTS withdrawalrequest (
        id INTEGER PRIMARY KEY AUTOINCREMENT, seller_id INTEGER, amount REAL,
        status VARCHAR(20) DEFAULT 'pending', bank_info TEXT, created_at DATETIME DEFAULT CURRENT_TIMESTAMP)"""),
    ("sellersettings", """CREATE TABLE IF NOT EXISTS sellersettings (
        id INTEGER PRIMARY KEY AUTOINCREMENT, seller_id INTEGER UNIQUE,
        auto_accept BOOLEAN DEFAULT 0, notification_email BOOLEAN DEFAULT 1, created_at DATETIME DEFAULT CURRENT_TIMESTAMP)"""),
    ("sellerlicense", """CREATE TABLE IF NOT EXISTS sellerlicense (
        id INTEGER PRIMARY KEY AUTOINCREMENT, seller_id INTEGER,
        license_type VARCHAR(50), license_number VARCHAR(100), file_path VARCHAR(1024),
        status VARCHAR(20) DEFAULT 'pending', created_at DATETIME DEFAULT CURRENT_TIMESTAMP)"""),
]:
    ensure_table(sql, tbl)

# Support tables
ensure_table("""CREATE TABLE IF NOT EXISTS supportticket (
    id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER REFERENCES sukarak_users(id),
    subject VARCHAR(255), category VARCHAR(100), status VARCHAR(20) DEFAULT 'open',
    priority VARCHAR(20) DEFAULT 'normal', created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)""", "supportticket")

ensure_table("""CREATE TABLE IF NOT EXISTS ticketmessage (
    id INTEGER PRIMARY KEY AUTOINCREMENT, ticket_id INTEGER REFERENCES supportticket(id),
    sender_type VARCHAR(20), sender_id INTEGER, message TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)""", "ticketmessage")


print("\n--- Adding missing columns to existing tables ---")

# MedicalProfile - new columns
for col, ctype, default in [
    ("diagnosis_date", "VARCHAR(20)", None),
    ("blood_type", "VARCHAR(10)", None),
    ("hba1c", "VARCHAR(10)", None),
    ("insulin_type", "VARCHAR(255)", None),
    ("height", "VARCHAR(10)", None),
    ("chronic_diseases", "TEXT", None),
    ("emergency_contact", "VARCHAR(50)", None),
]:
    add_column_if_missing("sukarak_medical_profiles", col, ctype, default)

# SugarReading - unit column
add_column_if_missing("sugar_readings", "unit", "VARCHAR(20)", "'mg/dl'")

# DrugRecord - expanded fields
for col, ctype, default in [
    ("form", "VARCHAR(100)", None),
    ("frequency", "VARCHAR(100)", None),
    ("serving", "VARCHAR(100)", None),
    ("dosage_unit", "VARCHAR(50)", None),
    ("concentration", "VARCHAR(100)", None),
    ("concentration_unit", "VARCHAR(50)", None),
]:
    add_column_if_missing("drugs_records", col, ctype, default)

# User - seller fields and wallet
for col, ctype, default in [
    ("admin_display_name", "VARCHAR(255)", None),
    ("app_display_name", "VARCHAR(255)", None),
    ("seller_department", "VARCHAR(100)", None),
    ("seller_address", "TEXT", None),
    ("wallet_balance", "REAL", "0.0"),
    ("loyalty_points", "INTEGER", "0"),
    ("age", "VARCHAR(10)", None),
    ("weight", "VARCHAR(10)", None),
    ("country", "VARCHAR(255)", None),
]:
    add_column_if_missing("sukarak_users", col, ctype, default)

conn.commit()

# Print summary
print("\n--- Final table summary ---")
cur.execute("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name")
tables = [r[0] for r in cur.fetchall()]
for t in tables:
    cur.execute(f"SELECT COUNT(*) FROM [{t}]")
    count = cur.fetchone()[0]
    print(f"  {t}: {count} rows")

conn.close()
print("\n✅ Database migration complete!")
