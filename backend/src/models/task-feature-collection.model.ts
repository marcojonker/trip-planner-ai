export interface Task {
  task: string;
  name: string;
  street: string;
  houseNumber: number;
  city: string;
  country: string;
  distance: number;
  reason: string;
  openingHours: string[];
  alternativeName: string;
  alternativeStreet: string;
  alternativeHouseNumber: number;
  alternativeCity: string;
  alternativeCountry: string;
  alternativeAddress: string;
  alternativeGeometry: PointGeometry;
  alternativeDistance: number;
  alternativeReason: string;
}

export interface TaskFeatureCollection {
  type: 'FeatureCollection';
  features: TaskFeature[];
}

export interface TaskFeature {
  type: 'Feature';
  geometry: PointGeometry;
  properties: Task;
}

export interface PointGeometry {
  type: 'Point';
  coordinates: [number, number];
}
