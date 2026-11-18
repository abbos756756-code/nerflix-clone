import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Bookmark, Compass, Film, Trash2 } from 'lucide-react';
import MovieCard from '../components/MovieCard';
import { useApp } from '../context/AppContext';

export default function MyList() {
  const { favorites, removeFavorite, showToast } = useApp();
  const navigate = useNavigate();

  return (
    <div className="mylist-page">
      <div className="mylist-header">
        <div>
          <h1 className="mylist-title">My List</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: 4 }}>
            Your personally curated collection of movies and series
          </p>
        </div>
        <div className="mylist-counter">
          {favorites.length} {favorites.length === 1 ? 'Title' : 'Titles'} Saved
        </div>
      </div>

      {favorites.length > 0 ? (
        <div className="mylist-grid">
          {favorites.map((movie) => (
            <div key={movie.id} style={{ position: 'relative' }}>
              <MovieCard movie={movie} isPortrait={true} />
            </div>
          ))}
        </div>
      ) : (
        <div className="mylist-empty">
          <div className="mylist-empty-illustration">
            <Bookmark size={40} />
          </div>
          <h2 className="mylist-empty-title">Your list is currently empty</h2>
          <p className="mylist-empty-text">
            Explore our curated catalog of blockbuster movies, award-winning series, and originals. Click the <b>+</b> icon on any title to save it here for later.
          </p>
          <button 
            className="btn-accent" 
            onClick={() => navigate('/')}
          >
            <Compass size={18} />
            <span>Explore Trending Content</span>
          </button>
        </div>
      )}
    </div>
  );
}
