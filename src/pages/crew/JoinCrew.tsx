import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { supabase } from '../../lib/supabase';

const JoinCrew: React.FC = () => {
  const navigate = useNavigate();
  const { joinCrew } = useApp();
  const [crewCode, setCrewCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Find crew by join code
      const { data: crew, error: crewError } = await supabase
        .from('crews')
        .select('id')
        .eq('joinCode', crewCode)
        .single();

      if (crewError) throw new Error('Invalid crew code');
      if (!crew) throw new Error('Crew not found');

      // Join the crew
      await joinCrew(crew.id);
      navigate('/crew');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to join crew');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Join a Crew</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label
            htmlFor="crewCode"
            className="block text-sm font-medium text-gray-700"
          >
            Crew Code
          </label>
          <input
            type="text"
            id="crewCode"
            value={crewCode}
            onChange={(e) => setCrewCode(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
            placeholder="Enter crew code"
            required
          />
        </div>

        {error && (
          <div className="text-red-600 text-sm">{error}</div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
        >
          {isLoading ? 'Joining...' : 'Join Crew'}
        </button>
      </form>
    </div>
  );
};

export default JoinCrew; 