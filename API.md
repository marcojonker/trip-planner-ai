# Trip Planner AI API

An Express.js API for the AI-powered Trip Planner application using OpenAI agents.

## Installation

```bash
npm install
```

## Running the API

Start the API server:

```bash
npm run api
```

The API will be available at `http://localhost:3000`

## Endpoints

### Health Check
- **GET** `/health`
- Returns server status

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2026-01-31T10:30:00.000Z"
}
```

### Plan Trip
- **POST** `/api/plan-trip`
- Plan a trip based on a natural language query

**Request Body:**
```json
{
  "query": "I want to buy shoes specially designed for hallux valgus for fashionable people and I need to buy a bread nearby 51.6010502,5.6087735"
}
```

**Response:**
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
          "reason": "Specializes in orthopedic footwear",
          "openingHours": ["09:00-18:00"],
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

### API Documentation
- **GET** `/api/docs`
- Returns full API documentation

## Environment Variables

Create a `.env` file in the project root:

```env
GOOGLE_MAPS_API_KEY=your_google_maps_api_key
PORT=3000
```

## Requirements

- Node.js 18+
- Google Maps API Key (for location services)
- OpenAI API Key (automatically handled via @openai/agents package)

## Project Structure

- `api.ts` - Express.js API server
- `app.ts` - CLI entry point
- `workflows/` - AI workflow definitions
- `models/` - Data models and schemas
- `services/` - External service integrations (Google Maps, etc.)
- `tools/` - AI tools and utilities
- `guardrails/` - AI input/output guardrails

## Usage Examples

### Using cURL

```bash
curl -X POST http://localhost:3000/api/plan-trip \
  -H "Content-Type: application/json" \
  -d '{"query": "I want to buy shoes and bread near 51.6010502,5.6087735"}'
```

### Using JavaScript/TypeScript

```typescript
const response = await fetch('http://localhost:3000/api/plan-trip', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    query: 'I want to buy shoes and bread near 51.6010502,5.6087735'
  })
});

const result = await response.json();
console.log(result.data);
```

### Using Python

```python
import requests

response = requests.post(
    'http://localhost:3000/api/plan-trip',
    json={'query': 'I want to buy shoes and bread near 51.6010502,5.6087735'}
)

print(response.json())
```

## Error Handling

The API returns appropriate HTTP status codes:
- `200` - Success
- `400` - Bad request (missing or invalid parameters)
- `404` - Endpoint not found
- `500` - Internal server error

Error responses include:
```json
{
  "error": "Error category",
  "message": "Detailed error message",
  "timestamp": "2026-01-31T10:30:00.000Z"
}
```

## Development

Run tests:
```bash
npm test
```

Build TypeScript:
```bash
npm run build
```

Run development mode (with watch):
```bash
npm run dev
```
