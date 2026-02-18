# -*- coding: utf-8 -*-
"""Add new columns for lab/nursing features + create schedules table"""
import sqlite3, sys, io, os
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

db_path = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "sukarak.db")
print(f"DB: {db_path}")
conn = sqlite3.connect(db_path)
c = conn.cursor()

def add_col(table, col, coltype):
    try:
        base = coltype.split(" DEFAULT")[0].split(" default")[0].strip()
        c.execute(f"PRAGMA table_info({table})")
        existing = {r[1] for r in c.fetchall()}
        if col in existing:
            return False
        try:
            c.execute(f"ALTER TABLE {table} ADD COLUMN {col} {coltype}")
        except Exception:
            c.execute(f"ALTER TABLE {table} ADD COLUMN {col} {base}")
        print(f"  + {table}.{col}")
        return True
    except Exception as e:
        print(f"  ERR {table}.{col}: {e}")
        return False

n = 0

# User model - lab fields
print("\n=== sukarak_users ===")
for col, ct in {
    "lab_name": "VARCHAR(255)",
    "lab_address": "TEXT",
    "lab_license_number": "VARCHAR(100)",
    "nursing_center_name": "VARCHAR(255)",
    "nursing_address": "TEXT",
}.items():
    if add_col("sukarak_users", col, ct): n += 1

# NursingService - country prices + owner
print("\n=== sukarak_nursing_services ===")
for col, ct in {
    "price_eg": "FLOAT",
    "price_sa": "FLOAT",
    "price_ae": "FLOAT",
    "price_kw": "FLOAT",
    "owner_id": "INTEGER",
}.items():
    if add_col("sukarak_nursing_services", col, ct): n += 1

# NursingSchedule table
print("\n=== sukarak_nursing_schedules ===")
c.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='sukarak_nursing_schedules'")
if not c.fetchone():
    c.execute("""
        CREATE TABLE sukarak_nursing_schedules (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nurse_id INTEGER NOT NULL REFERENCES sukarak_users(id),
            date VARCHAR(50) NOT NULL,
            start_time VARCHAR(10) NOT NULL,
            end_time VARCHAR(10) NOT NULL,
            is_available BOOLEAN DEFAULT 1,
            notes TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    """)
    print("  + Created table sukarak_nursing_schedules")
    n += 1
else:
    print("  Table already exists")

conn.commit()
conn.close()
print(f"\nDone! {n} changes.")
