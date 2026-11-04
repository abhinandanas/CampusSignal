/** CampusSignal PostgreSQL pool and connection helpers. */

import pg from 'pg';
import { config } from './env.js';

const { Pool } = pg;
const dbConfig = config.database;

export const pool = new Pool({
  ...(dbConfig.connectionString
    ? { connectionString: dbConfig.connectionString }
    : {
        host: dbConfig.host,
        port: dbConfig.port,
        database: dbConfig.database,
        user: dbConfig.user || undefined,
        password: dbConfig.password || undefined,
      }),
  max: dbConfig.max,
  idleTimeoutMillis: dbConfig.idleTimeoutMillis,
  connectionTimeoutMillis: dbConfig.connectionTimeoutMillis,
});

pool.on('error', (error) => {
  console.error(`[Database Pool] Unexpected client error${error.code ? ` (${error.code})` : ''}.`);
});

/** Run a parameterized query using the shared pool. */
export async function query(text, params = []) {
  return pool.query(text, params);
}

function connectionErrorMessage(error) {
  switch (error.code) {
    case 'ECONNREFUSED':
      return 'Could not reach PostgreSQL. Check that the service is running and DB_HOST/DB_PORT are correct.';
    case '28P01':
      return 'PostgreSQL rejected the credentials. Check DB_USER and DB_PASSWORD in backend/.env.';
    case '3D000':
      return 'The configured PostgreSQL database does not exist. Create it before starting the backend.';
    case 'ETIMEDOUT':
      return 'The PostgreSQL connection timed out. Check the service and DB_HOST/DB_PORT.';
    default:
      return 'Could not connect to PostgreSQL. Check the backend configuration and PostgreSQL service.';
  }
}

/** Check database configuration and connectivity without exposing secrets. */
export async function testConnection() {
  if (!dbConfig.isConfigured) {
    return { ok: false, error: 'Database credentials are not configured. Set DATABASE_URL or DB_* values in backend/.env.' };
  }

  try {
    const result = await pool.query('SELECT NOW() AS current_time, current_database() AS db_name;');
    return {
      ok: true,
      database: result.rows[0].db_name,
      time: result.rows[0].current_time,
    };
  } catch (error) {
    const message = connectionErrorMessage(error);
    console.error(`[Database] Connection check failed${error.code ? ` (${error.code})` : ''}: ${message}`);
    return { ok: false, error: message };
  }
}

// Compatibility shape for callers that consume the earlier health-check API.
export async function checkConnection() {
  const result = await testConnection();
  return {
    connected: result.ok,
    status: result.ok ? 'connected' : (dbConfig.isConfigured ? 'disconnected' : 'not_configured'),
    ...(result.error ? { error: result.error } : {}),
  };
}

/** Gracefully close the shared connection pool. */
export async function closePool() {
  await pool.end();
}

export default pool;
