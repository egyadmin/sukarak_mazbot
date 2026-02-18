# -*- coding: utf-8 -*-
"""Comprehensive DB schema fixer - adds ALL missing columns"""
import sqlite3, sys, io, os
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

config_file = os.path.abspath(os.path.join("app", "core", "config.py"))
_backend_dir = os.path.dirname(os.path.dirname(os.path.dirname(config_file)))
_project_root = os.path.dirname(_backend_dir)
db_path = os.path.join(_project_root, "sukarak.db")

print(f"DB Path: {db_path}")
conn = sqlite3.connect(db_path)
c = conn.cursor()

def get_columns(table):
    c.execute(f"PRAGMA table_info({table})")
    return {row[1] for row in c.fetchall()}

def table_exists(table):
    c.execute("SELECT name FROM sqlite_master WHERE type='table' AND name=?", (table,))
    return c.fetchone() is not None

def add_col(table, col, coltype):
    if not table_exists(table):
        print(f"  SKIP: table {table} not found")
        return False
    existing = get_columns(table)
    if col not in existing:
        try:
            c.execute(f"ALTER TABLE {table} ADD COLUMN {col} {coltype}")
            print(f"  ADDED: {table}.{col} ({coltype})")
            return True
        except Exception as e:
            # SQLite doesn't allow non-constant defaults, try without default
            try:
                base_type = coltype.split(" DEFAULT")[0].split(" default")[0].strip()
                c.execute(f"ALTER TABLE {table} ADD COLUMN {col} {base_type}")
                print(f"  ADDED: {table}.{col} ({base_type}) [without default]")
                return True
            except Exception as e2:
                print(f"  ERROR: {table}.{col}: {e2}")
                return False
    return False

changes = 0

# === sukarak_users ===
print("\n=== sukarak_users ===")
for col, ct in {
    "city": "VARCHAR(255)", "gender": "VARCHAR(20)",
    "firebase_uid": "VARCHAR(255)", "admin_display_name": "VARCHAR(255)",
    "app_display_name": "VARCHAR(255)", "seller_department": "VARCHAR(100)",
    "seller_address": "TEXT", "wallet_balance": "FLOAT DEFAULT 0.0",
    "loyalty_points": "INTEGER DEFAULT 0", "profile_image": "VARCHAR(1024)",
}.items():
    if add_col("sukarak_users", col, ct): changes += 1

# === sukarak_mazbot_products ===
print("\n=== sukarak_mazbot_products ===")
for col, ct in {
    "images": "TEXT DEFAULT '[]'", "brand": "VARCHAR(255)", "sku": "VARCHAR(100)",
    "offer_start_date": "DATETIME", "offer_end_date": "DATETIME",
    "returnable": "BOOLEAN DEFAULT 1", "in_review": "INTEGER DEFAULT 0",
    "sub_category": "VARCHAR(255)",
}.items():
    if add_col("sukarak_mazbot_products", col, ct): changes += 1

# === sukarak_nursing_services ===
print("\n=== sukarak_nursing_services ===")
for col, ct in {
    "description": "TEXT", "title_en": "VARCHAR(255)",
    "service_type": "VARCHAR(50) DEFAULT 'nursing'",
    "active": "INTEGER DEFAULT 1",
}.items():
    if add_col("sukarak_nursing_services", col, ct): changes += 1

# === sukarak_orders ===
print("\n=== sukarak_orders ===")
for col, ct in {
    "seller_id": "INTEGER", "order_type": "VARCHAR(20) DEFAULT 'delivery'",
    "shipping_address": "TEXT", "coupon_code": "VARCHAR(50)",
    "discount_amount": "NUMERIC(10,2) DEFAULT 0",
}.items():
    if add_col("sukarak_orders", col, ct): changes += 1

# === sukarak_medical_profiles ===
print("\n=== sukarak_medical_profiles ===")
for col, ct in {
    "diabetes_type": "VARCHAR(50)", "diagnosis_date": "VARCHAR(50)",
    "blood_type": "VARCHAR(10)", "allergies": "TEXT",
    "medications": "TEXT", "emergency_contact": "VARCHAR(255)",
    "emergency_phone": "VARCHAR(50)", "doctor_name": "VARCHAR(255)",
    "doctor_phone": "VARCHAR(50)", "notes": "TEXT",
    "attachments": "TEXT",
}.items():
    if add_col("sukarak_medical_profiles", col, ct): changes += 1

conn.commit()

# ============ Test bcrypt login ============
print(f"\n=== Test bcrypt Password ===")
c.execute("SELECT password FROM sukarak_users WHERE email='admin@sukarak.com'")
row = c.fetchone()
if row and row[0]:
    pw_hash = row[0]
    print(f"Hash: {pw_hash[:30]}...")
    try:
        import bcrypt
        result = bcrypt.checkpw("admin123".encode('utf-8'), pw_hash.encode('utf-8'))
        print(f"Password 'admin123' matches: {result}")
        if not result:
            for pw in ["Admin123", "Admin@123", "123456", "password", "admin", "sukarak123", "Sukarak123"]:
                if bcrypt.checkpw(pw.encode('utf-8'), pw_hash.encode('utf-8')):
                    print(f"  >>> Correct password: {pw}")
                    break
            else:
                print("  Could not guess password - resetting to 'admin123'")
                new_hash = bcrypt.hashpw("admin123".encode('utf-8'), bcrypt.gensalt(rounds=12)).decode('utf-8')
                c.execute("UPDATE sukarak_users SET password=? WHERE email='admin@sukarak.com'", (new_hash,))
                conn.commit()
                print("  >>> Password reset to 'admin123'")
    except Exception as e:
        print(f"bcrypt error: {e}")
        import traceback
        traceback.print_exc()
else:
    print("No admin password found - setting to 'admin123'")
    import bcrypt
    new_hash = bcrypt.hashpw("admin123".encode('utf-8'), bcrypt.gensalt(rounds=12)).decode('utf-8')
    c.execute("UPDATE sukarak_users SET password=? WHERE email='admin@sukarak.com'", (new_hash,))
    conn.commit()
    print("Password set!")

conn.close()
print(f"\nTotal: {changes} columns added")
print("DONE!")
