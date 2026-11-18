import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search as SearchIcon, Film, AlertCircle } from 'lucide-react';
import SearchBar from '../components/SearchBar';
import MovieCard from '../components/MovieCard';
import { movieService } from '../services/movieService';
import { useApp } from '../context/AppContext';

export default function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const urlQuery = searchParams.get('q') || '';
  
  const { searchQuery, setSearchQuery } = useApp();
  const [query, setQuery] = useState(urlQuery || searchQuery || '');
  const [results, setResults] = useState([]);
  const [popularSuggestions, setPopularSuggestions] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  // Sync state with URL parameter
  useEffect(() => {
    if (urlQuery !== query) {
      setQuery(urlQuery);
      setSearchQuery(urlQuery);
    }
  }, [urlQuery]);

  // Load popular suggestions for empty state
  useEffect(() => {
    movieService.getTrending().then((list) => {
      setPopularSuggestions(list.slice(0, 8));
    });
  }, []);

  // Live search execution
  useEffect(() => {
    let active = true;
    if (!query.trim()) {
      setResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    const timer = setTimeout(() => {
      movieService.search(query).then((items) => {
        if (active) {
          setResults(items);
          setIsSearching(false);
        }
      });
    }, 200);

    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [query]);

  const handleQueryChange = (val) => {
    setQuery(val);
    setSearchQuery(val);
    if (val.trim()) {
      setSearchParams({ q: val.trim() });
    } else {
      setSearchParams({});
    }
  };

  const handleClear = () => {
    setQuery('');
    setSearchQuery('');
    setSearchParams({});
    setResults([]);
  };

  return (
    <div className="search-page">
      <div className="search-page-header">
        <h1 className="search-page-title">Search</h1>
        <p className="search-page-subtitle">
          Find movies, TV series, actors, directors, and genres
        </p>
        <div style={{ marginTop: 18 }}>
          <SearchBar
            value={query}
            onChange={handleQueryChange}
            onClear={handleClear}
          />
        </div>
      </div>

      {query.trim() ? (
        <div>
          <div style={{ marginBottom: 20, color: '#aaa', fontSize: '0.95rem' }}>
            {isSearching ? (
              <span>Searching catalog...</span>
            ) : results.length > 0 ? (
              <span>
                Found <strong style={{ color: '#fff' }}>{results.length}</strong> {results.length === 1 ? 'match' : 'matches'} for "{query}"
              </span>
            ) : null}
          </div>

          {results.length > 0 ? (
            <div className="search-results-grid">
              {results.map((movie) => (
                <MovieCard key={movie.id} movie={movie} isPortrait={true} />
              ))}
            </div>
          ) : !isSearching ? (
            <div className="search-empty-state">
              <AlertCircle className="search-empty-icon" />
              <h2 className="search-empty-title">No matches found for "{query}"</h2>
              <p className="search-empty-desc">
                Suggestions: Try different keywords, check for spelling errors, or search by broader terms like genre or actor name.
              </p>
              
              <div style={{ width: '100%', marginTop: 30, textAlign: 'left' }}>
                <h3 style={{ fontSize: '1.2rem', marginBottom: 16, color: '#fff' }}>
                  Explore Trending Instead
                </h3>
                <div className="search-results-grid">
                  {popularSuggestions.slice(0, 6).map((item) => (
                    <MovieCard key={item.id} movie={item} isPortrait={true} />
                  ))}
                </div>
              </div>
            </div>
          ) : null}
        </div>
      ) : (
        /* Empty Query Initial State: Show Trending */
        <div>
          <div style={{ marginBottom: 20 }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#e5e5e5' }}>
              Popular Searches & Suggestions
            </h2>
          </div>
          <div className="search-results-grid">
            {popularSuggestions.map((item) => (
              <MovieCard key={item.id} movie={item} isPortrait={true} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
