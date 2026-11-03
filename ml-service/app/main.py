import logging

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.routers import health, classification

logging.basicConfig(level=settings.log_level.upper())
logger = logging.getLogger("adaptive-java-ml-service")

app = FastAPI(
    title="Adaptive Java Learning Platform — ML Service",
    description=(
        "Internal microservice responsible for learner-level classification, "
        "explainability (feature importance / SHAP), and recommendation scoring. "
        "Called only by the Node/Express backend, never directly by the frontend."
    ),
    version="0.1.0",
)

# This service is internal-only; CORS is restricted to the backend's origin.
app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.allowed_origin],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health.router, tags=["health"])
app.include_router(classification.router)

# NOTE: Explainability is served via classification.router's /explain
# endpoint (Phase 9 SHAP integration). Recommendation-scoring endpoints are
# added in Phase 11/12 once the recommendation engine is built.


@app.on_event("startup")
async def on_startup():
    logger.info(f"[startup] ML service starting in '{settings.environment}' mode")
    logger.info(f"[startup] Model artifact dir: {settings.model_artifact_dir}")
