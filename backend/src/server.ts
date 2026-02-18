import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { TripPlannerAiWorkflow } from './workflows/trip-planner.ai-workflow';
import { TaskFeatureCollection } from './models/task-feature-collection.model';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:4200';

// Middleware
app.use(cors({
  origin: FRONTEND_URL,
  credentials: true,
  optionsSuccessStatus: 200
}));
app.use(express.json());

// Initialize workflow
const workflow = TripPlannerAiWorkflow.createAiWorkflow();

// Request logging middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Main trip planner endpoint
app.post('/api/plan-trip', async (req: Request, res: Response) => {
  try {
    const { query } = req.body;

    if (!query) {
      return res.status(400).json({
        error: 'Missing required field: query',
        message: 'Please provide a query describing your trip planning needs'
      });
    }

    if (typeof query !== 'string') {
      return res.status(400).json({
        error: 'Invalid query format',
        message: 'Query must be a string'
      });
    }

    console.log(`Processing trip planning request: ${query.substring(0, 100)}...`);

    const result = await workflow.ask(query) as TaskFeatureCollection | string;

    if (typeof result === 'string') {
      return res.status(400).json({
        error: 'Workflow error',
        message: result
      });
    }

    res.status(200).json({
      success: true,
      data: result,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error processing trip planning request:', errorMessage);
    
    res.status(500).json({
      error: 'Internal server error',
      message: errorMessage,
      timestamp: new Date().toISOString()
    });
  }
});

// Get API documentation
app.get('/api/docs', (req: Request, res: Response) => {
  res.status(200).json({
    name: 'Trip Planner AI API',
    version: '1.0.0',
    description: 'AI-powered trip planning service',
    endpoints: [
      {
        path: '/health',
        method: 'GET',
        description: 'Health check endpoint',
        response: { status: 'ok', timestamp: 'ISO8601' }
      },
      {
        path: '/api/plan-trip',
        method: 'POST',
        description: 'Plan a trip based on natural language query',
        requestBody: {
          query: 'string (required) - Natural language description of what you need to do and location coordinates'
        },
        example: {
          query: 'I want to buy shoes specially designed for hallux valgus for fashionable people and I need to buy a bread nearby 51.6010502,5.6087735'
        },
        response: {
          success: 'boolean',
          data: 'GeoJSON FeatureCollection with planned locations and tasks',
          timestamp: 'ISO8601'
        }
      },
      {
        path: '/api/docs',
        method: 'GET',
        description: 'API documentation',
        response: 'This documentation object'
      }
    ]
  });
});

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    error: 'Not found',
    message: `The requested endpoint ${req.path} does not exist`,
    hint: 'Try GET /api/docs for documentation'
  });
});

// Error handler middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: err.message || 'An unexpected error occurred',
    timestamp: new Date().toISOString()
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Trip Planner AI API Server running on http://localhost:${PORT}`);
  console.log(`📚 API documentation at http://localhost:${PORT}/api/docs`);
  console.log(`🔗 Connected to frontend at ${FRONTEND_URL}`);
});
