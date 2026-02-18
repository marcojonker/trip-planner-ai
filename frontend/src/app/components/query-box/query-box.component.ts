import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-query-box',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './query-box.component.html',
  styleUrls: ['./query-box.component.css']
})
export class QueryBoxComponent {
  @Input() isLoading = false;
  @Input() currentLocation: any = null;
  @Output() onSubmit = new EventEmitter<string>();
  @Output() onLocationClick = new EventEmitter<void>();

  query = '';

  handleSubmit() {
    if (this.query.trim()) {
      let finalQuery = this.query;
      
      // Add location context if available
      if (this.currentLocation) {
        const coords = `${this.currentLocation.latitude.toFixed(7)}, ${this.currentLocation.longitude.toFixed(7)}`;
        finalQuery = `My current location is at ${coords}. ${this.query}`;
      }
      
      this.onSubmit.emit(finalQuery);
      this.query = '';
    }
  }

  handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.handleSubmit();
    }
  }

  getLocationButtonClass(): string {
    return this.currentLocation ? 'has-location' : '';
  }
}
