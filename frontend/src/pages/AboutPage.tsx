import {
  Brain,
  Code2,
  Database,
  Users,
  Cpu,
  BarChart3,
  Layers,
  GitBranch,
  Target,
  Lightbulb,
} from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      {/* Header */}
      <section className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-950/30 dark:to-blue-950/20 py-14">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Brain className="w-12 h-12 text-purple-600 dark:text-purple-400 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">About RecomMind</h1>
          <p className="mt-3 text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            A personalized movie recommendation system powered by hybrid machine learning,
            built as an academic project.
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-14">
        {/* Purpose */}
        <section>
          <div className="flex items-center gap-3 mb-4">
            <Target className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Purpose</h2>
          </div>
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
            RecomMind demonstrates how machine learning can be used to provide personalised movie
            recommendations. The system analyses patterns in user ratings from the MovieLens dataset
            and combines multiple recommendation approaches to suggest movies that align with each
            user's individual preferences.
          </p>
        </section>

        {/* ML Approach */}
        <section>
          <div className="flex items-center gap-3 mb-4">
            <Cpu className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              How Recommendations Work
            </h2>
          </div>

          <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
            RecomMind uses a <strong>hybrid recommendation model</strong> that combines two
            complementary approaches and blends their scores with a configurable weight (α = 0.75):
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2 mb-3">
                <Users className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  Collaborative Filtering (SVD)
                </h3>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                Uses Singular Value Decomposition (SVD) via the Surprise library to learn latent
                factors from the user-item rating matrix. Configured with 80 latent factors, trained
                for 30 epochs. Identifies users with similar rating patterns and predicts how a user
                would rate unseen movies based on these patterns.
              </p>
              <p className="text-xs text-gray-400 mt-3">Weight: 75% of final score</p>
            </div>

            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2 mb-3">
                <Layers className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  Content-Based Filtering (TF-IDF)
                </h3>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                Builds TF-IDF representations of movie titles and genres, then uses cosine similarity
                to measure how closely a candidate movie matches the user's highly-rated movies
                (rating ≥ 4). The similarity score is weighted by the user's actual ratings of the
                liked items.
              </p>
              <p className="text-xs text-gray-400 mt-3">Weight: 25% of final score</p>
            </div>
          </div>

          <div className="mt-6 bg-purple-50 dark:bg-purple-900/20 rounded-xl p-6 border border-purple-200 dark:border-purple-800">
            <div className="flex items-center gap-2 mb-2">
              <GitBranch className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              <h3 className="font-semibold text-gray-900 dark:text-white">Additional Models</h3>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              The project also trains an optional <strong>Random Forest Regressor</strong> using
              engineered features (user mean rating, user count, item mean rating, item count, and
              SVD prediction) as a secondary preference predictor. This demonstrates ensemble
              approaches in recommendation systems.
            </p>
          </div>
        </section>

        {/* Evaluation */}
        <section>
          <div className="flex items-center gap-3 mb-4">
            <BarChart3 className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Evaluation</h2>
          </div>
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
            The model is evaluated using a per-user chronological holdout strategy (last interaction
            as test). Metrics include:
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { name: 'MAE', desc: 'Mean Absolute Error' },
              { name: 'RMSE', desc: 'Root Mean Squared Error' },
              { name: 'Precision@10', desc: 'Top-10 precision' },
              { name: 'Recall@10', desc: 'Top-10 recall' },
              { name: 'F1@10', desc: 'Harmonic mean' },
              { name: 'NDCG@10', desc: 'Normalised DCG' },
              { name: 'MAP@10', desc: 'Mean Avg Precision' },
            ].map((m) => (
              <div
                key={m.name}
                className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3 border border-gray-200 dark:border-gray-700"
              >
                <p className="text-sm font-semibold text-gray-900 dark:text-white">{m.name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{m.desc}</p>
              </div>
            ))}
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-3">
            Run <code className="px-1 py-0.5 bg-gray-100 dark:bg-gray-800 rounded text-xs">python src/evaluate.py</code> to
            generate measured results. Results are never hardcoded.
          </p>
        </section>

        {/* Dataset */}
        <section>
          <div className="flex items-center gap-3 mb-4">
            <Database className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              MovieLens 100K Dataset
            </h2>
          </div>
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
            RecomMind uses the{' '}
            <a
              href="https://grouplens.org/datasets/movielens/100k/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-purple-600 dark:text-purple-400 hover:underline"
            >
              MovieLens 100K
            </a>{' '}
            dataset from GroupLens Research at the University of Minnesota:
          </p>
          <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-400 text-sm">
            <li>100,000 ratings on a 1–5 scale</li>
            <li>943 users</li>
            <li>1,682 movies</li>
            <li>19 genre categories</li>
            <li>Collected through the MovieLens website</li>
          </ul>
        </section>

        {/* Tech Stack */}
        <section>
          <div className="flex items-center gap-3 mb-4">
            <Code2 className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Technology Stack</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Backend</h3>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li>• Python 3.10+</li>
                <li>• FastAPI — REST API framework</li>
                <li>• Scikit-learn — TF-IDF, cosine similarity, Random Forest</li>
                <li>• Scikit-Surprise — SVD collaborative filtering</li>
                <li>• Pandas &amp; NumPy — data processing</li>
                <li>• Joblib — model serialisation</li>
                <li>• Flask — original demo UI (preserved)</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Frontend</h3>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li>• React 18 with TypeScript</li>
                <li>• Vite — build tooling</li>
                <li>• Tailwind CSS — styling</li>
                <li>• React Router — client-side routing</li>
                <li>• Axios — HTTP client</li>
                <li>• Lucide React — icon library</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Academic Context */}
        <section>
          <div className="flex items-center gap-3 mb-4">
            <Lightbulb className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Academic Context
            </h2>
          </div>
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
            This project was developed as part of an academic programme to demonstrate practical
            application of machine learning techniques in recommendation systems. It covers data
            preprocessing, model training, evaluation with standard metrics, web API development,
            and modern frontend development. All experimental results shown in the evaluation are
            generated by actually running the model — no results are fabricated or hardcoded.
          </p>
        </section>
      </div>
    </div>
  );
}
