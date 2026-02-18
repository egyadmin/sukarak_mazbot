import sqlite3
import os

db_path = os.path.join(os.path.dirname(__file__), 'sukarak.db')
print(f"DB path: {db_path}")
print(f"DB exists: {os.path.exists(db_path)}")
print(f"DB size: {os.path.getsize(db_path)} bytes")
print()

conn = sqlite3.connect(db_path)
cur = conn.cursor()

# List all tables
cur.execute("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name")
tables = [r[0] for r in cur.fetchall()]
print(f"Tables ({len(tables)}):")
for t in tables:
    cur.execute(f"SELECT COUNT(*) FROM [{t}]")
    count = cur.fetchone()[0]
    print(f"  {t}: {count} rows")

print("\n--- Schema for key tables ---")
for table in ['sukarak_users', 'sukarak_medical_profiles', 'sukarak_membership_cards',
              'sugar_readings', 'insulin_records', 'excercise_records', 'meal_records',
              'drugs_records', 'medicine_reminders', 'food_db', 'food_types',
              'sukarak_consultation_packages', 'appointments']:
    if table in tables:
        cur.execute(f"PRAGMA table_info([{table}])")
        cols = cur.fetchall()
        print(f"\n{table}:")
        for c in cols:
            print(f"  {c[1]} ({c[2]}) {'NOT NULL' if c[3] else ''} {'PK' if c[5] else ''}")

conn.close()
