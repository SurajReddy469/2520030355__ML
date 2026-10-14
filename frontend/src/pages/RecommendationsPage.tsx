import { useState } from 'react';
import { Sparkles, User, AlertCircle, RefreshCw, ArrowRight } from 'lucide-react';
import type { Movie } from '../types';
import { getRecommendations } from '../services/api';
import MovieCard from '../components/MovieCard';
import MovieCardSkeleton from '../components/MovieCardSkeleton';

interface RecommendationsPageProps {
  isInWatchlist: (id: number) => boolean;
  toggleWatchlist: (movie: Movie) => void;
}

export default function RecommendationsPage({
  isInWatchlist,
  toggleWatchlist,
}: RecommendationsPageProps) {
  const [userId, setUserId] = useState('');
  const [numRecs, setNumRecs] = useState(10);
  const [recommendations, setRecommendations] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fetchedForUser, setFetchedForUser] = useState<number | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const id = parseInt(userId, 10);
    if (isNaN(id) || id < 1) {
      setError('Please enter a valid positive user ID (e.g., 1–943).');
      return;
    }

    setLoading(true);
    try {
      const result = await getRecommendations(id, numRecs);
      setRecommendations(result.recommendations);
      setFetchedForUser(result.user_id);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch recommendations.');
      setRecommendations([]);
      setFetchedForUser(null);
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    if (fetchedForUser !== null) {
      setUserId(String(fetchedForUser));
      handleSubmit(new Event('submit') as unknown as React.FormEvent);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      {/* Header */}
      <section className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-950/30 dark:to-blue-950/20 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-3">
            <Sparkles className="w-7 h-7 text-purple-600 dark:text-purple-400" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Personalized Recommendations
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl">
            Enter a user ID from the MovieLens dataset to receive personalised movie suggestions
            from our hybrid ML model. Valid IDs range from 1 to 943.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Input form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm mb-8"
        >
          <div className="flex flex-col sm:flex-row gap-4 items-end">
            <div className="flex-1 min-w-0">
              <label
                htmlFor="userId"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5"
              >
                <User className="w-4 h-4 inline mr-1" />
                User ID
              </label>
              <input
                id="userId"
                type="number"
                min="1"
                step="1"
                placeholder="e.g. 42"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                required
              />
            </div>

            <div className="w-32">
              <label
                htmlFor="numRecs"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5"
              >
                Count
              </label>
              <select
                id="numRecs"
                value={numRecs}
                onChange={(e) => setNumRecs(Number(e.target.value))}
                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                {[5, 10, 15, 20, 30, 50].map((n) => (
                  <option key={n} value={n}>
                    {n} movies
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-purple-500/20 transition-all duration-200"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Loading…
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Get Recommendations
                </>
              )}
            </button>
          </div>
        </form>

        {/* Error state */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 mb-8 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-red-800 dark:text-red-300">{error}</p>
              <button
                onClick={handleRetry}
                className="mt-2 text-sm text-red-600 dark:text-red-400 hover:underline inline-flex items-center gap-1"
              >
                <RefreshCw className="w-3 h-3" /> Retry
              </button>
            </div>
          </div>
        )}

        {/* Loading state */}
        {loading && (
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Generating recommendations for User {userId}…
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {Array.from({ length: numRecs }).map((_, i) => (
                <MovieCardSkeleton key={i} />
              ))}
            </div>
          </div>
        )}

        {/* Results */}
        {!loading && recommendations.length > 0 && fetchedForUser !== null && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Recommendations for User #{fetchedForUser}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                  {recommendations.length} personalised suggestions based on viewing history
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {recommendations.map((movie) => (
                <MovieCard
                  key={movie.item_id}
                  movie={movie}
                  isInWatchlist={isInWatchlist(movie.item_id)}
                  onToggleWatchlist={toggleWatchlist}
                  showPredictedRating
                />
              ))}
            </div>
          </div>
        )}

        {/* Empty state – no results after fetch */}
        {!loading && !error && fetchedForUser !== null && recommendations.length === 0 && (
          <div className="text-center py-16">
            <Sparkles className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
              No recommendations found
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              This user may have already seen all available movies or may not have enough history.
            </p>
          </div>
        )}

        {/* Initial empty state */}
        {!loading && !error && fetchedForUser === null && recommendations.length === 0 && (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <Sparkles className="w-10 h-10 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              Ready to Discover?
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mt-2 max-w-md mx-auto">
              Enter a user ID above to get personalised movie recommendations powered by our hybrid
              machine learning model.
            </p>
            <div className="mt-6 flex items-center justify-center gap-2 text-sm text-gray-400">
              <span>Try user IDs like</span>
              {[1, 42, 100, 500].map((id) => (
                <button
                  key={id}
                  onClick={() => setUserId(String(id))}
                  className="px-2.5 py-1 bg-gray-100 dark:bg-gray-800 rounded-lg text-purple-600 dark:text-purple-400 font-medium hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors"
                >
                  {id}
                </button>
              ))}
              <ArrowRight className="w-4 h-4 text-gray-400" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
