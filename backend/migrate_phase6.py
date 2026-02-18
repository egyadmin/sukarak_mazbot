"""
Phase 6 Database Migration
Adds new tables and columns for:
- Product multi-image support (images column)
- Product returnable flag
- Membership service usage tracking table
- Marketing messages table
"""
import sqlite3
import os

DB_PATH = os.path.join(os.path.dirname(__file__), "sukarak.db")


def migrate():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    print("Phase 6 Migration Starting...")

    # 1. Add 'images' column to products table
    try:
        cursor.execute("ALTER TABLE sukarak_mazbot_products ADD COLUMN images TEXT DEFAULT '[]'")
        print("[OK] Added 'images' column to products")
    except sqlite3.OperationalError as e:
        if "duplicate column" in str(e).lower():
            print("[SKIP] 'images' column already exists")
        else:
            print(f"[ERR] {e}")

    # 2. Add 'returnable' column to products table
    try:
        cursor.execute("ALTER TABLE sukarak_mazbot_products ADD COLUMN returnable BOOLEAN DEFAULT 1")
        print("[OK] Added 'returnable' column to products")
    except sqlite3.OperationalError as e:
        if "duplicate column" in str(e).lower():
            print("[SKIP] 'returnable' column already exists")
        else:
            print(f"[ERR] {e}")

    # 3. Create membership service usage table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS sukarak_membership_usage (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            membership_id INTEGER NOT NULL,
            service_type VARCHAR(50) NOT NULL,
            service_name VARCHAR(255),
            original_price REAL DEFAULT 0,
            discounted_price REAL DEFAULT 0,
            discount_amount REAL DEFAULT 0,
            reference_id INTEGER,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES sukarak_users(id),
            FOREIGN KEY (membership_id) REFERENCES sukarak_user_memberships(id)
        )
    """)
    print("[OK] Created sukarak_membership_usage table")

    # 4. Create marketing messages table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS sukarak_marketing_messages (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title VARCHAR(255) NOT NULL,
            body TEXT NOT NULL,
            channel VARCHAR(20) NOT NULL DEFAULT 'push',
            target_audience VARCHAR(50) DEFAULT 'all',
            image_url VARCHAR(512),
            link_url VARCHAR(512),
            scheduled_at DATETIME,
            sent_at DATETIME,
            status VARCHAR(20) DEFAULT 'draft',
            sent_count INTEGER DEFAULT 0,
            opened_count INTEGER DEFAULT 0,
            created_by INTEGER,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (created_by) REFERENCES sukarak_users(id)
        )
    """)
    print("[OK] Created sukarak_marketing_messages table")

    conn.commit()

    # Verify
    print("\n--- Verification ---")
    cursor.execute("PRAGMA table_info(sukarak_mazbot_products)")
    cols = [c[1] for c in cursor.fetchall()]
    print(f"Products columns: {', '.join(cols)}")
    assert "images" in cols, "images column missing!"
    assert "returnable" in cols, "returnable column missing!"

    cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name LIKE 'sukarak_m%'")
    tables = [t[0] for t in cursor.fetchall()]
    print(f"Tables matching sukarak_m*: {', '.join(tables)}")

    conn.close()
    print("\nPhase 6 Migration Complete!")


if __name__ == "__main__":
    migrate()
