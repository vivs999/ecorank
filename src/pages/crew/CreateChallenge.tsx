import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrophy, faCalendarAlt } from '@fortawesome/free-solid-svg-icons';
import { Challenge } from '../../types';

const CreateChallenge: React.FC = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [duration, setDuration] = useState(7); // Default 7 days
  const [lowerScoreIsBetter, setLowerScoreIsBetter] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { createChallenge, userCrew } = useApp();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userCrew) {
      return setError('You must be part of a crew to create a challenge');
    }
    
    if (name.trim().length < 3) {
      return setError('Challenge name must be at least 3 characters long');
    }
    
    if (description.trim().length < 10) {
      return setError('Please provide a more detailed description (10+ characters)');
    }
    
    if (duration < 1) {
      return setError('Duration must be at least 1 day');
    }
    
    try {
      setError(null);
      setLoading(true);
      
      const startDate = new Date();
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + duration);
      
      const newChallenge: Omit<Challenge, 'id'> = {
        name,
        description,
        startDate,
        endDate,
        crewId: userCrew.id,
        isActive: true,
        isCompleted: false,
        week: Math.ceil((new Date().getTime() - new Date(startDate).getTime()) / (7 * 24 * 60 * 60 * 1000)),
        duration,
        lowerScoreIsBetter
      };
      
      await createChallenge(newChallenge);
      navigate('/crew');
      
    } catch (err) {
      setError('Failed to create challenge');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-4">
      <div className="row">
        <div className="col-md-8 mx-auto">
          <div className="card">
            <div className="card-body">
              <div className="d-flex align-items-center mb-4">
                <FontAwesomeIcon icon={faTrophy} className="text-primary me-3" size="2x" />
                <h2 className="mb-0">Create Challenge</h2>
              </div>

              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="name" className="form-label">Challenge Name</label>
                  <input
                    type="text"
                    className="form-control"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="description" className="form-label">Description</label>
                  <textarea
                    className="form-control"
                    id="description"
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                  />
                </div>
                
                <div className="mb-3">
                  <label htmlFor="duration" className="form-label">
                    <FontAwesomeIcon icon={faCalendarAlt} className="me-2" />
                    Duration (days)
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    id="duration"
                    min="1"
                    value={duration}
                    onChange={(e) => setDuration(parseInt(e.target.value))}
                    required
                  />
                </div>
                
                <div className="mb-3">
                  <div className="form-check">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id="lowerScoreIsBetter"
                      checked={lowerScoreIsBetter}
                      onChange={(e) => setLowerScoreIsBetter(e.target.checked)}
                    />
                    <label className="form-check-label" htmlFor="lowerScoreIsBetter">
                      Lower score is better (e.g., carbon footprint, shower duration)
                    </label>
                  </div>
                </div>
                
                <button 
                  type="submit" 
                  className="btn btn-eco"
                  disabled={loading}
                >
                  {loading ? 'Creating...' : 'Create Challenge'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateChallenge; 