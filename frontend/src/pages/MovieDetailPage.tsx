import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Star,
  Bookmark,
  BookmarkCheck,
  ExternalLink,
  Calendar,
  Film,
  Users,
} from 'lucide-react';
import type { Movie } from '../types';
import { getMovieById } from '../services/api';
import { getPlaceholderPoster, GENRE_COLORS } from '../utils/poster';
import MovieCard from '../components/MovieCard';

interface MovieDetailPageProps {
  isInWatchlist: (id: number) => boolean;
  toggleWatchlist: (movie: Movie) => void;
}

export default function MovieDetailPage({ isInWatchlist, toggleWatchlist }: MovieDetailPageProps) {
  const { id } = useParams<{ id: string }>();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError(null);
    getMovieById(parseInt(id, 10))
      .then(setMovie)
      .catch((err) => setError(err instanceof Error ? err.message : 'Failed to load movie.'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-950 flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-48 h-72 bg-gray-200 dark:bg-gray-700 rounded-xl" />
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-48" />
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <Film className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Movie Not Found</h2>
          <p className="text-gray-500 dark:text-gray-400 mt-2">{error}</p>
          <Link
            to="/discover"
            className="mt-4 inline-flex items-center gap-2 text-purple-600 hover:underline"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Discover
          </Link>
        </div>
      </div>
    );
  }

  if (!movie) return null;

  const posterUrl = getPlaceholderPoster(movie.title);
  const inWatchlist = isInWatchlist(movie.item_id);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      {/* Backdrop area */}
      <div className="relative bg-gradient-to-br from-purple-100 via-blue-50 to-white dark:from-purple-950/40 dark:via-gray-900 dark:to-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Link
            to="/discover"
            className="inline-flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 mb-6"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Discover
          </Link>

          <div className="flex flex-col md:flex-row gap-8">
            {/* Poster */}
            <div className="shrink-0">
              <img
                src={posterUrl}
                alt={`${movie.clean_title || movie.title} poster`}
                className="w-56 md:w-64 rounded-xl shadow-xl mx-auto md:mx-0"
              />
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                {movie.clean_title || movie.title}
              </h1>

              {/* Meta row */}
              <div className="flex flex-wrap items-center gap-4 mt-3 text-gray-500 dark:text-gray-400 text-sm">
                {movie.year && (
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {movie.year}
                  </span>
                )}
                {movie.avg_rating != null && (
                  <span className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    {movie.avg_rating.toFixed(1)} / 5.0
                  </span>
                )}
                {movie.rating_count > 0 && (
                  <span className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    {movie.rating_count.toLocaleString()} ratings
                  </span>
                )}
              </div>

              {/* Genres */}
              {movie.genres.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {movie.genres.map((genre) => (
                    <Link
                      key={genre}
                      to={`/discover?genre=${genre}`}
                      className={`text-sm px-3 py-1 rounded-full font-medium transition-colors hover:opacity-80 ${
                        GENRE_COLORS[genre] || 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                      }`}
                    >
                      {genre}
                    </Link>
                  ))}
                </div>
              )}

              {/* Actions */}
              <div className="flex flex-wrap gap-3 mt-6">
                <button
                  onClick={() => toggleWatchlist(movie)}
                  className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold transition-all duration-200 ${
                    inWatchlist
                      ? 'bg-purple-600 text-white hover:bg-purple-700'
                      : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:border-purple-400 hover:text-purple-600'
                  }`}
                >
                  {inWatchlist ? (
                    <>
                      <BookmarkCheck className="w-5 h-5" /> In Watchlist
                    </>
                  ) : (
                    <>
                      <Bookmark className="w-5 h-5" /> Add to Watchlist
                    </>
                  )}
                </button>
                {movie.imdb_url && (
                  <a
                    href={movie.imdb_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-yellow-400 text-gray-900 rounded-xl font-semibold hover:bg-yellow-500 transition-colors"
                  >
                    <ExternalLink className="w-5 h-5" /> View on IMDb
                  </a>
                )}
              </div>

              {/* Movie ID info */}
              <p className="mt-6 text-sm text-gray-400 dark:text-gray-500">
                MovieLens ID: {movie.item_id}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Similar Movies */}
      {movie.similar_movies && movie.similar_movies.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
            Similar Movies
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {movie.similar_movies.slice(0, 6).map((sim) => (
              <MovieCard
                key={sim.item_id}
                movie={sim}
                isInWatchlist={isInWatchlist(sim.item_id)}
                onToggleWatchlist={toggleWatchlist}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
