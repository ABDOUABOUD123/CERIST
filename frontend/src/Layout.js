import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { 
  faUserCircle, 
  faSignOutAlt, 
  faBookOpen, 
  faSearch,
  faEnvelope,
  faHome,
  faInfoCircle,
  faNewspaper,
  faPlusSquare,
  faBook,
  faBookmark,
  faCog,
  faTimes,
  faUser,
  faUsers,
  faEnvelopeOpen,
  faHistory,
  faBars
} from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "./AuthContext";
import { useBookmarks } from "./BookmarkContext";
import "./layout.css";
import Footer from "./Footer";

const Layout = ({ children, onSearch }) => {
  const [query, setQuery] = useState("");
  const [showProfilePanel, setShowProfilePanel] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isLoggedIn, logout, user } = useAuth();
  const { bookmarks, refreshBookmarks } = useBookmarks();
  const navigate = useNavigate();

  // Check if screen is mobile size
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogout = () => {
    logout();
    setShowProfilePanel(false);
    navigate("/");
    toast.success("Logged out successfully");
  };

 // You can keep this for the profile panel if you want fresh data when opening it
const fetchUserProfile = async () => {
  setLoading(true);
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No authentication token found');
    }
  
    const response = await fetch('http://127.0.0.1:8000/api/user/profile/', {
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json',
      }
    });
    
    if (response.ok) {
      const profileData = await response.json();
      setUserData(profileData);
    } else {
      throw new Error('Failed to fetch profile data');
    }
  } catch (error) {
    console.error("Error fetching profile data:", error);
    toast.error(error.message || "Failed to load profile data");
  } finally {
    setLoading(false);
  }
};
  
  useEffect(() => {
    if (showProfilePanel && isLoggedIn) {
      fetchUserProfile();
    }
  }, [showProfilePanel, isLoggedIn]);

  const toggleProfilePanel = () => {
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }
    setShowProfilePanel(!showProfilePanel);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleNavigateTo = (path) => {
    navigate(path);
    setShowProfilePanel(false);
    setMobileMenuOpen(false);
  };

// In Layout.js, replace the navLinks declaration with:
const navLinks = [
  { path: "/", icon: faHome, text: "Home" },
  { path: "/about", icon: faInfoCircle, text: "About" },
  { path: "/latest-volumes", icon: faBook, text: "Latest Volumes" },
  { path: "/instructions", icon: faInfoCircle, text: "Instructions" },
  { path: "/comites", icon: faUsers, text: "Comités" },
  ...(user?.is_admin ? [{ path: "/add-article", icon: faPlusSquare, text: "Contribute" }] : []),
  { path: "/contact", icon: faEnvelope, text: "Contact" }
];

  return (
    <div className="layout-container">
      <header className="header sticky-nav">
        <div className="nav-container">
          <div className="logo-container" onClick={() => navigate("/")}>
            <FontAwesomeIcon icon={faBookOpen} className="logo-icon" />
            <span className="logo-text">RIST</span>
          </div>

          {isMobile ? (
            <div className="mobile-menu-container">
              <FontAwesomeIcon 
                icon={faBars} 
                className="mobile-menu-icon" 
                onClick={toggleMobileMenu}
              />
            </div>
          ) : (
            <nav className="nav-links">
              {navLinks.map((link, index) => (
                <div className="nav-item" key={index}>
                  <Link to={link.path} className="nav-link">
                    <FontAwesomeIcon icon={link.icon} className="nav-icon" />
                    {link.text}
                  </Link>
                  <div className="nav-underline"></div>
                </div>
              ))}
            </nav>
          )}

          <div className="user-actions">
            <div className="profile-container">
              <FontAwesomeIcon
                icon={faUserCircle}
                className={`profile-icon ${showProfilePanel ? 'active' : ''}`}
                onClick={toggleProfilePanel}
              />
              {isLoggedIn && (
                <button 
                  className="logout-button"
                  onClick={handleLogout}
                  title="Logout"
                >
                  <FontAwesomeIcon icon={faSignOutAlt} />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobile && mobileMenuOpen && (
          <div className="mobile-menu-overlay" onClick={toggleMobileMenu}>
            <div className="mobile-menu" onClick={(e) => e.stopPropagation()}>
              <button className="close-mobile-menu" onClick={toggleMobileMenu}>
                <FontAwesomeIcon icon={faTimes} />
              </button>
              <div className="mobile-nav-links">
                {navLinks.map((link, index) => (
                  <div 
                    className="mobile-nav-item" 
                    key={index}
                    onClick={() => handleNavigateTo(link.path)}
                  >
                    <FontAwesomeIcon icon={link.icon} className="mobile-nav-icon" />
                    <span>{link.text}</span>
                  </div>
                ))}
                {isLoggedIn && (
                  <div 
                    className="mobile-nav-item"
                    onClick={() => handleNavigateTo("/saved-articles")}
                  >
                    <FontAwesomeIcon icon={faBookmark} className="mobile-nav-icon" />
                    <span>Saved Articles</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Profile Panel */}
      {showProfilePanel && (
        <div className="profile-panel-overlay" onClick={toggleProfilePanel}>
          <div className="profile-panel" onClick={(e) => e.stopPropagation()}>
            <div className="profile-panel-header">
              <h3>My Account</h3>
              <button className="close-panel" onClick={toggleProfilePanel}>
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
            
            <div className="profile-info">
              <div className="profile-avatar">
                <FontAwesomeIcon icon={faUserCircle} size="3x" />
              </div>
              <div className="profile-details">
                <h4>{userData?.username || user?.username || 'User'}</h4>
                <p className="profile-email">
                  <FontAwesomeIcon icon={faEnvelopeOpen} className="detail-icon" />
                  {userData?.email || user?.email || 'user@example.com'}
                </p>
                <p className="profile-joined">
                  <FontAwesomeIcon icon={faHistory} className="detail-icon" />
                  Member since {userData?.join_date || '2023'}
                </p>
              </div>
            </div>

            <div className="profile-sections">
              <div className="profile-section">
                <button 
                  className="saved-articles-btn"
                  onClick={() => handleNavigateTo("/saved-articles")}
                >
                  <FontAwesomeIcon icon={faBookmark} className="section-icon" />
                  View Saved Articles ({bookmarks.length})
                </button>
              </div>

              <div className="profile-actions">
                <button 
                  className="profile-action-btn"
                  onClick={() => handleNavigateTo("/profile")}
                >
                  <FontAwesomeIcon icon={faUser} className="action-icon" />
                  View Full Profile
                </button>
                <button 
                  className="profile-action-btn"
                  onClick={() => handleNavigateTo("/settings")}
                >
                  <FontAwesomeIcon icon={faCog} className="action-icon" />
                  Account Settings
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <main className="content">
        {React.Children.map(children, child => {
          return React.cloneElement(child, { refreshBookmarks });
        })}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;