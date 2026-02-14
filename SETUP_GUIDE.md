# Setup Guide - Sukarak Mazboot V3

## 1. Prerequisites
- Python 3.12+
- Node.js 18+
- PostgreSQL Server

## 2. Backend Setup
1. Navigate to `sukarak_mazbot_v3_backend`.
2. Create a virtual environment:
   ```bash
   python -m venv venv
   ```
3. Activate the environment:
   - Windows: `venv\Scripts\activate`
   - Linux/Mac: `source venv/bin/activate`
4. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
5. Configure `.env` file (copy from `.env.example` if provided).
6. Ensure PostgreSQL is running and create a database named `sukarak_db`.

## 3. Frontend Setup
1. Navigate to `sukarak_mazbot_v3_frontend`.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start development server:
   ```bash
   npm run dev
   ```

## 4. Database Migration (Optional)
To import data from the original SQL files:
1. Use a tool like DBeaver or `psql` to execute the schema.
2. The SQLAlchemy models will automatically sync if you run the backend once (ensure `Base.metadata.create_all(bind=engine)` is called in `main.py`).

## 5. Running the App
Execute `start_v3.bat` in the root directory to launch both servers.
