# Sukarak Mazboot (سُكّرك مظبوط) - Diabetes Management Platform

## Overview

Sukarak Mazboot is a comprehensive diabetes management platform combining health tracking, e-commerce, telemedicine, and nursing services. The app is Arabic-first (RTL) and targets users across the Middle East. It features patient health monitoring (sugar readings, insulin, meals, exercise), a marketplace for diabetes-related products, doctor consultations via WebSocket chat/WebRTC video, nursing service bookings, membership cards, and full admin/seller dashboards.

The project has a **dual-backend architecture**: a Python/FastAPI backend (primary business logic, under `backend/`) and a Node.js/Express shell (under `server/`) that launches the system via `start.sh`. The frontend lives under `client/` and is a React SPA built with Vite.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend (`client/`)
- **Framework**: React 19 with Vite bundler
- **Routing**: React Router DOM v6
- **Styling**: Tailwind CSS with custom design tokens (Cairo/Zain Arabic fonts, glassmorphism effects)
- **State/Data**: Axios for API calls with a custom `DataService` class that provides offline-first caching via localStorage and a pending queue for offline writes
- **i18n**: i18next with Arabic (default) and English
- **Charts**: Recharts for health data visualization
- **Export**: jsPDF, xlsx, QR code generation for reports and invoices
- **Mobile**: Capacitor configured for Android builds (`client/capacitor.config.json`), with API config that auto-detects emulator vs physical device
- **UI Components**: The root project has shadcn/ui configured (see `components.json`) with Radix UI primitives, but the client also has its own independent setup with Lucide icons and Framer Motion

### Backend (`backend/`)
- **Framework**: FastAPI (Python)
- **ORM**: SQLAlchemy with declarative base
- **Database**: SQLite by default (`sukarak.db`), configured via `DATABASE_URL` env var. The backend config at `backend/app/core/config.py` defaults to SQLite with `check_same_thread=False`
- **Authentication**: JWT tokens via `python-jose`, bcrypt password hashing (direct bcrypt, not passlib)
- **API Structure**: All routes under `/api/v1/` with routers for:
  - `/auth` - signup, login, OTP
  - `/health` - sugar readings, insulin, exercise, meals, drugs, medicine reminders, profile
  - `/market` (ecommerce) - products, cart, orders, coupons, gift cards, loyalty
  - `/admin` - dashboard stats, user/product/order management, CMS (banners, notifications, settings), activity logs
  - `/seller` - seller dashboard, wallet, returns, notifications, reports
  - `/nursing` - nursing services and bookings management
  - `/services` - medical tests
  - `/chat` - WebSocket chat and WebRTC signaling (fully internal, no external services)
  - `/membership` - membership cards (Silver/Gold/Platinum), social links, blog/courses
  - `/payments` - XPay payment gateway integration
  - `/support` - support ticket system with email notifications
- **File uploads**: Stored in `media/products` and `media/profiles` directories
- **Auto-seeding**: On startup, the app seeds membership cards and initial users (admin, doctor, nurse, seller)

### Node.js Layer (`server/`)
- **Purpose**: Acts as a launcher that runs `start.sh` via `server/index.ts`
- **Drizzle Schema** (`shared/schema.ts`): Defines a minimal PostgreSQL users table with Drizzle ORM. This is separate from the SQLAlchemy models used by the FastAPI backend
- **Storage**: `server/storage.ts` has an in-memory storage implementation (MemStorage) - not actively used for business logic
- **Vite Dev Server**: `server/vite.ts` sets up Vite middleware for development with HMR
- **Build**: `script/build.ts` builds both client (Vite) and server (esbuild) for production

### Database Design
The primary database uses SQLAlchemy models with these main tables (all prefixed with `sukarak_` where applicable):
- `sukarak_users` - users with roles (user, admin, doctor, seller, nurse, moderator), wallet balance, loyalty points, seller-specific fields
- `sukarak_mazbot_products` - e-commerce products with offers, SKU, brand
- `sukarak_orders` / `sukarak_order_items` - order management
- `sugar_readings`, `insulin_records`, `excercise_records`, `meal_records`, `drugs_records` - health tracking
- `sukarak_banners`, `sukarak_notifications`, `sukarak_settings` - CMS
- `sukarak_activity_log`, `sukarak_permissions`, `sukarak_appointments` - admin/audit
- `sukarak_membership_cards`, `sukarak_user_memberships` - membership system
- `sukarak_nursing_services`, `sukarak_nursing_bookings` - nursing services
- `sukarak_seller_*` - seller wallet, notifications, returns, withdrawal requests
- `sukarak_support_tickets` - support system
- `food_db`, `food_types`, `sport_db` - reference data for diabetic food/exercise guidance

There is also a Drizzle/PostgreSQL schema in `shared/schema.ts` for the Node.js layer, configured via `drizzle.config.ts` requiring `DATABASE_URL` env var.

### Proxy Configuration
In development, the Vite dev server proxies `/api`, `/media`, and `/uploads` requests to `http://localhost:3000` (the backend). The custom vite config (`vite.custom.config.ts`) runs on port 5000 with HMR on port 443.

### Key Design Decisions
1. **Dual backend**: FastAPI handles all business logic; Node.js/Express serves as an entry point. The FastAPI backend is the source of truth for data.
2. **SQLite default**: Easy local development, but the codebase supports PostgreSQL via `DATABASE_URL` env var (psycopg2-binary is in requirements).
3. **Offline-first client**: DataService caches API responses in localStorage with configurable max-age, queues writes when offline.
4. **Multi-currency**: Built-in currency conversion with SAR as base currency, supporting 11 Middle Eastern currencies.
5. **Role-based access**: User roles (admin, doctor, seller, nurse, user) control access to different dashboards and features.

## External Dependencies

- **Database**: SQLite (default) or PostgreSQL via `DATABASE_URL` environment variable. Drizzle config expects PostgreSQL.
- **Payment Gateway**: XPay (staging endpoint at `staging.xpay.app`), configured with community ID and API key in `backend/app/api/payments.py`
- **Google Sign-In**: Google Identity Services script loaded in `client/index.html`
- **Google Fonts**: Cairo and Zain font families
- **Email/SMTP**: Support ticket notifications configured for Gmail SMTP (credentials need to be set in `backend/app/api/support.py`)
- **No external chat/video services**: Chat and WebRTC signaling are fully internal via WebSocket
- **Capacitor**: Mobile app wrapper for Android deployment