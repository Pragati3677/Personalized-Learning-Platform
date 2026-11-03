# ML Data Pipeline (Phase 7)

Run in order from the `ml-service/` directory (after `pip install -r requirements.txt`):

```bash
python3 scripts/generate_synthetic_dataset.py
python3 scripts/eda_and_preprocessing.py
```

## What each script does

**`generate_synthetic_dataset.py`**
No real production data exists yet at this stage, so this generates a
realistic synthetic dataset (300 synthetic students × 5 assessment cycles =
1,500 rows) with the exact fields described in the architecture doc §35
(`prerequisite_score`, `learning_completion_rate`, `easy/medium/hard_accuracy`,
etc.). Each synthetic student has a latent ability + improving/stable/declining
trend + effort factor, so features correlate realistically rather than being
independently random. It also deliberately injects data-quality issues
(missing values, duplicate rows) **and one leaky column** (`level_score_hint`,
a near-direct encoding of the label) for the next script to catch.

Output: `data/raw/student_learning_data.csv`

**`eda_and_preprocessing.py`**
Runs the full Phase 7 pipeline: Cleaning → EDA → Feature Engineering →
Feature Selection (with leakage analysis) → stratified 80/20 Train/Test split.

The leakage-analysis step computes each candidate feature's correlation with
the (numeric-encoded) target and flags anything above a 0.95 threshold as
leaky — on this dataset it correctly catches and drops the planted
`level_score_hint` column (correlation ≈0.996) while keeping legitimate
strong predictors like `assessment_score` (≈0.85). This is a real, running
check, not just a documented intention.

Outputs:
- `data/processed/train.csv`, `data/processed/test.csv` — ready for Phase 8 training
- `data/processed/feature_manifest.json` — exact final feature list + leakage findings
- `data/processed/eda_report.json` — cleaning stats, label distribution, full correlation table

## Replacing with real data later
If real student data becomes available (e.g. from the live 25-student
deployment after enough assessment cycles), point `RAW_PATH` in
`eda_and_preprocessing.py` at the real export — the cleaning/EDA/leakage/
split pipeline works unchanged as long as the column names match.
