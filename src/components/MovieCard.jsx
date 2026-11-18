import React from 'react';
import { Play, Plus, Check, ChevronDown, Star } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function MovieCard({ movie, isPortrait = false }) {
  const { playMovie, openModal, toggleFavorite, isFavorite } = useApp();

  if (!movie) return null;

  const inList = isFavorite(movie.id);
  const imgSrc = isPortrait ? (movie.poster || movie.backdrop) : (movie.backdrop || movie.poster);

  return (
    <div className="movie-card" onClick={() => openModal(movie)}>
      <div className={`movie-card-inner ${isPortrait ? 'portrait' : ''}`}>
        <img
          src={imgSrc}
          alt={movie.title}
          loading="lazy"
          className="movie-card-image"
        />

        {/* Continue watching progress if present */}
        {movie.progress !== undefined && (
          <div className="card-progress-bar">
            <div 
              className="card-progress-fill" 
              style={{ width: `${movie.progress}%` }} 
            />
          </div>
        )}

        {/* Hover overlay with interactive controls */}
        <div className="card-overlay-hover" onClick={(e) => e.stopPropagation()}>
          <div className="card-hover-actions">
            <div className="card-actions-left">
              <button
                className="card-action-btn play-btn"
                title="Play"
                onClick={() => playMovie(movie)}
              >
                <Play fill="currentColor" size={15} />
              </button>

              <button
                className={`card-action-btn ${inList ? 'active' : ''}`}
                title={inList ? 'Remove from My List' : 'Add to My List'}
                onClick={() => toggleFavorite(movie)}
              >
                {inList ? <Check size={15} /> : <Plus size={15} />}
              </button>
            </div>

            <button
              className="card-action-btn"
              title="Details & Episodes"
              onClick={() => openModal(movie)}
            >
              <ChevronDown size={17} />
            </button>
          </div>

          <div className="card-hover-title">{movie.title}</div>

          <div className="card-hover-meta">
            <span className="match-percentage">{movie.matchPercentage}%</span>
            <span className="badge-age">{movie.ageRating}</span>
            <span style={{ color: '#aaa', fontSize: '0.72rem' }}>{movie.duration}</span>
            <span className="badge-quality">HD</span>
          </div>

          <div className="card-hover-genres">
            {movie.genres?.slice(0, 3).map((g) => (
              <span key={g}>{g}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
