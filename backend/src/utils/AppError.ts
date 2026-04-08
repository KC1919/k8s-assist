export class AppError extends Error {
    
  statusCode: number;
  details?: string | object;

  constructor(message: string, statusCode = 500, details?: unknown) {
    super();
    this.statusCode = statusCode;
    this.message = message;
    if (details) {
      this.details = details;
    }
    Error.captureStackTrace(this, this.constructor);
  }
}