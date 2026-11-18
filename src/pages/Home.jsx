import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Hero from '../components/Hero';
import MovieRow from '../components/MovieRow';
import { movieService } from '../services/movieService';
import { useApp } from '../context/AppContext';

function RowSkeleton() {
  return (
    <div style={{ padding: '0 4%', marginBottom: 8 }}>
      <div style={{
        height: 24, width: 240, background: 'rgba(255,255,255,0.08)',
        borderRadius: 4, marginBottom: 14, animation: 'skeletonPulse 1.4s ease-in-out infinite'
      }} />
      <div style={{ display: 'flex', gap: 14 }}>
        {[...Array(6)].map((_, i) => (
          <div key={i} style={{
            flex: '0 0 calc((100% - 70px) / 6)',
            aspectRatio: '16/9',
            background: 'rgba(255,255,255,0.06)',
            borderRadius: 6,
            animation: 'skeletonPulse 1.4s ease-in-out infinite',
            animationDelay: `${i * 0.1}s`
          }} />
        ))}
      </div>
    </div>
  );
}

export default function Home() {
  const [featuredMovie, setFeaturedMovie]       = useState(null);
  const [continueWatching, setContinueWatching] = useState([]);
  const [trending, setTrending]                 = useState([]);
  const [popular, setPopular]                   = useState([]);
  const [topRated, setTopRated]                 = useState([]);
  const [actionMovies, setActionMovies]         = useState([]);
  const [scifiMovies, setScifiMovies]           = useState([]);
  const [tvShows, setTvShows]                   = useState([]);
  const [comedyMovies, setComedyMovies]         = useState([]);
  const [horrorMovies, setHorrorMovies]         = useState([]);
  const [romanceMovies, setRomanceMovies]       = useState([]);
  const [thrillerMovies, setThrillerMovies]     = useState([]);
  const [loading, setLoading]                   = useState(true);
  const [error, setError]                       = useState(null);

  const { favorites } = useApp();
  const navigate = useNavigate();

  useEffect(() => {
    let alive = true;

    async function loadAll() {
      try {
        // Phase 1: Load hero + first visible rows quickly
        const [all, trendList] = await Promise.all([
          movieService.getAll(),
          movieService.getTrending(),
        ]);

        if (!alive) return;
        setFeaturedMovie(all[0]);
        setTrending(trendList);
        setLoading(false);

        // Phase 2: Load remaining rows in background
        const [
          contWatch, popList, topList,
          actList, sciList, tvList,
          comList, horList, romList, thrList
        ] = await Promise.all([
          movieService.getContinueWatching(),
          movieService.getPopular(),
          movieService.getTopRated(),
          movieService.getByCategory('action'),
          movieService.getByCategory('scifi'),
          movieService.getByCategory('tv'),
          movieService.getByCategory('comedy'),
          movieService.getByCategory('horror'),
          movieService.getByCategory('romance'),
          movieService.getByCategory('thriller'),
        ]);

        if (!alive) return;
        setContinueWatching(contWatch);
        setPopular(popList);
        setTopRated(topList);
        setActionMovies(actList);
        setScifiMovies(sciList);
        setTvShows(tvList);
        setComedyMovies(comList);
        setHorrorMovies(horList);
        setRomanceMovies(romList);
        setThrillerMovies(thrList);
      } catch (err) {
        if (!alive) return;
        console.error('TMDB load failed:', err);
        setError('Could not connect to the content server. Check your API key or internet connection.');
        setLoading(false);
      }
    }

    loadAll();
    return () => { alive = false; };
  }, []);

  if (loading) {
    return (
      <div style={{ paddingTop: '65vh', paddingBottom: 60, background: '#080808', minHeight: '100vh' }}>
        <style>{`
          @keyframes skeletonPulse {
            0%, 100% { opacity: 0.4; }
            50% { opacity: 0.8; }
          }
        `}</style>
        {/* Hero skeleton */}
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, height: '65vh',
          background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
          display: 'flex', alignItems: 'center', padding: '0 4%'
        }}>
          <div style={{ maxWidth: 500 }}>
            <div style={{ height: 16, width: 180, background: 'rgba(229,9,20,0.4)', borderRadius: 20, marginBottom: 20, animation: 'skeletonPulse 1.4s ease-in-out infinite' }} />
            <div style={{ height: 52, width: 420, background: 'rgba(255,255,255,0.1)', borderRadius: 6, marginBottom: 16, animation: 'skeletonPulse 1.4s ease-in-out infinite' }} />
            <div style={{ height: 52, width: 320, background: 'rgba(255,255,255,0.07)', borderRadius: 6, marginBottom: 20, animation: 'skeletonPulse 1.4s ease-in-out infinite' }} />
            <div style={{ height: 16, width: 380, background: 'rgba(255,255,255,0.06)', borderRadius: 4, marginBottom: 8, animation: 'skeletonPulse 1.4s ease-in-out infinite' }} />
            <div style={{ height: 16, width: 300, background: 'rgba(255,255,255,0.06)', borderRadius: 4, marginBottom: 28, animation: 'skeletonPulse 1.4s ease-in-out infinite' }} />
            <div style={{ display: 'flex', gap: 14 }}>
              <div style={{ height: 44, width: 120, background: 'rgba(255,255,255,0.15)', borderRadius: 4, animation: 'skeletonPulse 1.4s ease-in-out infinite' }} />
              <div style={{ height: 44, width: 140, background: 'rgba(255,255,255,0.08)', borderRadius: 4, animation: 'skeletonPulse 1.4s ease-in-out infinite' }} />
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 42 }}>
          {[...Array(4)].map((_, i) => <RowSkeleton key={i} />)}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        minHeight: '100vh', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', padding: 40,
        background: '#080808', textAlign: 'center'
      }}>
        <div style={{ fontSize: 64, marginBottom: 20 }}>⚠️</div>
        <h2 style={{ fontSize: '1.6rem', marginBottom: 12 }}>Content Unavailable</h2>
        <p style={{ color: '#aaa', maxWidth: 440, lineHeight: 1.6, marginBottom: 28 }}>{error}</p>
        <button className="btn-accent" onClick={() => window.location.reload()}>
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="home-page">
      {featuredMovie && <Hero movie={featuredMovie} />}

      <div className="movie-rows-container">
        {/* Continue Watching */}
        {continueWatching.length > 0 && (
          <MovieRow title="Continue Watching" movies={continueWatching} />
        )}

        {/* My List */}
        {favorites.length > 0 && (
          <MovieRow
            title="My List"
            movies={favorites}
            isPortrait={true}
            onExploreAll={() => navigate('/my-list')}
          />
        )}

        {/* Trending Now */}
        <MovieRow
          title="🔥 Trending Now"
          movies={trending}
          onExploreAll={() => navigate('/new-popular')}
        />

        {/* Popular */}
        {popular.length > 0 && (
          <MovieRow
            title="Popular on NetStream"
            movies={popular}
            onExploreAll={() => navigate('/movies')}
          />
        )}

        {/* Top Rated */}
        {topRated.length > 0 && (
          <MovieRow
            title="⭐ Top Rated & Critically Acclaimed"
            movies={topRated}
            isPortrait={true}
            onExploreAll={() => navigate('/movies')}
          />
        )}

        {/* Action */}
        {actionMovies.length > 0 && (
          <MovieRow
            title="Action & Adrenaline"
            movies={actionMovies}
            onExploreAll={() => navigate('/movies')}
          />
        )}

        {/* Sci-Fi */}
        {scifiMovies.length > 0 && (
          <MovieRow
            title="🚀 Sci-Fi & Beyond"
            movies={scifiMovies}
            onExploreAll={() => navigate('/movies')}
          />
        )}

        {/* TV Shows */}
        {tvShows.length > 0 && (
          <MovieRow
            title="📺 Binge-Worthy TV Series"
            movies={tvShows}
            isPortrait={true}
            onExploreAll={() => navigate('/tv-shows')}
          />
        )}

        {/* Thriller */}
        {thrillerMovies.length > 0 && (
          <MovieRow
            title="🔪 Thrillers & Suspense"
            movies={thrillerMovies}
            onExploreAll={() => navigate('/movies')}
          />
        )}

        {/* Horror */}
        {horrorMovies.length > 0 && (
          <MovieRow
            title="😱 Horror & Dark Suspense"
            movies={horrorMovies}
            onExploreAll={() => navigate('/movies')}
          />
        )}

        {/* Comedy */}
        {comedyMovies.length > 0 && (
          <MovieRow
            title="😄 Comedies"
            movies={comedyMovies}
            onExploreAll={() => navigate('/movies')}
          />
        )}

        {/* Romance */}
        {romanceMovies.length > 0 && (
          <MovieRow
            title="❤️ Romantic Escapes"
            movies={romanceMovies}
            onExploreAll={() => navigate('/movies')}
          />
        )}
      </div>
    </div>
  );
}
