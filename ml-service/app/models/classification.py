from typing import Optional

from pydantic import BaseModel, Field


class ClassificationRequest(BaseModel):
    # Mirrors the feature_columns.json produced by Phase 8 training exactly.
    # Kept as explicit named fields (rather than a raw dict) so FastAPI
    # validates types and generates accurate OpenAPI docs for the Node
    # backend integration.
    prerequisite_score: float
    initial_level_numeric: int = Field(ge=0, le=2)
    learning_completion_rate: float
    learning_time_minutes: float
    practice_attempts: int
    engagement_score: float
    assessment_score: float
    easy_accuracy: float
    medium_accuracy: float
    hard_accuracy: float
    previous_score: float
    improvement_pct: float
    is_first_cycle: int = Field(ge=0, le=1)
    accuracy_spread: float
    effort_proxy: float


class ClassPredictionResponse(BaseModel):
    predicted_level: str
    confidence: Optional[float] = None
    class_probabilities: Optional[dict] = None
    model_used: str


class FeatureContribution(BaseModel):
    feature: str
    value: float
    impact: str
    shap_value: float


class ExplanationResponse(BaseModel):
    predicted_level: str
    top_feature_contributions: list[FeatureContribution]
