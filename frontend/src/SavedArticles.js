import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookmark, faArrowLeft, faBookOpen } from "@fortawesome/free-solid-svg-icons";
import { useBookmarks } from "./BookmarkContext";
import { useAuth } from "./AuthContext";
import "./SavedArticles.css";

const SavedArticles = () => {
  const { bookmarks, refreshBookmarks } = useBookmarks();
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    refreshBookmarks();
  }, [refreshBookmarks]);

  if (!isLoggedIn) {
    return (
      <div className="saved-articles-container">
        <div className="auth-message">
          <h2>Please log in to view saved articles</h2>
          <button onClick={() => navigate("/login")} className="login-btn">
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="saved-articles-container">
      <div className="saved-articles-header">
        <button onClick={() => navigate(-1)} className="back-button">
          <FontAwesomeIcon icon={faArrowLeft} />
        </button>
        <h1>
          <FontAwesomeIcon icon={faBookmark} className="header-icon" />
          Saved Articles
        </h1>
        <span className="bookmark-count">{bookmarks.length} articles</span>
      </div>

      {bookmarks.length === 0 ? (
        <div className="empty-state">
          <FontAwesomeIcon icon={faBookOpen} size="3x" className="empty-icon" />
          <h3>No saved articles yet</h3>
          <p>Save articles to read them later</p>
          <button onClick={() => navigate("/")} className="browse-btn">
            Browse Articles
          </button>
        </div>
      ) : (
        <div className="bookmarks-list">
          {bookmarks.map((bookmark) => (
            <div 
              key={bookmark.id} 
              className="bookmark-item"
              onClick={() => navigate(`/article/${bookmark.article_id}`)}
            >
              <div className="bookmark-content">
                <h3 className="article-title">{bookmark.article_title}</h3>
                <p className="article-date">
                  Saved on {new Date(bookmark.created_at).toLocaleDateString()}
                </p>
              </div>
              <FontAwesomeIcon icon={faBookOpen} className="article-icon" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedArticles;