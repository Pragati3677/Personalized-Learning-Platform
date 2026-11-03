"""
Phase 9 — Explainable AI.

Computes:
  1. Global feature importance (which features matter most overall) —
     from the trained model directly (Random Forest's built-in importances).
  2. Per-prediction SHAP explanations — which features pushed an
     INDIVIDUAL student's classification which way, and by how much. This
     is what powers the "why is this student Average?" statements surfaced
     to students and faculty (architecture doc §37).

Run: python3 scripts/explainability.py
"""

import json
from pathlib import Path

import joblib
import numpy as np
import pandas as pd
import shap

BASE_DIR = Path(__file__).resolve().parent.parent
ARTIFACT_DIR = BASE_DIR / "app" / "artifacts"
PROCESSED_DIR = BASE_DIR / "data" / "processed"
GLOBAL_IMPORTANCE_PATH = ARTIFACT_DIR / "global_feature_importance.json"
SAMPLE_EXPLANATIONS_PATH = PROCESSED_DIR / "sample_shap_explanations.json"


def load_artifacts():
    model = joblib.load(ARTIFACT_DIR / "learner_level_classifier.joblib")
    scaler = joblib.load(ARTIFACT_DIR / "feature_scaler.joblib")
    label_encoder = joblib.load(ARTIFACT_DIR / "label_encoder.joblib")
    feature_columns = json.loads((ARTIFACT_DIR / "feature_columns.json").read_text())
    return model, scaler, label_encoder, feature_columns


def compute_global_importance(model, feature_columns):
    if not hasattr(model, "feature_importances_"):
        print("[global] Selected model has no built-in feature_importances_; skipping global importance.")
        return {}

    importances = model.feature_importances_
    ranked = sorted(zip(feature_columns, importances), key=lambda x: -x[1])

    print("[global] Feature importance (highest to lowest):")
    for feat, imp in ranked:
        print(f"    {feat:28s} {imp:.4f}")

    return {feat: round(float(imp), 4) for feat, imp in ranked}


def render_explanation_text(topic_label, shap_row, feature_columns, feature_values, top_n=3):
    """
    Turns raw SHAP values for one prediction into the kind of human-readable
    sentence the student/faculty dashboards display (architecture doc §37
    example: "Recent average score: 72% ... Strong in Arrays ... Weak in
    Inheritance").
    """
    contributions = list(zip(feature_columns, shap_row, feature_values))
    contributions.sort(key=lambda x: -abs(x[1]))
    top = contributions[:top_n]

    parts = []
    for feat, shap_val, raw_val in top:
        direction = "increased" if shap_val > 0 else "decreased"
        parts.append(f"{feat} (value={raw_val:.1f}) {direction} the confidence in '{topic_label}' by {abs(shap_val):.3f}")

    return f"Classified as '{topic_label}'. Top contributing factors: " + "; ".join(parts) + "."


def compute_sample_explanations(model, scaler, label_encoder, feature_columns, n_samples=5):
    test_df = pd.read_csv(PROCESSED_DIR / "test.csv").sample(n=n_samples, random_state=7).reset_index(drop=True)
    X_raw = test_df[feature_columns]
    X_scaled = scaler.transform(X_raw)

    explainer = shap.TreeExplainer(model)
    shap_values = explainer.shap_values(X_scaled)
    # shap_values shape for multiclass: (n_samples, n_features, n_classes) in recent SHAP versions
    shap_values = np.array(shap_values)
    if shap_values.ndim == 3 and shap_values.shape[-1] == len(label_encoder.classes_):
        pass  # already (n_samples, n_features, n_classes)
    elif shap_values.ndim == 3:
        shap_values = np.transpose(shap_values, (1, 2, 0))

    predictions = model.predict(X_scaled)
    predicted_labels = label_encoder.inverse_transform(predictions)

    explanations = []
    for i in range(n_samples):
        predicted_class_idx = predictions[i]
        row_shap = shap_values[i, :, predicted_class_idx]
        raw_values = X_raw.iloc[i].values

        text = render_explanation_text(predicted_labels[i], row_shap, feature_columns, raw_values)
        print(f"\n[sample {i + 1}] actual={test_df.iloc[i]['level']}  predicted={predicted_labels[i]}")
        print(f"    {text}")

        explanations.append(
            {
                "actual_level": test_df.iloc[i]["level"],
                "predicted_level": predicted_labels[i],
                "explanation_text": text,
                "top_feature_contributions": [
                    {"feature": feat, "shap_value": round(float(val), 4), "raw_value": round(float(raw), 2)}
                    for feat, val, raw in sorted(
                        zip(feature_columns, row_shap, raw_values), key=lambda x: -abs(x[1])
                    )[:5]
                ],
            }
        )

    return explanations


def main():
    model, scaler, label_encoder, feature_columns = load_artifacts()

    global_importance = compute_global_importance(model, feature_columns)
    GLOBAL_IMPORTANCE_PATH.write_text(json.dumps(global_importance, indent=2))

    explanations = compute_sample_explanations(model, scaler, label_encoder, feature_columns)
    SAMPLE_EXPLANATIONS_PATH.write_text(json.dumps(explanations, indent=2, default=str))

    print(f"\n[saved] Global feature importance -> {GLOBAL_IMPORTANCE_PATH}")
    print(f"[saved] Sample SHAP explanations -> {SAMPLE_EXPLANATIONS_PATH}")


if __name__ == "__main__":
    main()
