import React, { useRef } from 'react';
import { Search, X } from 'lucide-react';

export default function SearchBar({ value, onChange, onClear, placeholder = 'Search titles, genres, people...' }) {
  const inputRef = useRef(null);

  const handleClear = () => {
    onClear();
    inputRef.current?.focus();
  };

  return (
    <div className="search-input-wrapper" style={{ width: '100%', maxWidth: '540px', padding: '10px 16px' }}>
      <Search size={20} color="#8c8c8c" style={{ flexShrink: 0 }} />
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="search-input"
        style={{ fontSize: '1rem', padding: '6px 12px' }}
        autoFocus
      />
      {value && (
        <button 
          onClick={handleClear} 
          className="search-clear-btn" 
          aria-label="Clear Search Input"
          title="Clear search"
        >
          <X size={18} />
        </button>
      )}
    </div>
  );
}
