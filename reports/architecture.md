# System Architecture

```mermaid
flowchart LR
    A[User Registration / Login] --> B[Interaction Collection]
    B --> C[Data Validation & Preprocessing]
    C --> D[Feature Engineering]
    D --> E1[Collaborative Filtering: SVD]
    D --> E2[Content-Based: TF-IDF + Cosine]
    D --> E3[Feature Predictor: Random Forest]
    E1 --> F[Hybrid Recommendation Engine]
    E2 --> F
    E3 --> G[Preference Prediction]
    F --> G
    G --> H[Top-N Ranking]
    H --> I[Web UI / API]
    I --> J[User Feedback]
    J --> B
```

## Data flow
1. User interactions are collected as explicit ratings or implicit events.
2. Data are cleaned, deduplicated and transformed.
3. User/item features are generated.
4. SVD learns latent user/item factors.
5. TF-IDF represents item content and cosine similarity measures content affinity.
6. The hybrid engine combines collaborative and content scores.
7. Candidate items are ranked and Top-N recommendations are returned.
8. Feedback becomes a new interaction event for future retraining or online updates.
