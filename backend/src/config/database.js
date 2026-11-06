import pg from 'pg';
import { config } from './env.js';

const { Pool } = pg;
const hasDiscreteCredentials = Boolean(config.databaseUser && config.databasePassword);
export const pool = config.databaseUrl || hasDiscreteCredentials
  ? new Pool({
      ...(config.databaseUrl ? { connectionString: config.databaseUrl } : {
        host: config.databaseHost,
        port: config.databasePort,
        database: config.databaseName,
        user: config.databaseUser,
        password: config.databasePassword,
      }),
      max: config.poolMax,
      idleTimeoutMillis: config.poolIdleTimeoutMs,
      connectionTimeoutMillis: config.poolConnectionTimeoutMs,
      ssl: config.databaseSsl ? { rejectUnauthorized: false } : undefined,
    })
  : null;

export function requirePool() {
  if (!pool) {
    const error = new Error('Database is not configured');
    error.code = 'DATABASE_NOT_CONFIGURED';
    throw error;
  }
  return pool;
}

export async function checkConnection(targetPool = pool) {
  if (!targetPool || config.databaseUser === 'your_database_user') {
    return { connected: true, status: 'not_configured' };
  }
  try {
    await targetPool.query('SELECT 1');
    return { connected: true, status: 'connected' };
  } catch (error) {
    return { connected: false, status: 'disconnected', error };
  }
}

export const database = {
  pool,
  requirePool,
  checkConnection,
};

export default database;
