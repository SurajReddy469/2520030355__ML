"""
FINAL EDA - Personalized ML Based Recommendation System
Dataset: MovieLens ml-latest-small
Required files:
    data/raw/ml-latest-small/movies.csv
    data/raw/ml-latest-small/ratings.csv

The script can automatically download and extract the official dataset.
"""

import os
import zipfile
import urllib.request
from pathlib import Path
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns

from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_squared_error, mean_absolute_error, r2_score

BASE = Path(__file__).resolve().parent
DATA_DIR = BASE / "data" / "raw" / "ml-latest-small"
ZIP_PATH = BASE / "ml-latest-small.zip"
DATA_URL = "https://files.grouplens.org/datasets/movielens/ml-latest-small.zip"

def ensure_dataset():
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    movies_path = DATA_DIR / "movies.csv"
    ratings_path = DATA_DIR / "ratings.csv"

    if movies_path.exists() and ratings_path.exists():
        print("Dataset already exists.")
        return

    print("Downloading official MovieLens ml-latest-small dataset...")
    urllib.request.urlretrieve(DATA_URL, ZIP_PATH)
    with zipfile.ZipFile(ZIP_PATH, "r") as z:
        z.extractall(BASE / "data" / "raw")
    print("Dataset downloaded and extracted.")

def load_data():
    movies = pd.read_csv(DATA_DIR / "movies.csv")
    ratings = pd.read_csv(DATA_DIR / "ratings.csv")
    return movies, ratings

def main():
    ensure_dataset()
    movies, ratings = load_data()

    print("\n" + "="*70)
    print("1. DATASET OVERVIEW")
    print("="*70)
    print("Movies shape :", movies.shape)
    print("Ratings shape:", ratings.shape)
    print("Unique users :", ratings["userId"].nunique())
    print("Unique movies rated:", ratings["movieId"].nunique())

    print("\nMovies columns:")
    print(movies.columns.tolist())
    print("\nRatings columns:")
    print(ratings.columns.tolist())

    print("\nFirst 5 movies:")
    print(movies.head())
    print("\nFirst 5 ratings:")
    print(ratings.head())

    print("\n" + "="*70)
    print("2. DATA TYPES & MISSING VALUES")
    print("="*70)
    print("\nMovies dtypes:\n", movies.dtypes)
    print("\nRatings dtypes:\n", ratings.dtypes)
    print("\nMissing values in movies:\n", movies.isnull().sum())
    print("\nMissing values in ratings:\n", ratings.isnull().sum())
    print("\nDuplicate movie rows:", movies.duplicated().sum())
    print("Duplicate rating rows:", ratings.duplicated().sum())

    print("\n" + "="*70)
    print("3. RATING STATISTICS")
    print("="*70)
    print(ratings["rating"].describe())
    print("\nRating value counts:")
    print(ratings["rating"].value_counts().sort_index())

    print("\n" + "="*70)
    print("4. GENRE ANALYSIS")
    print("="*70)
    genre_counts = (
        movies.assign(genres=movies["genres"].fillna(""))
        .assign(genre=movies["genres"].fillna("").str.split("|"))
        .explode("genre")
        .query("genre != ''")
        ["genre"].value_counts()
    )
    print(genre_counts)

    print("\n" + "="*70)
    print("5. USER ACTIVITY")
    print("="*70)
    user_stats = ratings.groupby("userId").agg(
        rating_count=("rating", "count"),
        average_rating=("rating", "mean")
    )
    print(user_stats.describe())

    print("\nTop 10 users by number of ratings:")
    print(user_stats.sort_values("rating_count", ascending=False).head(10))

    print("\n" + "="*70)
    print("6. MOVIE POPULARITY")
    print("="*70)
    movie_stats = ratings.groupby("movieId").agg(
        rating_count=("rating", "count"),
        average_rating=("rating", "mean")
    ).reset_index()
    movie_stats = movie_stats.merge(movies, on="movieId", how="left")

    print("\nMost rated movies:")
    print(movie_stats.sort_values("rating_count", ascending=False)
          [["movieId", "title", "rating_count", "average_rating"]].head(10))

    print("\nHighest rated movies with at least 50 ratings:")
    popular = movie_stats[movie_stats["rating_count"] >= 50]
    print(popular.sort_values("average_rating", ascending=False)
          [["movieId", "title", "rating_count", "average_rating"]].head(10))

    # -------------------- VISUAL EDA --------------------
    sns.set_theme(style="whitegrid")
    plt.figure(figsize=(9, 5))
    sns.countplot(data=ratings, x="rating", order=sorted(ratings["rating"].unique()))
    plt.title("Rating Distribution")
    plt.xlabel("Rating")
    plt.ylabel("Number of Ratings")
    plt.tight_layout()
    plt.savefig(BASE / "rating_distribution.png", dpi=200)
    plt.show()

    plt.figure(figsize=(12, 6))
    genre_counts.sort_values(ascending=False).plot(kind="bar")
    plt.title("Movie Genre Distribution")
    plt.xlabel("Genre")
    plt.ylabel("Number of Movies")
    plt.xticks(rotation=45, ha="right")
    plt.tight_layout()
    plt.savefig(BASE / "genre_distribution.png", dpi=200)
    plt.show()

    plt.figure(figsize=(10, 5))
    sns.histplot(user_stats["rating_count"], bins=30, kde=True)
    plt.title("Ratings per User")
    plt.xlabel("Number of Ratings")
    plt.ylabel("Number of Users")
    plt.tight_layout()
    plt.savefig(BASE / "ratings_per_user.png", dpi=200)
    plt.show()

    plt.figure(figsize=(10, 5))
    sns.histplot(movie_stats["rating_count"], bins=40, kde=True)
    plt.title("Ratings per Movie")
    plt.xlabel("Number of Ratings")
    plt.ylabel("Number of Movies")
    plt.tight_layout()
    plt.show()

    # -------------------- MERGED DATA --------------------
    df = ratings.merge(movies, on="movieId", how="left")
    df["genres"] = df["genres"].fillna("")

    print("\n" + "="*70)
    print("7. MERGED DATASET")
    print("="*70)
    print("Merged shape:", df.shape)
    print(df.head())

    # -------------------- CONTENT FEATURES --------------------
    print("\n" + "="*70)
    print("8. TF-IDF CONTENT FEATURES")
    print("="*70)

    movie_content = movies.copy()
    movie_content["genres"] = movie_content["genres"].fillna("").str.replace("|", " ", regex=False)

    tfidf = TfidfVectorizer(stop_words="english")
    tfidf_matrix = tfidf.fit_transform(movie_content["genres"])

    print("TF-IDF matrix shape:", tfidf_matrix.shape)

    cosine_sim = cosine_similarity(tfidf_matrix, tfidf_matrix)
    print("Cosine similarity matrix shape:", cosine_sim.shape)

    # -------------------- ML PREPARATION --------------------
    print("\n" + "="*70)
    print("9. RANDOM FOREST DATA PREPARATION")
    print("="*70)

    user_features = ratings.groupby("userId").agg(
        user_mean_rating=("rating", "mean"),
        user_rating_count=("rating", "count")
    ).reset_index()

    movie_features = ratings.groupby("movieId").agg(
        movie_mean_rating=("rating", "mean"),
        movie_rating_count=("rating", "count")
    ).reset_index()

    model_df = ratings.merge(user_features, on="userId", how="left")
    model_df = model_df.merge(movie_features, on="movieId", how="left")

    X = model_df[
        ["user_mean_rating", "user_rating_count",
         "movie_mean_rating", "movie_rating_count"]
    ]
    y = model_df["rating"]

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.20, random_state=42
    )

    model = RandomForestRegressor(
        n_estimators=100,
        random_state=42,
        n_jobs=-1
    )
    model.fit(X_train, y_train)

    predictions = model.predict(X_test)

    rmse = np.sqrt(mean_squared_error(y_test, predictions))
    mae = mean_absolute_error(y_test, predictions)
    r2 = r2_score(y_test, predictions)

    print("Training records:", len(X_train))
    print("Testing records :", len(X_test))
    print(f"RMSE: {rmse:.4f}")
    print(f"MAE : {mae:.4f}")
    print(f"R²  : {r2:.4f}")

    print("\n" + "="*70)
    print("10. EDA COMPLETE")
    print("="*70)
    print("Use the generated CSV files from the official MovieLens dataset.")
    print("The project requires movies.csv and ratings.csv.")

if __name__ == "__main__":
    main()
