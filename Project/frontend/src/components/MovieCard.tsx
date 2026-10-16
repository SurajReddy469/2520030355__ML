import { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Star, Bookmark, BookmarkCheck, ExternalLink } from 'lucide-react';
import type { Movie } from '../types';
import { getPlaceholderPoster, GENRE_COLORS } from '../utils/poster';

interface MovieCardProps {
  movie: Movie;
  isInWatchlist: boolean;
  onToggleWatchlist: (movie: Movie) => void;
  showPredictedRating?: boolean;
}

export default function MovieCard({
  movie,
  isInWatchlist,
  onToggleWatchlist,
  showPredictedRating = false,
}: MovieCardProps) {
  const [imgError, setImgError] = useState(false);
  const posterSrc = getPlaceholderPoster(movie.title);

  const handleImgError = useCallback(() => {
    setImgError(true);
  }, []);

  return (
    <div className="group bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 flex flex-col">
      {/* Poster */}
      <Link to={`/movie/${movie.item_id}`} className="block relative aspect-[2/3] overflow-hidden bg-gray-100 dark:bg-gray-700">
        <img
          src={imgError ? posterSrc : posterSrc}
          alt={`${movie.clean_title || movie.title} poster`}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
          onError={handleImgError}
        />
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Watchlist button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onToggleWatchlist(movie);
          }}
          className={`absolute top-2 right-2 p-1.5 rounded-full backdrop-blur-sm transition-all duration-200 ${
            isInWatchlist
              ? 'bg-purple-600 text-white shadow-lg'
              : 'bg-white/80 dark:bg-gray-800/80 text-gray-600 dark:text-gray-300 opacity-0 group-hover:opacity-100 hover:bg-purple-600 hover:text-white'
          }`}
          aria-label={isInWatchlist ? 'Remove from watchlist' : 'Add to watchlist'}
        >
          {isInWatchlist ? (
            <BookmarkCheck className="w-4 h-4" />
          ) : (
            <Bookmark className="w-4 h-4" />
          )}
        </button>

        {/* Predicted rating badge */}
        {showPredictedRating && movie.predicted_rating != null && (
          <div className="absolute bottom-2 left-2 bg-purple-600 text-white px-2 py-0.5 rounded-full text-xs font-semibold flex items-center gap-1">
            <Star className="w-3 h-3 fill-current" />
            {movie.predicted_rating.toFixed(1)}
          </div>
        )}

        {/* Year badge */}
        {movie.year && (
          <div className="absolute top-2 left-2 bg-black/50 backdrop-blur-sm text-white px-2 py-0.5 rounded-full text-xs font-medium">
            {movie.year}
          </div>
        )}
      </Link>

      {/* Info */}
      <div className="p-3 flex flex-col flex-1">
        <Link
          to={`/movie/${movie.item_id}`}
          className="text-sm font-semibold text-gray-900 dark:text-white hover:text-purple-600 dark:hover:text-purple-400 line-clamp-2 transition-colors"
        >
          {movie.clean_title || movie.title}
        </Link>

        {/* Genres */}
        {movie.genres.length > 0 && (
          <div className="mt-1.5 flex flex-wrap gap-1">
            {movie.genres.slice(0, 3).map((genre) => (
              <span
                key={genre}
                className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${
                  GENRE_COLORS[genre] || 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                }`}
              >
                {genre}
              </span>
            ))}
          </div>
        )}

        {/* Rating */}
        <div className="mt-auto pt-2 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
          {movie.avg_rating != null ? (
            <span className="flex items-center gap-1">
              <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
              {movie.avg_rating.toFixed(1)}
              {movie.rating_count > 0 && (
                <span className="text-gray-400">({movie.rating_count})</span>
              )}
            </span>
          ) : (
            <span>No ratings</span>
          )}
          {movie.imdb_url && (
            <a
              href={movie.imdb_url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="text-gray-400 hover:text-purple-600 transition-colors"
              aria-label="View on IMDb"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
