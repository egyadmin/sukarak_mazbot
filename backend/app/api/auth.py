from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from datetime import timedelta, datetime
from typing import Dict, Any, Optional
import random
from app.db.session import SessionLocal
from app.core.config import settings
from app.core import security
from app.models.user import User
from app.models.cms import Notification
from app.schemas.user import UserCreate, UserResponse, Token

router = APIRouter()

# In-memory OTP store (for production, use Redis)
_otp_store: Dict[str, Dict[str, Any]] = {}  # {email: {"code": "123456", "expires": datetime}}

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/signup", response_model=UserResponse)
def signup(user_in: UserCreate, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == user_in.email).first()
    if user:
        raise HTTPException(
            status_code=400,
            detail="The user with this email already exists in the system.",
        )
    
    hashed_password = security.get_password_hash(user_in.password)
    db_user = User(
        email=user_in.email,
        name=user_in.name,
        password=hashed_password,
        phone=user_in.phone,
        login_method="email",
        is_active=True
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

@router.post("/login", response_model=Token)
def login(db: Session = Depends(get_db), form_data: OAuth2PasswordRequestForm = Depends()):
    try:
        print(f"Login attempt for: {form_data.username}")
        user = db.query(User).filter(User.email == form_data.username).first()
        if not user:
            print(f"User not found: {form_data.username}")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect email or password",
                headers={"WWW-Authenticate": "Bearer"},
            )
        
        if not user.is_active:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Account is deactivated",
            )
        
        if not user.password:
            print(f"User has no password set: {form_data.username}")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect email or password",
                headers={"WWW-Authenticate": "Bearer"},
            )

        if not security.verify_password(form_data.password, user.password):
            print(f"Invalid password for: {form_data.username}")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect email or password",
                headers={"WWW-Authenticate": "Bearer"},
            )
        
        access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
        token = security.create_access_token(
            user.id, expires_delta=access_token_expires
        )
        print(f"Login successful for: {form_data.username}")
        
        return {
            "access_token": token,
            "token_type": "bearer",
            "user": {
                "id": user.id,
                "name": user.name,
                "email": user.email,
                "role": user.role or "user",
                "phone": user.phone,
                "is_active": user.is_active,
            }
        }
    except Exception as e:
        import traceback
        print(f"LOGIN ERROR: {str(e)}")
        traceback.print_exc()
        raise e


@router.delete("/delete-account/{user_id}")
def delete_account(user_id: int, db: Session = Depends(get_db)):
    """Soft-delete user account - deactivates it instead of permanent deletion"""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Soft delete: deactivate the user
    user.is_active = False
    user.name = f"[deleted] {user.name}"
    db.commit()
    
    return {"message": "Account deleted successfully", "status": "deleted"}


@router.post("/google-auth")
def google_auth(data: dict, db: Session = Depends(get_db)):
    """Authenticate or register user via Google Sign-In."""
    email = data.get("email")
    name = data.get("name", "")
    google_id = data.get("google_id", "")
    photo = data.get("photo", "")
    
    if not email:
        raise HTTPException(status_code=400, detail="Email is required")
    
    # Check if user already exists
    user = db.query(User).filter(User.email == email).first()
    
    if user:
        is_new_user = False
        # Existing user - update info and login
        if not user.is_active:
            raise HTTPException(status_code=403, detail="Account is deactivated")
        if name and not user.name.startswith("[deleted]"):
            user.name = name
        if google_id and not user.firebase_uid:
            user.firebase_uid = google_id
        if photo:
            user.profile_image = photo
        user.login_method = "google"
        db.commit()
    else:
        # New user - create account
        user = User(
            email=email,
            name=name or email.split("@")[0],
            firebase_uid=google_id,
            login_method="google",
            profile_image=photo,
            is_active=True,
        )
        db.add(user)
        db.commit()
        db.refresh(user)
        is_new_user = True

        # Create welcome notification for Google sign-up
        welcome_notif = Notification(
            title="🎉 مرحباً بك في سكرك مضبوط!",
            message=f"أهلاً {user.name}! نحن سعداء بانضمامك عبر Google. استكشف خدماتنا المميزة في إدارة السكري والتحاليل والتمريض. صحتك تهمنا!",
            type="system",
            target_audience="user",
            is_active=True,
        )
        db.add(welcome_notif)
        db.commit()
    
    # Generate token
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    token = security.create_access_token(user.id, expires_delta=access_token_expires)
    
    return {
        "access_token": token,
        "token_type": "bearer",
        "is_new_user": is_new_user,
        "user": {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "role": user.role or "user",
            "phone": user.phone,
            "is_active": user.is_active,
            "profile_image": user.profile_image,
            "login_method": "google",
        }
    }


@router.post("/send-otp")
def send_otp(data: dict, db: Session = Depends(get_db)):
    """Generate and send OTP code to email for verification."""
    email = data.get("email")
    if not email:
        raise HTTPException(status_code=400, detail="Email is required")
    
    # Generate 6-digit OTP
    otp_code = str(random.randint(100000, 999999))
    _otp_store[email] = {
        "code": otp_code,
        "expires": datetime.now() + timedelta(minutes=10)
    }
    
    # In production, send email via SMTP/SendGrid/etc.
    # For now, we log it (and return it for testing)
    print(f"📧 OTP for {email}: {otp_code}")
    
    return {
        "status": "success",
        "message": "تم إرسال رمز التحقق إلى بريدك الإلكتروني",
        "otp_preview": otp_code  # Remove this in production!
    }


@router.post("/verify-otp")
def verify_otp(data: dict, db: Session = Depends(get_db)):
    """Verify OTP code and complete registration."""
    email = data.get("email")
    code = data.get("code")
    name = data.get("name", "")
    password = data.get("password", "")
    phone = data.get("phone", "")
    age = data.get("age", "")
    weight = data.get("weight", "")
    country = data.get("country", "")
    city = data.get("city", "")
    gender = data.get("gender", "")
    
    if not email or not code:
        raise HTTPException(status_code=400, detail="Email and OTP code are required")
    
    # Explicit cast for type checker (values are guaranteed non-None after check above)
    email_str: str = str(email)
    code_str: str = str(code)
    
    # Check OTP
    stored = _otp_store.get(email_str)
    if not stored:
        raise HTTPException(status_code=400, detail="رمز التحقق غير صالح أو منتهي الصلاحية")
    
    if stored["code"] != code_str:
        raise HTTPException(status_code=400, detail="رمز التحقق غير صحيح")
    
    if datetime.now() > stored["expires"]:
        _otp_store.pop(email_str, None)
        raise HTTPException(status_code=400, detail="رمز التحقق منتهي الصلاحية")
    
    # OTP is valid - clean up
    _otp_store.pop(email_str, None)
    
    # Check if user exists
    user = db.query(User).filter(User.email == email_str).first()
    
    if not user:
        # Create new user
        hashed = security.get_password_hash(password) if password else None
        user = User(
            email=email_str,
            name=name or email_str.split("@")[0],
            password=hashed,
            phone=phone or None,
            age=age or None,
            weight=weight or None,
            country=country or None,
            city=city or None,
            gender=gender or None,
            login_method="email",
            is_active=True,
        )
        db.add(user)
        db.commit()
        db.refresh(user)
        is_new_user = True

        # Create welcome notification
        welcome_notif = Notification(
            title="🎉 مرحباً بك في سكرك مضبوط!",
            message=f"أهلاً {user.name}! نحن سعداء بانضمامك. استكشف خدماتنا المميزة في إدارة السكري والتحاليل الطبية والتمريض المنزلي. صحتك تهمنا!",
            type="system",
            target_audience="user",
            is_active=True,
        )
        db.add(welcome_notif)
        db.commit()
    else:
        is_new_user = False
        if not user.is_active:
            raise HTTPException(status_code=403, detail="Account is deactivated")
    
    # Generate token
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    token = security.create_access_token(user.id, expires_delta=access_token_expires)
    
    return {
        "access_token": token,
        "token_type": "bearer",
        "is_new_user": is_new_user,
        "user": {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "role": user.role or "user",
            "phone": user.phone,
            "is_active": user.is_active,
        }
    }
