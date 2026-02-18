import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
    en: {
        translation: {
            "welcome": "Welcome to Sukarak Mazboot",
            "home": "Home",
            "reports": "Reports",
            "appointments": "Appointments",
            "profile": "Profile",
            "market": "Market",
            "health_tracking": "Health Tracking",
            "sugar_reading": "Your Readings Log",
            "weight": "Weight",
            "insulin": "Your Medications Log",
            "exercise": "Your Exercises Log",
            "meals": "Your Meals Log",
            "change_language": "العربية",
            "login": "Login",
            "signup": "Sign Up",
            "fasting": "Fasting",
            "after_meal": "After Meal",
            "active": "Active",
            "history": "History",
            "recent_readings": "Recent Readings",
        }
    },
    ar: {
        translation: {
            "welcome": "مرحباً بك في سكرك مظبوط",
            "home": "الرئيسية",
            "reports": "التقارير",
            "appointments": "المواعيد",
            "profile": "الحساب",
            "market": "المتجر",
            "health_tracking": "تابع صحتك",
            "sugar_reading": "سجل قراءاتك",
            "weight": "الوزن",
            "insulin": "سجل أدويتك",
            "exercise": "سجل رياضاتك",
            "meals": "سجل وجباتك",
            "change_language": "English",
            "login": "تسجيل الدخول",
            "signup": "إنشاء حساب",
            "fasting": "صائم",
            "after_meal": "بعد الأكل",
            "active": "نشط",
            "history": "السجل",
            "recent_readings": "آخر القراءات",
        }
    }
};

i18n
    .use(initReactI18next)
    .init({
        resources,
        lng: "ar", // default language
        interpolation: {
            escapeValue: false
        }
    });

export default i18n;
