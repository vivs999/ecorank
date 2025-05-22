import { MapsApiKey } from '../config';

export class MapsService {
  private static instance: MapsService;
  private directionsService: google.maps.DirectionsService | null = null;
  private directionsRenderer: google.maps.DirectionsRenderer | null = null;
  private map: google.maps.Map | null = null;

  private constructor() {
    this.initializeMap();
  }

  public static getInstance(): MapsService {
    if (!MapsService.instance) {
      MapsService.instance = new MapsService();
    }
    return MapsService.instance;
  }

  private initializeMap() {
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${MapsApiKey}&libraries=places&callback=initMap`;
    script.async = true;
    script.defer = true;

    window.initMap = () => {
      this.directionsService = new google.maps.DirectionsService();
      this.directionsRenderer = new google.maps.DirectionsRenderer();
    };

    document.head.appendChild(script);
  }

  public async getRoute(origin: string, destination: string): Promise<{
    distance: number;
    duration: number;
    steps: google.maps.DirectionsStep[];
  }> {
    if (!this.directionsService) {
      throw new Error('Directions service not initialized');
    }

    return new Promise((resolve, reject) => {
      this.directionsService!.route(
        {
          origin,
          destination,
          travelMode: google.maps.TravelMode.DRIVING,
        },
        (result, status) => {
          if (status === google.maps.DirectionsStatus.OK && result) {
            const route = result.routes[0].legs[0];
            resolve({
              distance: route.distance?.value || 0,
              duration: route.duration?.value || 0,
              steps: route.steps,
            });
          } else {
            reject(new Error(`Failed to get route: ${status}`));
          }
        }
      );
    });
  }

  public setMap(mapElement: HTMLElement) {
    if (!this.map) {
      this.map = new google.maps.Map(mapElement, {
        center: { lat: 37.7749, lng: -122.4194 },
        zoom: 12,
      });
    }
    if (this.directionsRenderer) {
      this.directionsRenderer.setMap(this.map);
    }
  }

  public clearRoute() {
    if (this.directionsRenderer) {
      this.directionsRenderer.setDirections(null);
    }
  }
} 