# Personalized Machine Learning Based Recommendation System

## Project Overview

The **Personalized Machine Learning Based Recommendation System** is a movie recommendation system that uses user ratings and movie information to generate personalized movie recommendations.

The project uses the **MovieLens Latest Small dataset** and applies Exploratory Data Analysis (EDA), TF-IDF feature extraction, cosine similarity, and machine learning techniques to understand user preferences and recommend movies.

---

## Objectives

- Analyze movie and user rating data.
- Understand user preferences from historical ratings.
- Perform Exploratory Data Analysis (EDA).
- Analyze movie genres and popularity.
- Extract movie content features using TF-IDF.
- Calculate similarity between movies using cosine similarity.
- Generate content-based movie recommendations.
- Create user and movie rating features.
- Train a Random Forest regression model for rating prediction.
- Evaluate the machine learning model using RMSE, MAE, and R².

---

## Dataset

The project uses the **MovieLens ml-latest-small dataset**.

### Main Dataset Files

```text
movies.csv
ratings.csv
```

### `movies.csv`

Contains information about movies.

| Column | Description |
|---|---|
| `movieId` | Unique identifier of the movie |
| `title` | Movie title and release year |
| `genres` | Genres associated with the movie |

### `ratings.csv`

Contains user ratings for movies.

| Column | Description |
|---|---|
| `userId` | Unique identifier of the user |
| `movieId` | Unique identifier of the movie |
| `rating` | Rating given by the user |
| `timestamp` | Time when the rating was given |

### Dataset Statistics

The MovieLens Small dataset contains approximately:

- **9,742 movies**
- **100,836 ratings**
- **610 users**
- **9,724 movies with ratings**
- Rating scale: **0.5 to 5.0**

---

## Technologies Used

- Python
- Google Colab
- Pandas
- NumPy
- Matplotlib
- Seaborn
- Scikit-learn
- TF-IDF
- Cosine Similarity
- Random Forest Regression

---

## Project Workflow

```text
MovieLens Dataset
       |
       v
Data Loading
       |
       v
Data Cleaning
       |
       v
Exploratory Data Analysis
       |
       +----------------------+
       |                      |
       v                      v
Movie Information       User Ratings
       |                      |
       +----------+-----------+
                  |
                  v
          Feature Extraction
                  |
                  v
             TF-IDF
                  |
                  v
        Cosine Similarity
                  |
                  v
     Content-Based Recommendation
                  |
                  v
       User/Movie Feature Creation
                  |
                  v
       Random Forest Regression
                  |
                  v
        Rating Prediction
                  |
                  v
        Model Evaluation
```

---

## Exploratory Data Analysis

The EDA section performs the following analysis:

### 1. Dataset Information

- Dataset dimensions
- Number of users
- Number of movies
- Number of rated movies
- Column information

### 2. Data Quality Analysis

- Data types
- Missing values
- Duplicate records

### 3. Rating Analysis

- Average rating
- Minimum rating
- Maximum rating
- Rating distribution
- Rating frequency

### 4. Genre Analysis

The project analyzes the distribution of movie genres, including genres such as:

- Action
- Adventure
- Animation
- Comedy
- Crime
- Drama
- Fantasy
- Horror
- Romance
- Sci-Fi
- Thriller

### 5. User Activity Analysis

The project analyzes:

- Number of ratings per user
- Average rating given by users
- Most active users

### 6. Movie Popularity Analysis

The project identifies:

- Most-rated movies
- Average movie ratings
- Popular highly-rated movies

---

## Recommendation System

The recommendation component uses movie genres as content information.

### TF-IDF

TF-IDF converts movie genre information into numerical feature vectors.

For example:

```text
Toy Story
Adventure Animation Children Comedy Fantasy
```

is converted into numerical TF-IDF features.

### Cosine Similarity

Cosine similarity is then used to calculate the similarity between movies.

The system can recommend movies similar to a selected movie.

Example:

```python
recommend_movies("Toy Story (1995)", 10)
```

This returns a list of movies with their similarity scores.

---

## Machine Learning Model

The project also creates user and movie-level features.

### User Features

```text
user_mean_rating
user_rating_count
```

### Movie Features

```text
movie_mean_rating
movie_rating_count
```

These features are used to train a **Random Forest Regression** model.

### Model Input

```text
user_mean_rating
user_rating_count
movie_mean_rating
movie_rating_count
```

### Target

```text
rating
```

---

## Model Evaluation

The Random Forest model is evaluated using:

### RMSE

Root Mean Squared Error measures the average magnitude of prediction errors.

### MAE

Mean Absolute Error measures the average absolute difference between predicted and actual ratings.

### R² Score

R² measures how well the model explains the variation in the target ratings.

The Colab notebook prints all three metrics after training.

---

## Google Colab

The final EDA notebook automatically downloads the MovieLens dataset.

### Steps to Run

1. Open Google Colab.
2. Upload:

```text
Personalized_Recommendation_Final_EDA_Colab.ipynb
```

3. Run the cells from top to bottom.
4. The notebook automatically downloads the MovieLens dataset.
5. EDA visualizations will be generated.
6. TF-IDF and cosine similarity will be calculated.
7. The recommendation function will be tested.
8. The Random Forest model will be trained.
9. Model evaluation metrics will be displayed.

---

## Project Files

Recommended project structure:

```text
PersonalizedRecommendationSystem/
│
├── Personalized_Recommendation_Final_EDA_Colab.ipynb
│
├── data/
│   └── raw/
│       └── ml-latest-small/
│           ├── movies.csv
│           ├── ratings.csv
│           ├── tags.csv
│           └── links.csv
│
├── README.md
│
└── results/
    └── EDA graphs and model results
```

For the current EDA and recommendation workflow, the essential datasets are:

```text
movies.csv
ratings.csv
```

---

## Example Recommendation

```python
recommend_movies("Toy Story (1995)", 10)
```

The function returns similar movies based on their genre-content similarity.

---

## Expected Output

The project produces:

- Dataset statistics
- Missing-value analysis
- Rating distribution graphs
- Genre distribution graphs
- User activity analysis
- Movie popularity analysis
- TF-IDF feature matrix
- Cosine similarity matrix
- Movie recommendations
- Random Forest model
- RMSE
- MAE
- R² score

---

## Conclusion

The Personalized Machine Learning Based Recommendation System combines exploratory data analysis, content-based recommendation, and machine learning to analyze movie preferences and generate personalized recommendations.

The system uses movie genres for content-based similarity and user/movie rating statistics for machine learning-based rating prediction. The approach demonstrates how machine learning and data analysis can be combined to build an intelligent recommendation system.

---

## Dataset Source

The project uses the **MovieLens dataset provided by GroupLens Research**.

Official dataset:

https://files.grouplens.org/datasets/movielens/ml-latest-small.zip
