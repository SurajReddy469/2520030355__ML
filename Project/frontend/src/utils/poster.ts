/**
 * Movie poster utilities.
 *
 * Uses a deterministic color generator for placeholder posters when no real
 * poster image is available. We generate a gradient based on the movie title
 * so the same movie always gets the same colour.
 */

// Placeholder poster: generates an inline SVG data URI with movie initials
export function getPlaceholderPoster(title: string): string {
  const clean = title.replace(/\s*\(\d{4}\)\s*$/, '').trim();
  const initials = clean
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() || '')
    .join('');

  // Deterministic colour from title hash
  let hash = 0;
  for (let i = 0; i < title.length; i++) {
    hash = title.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = Math.abs(hash % 360);

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="300" height="450" viewBox="0 0 300 450">
      <defs>
        <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="hsl(${hue}, 60%, 45%)"/>
          <stop offset="100%" stop-color="hsl(${(hue + 40) % 360}, 50%, 35%)"/>
        </linearGradient>
      </defs>
      <rect width="300" height="450" fill="url(#bg)" rx="12"/>
      <text x="150" y="200" text-anchor="middle" font-family="system-ui, sans-serif"
            font-size="72" font-weight="bold" fill="white" opacity="0.9">${initials}</text>
      <text x="150" y="280" text-anchor="middle" font-family="system-ui, sans-serif"
            font-size="14" fill="white" opacity="0.6">No poster available</text>
    </svg>
  `.trim();

  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

/**
 * Get a movie poster URL without contacting an external service.
 */
export function getMoviePosterUrl(title: string): string {
  return getPlaceholderPoster(title);
}

// Genre icon mapping for visual consistency
export const GENRE_COLORS: Record<string, string> = {
  Action: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  Adventure: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  Animation: 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400',
  Children: 'bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400',
  Comedy: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  Crime: 'bg-slate-100 text-slate-700 dark:bg-slate-900/30 dark:text-slate-400',
  Documentary: 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400',
  Drama: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  Fantasy: 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400',
  'Film-Noir': 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400',
  Horror: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
  Musical: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400',
  Mystery: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400',
  Romance: 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400',
  'Sci-Fi': 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400',
  Thriller: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  War: 'bg-stone-100 text-stone-700 dark:bg-stone-900/30 dark:text-stone-400',
  Western: 'bg-lime-100 text-lime-700 dark:bg-lime-900/30 dark:text-lime-400',
};
