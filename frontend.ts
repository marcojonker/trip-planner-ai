import 'ol/ol.css';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import OSM from 'ol/source/OSM';
import VectorSource from 'ol/source/Vector';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import Style from 'ol/style/Style';
import Icon from 'ol/style/Icon';
import Text from 'ol/style/Text';
import Fill from 'ol/style/Fill';
import Stroke from 'ol/style/Stroke';
import Circle from 'ol/style/Circle';
import { fromLonLat, toLonLat } from 'ol/proj';
import GeoJSON from 'ol/format/GeoJSON';

// Types
interface Task {
  task: string;
  name: string;
  street: string;
  houseNumber: number;
  city: string;
  country: string;
  distance: number;
  reason: string;
  openingHours: string[];
  alternativeStreet: string;
  alternativeHouseNumber: number;
  alternativeCity: string;
  alternativeCountry: string;
  alternativeAddress: string;
  alternativeGeometry: {
    type: 'Point';
    coordinates: [number, number];
  };
}

interface TaskFeature {
  type: 'Feature';
  geometry: {
    type: 'Point';
    coordinates: [number, number];
  };
  properties: Task;
}

interface TaskFeatureCollection {
  type: 'FeatureCollection';
  features: TaskFeature[];
}

// DOM Elements
const queryInput = document.getElementById('queryInput') as HTMLInputElement;
const submitBtn = document.getElementById('submitBtn') as HTMLButtonElement;
const loadingDiv = document.getElementById('loading') as HTMLElement;
const errorMessage = document.getElementById('errorMessage') as HTMLElement;
const successMessage = document.getElementById('successMessage') as HTMLElement;
const tripDetails = document.getElementById('tripDetails') as HTMLElement;

// API Configuration
const API_URL = 'http://localhost:3000';

// Initialize Map
const vectorSource = new VectorSource();

const map = new Map({
  target: 'map',
  layers: [
    new TileLayer({
      source: new OSM(),
      className: 'osm-layer',
    }),
    new VectorLayer({
      source: vectorSource,
    }),
  ],
  view: new View({
    center: fromLonLat([5.2913, 52.1326]), // Amsterdam, Netherlands
    zoom: 12,
  }),
});

// Add click interaction for features
let currentFeature: Feature | null = null;

map.on('click', (evt) => {
  const feature = map.forEachFeatureAtPixel(evt.pixel, (feature) => feature);
  
  if (feature) {
    const properties = feature.getProperties();
    displayTaskDetails(properties as Task);
  }
});

map.getViewport().style.cursor = 'pointer';

// Show/hide messages
function showMessage(message: string, type: 'error' | 'success') {
  const messageDiv = type === 'error' ? errorMessage : successMessage;
  const otherDiv = type === 'error' ? successMessage : errorMessage;
  
  messageDiv.textContent = message;
  messageDiv.classList.remove('hidden');
  otherDiv.classList.add('hidden');
  
  if (type === 'success') {
    setTimeout(() => {
      messageDiv.classList.add('hidden');
    }, 5000);
  }
}

function hideMessages() {
  errorMessage.classList.add('hidden');
  successMessage.classList.add('hidden');
}

// Format address
function formatAddress(task: Task): string {
  return `${task.street} ${task.houseNumber}, ${task.city}, ${task.country}`;
}

// Display task details in sidebar
function displayTaskDetails(task: Task) {
  const index = Array.from(vectorSource.getFeatures()).findIndex(
    (f) => f.getProperties() === task
  );
  
  let html = '<div class="task-item">';
  html += `<div class="task-title"><span class="task-icon">📍</span>${task.name}</div>`;
  html += `<div class="task-detail"><strong>Task:</strong> ${task.task}</div>`;
  html += `<div class="task-detail"><strong>Address:</strong> ${formatAddress(task)}</div>`;
  html += `<div class="task-detail"><strong>Hours:</strong> ${task.openingHours.join(', ')}</div>`;
  html += `<div class="task-detail"><strong>Reason:</strong> ${task.reason}</div>`;
  html += `<div class="distance">Distance: ${task.distance.toFixed(2)} km</div>`;
  
  html += '<div class="alternative">';
  html += `<strong>Alternative:</strong><br>`;
  html += `${task.alternativeStreet} ${task.alternativeHouseNumber}, ${task.alternativeCity}`;
  html += '</div>';
  
  html += '</div>';
  
  tripDetails.innerHTML = html;
}

// Display all trip details
function displayAllTripDetails(data: TaskFeatureCollection) {
  let html = '';
  
  data.features.forEach((feature, index) => {
    const task = feature.properties;
    const isStart = index === 0;
    
    html += `<div class="task-item ${isStart ? 'start' : ''}">`;
    html += `<div class="task-title">
      <span class="task-icon">${isStart ? '🚩' : index}</span>
      ${task.name}
    </div>`;
    html += `<div class="task-detail"><strong>Task:</strong> ${task.task}</div>`;
    html += `<div class="task-detail"><strong>Address:</strong> ${formatAddress(task)}</div>`;
    html += `<div class="task-detail"><strong>Hours:</strong> ${task.openingHours.join(', ')}</div>`;
    html += `<div class="task-detail"><strong>Reason:</strong> ${task.reason}</div>`;
    html += `<div class="distance">Distance: ${task.distance.toFixed(2)} km</div>`;
    
    html += '<div class="alternative">';
    html += `<strong>Alternative:</strong><br>`;
    html += `${task.alternativeStreet} ${task.alternativeHouseNumber}, ${task.alternativeCity}`;
    html += '</div>';
    
    html += '</div>';
  });
  
  tripDetails.innerHTML = html;
}

// Create marker style
function getMarkerStyle(index: number, isStart: boolean = false) {
  return new Style({
    image: new Circle({
      radius: 12,
      fill: new Fill({
        color: isStart ? '#51cf66' : '#667eea',
      }),
      stroke: new Stroke({
        color: 'white',
        width: 2,
      }),
    }),
    text: new Text({
      text: isStart ? '🚩' : String(index),
      fill: new Fill({
        color: 'white',
      }),
      font: 'bold 12px Arial',
      offsetY: -15,
    }),
  });
}

// Plot features on map
function plotFeatures(data: TaskFeatureCollection) {
  vectorSource.clear();
  
  if (!data.features || data.features.length === 0) {
    showMessage('No features found in the response', 'error');
    return;
  }
  
  const coordinates: [number, number][] = [];
  
  data.features.forEach((feature, index) => {
    const task = feature.properties;
    const coordinates_ll = feature.geometry.coordinates as [number, number];
    
    // Plot main location
    const mainFeature = new Feature({
      geometry: new Point(fromLonLat(coordinates_ll)),
      ...task,
    });
    
    mainFeature.setStyle(getMarkerStyle(index + 1, index === 0));
    vectorSource.addFeature(mainFeature);
    coordinates.push(coordinates_ll);
    
    // Plot alternative location if available
    if (task.alternativeGeometry && task.alternativeGeometry.coordinates) {
      const altFeature = new Feature({
        geometry: new Point(fromLonLat(task.alternativeGeometry.coordinates)),
        ...task,
      });
      
      altFeature.setStyle(
        new Style({
          image: new Circle({
            radius: 8,
            fill: new Fill({
              color: '#ffa94d',
            }),
            stroke: new Stroke({
              color: 'white',
              width: 1,
            }),
          }),
          text: new Text({
            text: '⭐',
            offsetY: -12,
          }),
        })
      );
      
      vectorSource.addFeature(altFeature);
    }
  });
  
  // Fit map to features
  if (coordinates.length > 0) {
    const source = vectorSource;
    const extent = source.getExtent();
    if (extent[0] !== Infinity) {
      map.getView().fit(extent, {
        padding: [100, 100, 100, 350],
        duration: 500,
      });
    }
  }
}

// Fetch and process trip plan
async function planTrip() {
  const query = queryInput.value.trim();
  
  if (!query) {
    showMessage('Please enter a query', 'error');
    return;
  }
  
  submitBtn.disabled = true;
  loadingDiv.classList.remove('hidden');
  hideMessages();
  
  try {
    const response = await fetch(`${API_URL}/api/plan-trip`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query }),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `HTTP ${response.status}`);
    }
    
    const result = await response.json();
    
    if (result.success && result.data) {
      plotFeatures(result.data);
      displayAllTripDetails(result.data);
      showMessage(`Trip planned! ${result.data.features.length} locations found.`, 'success');
    } else {
      throw new Error(result.message || 'Invalid response format');
    }
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown error occurred';
    console.error('Error planning trip:', error);
    showMessage(`Error: ${errorMsg}`, 'error');
  } finally {
    submitBtn.disabled = false;
    loadingDiv.classList.add('hidden');
  }
}

// Event listeners
submitBtn.addEventListener('click', planTrip);
queryInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    planTrip();
  }
});

// Auto-focus on load
queryInput.focus();

console.log('Trip Planner Frontend loaded successfully!');
console.log(`API endpoint: ${API_URL}`);
