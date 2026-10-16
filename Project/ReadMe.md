<<<<<<< HEAD
# RecomMind — Personalized AI Movie Recommendation System

RecomMind is a full-stack, responsive web application and academic machine learning project delivering personalized movie recommendations using the MovieLens 100K dataset.

---

## 🌟 Features

- **Hybrid Recommendation Model**: Combines **Surprise SVD** collaborative filtering (80 factors, learning latent user-movie interactions) and **TF-IDF + Cosine Similarity** content-based filtering (analyzing genre combinations and user affinity to liked titles).
- **Personalized Recommendations Page**: Request recommendations by User ID (1–943) with customizable counts (5–50) and live predicted rating breakdown.
- **Movie Discovery & Search**: Full catalog browsing, real-time title search, genre filtering, multi-criteria sorting (popularity, rating, year, title), and pagination across 1,682 titles.
- **Movie Details Page**: Deep dive into individual movies with year, average rating, rating counts, genre tags, IMDb link, and dynamic similar movie recommendations.
- **Local Watchlist**: Bookmark movies to a browser-persistent watchlist with clear-all and removal controls.
- **Light Mode by Default**: Modern, bright cinematic styling with purple and blue accents, responsive grids, and an optional dark mode toggle that persists in local storage.
- **Dual Backend Architecture**: FastAPI backend with full OpenAPI schema and CORS support, alongside the original Flask application.

---

## 🏗️ Tech Stack

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, Lucide React, React Router DOM, Axios.
- **Backend**: Python 3.12, FastAPI, Uvicorn, Flask (preserved), Pandas, NumPy.
- **Machine Learning**: Scikit-Surprise (SVD), Scikit-Learn (TF-IDF, Cosine Similarity, Random Forest Regressor), Joblib.
- **Dataset**: MovieLens 100K (100,000 ratings, 943 users, 1,682 movies).

---

## 📂 Project Directory Structure

```text
RecomMind/
├── data/
│   ├── ml-100k/            # Extracted raw MovieLens files
│   └── processed/          # Processed CSVs (ratings, items, users)
├── frontend/
│   ├── src/
│   │   ├── components/     # Navbar, Footer, MovieCard, MovieCardSkeleton
│   │   ├── hooks/          # useTheme, useWatchlist
│   │   ├── pages/          # Home, Discover, Recommendations, MovieDetail, Watchlist, About
│   │   ├── services/       # api.ts (Axios service client)
│   │   ├── types/          # TypeScript interfaces matching backend models
│   │   ├── utils/          # poster.ts (SVG dynamic placeholder fallback)
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── .env.example
│   ├── package.json
│   └── vite.config.ts
├── models/
│   ├── hybrid_model.pkl    # Serialized hybrid SVD + content recommender
│   └── preference_model.pkl# Serialized Random Forest preference predictor
├── reports/
│   ├── academic_report.md
│   ├── architecture.md
│   └── sample_output.txt
├── src/
│   ├── api.py              # FastAPI REST application (new)
│   ├── app.py              # Flask application (preserved)
│   ├── download_data.py    # MovieLens 100K downloader
│   ├── evaluate.py         # Evaluation metrics script
│   ├── model_utils.py      # HybridRecommender core implementation
│   ├── preprocess.py       # Data cleaning and CSV extraction
│   └── train.py            # Model training pipeline
├── API_DOCUMENTATION.md
├── ARCHITECTURE.md
├── README.md
├── requirements.txt
└── SETUP_GUIDE.md
```

---

## 🚀 Quick Start

### 1. Backend

```bash
pip install -r requirements.txt
python src/download_data.py
python src/preprocess.py
python src/train.py
uvicorn src.api:app --reload --host 127.0.0.1 --port 8000
```

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

Visit [http://localhost:5173](http://localhost:5173).
=======
# ML_Project
>>>>>>> 398c323317fa8b17321e4b736cfc8235f6cd663b
