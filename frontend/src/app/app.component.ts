import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MapComponent } from './components/map/map.component';
import { QueryBoxComponent } from './components/query-box/query-box.component';
import { TripDetailsComponent } from './components/trip-details/trip-details.component';
import { TripPlannerService } from './services/trip-planner.service';
import { GeolocationService } from './services/geolocation.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    MapComponent,
    QueryBoxComponent,
    TripDetailsComponent
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  @ViewChild('mapComponent') mapComponent!: MapComponent;

  title = 'Trip Planner AI';
  isLoading = false;
  error: string | null = null;
  success: string | null = null;
  tripData: any = null;
  headerHeight = 100;
  currentLocation: any = null;

  private destroy$ = new Subject<void>();

  constructor(
    private tripPlannerService: TripPlannerService,
    private geolocationService: GeolocationService
  ) { }

  ngOnInit() {
    this.updateHeaderHeight();
    window.addEventListener('resize', () => this.updateHeaderHeight());
    
    // Subscribe to geolocation changes
    this.geolocationService.location$
      .pipe(takeUntil(this.destroy$))
      .subscribe(location => {
        this.currentLocation = location;
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    window.removeEventListener('resize', () => this.updateHeaderHeight());
  }

  updateHeaderHeight() {
    const header = document.querySelector('header');
    if (header) {
      this.headerHeight = header.offsetHeight;
    }
  }

  onQuerySubmit(query: string) {
    this.isLoading = true;
    this.error = null;
    this.success = null;

    this.tripPlannerService.planTrip(query)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.tripData = response.data;
          this.success = 'Trip planned successfully!';
          this.isLoading = false;
          setTimeout(() => this.success = null, 3000);
        },
        error: (error) => {
          this.error = error.error?.message || 'Failed to plan trip. Please try again.';
          this.isLoading = false;
          setTimeout(() => this.error = null, 5000);
        }
      });
  }

  onGetCurrentLocation() {
    this.geolocationService.getCurrentLocation()
      .then(location => {
        this.currentLocation = location;
        if (this.mapComponent) {
          this.mapComponent.zoomToLocation(location.latitude, location.longitude, 15);
        }
        this.success = `📍 Location found: ${this.geolocationService.formatCoordinates(location)}`;
        setTimeout(() => this.success = null, 3000);
      })
      .catch(() => {
        this.error = 'Unable to get your current location';
        setTimeout(() => this.error = null, 5000);
      });
  }

  onTripDetailsLocationClick(event: { lat: number; lng: number; name: string }) {
    console.log('Zooming to location:', event);
    if (this.mapComponent) {
      this.mapComponent.zoomToLocation(event.lat, event.lng, 16);
      this.success = `📍 Zooming to ${event.name}`;
      setTimeout(() => this.success = null, 2000);
    }
  }
}
