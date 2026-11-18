import React, { useState, useEffect } from 'react';
import Hero from '../components/Hero';
import MovieRow from '../components/MovieRow';
import MovieCard from '../components/MovieCard';
import { movieService } from '../services/movieService';

export default function NewPopular() {
  const [trending, setTrending] = useState([]);
  const [popular, setPopular] = useState([]);
  const [topRated, setTopRated] = useState([]);
  const [featured, setFeatured] = useState(null);

  useEffect(() => {
    Promise.all([
      movieService.getTrending(),
      movieService.getPopular(),
      movieService.getTopRated()
    ]).then(([trendList, popList, topList]) => {
      setTrending(trendList);
      setPopular(popList);
      setTopRated(topList);
      if (trendList.length > 1) {
        setFeatured(trendList[1]); // Shadows of the Dynasty
      }
    });
  }, []);

  return (
    <div className="new-popular-page" style={{ paddingTop: 'var(--nav-height)', minHeight: '100vh' }}>
      {featured && <Hero movie={featured} />}

      <div style={{ padding: '30px 4% 10px' }}>
        <h1 style={{ fontSize: '2.2rem', fontWeight: 900, marginBottom: '8px' }}>New & Popular</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
          Discover what's hot across the globe right now on NetStream
        </p>
      </div>

      <div className="movie-rows-container" style={{ marginTop: 20 }}>
        <MovieRow title="🔥 Trending Worldwide This Week" movies={trending} />
        <MovieRow title="⭐ NetStream Top 10 Most Watched" movies={popular} isPortrait={true} />
        <MovieRow title="🏆 Critically Acclaimed Masterpieces" movies={topRated} />
      </div>
    </div>
  );
}
