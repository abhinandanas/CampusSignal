// backend/src/server.js
const app = require('./app');
const env = require('./config/env');
const { checkConnection, closePool } = require('./config/database');

const server = app.listen(env.PORT, () => {
  console.log(`[CampusSignal] Server running in ${env.NODE_ENV} mode on port ${env.PORT}`);
  console.log(`[CampusSignal] Health endpoint: http://localhost:${env.PORT}/api/health`);

  // Asynchronously check database status on startup without blocking server availability
  checkConnection().then((db) => {
    console.log(`[CampusSignal] Database connection status: ${db.status}`);
  }).catch((err) => {
    console.warn('[CampusSignal] Initial database check warning:', err.message);
  });
});

// Handle server listen errors (e.g. port already in use)
server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`\n[CampusSignal Error] Port ${env.PORT} is already in use by another process.`);
    console.error(`To fix this, either:`);
    console.error(`  1. Stop the process currently running on port ${env.PORT}.`);
    console.error(`  2. Or set a different port in your backend/.env (e.g. PORT=5001).\n`);
  } else {
    console.error('\n[CampusSignal Server Error]:', err.message || err);
  }
  process.exit(1);
});

// Graceful server shutdown & resource cleanup
let isShuttingDown = false;

async function handleShutdown(signal) {
  if (isShuttingDown) return;
  isShuttingDown = true;

  console.log(`\n[CampusSignal] Received ${signal}. Initiating graceful shutdown...`);

  server.close(async () => {
    console.log('[CampusSignal] HTTP server closed.');
    try {
      await closePool();
      console.log('[CampusSignal] PostgreSQL pool drained and closed.');
    } catch (err) {
      console.error('[CampusSignal] Error while closing PostgreSQL pool:', err.message);
    } finally {
      console.log('[CampusSignal] Shutdown sequence complete. Exiting.');
      process.exit(0);
    }
  });

  // Force exit if shutdown hangs beyond timeout
  setTimeout(() => {
    console.error('[CampusSignal] Force shutdown after 10s timeout.');
    process.exit(1);
  }, 10000).unref();
}

process.on('SIGTERM', () => handleShutdown('SIGTERM'));
process.on('SIGINT', () => handleShutdown('SIGINT'));

module.exports = server;
