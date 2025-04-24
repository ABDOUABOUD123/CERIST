import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faFilter } from "@fortawesome/free-solid-svg-icons";
import "./Searchbar.css";

const SearchBar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    author: '',
    dateRange: { from: '', to: '' },
    volume: '',
    issue: ''
  });
  const [authorSearchQuery, setAuthorSearchQuery] = useState('');
  const [suggestedAuthors, setSuggestedAuthors] = useState([]);
  const [showAuthorSuggestions, setShowAuthorSuggestions] = useState(false);
  const [allAuthors, setAllAuthors] = useState([]);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        const filterIcon = document.querySelector('.filter-icon');
        if (filterIcon && !filterIcon.contains(event.target)) {
          setShowFilters(false);
          setShowAuthorSuggestions(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const fetchAuthors = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/articles/");
        if (!response.ok) {
          throw new Error("Failed to fetch articles");
        }
        const data = await response.json();
        const authors = [...new Set(data.map(article => article.author))];
        setAllAuthors(authors);
      } catch (err) {
        console.error("Error fetching authors:", err);
      }
    };

    fetchAuthors();
  }, []);

  useEffect(() => {
    if (authorSearchQuery.trim() && allAuthors.length > 0) {
      const filtered = allAuthors.filter(author => 
        author.toLowerCase().includes(authorSearchQuery.toLowerCase())
      );
      setSuggestedAuthors(filtered.slice(0, 5));
    } else {
      setSuggestedAuthors([]);
    }
  }, [authorSearchQuery, allAuthors]);

  const handleSearch = () => {
    if (searchQuery.trim() !== "") {
      navigate(`/search?query=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleAuthorSearchChange = (e) => {
    const value = e.target.value;
    setAuthorSearchQuery(value);
    setFilters(prev => ({ ...prev, author: value }));
    setShowAuthorSuggestions(true);
  };

  const selectAuthor = (author) => {
    setAuthorSearchQuery(author);
    setFilters(prev => ({ ...prev, author }));
    setShowAuthorSuggestions(false);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleDateRangeChange = (e, type) => {
    const value = e.target.value;
    setFilters(prev => ({
      ...prev,
      dateRange: {
        ...prev.dateRange,
        [type]: value
      }
    }));
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
    setShowAuthorSuggestions(false);
  };

  const applyFilters = () => {
    let queryParams = [];
    
    if (searchQuery.trim() !== "") {
      queryParams.push(`query=${encodeURIComponent(searchQuery)}`);
    }
    if (filters.author) {
      queryParams.push(`author=${encodeURIComponent(filters.author)}`);
    }
    if (filters.dateRange.from) {
      queryParams.push(`dateFrom=${encodeURIComponent(filters.dateRange.from)}`);
    }
    if (filters.dateRange.to) {
      queryParams.push(`dateTo=${encodeURIComponent(filters.dateRange.to)}`);
    }
    if (filters.volume) {
      queryParams.push(`volume=${encodeURIComponent(filters.volume.toString())}`);
    }
    if (filters.issue) {
      queryParams.push(`issue=${encodeURIComponent(filters.issue)}`);
    }
    
    if (queryParams.length > 0) {
      navigate(`/search?${queryParams.join('&')}`);
    }
    
    setShowFilters(false);
  };

  const resetFilters = () => {
    setFilters({
      author: '',
      dateRange: { from: '', to: '' },
      volume: '',
      issue: ''
    });
    setAuthorSearchQuery('');
    setShowFilters(false);
  };

  return (
    <div className="global-search-bar">
      <div className="search-box" ref={dropdownRef}>
        <input
          type="text"
          placeholder="Search keywords"
          className="search-input"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
        />
        <FontAwesomeIcon 
          icon={faSearch} 
          className="search-icon" 
          onClick={handleSearch} 
        />
        <FontAwesomeIcon
          icon={faFilter}
          className={`filter-icon ${Object.values(filters).some(f => 
           (typeof f === 'object' ? Object.values(f).some(v => v) : f))
             ? 'active' : ''}`}
            onClick={toggleFilters}
          />
        <div className={`filter-dropdown ${showFilters ? 'active' : ''}`}>
          <h4>Filter Results</h4>
          
          <div className="filter-group">
            <label>Author:</label>
            <div className="author-search-container">
              <div className="author-search-input">
                <FontAwesomeIcon icon={faSearch} className="search-icon-small" />
                <input
                  type="text"
                  placeholder="Search author"
                  value={authorSearchQuery}
                  onChange={handleAuthorSearchChange}
                  onFocus={() => setShowAuthorSuggestions(true)}
                />
              </div>
              {showAuthorSuggestions && suggestedAuthors.length > 0 && (
                <div className="author-suggestions">
                  {suggestedAuthors.map((author, index) => (
                    <div 
                      key={index}
                      className="suggestion-item"
                      onClick={() => selectAuthor(author)}
                    >
                      {author}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          <div className="filter-group">
            <label>Year Range:</label>
            <div className="date-range-container">
              <div className="range-inputs">
                <input
                  type="number"
                  placeholder="From (1990)"
                  min="1990"
                  max={new Date().getFullYear()}
                  value={filters.dateRange.from}
                  onChange={(e) => handleDateRangeChange(e, 'from')}
                />
                <span>to</span>
                <input
                  type="number"
                  placeholder={`To (${new Date().getFullYear()})`}
                  min="1990"
                  max={new Date().getFullYear()}
                  value={filters.dateRange.to}
                  onChange={(e) => handleDateRangeChange(e, 'to')}
                />
              </div>
              <div className="range-slider-container">
                <input
                  type="range"
                  min="1990"
                  max={new Date().getFullYear()}
                  value={filters.dateRange.from || 1990}
                  onChange={(e) => handleDateRangeChange(e, 'from')}
                  className="range-slider"
                />
                <input
                  type="range"
                  min="1990"
                  max={new Date().getFullYear()}
                  value={filters.dateRange.to || new Date().getFullYear()}
                  onChange={(e) => handleDateRangeChange(e, 'to')}
                  className="range-slider"
                />
              </div>
            </div>
          </div>
          
          <div className="filter-group">
            <label>Volume:</label>
            <select name="volume" value={filters.volume} onChange={handleFilterChange}>
              <option value="">All volumes</option>
              {Array.from({ length: 20 }, (_, i) => (
                <option key={i + 1} value={i + 1}>VOLUME {i + 1}</option>
              ))}
            </select>
          </div>
          
          <div className="filter-group">
            <label>Issue:</label>
            <select name="issue" value={filters.issue} onChange={handleFilterChange}>
              <option value="">All issues</option>
              {Array.from({ length: 20 }, (_, i) => (
                <option key={i + 1} value={i + 1}>ISSUE {i + 1}</option>
              ))}
            </select>
          </div>
          
          <div className="filter-actions">
            <button className="apply-filters" onClick={applyFilters}>
              Apply
            </button>
            <button className="reset-filters" onClick={resetFilters}>
              Reset
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;