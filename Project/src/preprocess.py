from pathlib import Path
import pandas as pd
import numpy as np

ROOT = Path(__file__).resolve().parents[1]
RAW = ROOT / "data" / "ml-100k"
PROCESSED = ROOT / "data" / "processed"
PROCESSED.mkdir(parents=True, exist_ok=True)

RATING_COLS = ["user_id", "item_id", "rating", "timestamp"]
ITEM_COLS = [
    "item_id", "title", "release_date", "video_release_date", "imdb_url",
    "unknown", "Action", "Adventure", "Animation", "Children", "Comedy",
    "Crime", "Documentary", "Drama", "Fantasy", "Film-Noir", "Horror",
    "Musical", "Mystery", "Romance", "Sci-Fi", "Thriller", "War", "Western"
]

def load_data():
    ratings = pd.read_csv(RAW / "u.data", sep="\t", names=RATING_COLS)
    items = pd.read_csv(
        RAW / "u.item", sep="|", names=ITEM_COLS, encoding="latin-1"
    )
    users = pd.read_csv(
        RAW / "u.user", sep="|",
        names=["user_id", "age", "gender", "occupation", "zip_code"]
    )

    # Defensive cleaning
    ratings = ratings.drop_duplicates(subset=["user_id", "item_id"], keep="last")
    ratings["rating"] = pd.to_numeric(ratings["rating"], errors="coerce")
    ratings = ratings.dropna(subset=["user_id", "item_id", "rating"])
    ratings["rating"] = ratings["rating"].clip(1, 5)

    items["title"] = items["title"].fillna("Unknown")
    genre_cols = ITEM_COLS[5:]
    items[genre_cols] = items[genre_cols].fillna(0).astype(int)

    users["age"] = pd.to_numeric(users["age"], errors="coerce")
    users["age"] = users["age"].fillna(users["age"].median())
    users["gender"] = users["gender"].fillna("unknown")
    users["occupation"] = users["occupation"].fillna("unknown")

    ratings.to_csv(PROCESSED / "ratings.csv", index=False)
    items.to_csv(PROCESSED / "items.csv", index=False)
    users.to_csv(PROCESSED / "users.csv", index=False)
    return ratings, items, users

if __name__ == "__main__":
    r, i, u = load_data()
    print("ratings:", r.shape, "items:", i.shape, "users:", u.shape)
