/**
 * CampusSignal — Environment Configuration Loader
 * Loads backend/.env and centralizes validated application settings.
 */

import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load backend/.env first; then allow a project-root/current-directory .env
// to provide values that were not set by the backend-specific file.
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config();

function getInteger(name, fallback, { min = 1, max = Number.MAX_SAFE_INTEGER } = {}) {
  const rawValue = process.env[name];
  if (rawValue === undefined || rawValue === '') return fallback;

  const value = Number(rawValue);
  if (!Number.isSafeInteger(value) || value < min || value > max) {
    throw new Error(`[Config] ${name} must be an integer between ${min} and ${max}.`);
  }
  return value;
}

const connectionString = process.env.DATABASE_URL?.trim() || null;
const databaseUser = process.env.DB_USER?.trim() || '';
const databasePassword = process.env.DB_PASSWORD || '';
const databaseName = process.env.DB_NAME?.trim() || 'campussignal_db';
const databaseIsConfigured = Boolean(
  connectionString || (
    databaseUser &&
    databaseUser !== 'your_database_user' &&
    databasePassword &&
    databasePassword !== 'your_database_password' &&
    databaseName
  )
);

export const config = {
  env: process.env.NODE_ENV || 'development',
  port: getInteger('PORT', 5000, { max: 65535 }),
  frontendOrigin: process.env.FRONTEND_ORIGIN || process.env.CORS_ORIGIN || 'http://localhost:3000',
  database: {
    host: process.env.DB_HOST?.trim() || 'localhost',
    port: getInteger('DB_PORT', 5432, { max: 65535 }),
    database: databaseName,
    user: databaseUser,
    password: databasePassword,
    connectionString,
    isConfigured: databaseIsConfigured,
    max: getInteger('DB_POOL_MAX', 10),
    idleTimeoutMillis: getInteger('DB_POOL_IDLE_TIMEOUT_MS', 30000, { min: 0 }),
    connectionTimeoutMillis: getInteger('DB_POOL_CONNECTION_TIMEOUT_MS', 2000, { min: 0 }),
  },
};

export default config;
