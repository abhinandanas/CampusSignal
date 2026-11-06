import { config } from '../config/env.js';

/**
 * CampusSignal — Centralized Express Error Handling Middleware
 * Handles syntax errors, database disconnection errors, and unhandled server errors.
 * Ensures consistent JSON error responses and protects sensitive stack traces in production.
 */
export function errorHandler(error, _req, res, _next) {
  if (res?.headersSent) return;

  const isProduction = (process.env.NODE_ENV || config.nodeEnv) === 'production';

  // 1. JSON parse errors from body-parser
  if (error.status === 400 || error.type === 'entity.parse.failed') {
    return res.status(400).json({
      success: false,
      status: 'error',
      error: {
        status: 400,
        message: 'Invalid JSON payload received in request body',
      },
      message: 'Invalid JSON payload received in request body',
      details: null,
    });
  }

  // 2. Database connection and network errors
  const dbCodes = new Set(['ECONNREFUSED', 'ETIMEDOUT', 'ENOTFOUND', '08001', '08006', 'DATABASE_NOT_CONFIGURED']);
  if (dbCodes.has(error.code) || /connect ECONNREFUSED/i.test(error.message || '')) {
    return res.status(503).json({
      success: false,
      status: 'error',
      error: {
        status: 503,
        message: 'Database service is temporarily unavailable',
      },
      message: 'Database service is temporarily unavailable',
      details: null,
    });
  }

  // 3. Client operational errors with specific HTTP status codes
  const status = typeof error.status === 'number' && error.status >= 400 && error.status < 600
    ? error.status
    : 500;

  const safeMessage = status === 500
    ? 'Internal server error'
    : (error.message || 'An error occurred processing the request');

  return res.status(status).json({
    success: false,
    status: 'error',
    error: {
      status,
      message: safeMessage,
    },
    message: safeMessage,
    details: isProduction ? null : (error.details ?? null),
  });
}
