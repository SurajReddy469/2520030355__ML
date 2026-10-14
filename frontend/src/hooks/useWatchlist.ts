import { useState, useEffect, useCallback } from 'react';
import type { Movie } from '../types';

const WATCHLIST_KEY = 'recommind_watchlist';

function loadWatchlist(): Movie[] {
  try {
    const stored = localStorage.getItem(WATCHLIST_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function saveWatchlist(movies: Movie[]) {
  localStorage.setItem(WATCHLIST_KEY, JSON.stringify(movies));
}

export function useWatchlist() {
  const [watchlist, setWatchlist] = useState<Movie[]>(loadWatchlist);

  useEffect(() => {
    saveWatchlist(watchlist);
  }, [watchlist]);

  const addToWatchlist = useCallback((movie: Movie) => {
    setWatchlist((prev) => {
      if (prev.some((m) => m.item_id === movie.item_id)) return prev;
      return [...prev, movie];
    });
  }, []);

  const removeFromWatchlist = useCallback((itemId: number) => {
    setWatchlist((prev) => prev.filter((m) => m.item_id !== itemId));
  }, []);

  const isInWatchlist = useCallback(
    (itemId: number) => watchlist.some((m) => m.item_id === itemId),
    [watchlist]
  );

  const toggleWatchlist = useCallback(
    (movie: Movie) => {
      if (isInWatchlist(movie.item_id)) {
        removeFromWatchlist(movie.item_id);
      } else {
        addToWatchlist(movie);
      }
    },
    [isInWatchlist, removeFromWatchlist, addToWatchlist]
  );

  return {
    watchlist,
    addToWatchlist,
    removeFromWatchlist,
    isInWatchlist,
    toggleWatchlist,
    watchlistCount: watchlist.length,
  };
}
