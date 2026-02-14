from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
import os

from app.core.config import settings

from app.api.auth import router as auth_router
from app.api.health import router as health_router
from app.api.ecommerce import router as ecommerce_router
from app.api.admin import router as admin_router
from app.api.chat import router as chat_router
from app.api.services import router as services_router
from app.api.seller import router as seller_router
from app.api.nursing import router as nursing_router
from app.api.membership import router as membership_router, seed_membership_data
from app.db.seed_users import seed_users
from app.api.payments import router as payments_router
from app.api.support import router as support_router

from app.db.base_class import Base
from app.db.session import engine

# Import all models so tables are created
from app.models import user, ecommerce, health, cms, reference, activity, services, seller as seller_models, membership as membership_models, support as support_models

# Create tables
Base.metadata.create_all(bind=engine)

# Seed initial data from old app
from app.db.session import SessionLocal
_seed_db = SessionLocal()
try:
    seed_membership_data(_seed_db)
    seed_users(_seed_db)
except Exception as e:
    print(f"Seed data info: {e}")
finally:
    _seed_db.close()

app = FastAPI(
    title="Sukarak Mazboot API",
    description="Professional Diabetes Management API",
    version="3.0.0",
)

# Ensure media directories exist
os.makedirs("media/products", exist_ok=True)
os.makedirs("media/profiles", exist_ok=True)
os.makedirs("media/cms", exist_ok=True)
os.makedirs("media/tests", exist_ok=True)

# CORS Configuration - MUST be before routes
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount media
import os
_media_dir = os.path.join(os.getcwd(), "media")
os.makedirs(_media_dir, exist_ok=True)
app.mount("/media", StaticFiles(directory=_media_dir), name="media")

# Mount uploads (licenses, etc.)
import os as _os
_uploads_dir = _os.path.join(_os.getcwd(), "uploads")
_os.makedirs(_uploads_dir, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=_uploads_dir), name="uploads")

# API Routes - MUST be before catch-all
app.include_router(auth_router, prefix="/api/v1/auth", tags=["auth"])
app.include_router(health_router, prefix="/api/v1/health", tags=["health"])
app.include_router(ecommerce_router, prefix="/api/v1/market", tags=["market"])
app.include_router(admin_router, prefix="/api/v1/admin", tags=["admin"])
app.include_router(chat_router, prefix="/api/v1/chat", tags=["chat"])
app.include_router(services_router, prefix="/api/v1/services", tags=["services"])
app.include_router(seller_router, prefix="/api/v1/seller", tags=["seller"])
app.include_router(nursing_router, prefix="/api/v1/nursing", tags=["nursing"])
app.include_router(membership_router, prefix="/api/v1", tags=["membership"])
app.include_router(payments_router, prefix="/api/v1", tags=["payments"])
app.include_router(support_router, prefix="/api/v1/support", tags=["support"])

@app.get("/api/health")
async def api_health():
    return {"status": "ok", "version": "3.0.0"}

# Serve Frontend (after building React) - MUST be LAST
frontend_path = os.path.join(os.getcwd(), "dist/public")
if os.path.exists(frontend_path):
    # Mount static assets
    assets_path = os.path.join(frontend_path, "assets")
    if os.path.exists(assets_path):
        app.mount("/assets", StaticFiles(directory=assets_path), name="assets")

    @app.get("/{full_path:path}")
    async def serve_frontend(full_path: str):
        # Check if file exists in dist
        file_path = os.path.join(frontend_path, full_path)
        if full_path and os.path.isfile(file_path):
            return FileResponse(file_path)
        # Fallback to index.html for SPA routing
        return FileResponse(os.path.join(frontend_path, "index.html"))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=3000, reload=True)
