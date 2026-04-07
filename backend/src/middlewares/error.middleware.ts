import { Request, Response, NextFunction } from 'express';
import ErrorWithStatus from '../types/error.types';

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

  res.status(status).json(responseBody);
}

export function notFoundHandler(req: Request, res: Response, next: NextFunction) {
  const error = new Error(`Cannot ${req.method} ${req.originalUrl}`) as ErrorWithStatus;
  error.statusCode = 404;
  next(error);
}
