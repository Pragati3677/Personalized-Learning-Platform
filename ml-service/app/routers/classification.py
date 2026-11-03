from fastapi import APIRouter, HTTPException

from app.models.classification import ClassificationRequest, ClassPredictionResponse, ExplanationResponse
from app.services.inference import inference_service

router = APIRouter(prefix="/classify", tags=["classification"])


@router.get("/status")
def classifier_status():
    """Lets the Node backend check readiness before calling /predict, so it
    can decide to use the rule-based fallback proactively rather than
    waiting for a request to fail (architecture doc §71 fail-safe design)."""
    return {
        "is_ready": inference_service.is_ready,
        "model_info": inference_service.model_info if inference_service.is_ready else None,
    }


@router.post("/predict", response_model=ClassPredictionResponse)
def predict(request: ClassificationRequest):
    if not inference_service.is_ready:
        raise HTTPException(
            status_code=503,
            detail="Model not loaded. Run scripts/train_models.py, or the caller should use the rule-based fallback.",
        )
    try:
        result = inference_service.predict(request.model_dump())
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    return result


@router.post("/explain", response_model=ExplanationResponse)
def explain(request: ClassificationRequest):
    if not inference_service.is_ready:
        raise HTTPException(
            status_code=503,
            detail="Model not loaded. Run scripts/train_models.py, or the caller should use the rule-based fallback.",
        )
    try:
        result = inference_service.explain(request.model_dump())
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    return result
