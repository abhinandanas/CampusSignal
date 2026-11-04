import { pool } from '../config/database.js';

export function createHealthController(databasePool = pool) {
  return async function health(_req, res) {
    let database = 'disconnected';
    if (databasePool) {
      try { await databasePool.query('SELECT 1'); database = 'connected'; } catch { /* report degraded status */ }
    }
    const healthy = database === 'connected';
    res.status(200).json({
      status: healthy ? 'success' : 'degraded',
      message: healthy ? 'CampusSignal API is running' : 'CampusSignal API is running but database is unreachable',
      data: { service: 'CampusSignal API', uptime: process.uptime(), timestamp: new Date().toISOString(), database },
    });
  };
}
