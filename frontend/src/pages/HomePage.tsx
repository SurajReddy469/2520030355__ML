import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Brain,
  Sparkles,
  Film,
  TrendingUp,
  ChevronRight,
  Search,
  Star,
  Users,
  Database,
} from 'lucide-react';
import type { Movie, Genre } from '../types';
import { getPopularMovies, getGenres, getStats } from '../services/api';
import MovieCard from '../components/MovieCard';
import MovieCardSkeleton from '../components/MovieCardSkeleton';

interface HomePageProps {
  isInWatchlist: (id: number) => boolean;
  toggleWatchlist: (movie: Movie) => void;
}

export default function HomePage({ isInWatchlist, toggleWatchlist }: HomePageProps) {
  const [popularMovies, setPopularMovies] = useState<Movie[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [stats, setStats] = useState<{ total_movies?: number; total_users?: number; total_ratings?: number } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [moviesRes, genresRes, statsRes] = await Promise.allSettled([
          getPopularMovies(12),
          getGenres(),
          getStats(),
        ]);
        if (moviesRes.status === 'fulfilled') setPopularMovies(moviesRes.value.movies);
        if (genresRes.status === 'fulfilled') setGenres(genresRes.value.genres);
        if (statsRes.status === 'fulfilled') setStats(statsRes.value);
      } catch {
        // Data fetching failed - show empty states gracefully
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-white via-purple-50 to-blue-50 dark:from-gray-900 dark:via-purple-950/30 dark:to-blue-950/20 overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-20 right-10 w-72 h-72 bg-purple-200/30 dark:bg-purple-800/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-10 w-60 h-60 bg-blue-200/30 dark:bg-blue-800/10 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 mb-4">
              <Brain className="w-8 h-8 text-purple-600 dark:text-purple-400" />
              <span className="text-sm font-semibold text-purple-600 dark:text-purple-400 tracking-wide uppercase">
                AI-Powered Recommendations
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 dark:text-white leading-tight">
              Discover Movies That{' '}
              <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Understand You
              </span>
            </h1>

            <p className="mt-5 text-lg sm:text-xl text-gray-600 dark:text-gray-400 max-w-2xl leading-relaxed">
              RecomMind uses a hybrid machine learning model combining collaborative filtering and
              content-based analysis to deliver personalized movie recommendations tailored just for you.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                to="/recommendations"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-blue-700 shadow-lg shadow-purple-500/25 transition-all duration-200 hover:-translate-y-0.5"
              >
                <Sparkles className="w-5 h-5" />
                Get My Recommendations
              </Link>
              <Link
                to="/discover"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-semibold rounded-xl border border-gray-300 dark:border-gray-600 hover:border-purple-400 dark:hover:border-purple-500 hover:text-purple-600 dark:hover:text-purple-400 transition-all duration-200"
              >
                <Film className="w-5 h-5" />
                Explore Movies
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      {stats && (
        <section className="bg-white dark:bg-gray-800 border-y border-gray-200 dark:border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="grid grid-cols-3 gap-8 text-center">
              <div>
                <div className="flex items-center justify-center gap-2 text-gray-400 mb-1">
                  <Film className="w-4 h-4" />
                  <span className="text-xs font-medium uppercase tracking-wide">Movies</span>
                </div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.total_movies?.toLocaleString() || '—'}
                </p>
              </div>
              <div>
                <div className="flex items-center justify-center gap-2 text-gray-400 mb-1">
                  <Users className="w-4 h-4" />
                  <span className="text-xs font-medium uppercase tracking-wide">Users</span>
                </div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.total_users?.toLocaleString() || '—'}
                </p>
              </div>
              <div>
                <div className="flex items-center justify-center gap-2 text-gray-400 mb-1">
                  <Database className="w-4 h-4" />
                  <span className="text-xs font-medium uppercase tracking-wide">Ratings</span>
                </div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.total_ratings?.toLocaleString() || '—'}
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Popular Movies */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Popular Movies</h2>
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Top-rated movies from the MovieLens dataset
            </p>
          </div>
          <Link
            to="/discover?sort=popularity"
            className="hidden sm:inline-flex items-center gap-1 text-sm font-medium text-purple-600 dark:text-purple-400 hover:text-purple-700 transition-colors"
          >
            View all <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {loading
            ? Array.from({ length: 12 }).map((_, i) => <MovieCardSkeleton key={i} />)
            : popularMovies.map((movie) => (
                <MovieCard
                  key={movie.item_id}
                  movie={movie}
                  isInWatchlist={isInWatchlist(movie.item_id)}
                  onToggleWatchlist={toggleWatchlist}
                />
              ))}
        </div>
      </section>

      {/* How it works */}
      <section className="bg-gray-50 dark:bg-gray-900/50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              How RecomMind Works
            </h2>
            <p className="mt-2 text-gray-500 dark:text-gray-400">
              Our hybrid ML model combines two powerful approaches
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 text-center">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Users className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                Collaborative Filtering
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                SVD learns latent patterns from how users with similar tastes rate movies, predicting
                your preferences from the crowd.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 text-center">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Search className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                Content-Based Analysis
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                TF-IDF and cosine similarity measure how closely a movie's genres and content match
                the movies you've already enjoyed.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Brain className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                Hybrid Scoring
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Both scores are blended with a tuned weight (α = 0.75) to give you recommendations
                that balance popularity with personal taste.
              </p>
            </div>
          </div>

          <div className="text-center mt-8">
            <Link
              to="/recommendations"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-blue-700 shadow-lg shadow-purple-500/25 transition-all duration-200"
            >
              <Star className="w-5 h-5" />
              Try It Now
            </Link>
          </div>
        </div>
      </section>

      {/* Genre Exploration */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Explore by Genre</h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            Browse movies by your favourite genre
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          {genres.map((genre) => (
            <Link
              key={genre.name}
              to={`/discover?genre=${genre.name}`}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full text-sm font-medium text-gray-700 dark:text-gray-300 hover:border-purple-400 dark:hover:border-purple-500 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all duration-200"
            >
              {genre.name}
              <span className="text-xs text-gray-400">({genre.count})</span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
