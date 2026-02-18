"""Remove duplicate foods from the food_types table, keeping only one of each food name per type/class."""
import sys
sys.path.insert(0, '.')
from app.db.session import SessionLocal
from sqlalchemy import text

db = SessionLocal()

try:
    # First, check how many duplicates exist
    total = db.execute(text("SELECT COUNT(*) FROM food_types")).scalar()
    unique = db.execute(text("SELECT COUNT(*) FROM (SELECT MIN(id) FROM food_types GROUP BY name, type, class)")).scalar()
    print(f"📊 إجمالي السجلات: {total}")
    print(f"📊 السجلات الفريدة: {unique}")
    print(f"📊 السجلات المكررة: {total - unique}")
    
    # Delete duplicates - keep the row with the minimum ID for each name+type+class combo
    result = db.execute(text("""
        DELETE FROM food_types 
        WHERE id NOT IN (
            SELECT MIN(id) FROM food_types GROUP BY name, type, class
        )
    """))
    deleted = result.rowcount
    db.commit()
    print(f"✅ تم حذف {deleted} طعام مكرر بنجاح!")
    
    # Show remaining
    remaining = db.execute(text("SELECT COUNT(*) FROM food_types")).scalar()
    print(f"📊 عدد الأطعمة المتبقية بعد التنظيف: {remaining}")
    
except Exception as e:
    db.rollback()
    print(f"❌ خطأ: {e}")
finally:
    db.close()
