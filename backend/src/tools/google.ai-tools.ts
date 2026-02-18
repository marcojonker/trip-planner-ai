import { GoogleMapsService } from '../services/google-maps.service';
import { tool } from '@openai/agents';
import { z } from 'zod';
import { AiTools } from './ai-tools.interface';

export class GoogleAiTools extends AiTools {
  private googleMapsService: GoogleMapsService;

  public static buildTools(apiKey: string) {
    return new GoogleAiTools(apiKey).createTools();;
  }

  private constructor(apiKey: string) {
    super();
    this.googleMapsService = new GoogleMapsService(apiKey);
  }

  protected createTools(): AiTools {
    const self = this;
    this.addAiTool('google-reverse-geocode', tool({
      name: 'google-reverse-geocode',
      description: 'Get the address from coordinates (latitude and longitude).',
      parameters: z.object({ lat: z.number(), lng: z.number() }),
      async execute({ lat, lng }) {
        return await self.googleMapsService.reverseGeocode(lat, lng);
      }
    }));

    this.addAiTool('google-geocode', tool({
      name: 'google-geocode',
      description: 'Get the coordinate from an address (street, house number, city, country).',
      parameters: z.object({ street: z.string(), houseNumber: z.number(), city: z.string(), country: z.string() }),
      async execute({ street, houseNumber, city, country }) {
        return await self.googleMapsService.geocode(street, houseNumber, city, country);
      }
    }));

    this.addAiTool('google-distance', tool({
      name: 'google-distance',
      description: 'Get distance between two coordinates.',
      parameters: z.object({ latFrom: z.number(), lngFrom: z.number(), latTo: z.number(), lngTo: z.number() }),
      async execute({ latFrom, lngFrom, latTo, lngTo }) {
        return await self.googleMapsService.getDistance(latFrom, lngFrom, latTo, lngTo);
      }
    }));

    this.addAiTool('google-validate-location', tool({
      name: 'google-validate-location',
      description: 'Validate if a location exists using Google Places API. Returns location details if it exists.',
      parameters: z.object({ locationName: z.string(), city: z.string() }),
      async execute({ locationName, city }) {
        return await self.googleMapsService.validateLocationExists(locationName, city);
      }
    }));

    return this;
  }
}
