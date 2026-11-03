from datetime import datetime, timezone

from fastapi import APIRouter

router = APIRouter()


@router.get("/health")
def health_check():
    """Basic liveness check used to confirm the Phase 1 skeleton boots
    correctly before any classification/recommendation endpoints exist
    (those are added in Phases 8-10-11-12)."""
    return {
        "success": True,
        "service": "adaptive-java-ml-service",
        "status": "ok",
        "timestamp": datetime.now(timezone.utc).isoformat(),
    }
