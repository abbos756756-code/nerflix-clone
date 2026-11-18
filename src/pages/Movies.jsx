import React, { useState, useEffect } from 'react';
import Hero from '../components/Hero';
import MovieCard from '../components/MovieCard';
import { movieService } from '../services/movieService';

const GENRES = ['All', 'Action', 'Comedy', 'Horror', 'Romance', 'Sci-Fi', 'Thriller', 'Drama', 'Animation'];

export default function Movies() {
  const [movies, setMovies]           = useState([]);
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [featuredMovie, setFeaturedMovie] = useState(null);
  const [loading, setLoading]         = useState(true);

  useEffect(() => {
    movieService.getMoviesOnly().then((list) => {
      setMovies(list);
      // Pick a random top-rated movie for the hero
      const heroPool = list.filter(m => m.rating >= 7);
      if (heroPool.length > 0) {
        setFeaturedMovie(heroPool[Math.floor(Math.random() * Math.min(heroPool.length, 5))]);
      }
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const filteredMovies = movies.filter((m) => {
    if (selectedGenre === 'All') return true;
    return m.genres?.some(g => g.toLowerCase().includes(selectedGenre.toLowerCase())) ||
           m.genreIds?.includes(getGenreId(selectedGenre));
  });

  return (
    <div className="category-page">
      {featuredMovie && !loading && <Hero movie={featuredMovie} />}

      <div className="category-page-header">
        <h1 className="category-page-title">Movies</h1>
        <div className="genre-filter-pills">
          {GENRES.map(genre => (
            <button
              key={genre}
              className={`genre-filter-pill ${selectedGenre === genre ? 'active' : ''}`}
              onClick={() => setSelectedGenre(genre)}
            >
              {genre}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="genre-grid-container">
          {[...Array(12)].map((_, i) => (
            <div key={i} style={{
              aspectRatio: '2/3', background: 'rgba(255,255,255,0.06)',
              borderRadius: 6, animation: 'skeletonPulse 1.4s ease-in-out infinite',
              animationDelay: `${i * 0.07}s`
            }} />
          ))}
        </div>
      ) : (
        <div className="genre-grid-container">
          {filteredMovies.length > 0
            ? filteredMovies.map(movie => (
                <MovieCard key={movie.id} movie={movie} isPortrait={true} />
              ))
            : (
              <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '60px 0', color: '#888' }}>
                <p style={{ fontSize: '1.1rem' }}>No {selectedGenre} movies found.</p>
                <button
                  className="genre-filter-pill"
                  style={{ marginTop: 16 }}
                  onClick={() => setSelectedGenre('All')}
                >
                  Show All Movies
                </button>
              </div>
            )
          }
        </div>
      )}

      <style>{`@keyframes skeletonPulse { 0%,100% { opacity:.4 } 50% { opacity:.8 } }`}</style>
    </div>
  );
}

function getGenreId(name) {
  const map = { Action: 28, Comedy: 35, Horror: 27, Romance: 10749, 'Sci-Fi': 878, Thriller: 53, Drama: 18, Animation: 16 };
  return map[name];
}
