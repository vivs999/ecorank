import axios from 'axios';

export interface VehicleMenu {
  value: string;
  text: string;
}

export interface VehicleData {
  id: string;
  year: number;
  make: string;
  model: string;
  city08: number;
  hwy08: number;
  comb08: number;
  co2TailpipeGpm: number;
  fuelType1: string;
  fuelType2?: string;
}

export interface EmissionData {
  smogScore: number;
  smartwayScore: number;
  emissionStandard: string;
}

class CarEmissionsService {
  private static instance: CarEmissionsService;
  private baseUrl: string;

  private constructor() {
    this.baseUrl = 'https://www.fueleconomy.gov/ws/rest';
  }

  public static getInstance(): CarEmissionsService {
    if (!CarEmissionsService.instance) {
      CarEmissionsService.instance = new CarEmissionsService();
    }
    return CarEmissionsService.instance;
  }

  async getYears(): Promise<VehicleMenu[]> {
    try {
      const response = await axios.get(`${this.baseUrl}/vehicle/menu/year`);
      return response.data.menuItem;
    } catch (error) {
      console.error('Error fetching years:', error);
      throw error;
    }
  }

  async getMakes(year: string): Promise<VehicleMenu[]> {
    try {
      const response = await axios.get(`${this.baseUrl}/vehicle/menu/make?year=${year}`);
      return response.data.menuItem;
    } catch (error) {
      console.error('Error fetching makes:', error);
      throw error;
    }
  }

  async getModels(year: string, make: string): Promise<VehicleMenu[]> {
    try {
      const response = await axios.get(
        `${this.baseUrl}/vehicle/menu/model?year=${year}&make=${make}`
      );
      return response.data.menuItem;
    } catch (error) {
      console.error('Error fetching models:', error);
      throw error;
    }
  }

  async getOptions(year: string, make: string, model: string): Promise<VehicleMenu[]> {
    try {
      const response = await axios.get(
        `${this.baseUrl}/vehicle/menu/options?year=${year}&make=${make}&model=${model}`
      );
      return response.data.menuItem;
    } catch (error) {
      console.error('Error fetching options:', error);
      throw error;
    }
  }

  async getVehicleData(vehicleId: string): Promise<VehicleData> {
    try {
      const response = await axios.get(`${this.baseUrl}/vehicle/${vehicleId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching vehicle data:', error);
      throw error;
    }
  }

  async getEcoScore(vehicleId: string): Promise<EmissionData> {
    try {
      const response = await axios.get(`${this.baseUrl}/vehicle/emissions/${vehicleId}`);
      return {
        smogScore: response.data.smogScore || 0,
        smartwayScore: response.data.smartwayScore || 0,
        emissionStandard: response.data.emissionStandard || 'Unknown'
      };
    } catch (error) {
      console.error('Error fetching eco score:', error);
      throw error;
    }
  }
}

export const carEmissionsService = CarEmissionsService.getInstance(); 