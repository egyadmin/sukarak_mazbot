"""Seed doctors and fix data"""
from app.db.session import SessionLocal
from app.models.user import User
import bcrypt

db = SessionLocal()
pw = bcrypt.hashpw("doctor123".encode(), bcrypt.gensalt()).decode()

doctors_data = [
    {"name": "د. خالد العمري", "email": "dr.khalid@sukarak.com", "phone": "0555001001", "shape": "استشاري غدد صماء", "age": "45", "country": "sa"},
    {"name": "د. سارة الأحمد", "email": "dr.sara@sukarak.com", "phone": "0555002002", "shape": "أخصائية تغذية", "age": "38", "country": "sa"},
    {"name": "د. فاطمة حسن", "email": "dr.fatma@sukarak.com", "phone": "0555004004", "shape": "أخصائية سكري", "age": "42", "country": "eg"},
]

for dd in doctors_data:
    exists = db.query(User).filter(User.email == dd["email"]).first()
    if not exists:
        u = User(
            name=dd["name"], email=dd["email"], phone=dd["phone"],
            password=pw, age=dd["age"], country=dd["country"],
            shape=dd["shape"], role="doctor", is_active=True, login_method="email"
        )
        db.add(u)
        print("Created:", dd["name"])
    else:
        print("Exists:", dd["name"])

# Fix existing doctor without specialization
d58 = db.query(User).filter(User.id == 58).first()
if d58 and not d58.shape:
    d58.shape = "طب باطني"
    print("Updated specialization for", d58.name)

db.commit()

# Show all doctors
all_docs = db.query(User).filter(User.role == "doctor").all()
print(f"\nTotal doctors: {len(all_docs)}")
for d in all_docs:
    print(f"  ID:{d.id} {d.name} ({d.shape})")

db.close()
print("\nDone!")
