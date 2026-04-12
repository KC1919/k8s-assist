import { Request, Response, NextFunction } from 'express';
import ErrorWithStatus from '../types/error.types';
import logger from '../utils/logger';

/**
 * Global error handling middleware for Express.
 * Converts thrown errors into JSON responses and logs details.
 */
export function errorHandler(
  err: ErrorWithStatus,
  req: Request,
  res: Response,
  next: NextFunction
) {
  const status = err.statusCode || err.status || 500;
  const responseBody: { message: string; details?: unknown } = {
    message: err.message || 'Internal Server Error',
  };

  if (process.env.NODE_ENV !== 'production' && err.details) {
    responseBody.details = err.details;
  }

  logger.error({
    message: err.message,
    status,
    stack: err.stack,
    details: err.details,
    path: req.originalUrl,
    method: req.method
  });

  res.status(status).json(responseBody);
}

/**
 * Catch-all handler for requests that do not match any route.
 */
export function notFoundHandler(req: Request, res: Response, next: NextFunction) {
  const error = new Error(`Cannot ${req.method} ${req.originalUrl}`) as ErrorWithStatus;
  error.statusCode = 404;
  next(error);
}
