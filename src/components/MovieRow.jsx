import React, { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import MovieCard from './MovieCard';

export default function MovieRow({ 
  title, 
  movies = [], 
  isPortrait = false, 
  onExploreAll 
}) {
  const sliderRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (sliderRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
      setCanScrollLeft(scrollLeft > 10);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, [movies]);

  const handleScroll = (direction) => {
    if (sliderRef.current) {
      const { clientWidth } = sliderRef.current;
      const scrollAmount = clientWidth * 0.75;
      sliderRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
      setTimeout(checkScroll, 350);
    }
  };

  if (!movies || movies.length === 0) return null;

  return (
    <div className="movie-row">
      <div className="movie-row-header">
        <h2 className="movie-row-title" onClick={onExploreAll}>
          {title}
        </h2>
        {onExploreAll && (
          <span className="movie-row-see-all" onClick={onExploreAll}>
            Explore All <ChevronRight size={14} />
          </span>
        )}
      </div>

      <div className="movie-slider-wrapper">
        {canScrollLeft && (
          <button
            className="slider-arrow left"
            onClick={() => handleScroll('left')}
            aria-label="Scroll Left"
          >
            <ChevronLeft size={28} />
          </button>
        )}

        <div 
          className="movie-slider-track" 
          ref={sliderRef}
          onScroll={checkScroll}
        >
          {movies.map((movie) => (
            <MovieCard 
              key={movie.id} 
              movie={movie} 
              isPortrait={isPortrait} 
            />
          ))}
        </div>

        {canScrollRight && (
          <button
            className="slider-arrow right"
            onClick={() => handleScroll('right')}
            aria-label="Scroll Right"
          >
            <ChevronRight size={28} />
          </button>
        )}
      </div>
    </div>
  );
}
