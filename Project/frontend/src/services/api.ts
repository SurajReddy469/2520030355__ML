import axios from 'axios';
import type {
  Movie,
  RecommendationResponse,
  MoviesResponse,
  GenresResponse,
  StatsResponse,
  HealthResponse,
  PopularMoviesResponse,
} from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const detail = error.response.data?.detail || 'An unexpected error occurred.';
      throw new Error(detail);
    } else if (error.request) {
      throw new Error(
        'Unable to connect to the RecomMind server. Please ensure the backend is running on ' + API_BASE_URL
      );
    } else {
      throw new Error(error.message || 'An unexpected error occurred.');
    }
  }
);

// ---- Health ----

export async function checkHealth(): Promise<HealthResponse> {
  const { data } = await api.get<HealthResponse>('/health');
  return data;
}

// ---- Stats ----

export async function getStats(): Promise<StatsResponse> {
  const { data } = await api.get<StatsResponse>('/stats');
  return data;
}

// ---- Recommendations ----

export async function getRecommendations(
  userId: number,
  n: number = 10
): Promise<RecommendationResponse> {
  const { data } = await api.get<RecommendationResponse>(`/recommend/${userId}`, {
    params: { n },
  });
  return data;
}

// ---- Movies ----

export async function getMovies(params: {
  search?: string;
  genre?: string;
  sort?: string;
  page?: number;
  limit?: number;
}): Promise<MoviesResponse> {
  const { data } = await api.get<MoviesResponse>('/movies', { params });
  return data;
}

export async function getMovieById(itemId: number): Promise<Movie> {
  const { data } = await api.get<Movie>(`/movies/${itemId}`);
  return data;
}

// ---- Genres ----

export async function getGenres(): Promise<GenresResponse> {
  const { data } = await api.get<GenresResponse>('/genres');
  return data;
}

// ---- Popular / Featured ----

export async function getPopularMovies(n: number = 12): Promise<PopularMoviesResponse> {
  const { data } = await api.get<PopularMoviesResponse>('/movies/featured/popular', {
    params: { n },
  });
  return data;
}

// ---- Feedback ----

export async function sendFeedback(
  userId: number,
  itemId: number,
  positive: boolean
): Promise<void> {
  await api.post('/feedback', {
    user_id: userId,
    item_id: itemId,
    positive,
    timestamp: Date.now(),
  });
}
