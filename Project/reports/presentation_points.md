# Viva / Presentation Points

## 60-second explanation
“Our project predicts what a user is likely to prefer by combining two complementary approaches. Collaborative filtering learns hidden preference patterns from users' historical ratings, while content-based filtering compares item attributes with the user's previous interests. We combine these scores to rank unseen items and return personalized Top-N recommendations. The system also supports cold-start users through explicit preferences and popularity-based initialization, and it captures feedback for future updates.”

## Why hybrid?
Collaborative filtering discovers patterns that are not explicitly present in metadata. Content-based filtering provides a useful signal when interaction history is sparse and for new items. Combining both reduces dependence on either source.

## Why SVD?
The user-item matrix is sparse. Matrix factorization compresses it into lower-dimensional latent factors, making hidden user/item relationships easier to learn.

## Why TF-IDF?
It is simple, interpretable, fast, and appropriate for an academic baseline when item text/genre metadata are available.

## Why Random Forest?
It demonstrates a supervised feature-based preference prediction layer and can model nonlinear relationships among user/item statistics and collaborative predictions.

## What is cold start?
A new user or new item has little or no interaction history. The system falls back to explicit preferences, popularity, or content metadata.

## What is the strongest evaluation?
For recommendation ranking, NDCG@K and MAP@K are especially informative because they account for the order of recommendations. MAE/RMSE evaluate rating prediction but do not fully capture ranking quality.

## Important viva point
Do not claim that a model is “best” until the measured evaluation table supports the claim. The supplied project intentionally leaves the final values to the actual experiment.
