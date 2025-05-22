import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers, faPlusCircle, faKey, faClock } from '@fortawesome/free-solid-svg-icons';
import { generateRandomCode } from '../../utils/helpers';

const CreateCrew: React.FC = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { createCrew } = useApp();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (name.trim().length < 3) {
      return setError('Crew name must be at least 3 characters long');
    }
    
    if (description.trim().length < 10) {
      return setError('Please provide a more detailed description (10+ characters)');
    }
    
    try {
      setError(null);
      setLoading(true);
      
      await createCrew(name);
      navigate('/crew');
      
    } catch (err) {
      setError('Failed to create crew');
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
                <FontAwesomeIcon icon={faUsers} className="text-primary me-3" size="2x" />
                <h2 className="mb-0">Create Crew</h2>
              </div>

              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="name" className="form-label">Crew Name</label>
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
                
                <button 
                  type="submit" 
                  className="btn btn-eco"
                  disabled={loading}
                >
                  {loading ? 'Creating...' : 'Create Crew'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateCrew; 