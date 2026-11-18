import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Info, Volume2, VolumeX, Plus, Check } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function Hero({ movie }) {
  const { playMovie, openModal, toggleFavorite, isFavorite } = useApp();
  const [isMuted, setIsMuted] = useState(true);

  if (!movie) return null;

  const inList = isFavorite(movie.id);

  return (
    <div className="hero">
      {/* Background with cinematic vignette */}
      <div className="hero-background">
        <img
          src={movie.backdrop}
          alt={movie.title}
          className="hero-backdrop-img"
        />
        <div className="hero-vignette" />
      </div>

      {/* Main Content */}
      <motion.div 
        className="hero-content"
        initial={{ opacity: 0, y: 35 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="hero-badge-pill">
          <span>#1 In Movies Today</span>
        </div>

        <h1 className="hero-title">{movie.title}</h1>

        <div className="hero-meta-row">
          <span className="match-percentage">{movie.matchPercentage}% Match</span>
          <span className="hero-meta-year">{movie.year}</span>
          <span className="badge-age">{movie.ageRating}</span>
          <span className="badge-quality">ULTRA HD 4K</span>
          <span style={{ color: '#cccccc', fontSize: '0.88rem' }}>{movie.duration}</span>
          <div className="hero-genre-tags">
            {movie.genres?.slice(0, 3).map((g) => (
              <span key={g} className="hero-genre-tag">{g}</span>
            ))}
          </div>
        </div>

        <p className="hero-description">{movie.overview}</p>

        <div className="hero-actions">
          <button 
            className="btn-primary" 
            onClick={() => playMovie(movie)}
            title="Play movie"
          >
            <Play fill="#000000" size={20} />
            <span>Play</span>
          </button>

          <button 
            className="btn-secondary" 
            onClick={() => openModal(movie)}
            title="More Information"
          >
            <Info size={20} />
            <span>More Info</span>
          </button>

          <button
            className={`icon-btn-round ${inList ? 'active' : ''}`}
            onClick={() => toggleFavorite(movie)}
            title={inList ? 'Remove from My List' : 'Add to My List'}
          >
            {inList ? <Check size={18} /> : <Plus size={18} />}
          </button>
        </div>
      </motion.div>

      {/* Right Side Rating & Volume Badges */}
      <div className="hero-side-controls">
        <button 
          className="icon-btn-round"
          onClick={() => setIsMuted(!isMuted)}
          aria-label={isMuted ? 'Unmute' : 'Mute'}
          title={isMuted ? 'Unmute audio' : 'Mute audio'}
        >
          {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
        </button>
        <div className="hero-rating-flag">
          <span>{movie.ageRating}</span>
        </div>
      </div>
    </div>
  );
}
