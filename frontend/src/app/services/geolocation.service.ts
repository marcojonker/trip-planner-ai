import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface LocationData {
  latitude: number;
  longitude: number;
  accuracy: number;
}

@Injectable({
  providedIn: 'root'
})
export class GeolocationService {
  private locationSubject = new BehaviorSubject<LocationData | null>(null);
  public location$ = this.locationSubject.asObservable();

  constructor() { }

  getCurrentLocation(): Promise<LocationData> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation not supported'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location: LocationData = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy
          };
          this.locationSubject.next(location);
          resolve(location);
        },
        (error) => {
          reject(error);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000
        }
      );
    });
  }

  getLocation(): LocationData | null {
    return this.locationSubject.value;
  }

  formatCoordinates(location: LocationData): string {
    return `${location.latitude.toFixed(7)}, ${location.longitude.toFixed(7)}`;
  }
}
