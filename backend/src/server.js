/** CampusSignal Express server entry point and graceful shutdown handling. */

import { config } from './config/env.js';
import app from './app.js';
import { closePool, testConnection } from './config/database.js';

const server = app.listen(config.port, () => {
  console.log(`[CampusSignal] Server running in ${config.env} mode on port ${config.port}`);
  console.log(`[CampusSignal] Health endpoint: http://localhost:${config.port}/api/health`);
  console.log(`[CampusSignal] Dashboard: http://localhost:${config.port}/api/dashboard/summary`);
  console.log(`[CampusSignal] Database target: ${config.database.host}:${config.database.port}/${config.database.database}`);

  testConnection().then((result) => {
    const status = result.ok ? 'connected' : (config.database.isConfigured ? 'disconnected' : 'not configured');
    console.log(`[CampusSignal] Database connection status: ${status}`);
  });
});

server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`[CampusSignal] Port ${config.port} is already in use. Set a different PORT in backend/.env.`);
  } else {
    console.error('[CampusSignal] Server failed to start:', error.message);
  }
  process.exitCode = 1;
});

let isShuttingDown = false;

async function handleShutdown(signal) {
  if (isShuttingDown) return;
  isShuttingDown = true;
  console.log(`\n[CampusSignal] Received ${signal}; shutting down.`);

  const forceExit = setTimeout(() => {
    console.error('[CampusSignal] Forced shutdown after 10 seconds.');
    process.exit(1);
  }, 10000);
  forceExit.unref();

  server.close(async (error) => {
    if (error) console.error('[CampusSignal] HTTP server shutdown error:', error.message);
    try {
      await closePool();
      console.log('[CampusSignal] PostgreSQL pool closed.');
    } catch (closeError) {
      console.error('[CampusSignal] Error closing PostgreSQL pool:', closeError.message);
      process.exitCode = 1;
    }
  });
}

process.on('SIGTERM', () => handleShutdown('SIGTERM'));
process.on('SIGINT', () => handleShutdown('SIGINT'));

export default server;
