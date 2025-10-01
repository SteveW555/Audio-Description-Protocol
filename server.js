import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const rawPort = process.env.PORT;
const port = Number(rawPort) || 8080;
const distDir = path.join(__dirname, "wizard", "dist");

console.log(`Environment PORT=${rawPort}`);
console.log(`Serving static files from ${distDir}`);
console.log(`Dist exists: ${fs.existsSync(distDir)}`);

app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.url}`);
  next();
});

app.use(express.static(distDir));

app.get('*', (req, res) => {
  res.sendFile(path.join(distDir, 'index.html'));
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Wizard is listening on port ${port}`);
});
