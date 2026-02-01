# Trip Planner AI - Frontend & Backend

A complete web application for AI-powered trip planning with an interactive OpenLayers map interface.

## Overview

- **Backend**: Express.js REST API with OpenAI agents for intelligent trip planning
- **Frontend**: Modern web interface with OpenLayers map and OpenStreetMap tiles
- **Workflow**: Uses AI to understand natural language queries and find optimal locations

## Project Structure

```
.
├── api.ts                              # Express.js backend server
├── frontend.js                         # Frontend application (vanilla JavaScript)
├── frontend.ts                         # Frontend TypeScript source (optional)
├── index.html                          # Frontend HTML
├── styles.css                          # Frontend styling
├── app.ts                              # CLI entry point
├── package.json                        # Dependencies and scripts
├── models/
│   ├── task-feature-collection.model.ts    # Data models
│   └── task-feature-collection.schema.ts   # Zod schemas
├── workflows/
│   └── trip-planner.ai-workflow.ts     # AI workflow logic
├── tools/
│   ├── ai-tools.interface.ts
│   ├── google.ai-tools.ts              # Google Maps integration
│   └── trip-planner.ai-tools.ts
├── services/
│   └── google-maps.service.ts
└── guardrails/
    ├── ai-guardrails.interface.ts
    └── trip-planner.ai-guardrails.ts
```

## Installation

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Configure environment variables**:
   Create a `.env` file in the project root:
   ```env
   GOOGLE_MAPS_API_KEY=your_google_maps_api_key
   OPENAI_API_KEY=your_openai_api_key
   PORT=3001
   ```

## Running the Application

### Start the API with Frontend

```bash
npm run api
```

The application will be available at:
- 🌐 **Frontend**: `http://localhost:3001`
- 🔌 **API**: `http://localhost:3001/api/plan-trip`
- 📚 **Docs**: `http://localhost:3001/api/docs`

### Run CLI Version

```bash
npm start
```

## API Endpoints

### POST `/api/plan-trip`

Plan a trip based on natural language query.

**Request**:
```bash
curl -X POST http://localhost:3001/api/plan-trip \
  -H "Content-Type: application/json" \
  -d '{
    "query": "I want to buy shoes and bread near 51.6010502,5.6087735"
  }'
```

**Response**:
```json
{
  "success": true,
  "data": {
    "type": "FeatureCollection",
    "features": [
      {
        "type": "Feature",
        "geometry": {
          "type": "Point",
          "coordinates": [5.6087735, 51.6010502]
        },
        "properties": {
          "task": "Buy specialized shoes",
          "name": "Shoe Store",
          "street": "Main Street",
          "houseNumber": 123,
          "city": "Amsterdam",
          "country": "Netherlands",
          "distance": 0.5,
          "reason": "Specializes in orthopedic footwear for hallux valgus",
          "openingHours": ["09:00-18:00", "09:00-18:00"],
          "alternativeStreet": "Secondary Street",
          "alternativeHouseNumber": 456,
          "alternativeCity": "Amsterdam",
          "alternativeCountry": "Netherlands",
          "alternativeAddress": "Secondary Street 456, Amsterdam",
          "alternativeGeometry": {
            "type": "Point",
            "coordinates": [5.61, 51.60]
          }
        }
      }
    ]
  },
  "timestamp": "2026-01-31T10:30:00.000Z"
}
```

### GET `/health`

Health check endpoint.

```bash
curl http://localhost:3001/health
```

### GET `/api/docs`

API documentation.

## Frontend Features

### Map
- **OpenLayers mapping library** with OpenStreetMap base layer
- **Interactive markers** for main locations and alternatives
- **Automatic map fitting** to show all planned locations
- **Click markers** to view location details

### Query Interface
- **Text input box** for natural language queries
- **Submit button** to plan trips
- **Enter key support** for quick submission
- **Loading indicator** during processing

### Results Display
- **Sidebar with trip details**:
  - Start location (🚩 green marker)
  - Ordered list of destinations
  - Distance from previous location
  - Reason for selection
  - Alternative location
- **Color-coded markers**:
  - 🚩 Green: Start location
  - 🔵 Blue: Primary destinations (numbered)
  - ⭐ Orange: Alternative locations

### Error Handling
- Validation for empty queries
- API error messages
- Network error handling
- Loading state management

## Usage Examples

### Example 1: Shopping Trip
```
Query: "I want to buy shoes specially designed for hallux valgus for fashionable people and I need to buy a bread nearby 51.6010502,5.6087735"
```

### Example 2: Amsterdam Sightseeing
```
Query: "I want to visit museums and get lunch near 52.3676,4.9041 in Amsterdam"
```

### Example 3: Local Services
```
Query: "I need to go to the pharmacy and post office near 51.5074,-0.1278 London"
```

## Development

### Build TypeScript
```bash
npm run build
```

### Development Mode
```bash
npm run dev
```

### Scripts Available
- `npm start` - Run CLI application
- `npm run api` - Start API server with frontend
- `npm run dev` - Build and run
- `npm run build` - Compile TypeScript
- `npm test` - Run tests (not configured yet)

## Technologies Used

### Backend
- **Express.js** - Web framework
- **TypeScript** - Type-safe JavaScript
- **OpenAI Agents** - AI orchestration
- **Zod** - Schema validation
- **CORS** - Cross-origin support
- **dotenv** - Environment configuration

### Frontend
- **OpenLayers** - Mapping library
- **OpenStreetMap** - Base map tiles
- **Vanilla JavaScript** - No framework overhead
- **CSS3** - Modern styling

### Services
- **Google Maps API** - Geocoding and routing
- **OpenAI API** - Language model

## API Error Responses

### Missing Query (400)
```json
{
  "error": "Missing required field: query",
  "message": "Please provide a query describing your trip planning needs"
}
```

### Invalid Query Format (400)
```json
{
  "error": "Invalid query format",
  "message": "Query must be a string"
}
```

### Server Error (500)
```json
{
  "error": "Internal server error",
  "message": "Detailed error message",
  "timestamp": "2026-01-31T10:30:00.000Z"
}
```

## Browser Compatibility

- Chrome/Chromium (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Requirements

- **Node.js**: 18+
- **npm**: 9+
- **Google Maps API Key** (for location services)
- **OpenAI API Key** (for AI features)

## Environment Variables

Create a `.env` file:

```env
# API Port (default: 3000)
PORT=3001

# Google Maps API Key
GOOGLE_MAPS_API_KEY=your_key_here

# OpenAI API Key
OPENAI_API_KEY=your_key_here
```

## Architecture

### Request Flow
1. User enters query in frontend
2. Frontend sends POST request to `/api/plan-trip`
3. Backend receives query and passes to AI workflow
4. AI workflow:
   - Resolves start location (coordinates or address)
   - Creates task list
   - Finds locations using Google Maps
   - Calculates distances
   - Orders by distance
5. Backend returns GeoJSON FeatureCollection
6. Frontend plots markers on map and displays details

### Data Flow
```
Frontend Input
    ↓
API Request (POST /api/plan-trip)
    ↓
AI Workflow
    ↓
Google Maps Service
    ↓
Task Planning
    ↓
GeoJSON Response
    ↓
Frontend Rendering (Map + Sidebar)
```

## Performance Considerations

- **Map Tiles**: Cached by browser
- **API Responses**: Single request per query
- **Markers**: Limited to planned locations (~10-20)
- **Styling**: CSS optimized for smooth animations

## Future Enhancements

- [ ] Route optimization with path visualization
- [ ] Distance matrix optimization
- [ ] User authentication
- [ ] Trip history and saved trips
- [ ] Multiple language support
- [ ] Mobile app version
- [ ] Real-time traffic integration
- [ ] User preferences and favorites
- [ ] Detailed directions and navigation
- [ ] Integration with booking services

## Troubleshooting

### Port Already in Use
```bash
PORT=3002 npm run api
```

### CORS Errors
Ensure the frontend URL matches the API's CORS configuration.

### Map Not Loading
- Check internet connection
- Verify OpenStreetMap tiles are accessible
- Check browser console for errors

### API Not Responding
- Verify API is running: `curl http://localhost:3001/health`
- Check Google Maps API key is valid
- Check OpenAI API key is valid
- Review console logs for errors

## License

ISC

## Author

Marco Jonker

---

**Last Updated**: January 31, 2026
