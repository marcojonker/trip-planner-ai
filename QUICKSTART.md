# Quick Start Guide

## 🚀 Get Started in 3 Steps

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Set Up Environment
Create a `.env` file in the project root:
```env
GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
OPENAI_API_KEY=your_openai_api_key_here
PORT=3001
```

### Step 3: Start the Application
```bash
npm run api
```

Then open your browser and go to: **http://localhost:3001**

---

## 📍 Using the Application

1. **Type your query** in the text box at the top
   - Example: "I want to buy shoes and bread near 51.6010502,5.6087735"

2. **Press Enter or click "Plan Trip"**
   - The AI will process your request

3. **View results**:
   - 🗺️ **Map** shows all planned locations
   - 📋 **Sidebar** displays trip details
   - Click markers to view location information

---

## 🎨 Map Legend

- 🚩 **Green marker** = Start location
- 🔵 **Blue numbered markers** = Destination order
- ⭐ **Orange markers** = Alternative locations
- Click any marker to see details

---

## 📚 API Examples

### Using cURL
```bash
curl -X POST http://localhost:3001/api/plan-trip \
  -H "Content-Type: application/json" \
  -d '{
    "query": "I want to buy shoes and bread near 51.6010502,5.6087735"
  }'
```

### Using JavaScript
```javascript
const response = await fetch('http://localhost:3001/api/plan-trip', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    query: 'I want to buy shoes and bread near 51.6010502,5.6087735'
  })
});

const result = await response.json();
console.log(result.data); // GeoJSON FeatureCollection
```

---

## 🔧 Troubleshooting

### Port 3001 Already in Use?
```bash
PORT=3002 npm run api
```

### No API Key?
Get your free API keys:
- **Google Maps**: https://developers.google.com/maps/documentation/javascript
- **OpenAI**: https://platform.openai.com/api-keys

### API Not Responding?
Check the health endpoint:
```bash
curl http://localhost:3001/health
```

---

## 📖 Documentation

- Full API docs: [API.md](API.md)
- Frontend details: [FRONTEND.md](FRONTEND.md)
- View API endpoints at: http://localhost:3001/api/docs

---

## 💡 Example Queries

```
"I want to buy shoes specially designed for hallux valgus for fashionable people and I need to buy a bread nearby 51.6010502,5.6087735"

"Show me coffee shops and restaurants near 52.3676,4.9041 Amsterdam"

"Find a pharmacy and grocery store near 48.8566,2.3522 Paris"

"I need to visit a bank and post office near 40.7128,-74.0060 New York"
```

---

**Happy Trip Planning! 🎉**
