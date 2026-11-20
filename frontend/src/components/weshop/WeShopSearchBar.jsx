import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, Sparkles, Store, Package } from 'lucide-react';

const SUGGESTIONS = [
  { label: 'Minimalist ceramic vases', type: 'product', category: 'HomeStyle' },
  { label: 'Organic linen clothing & shirts', type: 'product', category: 'TrendWear' },
  { label: 'Ergonomic wooden desk stands', type: 'product', category: 'OfficePro' },
  { label: 'Sage green cushions & throws', type: 'product', category: 'Comfort Living' },
  { label: 'Handcrafted stoneware coffee cups', type: 'product', category: 'Daily Goods' },
];

const WeShopSearchBar = ({ placeholder = 'Search products or suppliers', onSearch }) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);
  const navigate = useNavigate();

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    if (onSearch) {
      onSearch(query);
    } else {
      navigate(`/products?search=${encodeURIComponent(query.trim())}`);
    }
    setIsOpen(false);
  };

  const handleSelectSuggestion = (suggestion) => {
    setQuery(suggestion.label);
    if (onSearch) {
      onSearch(suggestion.label);
    } else {
      navigate(`/products?search=${encodeURIComponent(suggestion.label)}`);
    }
    setIsOpen(false);
  };

  const filteredSuggestions = query.trim()
    ? SUGGESTIONS.filter((s) => s.label.toLowerCase().includes(query.toLowerCase()))
    : SUGGESTIONS;

  return (
    <div className="weshop-search-container" ref={containerRef}>
      <form onSubmit={handleSubmit} className="weshop-search-form">
        <div className="weshop-search-input-wrapper">
          <Search size={18} className="weshop-search-icon" aria-hidden="true" />
          <input
            type="text"
            className="weshop-search-input"
            placeholder={placeholder}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
            aria-label="Search products or suppliers"
          />
          {query && (
            <button
              type="button"
              className="weshop-search-clear-btn"
              onClick={() => {
                setQuery('');
                setIsOpen(false);
              }}
              aria-label="Clear search query"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </form>

      {/* Interactive suggestions dropdown */}
      {isOpen && (
        <div className="weshop-search-dropdown">
          <div className="weshop-search-dropdown-header">
            <span className="flex items-center gap-1.5 text-xs font-semibold text-neutral-500 uppercase tracking-wider">
              <Sparkles size={12} className="text-emerald-500" />
              {query ? 'Suggested Matches' : 'Popular Marketplace Searches'}
            </span>
          </div>
          <ul className="weshop-search-dropdown-list">
            {filteredSuggestions.length > 0 ? (
              filteredSuggestions.map((item, idx) => (
                <li
                  key={idx}
                  className="weshop-search-dropdown-item"
                  onClick={() => handleSelectSuggestion(item)}
                >
                  <div className="weshop-suggestion-icon-wrap">
                    {item.type === 'product' ? <Package size={14} /> : <Store size={14} />}
                  </div>
                  <div className="weshop-suggestion-text-wrap">
                    <span className="weshop-suggestion-title">{item.label}</span>
                    <span className="weshop-suggestion-badge">{item.category}</span>
                  </div>
                </li>
              ))
            ) : (
              <li className="weshop-search-empty-state">
                Press Enter to search for &ldquo;<strong>{query}</strong>&rdquo;
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default WeShopSearchBar;
