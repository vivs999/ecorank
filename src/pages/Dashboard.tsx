import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrophy, faUsers, faLeaf, faClock, faRecycle, faCarrot, faLock, faPlus } from '@fortawesome/free-solid-svg-icons';
import { Challenge, Crew } from '../types';

const DashboardCard: React.FC<{ challenge: Challenge }> = ({ challenge }) => {
  const isLocked = !challenge.isActive && !challenge.isCompleted;
  const isCompleted = challenge.isCompleted;
  
  const getIcon = (id: string) => {
    // Convert to number if needed for the switch
    const typeId = typeof id === 'string' ? parseInt(id) : id;
    
    switch (typeId) {
      case 1:
        return faLeaf;
      case 2:
        return faRecycle;
      case 3:
        return faCarrot;
      case 4:
        return faClock;
      default:
        return faLeaf;
    }
  };

  return (
    <div className={`card challenge-card ${isLocked ? 'locked' : ''}`}>
      <div className="card-body">
        <div className="d-flex justify-content-between">
          <h5 className="card-title">
            <FontAwesomeIcon icon={getIcon(challenge.id)} className="me-2" />
            {challenge.name}
          </h5>
          {isLocked && <FontAwesomeIcon icon={faLock} />}
          {isCompleted && <span className="badge badge-eco">Completed</span>}
        </div>
        <p className="card-text">{challenge.description}</p>
        <p className="card-text"><small className="text-muted">Week {challenge.week}</small></p>

        <div className="d-grid">
          {isLocked ? (
            <button className="btn btn-secondary" disabled>
              Unlocks on {challenge.startDate.toLocaleDateString()}
            </button>
          ) : (
            <Link to={`/challenges/${challenge.id}`} className="btn btn-eco">
              {isCompleted ? 'View Results' : 'Start Challenge'}
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { userProfile } = useAuth();
  const { getUserCrews, getActiveChallenges } = useApp();
  const [crews, setCrews] = useState<Crew[]>([]);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const crewsData = await getUserCrews();
        setCrews(crewsData);
        
        const challengesData = await getActiveChallenges();
        setChallenges(challengesData);
        
      } catch (err) {
        setError('Failed to load dashboard data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [getUserCrews, getActiveChallenges]);

  if (loading) {
    return (
      <div className="container py-4">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-4">
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <div className="row">
        <div className="col-md-8 mx-auto">
          <div className="card mb-4">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="mb-0">Your Dashboard</h2>
                <button
                  className="btn btn-primary"
                  onClick={() => navigate('/crew/create')}
                >
                  <FontAwesomeIcon icon={faPlus} className="me-2" />
                  Create Crew
                </button>
              </div>

              <div className="row g-3 mb-4">
                <div className="col-md-4">
                  <div className="card bg-light">
                    <div className="card-body text-center">
                      <FontAwesomeIcon icon={faUsers} className="text-primary mb-2" size="2x" />
                      <h5 className="card-title">Your Crews</h5>
                      <p className="card-text h3">{crews.length}</p>
                    </div>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="card bg-light">
                    <div className="card-body text-center">
                      <FontAwesomeIcon icon={faTrophy} className="text-primary mb-2" size="2x" />
                      <h5 className="card-title">Active Challenges</h5>
                      <p className="card-text h3">{challenges.length}</p>
                    </div>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="card bg-light">
                    <div className="card-body text-center">
                      <FontAwesomeIcon icon={faLeaf} className="text-primary mb-2" size="2x" />
                      <h5 className="card-title">Total Impact</h5>
                      <p className="card-text h3">
                        {challenges.reduce((total, challenge) => total + (challenge.totalCarbonFootprint || 0), 0).toFixed(1)} kg
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <h4 className="mb-3">Your Crews</h4>
              {crews.length === 0 ? (
                <div className="alert alert-info">
                  You haven't joined any crews yet. Create a new crew or join an existing one!
                </div>
              ) : (
                <div className="list-group">
                  {crews.map((crew) => (
                    <div key={crew.id} className="list-group-item">
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <h5 className="mb-1">{crew.name}</h5>
                          <p className="text-muted mb-0">{crew.description}</p>
                        </div>
                        <button
                          className="btn btn-outline-primary"
                          onClick={() => navigate(`/crew/${crew.id}`)}
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <h4 className="mb-3 mt-4">Active Challenges</h4>
              {challenges.length === 0 ? (
                <div className="alert alert-info">
                  No active challenges at the moment.
                </div>
              ) : (
                <div className="list-group">
                  {challenges.map((challenge) => (
                    <div key={challenge.id} className="list-group-item">
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <h5 className="mb-1">{challenge.name}</h5>
                          <p className="text-muted mb-0">{challenge.description}</p>
                        </div>
                        <div className="text-end">
                          <span className="badge bg-primary me-2">
                            {challenge.totalCarbonFootprint?.toFixed(1)} kg CO₂
                          </span>
                          <button
                            className="btn btn-outline-primary"
                            onClick={() => navigate(`/challenges/${challenge.id}`)}
                          >
                            View Details
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 