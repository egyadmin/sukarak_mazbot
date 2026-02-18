"""Add section column to sukarak_banners table"""
import sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

import sqlite3
import os

DB_PATH = os.path.join(os.path.dirname(__file__), "sukarak.db")
conn = sqlite3.connect(DB_PATH)
cur = conn.cursor()

# Check if column exists
cur.execute("PRAGMA table_info(sukarak_banners)")
columns = [col[1] for col in cur.fetchall()]

if "section" not in columns:
    print("Adding 'section' column to sukarak_banners...")
    cur.execute("ALTER TABLE sukarak_banners ADD COLUMN section VARCHAR(50) DEFAULT 'homepage'")
    conn.commit()
    print("   Done - Column added successfully")
else:
    print("   Column 'section' already exists")

conn.close()
print("Migration complete")
