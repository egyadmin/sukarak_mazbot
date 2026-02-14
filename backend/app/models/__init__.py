# models __init__.py - import all models
from app.models.user import User
from app.models.ecommerce import Product, Order, OrderItem, Coupon, GiftCard, LoyaltyUser
from app.models.health import SugarReading, InsulinRecord, ExerciseRecord, MealRecord, DrugRecord
from app.models.cms import Banner, Notification, AppSetting
from app.models.reference import SportReference, FoodReference, FoodType
from app.models.services import MedicalTest, NursingService, NursingBooking
from app.models.activity import ActivityLog, Permission, Appointment
from app.models.membership import (
    MembershipCard, UserMembership, SocialLink, BlogCourse,
    BookLink, MedicalProfile, ConsultationPackage, UserFavorite
)
from app.models.seller import (
    SellerNotification, OrderStatusHistory, OrderReturn,
    SellerWallet, WalletTransaction, WithdrawalRequest,
    SellerSettings, SellerLicense
)

