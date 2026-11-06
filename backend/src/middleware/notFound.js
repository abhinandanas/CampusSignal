/**
 * CampusSignal — 404 Not Found Middleware
 * Handles unknown routes and returns a structured JSON error response.
 */
export function notFound(req, res) {
  const method = req?.method || 'GET';
  const path = req?.originalUrl || req?.url || 'requested route';
  const message = `Resource not found: ${method} ${path}`;

  return res.status(404).json({
    success: false,
    status: 'error',
    error: {
      status: 404,
      message,
    },
    message,
    details: null,
  });
}
