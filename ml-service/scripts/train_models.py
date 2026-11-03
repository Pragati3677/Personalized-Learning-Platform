"""
Phase 8 — Train and compare ML models for learner-level classification.

Trains Logistic Regression, Decision Tree, Random Forest, Gradient Boosting,
and XGBoost on the Phase 7 processed train/test split, evaluates each with
Accuracy/Precision/Recall/F1/Confusion Matrix and 5-fold cross-validation,
and selects the best model based on that evidence (architecture doc §36:
"Select the model based on appropriate evidence. Do not automatically
choose Random Forest merely because it is mentioned in an earlier
synopsis.") -- selection here is driven entirely by the computed CV F1
score, whichever model that turns out to be.

Run: python3 scripts/train_models.py
"""

import json
from pathlib import Path

import joblib
import numpy as np
import pandas as pd
from sklearn.ensemble import GradientBoostingClassifier, RandomForestClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import (
    accuracy_score,
    classification_report,
    confusion_matrix,
    f1_score,
    precision_score,
    recall_score,
)
from sklearn.model_selection import StratifiedKFold, cross_val_score
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.tree import DecisionTreeClassifier
from xgboost import XGBClassifier

BASE_DIR = Path(__file__).resolve().parent.parent
PROCESSED_DIR = BASE_DIR / "data" / "processed"
ARTIFACT_DIR = BASE_DIR / "app" / "artifacts"
METRICS_PATH = PROCESSED_DIR / "model_comparison_report.json"

TARGET_COLUMN = "level"
RANDOM_STATE = 42


def load_split():
    train_df = pd.read_csv(PROCESSED_DIR / "train.csv")
    test_df = pd.read_csv(PROCESSED_DIR / "test.csv")
    feature_columns = [c for c in train_df.columns if c != TARGET_COLUMN]
    return train_df, test_df, feature_columns


def build_models():
    # Deliberately varied model family (linear, single tree, two ensemble
    # variants, gradient-boosted) so the comparison is meaningful rather
    # than comparing near-identical tree variants against each other.
    return {
        "logistic_regression": LogisticRegression(max_iter=1000, random_state=RANDOM_STATE),
        "decision_tree": DecisionTreeClassifier(max_depth=6, random_state=RANDOM_STATE),
        "random_forest": RandomForestClassifier(n_estimators=200, max_depth=8, random_state=RANDOM_STATE),
        "gradient_boosting": GradientBoostingClassifier(n_estimators=150, max_depth=3, random_state=RANDOM_STATE),
        "xgboost": XGBClassifier(
            n_estimators=200, max_depth=4, learning_rate=0.1,
            eval_metric="mlogloss", random_state=RANDOM_STATE,
        ),
    }


def evaluate_model(name, model, X_train, y_train, X_test, y_test, label_encoder):
    model.fit(X_train, y_train)
    y_pred = model.predict(X_test)

    acc = accuracy_score(y_test, y_pred)
    precision = precision_score(y_test, y_pred, average="macro", zero_division=0)
    recall = recall_score(y_test, y_pred, average="macro", zero_division=0)
    f1 = f1_score(y_test, y_pred, average="macro", zero_division=0)
    cm = confusion_matrix(y_test, y_pred).tolist()
    report = classification_report(
        y_test, y_pred, target_names=label_encoder.classes_, zero_division=0, output_dict=True
    )

    cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=RANDOM_STATE)
    cv_scores = cross_val_score(model, X_train, y_train, cv=cv, scoring="f1_macro")

    print(f"\n=== {name} ===")
    print(f"  Test Accuracy:  {acc:.4f}")
    print(f"  Test Precision: {precision:.4f} (macro)")
    print(f"  Test Recall:    {recall:.4f} (macro)")
    print(f"  Test F1:        {f1:.4f} (macro)")
    print(f"  5-fold CV F1:   {cv_scores.mean():.4f} (+/- {cv_scores.std():.4f})")
    print(f"  Confusion matrix (rows=actual, cols=predicted, order={list(label_encoder.classes_)}):")
    for row in cm:
        print(f"    {row}")

    return {
        "test_accuracy": round(float(acc), 4),
        "test_precision_macro": round(float(precision), 4),
        "test_recall_macro": round(float(recall), 4),
        "test_f1_macro": round(float(f1), 4),
        "cv_f1_macro_mean": round(float(cv_scores.mean()), 4),
        "cv_f1_macro_std": round(float(cv_scores.std()), 4),
        "confusion_matrix": cm,
        "confusion_matrix_label_order": list(label_encoder.classes_),
        "classification_report": report,
    }, model


def main():
    train_df, test_df, feature_columns = load_split()

    label_encoder = LabelEncoder()
    y_train = label_encoder.fit_transform(train_df[TARGET_COLUMN])
    y_test = label_encoder.transform(test_df[TARGET_COLUMN])

    scaler = StandardScaler()
    X_train = scaler.fit_transform(train_df[feature_columns])
    X_test = scaler.transform(test_df[feature_columns])

    models = build_models()
    results = {}
    fitted_models = {}

    for name, model in models.items():
        metrics, fitted = evaluate_model(name, model, X_train, y_train, X_test, y_test, label_encoder)
        results[name] = metrics
        fitted_models[name] = fitted

    # Selection driven by evidence: highest cross-validated F1 (macro),
    # not a name picked in advance. CV (not the single test-set score) is
    # used for selection since it's more robust to test-set variance.
    best_model_name = max(results, key=lambda n: results[n]["cv_f1_macro_mean"])
    best_model = fitted_models[best_model_name]

    print(f"\n{'=' * 60}")
    print(f"SELECTED MODEL: {best_model_name} (highest 5-fold CV F1-macro = {results[best_model_name]['cv_f1_macro_mean']})")
    print(f"{'=' * 60}")

    ARTIFACT_DIR.mkdir(parents=True, exist_ok=True)
    joblib.dump(best_model, ARTIFACT_DIR / "learner_level_classifier.joblib")
    joblib.dump(scaler, ARTIFACT_DIR / "feature_scaler.joblib")
    joblib.dump(label_encoder, ARTIFACT_DIR / "label_encoder.joblib")
    (ARTIFACT_DIR / "feature_columns.json").write_text(json.dumps(feature_columns, indent=2))
    (ARTIFACT_DIR / "model_info.json").write_text(
        json.dumps(
            {
                "selected_model": best_model_name,
                "selection_criterion": "highest 5-fold stratified CV F1-macro on the training set",
                "cv_f1_macro": results[best_model_name]["cv_f1_macro_mean"],
                "test_accuracy": results[best_model_name]["test_accuracy"],
                "label_classes": list(label_encoder.classes_),
                "feature_columns": feature_columns,
            },
            indent=2,
        )
    )

    comparison_report = {
        "models_compared": list(models.keys()),
        "selection_criterion": "highest 5-fold stratified CV F1-macro",
        "selected_model": best_model_name,
        "results": results,
    }
    METRICS_PATH.write_text(json.dumps(comparison_report, indent=2, default=str))

    print(f"\n[saved] Model artifacts -> {ARTIFACT_DIR}")
    print(f"[saved] Comparison report -> {METRICS_PATH}")


if __name__ == "__main__":
    main()
