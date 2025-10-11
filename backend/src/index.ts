import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import generatePhraseRouter from './routes/generate-phrase.js';
import generateCasualPhraseRouter from './routes/generate-casual-phrase.js';
import translatePhraseRouter from './routes/translate-phrase.js';
import testModelsRouter from './routes/test-models.js';
import generatePhraseFromStructureRouter from './routes/generate-phrase-from-structure.js';
import { costTracker } from './services/cost-tracker.js';
// Email temporarily disabled for simplicity
// import { emailNotifier } from './services/email-notifier.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = parseInt(process.env.PORT || '3001', 10);

// Middleware
app.use(cors());
app.use(express.json());

// Request logging middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`${req.method} ${req.path} ${res.statusCode} - ${duration}ms`);
  });
  next();
});

// Routes
app.use('/api', generatePhraseRouter);
app.use('/api', generateCasualPhraseRouter);
app.use('/api', translatePhraseRouter);
app.use('/api', testModelsRouter);
app.use('/api', generatePhraseFromStructureRouter);

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Test POST endpoint
app.post('/api/test-echo', (req: Request, res: Response) => {
  console.log('🧪 TEST ECHO endpoint hit!');
  console.log('🧪 Request body:', JSON.stringify(req.body, null, 2));
  res.status(200).json({
    message: 'Echo successful',
    received: req.body,
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: err.message,
  });
});

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: 'Not found' });
});

// Initialize services and start server
async function startServer() {
  try {
    // Initialize cost tracker
    await costTracker.initialize();
    console.log('Cost tracker initialized');

    // Email temporarily disabled for simplicity
    // await emailNotifier.initialize();
    // console.log('Email notifier initialized');

    // Start server - bind to 0.0.0.0 to allow connections from proxy
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Backend server running on http://0.0.0.0:${PORT}`);
      console.log(`Accessible on localhost:${PORT} and 127.0.0.1:${PORT}`);
      console.log(`Health check: http://localhost:${PORT}/health`);
      console.log(`Test echo: POST http://localhost:${PORT}/api/test-echo`);
      console.log(`Generate standardized phrase: POST http://localhost:${PORT}/api/generate-phrase`);
      console.log(`Generate casual phrase: POST http://localhost:${PORT}/api/generate-casual-phrase`);
      console.log(`Translate phrase: POST http://localhost:${PORT}/api/translate-phrase`);
      console.log(`Test models: POST http://localhost:${PORT}/api/test-models`);
      console.log(`Generate phrase from structure: POST http://localhost:${PORT}/api/generate-phrase-from-structure`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();

export default app;
