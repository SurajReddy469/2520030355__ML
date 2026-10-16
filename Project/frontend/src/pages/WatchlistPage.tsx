import { Link } from 'react-router-dom';
import { Bookmark, Trash2, Film } from 'lucide-react';
import type { Movie } from '../types';
import MovieCard from '../components/MovieCard';

interface WatchlistPageProps {
  watchlist: Movie[];
  isInWatchlist: (id: number) => boolean;
  toggleWatchlist: (movie: Movie) => void;
  removeFromWatchlist: (id: number) => void;
}

export default function WatchlistPage({
  watchlist,
  isInWatchlist,
  toggleWatchlist,
  removeFromWatchlist,
}: WatchlistPageProps) {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      {/* Header */}
      <section className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/20 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-3">
            <Bookmark className="w-7 h-7 text-purple-600 dark:text-purple-400" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Watchlist</h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            {watchlist.length > 0
              ? `You have ${watchlist.length} movie${watchlist.length > 1 ? 's' : ''} saved.`
              : 'Your watchlist is empty.'}
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
            Watchlist is stored locally in your browser and not synced across devices.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {watchlist.length > 0 ? (
          <>
            {/* Clear all */}
            <div className="flex justify-end mb-4">
              <button
                onClick={() => {
                  if (window.confirm('Remove all movies from your watchlist?')) {
                    watchlist.forEach((m) => removeFromWatchlist(m.item_id));
                  }
                }}
                className="inline-flex items-center gap-1 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 px-3 py-1.5 rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                Clear all
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {watchlist.map((movie) => (
                <MovieCard
                  key={movie.item_id}
                  movie={movie}
                  isInWatchlist={isInWatchlist(movie.item_id)}
                  onToggleWatchlist={toggleWatchlist}
                />
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <Film className="w-10 h-10 text-gray-400 dark:text-gray-500" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              No movies saved yet
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mt-2 max-w-md mx-auto">
              Browse movies and click the bookmark icon to add them to your watchlist.
            </p>
            <Link
              to="/discover"
              className="mt-6 inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all duration-200"
            >
              <Film className="w-5 h-5" />
              Browse Movies
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
