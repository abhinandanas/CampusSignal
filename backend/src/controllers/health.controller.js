import { checkConnection } from '../config/database.js';

/**
 * System Health Check Handler
 * GET /api/health
 *
 * Verifies that the API server is online and checks PostgreSQL connectivity
 * when database configuration is present.
 */
async function getHealth(req, res, next) {
  try {
    const dbCheck = await checkConnection();

    // If database is configured but disconnected, report degraded/error with 503
    const isDegraded = dbCheck.status === 'disconnected';
    const statusCode = isDegraded ? 503 : 200;

    const response = {
      status: isDegraded ? 'error' : 'success',
      data: {
        service: 'CampusSignal API',
        name: 'CampusSignal',
        api: 'healthy',
        uptime: Number(process.uptime().toFixed(2)),
        timestamp: new Date().toISOString(),
        database: dbCheck.status
      }
    };

    if (isDegraded) {
      response.message = 'Database service unavailable';
    }

    return res.status(statusCode).json(response);
  } catch (err) {
    next(err);
  }
}

export { getHealth };
export default { getHealth };
