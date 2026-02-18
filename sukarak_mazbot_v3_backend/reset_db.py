"""Reset database: drop all tables, recreate, and seed."""
from app.db.session import engine
from app.db.base_class import Base
# Import ALL models so they register with Base
from app.models import user, ecommerce, health, cms, reference, activity

print("🗑️  Dropping all tables...")
Base.metadata.drop_all(bind=engine)
print("✅ All tables dropped.")

print("🔨 Creating all tables with new schema...")
Base.metadata.create_all(bind=engine)
print("✅ All tables created.")

print("\n🌱 Seeding data...")
from seed_data import seed_db
seed_db()
