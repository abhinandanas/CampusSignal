/**
 * CampusSignal — Backend Server Entry Point
 * Owner: Abhinandana S
 *
 * Responsibilities:
 * - Load environment variables
 * - Start the Express HTTP listener
 * - Manage graceful shutdown protocols
 */

import { config } from './config/env.js';
import app from './app.js';
import { closePool } from './config/database.js';

const PORT = config.port;
const NODE_ENV = config.env;

const server = app.listen(PORT, () => {
  console.log('='.repeat(60));
  console.log('  CampusSignal – Wi-Fi Dead-Zone Mapper API Server');
  console.log(`  Environment: ${NODE_ENV}`);
  console.log(`  Local URL:   http://localhost:${PORT}`);
  console.log(`  Health API:  http://localhost:${PORT}/api/health`);
  console.log(`  Dashboard:   http://localhost:${PORT}/api/dashboard/summary`);
  console.log(`  Database:    ${config.database.host}:${config.database.port}/${config.database.database}`);
  console.log('='.repeat(60));
});

// ── Graceful Shutdown ────────────────────────────────────────────────────────
async function handleShutdown(signal) {
  console.log(`\n[Server] Received ${signal}. Commencing graceful shutdown...`);
  server.close(async () => {
    console.log('[Server] HTTP listener closed cleanly.');
    try {
      await closePool();
      console.log('[Server] PostgreSQL connection pool terminated.');
    } catch (err) {
      console.error('[Server] Error while terminating database pool:', err.message);
    }
    process.exit(0);
  });

  // Force shutdown after timeout if pending connections hang
  setTimeout(() => {
    console.error('[Server] Forced shutdown: connections failed to close in time.');
    process.exit(1);
  }, 10000);
}

process.on('SIGTERM', () => handleShutdown('SIGTERM'));
process.on('SIGINT', () => handleShutdown('SIGINT'));

export default server;
