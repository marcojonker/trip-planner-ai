# Frontend - Trip Planner AI Web Application

An Angular web application providing an interactive interface for AI-powered trip planning with a real-time map and detailed trip information.

## 📁 Structure

```
src/
├── app/
│   ├── app.component.ts          # Root component
│   ├── app.component.html        # Root template
│   ├── app.component.css         # Root styles
│   ├── services/
│   │   ├── trip-planner.service.ts   # API communication
│   │   └── geolocation.service.ts    # Browser geolocation
│   └── components/
│       ├── query-box/            # Query input component
│       │   ├── query-box.component.ts
│       │   ├── query-box.component.html
│       │   └── query-box.component.css
│       ├── map/                  # OpenLayers map component
│       │   ├── map.component.ts
│       │   ├── map.component.html
│       │   └── map.component.css
│       └── trip-details/         # Trip details sidebar
│           ├── trip-details.component.ts
│           ├── trip-details.component.html
│           └── trip-details.component.css
├── environments/
│   ├── environment.ts            # Development config
│   └── environment.prod.ts       # Production config
├── main.ts                       # Angular bootstrap
├── styles.css                    # Global styles
└── index.html                    # HTML entry point
```

## 🚀 Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Or just start
npm run start

# Build for production
npm run build

# Run tests
npm run test

# Lint code
npm run lint
```

## 🔧 Configuration

Environment configuration is in `src/environments/`:

**Development** (`environment.ts`):
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3001/api'
};
```

**Production** (`environment.prod.ts`):
```typescript
export const environment = {
  production: true,
  apiUrl: '/api'
};
```

## 📡 API Integration

The frontend communicates with the backend via `TripPlannerService`:

```typescript
// Example usage
this.tripPlannerService.planTrip(query).subscribe({
  next: (response) => {
    // Handle trip data
  },
  error: (error) => {
    // Handle error
  }
});
```

## 🎨 Components

### AppComponent
- **Root component** of the application
- Manages global state and error/success messages
- Handles query submission and geolocation
- Coordinates communication between child components

### QueryBoxComponent
- **Query input** and location button
- Injects geolocation context into queries
- Shows loading state during planning
- Dynamic location button styling when location is available

**Template**: Query input + ⊙ location button + Plan Trip button

### MapComponent
- **OpenLayers map** with OpenStreetMap tiles
- Displays trip markers with numbered icons
- Auto-fits view to all markers
- Shows loading overlay during planning
- Responsive map resizing

**Features**:
- Zoom to fit all locations
- Color-coded markers
- Numbered position indicators
- Loading spinner

### TripDetailsComponent
- **Sidebar** with trip information
- Expandable alternative location cards
- Dynamic positioning based on header height
- Displays:
  - Location name and task
  - Distance to location
  - Full address and coordinates
  - Opening hours
  - Reason for selection
  - Alternative location with same info

## 🌙 Styling

### Dark Theme Colors
- **Background**: `#0a0e27` (deep navy)
- **Card Background**: `#151c35` (darker navy)
- **Header Background**: `#0f1428` (header navy)
- **Accent Color**: `#4a90e2` (bright blue)
- **Text**: `#e0e0e0` (light gray)
- **Secondary Text**: `#a0a0a0` (medium gray)

### Animations
- **pulse**: Location button pulse animation when location is active
- **spin**: Loading spinner rotation
- **slideDown**: Message slide-in animation
- **Expandable cards**: Smooth height animation

## 🎯 Features

### Query Box
✅ Text input for trip queries  
✅ Location button with geolocation  
✅ Smart location context injection  
✅ Loading state indication  
✅ Enter key submission  

### Map
✅ Real-time marker display  
✅ Auto-zoom to all locations  
✅ Color-coded markers  
✅ OpenStreetMap tiles  
✅ Responsive resizing  

### Trip Details
✅ Numbered location cards  
✅ Distance display (km/m)  
✅ Address and coordinates  
✅ Opening hours  
✅ Location selection reason  
✅ Expandable alternative locations  
✅ Dynamic sidebar positioning  

### Geolocation
✅ Browser geolocation API  
✅ High accuracy positioning  
✅ 10-second timeout  
✅ Error handling with feedback  
✅ Visual indicator when active  

## 🔄 Data Flow

```
User Input
    ↓
QueryBoxComponent (captures query)
    ↓
AppComponent (calls planTrip service)
    ↓
TripPlannerService (HTTP POST to backend)
    ↓
Backend API (/api/plan-trip)
    ↓
AppComponent (receives GeoJSON)
    ↓
MapComponent (renders markers)
TripDetailsComponent (renders details)
```

## 📦 Dependencies

- **@angular/core** 18 - Angular framework
- **@angular/common** 18 - Common utilities
- **@angular/forms** 18 - Form handling
- **@angular/platform-browser** 18 - Browser API
- **@angular/platform-browser-dynamic** 18 - Bootstrap
- **ol** 9.1.0 - OpenLayers map library
- **rxjs** 7.8.0 - Reactive programming
- **zone.js** 0.14.0 - Angular zone management

## 🧪 Testing

```bash
# Run unit tests
npm run test

# Run with coverage
ng test --code-coverage

# Run E2E tests
ng e2e
```

## 🏗️ Building for Production

```bash
# Development build (unoptimized)
npm run build

# Production build (optimized, minified)
npm run build:prod

# Output in dist/frontend/
ls -la dist/frontend/
```

**Build Optimization**:
- Tree-shaking
- Minification
- Compression
- Source map generation
- AOT compilation

## 🌐 Responsive Design

### Desktop (1024px+)
- Query box and controls in header
- Map takes 70% width
- Sidebar (350px) on right
- Expandable trip details

### Tablet (768px - 1024px)
- Narrower sidebar (300px)
- Adjusted spacing

### Mobile (<768px)
- Full-width sidebar below map
- Stacked query controls
- Touch-friendly buttons
- Single column layout

## 🐛 Troubleshooting

### Can't connect to backend
- **Error**: "Failed to plan trip"
- **Solution**: Ensure backend is running on http://localhost:3001
- **Check**: Network tab in browser DevTools for API errors

### Geolocation not working
- **Error**: "Unable to get your current location"
- **Solution**: 
  - Check browser permissions
  - HTTPS required in production
  - Allow location access when prompted

### Map not displaying
- **Error**: Blank map area
- **Solution**:
  - Check browser console for errors
  - Verify OpenLayers CDN connection
  - Clear browser cache

### Styling issues
- **Error**: Colors look wrong or layout broken
- **Solution**:
  - Check `src/styles.css` is loaded
  - Verify component CSS files exist
  - Clear browser cache and rebuild

## 🔐 Security

- ✅ Content Security Policy ready
- ✅ XSS protection with Angular sanitization
- ✅ CSRF protection ready
- ✅ Secure HTTP headers for production
- ✅ No secrets in frontend code

## 🚀 Deployment

### Static Site Hosting
```bash
# Build production bundle
npm run build:prod

# Deploy dist/frontend/ to:
# - Netlify
# - Vercel
# - GitHub Pages
# - S3 + CloudFront
# - Any static hosting
```

### With Backend
```bash
# Backend serves frontend
# Put dist/frontend/ contents in backend public/
# Configure backend for SPA routing
```

## 📚 Resources

- [Angular Documentation](https://angular.io/docs)
- [OpenLayers Guide](https://openlayers.org/)
- [RxJS Documentation](https://rxjs.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

## 🎨 Customization

### Change Theme Colors
Edit `src/styles.css` and component `.css` files:
```css
--primary-bg: #0a0e27;
--accent-color: #4a90e2;
--text-color: #e0e0e0;
```

### Modify Map Provider
Change in `map.component.ts`:
```typescript
new TileLayer({
  source: new OSM()  // Use different source here
})
```

### Adjust Sidebar Width
Change in `trip-details.component.css`:
```css
.trip-details-sidebar {
  width: 350px;  /* Modify here */
}
```

## 📝 License

ISC
