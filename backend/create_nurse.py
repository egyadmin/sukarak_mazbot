from app.db.session import SessionLocal
from app.models.user import User
import bcrypt

def create_initial_nurse():
    db = SessionLocal()
    try:
        # Check if exists
        existing = db.query(User).filter(User.email == "nurse@sukarak.com").first()
        if existing:
            print(f"Nurse already exists: {existing.name}")
            return
            
        hashed = bcrypt.hashpw("Nurse123456".encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
        nurse = User(
            name="ممرض تجريبي (أحمد علي)",
            email="nurse@sukarak.com",
            phone="01234567890",
            password=hashed,
            role="nurse",
            is_active=True,
            login_method="email"
        )
        db.add(nurse)
        db.commit()
        print("✅ Success: Nurse user created!")
    except Exception as e:
        print(f"❌ Error: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    create_initial_nurse()
