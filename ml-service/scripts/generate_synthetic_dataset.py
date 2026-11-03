"""
Generates a synthetic student-learning dataset for Phase 7/8, since no real
production data exists yet at this stage of the project (architecture doc
§35: "Use the provided student-learning dataset if available" — none is
available, so a realistic synthetic dataset is generated instead, with the
exact fields the architecture doc specifies).

Design notes:
- Each synthetic student has a latent "ability" and "trend" (improving /
  stable / declining) and a separate latent "effort" factor, so engagement/
  completion/practice-attempts are correlated with but not identical to
  raw ability — mirroring the real-world pattern where effort and ability
  are related but distinct (architecture doc §65's varied-trajectory idea,
  generalized to a training-sized cohort).
- The 'level' label is derived from a NOISY rolling average (not a clean
  deterministic function of the visible features), so a trivial rule
  reproduces it only approximately — giving the Phase 8 model comparison
  something real to learn, rather than every model trivially hitting 100%.
- Deliberately injects: missing values (engagement_score, learning_time),
  duplicate rows, and ONE leaky column (level_score_hint) that is a
  near-direct encoding of the label — planted specifically so the Phase 7
  leakage-analysis script has something real to detect and remove, rather
  than asserting leakage-safety without demonstrating the check.
"""

import numpy as np
import pandas as pd
from pathlib import Path

RNG_SEED = 42
NUM_STUDENTS = 300
CYCLES_PER_STUDENT = 5
OUTPUT_PATH = Path(__file__).resolve().parent.parent / "data" / "raw" / "student_learning_data.csv"


def classify_level(rolling_avg):
    if rolling_avg >= 78:
        return "advanced"
    if rolling_avg >= 45:
        return "average"
    return "slow"


def generate():
    rng = np.random.default_rng(RNG_SEED)
    rows = []

    trend_types = rng.choice(
        ["improving", "stable", "declining"], size=NUM_STUDENTS, p=[0.35, 0.40, 0.25]
    )
    base_ability = rng.normal(60, 18, size=NUM_STUDENTS).clip(10, 95)
    effort_factor = rng.normal(65, 20, size=NUM_STUDENTS).clip(10, 100)

    for student_idx in range(NUM_STUDENTS):
        student_id = f"SYN-{student_idx + 1:04d}"
        trend = trend_types[student_idx]
        ability = base_ability[student_idx]
        effort = effort_factor[student_idx]

        trend_slope = {"improving": 3.5, "stable": 0.0, "declining": -3.0}[trend]

        recent_scores = []
        previous_score = None
        initial_level = "average"

        for cycle in range(1, CYCLES_PER_STUDENT + 1):
            process_noise = rng.normal(0, 6)
            true_score = ability + trend_slope * (cycle - 1) + process_noise
            true_score = float(np.clip(true_score, 0, 100))

            # Accuracy breakdown: harder difficulty accuracy drops off faster,
            # loosely tied to true_score with independent noise per band.
            easy_accuracy = np.clip(true_score + rng.normal(12, 6), 0, 100)
            medium_accuracy = np.clip(true_score + rng.normal(0, 7), 0, 100)
            hard_accuracy = np.clip(true_score - rng.normal(12, 8), 0, 100)

            completion_rate = np.clip(effort + rng.normal(0, 10), 0, 100)
            learning_time_minutes = np.clip(rng.normal(40 + effort * 0.6, 15), 5, 240)
            practice_attempts = max(0, int(rng.normal(3 + effort / 25, 2)))
            engagement_score = np.clip((effort * 0.6 + true_score * 0.4) + rng.normal(0, 8), 0, 100)

            prerequisite_score = previous_score if previous_score is not None else np.clip(
                ability + rng.normal(0, 8), 0, 100
            )

            improvement_pct = (true_score - previous_score) if previous_score is not None else np.nan

            recent_scores.append(true_score)
            windowed = recent_scores[-3:]
            noisy_rolling_avg = float(np.mean(windowed) + rng.normal(0, 4))  # evaluator/label noise
            level_label = classify_level(noisy_rolling_avg)

            # --- Intentionally leaky column, planted for the Phase 7
            # leakage-analysis script to detect and drop. It encodes the
            # label directly (with negligible noise), which would let any
            # model achieve near-100% accuracy by simply decoding the label
            # back out of a feature -- exactly the failure mode architecture
            # doc §35 warns against.
            leak_map = {"slow": 20.0, "average": 55.0, "advanced": 85.0}
            level_score_hint = leak_map[level_label] + rng.normal(0, 1.5)

            rows.append(
                {
                    "student_id": student_id,
                    "cycle": cycle,
                    "prerequisite_score": round(prerequisite_score, 2),
                    "initial_level": initial_level,
                    "learning_completion_rate": round(completion_rate, 2),
                    "learning_time_minutes": round(learning_time_minutes, 2),
                    "practice_attempts": practice_attempts,
                    "engagement_score": round(engagement_score, 2),
                    "assessment_score": round(true_score, 2),
                    "easy_accuracy": round(easy_accuracy, 2),
                    "medium_accuracy": round(medium_accuracy, 2),
                    "hard_accuracy": round(hard_accuracy, 2),
                    "previous_score": round(previous_score, 2) if previous_score is not None else np.nan,
                    "improvement_pct": round(improvement_pct, 2) if not np.isnan(improvement_pct) else np.nan,
                    "level_score_hint": round(level_score_hint, 2),  # LEAKY -- see docstring
                    "level": level_label,
                }
            )

            previous_score = true_score
            initial_level = level_label

    df = pd.DataFrame(rows)

    # --- Inject realistic data-quality issues for the cleaning phase ---
    missing_idx = rng.choice(df.index, size=int(len(df) * 0.03), replace=False)
    df.loc[missing_idx, "engagement_score"] = np.nan
    missing_idx2 = rng.choice(df.index, size=int(len(df) * 0.02), replace=False)
    df.loc[missing_idx2, "learning_time_minutes"] = np.nan

    duplicate_rows = df.sample(n=15, random_state=RNG_SEED)
    df = pd.concat([df, duplicate_rows], ignore_index=True)

    df = df.sample(frac=1, random_state=RNG_SEED).reset_index(drop=True)  # shuffle

    OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    df.to_csv(OUTPUT_PATH, index=False)
    print(f"Generated {len(df)} rows ({NUM_STUDENTS} students x {CYCLES_PER_STUDENT} cycles + {len(duplicate_rows)} injected duplicates)")
    print(f"Saved to: {OUTPUT_PATH}")
    print(f"Label distribution:\n{df['level'].value_counts()}")


if __name__ == "__main__":
    generate()
