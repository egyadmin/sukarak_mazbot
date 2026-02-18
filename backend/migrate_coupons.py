"""Add applicable_sections and vip_only columns to sukarak_coupons table."""
import sqlite3

conn = sqlite3.connect("sukarak.db")
cur = conn.cursor()

# Check existing columns
cur.execute("PRAGMA table_info(sukarak_coupons)")
existing = [r[1] for r in cur.fetchall()]
print("Existing columns:", existing)

if "applicable_sections" not in existing:
    cur.execute("ALTER TABLE sukarak_coupons ADD COLUMN applicable_sections TEXT DEFAULT '[]'")
    print("[OK] Added applicable_sections column")
else:
    print("[SKIP] applicable_sections already exists")

if "vip_only" not in existing:
    cur.execute("ALTER TABLE sukarak_coupons ADD COLUMN vip_only BOOLEAN DEFAULT 0")
    print("[OK] Added vip_only column")
else:
    print("[SKIP] vip_only already exists")

# Update existing coupons with section targeting
cur.execute("UPDATE sukarak_coupons SET applicable_sections = '[\"store\",\"lab\",\"nursing\"]' WHERE coupon = 'WELCOME10'")
cur.execute("UPDATE sukarak_coupons SET applicable_sections = '[\"appointments\"]' WHERE coupon = 'NEW50'")
cur.execute("UPDATE sukarak_coupons SET applicable_sections = '[\"lab\"]' WHERE coupon = 'HEALTH15'")

# Add VIP25 coupon if not exists
cur.execute("SELECT COUNT(*) FROM sukarak_coupons WHERE coupon = 'VIP25'")
if cur.fetchone()[0] == 0:
    cur.execute("INSERT INTO sukarak_coupons (coupon, discount, reusable, users, max_uses, active, applicable_sections, vip_only) VALUES ('VIP25', 25.0, 1, '[]', 0, 1, '[]', 1)")
    print("[OK] Added VIP25 coupon")
else:
    print("[SKIP] VIP25 already exists")

conn.commit()

# Verify
cur.execute("SELECT coupon, discount, applicable_sections, vip_only FROM sukarak_coupons")
print("\nCurrent coupons:")
for row in cur.fetchall():
    print(f"   {row[0]}: {row[1]}% | sections: {row[2]} | vip: {row[3]}")

conn.close()
print("\nMigration complete!")
