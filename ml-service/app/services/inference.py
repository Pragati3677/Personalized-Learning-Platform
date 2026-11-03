"""
Inference service for the ML microservice. Loads the Phase 8/9 model
artifacts ONCE at import time (not per-request) and exposes predict() /
explain() used by the classification router.

If artifacts are missing (e.g. training hasn't been run yet in a fresh
environment), this degrades gracefully by reporting is_ready=False rather
than crashing the service — the Node backend's fail-safe fallback
(architecture doc §71) then takes over using the rule-based classifier.
"""

import json
import logging
from pathlib import Path
from typing import Optional

import joblib
import numpy as np
import pandas as pd
import shap

from app.config import settings

logger = logging.getLogger("adaptive-java-ml-service")

ARTIFACT_DIR = Path(settings.model_artifact_dir)


class InferenceService:
    def __init__(self):
        self.is_ready = False
        self.model = None
        self.scaler = None
        self.label_encoder = None
        self.feature_columns = None
        self.explainer = None
        self.model_info = None
        self._load()

    def _load(self):
        try:
            self.model = joblib.load(ARTIFACT_DIR / "learner_level_classifier.joblib")
            self.scaler = joblib.load(ARTIFACT_DIR / "feature_scaler.joblib")
            self.label_encoder = joblib.load(ARTIFACT_DIR / "label_encoder.joblib")
            self.feature_columns = json.loads((ARTIFACT_DIR / "feature_columns.json").read_text())
            self.model_info = json.loads((ARTIFACT_DIR / "model_info.json").read_text())

            if hasattr(self.model, "feature_importances_"):
                self.explainer = shap.TreeExplainer(self.model)

            self.is_ready = True
            logger.info(f"[inference] Loaded model '{self.model_info.get('selected_model')}' successfully.")
        except FileNotFoundError as e:
            logger.warning(f"[inference] Model artifacts not found ({e}). Service will report not-ready; "
                            f"callers should fall back to rule-based classification. Run scripts/train_models.py first.")
            self.is_ready = False

    def _vectorize(self, features: dict) -> "pd.DataFrame":
        missing = [c for c in self.feature_columns if c not in features]
        if missing:
            raise ValueError(f"Missing required features: {missing}")
        return pd.DataFrame([[features[c] for c in self.feature_columns]], columns=self.feature_columns)

    def predict(self, features: dict) -> dict:
        if not self.is_ready:
            raise RuntimeError("Inference service is not ready (model artifacts not loaded).")

        X = self._vectorize(features)
        X_scaled = self.scaler.transform(X)

        prediction = self.model.predict(X_scaled)[0]
        predicted_label = self.label_encoder.inverse_transform([prediction])[0]

        confidence = None
        if hasattr(self.model, "predict_proba"):
            probs = self.model.predict_proba(X_scaled)[0]
            confidence = float(np.max(probs))
            class_probabilities = {
                cls: round(float(p), 4) for cls, p in zip(self.label_encoder.classes_, probs)
            }
        else:
            class_probabilities = None

        return {
            "predicted_level": predicted_label,
            "confidence": round(confidence, 4) if confidence is not None else None,
            "class_probabilities": class_probabilities,
            "model_used": self.model_info.get("selected_model"),
        }

    def explain(self, features: dict, top_n: int = 5) -> dict:
        if not self.is_ready:
            raise RuntimeError("Inference service is not ready (model artifacts not loaded).")
        if self.explainer is None:
            return {"top_feature_contributions": [], "note": "Selected model does not support SHAP TreeExplainer."}

        X = self._vectorize(features)
        X_scaled = self.scaler.transform(X)

        prediction = self.model.predict(X_scaled)[0]
        shap_values = np.array(self.explainer.shap_values(X_scaled))

        if shap_values.ndim == 3 and shap_values.shape[-1] == len(self.label_encoder.classes_):
            row_shap = shap_values[0, :, prediction]
        elif shap_values.ndim == 3:
            row_shap = shap_values[prediction, 0, :]
        else:
            row_shap = shap_values[0]

        raw_values = X.iloc[0].values
        contributions = sorted(
            zip(self.feature_columns, row_shap, raw_values), key=lambda x: -abs(x[1])
        )[:top_n]

        return {
            "predicted_level": self.label_encoder.inverse_transform([prediction])[0],
            "top_feature_contributions": [
                {
                    "feature": feat,
                    "value": round(float(raw), 2),
                    "impact": "positive" if shap_val > 0 else "negative",
                    "shap_value": round(float(shap_val), 4),
                }
                for feat, shap_val, raw in contributions
            ],
        }


# Singleton, loaded once at process startup.
inference_service = InferenceService()
