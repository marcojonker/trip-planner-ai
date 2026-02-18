import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment';

export interface PlanTripRequest {
  query: string;
}

export interface PlanTripResponse {
  success: boolean;
  data: any;
  timestamp: string;
}

@Injectable({
  providedIn: 'root'
})
export class TripPlannerService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  planTrip(query: string): Observable<PlanTripResponse> {
    const request: PlanTripRequest = { query };
    return this.http.post<PlanTripResponse>(`${this.apiUrl}/plan-trip`, request);
  }

  getHealth(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl.replace('/api', '')}/health`);
  }

  getDocumentation(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/docs`);
  }
}
