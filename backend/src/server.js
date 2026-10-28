import app from './app.js';
import { config } from './config/env.js';
import { pool } from './config/database.js';

const server = app.listen(config.port, () => console.log(`CampusSignal API listening on port ${config.port}`));

async function shutdown(signal) {
  console.log(`${signal} received; shutting down CampusSignal API`);
  server.close(async () => {
    if (pool) await pool.end();
    process.exit(0);
  });
}

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
