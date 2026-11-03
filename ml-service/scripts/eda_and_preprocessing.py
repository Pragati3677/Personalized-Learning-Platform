"""
Phase 7 — Dataset Analysis pipeline.

Runs: Data Cleaning -> EDA -> Feature Engineering -> Feature Selection
(incl. leakage analysis) -> Train/Test Split, and writes the processed
outputs Phase 8 trains on, plus a feature manifest documenting exactly
which columns were kept/dropped and why.

Run: python3 scripts/eda_and_preprocessing.py
"""

import json
from pathlib import Path

import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split

BASE_DIR = Path(__file__).resolve().parent.parent
RAW_PATH = BASE_DIR / "data" / "raw" / "student_learning_data.csv"
PROCESSED_DIR = BASE_DIR / "data" / "processed"
REPORT_PATH = PROCESSED_DIR / "eda_report.json"
MANIFEST_PATH = PROCESSED_DIR / "feature_manifest.json"

TARGET_COLUMN = "level"


def load_raw():
    df = pd.read_csv(RAW_PATH)
    print(f"[load] Loaded {len(df)} raw rows, {df.shape[1]} columns.")
    return df


# ---------------------------------------------------------------------------
# 1. Data Cleaning
# ---------------------------------------------------------------------------
def clean_data(df):
    report = {}

    report["duplicate_rows_found"] = int(df.duplicated().sum())
    df = df.drop_duplicates().reset_index(drop=True)

    missing_before = df.isna().sum()
    report["missing_values_before"] = {k: int(v) for k, v in missing_before[missing_before > 0].items()}

    # engagement_score / learning_time_minutes: impute with the per-level
    # median rather than a global median, since these features genuinely
    # differ by learner level -- a global median would blur that signal.
    for col in ["engagement_score", "learning_time_minutes"]:
        df[col] = df.groupby(TARGET_COLUMN)[col].transform(lambda s: s.fillna(s.median()))

    # previous_score / improvement_pct are legitimately missing for a
    # student's very first cycle (there IS no previous cycle) -- this is
    # not a data-quality defect, so it's encoded explicitly rather than
    # imputed with a misleading numeric fill.
    df["is_first_cycle"] = df["previous_score"].isna().astype(int)
    df["previous_score"] = df["previous_score"].fillna(df["prerequisite_score"])
    df["improvement_pct"] = df["improvement_pct"].fillna(0)

    missing_after = df.isna().sum()
    report["missing_values_after"] = {k: int(v) for k, v in missing_after[missing_after > 0].items()}
    report["rows_after_cleaning"] = int(len(df))

    print(f"[clean] Dropped {report['duplicate_rows_found']} duplicate rows.")
    print(f"[clean] Imputed missing values in: {list(report['missing_values_before'].keys())}")
    print(f"[clean] Rows after cleaning: {report['rows_after_cleaning']}")
    return df, report


# ---------------------------------------------------------------------------
# 2. Exploratory Data Analysis
# ---------------------------------------------------------------------------
def run_eda(df):
    report = {}
    report["label_distribution"] = df[TARGET_COLUMN].value_counts().to_dict()

    numeric_cols = df.select_dtypes(include=[np.number]).columns.tolist()
    report["numeric_summary"] = df[numeric_cols].describe().round(2).to_dict()

    # Correlation of each numeric feature with the (label-encoded) target --
    # this doubles as the first pass of the leakage analysis below.
    level_order = {"slow": 0, "average": 1, "advanced": 2}
    df["_level_numeric"] = df[TARGET_COLUMN].map(level_order)
    correlations = df[numeric_cols + ["_level_numeric"]].corr()["_level_numeric"].drop("_level_numeric")
    report["feature_target_correlation"] = correlations.sort_values(ascending=False).round(3).to_dict()
    df.drop(columns=["_level_numeric"], inplace=True)

    print("[eda] Label distribution:", report["label_distribution"])
    print("[eda] Feature-target correlations (sorted):")
    for feat, corr in sorted(report["feature_target_correlation"].items(), key=lambda x: -abs(x[1])):
        print(f"       {feat:28s} {corr:+.3f}")

    return report


# ---------------------------------------------------------------------------
# 3. Feature Engineering
# ---------------------------------------------------------------------------
def engineer_features(df):
    # accuracy_spread: gap between easy and hard accuracy -- a direct signal
    # of how much a student's performance degrades with difficulty, which is
    # exactly the kind of per-difficulty signal the adaptive engine needs.
    df["accuracy_spread"] = df["easy_accuracy"] - df["hard_accuracy"]

    # effort_proxy: composite of completion, time, and attempts -- collapses
    # three correlated "effort" signals into one feature, reducing
    # multicollinearity for models sensitive to it (e.g. Logistic Regression).
    df["effort_proxy"] = (
        df["learning_completion_rate"] * 0.4
        + (df["learning_time_minutes"].clip(upper=120) / 120 * 100) * 0.3
        + (df["practice_attempts"].clip(upper=10) / 10 * 100) * 0.3
    )

    # initial_level as an ordinal numeric feature (legitimate pre-cycle
    # information -- the level the student START this cycle at).
    level_order = {"slow": 0, "average": 1, "advanced": 2}
    df["initial_level_numeric"] = df["initial_level"].map(level_order)

    print("[feature-eng] Added: accuracy_spread, effort_proxy, initial_level_numeric")
    return df


# ---------------------------------------------------------------------------
# 4. Feature Selection & Leakage Analysis
# ---------------------------------------------------------------------------
def select_features(df):
    """
    Architecture doc §35: "Avoid data leakage. Separate features available
    BEFORE prediction from features created AFTER the assessment."

    Every column is classified below with an explicit rationale, rather
    than silently including "whatever numeric columns exist" -- that
    silent-inclusion pattern is exactly how the planted `level_score_hint`
    leak would slip through undetected in a less careful pipeline.
    """
    identifier_columns = ["student_id", "cycle"]

    # Legitimate predictive features: known at (or computed as part of) the
    # point the level classification is made for this cycle.
    feature_columns = [
        "prerequisite_score",
        "initial_level_numeric",
        "learning_completion_rate",
        "learning_time_minutes",
        "practice_attempts",
        "engagement_score",
        "assessment_score",
        "easy_accuracy",
        "medium_accuracy",
        "hard_accuracy",
        "previous_score",
        "improvement_pct",
        "is_first_cycle",
        "accuracy_spread",
        "effort_proxy",
    ]

    # Leakage check: flag any feature whose absolute correlation with the
    # (numeric-encoded) target exceeds a suspiciously high threshold --
    # real predictive features in this domain correlate moderately, not
    # near-perfectly, with the label.
    level_order = {"slow": 0, "average": 1, "advanced": 2}
    numeric_target = df[TARGET_COLUMN].map(level_order)
    LEAKAGE_CORRELATION_THRESHOLD = 0.95

    candidate_cols = feature_columns + ["level_score_hint"]
    correlations = df[candidate_cols].corrwith(numeric_target).abs()
    leaky_columns = correlations[correlations > LEAKAGE_CORRELATION_THRESHOLD].index.tolist()

    dropped = {
        "identifiers_excluded": identifier_columns,
        "leaky_columns_detected_and_dropped": {
            col: f"correlation with target = {correlations[col]:.3f} (> {LEAKAGE_CORRELATION_THRESHOLD} threshold) — "
                 f"near-direct encoding of the label, not a genuine predictive signal."
            for col in leaky_columns
        },
    }

    final_features = [c for c in feature_columns if c not in leaky_columns]

    print(f"[leakage] Checked {len(candidate_cols)} candidate columns against target correlation.")
    if leaky_columns:
        print(f"[leakage] DROPPED as leaky: {leaky_columns} (see feature_manifest.json for correlation values)")
    else:
        print("[leakage] No columns exceeded the leakage threshold.")
    print(f"[feature-selection] Final feature set ({len(final_features)}): {final_features}")

    return final_features, dropped


# ---------------------------------------------------------------------------
# 5. Train/Test Split
# ---------------------------------------------------------------------------
def split_and_save(df, feature_columns):
    X = df[feature_columns]
    y = df[TARGET_COLUMN]

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )

    PROCESSED_DIR.mkdir(parents=True, exist_ok=True)
    train_df = X_train.copy()
    train_df[TARGET_COLUMN] = y_train
    test_df = X_test.copy()
    test_df[TARGET_COLUMN] = y_test

    train_df.to_csv(PROCESSED_DIR / "train.csv", index=False)
    test_df.to_csv(PROCESSED_DIR / "test.csv", index=False)

    print(f"[split] Train: {len(train_df)} rows, Test: {len(test_df)} rows (stratified 80/20)")
    print(f"[split] Saved to {PROCESSED_DIR}/train.csv and test.csv")

    return {
        "train_rows": len(train_df),
        "test_rows": len(test_df),
        "train_label_distribution": y_train.value_counts().to_dict(),
        "test_label_distribution": y_test.value_counts().to_dict(),
    }


def main():
    df = load_raw()
    df, clean_report = clean_data(df)
    eda_report = run_eda(df)
    df = engineer_features(df)
    feature_columns, leakage_report = select_features(df)
    split_report = split_and_save(df, feature_columns)

    manifest = {
        "target_column": TARGET_COLUMN,
        "final_feature_columns": feature_columns,
        "leakage_analysis": leakage_report,
        "engineered_features": ["accuracy_spread", "effort_proxy", "initial_level_numeric", "is_first_cycle"],
        "split": split_report,
    }
    MANIFEST_PATH.write_text(json.dumps(manifest, indent=2, default=str))

    full_report = {"cleaning": clean_report, "eda": eda_report}
    REPORT_PATH.write_text(json.dumps(full_report, indent=2, default=str))

    print(f"\n[done] Wrote {MANIFEST_PATH.name} and {REPORT_PATH.name} to {PROCESSED_DIR}")


if __name__ == "__main__":
    main()
