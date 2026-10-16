from pathlib import Path
import sys
sys.path.append(str(Path(__file__).resolve().parent))

from preprocess import load_data
from model_utils import HybridRecommender
import joblib
import pandas as pd
from sklearn.ensemble import RandomForestRegressor

ROOT = Path(__file__).resolve().parents[1]
MODEL_DIR = ROOT / "models"
MODEL_DIR.mkdir(exist_ok=True)

ratings, items, users = load_data()

model = HybridRecommender(alpha=0.75).fit(ratings, items)
model.save(MODEL_DIR / "hybrid_model.pkl")

# Optional feature-based preference predictor.
# The target is the observed rating; features are available before prediction
# except the target itself.
train = ratings.copy()
user_stats = train.groupby("user_id").agg(
    user_mean=("rating", "mean"),
    user_count=("rating", "count")
).reset_index()
item_stats = train.groupby("item_id").agg(
    item_mean=("rating", "mean"),
    item_count=("rating", "count")
).reset_index()

rf_data = train.merge(user_stats, on="user_id").merge(item_stats, on="item_id")
rf_data["svd_pred"] = [
    model.svd_score(u, i) for u, i in zip(rf_data.user_id, rf_data.item_id)
]
X = rf_data[["user_mean", "user_count", "item_mean", "item_count", "svd_pred"]]
y = rf_data["rating"]

rf = RandomForestRegressor(
    n_estimators=250, max_depth=14, min_samples_leaf=3,
    random_state=42, n_jobs=-1
)
rf.fit(X, y)
joblib.dump(rf, MODEL_DIR / "preference_model.pkl")
print("Training complete.")
