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
