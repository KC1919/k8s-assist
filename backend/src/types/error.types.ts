interface ErrorWithStatus extends Error {
  status?: number;
  statusCode?: number;
  details?: unknown;
}

export default ErrorWithStatus;