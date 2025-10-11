import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import cors from "cors";
import http from "http";

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

// Simple manual proxy to backend
app.use('/api', (req, res) => {
  const targetPath = `/api${req.url}`;
  console.log(`🔄 Proxying ${req.method} ${targetPath} to ${backendUrl}${targetPath}`);

  const options = {
    hostname: 'localhost',
    port: backendPort,
    path: targetPath,
    method: req.method,
    headers: {
      ...req.headers,
      host: `localhost:${backendPort}`
    },
    timeout: 300000 // 5 minutes
  };

  const proxyReq = http.request(options, (proxyRes) => {
    console.log(`✅ Proxy response ${proxyRes.statusCode} for ${req.method} ${targetPath}`);

    // Forward status code
    res.status(proxyRes.statusCode);

    // Forward headers
    Object.keys(proxyRes.headers).forEach(key => {
      res.setHeader(key, proxyRes.headers[key]);
    });

    // Forward response body
    proxyRes.pipe(res);
  });

  proxyReq.on('error', (err) => {
    console.error('❌ Proxy error:', err.message);
    console.error('❌ Error code:', err.code);
    console.error('❌ Request:', req.method, targetPath);
    if (!res.headersSent) {
      res.status(500).json({
        error: 'Backend service unavailable',
        details: err.message,
        code: err.code
      });
    }
  });

  proxyReq.on('timeout', () => {
    console.error('⏱️ Proxy timeout for:', req.method, targetPath);
    proxyReq.destroy();
    if (!res.headersSent) {
      res.status(504).json({ error: 'Gateway timeout' });
    }
  });

  // Forward request body for POST/PUT/PATCH
  if (req.body && Object.keys(req.body).length > 0) {
    const bodyData = JSON.stringify(req.body);
    proxyReq.setHeader('Content-Type', 'application/json');
    proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
    proxyReq.write(bodyData);
  }

  proxyReq.end();
});

// Serve static files from wizard/dist
app.use(express.static(distDir));

// SPA fallback - serve index.html for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(distDir, 'index.html'));
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Unified server listening on port ${port}`);
  console.log(`Proxying /api requests to ${backendUrl}/api`);
});
