// TypeScript types for the RecomMind application

export interface Movie {
  item_id: number;
  title: string;
  clean_title: string;
  year: number | null;
  genres: string[];
  imdb_url: string | null;
  avg_rating: number | null;
  rating_count: number;
  predicted_rating?: number;
  cf_score?: number;
  content_score?: number;
  similar_movies?: Movie[];
}

export interface RecommendationResponse {
  user_id: number;
  count: number;
  recommendations: Movie[];
}

export interface MoviesResponse {
  total: number;
  page: number;
  limit: number;
  total_pages: number;
  movies: Movie[];
}

export interface Genre {
  name: string;
  count: number;
}

export interface GenresResponse {
  genres: Genre[];
}

export interface StatsResponse {
  model_loaded: boolean;
  total_movies?: number;
  total_ratings?: number;
  total_users?: number;
  user_id_range?: {
    min: number;
    max: number;
  };
}

export interface HealthResponse {
  status: string;
  model_loaded: boolean;
}

export interface PredictResponse {
  user_id: number;
  item_id: number;
  predicted_rating: number;
}

export interface FeedbackResponse {
  status: string;
  message: string;
  event: Record<string, unknown>;
}

export interface PopularMoviesResponse {
  movies: Movie[];
}

export interface ApiError {
  detail: string;
}
