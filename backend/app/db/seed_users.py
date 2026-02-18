from sqlalchemy.orm import Session
from app.models.user import User
from app.core.security import get_password_hash

def seed_users(db: Session):
    # Check if users already exist
    if db.query(User).count() > 0:
        return

    users_to_seed = [
        {
            "name": "Admin User",
            "email": "admin@sukarak.com",
            "password": "password123",
            "role": "admin",
            "phone": "01000000001",
            "is_active": True
        },
        {
            "name": "Doctor User",
            "email": "doctor@sukarak.com",
            "password": "password123",
            "role": "doctor",
            "phone": "01000000002",
            "is_active": True
        },
        {
            "name": "Nurse User",
            "email": "nurse@sukarak.com",
            "password": "password123",
            "role": "nurse",
            "phone": "01000000003",
            "is_active": True
        },
        {
            "name": "Seller User",
            "email": "seller@sukarak.com",
            "password": "password123",
            "role": "seller",
            "phone": "01000000004",
            "is_active": True,
            "admin_display_name": "Main Store",
            "app_display_name": "Sukarak Store",
            "seller_department": "diabetes_care"
        }
    ]

    for user_data in users_to_seed:
        hashed_password = get_password_hash(user_data["password"])
        db_user = User(
            name=user_data["name"],
            email=user_data["email"],
            password=hashed_password,
            role=user_data["role"],
            phone=user_data.get("phone"),
            is_active=user_data.get("is_active", True),
            admin_display_name=user_data.get("admin_display_name"),
            app_display_name=user_data.get("app_display_name"),
            seller_department=user_data.get("seller_department")
        )
        db.add(db_user)
    
    db.commit()
    print("Users seeded successfully.")
