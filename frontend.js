// DOM Elements
const queryInput = document.getElementById('queryInput');
const submitBtn = document.getElementById('submitBtn');
const locationBtn = document.getElementById('locationBtn');
const loadingDiv = document.getElementById('loading');
const errorMessage = document.getElementById('errorMessage');
const successMessage = document.getElementById('successMessage');
const tripDetails = document.getElementById('tripDetails');
const header = document.querySelector('.header');
const sidebar = document.querySelector('.sidebar');

// API Configuration
const API_URL = window.location.origin;

// Store current location
let currentLocation = null;

// Update sidebar position based on header height
function updateSidebarPosition() {
  if (header && sidebar) {
    const headerHeight = header.offsetHeight;
    sidebar.style.top = (headerHeight + 10) + 'px';
  }
}

// Initialize Map
const vectorSource = new ol.source.Vector();

const map = new ol.Map({
  target: 'map',
  layers: [
    new ol.layer.Tile({
      source: new ol.source.OSM(),
      className: 'osm-layer',
    }),
    new ol.layer.Vector({
      source: vectorSource,
    }),
  ],
  view: new ol.View({
    center: ol.proj.fromLonLat([5.2913, 52.1326]), // Amsterdam, Netherlands
    zoom: 12,
  }),
});

// Add click interaction for features
map.on('click', (evt) => {
  const feature = map.forEachFeatureAtPixel(evt.pixel, (feature) => feature);
  
  if (feature) {
    const properties = feature.getProperties();
    displayTaskDetails(properties);
  }
});

map.getViewport().style.cursor = 'pointer';

// Show/hide messages
function showMessage(message, type) {
  const messageDiv = type === 'error' ? errorMessage : successMessage;
  const otherDiv = type === 'error' ? successMessage : errorMessage;
  
  messageDiv.textContent = message;
  messageDiv.classList.remove('hidden');
  otherDiv.classList.add('hidden');
  
  updateSidebarPosition();
  
  if (type === 'success') {
    setTimeout(() => {
      messageDiv.classList.add('hidden');
      updateSidebarPosition();
    }, 5000);
  }
}

function hideMessages() {
  errorMessage.classList.add('hidden');
  successMessage.classList.add('hidden');
  updateSidebarPosition();
}

// Format address
function formatAddress(task) {
  return `${task.street} ${task.houseNumber}, ${task.city}, ${task.country}`;
}

// Display task details in sidebar
function displayTaskDetails(task) {
  let html = '<div class="task-item">';
  html += `<div class="task-title"><span class="task-icon">📍</span>${task.name}</div>`;
  html += `<div class="task-detail"><strong>Task:</strong> ${task.task}</div>`;
  html += `<div class="task-detail"><strong>Address:</strong> ${formatAddress(task)}</div>`;
  html += `<div class="task-detail"><strong>Hours:</strong> ${task.openingHours.join(', ')}</div>`;
  html += `<div class="task-detail"><strong>Reason:</strong> ${task.reason}</div>`;
  html += `<div class="distance">Distance: ${(task.distance / 1000).toFixed(2)} km</div>`;
  
  html += '<div class="alternative-section">';
  html += '<button class="alternative-toggle" data-toggle="alternative">';
  html += `<span class="toggle-icon">▶</span> <strong>Alternative Location</strong>`;
  html += '</button>';
  html += '<div class="alternative-content hidden">';
  html += `<div class="alternative-detail"><strong>Name:</strong> ${task.name}</div>`;
  html += `<div class="alternative-detail"><strong>Address:</strong> ${task.alternativeStreet} ${task.alternativeHouseNumber}, ${task.alternativeCity}, ${task.alternativeCountry}</div>`;
  html += `<div class="alternative-detail"><strong>Full Address:</strong> ${task.alternativeAddress}</div>`;
  html += `<div class="alternative-detail"><strong>Reason:</strong> ${task.reason}</div>`;
  if (task.alternativeGeometry && task.alternativeGeometry.coordinates) {
    html += `<div class="alternative-detail"><strong>Coordinates:</strong> ${task.alternativeGeometry.coordinates[1].toFixed(4)}, ${task.alternativeGeometry.coordinates[0].toFixed(4)}</div>`;
  }
  html += '</div>';
  html += '</div>';
  
  html += '</div>';
  
  tripDetails.innerHTML = html;
}

// Display all trip details
function displayAllTripDetails(data) {
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
    html += `<div class="distance">Distance: ${(task.distance / 1000).toFixed(2)} km</div>`;
    
    html += '<div class="alternative-section">';
    html += '<button class="alternative-toggle" data-toggle="alternative">';
    html += `<span class="toggle-icon">▶</span> <strong>Alternative Location</strong>`;
    html += '</button>';
    html += '<div class="alternative-content hidden">';
    html += `<div class="alternative-detail"><strong>Name:</strong> ${task.name}</div>`;
    html += `<div class="alternative-detail"><strong>Address:</strong> ${task.alternativeStreet} ${task.alternativeHouseNumber}, ${task.alternativeCity}, ${task.alternativeCountry}</div>`;
    html += `<div class="alternative-detail"><strong>Full Address:</strong> ${task.alternativeAddress}</div>`;
    html += `<div class="alternative-detail"><strong>Reason:</strong> ${task.reason}</div>`;
    if (task.alternativeGeometry && task.alternativeGeometry.coordinates) {
      html += `<div class="alternative-detail"><strong>Coordinates:</strong> ${task.alternativeGeometry.coordinates[1].toFixed(4)}, ${task.alternativeGeometry.coordinates[0].toFixed(4)}</div>`;
    }
    html += '</div>';
    html += '</div>';
    
    html += '</div>';
  });
  
  tripDetails.innerHTML = html;
}

// Create marker style
function getMarkerStyle(index, isStart = false) {
  return new ol.style.Style({
    image: new ol.style.Circle({
      radius: 12,
      fill: new ol.style.Fill({
        color: isStart ? '#51cf66' : '#667eea',
      }),
      stroke: new ol.style.Stroke({
        color: 'white',
        width: 2,
      }),
    }),
    text: new ol.style.Text({
      text: isStart ? '🚩' : String(index),
      fill: new ol.style.Fill({
        color: 'white',
      }),
      font: 'bold 12px Arial',
      offsetY: -15,
    }),
  });
}

// Plot features on map
function plotFeatures(data) {
  vectorSource.clear();
  
  if (!data.features || data.features.length === 0) {
    showMessage('No features found in the response', 'error');
    return;
  }
  
  const coordinates = [];
  
  data.features.forEach((feature, index) => {
    const task = feature.properties;
    const coordinates_ll = feature.geometry.coordinates;
    
    // Plot main location
    const mainFeature = new ol.Feature({
      geometry: new ol.geom.Point(ol.proj.fromLonLat(coordinates_ll)),
      ...task,
    });
    
    mainFeature.setStyle(getMarkerStyle(index + 1, index === 0));
    vectorSource.addFeature(mainFeature);
    coordinates.push(coordinates_ll);
    
    // Plot alternative location if available
    if (task.alternativeGeometry && task.alternativeGeometry.coordinates) {
      const altFeature = new ol.Feature({
        geometry: new ol.geom.Point(ol.proj.fromLonLat(task.alternativeGeometry.coordinates)),
        ...task,
      });
      
      altFeature.setStyle(
        new ol.style.Style({
          image: new ol.style.Circle({
            radius: 8,
            fill: new ol.style.Fill({
              color: '#ffa94d',
            }),
            stroke: new ol.style.Stroke({
              color: 'white',
              width: 1,
            }),
          }),
          text: new ol.style.Text({
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
  let query = queryInput.value.trim();
  
  if (!query) {
    showMessage('Please enter a query', 'error');
    return;
  }
  
  // Add current location to query if available
  if (currentLocation) {
    const { latitude, longitude } = currentLocation;
    query = `My current location is at ${latitude.toFixed(4)}, ${longitude.toFixed(4)}. ${query}`;
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
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error('Error planning trip:', error);
    showMessage(`Error: ${errorMsg}`, 'error');
  } finally {
    submitBtn.disabled = false;
    loadingDiv.classList.add('hidden');
  }
}

// Toggle alternative details
function toggleAlternative(button) {
  const content = button.nextElementSibling;
  const icon = button.querySelector('.toggle-icon');
  
  content.classList.toggle('hidden');
  icon.textContent = content.classList.contains('hidden') ? '▶' : '▼';
}

// Get current location
function getCurrentLocation() {
  if (!navigator.geolocation) {
    showMessage('Geolocation is not supported by your browser', 'error');
    return;
  }

  locationBtn.classList.add('loading');
  locationBtn.disabled = true;

  navigator.geolocation.getCurrentPosition(
    (position) => {
      const { latitude, longitude } = position.coords;
      currentLocation = { latitude, longitude };
      
      // Add coordinates to query input
      const query = queryInput.value.trim();
      const newQuery = query 
        ? `${query} near ${longitude},${latitude}`
        : `I need to nearby ${longitude},${latitude}`;
      
      queryInput.value = newQuery;
      queryInput.focus();
      
      showMessage(`📍 Location found: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`, 'success');
      locationBtn.classList.remove('loading');
      locationBtn.disabled = false;
    },
    (error) => {
      let errorMsg = 'Unable to get your location';
      
      switch (error.code) {
        case error.PERMISSION_DENIED:
          errorMsg = 'Location permission denied. Please enable it in your browser settings.';
          break;
        case error.POSITION_UNAVAILABLE:
          errorMsg = 'Location information is unavailable.';
          break;
        case error.TIMEOUT:
          errorMsg = 'The request to get user location timed out.';
          break;
      }
      
      showMessage(errorMsg, 'error');
      locationBtn.classList.remove('loading');
      locationBtn.disabled = false;
    },
    {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0
    }
  );
}

// Event delegation for toggle buttons
tripDetails.addEventListener('click', (e) => {
  if (e.target.closest('.alternative-toggle')) {
    const button = e.target.closest('.alternative-toggle');
    toggleAlternative(button);
  }
});

// Event listeners
locationBtn.addEventListener('click', getCurrentLocation);
submitBtn.addEventListener('click', planTrip);
queryInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    planTrip();
  }
});

// Resize listener to update sidebar position
window.addEventListener('resize', updateSidebarPosition);

// Initial setup
updateSidebarPosition();
queryInput.focus();

console.log('Trip Planner Frontend loaded successfully!');
console.log(`API endpoint: ${API_URL}`);
