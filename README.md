<div align="center">

# 🩺 سكرك مضبوط | Sukarak Mazbot V3

### Smart Diabetes Management Platform
### منصة إدارة السكري الذكية

<img src="logo.png" alt="Sukarak Mazbot Logo" width="180" />

<br/>

[![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/Frontend-React_19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![SQLite](https://img.shields.io/badge/Database-SQLite-003B57?style=for-the-badge&logo=sqlite&logoColor=white)](https://www.sqlite.org/)
[![Capacitor](https://img.shields.io/badge/Mobile-Capacitor-119EFF?style=for-the-badge&logo=capacitor&logoColor=white)](https://capacitorjs.com/)
[![License](https://img.shields.io/badge/License-Proprietary-red?style=for-the-badge)](#-الترخيص--license)

<br/>

**تطبيق متكامل لإدارة مرض السكري بذكاء — يدعم العربية والإنجليزية**

*A comprehensive smart diabetes management app — supporting Arabic & English*

<br/>

[📖 Technical Blueprint](ARCHITECTURE_BLUEPRINT.md) · [🛠️ Setup Guide](SETUP_GUIDE.md)

---

</div>

## 👨‍💻 المطور | Developer

<table>
<tr>
<td align="center">
<b>Tamer ElGohary</b><br/>
<sub>Lead Developer & System Architect</sub><br/>
<a href="https://github.com/egyadmin">
<img src="https://img.shields.io/badge/GitHub-@egyadmin-181717?style=flat&logo=github" />
</a>
</td>
</tr>
</table>

> ⚠️ **هذا المشروع ملكية خاصة.** لا يجوز نسخه أو تعديله أو توزيعه بأي شكل من الأشكال بدون إذن كتابي مسبق من المطور.

---

## 📋 نظرة عامة | Overview

**سكرك مضبوط** هو منصة رقمية شاملة لإدارة مرض السكري تجمع بين:

| الميزة | الوصف |
|--------|-------|
| 📊 **متابعة السكر** | تسجيل ومتابعة قراءات السكر مع رسوم بيانية |
| 💊 **إدارة الأدوية** | تتبع الأدوية والتذكيرات |
| 🛒 **متجر إلكتروني** | منتجات طبية متخصصة |
| 📅 **حجز المواعيد** | مواعيد طبية مع إشعارات |
| 🤖 **مساعد ذكاء اصطناعي** | استشارات صحية ذكية |
| 👨‍⚕️ **خدمات طبية** | تمريض منزلي وفحوصات |
| 💰 **محفظة رقمية** | رصيد ونقاط ولاء |
| 📱 **تطبيق موبايل** | Android & iOS |
| 👨‍💼 **لوحة تحكم الأدمن** | إدارة شاملة للنظام |
| 🩺 **لوحة تحكم الطبيب** | إدارة المرضى والمواعيد |
| 🏪 **لوحة تحكم التاجر** | إدارة المنتجات والطلبات |
| 👩‍⚕️ **لوحة تحكم التمريض** | إدارة خدمات التمريض المنزلي |

---

## 📸 لقطات من التطبيق | Screenshots

### 🔐 صفحة تسجيل الدخول | Login Page
> تسجيل دخول بالبريد الإلكتروني أو حساب Google مع شعار متحرك وتصميم عصري

### 🏠 الصفحة الرئيسية | Home Page
> عرض قراءات السكر والتذكيرات والعروض والوصول السريع لأقسام التطبيق

### 📊 لوحة التحكم | Admin Dashboard
> إدارة شاملة: مستخدمين، طلبات، منتجات، أرصدة، تقارير، إشعارات

### 🛍️ المتجر | Store
> منتجات طبية متخصصة مع تصنيفات وسلة مشتريات وخصومات

### 👤 البروفايل | Profile
> الملف الشخصي مع المحفظة ونقاط الولاء والسجل الطبي

---

## 🏗️ هيكل المشروع | Project Structure

```
sukarak-mazbot-v3/
│
├── 📁 sukarak_mazbot_v3_backend/          # ⚙️ FastAPI Backend Server
│   ├── app/
│   │   ├── api/                           # 🔌 API Endpoints
│   │   │   ├── admin.py                   #    └─ Admin Dashboard API
│   │   │   ├── auth.py                    #    └─ Authentication (Email + Google OAuth)
│   │   │   ├── health.py                  #    └─ Health Profile & Sugar Readings
│   │   │   ├── ecommerce.py               #    └─ Store, Cart, Orders
│   │   │   ├── seller.py                  #    └─ Seller Dashboard API
│   │   │   ├── nursing.py                 #    └─ Nursing Services API
│   │   │   ├── services.py                #    └─ Medical Services API
│   │   │   ├── membership.py              #    └─ Memberships & Loyalty Cards
│   │   │   ├── chat.py                    #    └─ Real-time Chat & Communication
│   │   │   ├── support.py                 #    └─ Customer Support
│   │   │   └── payments.py                #    └─ Payment Processing
│   │   ├── core/
│   │   │   ├── config.py                  #    └─ App Configuration
│   │   │   └── security.py                #    └─ JWT & bcrypt Security
│   │   ├── db/                            #    └─ Database Engine & Session
│   │   ├── models/                        #    └─ SQLAlchemy ORM Models
│   │   └── main.py                        #    └─ App Entry Point & Middleware
│   ├── media/                             #    └─ Uploaded Images & Files
│   ├── requirements.txt                   #    └─ Python Dependencies
│   └── .env.example                       #    └─ Environment Variables Template
│
├── 📁 sukarak_mazbot_v3_frontend/         # 🎨 React + Vite Frontend
│   ├── src/
│   │   ├── api/config.js                  #    └─ API Configuration (Local/Mobile)
│   │   ├── components/                    #    └─ Reusable UI Components
│   │   ├── data/categoryData.js           #    └─ Product Categories & Data
│   │   ├── i18n/                          #    └─ Arabic/English Translations
│   │   ├── pages/                         #    └─ 📄 Application Pages
│   │   │   ├── LoginPage.jsx              #        └─ Login (Email + Google Sign-In)
│   │   │   ├── AdminDashboard.jsx         #        └─ 👨‍💼 Full Admin Panel
│   │   │   ├── DoctorDashboard.jsx        #        └─ 🩺 Doctor Control Panel
│   │   │   ├── SellerDashboard.jsx        #        └─ 🏪 Seller/Merchant Panel
│   │   │   ├── NursingDashboard.jsx       #        └─ 👩‍⚕️ Nursing Services Panel
│   │   │   ├── ProfileView.jsx            #        └─ User Profile & Wallet
│   │   │   ├── StoreView.jsx              #        └─ E-Commerce Store
│   │   │   ├── SugarReadingView.jsx       #        └─ Sugar Readings & Charts
│   │   │   ├── MedicationsView.jsx        #        └─ Medications Management
│   │   │   ├── InsulinCalculator.jsx      #        └─ Insulin Dose Calculator
│   │   │   ├── AppointmentsView.jsx       #        └─ Medical Appointments
│   │   │   ├── MedicalServicesView.jsx    #        └─ Medical Services
│   │   │   ├── NursingView.jsx            #        └─ Nursing Request Page
│   │   │   ├── MedicalTestsView.jsx       #        └─ Lab Tests
│   │   │   ├── FoodsView.jsx              #        └─ Food Guide & Carbs
│   │   │   ├── HealthTrackingView.jsx     #        └─ Health Tracking
│   │   │   ├── MembershipCardsView.jsx    #        └─ Membership Cards
│   │   │   ├── MyOrdersView.jsx           #        └─ Order History
│   │   │   ├── PersonalAssistantView.jsx  #        └─ AI Assistant
│   │   │   ├── SportsView.jsx             #        └─ Sports & Exercises
│   │   │   ├── SupportView.jsx            #        └─ Customer Support Chat
│   │   │   └── ...                        #        └─ Policy & About Pages
│   │   ├── utils/ExportUtils.js           #    └─ PDF/Excel Export Utilities
│   │   └── App.jsx                        #    └─ Root App & Router
│   ├── android/                           #    └─ 📱 Capacitor Android Project
│   ├── public/                            #    └─ Static Assets (logo, icons)
│   ├── index.html                         #    └─ HTML Entry + Google GIS
│   └── package.json                       #    └─ Node Dependencies
│
├── 📄 start_v3.bat                        # 🚀 One-Click System Launcher
├── 📄 ARCHITECTURE_BLUEPRINT.md           # 📐 Technical Architecture Docs
├── 📄 LICENSE                             # 🔒 Proprietary License
└── 📄 README.md                           # 📖 This File
```

---

## ✨ الميزات التفصيلية | Detailed Features

### 🔐 المصادقة والأمان | Authentication & Security
- ✅ تسجيل دخول بالبريد الإلكتروني وكلمة المرور
- ✅ **Google Sign-In** (OAuth 2.0) — يعمل inline داخل التطبيق
- ✅ تحقق OTP للحسابات الجديدة
- ✅ حماية JWT مع تشفير bcrypt
- ✅ Auth Guard لحماية الصفحات
- ✅ تسجيل خروج متزامن عبر التابات

### 📊 إدارة السكري | Diabetes Management
- ✅ تسجيل قراءات السكر (صيام / بعد الأكل / قبل النوم)
- ✅ رسوم بيانية يومية وأسبوعية وشهرية
- ✅ حاسبة جرعات الأنسولين الذكية
- ✅ دليل الغذاء وحساب الكربوهيدرات
- ✅ اختبار HbA1c التقديري
- ✅ الملف الطبي الشامل (وزن، عمر، أدوية)

### 🛍️ المتجر الإلكتروني | E-Commerce
- ✅ عرض المنتجات بالتصنيفات والتصنيفات الفرعية
- ✅ سلة مشتريات مع تعديل الكميات
- ✅ إتمام الطلب مع طرق دفع متعددة
- ✅ تتبع حالة الطلب
- ✅ نظام العروض والخصومات مع التواريخ
- ✅ لوحة تحكم البائعين (Seller Dashboard)

### 💰 المحفظة ونقاط الولاء | Wallet & Loyalty
- ✅ رصيد المحفظة الرقمية (SAR)
- ✅ نظام نقاط الولاء
- ✅ قاعدة بيانات حقيقية (ليست أرقام ثابتة)
- ✅ تحكم الأدمن المباشر في الأرصدة
- ✅ يبدأ كل حساب جديد بـ 0 (حتى يقرر الأدمن)

### 👨‍💼 لوحة تحكم الأدمن | Admin Dashboard
- ✅ إحصائيات شاملة (مبيعات، طلبات، مستخدمين)
- ✅ إدارة المستخدمين والأدوار (admin, seller, doctor, nurse, user)
- ✅ إدارة المنتجات (إضافة / تعديل / حذف)
- ✅ إدارة الطلبات وتحديث الحالة
- ✅ **إدارة الأرصدة ونقاط الولاء** (تاب مخصص)
- ✅ الإشعارات والبانرات (CMS)
- ✅ نظام العضويات والباقات
- ✅ التقارير (PDF / Excel / طباعة)
- ✅ محادثات واتصالات مرئية
- ✅ سجل الأنشطة (Activity Log)

### 🩺 لوحة تحكم الطبيب | Doctor Dashboard
- ✅ عرض قائمة المرضى المسجلين
- ✅ متابعة قراءات السكر لكل مريض
- ✅ إدارة المواعيد والاستشارات
- ✅ كتابة الملاحظات والتوصيات الطبية
- ✅ التواصل مع المرضى

### 🏪 لوحة تحكم التاجر | Seller Dashboard
- ✅ إدارة المنتجات الخاصة بالتاجر
- ✅ متابعة الطلبات والمبيعات
- ✅ إحصائيات الأداء والإيرادات
- ✅ تحديث المخزون والأسعار
- ✅ إدارة العروض والخصومات

### 👩‍⚕️ لوحة تحكم التمريض | Nursing Dashboard
- ✅ إدارة طلبات التمريض المنزلي
- ✅ جدولة الزيارات المنزلية
- ✅ متابعة حالة المرضى
- ✅ تسجيل القياسات والملاحظات
- ✅ التقارير الطبية للزيارات

### 🌐 دعم اللغات | Internationalization (i18n)
- ✅ عربي (RTL) / English (LTR)
- ✅ تبديل ديناميكي بدون إعادة تحميل
- ✅ ترجمات شاملة لكل الواجهات

---

## 🛠️ التقنيات المستخدمة | Tech Stack

### Backend
| Technology | Version | Purpose |
|-----------|---------|---------|
| Python | 3.11+ | Runtime |
| FastAPI | Latest | Web Framework |
| SQLAlchemy | 2.x | ORM |
| Uvicorn | Latest | ASGI Server |
| python-jose | Latest | JWT Tokens |
| bcrypt | Latest | Password Hashing |

### Frontend
| Technology | Version | Purpose |
|-----------|---------|---------|
| React | 19 | UI Framework |
| Vite | 6 | Build Tool |
| Framer Motion | Latest | Animations |
| Lucide React | Latest | Icons |
| Recharts | Latest | Charts & Graphs |
| react-i18next | Latest | Internationalization |
| TailwindCSS | 3.x | Styling |
| jsPDF | Latest | PDF Export |
| ExcelJS | Latest | Excel Export |

### Mobile & Infrastructure
| Technology | Purpose |
|-----------|---------|
| Capacitor | Native Mobile (Android/iOS) |
| SQLite | Database |
| Google OAuth 2.0 | Social Login |

---

## 🚀 التثبيت والتشغيل | Installation & Setup

### المتطلبات | Prerequisites
```
✅ Python 3.10+
✅ Node.js 18+
✅ Git
```

### 1. استنساخ المشروع | Clone
```bash
git clone https://github.com/egyadmin/sukarak_mazbot.git
cd sukarak_mazbot
```

### 2. إعداد الـ Backend
```bash
cd sukarak_mazbot_v3_backend

# Create virtual environment
python -m venv venv
venv\Scripts\activate          # Windows
# source venv/bin/activate     # macOS/Linux

# Install dependencies
pip install -r requirements.txt

# Setup environment
cp .env.example .env
# Edit .env with your configuration
```

### 3. إعداد الـ Frontend
```bash
cd sukarak_mazbot_v3_frontend
npm install
```

### 4. التشغيل | Run
```bash
# ✨ Quick Start (Windows)
start_v3.bat

# ── OR Manual Start ──

# Terminal 1 - Backend:
cd sukarak_mazbot_v3_backend
python -m uvicorn app.main:app --host 0.0.0.0 --port 3000 --reload

# Terminal 2 - Frontend:
cd sukarak_mazbot_v3_frontend
npm run dev
```

### 5. الوصول | Access
| Service | URL |
|---------|-----|
| 🌐 Frontend (Dev) | `http://localhost:5173` |
| ⚙️ Backend API | `http://localhost:3000/api/v1` |
| 📚 API Docs (Swagger) | `http://localhost:3000/docs` |
| 🔐 Admin Panel | `http://localhost:5173/admin-login` |

---

## 📱 بناء تطبيق الموبايل | Mobile Build

```bash
cd sukarak_mazbot_v3_frontend

# Build the production web app
npm run build

# Sync with Android project
npx cap sync android

# Open in Android Studio
npx cap open android

# Build APK from Android Studio
# Build → Generate Signed Bundle/APK
```

---

## 📊 هيكل قاعدة البيانات | Database Schema

```
┌──────────────┐     ┌─────────────────┐     ┌──────────────┐
│    Users     │────▶│  SugarReadings  │     │   Products   │
│              │     │                 │     │              │
│ wallet_bal   │     │ reading_value   │     │ price        │
│ loyalty_pts  │     │ reading_type    │     │ stock        │
│ role         │     │ notes           │     │ category     │
│ login_method │     │ created_at      │     │ brand/sku    │
└──────┬───────┘     └─────────────────┘     └──────┬───────┘
       │                                            │
       │         ┌─────────────────┐                │
       │────────▶│    Orders       │◀───────────────│
       │         │                 │
       │         │ status          │
       │         │ total_amount    │
       │         │ payment_method  │
       │         └─────────────────┘
       │
       │         ┌─────────────────┐     ┌──────────────┐
       │────────▶│  DrugRecords    │     │   Banners    │
       │         └─────────────────┘     └──────────────┘
       │
       │         ┌─────────────────┐     ┌──────────────┐
       └────────▶│  Appointments   │     │Notifications │
                 └─────────────────┘     └──────────────┘
```

---

## 📁 API Endpoints Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| **Auth** | | |
| `POST` | `/api/v1/auth/login` | تسجيل الدخول |
| `POST` | `/api/v1/auth/signup` | إنشاء حساب |
| `POST` | `/api/v1/auth/google-auth` | دخول بحساب Google |
| `POST` | `/api/v1/auth/send-otp` | إرسال رمز التحقق |
| `POST` | `/api/v1/auth/verify-otp` | التحقق من الرمز |
| **Health** | | |
| `GET` | `/api/v1/health/profile` | بيانات البروفايل |
| `PUT` | `/api/v1/health/profile` | تحديث البروفايل |
| `GET` | `/api/v1/health/sugar-readings` | قراءات السكر |
| **E-Commerce** | | |
| `GET` | `/api/v1/ecommerce/products` | المنتجات |
| `POST` | `/api/v1/ecommerce/orders` | إنشاء طلب |
| `GET` | `/api/v1/ecommerce/cart` | سلة المشتريات |
| **Admin** | | |
| `GET` | `/api/v1/admin/stats` | إحصائيات الأدمن |
| `GET` | `/api/v1/admin/users` | قائمة المستخدمين |
| `PUT` | `/api/v1/admin/users/{id}/balance` | تحديث الأرصدة |
| **Seller** | | |
| `GET` | `/api/v1/seller/products` | منتجات التاجر |
| `GET` | `/api/v1/seller/orders` | طلبات التاجر |
| `GET` | `/api/v1/seller/stats` | إحصائيات التاجر |
| **Nursing** | | |
| `GET` | `/api/v1/nursing/requests` | طلبات التمريض |
| `POST` | `/api/v1/nursing/requests` | طلب تمريض جديد |
| **Services** | | |
| `GET` | `/api/v1/services/` | الخدمات الطبية |
| **Membership** | | |
| `GET` | `/api/v1/membership/cards` | بطاقات العضوية |
| **Support** | | |
| `POST` | `/api/v1/support/tickets` | تذاكر الدعم |
| **Payments** | | |
| `POST` | `/api/v1/payments/process` | معالجة المدفوعات |

---

## 🔒 الأمان | Security

- 🔐 JWT Token Authentication
- 🔑 bcrypt Password Hashing
- 🛡️ CORS Protection
- 👮 Role-Based Access Control (RBAC)
- 📱 Google OAuth 2.0 Integration
- 🔒 Proprietary Source Code

---

## ⚠️ الترخيص | License

**هذا المشروع ملكية خاصة وجميع الحقوق محفوظة.**

```
Copyright (c) 2024-2026 Tamer ElGohary (@egyadmin)
All Rights Reserved.

لا يجوز نسخ أو تعديل أو توزيع أو استخدام هذا البرنامج
بأي شكل من الأشكال بدون إذن كتابي مسبق من المطور.

Unauthorized copying, modification, distribution, or use
of this software is strictly prohibited without written
permission from the copyright holder.
```

See [LICENSE](LICENSE) for full details.

---

<div align="center">

### صُنع بـ ❤️ لمرضى السكري

*Built with ❤️ for diabetes patients*

<br/>

**© 2024-2026 [Tamer ElGohary](https://github.com/egyadmin) — All Rights Reserved**

</div>
