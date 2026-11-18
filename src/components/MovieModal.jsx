import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Play, Plus, Check, Star } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { movieService } from '../services/movieService';

export default function MovieModal() {
  const { selectedMovie, closeModal, openModal, playMovie, toggleFavorite, isFavorite } = useApp();
  const [detail, setDetail]           = useState(null);   // enriched with cast/director
  const [similarMovies, setSimilarMovies] = useState([]);
  const [loadingDetail, setLoadingDetail] = useState(false);

  useEffect(() => {
    if (!selectedMovie) {
      document.body.style.overflow = 'unset';
      setDetail(null);
      setSimilarMovies([]);
      return;
    }

    document.body.style.overflow = 'hidden';
    setDetail(selectedMovie);       // show immediately with what we have
    setLoadingDetail(true);

    // Enrich with full cast/director from TMDB
    movieService.getById(selectedMovie.tmdbId || selectedMovie.id)
      .then(full => { if (full) setDetail(full); })
      .catch(() => {/* keep base data */})
      .finally(() => setLoadingDetail(false));

    // Load similar titles
    movieService.getSimilar(selectedMovie)
      .then(setSimilarMovies)
      .catch(() => setSimilarMovies([]));

    const onKey = (e) => { if (e.key === 'Escape') closeModal(); };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', onKey);
    };
  }, [selectedMovie, closeModal]);

  if (!selectedMovie) return null;

  const movie  = detail || selectedMovie;
  const inList = isFavorite(movie.id);

  return (
    <AnimatePresence>
      <div className="modal-backdrop" onClick={closeModal}>
        <motion.div
          className="movie-modal"
          onClick={e => e.stopPropagation()}
          initial={{ opacity: 0, scale: 0.92, y: 25 }}
          animate={{ opacity: 1, scale: 1,    y: 0  }}
          exit  ={{ opacity: 0, scale: 0.95,  y: 20 }}
          transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Close */}
          <button className="modal-close-btn" onClick={closeModal} aria-label="Close">
            <X size={20} />
          </button>

          {/* Banner */}
          <div className="modal-banner">
            <img src={movie.backdrop} alt={movie.title} className="modal-banner-img" />
            <div className="modal-banner-gradient" />
            <div className="modal-banner-content">
              <h1 className="modal-banner-title">{movie.title}</h1>
              <div className="modal-banner-actions">
                <button
                  className="btn-primary"
                  onClick={() => { closeModal(); playMovie(movie); }}
                >
                  <Play fill="#000" size={20} /> Play
                </button>
                <button
                  className={`icon-btn-round ${inList ? 'active' : ''}`}
                  onClick={() => toggleFavorite(movie)}
                  title={inList ? 'Remove from My List' : 'Add to My List'}
                >
                  {inList ? <Check size={20} /> : <Plus size={20} />}
                </button>
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="modal-body">
            <div className="modal-details-grid">
              {/* Left */}
              <div>
                <div className="modal-meta-row">
                  <span className="match-percentage">{movie.matchPercentage}% Match</span>
                  <span style={{ color: '#fff', fontWeight: 600 }}>{movie.year}</span>
                  <span className="badge-age">{movie.ageRating}</span>
                  {movie.duration && (
                    <span style={{ color: '#aaa', fontSize: '0.9rem' }}>{movie.duration}</span>
                  )}
                  {movie.rating > 0 && (
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#ffb800', fontWeight: 700, fontSize: '0.9rem' }}>
                      <Star size={14} fill="#ffb800" /> {movie.rating.toFixed(1)}
                    </span>
                  )}
                  <span className="badge-quality">HD</span>
                </div>
                <p className="modal-overview">{movie.overview}</p>
              </div>

              {/* Right */}
              <div className="modal-side-info">
                {movie.cast?.length > 0 && (
                  <div className="modal-info-item">
                    <span className="modal-info-label">Cast: </span>
                    <span className="modal-info-value">{movie.cast.join(', ')}</span>
                  </div>
                )}
                {loadingDetail && !movie.cast?.length && (
                  <div style={{ height: 14, width: '80%', background: 'rgba(255,255,255,0.08)', borderRadius: 4 }} />
                )}
                {movie.genres?.length > 0 && (
                  <div className="modal-info-item">
                    <span className="modal-info-label">Genres: </span>
                    <span className="modal-info-value">{movie.genres.join(', ')}</span>
                  </div>
                )}
                {movie.director && (
                  <div className="modal-info-item">
                    <span className="modal-info-label">Director: </span>
                    <span className="modal-info-value">{movie.director}</span>
                  </div>
                )}
                {movie.releaseDate && (
                  <div className="modal-info-item">
                    <span className="modal-info-label">Release Date: </span>
                    <span className="modal-info-value">
                      {new Date(movie.releaseDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </span>
                  </div>
                )}
                {movie.voteCount > 0 && (
                  <div className="modal-info-item">
                    <span className="modal-info-label">Votes: </span>
                    <span className="modal-info-value">{movie.voteCount.toLocaleString()}</span>
                  </div>
                )}
              </div>
            </div>

            {/* More Like This */}
            {similarMovies.length > 0 && (
              <div className="modal-similar-section">
                <h3 className="modal-similar-heading">More Like This</h3>
                <div className="similar-grid">
                  {similarMovies.map(similar => {
                    const isFav = isFavorite(similar.id);
                    return (
                      <div
                        key={similar.id}
                        className="similar-card"
                        onClick={() => openModal(similar)}
                      >
                        <div className="similar-card-img-wrap">
                          <img src={similar.backdrop || similar.poster} alt={similar.title} />
                          <span className="similar-card-duration">{similar.duration}</span>
                        </div>
                        <div className="similar-card-content">
                          <div className="similar-card-title">{similar.title}</div>
                          <div className="similar-card-meta">
                            <span className="match-percentage">{similar.matchPercentage}%</span>
                            <span className="badge-age">{similar.ageRating}</span>
                            <button
                              className={`card-action-btn ${isFav ? 'active' : ''}`}
                              onClick={e => { e.stopPropagation(); toggleFavorite(similar); }}
                              style={{ width: 28, height: 28 }}
                              title={isFav ? 'Remove' : 'Add to list'}
                            >
                              {isFav ? <Check size={14} /> : <Plus size={14} />}
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
