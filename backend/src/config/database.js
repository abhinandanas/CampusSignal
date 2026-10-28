// backend/src/config/database.js
const { Pool } = require('pg');
const env = require('./env');

let pool = null;

/**
 * Returns the singleton PostgreSQL pool instance.
 * Initializes the pool lazily when first requested.
 */
function getPool() {
  if (!pool) {
    const config = env.database.connectionString
      ? { connectionString: env.database.connectionString }
      : {
          host: env.database.host,
          port: env.database.port,
          database: env.database.database,
          user: env.database.user,
          password: env.database.password,
          max: env.database.max,
          idleTimeoutMillis: env.database.idleTimeoutMillis,
          connectionTimeoutMillis: env.database.connectionTimeoutMillis
        };

    pool = new Pool(config);

    pool.on('error', (err) => {
      if (env.NODE_ENV !== 'production') {
        console.error('[CampusSignal] Unexpected error on idle PostgreSQL client:', err.message);
      }
    });
  }
  return pool;
}

/**
 * Executes a parameterized SQL query safely.
 * @param {string} text - SQL query text with placeholders ($1, $2, etc.)
 * @param {Array} params - Query parameters to prevent SQL injection
 */
async function query(text, params) {
  const p = getPool();
  return p.query(text, params);
}

/**
 * Checks connectivity to the PostgreSQL instance without exposing secrets.
 * @returns {Promise<{ connected: boolean, status: string }>}
 */
async function checkConnection() {
  if (!env.database.isConfigured) {
    return { connected: false, status: 'not_configured' };
  }

  try {
    const p = getPool();
    // Lightweight probe query
    await p.query('SELECT 1 AS health_check');
    return { connected: true, status: 'connected' };
  } catch (err) {
    if (env.NODE_ENV !== 'production') {
      console.error('[CampusSignal] Database health check probe failed:', err.message);
    }
    // Return sanitized status without leaking connection details or credentials
    return { connected: false, status: 'disconnected' };
  }
}

/**
 * Closes all active connections in the pool for graceful shutdown.
 */
async function closePool() {
  if (pool) {
    try {
      await pool.end();
    } catch (err) {
      if (env.NODE_ENV !== 'production') {
        console.error('[CampusSignal] Error while closing database pool:', err.message);
      }
    } finally {
      pool = null;
    }
  }
}

module.exports = {
  getPool,
  query,
  checkConnection,
  closePool,
  isDbConfigured: () => env.database.isConfigured
};
