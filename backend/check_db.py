import sqlite3, sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

db = sqlite3.connect('sukarak.db')
c = db.cursor()

# Tables
c.execute("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name")
print("TABLES:")
for r in c.fetchall():
    print(f"  {r[0]}")

# Bookings table
print("\nBOOKING TABLE:")
c.execute("PRAGMA table_info(sukarak_nursing_bookings)")
rows = c.fetchall()
if rows:
    for r in rows:
        print(f"  {r[1]} ({r[2]})")
else:
    print("  TABLE DOES NOT EXIST")

# Products table
print("\nPRODUCT TABLE:")
c.execute("PRAGMA table_info(sukarak_products)")
rows = c.fetchall()
for r in rows:
    print(f"  {r[1]} ({r[2]})")

# Check for seller with id=1
print("\nSELLER CHECK:")
try:
    c.execute("SELECT id, user_id, name FROM sukarak_sellers WHERE id=1")
    seller = c.fetchone()
    if seller:
        print(f"  Seller found: id={seller[0]}, user_id={seller[1]}, name={seller[2]}")
    else:
        print("  NO seller with id=1")
        c.execute("SELECT id, user_id, name FROM sukarak_sellers LIMIT 5")
        for s in c.fetchall():
            print(f"  Available: id={s[0]}, user_id={s[1]}, name={s[2]}")
except:
    print("  No sellers table")

# FK enforcement
print("\nFOREIGN KEYS:")
c.execute("PRAGMA foreign_keys")
fk = c.fetchone()
print(f"  Enabled: {fk[0] if fk else 'unknown'}")

db.close()
