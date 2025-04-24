import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faBookOpen,
  faCalendarAlt,
  faChevronDown
} from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "./AuthContext"; // Import the auth context
import "./searchresults.css"; // Reuse the search results styles

const LatestVolumes = () => {
  const [volumes, setVolumes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { token } = useAuth(); // Get the token from auth context

  useEffect(() => {
    const fetchLatestVolumes = async () => {
      try {
        setIsLoading(true);
        const headers = {};
        
        // Only add authorization header if token exists
        if (token) {
          headers['Authorization'] = `Token ${token}`;
        }

        const response = await fetch("http://127.0.0.1:8000/api/articles/latest-volumes/", {
          headers
        });
        
        if (!response.ok) {
          throw new Error("Failed to fetch latest volumes");
        }
        
        const data = await response.json();
        setVolumes(data);
      } catch (err) {
        console.error("Error fetching volumes:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLatestVolumes();
  }, [token]); // Add token as dependency []);

  if (isLoading) {
    return (
      <div className="search-results-page">
        <div className="loading-indicator">
          <div className="spinner"></div>
          <p>Loading latest volumes...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="search-results-page">
        <div className="error-message">
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>Try Again</button>
        </div>
      </div>
    );
  }

  return (
    <div className="search-results-page">
      <div className="search-header">
        <h2>Latest Volumes</h2>
        <div className="results-meta">
          <span className="results-count">
            {volumes.length} {volumes.length === 1 ? 'volume' : 'volumes'}
          </span>
        </div>
      </div>

      <div className="search-content">
        <div className="results-section">
          <div className="results-list">
          {volumes.map((volume) => (
            <div 
            key={`volume-${volume.volume}`}
            className="result-card"
            onClick={() => navigate(`/search?volume=${volume.volume}`)}
          >
            <h3 className="result-title">Volume {volume.volume}</h3>
            <div className="result-meta">
                  <span className="meta-item">
                    <FontAwesomeIcon icon={faBookOpen} />
                    {volume.article_count} articles
                  </span>
                  <span className="meta-item">
                    <FontAwesomeIcon icon={faCalendarAlt} />
                    Latest: {new Date(volume.latest_date).toLocaleDateString()}
                  </span>
                </div>
                <div className="result-actions">
                  <button className="view-button">
                    View Articles <FontAwesomeIcon icon={faChevronDown} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LatestVolumes;