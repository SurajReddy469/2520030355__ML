import { Link } from 'react-router-dom';
import { Brain, Github, Code2, Database } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <Brain className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              <span className="text-lg font-bold text-gray-900 dark:text-white">RecomMind</span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Discover Movies That Understand You. AI-powered personalized movie recommendations.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Navigate</h3>
            <ul className="space-y-2">
              {[
                { to: '/', label: 'Home' },
                { to: '/discover', label: 'Discover' },
                { to: '/recommendations', label: 'Recommendations' },
                { to: '/watchlist', label: 'Watchlist' },
                { to: '/about', label: 'About' },
              ].map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Tech Stack */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Technology</h3>
            <ul className="space-y-2">
              <li className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <Code2 className="w-4 h-4" /> React + TypeScript
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <Code2 className="w-4 h-4" /> FastAPI + Python
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <Database className="w-4 h-4" /> MovieLens 100K
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <Brain className="w-4 h-4" /> Hybrid ML Model
              </li>
            </ul>
          </div>

          {/* Project */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Project</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              Academic project demonstrating personalized recommendation using hybrid collaborative + content-based filtering.
            </p>
            <div className="flex items-center gap-2">
              <Github className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-500">Academic Project</span>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-gray-200 dark:border-gray-800">
          <p className="text-center text-sm text-gray-500 dark:text-gray-500">
            © {new Date().getFullYear()} RecomMind. Built for academic demonstration purposes.
          </p>
        </div>
      </div>
    </footer>
  );
}
