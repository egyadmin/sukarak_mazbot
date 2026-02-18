import sqlite3
conn = sqlite3.connect('sukarak.db')
cursor = conn.cursor()
# Check for schedule table
tables = cursor.execute("SELECT name FROM sqlite_master WHERE type='table'").fetchall()
print("All tables:", [t[0] for t in tables])
schedule_tables = [t[0] for t in tables if 'schedule' in t[0].lower()]
print("Schedule tables:", schedule_tables)
if schedule_tables:
    for t in schedule_tables:
        cols = cursor.execute(f"PRAGMA table_info({t})").fetchall()
        print(f"\nColumns in {t}:")
        for c in cols:
            print(f"  {c[1]} ({c[2]})")
        rows = cursor.execute(f"SELECT COUNT(*) FROM {t}").fetchone()
        print(f"  Row count: {rows[0]}")
conn.close()
