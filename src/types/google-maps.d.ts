declare namespace google.maps {
  class Map {
    constructor(mapDiv: Element, opts?: MapOptions);
  }

  class DirectionsService {
    constructor();
    route(request: DirectionsRequest, callback: (result: DirectionsResult, status: DirectionsStatus) => void): void;
  }

  class DirectionsRenderer {
    constructor(opts?: DirectionsRendererOptions);
    setMap(map: Map | null): void;
    setDirections(directions: DirectionsResult | null): void;
  }

  class places {
    class Autocomplete {
      constructor(inputField: HTMLInputElement, opts?: AutocompleteOptions);
    }
  }

  interface MapOptions {
    center: LatLng | LatLngLiteral;
    zoom: number;
  }

  interface DirectionsRequest {
    origin: string | LatLng | LatLngLiteral | Place;
    destination: string | LatLng | LatLngLiteral | Place;
    travelMode: TravelMode;
  }

  interface DirectionsResult {
    routes: DirectionsRoute[];
  }

  interface DirectionsRoute {
    legs: DirectionsLeg[];
  }

  interface DirectionsLeg {
    distance?: Distance;
    duration?: Duration;
    steps: DirectionsStep[];
  }

  interface DirectionsStep {
    distance: Distance;
    duration: Duration;
    instructions: string;
  }

  interface Distance {
    text: string;
    value: number;
  }

  interface Duration {
    text: string;
    value: number;
  }

  interface DirectionsRendererOptions {
    map?: Map;
  }

  interface AutocompleteOptions {
    types?: string[];
  }

  interface LatLng {
    lat(): number;
    lng(): number;
  }

  interface LatLngLiteral {
    lat: number;
    lng: number;
  }

  interface Place {
    location: LatLng;
  }

  enum TravelMode {
    DRIVING = 'DRIVING',
    BICYCLING = 'BICYCLING',
    TRANSIT = 'TRANSIT',
    WALKING = 'WALKING'
  }

  enum DirectionsStatus {
    OK = 'OK',
    NOT_FOUND = 'NOT_FOUND',
    ZERO_RESULTS = 'ZERO_RESULTS',
    MAX_ROUTE_LENGTH_EXCEEDED = 'MAX_ROUTE_LENGTH_EXCEEDED',
    INVALID_REQUEST = 'INVALID_REQUEST',
    OVER_QUERY_LIMIT = 'OVER_QUERY_LIMIT',
    REQUEST_DENIED = 'REQUEST_DENIED',
    UNKNOWN_ERROR = 'UNKNOWN_ERROR'
  }
}

interface Window {
  google: typeof google;
  initMap: () => void;
} 