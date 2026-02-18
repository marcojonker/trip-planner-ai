import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-trip-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './trip-details.component.html',
  styleUrls: ['./trip-details.component.css']
})
export class TripDetailsComponent implements OnInit {
  @Input() tripData: any = null;
  @Input() headerHeight = 100;
  @Output() onLocationClick = new EventEmitter<{ lat: number; lng: number; name: string }>();

  expandedAlternatives: Set<number> = new Set();
  detailsStyle: any = {};

  ngOnInit() {
    this.updatePosition();
  }

  ngOnChanges() {
    this.updatePosition();
    this.expandedAlternatives.clear();
  }

  updatePosition() {
    this.detailsStyle = {
      top: (this.headerHeight + 10) + 'px'
    };
  }

  toggleAlternative(index: number) {
    if (this.expandedAlternatives.has(index)) {
      this.expandedAlternatives.delete(index);
    } else {
      this.expandedAlternatives.add(index);
    }
  }

  isAlternativeExpanded(index: number): boolean {
    return this.expandedAlternatives.has(index);
  }

  formatDistance(meters: number): string {
    if (meters >= 1000) {
      return (meters / 1000).toFixed(2) + ' km';
    }
    return meters.toFixed(0) + ' m';
  }

  zoomToLocation(feature: any) {
    if (feature.geometry && feature.geometry.coordinates) {
      const [lng, lat] = feature.geometry.coordinates;
      const name = feature.properties?.name || 'Location';
      this.onLocationClick.emit({ lat, lng, name });
    }
  }

  zoomToAlternativeLocation(feature: any) {
    if (feature.properties.alternativeGeometry && feature.properties.alternativeGeometry.coordinates) {
      const [lng, lat] = feature.properties.alternativeGeometry.coordinates;
      const name = feature.properties?.alternativeName || 'Alternative Location';
      this.onLocationClick.emit({ lat, lng, name });
    }
  }
}
