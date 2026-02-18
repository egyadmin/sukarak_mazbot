"""Fix the actual database used by the backend"""
import sqlite3
import sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

import os

# The backend uses the DB at the PROJECT ROOT, not in backend/
DB_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "sukarak.db")
DB_PATH = os.path.normpath(DB_PATH)
print(f"Using DB: {DB_PATH}")

conn = sqlite3.connect(DB_PATH)
cur = conn.cursor()

# 1. Add missing columns to sukarak_appointments
print("\n--- Fixing sukarak_appointments table ---")
existing = [row[1] for row in cur.execute("PRAGMA table_info(sukarak_appointments)").fetchall()]
print(f"Existing columns: {existing}")

if "session_request" not in existing:
    cur.execute("ALTER TABLE sukarak_appointments ADD COLUMN session_request VARCHAR(20) DEFAULT 'none'")
    print("  Added session_request column")
else:
    print("  session_request already exists")

if "session_room_id" not in existing:
    cur.execute("ALTER TABLE sukarak_appointments ADD COLUMN session_room_id VARCHAR(100)")
    print("  Added session_room_id column")
else:
    print("  session_room_id already exists")

conn.commit()

# Verify
print("\nVerification:")
for row in cur.execute("PRAGMA table_info(sukarak_appointments)").fetchall():
    print(f"  {row}")

conn.close()
print("\nDone!")
