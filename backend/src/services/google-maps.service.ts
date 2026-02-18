import { Client, PlaceInputType } from '@googlemaps/google-maps-services-js';

export class GoogleMapsService {
  private client: Client;
  private apiKey: string;
  
  constructor(apiKey: string) {
    this.apiKey = apiKey;
    this.client = new Client({});
  }
  
  async reverseGeocode(lat: number, lng: number): Promise<string> {
    try {
      const response = await this.client.reverseGeocode({
        params: {
          latlng: `${lat},${lng}`,
          key: this.apiKey,
        },
      });

      if (response.data.results.length > 0) {
        return response.data.results[0].formatted_address;
      }
      return 'Address not found';
    } catch (error) {
      console.error('Error fetching address:', error);
      return 'Error fetching address';
    }
  }

  async geocode(street: string, houseNumber: number, city: string, country: string): Promise<{ lat: number; lng: number }> {
    try {
      const response = await this.client.geocode({
        params: {
          address: `${street} ${houseNumber}, ${city}, ${country}`,
          key: this.apiKey,
        },
      });

      if (response.data.results.length > 0) {
        return response.data.results[0].geometry.location;
      }
      return { lat: 0, lng: 0 };
    } catch (error) {
      console.error('Error fetching address:', error);
      return { lat: 0, lng: 0 };
    }
  }

  async getDistance(latFrom: number, lngFrom: number, latTo: number, lngTo: number): Promise<number> {
    try {
      const response = await this.client.directions({
        params: {
          origin: [latFrom, lngFrom],
          destination: [latTo, lngTo],
          key: this.apiKey
        }
      });


      if (response.data.routes[0]) {
        return response.data.routes[0].legs.reduce((acc, leg) => acc + leg.distance.value, 0);
      }
      return 0;
    } catch (error) {
      console.error('Error fetching address:', error);
      return 0;
    }
  }

  async validateLocationExists(locationName: string, city: string): Promise<{ exists: boolean; details?: any }> {
    try {
      const query = `${locationName}, ${city}`;
      const response = await this.client.findPlaceFromText({
        params: {
          input: query,
          inputtype: PlaceInputType.textQuery,
          key: this.apiKey,
          fields: ['name', 'formatted_address', 'geometry', 'place_id', 'types']
        }
      });

      if (response.data.candidates && response.data.candidates.length > 0) {
        const place = response.data.candidates[0];
        return {
          exists: true,
          details: {
            name: place.name,
            address: place.formatted_address,
            coordinates: {
              lat: place.geometry?.location?.lat,
              lng: place.geometry?.location?.lng
            },
            placeId: place.place_id,
            types: place.types
          }
        };
      }
      return { exists: false };
    } catch (error) {
      console.error('Error validating location:', error);
      return { exists: false };
    }
  }
}