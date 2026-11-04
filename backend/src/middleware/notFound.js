// backend/src/middleware/notFound.js
/**
 * 404 Route-Not-Found Middleware
 * Catches any request that does not match a registered route and sends
 * a standardized JSON error response.
 */
function notFound(req, res, next) {
  const message = `Resource not found: ${req.method} ${req.originalUrl}`;
  res.status(404).json({
    status: 'error',
    error: {
      status: 404,
      message
    },
    message,
    details: null
  });
}

module.exports = notFound;
