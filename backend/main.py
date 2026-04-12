from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from core.config import settings
from database import engine, Base
from models import user, crm, hrm # import these so Base knows about them before create_all

from api.auth import router as auth_router
from api.leads import router as leads_router
from api.hrm import router as hrm_router

# Create tables (for production, use Alembic migrations instead)
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Mini Business App Backend with CRM and HRM modules",
    version="1.0.0"
)

# Set up CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # ✅ FIXED
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# Include routers
app.include_router(auth_router, prefix="/api")
app.include_router(leads_router, prefix="/api")
app.include_router(hrm_router, prefix="/api")

@app.get("/")
def root():
    return {"message": f"Welcome to {settings.PROJECT_NAME}"}
