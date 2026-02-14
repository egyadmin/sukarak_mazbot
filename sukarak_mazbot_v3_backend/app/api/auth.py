from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from datetime import timedelta, datetime
import random
from app.db.session import SessionLocal
from app.core.config import settings
from app.core import security
from app.models.user import User
from app.schemas.user import UserCreate, UserResponse, Token

router = APIRouter()

# In-memory OTP store (for production, use Redis)
_otp_store = {}  # {email: {"code": "123456", "expires": datetime}}

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
    
    # Generate token
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    token = security.create_access_token(user.id, expires_delta=access_token_expires)
    
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
    
    if not email or not code:
        raise HTTPException(status_code=400, detail="Email and OTP code are required")
    
    # Check OTP
    stored = _otp_store.get(email)
    if not stored:
        raise HTTPException(status_code=400, detail="رمز التحقق غير صالح أو منتهي الصلاحية")
    
    if stored["code"] != code:
        raise HTTPException(status_code=400, detail="رمز التحقق غير صحيح")
    
    if datetime.now() > stored["expires"]:
        del _otp_store[email]
        raise HTTPException(status_code=400, detail="رمز التحقق منتهي الصلاحية")
    
    # OTP is valid - clean up
    del _otp_store[email]
    
    # Check if user exists
    user = db.query(User).filter(User.email == email).first()
    
    if not user:
        # Create new user
        hashed = security.get_password_hash(password) if password else None
        user = User(
            email=email,
            name=name or email.split("@")[0],
            password=hashed,
            login_method="email",
            is_active=True,
        )
        db.add(user)
        db.commit()
        db.refresh(user)
    else:
        if not user.is_active:
            raise HTTPException(status_code=403, detail="Account is deactivated")
    
    # Generate token
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    token = security.create_access_token(user.id, expires_delta=access_token_expires)
    
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
