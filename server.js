import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import cors from "cors";
import { createProxyMiddleware } from 'http-proxy-middleware';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const rawPort = process.env.PORT;
const port = Number(rawPort) || 8080;
const distDir = path.join(__dirname, "wizard", "dist");
const backendPort = process.env.BACKEND_PORT || 3001;
const backendUrl = process.env.BACKEND_URL || `http://localhost:${backendPort}`;

console.log(`Environment PORT=${rawPort}`);
console.log(`Backend URL=${backendUrl}`);
console.log(`Serving static files from ${distDir}`);
console.log(`Dist exists: ${fs.existsSync(distDir)}`);
if (fs.existsSync(distDir)) {
  console.log(`Dist contents:`, fs.readdirSync(distDir));
}

// Enable CORS
app.use(cors());

// Parse JSON bodies
app.use(express.json());

// Request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.url}`);
  next();
});

// Proxy API requests to backend (running on different port)
app.use('/api', createProxyMiddleware({
  target: backendUrl,
  changeOrigin: true,
  logLevel: 'debug',
  timeout: 300000, // 5 minutes
  proxyTimeout: 300000, // 5 minutes
  onProxyReq: (proxyReq, req, res) => {
    console.log(`🔄 Proxying ${req.method} ${req.url} to ${backendUrl}${req.url}`);
  },
  onProxyRes: (proxyRes, req, res) => {
    console.log(`✅ Proxy response ${proxyRes.statusCode} for ${req.method} ${req.url}`);
  },
  onError: (err, req, res) => {
    console.error('❌ Proxy error:', err.message);
    console.error('❌ Error code:', err.code);
    console.error('❌ Request:', req.method, req.url);
    res.status(500).json({
      error: 'Backend service unavailable',
      details: err.message,
      code: err.code
    });
  }
}));

// Serve static files from wizard/dist
app.use(express.static(distDir));

// SPA fallback - serve index.html for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(distDir, 'index.html'));
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Unified server listening on port ${port}`);
  console.log(`Proxying /api requests to ${backendUrl}`);
});
