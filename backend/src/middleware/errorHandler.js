export function errorHandler(error, _req, res, _next) {
  if (res.headersSent) return;
  const status = error.status === 400 || error.type === 'entity.parse.failed' ? 400 : 500;
  res.status(status).json({ status: 'error', message: status === 400 ? 'Invalid request' : 'Internal server error', details: null });
}
