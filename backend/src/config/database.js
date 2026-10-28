/**
 * CampusSignal — PostgreSQL Database Connection Pool
 * Purpose: Manages persistent connections to PostgreSQL using the pg driver
 */

import pkg from 'pg';
const { Pool } = pkg;
import { config } from './env.js';

const dbConfig = config.database;

export const pool = new Pool({
  host: dbConfig.host,
  port: dbConfig.port,
  database: dbConfig.database,
  user: dbConfig.user,
  password: dbConfig.password,
  max: dbConfig.max,
  idleTimeoutMillis: dbConfig.idleTimeoutMillis,
  connectionTimeoutMillis: dbConfig.connectionTimeoutMillis,
});

// Report unexpected errors on idle clients without exposing connection details.
pool.on('error', (error) => {
  console.error(`[Database Pool] Unexpected client error${error.code ? ` (${error.code})` : ''}.`);
});

/**
 * Execute a parameterized SQL query with automatic client lease from the pool.
 * @param {string} text - SQL statement with positional parameters ($1, $2, etc.)
 * @param {Array} params - Values to bind to parameters
 * @returns {Promise<import('pg').QueryResult>}
 */
export async function query(text, params = []) {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    if (config.env === 'development' && duration > 500) {
      console.warn(`[Slow Query] ${duration}ms: ${text}`);
    }
    return res;
  } catch (error) {
    console.error(
      `[Database Query Error]${error.code ? ` (${error.code})` : ''}: ${error.message}`
    );
    throw error;
  }
}

function getConnectionFailureMessage(error) {
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

/**
 * Verifies that the PostgreSQL server is reachable and credentials are valid.
 * @returns {Promise<{ ok: boolean, database?: string, time?: string, error?: string }>}
 */
export async function testConnection() {
  try {
    const client = await pool.connect();
    try {
      const res = await client.query('SELECT NOW() AS current_time, current_database() AS db_name;');
      return {
        ok: true,
        database: res.rows[0].db_name,
        time: res.rows[0].current_time,
      };
    } finally {
      client.release();
    }
  } catch (error) {
    const message = getConnectionFailureMessage(error);
    console.error(
      `[Database] Connection check failed${error.code ? ` (${error.code})` : ''}: ${message}`
    );
    return {
      ok: false,
      error: message,
    };
  }
}

/**
 * Gracefully shuts down the connection pool (used during server shutdown).
 */
export async function closePool() {
  await pool.end();
}

export default pool;
