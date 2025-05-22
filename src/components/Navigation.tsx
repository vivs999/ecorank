import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faHome, 
  faTrophy, 
  faUser, 
  faCog, 
  faSignOutAlt,
  faMedal,
  faStar,
  faLeaf,
  faUsers
} from '@fortawesome/free-solid-svg-icons';
import '../styles/game.css';

export const Navigation: React.FC = () => {
  const { userProfile, logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const location = useLocation();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isActive = (path: string) => location.pathname === path;

  const MobileNav = () => (
    <div className="mobile-nav safe-area-bottom">
      <Link to="/" className={`mobile-nav-item ${isActive('/') ? 'active' : ''}`}>
        <FontAwesomeIcon icon={faHome} />
        <span>Home</span>
      </Link>
      <Link to="/challenges" className={`mobile-nav-item ${isActive('/challenges') ? 'active' : ''}`}>
        <FontAwesomeIcon icon={faLeaf} />
        <span>Challenges</span>
      </Link>
      <Link to="/leaderboard" className={`mobile-nav-item ${isActive('/leaderboard') ? 'active' : ''}`}>
        <FontAwesomeIcon icon={faTrophy} />
        <span>Rankings</span>
      </Link>
      <Link to="/crew" className={`mobile-nav-item ${isActive('/crew') ? 'active' : ''}`}>
        <FontAwesomeIcon icon={faUsers} />
        <span>Crew</span>
      </Link>
      <button 
        className="mobile-nav-item"
        onClick={() => setShowDropdown(!showDropdown)}
      >
        <FontAwesomeIcon icon={faUser} />
        <span>Profile</span>
      </button>
    </div>
  );

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark safe-area-top" style={{ background: 'var(--gradient-primary)' }}>
        <div className="container">
          <Link className="navbar-brand" to="/">
            <FontAwesomeIcon icon={faHome} className="me-2" />
            EcoRank
          </Link>

          {!isMobile && (
            <div className="d-flex align-items-center">
              {userProfile && (
                <>
                  <div className="points-display me-3">
                    <FontAwesomeIcon icon={faStar} />
                    <span>{userProfile.totalScore || 0} Points</span>
                  </div>
                  
                  <div className="position-relative">
                    <button 
                      className="game-button"
                      onClick={() => setShowDropdown(!showDropdown)}
                    >
                      <FontAwesomeIcon icon={faUser} className="me-2" />
                      {userProfile.displayName || 'User'}
                    </button>

                    {showDropdown && (
                      <div className="game-card position-absolute end-0 mt-2" style={{ minWidth: '200px' }}>
                        <div className="p-3">
                          <div className="text-center mb-3">
                            <div className="achievement-badge mx-auto">
                              <FontAwesomeIcon icon={faMedal} size="2x" />
                            </div>
                            <h6 className="mt-2 mb-0">{userProfile.displayName}</h6>
                            <small className="text-muted">Level {Math.floor((userProfile.totalScore || 0) / 100) + 1}</small>
                          </div>
                          
                          <div className="progress-bar mb-3">
                            <div 
                              className="progress-bar-fill" 
                              style={{ 
                                width: `${((userProfile.totalScore || 0) % 100)}%` 
                              }}
                            />
                          </div>

                          <Link to="/profile" className="game-button w-100 mb-2">
                            <FontAwesomeIcon icon={faUser} className="me-2" />
                            Profile
                          </Link>

                          {userProfile.isCrewManager && (
                            <Link to="/manage-crew" className="game-button w-100 mb-2">
                              <FontAwesomeIcon icon={faTrophy} className="me-2" />
                              Manage Crew
                            </Link>
                          )}

                          <Link to="/settings" className="game-button w-100 mb-2">
                            <FontAwesomeIcon icon={faCog} className="me-2" />
                            Settings
                          </Link>

                          <button 
                            onClick={logout} 
                            className="game-button w-100"
                            style={{ background: 'var(--gradient-secondary)' }}
                          >
                            <FontAwesomeIcon icon={faSignOutAlt} className="me-2" />
                            Logout
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </nav>

      {isMobile && userProfile && (
        <>
          <div className="points-display mx-3 my-2">
            <FontAwesomeIcon icon={faStar} />
            <span>{userProfile.totalScore || 0} Points</span>
          </div>
          <MobileNav />
        </>
      )}

      {isMobile && showDropdown && (
        <div className="game-card mx-3 my-2">
          <div className="p-3">
            <div className="text-center mb-3">
              <div className="achievement-badge mx-auto">
                <FontAwesomeIcon icon={faMedal} size="2x" />
              </div>
              <h6 className="mt-2 mb-0">{userProfile?.displayName}</h6>
              <small className="text-muted">Level {Math.floor((userProfile?.totalScore || 0) / 100) + 1}</small>
            </div>
            
            <div className="progress-bar mb-3">
              <div 
                className="progress-bar-fill" 
                style={{ 
                  width: `${((userProfile?.totalScore || 0) % 100)}%` 
                }}
              />
            </div>

            <Link to="/profile" className="game-button w-100 mb-2">
              <FontAwesomeIcon icon={faUser} className="me-2" />
              Profile
            </Link>

            {userProfile?.isCrewManager && (
              <Link to="/manage-crew" className="game-button w-100 mb-2">
                <FontAwesomeIcon icon={faTrophy} className="me-2" />
                Manage Crew
              </Link>
            )}

            <Link to="/settings" className="game-button w-100 mb-2">
              <FontAwesomeIcon icon={faCog} className="me-2" />
              Settings
            </Link>

            <button 
              onClick={logout} 
              className="game-button w-100"
              style={{ background: 'var(--gradient-secondary)' }}
            >
              <FontAwesomeIcon icon={faSignOutAlt} className="me-2" />
              Logout
            </button>
          </div>
        </div>
      )}
    </>
  );
}; 