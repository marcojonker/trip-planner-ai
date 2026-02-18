import { Component, Input, OnInit, OnDestroy, ViewChild, ElementRef, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import OSM from 'ol/source/OSM';
import VectorSource from 'ol/source/Vector';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import { Style, Circle as CircleStyle, Text, Fill, Stroke } from 'ol/style';
import { fromLonLat } from 'ol/proj';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit, OnDestroy, OnChanges {
  @Input() tripData: any = null;
  @Input() headerHeight = 100;
  @Input() isLoading = false;
  @ViewChild('mapContainer') mapContainer!: ElementRef;

  private map!: Map;
  private vectorSource!: VectorSource<any>;
  private vectorLayer!: VectorLayer<any>;

  ngOnInit() {
    setTimeout(() => this.initializeMap(), 100);
  }

  ngOnDestroy() {
    if (this.map) {
      this.map.setTarget(undefined);
    }
  }

  private initializeMap() {
    console.log('Initializing map...');
    this.vectorSource = new VectorSource<any>();
    
    const styleFunction = (feature: any) => {
      console.log('Styling feature:', feature.get('index'));
      return this.getFeatureStyle(feature);
    };
    
    this.vectorLayer = new VectorLayer<any>({
      source: this.vectorSource,
      style: styleFunction
    });

    this.map = new Map({
      target: 'map',
      layers: [
        new TileLayer({
          source: new OSM()
        }),
        this.vectorLayer
      ],
      view: new View({
        center: fromLonLat([5.6087735, 51.6010502]),
        zoom: 13
      })
    });
    console.log('Map initialized, target element:', document.getElementById('map'));

    if (this.tripData) {
      this.updateMap(this.tripData);
    }
  }

  private updateMap(tripData: any) {
    console.log('Updating map with trip data:', tripData);
    if (!tripData || !tripData.features) {
      console.log('No trip data or features');
      return;
    }

    console.log('Number of features:', tripData.features.length);
    this.vectorSource.clear();
    const features: any[] = [];
    let bounds: [number, number, number, number] | null = null;

    tripData.features.forEach((feature: any, index: number) => {
      console.log(`Processing feature ${index}:`, feature);
      if (feature.geometry && feature.geometry.coordinates) {
        const [lon, lat] = feature.geometry.coordinates;
        console.log(`Feature ${index} coordinates: [${lon}, ${lat}]`);
        const point = new Point(fromLonLat([lon, lat]));
        const olFeature = new Feature({ geometry: point, index, isAlternative: false });
        features.push(olFeature);

        // Extend bounds
        if (!bounds) {
          bounds = [lon, lat, lon, lat];
        } else {
          bounds[0] = Math.min(bounds[0], lon);
          bounds[1] = Math.min(bounds[1], lat);
          bounds[2] = Math.max(bounds[2], lon);
          bounds[3] = Math.max(bounds[3], lat);
        }
      }

      // Add alternative location if it exists and has valid data
      if (feature.properties.alternativeName && 
          feature.properties.alternativeGeometry && 
          feature.properties.alternativeGeometry.coordinates &&
          feature.properties.alternativeGeometry.coordinates.length === 2) {
        const [altLon, altLat] = feature.properties.alternativeGeometry.coordinates;
        // Check if coordinates are not zero/default values
        if (altLon !== 0 && altLat !== 0) {
          console.log(`Alternative feature ${index} coordinates: [${altLon}, ${altLat}]`);
          const altPoint = new Point(fromLonLat([altLon, altLat]));
          const altFeature = new Feature({ geometry: altPoint, index, isAlternative: true });
          features.push(altFeature);

          // Extend bounds
          if (!bounds) {
            bounds = [altLon, altLat, altLon, altLat];
          } else {
            bounds[0] = Math.min(bounds[0], altLon);
            bounds[1] = Math.min(bounds[1], altLat);
            bounds[2] = Math.max(bounds[2], altLon);
            bounds[3] = Math.max(bounds[3], altLat);
          }
        }
      }
    });

    console.log('Total features to add:', features.length);
    this.vectorSource.addFeatures(features);

    // Fit map to features
    if (bounds) {
      console.log('Bounds:', bounds);
      const extent = [
        fromLonLat([bounds[0], bounds[1]])[0],
        fromLonLat([bounds[0], bounds[1]])[1],
        fromLonLat([bounds[2], bounds[3]])[0],
        fromLonLat([bounds[2], bounds[3]])[1]
      ];
      console.log('Extent:', extent);
      this.map.getView().fit(extent, { padding: [80, 80, 80, 80] });
    }
  }

  private getFeatureStyle(feature: any): Style {
    const index = feature.get('index');
    const isAlternative = feature.get('isAlternative');
    console.log('getFeatureStyle called with index:', index, 'isAlternative:', isAlternative);
    
    // Use orange for primary locations, blue for alternatives
    const fillColor = isAlternative ? '#2196F3' : '#ff9500';
    const strokeColor = isAlternative ? '#1565C0' : '#ff0000';
    
    const style = new Style({
      image: new CircleStyle({
        radius: 12,
        fill: new Fill({ color: fillColor }),
        stroke: new Stroke({ color: strokeColor, width: 3 })
      }),
      text: new Text({
        text: (index + 1).toString(),
        fill: new Fill({ color: '#fff' }),
        stroke: new Stroke({ color: '#000', width: 2 }),
        font: 'bold 14px Arial'
      })
    });
    console.log('Style created:', style);
    return style;
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log('ngOnChanges fired:', changes);
    if (this.map && changes['tripData']) {
      console.log('Trip data changed:', this.tripData);
      this.updateMap(this.tripData);
    }
  }

  public zoomToLocation(lat: number, lng: number, zoom: number = 15) {
    if (this.map) {
      console.log('Zooming to location:', lat, lng);
      this.map.getView().animate({
        center: fromLonLat([lng, lat]),
        zoom: zoom,
        duration: 1000
      });
    }
  }
}
