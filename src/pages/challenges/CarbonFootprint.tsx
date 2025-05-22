import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faCarSide, 
  faBus, 
  faBicycle, 
  faWalking, 
  faLeaf, 
  faSave,
  faLocationArrow,
  faRoute,
  faSearch,
  faCalculator,
  faCar,
  faHistory,
  faPlus,
  faTrash
} from '@fortawesome/free-solid-svg-icons';
import TripSubmission from '../../components/TripSubmission';
import { CarbonFootprintSubmission } from '../../types';
import axios from 'axios';

declare global {
  interface Window {
    google: typeof google;
    initMap: () => void;
  }
}

// Mock car emissions database - in a real app, this would be fetched from an API
const CAR_EMISSIONS_DATABASE = {
  "toyota": {
    "corolla": {
      "2020": { emissionFactor: 0.104 },
      "2021": { emissionFactor: 0.098 },
      "2022": { emissionFactor: 0.092 }
    },
    "camry": {
      "2020": { emissionFactor: 0.115 },
      "2021": { emissionFactor: 0.112 },
      "2022": { emissionFactor: 0.108 }
    },
    "prius": {
      "2020": { emissionFactor: 0.075 },
      "2021": { emissionFactor: 0.072 },
      "2022": { emissionFactor: 0.068 }
    }
  },
  "honda": {
    "civic": {
      "2020": { emissionFactor: 0.107 },
      "2021": { emissionFactor: 0.103 },
      "2022": { emissionFactor: 0.099 }
    },
    "accord": {
      "2020": { emissionFactor: 0.118 },
      "2021": { emissionFactor: 0.115 },
      "2022": { emissionFactor: 0.112 }
    }
  },
  "tesla": {
    "model 3": {
      "2020": { emissionFactor: 0.024 },
      "2021": { emissionFactor: 0.022 },
      "2022": { emissionFactor: 0.020 }
    },
    "model y": {
      "2020": { emissionFactor: 0.028 },
      "2021": { emissionFactor: 0.026 },
      "2022": { emissionFactor: 0.024 }
    }
  },
  "ford": {
    "f-150": {
      "2020": { emissionFactor: 0.220 },
      "2021": { emissionFactor: 0.215 },
      "2022": { emissionFactor: 0.210 }
    },
    "mustang": {
      "2020": { emissionFactor: 0.190 },
      "2021": { emissionFactor: 0.185 },
      "2022": { emissionFactor: 0.180 }
    }
  }
};

// Base transport types
const transportTypes = [
  { id: 'car', name: 'Car', icon: faCarSide, emissionFactor: 0.12 }, // kg CO2 per km (default value)
  { id: 'public', name: 'Public Transport', icon: faBus, emissionFactor: 0.04 },
  { id: 'bike', name: 'Bicycle', icon: faBicycle, emissionFactor: 0 },
  { id: 'walk', name: 'Walking', icon: faWalking, emissionFactor: 0 }
];

const CarbonFootprint: React.FC = () => {
  const navigate = useNavigate();
  const { submitCarbonFootprint } = useApp();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (submission: CarbonFootprintSubmission) => {
    try {
      setIsSubmitting(true);
      setError(null);
      await submitCarbonFootprint(submission);
      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit carbon footprint');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container py-4">
      <div className="card">
        <div className="card-body">
          <h1 className="card-title">Carbon Footprint Challenge</h1>
          <p className="lead">
            Track your transportation carbon footprint and earn points for sustainable travel choices.
          </p>
          
          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}
          
          <TripSubmission onSubmit={handleSubmit} />
        </div>
      </div>
    </div>
  );
};

export default CarbonFootprint; 