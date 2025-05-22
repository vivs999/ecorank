import React, { useState, useEffect } from 'react';
import { VehicleData } from '../services/carEmissions';
import { carEmissionsService } from '../services/carEmissions';

interface VehicleInfoProps {
  vehicleData: VehicleData;
}

export const VehicleInfo: React.FC<VehicleInfoProps> = ({ vehicleData }) => {
  const [ecoScore, setEcoScore] = useState<{
    smogScore: number;
    smartwayScore: number;
    emissionStandard: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEcoScore = async () => {
      try {
        const score = await carEmissionsService.getEcoScore(vehicleData.id);
        setEcoScore(score);
      } catch (err) {
        setError('Failed to load eco score');
      } finally {
        setLoading(false);
      }
    };

    fetchEcoScore();
  }, [vehicleData.id]);

  const getSmartwayLabel = (score: number) => {
    switch (score) {
      case 1:
        return 'SmartWay';
      case 2:
        return 'SmartWay Elite';
      default:
        return 'Not SmartWay Certified';
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
        </div>
      </div>
    );
  }

  if (error || !ecoScore) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-red-600">{error || 'Failed to load vehicle information'}</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6 space-y-4">
      <h3 className="text-xl font-semibold text-gray-900">
        {vehicleData.year} {vehicleData.make} {vehicleData.model}
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Fuel Economy */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-500">Fuel Economy</h4>
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-sm text-gray-500">City</p>
              <p className="text-lg font-semibold text-gray-900">{vehicleData.city08} MPG</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-sm text-gray-500">Highway</p>
              <p className="text-lg font-semibold text-gray-900">{vehicleData.hwy08} MPG</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-sm text-gray-500">Combined</p>
              <p className="text-lg font-semibold text-gray-900">{vehicleData.comb08} MPG</p>
            </div>
          </div>
        </div>

        {/* Emissions */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-500">Emissions</h4>
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-sm text-gray-500">CO2 per Mile</p>
              <p className="text-lg font-semibold text-gray-900">
                {vehicleData.co2TailpipeGpm.toFixed(1)} g/mi
              </p>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-sm text-gray-500">Smog Rating</p>
              <div className="flex items-center space-x-2">
                <div className="flex">
                  {[...Array(10)].map((_, i) => (
                    <div
                      key={i}
                      className={`w-2 h-2 rounded-full mx-0.5 ${
                        i < ecoScore.smogScore ? 'bg-green-500' : 'bg-gray-200'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-500">({ecoScore.smogScore}/10)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gray-50 p-3 rounded-lg">
          <p className="text-sm text-gray-500">Fuel Type</p>
          <p className="text-sm font-medium text-gray-900">
            {vehicleData.fuelType1}
            {vehicleData.fuelType2 ? ` / ${vehicleData.fuelType2}` : ''}
          </p>
        </div>
        <div className="bg-gray-50 p-3 rounded-lg">
          <p className="text-sm text-gray-500">SmartWay Rating</p>
          <p className="text-sm font-medium text-gray-900">
            {getSmartwayLabel(ecoScore.smartwayScore)}
          </p>
        </div>
      </div>

      {/* Emission Standard */}
      <div className="bg-gray-50 p-3 rounded-lg">
        <p className="text-sm text-gray-500">Emission Standard</p>
        <p className="text-sm font-medium text-gray-900">{ecoScore.emissionStandard}</p>
      </div>
    </div>
  );
}; 