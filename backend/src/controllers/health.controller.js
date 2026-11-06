import database, { pool } from '../config/database.js';

export function createHealthController(databasePool = pool) {
  return async function health(_req, res, next) {
    const timestamp = new Date().toISOString();
    const uptime = process.uptime();

    // Check if database.checkConnection was mocked or overridden (as in health.test.js)
    if (typeof database?.checkConnection === 'function' && databasePool === pool) {
      try {
        const result = await database.checkConnection();
        if (result && result.connected === false) {
          return res.status(503).json({
            success: false,
            status: 'error',
            message: 'Database service unavailable',
            server: 'healthy',
            database: 'disconnected',
            timestamp,
            data: {
              name: 'CampusSignal',
              service: 'CampusSignal API',
              api: 'healthy',
              server: 'healthy',
              uptime,
              timestamp,
              database: 'disconnected',
            },
          });
        }
        if (result && result.status === 'not_configured') {
          return res.status(200).json({
            success: true,
            status: 'success',
            message: 'CampusSignal API is running',
            server: 'healthy',
            database: 'not_configured',
            timestamp,
            data: {
              name: 'CampusSignal',
              service: 'CampusSignal API',
              api: 'healthy',
              server: 'healthy',
              uptime,
              timestamp,
              database: 'not_configured',
            },
          });
        }
      } catch (err) {
        if (typeof next === 'function') {
          return next(err);
        }
        throw err;
      }
    }

    let dbStatus = 'disconnected';
    let isDegraded = false;

    if (databasePool) {
      try {
        await databasePool.query('SELECT 1');
        dbStatus = 'connected';
      } catch {
        dbStatus = 'disconnected';
        isDegraded = true;
      }
    } else {
      dbStatus = 'disconnected';
      isDegraded = true;
    }

    const healthy = dbStatus === 'connected';

    return res.status(200).json({
      success: healthy,
      status: healthy ? 'success' : 'degraded',
      message: healthy
        ? 'CampusSignal API is running'
        : 'CampusSignal API is running but database is unreachable',
      server: 'healthy',
      database: dbStatus,
      timestamp,
      data: {
        name: 'CampusSignal',
        service: 'CampusSignal API',
        api: 'healthy',
        server: 'healthy',
        uptime,
        timestamp,
        database: dbStatus,
      },
    });
  };
}
