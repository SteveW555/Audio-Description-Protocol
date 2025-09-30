import { Request, Response, NextFunction } from 'express';

/**
 * Error handler middleware
 * Catches errors, logs context, and returns proper HTTP status
 */
export function errorHandler(
  err: Error | any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  // Log error with context
  console.error('Error occurred:', {
    message: err.message,
    stack: err.stack,
    method: req.method,
    path: req.path,
    body: req.body,
    timestamp: new Date().toISOString(),
  });

  // Determine status code
  const statusCode = err.statusCode || err.status || 500;

  // Send error response
  res.status(statusCode).json({
    error: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
}
