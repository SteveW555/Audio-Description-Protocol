import { Request, Response, NextFunction } from 'express';

/**
 * Logger middleware
 * Logs requests (method, path, body) and responses (status, duration)
 */
export function logger(req: Request, res: Response, next: NextFunction) {
  const start = Date.now();

  // Log request
  console.log('Request:', {
    method: req.method,
    path: req.path,
    body: req.method === 'POST' ? req.body : undefined,
    timestamp: new Date().toISOString(),
  });

  // Log response on finish
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log('Response:', {
      method: req.method,
      path: req.path,
      status: res.statusCode,
      duration: `${duration}ms`,
      timestamp: new Date().toISOString(),
    });
  });

  next();
}
