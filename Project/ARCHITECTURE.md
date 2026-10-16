# RecomMind — System Architecture

This document describes the end-to-end architecture of **RecomMind**, a modern AI-powered personalized movie recommendation system built on the MovieLens 100K dataset.

---

## 1. High-Level Architecture Overview

```mermaid
flowchart TD
    subgraph Client ["Frontend (React 18 + TypeScript + Vite)"]
        UI["Web UI (Tailwind CSS, Light Mode Default)"]
        Router["React Router DOM"]
        State["State Hooks (Watchlist, Theme)"]
        API_Client["Axios API Client (Base: http://127.0.0.1:8000)"]
    end

    subgraph Server ["Backend (FastAPI + Python 3.12)"]
        FastAPI_App["FastAPI REST App (src/api.py)"]
        CORS["CORS Middleware"]
        Endpoints["REST Endpoints (/recommend, /movies, /genres, /stats)"]
    end

    subgraph ML_Core ["Machine Learning Core"]
        Recommender["HybridRecommender Engine"]
        SVD_Engine["Surprise SVD (Collaborative Filtering, 80 Factors)"]
        TFIDF_Engine["TF-IDF + Cosine Similarity (Content-Based)"]
        RF_Model["Random Forest Regressor (Optional Preference Scoring)"]
    end

    subgraph Data_Storage ["Data Layer"]
        Raw_ML100K["Raw MovieLens 100K (u.data, u.item, u.user)"]
        Processed_CSVs["Processed CSVs (ratings, items, users)"]
        Pickled_Models["Trained Models (hybrid_model.pkl, preference_model.pkl)"]
    end

    UI --> Router
    Router --> API_Client
    API_Client -- "HTTP/JSON" --> Endpoints
    Endpoints --> FastAPI_App
    FastAPI_App --> Recommender
    Recommender --> SVD_Engine
    Recommender --> TFIDF_Engine
    SVD_Engine -.-> Pickled_Models
    TFIDF_Engine -.-> Pickled_Models
    RF_Model -.-> Pickled_Models
    Pickled_Models -.-> Processed_CSVs
    Processed_CSVs -.-> Raw_ML100K
```

---

## 2. Recommendation Generation Dataflow

```mermaid
sequenceDiagram
    autonumber
    actor User as User / Client
    participant Frontend as React Frontend
    participant API as FastAPI Backend (/recommend/{user_id})
    participant Hybrid as HybridRecommender
    participant SVD as SVD Collaborative Filtering
    participant Content as TF-IDF Content Engine
    participant Dataset as MovieLens Dataset

    User->>Frontend: Enters user_id (e.g., 42) & clicks "Get Recommendations"
    Frontend->>API: GET /recommend/42?n=10
    API->>Hybrid: recommend(user_id=42, n=10)
    Hybrid->>Dataset: Identify items already watched by user
    Hybrid->>Hybrid: Filter out seen items -> Candidate set (unseen items)
    loop For each candidate item
        Hybrid->>SVD: svd_score(user_id, item_id)
        SVD-->>Hybrid: cf_score (clipped 1.0 - 5.0)
        Hybrid->>Content: content_score(user_id, item_id)
        Content-->>Hybrid: cb_score (weighted similarity to user's liked movies >= 4.0)
        Hybrid->>Hybrid: predicted_rating = 0.75 * cf_score + 0.25 * cb_score
    end
    Hybrid->>API: Top-N sorted items with scores
    API-->>Frontend: JSON { user_id, count, recommendations: [...] }
    Frontend-->>User: Renders responsive movie cards with predicted ratings
```

---

## 3. Frontend Component Structure

```mermaid
flowchart TD
    App["App.tsx (Root Layout & Theme / Watchlist Providers)"]
    Nav["Navbar.tsx (Logo, NavLinks, Search input, Theme toggle, Watchlist badge)"]
    Foot["Footer.tsx (Branding, Links, Tech Stack)"]
    
    subgraph Pages ["Pages (React Router)"]
        Home["HomePage.tsx (Hero, Stats, Popular Movies, How It Works, Genres)"]
        Discover["DiscoverPage.tsx (Search, Genre Filters, Sorting, Pagination)"]
        Recs["RecommendationsPage.tsx (User ID Input, Validation, ML Grid, Skeletons)"]
        Detail["MovieDetailPage.tsx (Metadata, Genres, IMDb Link, Similar Movies)"]
        Watch["WatchlistPage.tsx (Saved Movies, LocalStorage Persistence)"]
        About["AboutPage.tsx (Project Overview, ML Explanation, Academic Context)"]
    end

    subgraph Components ["Reusable Components"]
        Card["MovieCard.tsx (Poster fallback, Watchlist toggle, Rating badges)"]
        Skeleton["MovieCardSkeleton.tsx (Shimmer loading state)"]
    end

    App --> Nav
    App --> Foot
    App --> Home
    App --> Discover
    App --> Recs
    App --> Detail
    App --> Watch
    App --> About
    Home --> Card
    Home --> Skeleton
    Discover --> Card
    Discover --> Skeleton
    Recs --> Card
    Recs --> Skeleton
    Detail --> Card
    Watch --> Card
```

---

## 4. Key Design Decisions

1. **Light Mode by Default**: Tailored with clean visual hierarchy, purple/blue accents, white surfaces, subtle borders, and accessible contrast. An optional dark mode toggle is available with `localStorage` persistence.
2. **Real Model Integration**: The frontend connects directly to `FastAPI` which uses the serialized `HybridRecommender` trained on 100,000 real ratings.
3. **Graceful Fallbacks**: Missing posters are automatically rendered as custom SVG placeholders with initials and deterministic color gradients derived from the movie title.
4. **Resilient Architecture**: Both FastAPI (`src/api.py`) and legacy Flask (`src/app.py`) are supported side-by-side.
