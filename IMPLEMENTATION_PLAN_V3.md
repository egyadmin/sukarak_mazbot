# Implementation Plan - Sukarak Mazboot V3 (React + FastAPI)

## 1. Project Overview
Transform the "Sukarak Mazboot" Flutter/PHP system into a modern, professional React/FastAPI stack with bilingual support (AR/EN).

## 2. Technical Stack
- **Frontend:** React 19, Vite, Tailwind CSS (requested high-quality UI), i18next (bilingual).
- **Backend:** Python 3.12, FastAPI, SQLAlchemy, PostgreSQL, Pydantic v2.
- **Database:** PostgreSQL (Migrated from MySQL/SQLite SQL dumps).
- **Authentication:** JWT with Refresh Token rotation.
- **State Management:** React Context API or Redux Toolkit.
- **Design:** Modern Glassmorphism, Cairo/Zain fonts, RTL support.

## 3. Database Schema Mapping
The system uses the following core entities (Syncing with provided SQL):
- `sukarak_users`: Core user profiles and login methods.
- `health_readings` (Split): `sugar_readings`, `insulin_records`, `drugs_records`, `excercise_records`, `meal_records`.
- `ecommerce`: `sukarak_mazbot_products`, `sukarak_orders`, `sukarak_order_items`.
- `cms`: `sukarak_banners`, `sukarak_notifications`.
- `reference`: `sport_db`, `food_db` (Reference for health tracking).

## 4. Project Structure
```
root/
├── sukarak_mazbot_v3_backend/  # FastAPI Project
│   ├── app/
│   │   ├── api/
│   │   ├── core/
│   │   ├── db/
│   │   ├── models/
│   │   ├── schemas/
│   │   └── main.py
│   ├── .env
│   └── requirements.txt
└── sukarak_mazbot_v3_frontend/ # React Project
    ├── src/
    │   ├── components/
    │   ├── pages/
    │   ├── assets/
    │   ├── i18n/
    │   ├── services/
    │   └── App.jsx
    ├── package.json
    └── tailwind.config.js
```

## 5. Phases
### Phase 1: Backend Setup
- [ ] Initialize FastAPI project.
- [ ] Define SQLAlchemy models (Users, Health Readings, Orders, Services).
- [ ] Implement Auth module (Login, Register, Refresh Token).
- [ ] Implement Core APIs (Health Sync, Products/Services).

### Phase 2: Frontend Setup
- [ ] Initialize Vite/React project.
- [ ] Set up Tailwind CSS with a custom design system.
- [ ] Implement i18next for Arabic/English toggle.
- [ ] Create layout components (Navbar, BottomNav, Sidebar).

### Phase 3: Screen Implementation
- [ ] **Home View:** Banners, quick actions, location-aware services.
- [ ] **Health Tracking:** Forms for Insulin, Weight, Meals, Exercise.
- [ ] **Market:** Product catalog, search, shopping cart.
- [ ] **Reports:** Data visualization (Charts) for health stats.
- [ ] **Profile/Settings:** User info, language toggle, orders history.

### Phase 4: Integration & Polish
- [ ] Connect Frontend to FastAPI endpoints.
- [ ] Add animations (Framer Motion).
- [ ] Final UI/UX polish and RTL verification.

## 6. Timeline
- Backend Auth & Models: 2 hours.
- Frontend Shell & i18n: 2 hours.
- Screen Development: 4 hours.
- Integration: 2 hours.

