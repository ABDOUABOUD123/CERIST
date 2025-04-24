import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import SearchBar from "./SearchBar";
import { 
  faSearch, 
  faArrowLeft, 
  faBookOpen, 
  faUser, 
  faCalendarAlt,
  faTimes,
  faFilter,
  faChevronDown
} from "@fortawesome/free-solid-svg-icons";
import "./searchresults.css";

const SearchResults = () => {
  const [articles, setArticles] = useState([]);
  const [allArticles, setAllArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [localFilters, setLocalFilters] = useState({
    author: '',
    dateRange: { from: '', to: '' },
    volume: '',
    issue: ''
  });
  const [pendingFilters, setPendingFilters] = useState({
    author: '',
    dateRange: { from: '', to: '' },
    volume: '',
    issue: ''
  });
  const [authorSearchQuery, setAuthorSearchQuery] = useState('');
  const [suggestedAuthors, setSuggestedAuthors] = useState([]);
  const [showAuthorSuggestions, setShowAuthorSuggestions] = useState(false);
  const [error, setError] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  
  const searchQuery = searchParams.get("query") || "";
  const initialAuthor = searchParams.get("author") || "";
  const initialDateRangeFrom = searchParams.get("dateFrom") || '';
  const initialDateRangeTo = searchParams.get("dateTo") || '';
  const initialVolume = searchParams.get("volume") || "";
  const initialIssue = searchParams.get("issue") || "";

  useEffect(() => {
    const fetchArticles = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch("http://127.0.0.1:8000/api/articles/");
        if (!response.ok) {
          throw new Error("Failed to fetch articles");
        }
        const data = await response.json();
        setAllArticles(data);
        applyFilters(data, {
          query: searchQuery,
          author: initialAuthor,
          dateRange: { from: initialDateRangeFrom, to: initialDateRangeTo },
          volume: initialVolume,
          issue: initialIssue
        });
      } catch (err) {
        console.error("Error fetching articles:", err);
        setError("Failed to load articles. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchArticles();
  }, []);

  useEffect(() => {
    setLocalFilters({
      author: initialAuthor,
      dateRange: { from: initialDateRangeFrom, to: initialDateRangeTo },
      volume: initialVolume,
      issue: initialIssue
    });
    setPendingFilters({
      author: initialAuthor,
      dateRange: { from: initialDateRangeFrom, to: initialDateRangeTo },
      volume: initialVolume,
      issue: initialIssue
    });
    setAuthorSearchQuery(initialAuthor);
  }, [initialAuthor, initialDateRangeFrom, initialDateRangeTo, initialVolume, initialIssue]);

  useEffect(() => {
    if (authorSearchQuery.trim() && allArticles.length > 0) {
      const uniqueAuthors = [...new Set(allArticles.map(article => article.author))];
      const filtered = uniqueAuthors.filter(author => 
        author.toLowerCase().includes(authorSearchQuery.toLowerCase())
      );
      setSuggestedAuthors(filtered.slice(0, 5));
    } else {
      setSuggestedAuthors([]);
    }
  }, [authorSearchQuery, allArticles]);

  const checkDateRange = (publicationDate, range) => {
    if (!range.from && !range.to) return true;
    
    const pubYear = new Date(publicationDate).getFullYear();
    const fromYear = range.from ? parseInt(range.from) : 1990;
    const toYear = range.to ? parseInt(range.to) : new Date().getFullYear();
    
    return pubYear >= fromYear && pubYear <= toYear;
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  };

  const getFilterLabel = (type, value) => {
    const labels = {
      volume: Object.fromEntries(
        Array.from({ length: 20 }, (_, i) => [i + 1, `VOLUME ${i + 1}`])
      ),
      issue: Object.fromEntries(
        Array.from({ length: 2 }, (_, i) => [i + 1, `ISSUE ${i + 1}`])
      )
    };
    return labels[type]?.[value] || value;
  };

  const applyFilters = (data, filters) => {
    const filtered = data.filter(article => {
      const matchesSearch = filters.query 
        ? (
            article.title.toLowerCase().includes(filters.query.toLowerCase()) ||
            article.author.toLowerCase().includes(filters.query.toLowerCase()) ||
            (article.keywords && article.keywords.toLowerCase().includes(filters.query.toLowerCase())) ||
            (article.abstract && article.abstract.toLowerCase().includes(filters.query.toLowerCase()))
        ) 
        : true;
      
      const matchesAuthor = filters.author 
        ? article.author.toLowerCase().includes(filters.author.toLowerCase())
        : true;
      
      const matchesDateRange = checkDateRange(article.publication_date, filters.dateRange);
      
      const matchesVolume = filters.volume 
        ? article.volume != null && article.volume.toString() === filters.volume.toString()
        : true;
      
      const matchesIssue = filters.issue 
        ? article.issue != null && article.issue.toString() === filters.issue.toString()
        : true;
      
      return matchesSearch && matchesAuthor && matchesDateRange && matchesVolume && matchesIssue;
    });
    
    setArticles(filtered);
  };

  const handleAuthorSearchChange = (e) => {
    const value = e.target.value;
    setAuthorSearchQuery(value);
    setPendingFilters(prev => ({ ...prev, author: value }));
    setShowAuthorSuggestions(true);
  };

  const selectAuthor = (author) => {
    setAuthorSearchQuery(author);
    setPendingFilters(prev => ({ ...prev, author }));
    setShowAuthorSuggestions(false);
  };

  const handleDateRangeChange = (e, type) => {
    const value = e.target.value;
    setPendingFilters(prev => ({
      ...prev,
      dateRange: {
        ...prev.dateRange,
        [type]: value
      }
    }));
  };

  const submitFilters = () => {
    const params = new URLSearchParams();
    if (searchQuery) params.set("query", searchQuery);
    if (pendingFilters.author) params.set("author", pendingFilters.author);
    if (pendingFilters.dateRange.from) params.set("dateFrom", pendingFilters.dateRange.from);
    if (pendingFilters.dateRange.to) params.set("dateTo", pendingFilters.dateRange.to);
    if (pendingFilters.volume) params.set("volume", pendingFilters.volume.toString());
    if (pendingFilters.issue) params.set("issue", pendingFilters.issue);
    
    navigate(`/search?${params.toString()}`);
    
    applyFilters(allArticles, {
      query: searchQuery,
      author: pendingFilters.author,
      dateRange: pendingFilters.dateRange,
      volume: pendingFilters.volume,
      issue: pendingFilters.issue
    });
    
    setLocalFilters(pendingFilters);
    setShowFilters(false);
    setShowAuthorSuggestions(false);
  };

  const resetFilters = () => {
    const params = new URLSearchParams();
    if (searchQuery) params.set("query", searchQuery);
    navigate(`/search?${params.toString()}`);
    
    const resetFilterState = {
      author: '',
      dateRange: { from: '', to: '' },
      volume: '',
      issue: ''
    };
    setLocalFilters(resetFilterState);
    setPendingFilters(resetFilterState);
    setAuthorSearchQuery('');
    setShowFilters(false);
  };

  const removeFilter = (type) => {
    let newFilters;
    if (type === 'dateRange') {
      newFilters = { ...localFilters, dateRange: { from: '', to: '' } };
    } else {
      newFilters = { ...localFilters, [type]: '' };
    }
    
    setLocalFilters(newFilters);
    setPendingFilters(newFilters);
    
    if (type === 'author') {
      setAuthorSearchQuery('');
    }
    
    const params = new URLSearchParams();
    if (searchQuery) params.set("query", searchQuery);
    Object.entries(newFilters).forEach(([key, value]) => {
      if (key === 'dateRange') {
        if (value.from) params.set('dateFrom', value.from);
        if (value.to) params.set('dateTo', value.to);
      } else if (value && key !== type) {
        params.set(key, value);
      }
    });
    
    navigate(`/search?${params.toString()}`);
    applyFilters(allArticles, {
      query: searchQuery,
      ...newFilters
    });
  };

  return (
    <div className="search-results-page">
      <div className="search-header">
        <button className="back-button" onClick={() => navigate(-1)}>
          <FontAwesomeIcon icon={faArrowLeft} /> Retour
        </button>
        <SearchBar />
        <div className="search-query-display">
          <h2>
            {searchQuery 
              ? `Résultats pour : "${searchQuery}"`
              : "Tous les articles"}
          </h2>
          <div className="results-meta">
            <span className="results-count">
              {articles.length} {articles.length === 1 ? 'résultat' : 'résultats'}
            </span>
            <button 
              className="filter-toggle"
              onClick={() => setShowFilters(!showFilters)}
            >
              <FontAwesomeIcon icon={faFilter} />
              Filtres
               {Object.values(localFilters).some(f => 
                  (typeof f === 'object' ? Object.values(f).some(v => v) : f)) && 
                  <span className="filter-badge"></span>
                }
            </button>
          </div>
        </div>
      </div>

      <div className="search-content">
        <div className={`filters-sidebar ${showFilters ? 'visible' : ''}`}>
          <div className="filters-header">
            <h3>Filtrer les résultats</h3>
            <button className="close-filters" onClick={() => setShowFilters(false)}>
              <FontAwesomeIcon icon={faTimes} />
            </button>
          </div>
          
          <div className="filter-group">
            <h4>Auteur</h4>
            <div className="author-search-container">
              <div className="author-search-input">
                <input
                  type="text"
                  placeholder="Rechercher par auteur"
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
            <h4>Année de publication</h4>
            <div className="date-range-container">
              <div className="range-inputs">
                <input
                  type="number"
                  placeholder="De (1990)"
                  min="1990"
                  max={new Date().getFullYear()}
                  value={pendingFilters.dateRange.from}
                  onChange={(e) => handleDateRangeChange(e, 'from')}
                />
                <span>à</span>
                <input
                  type="number"
                  placeholder={`À (${new Date().getFullYear()})`}
                  min="1990"
                  max={new Date().getFullYear()}
                  value={pendingFilters.dateRange.to}
                  onChange={(e) => handleDateRangeChange(e, 'to')}
                />
              </div>
              <div className="range-slider-container">
                <input
                  type="range"
                  min="1990"
                  max={new Date().getFullYear()}
                  value={pendingFilters.dateRange.from || 1990}
                  onChange={(e) => handleDateRangeChange(e, 'from')}
                  className="range-slider"
                />
                <input
                  type="range"
                  min="1990"
                  max={new Date().getFullYear()}
                  value={pendingFilters.dateRange.to || new Date().getFullYear()}
                  onChange={(e) => handleDateRangeChange(e, 'to')}
                  className="range-slider"
                />
              </div>
            </div>
          </div>
          
          <div className="filter-group">
            <h4>Volume</h4>
            <select 
              name="volume" 
              value={pendingFilters.volume}
              onChange={(e) => setPendingFilters(prev => ({ ...prev, volume: e.target.value }))}
            >
              <option value="">Tous les volumes</option>
              {Array.from({ length: 20 }, (_, i) => (
                <option key={i + 1} value={i + 1}>VOLUME {i + 1}</option>
              ))}
            </select>
          </div>
          
          <div className="filter-group">
            <h4>Numéro</h4>
            <select 
              name="issue" 
              value={pendingFilters.issue}
              onChange={(e) => setPendingFilters(prev => ({ ...prev, issue: e.target.value }))}
            >
              <option value="">Tous les numéros</option>
              {Array.from({ length: 2 }, (_, i) => (
                <option key={i + 1} value={i + 1}>ISSUE {i + 1}</option>
              ))}
            </select>
          </div>
          
          <div className="filter-actions">
            <button className="apply-filters" onClick={submitFilters}>
              Appliquer les filtres
            </button>
            <button className="reset-filters" onClick={resetFilters}>
              Réinitialiser
            </button>
          </div>
        </div>

        <div className="results-section">
          {(localFilters.author || localFilters.dateRange.from || localFilters.dateRange.to || 
            localFilters.volume || localFilters.issue) && (
            <div className="active-filters">
              {localFilters.author && (
                <span className="active-filter">
                  Auteur: {localFilters.author}
                  <button 
                    className="remove-filter"
                    onClick={() => removeFilter('author')}
                  >
                    <FontAwesomeIcon icon={faTimes} />
                  </button>
                </span>
              )}
              {(localFilters.dateRange.from || localFilters.dateRange.to) && (
                <span className="active-filter">
                  Année: {localFilters.dateRange.from || '1990'}
                  {localFilters.dateRange.to ? `-${localFilters.dateRange.to}` : '+'}
                  <button 
                    className="remove-filter"
                    onClick={() => removeFilter('dateRange')}
                  >
                    <FontAwesomeIcon icon={faTimes} />
                  </button>
                </span>
              )}
              {localFilters.volume && (
                <span className="active-filter">
                  Volume: {getFilterLabel('volume', localFilters.volume)}
                  <button 
                    className="remove-filter"
                    onClick={() => removeFilter('volume')}
                  >
                    <FontAwesomeIcon icon={faTimes} />
                  </button>
                </span>
              )}
              {localFilters.issue && (
                <span className="active-filter">
                  Numéro: {getFilterLabel('issue', localFilters.issue)}
                  <button 
                    className="remove-filter"
                    onClick={() => removeFilter('issue')}
                  >
                    <FontAwesomeIcon icon={faTimes} />
                  </button>
                </span>
              )}
            </div>
          )}

          {error && (
            <div className="error-message">
              <p>{error}</p>
              <button onClick={() => window.location.reload()}>Réessayer</button>
            </div>
          )}

          {isLoading ? (
            <div className="loading-indicator">
              <div className="spinner"></div>
              <p>Chargement des résultats...</p>
            </div>
          ) : articles.length > 0 ? (
            <div className="results-list">
              {articles.map((article) => (
                <ArticleResultCard 
                  key={article.id} 
                  article={article} 
                  navigate={navigate}
                  formatDate={formatDate}
                />
              ))}
            </div>
          ) : (
            <div className="no-results">
              <h3>Aucun article trouvé</h3>
              <p>Essayez d'ajuster vos critères de recherche ou vos filtres.</p>
              <button className="new-search-button" onClick={() => navigate('/')}>
                Nouvelle recherche
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const ArticleResultCard = ({ article, navigate, formatDate }) => (
  <div className="result-card" onClick={() => navigate(`/article/${article.id}`)}>
    <h3 className="result-title">{article.title}</h3>
    <div className="result-meta">
      <span className="meta-item">
        <FontAwesomeIcon icon={faUser} />
        {article.author}
      </span>
      <span className="meta-item">
        <FontAwesomeIcon icon={faCalendarAlt} />
        {formatDate(article.publication_date)}
      </span>
      {article.volume && (
        <span className="meta-item">
          VOLUME {article.volume}
        </span>
      )}
      {article.issue && (
        <span className="meta-item">
          N°{article.issue}
        </span>
      )}
    </div>
    {article.abstract && (
      <p className="result-abstract">
        {article.abstract.substring(0, 200)}...
      </p>
    )}
    {article.keywords && (
      <div className="result-keywords">
        {article.keywords.split(',').map((keyword, index) => (
          <span key={index} className="keyword-tag">{keyword.trim()}</span>
        ))}
      </div>
    )}
    <div className="result-actions">
      <button className="view-button">
        Voir les détails <FontAwesomeIcon icon={faChevronDown} />
      </button>
    </div>
  </div>
);

export default SearchResults;