/**
 * NETSTREAM - Movie Service
 * TMDB API integration: https://www.themoviedb.org/documentation/api
 * API key stored in .env as VITE_TMDB_API_KEY
 */

const API_KEY   = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL  = import.meta.env.VITE_TMDB_BASE_URL  || 'https://api.themoviedb.org/3';
const IMG_BASE  = import.meta.env.VITE_TMDB_IMAGE_BASE || 'https://image.tmdb.org/t/p';

// Image size helpers
const backdrop = (path) => path ? `${IMG_BASE}/original${path}` : 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=1920&q=80';
const poster   = (path) => path ? `${IMG_BASE}/w500${path}`    : 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=500&q=80';

// Shared fetch wrapper — throws on HTTP error
async function tmdb(endpoint, params = {}) {
  const url = new URL(`${BASE_URL}${endpoint}`);
  url.searchParams.set('api_key', API_KEY);
  url.searchParams.set('language', 'en-US');
  for (const [k, v] of Object.entries(params)) {
    url.searchParams.set(k, v);
  }
  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`TMDB ${res.status}: ${res.statusText}`);
  return res.json();
}

// Normalize a raw TMDB movie/tv object into our internal shape
function normalize(item, mediaType) {
  const type   = mediaType || item.media_type || (item.name ? 'tv' : 'movie');
  const title  = item.title || item.name || 'Untitled';
  const date   = item.release_date || item.first_air_date || '';
  const year   = date ? parseInt(date.slice(0, 4), 10) : 2024;
  const rating = item.vote_average ? parseFloat(item.vote_average.toFixed(1)) : 0;
  const seasons = item.number_of_seasons;

  let duration = '2h 10m';
  if (item.runtime) {
    const h = Math.floor(item.runtime / 60);
    const m = item.runtime % 60;
    duration = h > 0 ? `${h}h ${m}m` : `${m}m`;
  } else if (seasons) {
    duration = `${seasons} Season${seasons > 1 ? 's' : ''}`;
  }

  const matchPercentage = Math.min(99, Math.max(70, Math.round(rating * 10)));

  return {
    id:              `tmdb-${item.id}`,
    tmdbId:          item.id,
    title,
    originalTitle:   item.original_title || item.original_name || title,
    type,
    overview:        item.overview || 'No description available.',
    backdrop:        backdrop(item.backdrop_path),
    poster:          poster(item.poster_path),
    releaseDate:     date,
    year,
    rating,
    voteCount:       item.vote_count || 0,
    ageRating:       item.adult ? '18+' : 'PG-13',
    duration,
    matchPercentage,
    genres:          (item.genres || []).map(g => g.name),
    genreIds:        item.genre_ids || (item.genres || []).map(g => g.id),
    categories:      [],
    director:        item.director || '',
    cast:            item.cast || [],
    videoUrl:        'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    isTrending:      false,
    isPopular:       false,
    isTopRated:      false,
  };
}

// ─── PUBLIC SERVICE API ────────────────────────────────────────────────────

export const movieService = {

  /** Trending movies+shows (week) */
  async getTrending() {
    const data = await tmdb('/trending/all/week');
    return data.results
      .filter(i => i.media_type === 'movie' || i.media_type === 'tv')
      .map(i => ({ ...normalize(i), isTrending: true, categories: ['trending'] }));
  },

  /** Popular movies */
  async getPopular() {
    const data = await tmdb('/movie/popular');
    return data.results.map(i => ({ ...normalize(i, 'movie'), isPopular: true, categories: ['popular'] }));
  },

  /** Top rated movies */
  async getTopRated() {
    const data = await tmdb('/movie/top_rated');
    return data.results.map(i => ({ ...normalize(i, 'movie'), isTopRated: true, categories: ['top_rated'] }));
  },

  /** Movies only (now playing) */
  async getMoviesOnly() {
    const [nowPlaying, popular, topRated] = await Promise.all([
      tmdb('/movie/now_playing'),
      tmdb('/movie/popular'),
      tmdb('/movie/top_rated'),
    ]);
    const seen = new Set();
    return [...nowPlaying.results, ...popular.results, ...topRated.results]
      .filter(i => {
        if (seen.has(i.id)) return false;
        seen.add(i.id);
        return true;
      })
      .map(i => normalize(i, 'movie'));
  },

  /** TV shows only (popular) */
  async getTVShowsOnly() {
    const [popular, topRated, airing] = await Promise.all([
      tmdb('/tv/popular'),
      tmdb('/tv/top_rated'),
      tmdb('/tv/on_the_air'),
    ]);
    const seen = new Set();
    return [...popular.results, ...topRated.results, ...airing.results]
      .filter(i => {
        if (seen.has(i.id)) return false;
        seen.add(i.id);
        return true;
      })
      .map(i => normalize(i, 'tv'));
  },

  /** Continue watching — static demo list using real trending posters */
  async getContinueWatching() {
    const data = await tmdb('/trending/movie/week');
    return data.results.slice(0, 4).map((item, idx) => ({
      ...normalize(item, 'movie'),
      progress:       [68, 35, 82, 15][idx],
      remainingTime:  ['44m left', '1h 10m left', '29m left', '1h 51m left'][idx],
    }));
  },

  /** Movies by genre using TMDB genre IDs */
  async getByCategory(category) {
    const GENRE_MAP = {
      action:  28,
      comedy:  35,
      horror:  27,
      romance: 10749,
      scifi:   878,
      thriller: 53,
      drama:   18,
      animation: 16,
    };

    if (category === 'trending')        return this.getTrending();
    if (category === 'popular')         return this.getPopular();
    if (category === 'top_rated')       return this.getTopRated();
    if (category === 'tv')              return this.getTVShowsOnly();
    if (category === 'continue_watching') return this.getContinueWatching();

    const genreId = GENRE_MAP[category.toLowerCase()];
    if (!genreId) return [];

    const data = await tmdb('/discover/movie', {
      with_genres:          genreId,
      sort_by:              'popularity.desc',
      'vote_count.gte':     200,
    });
    return data.results.map(i => normalize(i, 'movie'));
  },

  /** All content (used for hero on Home) */
  async getAll() {
    const data = await tmdb('/trending/all/week');
    return data.results.map(i => normalize(i));
  },

  /** Single title by TMDB id — with full credits appended */
  async getById(id) {
    const tmdbId = String(id).replace('tmdb-', '');
    const [detail, credits] = await Promise.all([
      tmdb(`/movie/${tmdbId}`, { append_to_response: 'videos' }),
      tmdb(`/movie/${tmdbId}/credits`),
    ]);
    const normalized = normalize(detail, 'movie');
    normalized.director = (credits.crew || []).find(c => c.job === 'Director')?.name || '';
    normalized.cast     = (credits.cast || []).slice(0, 6).map(c => c.name);
    normalized.genres   = (detail.genres || []).map(g => g.name);
    return normalized;
  },

  /** Search movies + TV */
  async search(query) {
    if (!query?.trim()) return [];
    const data = await tmdb('/search/multi', { query: query.trim() });
    return data.results
      .filter(i => i.media_type === 'movie' || i.media_type === 'tv')
      .map(i => normalize(i));
  },

  /** Similar titles */
  async getSimilar(movie) {
    if (!movie) return [];
    const tmdbId = String(movie.tmdbId || movie.id.replace('tmdb-', ''));
    const endpoint = movie.type === 'tv'
      ? `/tv/${tmdbId}/similar`
      : `/movie/${tmdbId}/similar`;
    const data = await tmdb(endpoint);
    return data.results.slice(0, 6).map(i => normalize(i, movie.type));
  },
};

export default movieService;
