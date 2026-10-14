from pathlib import Path
import numpy as np
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from surprise import SVD, Dataset, Reader
import joblib

class HybridRecommender:
    def __init__(self, alpha=0.75):
        self.alpha = alpha
        self.svd = None
        self.vectorizer = None
        self.item_matrix = None
        self.item_ids = None
        self.items = None
        self.ratings = None
        self.global_mean = 3.0
        self.user_mean = {}
        self.item_mean = {}
        self.user_items = {}

    def fit(self, ratings, items):
        self.ratings = ratings.copy()
        self.items = items.copy()
        self.global_mean = float(ratings["rating"].mean())
        self.user_mean = ratings.groupby("user_id")["rating"].mean().to_dict()
        self.item_mean = ratings.groupby("item_id")["rating"].mean().to_dict()
        self.user_items = ratings.groupby("user_id")["item_id"].apply(set).to_dict()
        self.item_index = {int(item_id): idx for idx, item_id in enumerate(items["item_id"])}
        liked = ratings[ratings["rating"] >= 4].groupby("user_id")
        self.user_liked = {
            int(user_id): (group["item_id"].astype(int).tolist(), group["rating"].to_numpy())
            for user_id, group in liked
        }

        reader = Reader(rating_scale=(1, 5))
        data = Dataset.load_from_df(
            ratings[["user_id", "item_id", "rating"]], reader
        )
        trainset = data.build_full_trainset()
        self.svd = SVD(n_factors=80, n_epochs=30, lr_all=0.005,
                       reg_all=0.04, random_state=42)
        self.svd.fit(trainset)

        genre_cols = [
            c for c in items.columns
            if c not in {"item_id", "title", "release_date",
                         "video_release_date", "imdb_url"}
        ]
        text = items["title"].fillna("") + " " + items[genre_cols].astype(str).agg(" ".join, axis=1)
        self.vectorizer = TfidfVectorizer(stop_words="english", ngram_range=(1, 2))
        self.item_matrix = self.vectorizer.fit_transform(text)
        self.item_ids = items["item_id"].to_numpy()
        return self

    def svd_score(self, user_id, item_id):
        return float(np.clip(self.svd.predict(int(user_id), int(item_id)).est, 1, 5))

    def content_score(self, user_id, item_id):
        # Older serialized models do not contain these lookup tables; create
        # them once on first use so existing model files remain compatible.
        if not hasattr(self, "item_index"):
            self.item_index = {int(mid): idx for idx, mid in enumerate(self.item_ids)}
        if not hasattr(self, "user_liked"):
            liked = self.ratings[self.ratings["rating"] >= 4].groupby("user_id")
            self.user_liked = {
                int(uid): (group["item_id"].astype(int).tolist(), group["rating"].to_numpy())
                for uid, group in liked
            }

        liked, weights = self.user_liked.get(int(user_id), ([], np.array([])))
        if not liked:
            return self.item_mean.get(item_id, self.global_mean)

        liked_idx = []
        liked_weights = []
        for liked_id, weight in zip(liked, weights):
            if liked_id in self.item_index:
                liked_idx.append(self.item_index[liked_id])
                liked_weights.append(weight)
        target = self.item_index.get(int(item_id))
        if target is None or not liked_idx:
            return self.item_mean.get(item_id, self.global_mean)

        sims = cosine_similarity(self.item_matrix[target], self.item_matrix[liked_idx]).ravel()
        raw = np.average(sims, weights=np.maximum(liked_weights, 0.1))
        # Map [0,1] similarity to a useful rating range.
        return float(np.clip(1 + 4 * raw, 1, 5))

    def predict(self, user_id, item_id):
        cf = self.svd_score(user_id, item_id)
        cb = self.content_score(user_id, item_id)
        return self.alpha * cf + (1 - self.alpha) * cb

    def recommend(self, user_id, n=10):
        seen = self.user_items.get(int(user_id), set())
        candidates = self.items[~self.items.item_id.isin(seen)].copy()
        if candidates.empty:
            return candidates

        candidates["predicted_rating"] = [
            self.predict(user_id, iid) for iid in candidates.item_id
        ]
        candidates["cf_score"] = [
            self.svd_score(user_id, iid) for iid in candidates.item_id
        ]
        candidates["content_score"] = [
            self.content_score(user_id, iid) for iid in candidates.item_id
        ]
        return candidates.sort_values("predicted_rating", ascending=False).head(n)

    def cold_start_user(self, preferred_genres=None, n=10):
        candidates = self.items.copy()
        if preferred_genres:
            valid = [g for g in preferred_genres if g in candidates.columns]
            if valid:
                candidates["genre_match"] = candidates[valid].sum(axis=1)
                candidates = candidates.sort_values(
                    ["genre_match", "item_id"], ascending=[False, True]
                )
        else:
            popularity = self.ratings.groupby("item_id").agg(
                mean_rating=("rating", "mean"),
                count=("rating", "count")
            ).reset_index()
            popularity["score"] = popularity.mean_rating * np.log1p(popularity["count"])
            candidates = candidates.merge(
                popularity[["item_id", "score"]], on="item_id", how="left"
            ).sort_values("score", ascending=False)
        return candidates.head(n)

    def save(self, path):
        joblib.dump(self, path)

    @staticmethod
    def load(path):
        return joblib.load(path)
