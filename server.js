import express from 'express';
import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from wizard/dist
app.use(express.static(path.join(__dirname, 'wizard', 'dist')));

// Start the Python FastAPI backend
const pythonProcess = spawn('uvicorn', [
  'adp_core.api.main:app',
  '--host', '0.0.0.0',
  '--port', '8000'
], {
  stdio: 'inherit'
});

// Proxy API requests to the Python backend
app.all('/api/*', async (req, res) => {
  const apiUrl = `http://localhost:8000${req.url}`;
  try {
    const response = await fetch(apiUrl, {
      method: req.method,
      headers: req.headers,
      body: req.method !== 'GET' && req.method !== 'HEAD' ? JSON.stringify(req.body) : undefined
    });
    const data = await response.text();
    res.status(response.status).send(data);
  } catch (error) {
    console.error('Proxy error:', error);
    res.status(500).send('API proxy error');
  }
});

// Serve index.html for all other routes (SPA fallback)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'wizard', 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Clean up on exit
process.on('SIGTERM', () => {
  pythonProcess.kill();
  process.exit(0);
});
