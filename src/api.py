"""
RecomMind – FastAPI backend.

This module provides a REST API around the existing HybridRecommender model.
The original Flask app (app.py) is preserved and still works independently.
"""

from pathlib import Path
import sys
import os
import re

# ---------------------------------------------------------------------------
# Ensure the src directory is importable
# ---------------------------------------------------------------------------
sys.path.insert(0, str(Path(__file__).resolve().parent))

from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Optional, List
import numpy as np
import pandas as pd

from model_utils import HybridRecommender

# ---------------------------------------------------------------------------
# Paths
# ---------------------------------------------------------------------------
ROOT = Path(__file__).resolve().parents[1]
MODEL_PATH = ROOT / "models" / "hybrid_model.pkl"
PROCESSED = ROOT / "data" / "processed"

# ---------------------------------------------------------------------------
# Application
# ---------------------------------------------------------------------------
app = FastAPI(
    title="RecomMind API",
    description="Personalized movie recommendation backend powered by a hybrid ML model.",
    version="1.0.0",
)

# CORS – allow the Vite dev server and common origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        os.getenv("FRONTEND_ORIGIN", "http://localhost:5173"),
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------------------------------------------------------------
# Global state – loaded once at startup
# ---------------------------------------------------------------------------
recommender: Optional[HybridRecommender] = None
items_df: Optional[pd.DataFrame] = None
ratings_df: Optional[pd.DataFrame] = None
rating_summary: dict = {}

GENRE_COLUMNS = [
    "unknown", "Action", "Adventure", "Animation", "Children", "Comedy",
    "Crime", "Documentary", "Drama", "Fantasy", "Film-Noir", "Horror",
    "Musical", "Mystery", "Romance", "Sci-Fi", "Thriller", "War", "Western",
]


def _load_model():
    """Load the trained model once."""
    global recommender, items_df, ratings_df, rating_summary
    if MODEL_PATH.exists():
        recommender = HybridRecommender.load(MODEL_PATH)
        items_df = recommender.items.copy()
        ratings_df = recommender.ratings.copy()
    else:
        # Try loading processed CSVs as fallback for browsing
        items_csv = PROCESSED / "items.csv"
        ratings_csv = PROCESSED / "ratings.csv"
        if items_csv.exists():
            items_df = pd.read_csv(items_csv)
        if ratings_csv.exists():
            ratings_df = pd.read_csv(ratings_csv)
    if ratings_df is not None:
        summary = ratings_df.groupby("item_id")["rating"].agg(["mean", "count"])
        rating_summary = {
            int(item_id): (float(row["mean"]), int(row["count"]))
            for item_id, row in summary.iterrows()
        }


@app.on_event("startup")
async def startup():
    _load_model()


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------
def _get_genres(row: pd.Series) -> List[str]:
    """Extract genre names from binary genre columns."""
    return [g for g in GENRE_COLUMNS if g in row.index and row.get(g, 0) == 1]


def _movie_to_dict(row: pd.Series, extra: dict = None) -> dict:
    """Convert a movie row to a JSON-friendly dict."""
    # Extract year from title like "Toy Story (1995)"
    title = str(row.get("title", "Unknown"))
    year_match = re.search(r"\((\d{4})\)", title)
    year = int(year_match.group(1)) if year_match else None
    clean_title = re.sub(r"\s*\(\d{4}\)\s*$", "", title).strip()

    result = {
        "item_id": int(row["item_id"]),
        "title": title,
        "clean_title": clean_title,
        "year": year,
        "genres": _get_genres(row),
        "imdb_url": row.get("imdb_url", None),
    }

    # Add average rating and rating count from ratings data
    item_rating = rating_summary.get(int(row["item_id"]))
    if ratings_df is not None:
        result["avg_rating"] = round(item_rating[0], 2) if item_rating else None
        result["rating_count"] = item_rating[1] if item_rating else 0
    
    if extra:
        result.update(extra)
    return result


# ---------------------------------------------------------------------------
# Pydantic models
# ---------------------------------------------------------------------------
class RecommendationRequest(BaseModel):
    n: int = Field(default=10, ge=1, le=50)


class PredictRequest(BaseModel):
    user_id: int
    item_id: int


class FeedbackRequest(BaseModel):
    user_id: int
    item_id: int
    positive: bool
    timestamp: Optional[int] = None


# ---------------------------------------------------------------------------
# Routes
# ---------------------------------------------------------------------------

@app.get("/")
async def root():
    return {
        "name": "RecomMind API",
        "version": "1.0.0",
        "status": "running",
        "model_loaded": recommender is not None,
        "dataset_loaded": items_df is not None,
    }


@app.get("/health")
async def health():
    return {"status": "ok", "model_loaded": recommender is not None}


# ---- Recommendations ----

@app.get("/recommend/{user_id}")
async def recommend(user_id: int, n: int = Query(default=10, ge=1, le=50)):
    """Get personalized movie recommendations for a user."""
    if recommender is None:
        raise HTTPException(
            status_code=503,
            detail="Model not loaded. Please train the model first by running: python src/train.py",
        )

    # Validate user_id
    valid_users = recommender.ratings["user_id"].unique()
    if user_id not in valid_users:
        raise HTTPException(
            status_code=404,
            detail=f"User {user_id} not found. Valid user IDs range from {int(valid_users.min())} to {int(valid_users.max())}.",
        )

    recs = recommender.recommend(user_id, n)
    results = []
    for _, row in recs.iterrows():
        movie = _movie_to_dict(row, extra={
            "predicted_rating": round(float(row["predicted_rating"]), 3),
            "cf_score": round(float(row.get("cf_score", 0)), 3),
            "content_score": round(float(row.get("content_score", 0)), 3),
        })
        results.append(movie)
    return {"user_id": user_id, "count": len(results), "recommendations": results}


@app.post("/predict")
async def predict(req: PredictRequest):
    """Predict a rating for a specific user-item pair."""
    if recommender is None:
        raise HTTPException(status_code=503, detail="Model not loaded.")
    score = recommender.predict(req.user_id, req.item_id)
    return {"user_id": req.user_id, "item_id": req.item_id, "predicted_rating": round(float(score), 3)}


@app.post("/feedback")
async def feedback(req: FeedbackRequest):
    """Accept user feedback (demo endpoint)."""
    return {
        "status": "accepted",
        "message": "Feedback received for future model updates.",
        "event": req.dict(),
    }


# ---- Movies ----

@app.get("/movies")
async def list_movies(
    search: Optional[str] = Query(default=None, description="Search by title"),
    genre: Optional[str] = Query(default=None, description="Filter by genre"),
    sort: Optional[str] = Query(default="title", description="Sort by: title, year, rating, popularity"),
    page: int = Query(default=1, ge=1),
    limit: int = Query(default=24, ge=1, le=100),
):
    """Browse and search movies."""
    if items_df is None:
        raise HTTPException(status_code=503, detail="Dataset not loaded.")

    df = items_df.copy()

    # Search by title
    if search:
        mask = df["title"].str.contains(search, case=False, na=False)
        df = df[mask]

    # Filter by genre
    if genre and genre in GENRE_COLUMNS:
        df = df[df[genre] == 1]

    # Build results with ratings
    results = []
    for _, row in df.iterrows():
        results.append(_movie_to_dict(row))

    # Sort
    if sort == "year":
        results.sort(key=lambda x: x.get("year") or 0, reverse=True)
    elif sort == "rating":
        results.sort(key=lambda x: x.get("avg_rating") or 0, reverse=True)
    elif sort == "popularity":
        results.sort(key=lambda x: x.get("rating_count") or 0, reverse=True)
    else:  # title
        results.sort(key=lambda x: x.get("clean_title", "").lower())

    total = len(results)
    start = (page - 1) * limit
    end = start + limit
    paginated = results[start:end]

    return {
        "total": total,
        "page": page,
        "limit": limit,
        "total_pages": max(1, (total + limit - 1) // limit),
        "movies": paginated,
    }


@app.get("/movies/{item_id}")
async def get_movie(item_id: int):
    """Get details for a specific movie."""
    if items_df is None:
        raise HTTPException(status_code=503, detail="Dataset not loaded.")

    row = items_df[items_df["item_id"] == item_id]
    if row.empty:
        raise HTTPException(status_code=404, detail=f"Movie with ID {item_id} not found.")

    movie = _movie_to_dict(row.iloc[0])

    # Add similar movies (by genre overlap)
    if len(items_df) > 1:
        movie_genres = set(movie["genres"])
        if movie_genres:
            similar = []
            for _, r in items_df.iterrows():
                if int(r["item_id"]) == item_id:
                    continue
                r_genres = set(_get_genres(r))
                overlap = len(movie_genres & r_genres)
                if overlap > 0:
                    similar.append((overlap, _movie_to_dict(r)))
            similar.sort(key=lambda x: x[0], reverse=True)
            movie["similar_movies"] = [s[1] for s in similar[:8]]
        else:
            movie["similar_movies"] = []
    else:
        movie["similar_movies"] = []

    return movie


# ---- Genres ----

@app.get("/genres")
async def list_genres():
    """List available genres with movie counts."""
    if items_df is None:
        raise HTTPException(status_code=503, detail="Dataset not loaded.")

    genres = []
    for g in GENRE_COLUMNS:
        if g in items_df.columns and g != "unknown":
            count = int(items_df[g].sum())
            if count > 0:
                genres.append({"name": g, "count": count})
    genres.sort(key=lambda x: x["count"], reverse=True)
    return {"genres": genres}


# ---- Stats ----

@app.get("/stats")
async def stats():
    """Dataset statistics."""
    result = {"model_loaded": recommender is not None}
    if items_df is not None:
        result["total_movies"] = int(len(items_df))
    if ratings_df is not None:
        result["total_ratings"] = int(len(ratings_df))
        result["total_users"] = int(ratings_df["user_id"].nunique())
        result["user_id_range"] = {
            "min": int(ratings_df["user_id"].min()),
            "max": int(ratings_df["user_id"].max()),
        }
    return result


# ---- Popular / Featured ----

@app.get("/movies/featured/popular")
async def popular_movies(n: int = Query(default=12, ge=1, le=50)):
    """Get popular movies based on rating count and average rating."""
    if items_df is None or ratings_df is None:
        raise HTTPException(status_code=503, detail="Dataset not loaded.")

    pop = ratings_df.groupby("item_id").agg(
        avg_rating=("rating", "mean"),
        count=("rating", "count"),
    ).reset_index()
    # Bayesian average to avoid movies with very few ratings
    C = pop["count"].quantile(0.7)
    m = pop["avg_rating"].mean()
    pop["score"] = (pop["count"] / (pop["count"] + C)) * pop["avg_rating"] + (C / (pop["count"] + C)) * m
    top_ids = pop.sort_values("score", ascending=False).head(n)["item_id"].tolist()

    results = []
    for iid in top_ids:
        row = items_df[items_df["item_id"] == iid]
        if not row.empty:
            results.append(_movie_to_dict(row.iloc[0]))
    return {"movies": results}


# ---------------------------------------------------------------------------
# Run with: uvicorn src.api:app --reload --port 8000
# ---------------------------------------------------------------------------
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("api:app", host="127.0.0.1", port=8000, reload=True)
