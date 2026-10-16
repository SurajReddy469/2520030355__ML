# Personalized Machine Learning Based Recommendation System for Intelligent User Preference Prediction

## Abstract
Recommendation systems reduce information overload by estimating what a user is likely to prefer. This project proposes a hybrid personalized recommendation system that combines collaborative filtering and content-based filtering to predict user preference and generate Top-N recommendations. Collaborative filtering captures latent relationships between users and items through matrix factorization, while content-based filtering uses item attributes and TF-IDF representations to identify similar items. A feature-based Random Forest model is included as an optional preference-prediction layer. The system includes preprocessing, feature engineering, model training, evaluation, a feedback loop, cold-start handling, and a Flask demonstration interface. Experimental results are intentionally not fabricated; the supplied evaluation pipeline computes MAE, RMSE, Precision@K, Recall@K, F1@K, NDCG@K and MAP@K on a reproducible train/test split.

## 1. Introduction
Modern digital platforms expose users to thousands of movies, products, articles, songs and other items. A non-personalized interface forces users to search manually and can produce information overload. A recommendation system addresses this problem by ranking candidate items according to estimated relevance.

Personalization is important because two users can have different interests even when they interact with the same catalogue. A useful recommender therefore models both user behavior and item characteristics.

## 2. Literature Review
Three major families are considered:
1. Collaborative filtering: uses interaction patterns and similarities among users/items.
2. Content-based filtering: recommends items with attributes similar to items a user previously liked.
3. Hybrid recommendation: combines multiple signals to reduce weaknesses of an individual method.

Matrix factorization is effective for sparse user-item matrices because it learns compact latent representations. Content-based methods are useful for explaining recommendations and for item cold-start when metadata are available.

## 3. Problem Statement
Given a set of users, items and historical interactions, estimate the preference score of an unseen item for a user and produce a ranked Top-N recommendation list.

Formally, let R be a partially observed user-item rating matrix. The goal is to estimate:

r_hat(u,i) = f(u,i,R,X_u,X_i)

where X_u represents user features and X_i represents item features.

## 4. Objectives
- Build a modular personalized recommendation pipeline.
- Predict user-item preference scores.
- Combine collaborative and content-based signals.
- Generate Top-N recommendations.
- Measure both rating prediction and ranking quality.
- Handle new users and new items.
- Incorporate feedback for future personalization.

## 5. Existing System
Common non-personalized systems rely on popularity or manually curated lists. Basic collaborative filtering can struggle with sparse data and cold-start users. Pure content-based filtering can over-specialize and repeatedly recommend similar items.

## 6. Proposed System
The proposed system uses:
- MovieLens interactions for research and demonstration.
- SVD for collaborative latent factors.
- TF-IDF + cosine similarity for item content.
- A weighted hybrid score.
- Random Forest as an optional supervised preference predictor.
- Feedback capture for future retraining.
- Cold-start fallbacks based on popularity and explicit genre preferences.

## 7. System Architecture
See `reports/architecture.md`.

### Data flow
User -> interactions -> preprocessing -> feature engineering -> models -> hybrid ranking -> Top-N output -> feedback -> future model update.

## 8. Dataset
MovieLens 100K is selected for education and development. It contains 100,000 ratings from 1,000 users on 1,700 movies. The dataset contains user ratings with timestamps, movie titles and genre indicators, and user demographic fields. The official GroupLens page provides the dataset and usage information.

For a larger research experiment, MovieLens 1M, 20M, 25M or 32M can be substituted without changing the overall architecture.

### Data quality
- Missing numerical values: median or model-based imputation where appropriate.
- Missing categorical values: explicit `unknown` category.
- Duplicates: retain the latest interaction where an application requires one user-item record.
- Categorical features: one-hot encode or use model-native categorical handling.
- Outliers: inspect rating range and timestamps; ratings outside the allowed range are invalid.
- Leakage prevention: compute training statistics only from the training split.

## 9. Algorithms

### 9.1 SVD / Matrix Factorization
A common formulation is:

r_hat_ui = mu + b_u + b_i + q_i^T p_u

where:
- mu = global mean
- b_u = user bias
- b_i = item bias
- p_u = user latent vector
- q_i = item latent vector

The implementation uses Surprise SVD.

### 9.2 Content-Based Filtering
Movie metadata are converted into TF-IDF vectors. Similarity is measured using cosine similarity:

cos(A,B) = (A·B)/(||A|| ||B||)

The user's content profile is approximated from positively rated items.

### 9.3 Hybrid Model
The main hybrid prediction is:

S(u,i) = alpha * S_CF(u,i) + (1-alpha) * S_CB(u,i)

with alpha = 0.75 in the reference implementation. This value is a design parameter and should be tuned using validation data.

### 9.4 Random Forest Preference Predictor
A Random Forest regression model uses:
- user mean rating
- user interaction count
- item mean rating
- item interaction count
- SVD predicted score

It predicts a continuous preference/rating value. In a production system, training features must be constructed carefully to prevent target leakage.

## 10. Personalization
A user profile consists of:
- previously interacted items
- high-rated genres/content
- average rating behavior
- interaction frequency
- latent representation from collaborative filtering

Changing interests can be modeled using time-decayed interaction weights:

w_t = exp(-lambda * Delta_t)

Recent interactions therefore have greater influence than very old interactions.

## 11. Top-N Recommendation
For a user u:
1. Remove items already consumed/rated.
2. Generate candidate scores.
3. Combine collaborative and content scores.
4. Sort by predicted relevance.
5. Return the highest-ranked N items.

## 12. Cold-Start Strategy
### New user
Ask for a small preference vector such as favorite genres, or use a popularity-based starter list.

### New item
Use metadata/content features immediately. Once interaction data accumulate, collaborative signals become available.

### Hybrid cold-start
A production system can use:
- content score when interaction history is insufficient,
- collaborative score when enough history exists,
- popularity/quality prior when neither is available.

## 13. Evaluation

### Rating prediction
MAE:

MAE = (1/n) * sum |y_i - y_hat_i|

RMSE:

RMSE = sqrt((1/n) * sum (y_i - y_hat_i)^2)

Lower values are better.

### Ranking
Precision@K = relevant recommendations / K

Recall@K = relevant recommendations / total relevant items

F1@K = 2PR/(P+R)

NDCG rewards relevant items appearing near the top of the ranked list.

MAP@K averages precision at the ranks where relevant items occur.

## 14. Experimental Protocol
The reference evaluation performs a chronological per-user holdout: the last interaction is used as test data and earlier interactions are used for training. This is more realistic than randomly mixing future and past interactions.

The final report should include:
- dataset version
- train/test rule
- K value
- relevance threshold
- model hyperparameters
- random seed
- measured metrics

## 15. Results and Discussion
### Measured results
Run:

```bash
python src/evaluate.py
```

The script creates `reports/evaluation_results.csv`.

Do not replace these values with invented numbers.

### Illustrative presentation format only
The following is a template, NOT an experimental result:

| Model | MAE | RMSE | Precision@10 | Recall@10 | NDCG@10 |
|---|---:|---:|---:|---:|---:|
| Popularity | — | — | — | — | — |
| SVD | — | — | — | — | — |
| Content-based | — | — | — | — | — |
| Hybrid | — | — | — | — | — |

Expected interpretation: SVD should capture collaborative preference patterns, content-based filtering should help with item attributes and cold-start items, and the hybrid approach is expected to be more robust across users with different amounts of history. These are hypotheses to be verified experimentally.

## 16. Graphs
The project should generate:
- rating distribution
- number of ratings per user
- number of ratings per item
- model metric comparison
- Top-N recommendation score distribution

Use the actual generated CSV to create final graphs.

## 17. Web Interface
The Flask frontend provides:
- user selection
- recommendation request
- predicted preference display
- positive/negative feedback buttons

The browser communicates with backend REST endpoints:
- POST `/recommend`
- POST `/predict`
- POST `/feedback`

A production version should add authentication, persistent storage, rate limiting, HTTPS, monitoring and asynchronous event processing.

## 18. Limitations
- MovieLens is a benchmark dataset and does not represent every real-world domain.
- Explicit ratings are different from modern implicit signals such as clicks, dwell time and purchases.
- The reference implementation is designed for academic demonstration rather than high-scale production.
- Simple content features do not capture semantics as well as modern language or multimodal embeddings.
- Feedback is accepted by the demo API but not incrementally retrained online.

## 19. Future Scope
- Real-time event streaming with Kafka/Pulsar.
- Neural collaborative filtering and two-tower retrieval.
- Transformer-based item/user embeddings.
- Context-aware recommendations using time, device and session context.
- Explainable AI such as “recommended because you liked...”.
- Reinforcement learning for long-term engagement optimization.
- Multilingual item metadata and user interfaces.
- ANN vector databases for large-scale retrieval.
- Cloud deployment with autoscaling and model monitoring.
- A/B testing and counterfactual evaluation.
- Fairness, diversity, novelty and serendipity objectives.

## 20. Conclusion
The proposed system demonstrates a technically realistic hybrid recommendation architecture for personalized user preference prediction. Collaborative filtering learns behavior-driven latent relationships, content-based filtering uses item attributes, and the hybrid layer combines both signals. The evaluation framework measures prediction accuracy and ranking quality without fabricating results. The modular design also supports future extensions toward real-time, explainable and scalable recommendation systems.

## 21. References
1. GroupLens Research, MovieLens datasets.
2. Koren, Y., Bell, R., & Volinsky, C. Matrix Factorization Techniques for Recommender Systems. IEEE Computer, 2009.
3. Ricci, F., Rokach, L., & Shapira, B. Recommender Systems Handbook.
4. Breiman, L. Random Forests. Machine Learning, 45, 5–32, 2001.
5. Scikit-learn documentation.
6. Surprise documentation.
