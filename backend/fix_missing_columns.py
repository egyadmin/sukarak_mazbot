"""
Comprehensive migration: add ALL missing columns to ALL tables.
Compares SQLAlchemy models with actual DB schema.
"""
import sqlite3
import os

db_path = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "sukarak.db")
if not os.path.exists(db_path):
    db_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "sukarak.db")

print(f"DB path: {db_path}")
conn = sqlite3.connect(db_path)
c = conn.cursor()

def get_columns(table):
    c.execute(f'PRAGMA table_info("{table}")')
    return [row[1] for row in c.fetchall()]

def table_exists(table):
    c.execute(f'SELECT name FROM sqlite_master WHERE type="table" AND name="{table}"')
    return c.fetchone() is not None

def add_col(table, column, col_type, default=None):
    cols = get_columns(table)
    if column not in cols:
        default_str = f" DEFAULT {default}" if default is not None else ""
        sql = f'ALTER TABLE "{table}" ADD COLUMN "{column}" {col_type}{default_str}'
        print(f"  + {table}.{column} ({col_type}{default_str})")
        c.execute(sql)
        return True
    return False

# ===== sukarak_mazbot_products =====
print("\n--- sukarak_mazbot_products ---")
add_col("sukarak_mazbot_products", "images", "TEXT", "'[]'")
add_col("sukarak_mazbot_products", "returnable", "INTEGER", "1")

# ===== sukarak_banners =====
print("\n--- sukarak_banners ---")
add_col("sukarak_banners", "target_type", "TEXT", "'internal'")
add_col("sukarak_banners", "section", "TEXT", "'homepage'")

# ===== sukarak_notifications =====
print("\n--- sukarak_notifications ---")
add_col("sukarak_notifications", "details", "TEXT", "''")
add_col("sukarak_notifications", "image_url", "TEXT", "NULL")
add_col("sukarak_notifications", "type", "TEXT", "'general'")
add_col("sukarak_notifications", "target", "TEXT", "'all'")
add_col("sukarak_notifications", "is_read", "INTEGER", "0")
add_col("sukarak_notifications", "active", "INTEGER", "1")

# ===== sukarak_coupons =====
print("\n--- sukarak_coupons ---")
add_col("sukarak_coupons", "applicable_sections", "TEXT", "'[]'")
add_col("sukarak_coupons", "vip_only", "INTEGER", "0")

# ===== sukarak_settings =====
print("\n--- sukarak_settings ---")
if table_exists("sukarak_settings"):
    add_col("sukarak_settings", "label", "TEXT", "NULL")
    add_col("sukarak_settings", "setting_group", "TEXT", "'general'")
    add_col("sukarak_settings", "type", "TEXT", "'text'")

conn.commit()
print("\n=== All columns synced! ===")

# Also check and print which tables exist
c.execute("SELECT name FROM sqlite_master WHERE type='table' AND name LIKE 'sukarak%' ORDER BY name")
tables = [row[0] for row in c.fetchall()]
print(f"\nSukarak tables: {tables}")

conn.close()
print("Done!")
