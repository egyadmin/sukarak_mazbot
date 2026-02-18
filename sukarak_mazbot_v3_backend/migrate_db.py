"""Add missing columns to existing tables."""
import sys, os
sys.path.insert(0, os.path.dirname(__file__))

from app.db.session import engine
from sqlalchemy import text

def add_column_if_missing(conn, table, column, col_type, default=None):
    """Add a column if it doesn't exist."""
    try:
        cols = [r[1] for r in conn.execute(text(f"PRAGMA table_info({table})")).fetchall()]
        if column not in cols:
            default_clause = f" DEFAULT {default}" if default is not None else ""
            conn.execute(text(f"ALTER TABLE {table} ADD COLUMN {column} {col_type}{default_clause}"))
            print(f"  ✓ Added {table}.{column}")
        else:
            print(f"  • {table}.{column} already exists")
    except Exception as e:
        print(f"  ✗ Error adding {table}.{column}: {e}")

def main():
    print("=" * 60)
    print("  Adding missing columns...")
    print("=" * 60)
    
    with engine.connect() as conn:
        # sukarak_orders - missing columns
        add_column_if_missing(conn, "sukarak_orders", "payment_reference", "VARCHAR(100)")
        add_column_if_missing(conn, "sukarak_orders", "coupon_id", "VARCHAR(20)")
        add_column_if_missing(conn, "sukarak_orders", "updated_at", "TIMESTAMP")
        
        # sukarak_order_items - missing columns
        add_column_if_missing(conn, "sukarak_order_items", "service_type", "VARCHAR(50)")
        add_column_if_missing(conn, "sukarak_order_items", "service_name", "VARCHAR(255)")
        add_column_if_missing(conn, "sukarak_order_items", "product_category", "VARCHAR(100)")
        add_column_if_missing(conn, "sukarak_order_items", "created_at", "TIMESTAMP")
        
        conn.commit()
    
    print("\n  Done! All columns updated.\n")

if __name__ == "__main__":
    main()
