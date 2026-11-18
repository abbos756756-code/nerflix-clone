import React, { useState, useEffect } from 'react';
import Hero from '../components/Hero';
import MovieCard from '../components/MovieCard';
import { movieService } from '../services/movieService';

const TV_GENRES = ['All', 'Drama', 'Crime', 'Sci-Fi & Fantasy', 'Comedy', 'Action', 'Reality', 'Mystery'];

export default function TVShows() {
  const [shows, setShows]                 = useState([]);
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [featuredShow, setFeaturedShow]   = useState(null);
  const [loading, setLoading]             = useState(true);

  useEffect(() => {
    movieService.getTVShowsOnly().then((list) => {
      setShows(list);
      const heroPool = list.filter(s => s.rating >= 7 && s.backdrop);
      if (heroPool.length > 0) {
        setFeaturedShow(heroPool[Math.floor(Math.random() * Math.min(heroPool.length, 5))]);
      }
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const filteredShows = shows.filter((s) => {
    if (selectedGenre === 'All') return true;
    return s.genres?.some(g => g.toLowerCase().includes(selectedGenre.toLowerCase().split(' ')[0]));
  });

  return (
    <div className="category-page">
      {featuredShow && !loading && <Hero movie={featuredShow} />}

      <div className="category-page-header">
        <h1 className="category-page-title">TV Shows</h1>
        <div className="genre-filter-pills">
          {TV_GENRES.map(genre => (
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
          {filteredShows.length > 0
            ? filteredShows.map(show => (
                <MovieCard key={show.id} movie={show} isPortrait={true} />
              ))
            : (
              <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '60px 0', color: '#888' }}>
                <p style={{ fontSize: '1.1rem' }}>No {selectedGenre} shows found.</p>
                <button
                  className="genre-filter-pill"
                  style={{ marginTop: 16 }}
                  onClick={() => setSelectedGenre('All')}
                >
                  Show All Series
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
