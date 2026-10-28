// backend/src/middleware/errorHandler.js
const env = require('../config/env');

/**
 * Centralized Error-Handling Middleware
 * Catches all unhandled errors passed to next(err) and formats a secure,
 * consistent JSON response.
 *
 * Rules:
 * 1. Handles malformed JSON body payloads from express.json() with HTTP 400.
 * 2. Handles database connection failures safely with HTTP 503 without leaking credentials.
 * 3. Uses meaningful HTTP status codes.
 * 4. Suppresses stack traces and sensitive internal error details in production.
 * 5. Logs useful diagnostic information during development.
 */
function errorHandler(err, req, res, next) {
  // If response headers have already been sent, delegate to default Express handler
  if (res.headersSent) {
    return next(err);
  }

  // 1. Handle JSON syntax errors thrown by express.json()
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({
      status: 'error',
      error: {
        status: 400,
        message: 'Invalid JSON payload received in request body'
      },
      message: 'Invalid JSON payload received in request body',
      details: null
    });
  }

  // 2. Handle database connection and networking errors safely
  const isDbConnectionError =
    err.code === 'ECONNREFUSED' ||
    err.code === 'ENOTFOUND' ||
    err.code === 'ETIMEDOUT' ||
    (typeof err.code === 'string' && err.code.startsWith('08')); // PostgreSQL class 08: connection exception

  if (isDbConnectionError) {
    if (env.NODE_ENV !== 'production') {
      console.error('[CampusSignal] Database connection error:', err.message);
    }

    return res.status(503).json({
      status: 'error',
      error: {
        status: 503,
        message: 'Database service is temporarily unavailable'
      },
      message: 'Database service is temporarily unavailable',
      details: null
    });
  }

  // 3. Determine status code (use custom status/statusCode if set, default to 500)
  const status = typeof err.status === 'number' ? err.status : (typeof err.statusCode === 'number' ? err.statusCode : 500);

  // 4. Log unexpected errors during development
  if (env.NODE_ENV !== 'production') {
    console.error(`[CampusSignal Error] [${req.method} ${req.originalUrl}] ${status}:`, err);
  }

  // 5. Sanitize messages in production for 500 internal server errors
  const isProduction = env.NODE_ENV === 'production';
  const clientMessage = isProduction && status === 500
    ? 'Internal server error'
    : (err.message || 'An unexpected error occurred');

  res.status(status).json({
    status: 'error',
    error: {
      status,
      message: clientMessage
    },
    message: clientMessage,
    details: isProduction ? null : (err.details || null)
  });
}

module.exports = errorHandler;
