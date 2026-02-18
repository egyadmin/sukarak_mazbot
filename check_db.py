import sqlite3
import os

# Check both database files
for db_path in ["backend/sukarak.db", "sukarak.db"]:
    full_path = os.path.join(r"e:\Sukarak-Mazbot\Sukarak-Mazbot", db_path)
    if not os.path.exists(full_path):
        print(f"\n❌ {db_path} - NOT FOUND")
        continue
    
    size = os.path.getsize(full_path)
    print(f"\n✅ {db_path} - Size: {size} bytes")
    
    conn = sqlite3.connect(full_path)
    c = conn.cursor()
    
    # List tables
    c.execute("SELECT name FROM sqlite_master WHERE type='table'")
    tables = [t[0] for t in c.fetchall()]
    print(f"   Tables ({len(tables)}): {tables}")
    
    # Count rows in each table
    for table in tables:
        try:
            c.execute(f"SELECT COUNT(*) FROM [{table}]")
            count = c.fetchone()[0]
            if count > 0:
                print(f"   📊 {table}: {count} rows")
        except:
            pass
    
    conn.close()
