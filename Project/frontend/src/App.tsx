import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import DiscoverPage from './pages/DiscoverPage';
import RecommendationsPage from './pages/RecommendationsPage';
import MovieDetailPage from './pages/MovieDetailPage';
import WatchlistPage from './pages/WatchlistPage';
import AboutPage from './pages/AboutPage';
import { useWatchlist } from './hooks/useWatchlist';
import { useTheme } from './hooks/useTheme';

export default function App() {
  const { theme, toggleTheme } = useTheme();
  const { watchlist, isInWatchlist, toggleWatchlist, removeFromWatchlist, watchlistCount } =
    useWatchlist();

  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-white text-gray-900 dark:bg-gray-950 dark:text-gray-100 transition-colors duration-200">
        <Navbar
          theme={theme}
          toggleTheme={toggleTheme}
          watchlistCount={watchlistCount}
        />
        <main className="flex-1">
          <Routes>
            <Route
              path="/"
              element={
                <HomePage
                  isInWatchlist={isInWatchlist}
                  toggleWatchlist={toggleWatchlist}
                />
              }
            />
            <Route
              path="/discover"
              element={
                <DiscoverPage
                  isInWatchlist={isInWatchlist}
                  toggleWatchlist={toggleWatchlist}
                />
              }
            />
            <Route
              path="/recommendations"
              element={
                <RecommendationsPage
                  isInWatchlist={isInWatchlist}
                  toggleWatchlist={toggleWatchlist}
                />
              }
            />
            <Route
              path="/movie/:id"
              element={
                <MovieDetailPage
                  isInWatchlist={isInWatchlist}
                  toggleWatchlist={toggleWatchlist}
                />
              }
            />
            <Route
              path="/watchlist"
              element={
                <WatchlistPage
                  watchlist={watchlist}
                  isInWatchlist={isInWatchlist}
                  toggleWatchlist={toggleWatchlist}
                  removeFromWatchlist={removeFromWatchlist}
                />
              }
            />
            <Route path="/about" element={<AboutPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}
