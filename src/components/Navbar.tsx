import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLeaf, faSignOutAlt, faTrophy, faUsers, faHome } from '@fortawesome/free-solid-svg-icons';

const Navbar: React.FC = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark">
      <div className="container">
        <Link to="/" className="navbar-brand">
          <FontAwesomeIcon icon={faLeaf} className="me-2" />
          EcoRank
        </Link>
        <button 
          className="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            {currentUser ? (
              <>
                <li className="nav-item">
                  <Link to="/dashboard" className="nav-link">
                    <FontAwesomeIcon icon={faHome} className="me-1" /> Dashboard
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/crew" className="nav-link">
                    <FontAwesomeIcon icon={faUsers} className="me-1" /> Crew
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/leaderboard" className="nav-link">
                    <FontAwesomeIcon icon={faTrophy} className="me-1" /> Leaderboard
                  </Link>
                </li>
                <li className="nav-item">
                  <button onClick={handleLogout} className="nav-link btn btn-link">
                    <FontAwesomeIcon icon={faSignOutAlt} className="me-1" /> Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link to="/login" className="nav-link">Login</Link>
                </li>
                <li className="nav-item">
                  <Link to="/register" className="nav-link">Register</Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 