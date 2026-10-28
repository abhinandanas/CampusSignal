/**
 * CampusSignal — Environment Configuration Loader
 * Purpose: Centralizes environment parsing with sensible defaults
 */

import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Explicitly load .env from backend root if it exists
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

function getInteger(name, fallback, { min = 1, max = Number.MAX_SAFE_INTEGER } = {}) {
  const rawValue = process.env[name];
  if (rawValue === undefined || rawValue === '') {
    return fallback;
  }

  const value = Number(rawValue);
  if (!Number.isSafeInteger(value) || value < min || value > max) {
    throw new Error(`[Config] ${name} must be an integer between ${min} and ${max}.`);
  }

  return value;
}

const databaseUser = process.env.DB_USER?.trim();
const databasePassword = process.env.DB_PASSWORD;
const missingDatabaseVariables = [];

if (!databaseUser) missingDatabaseVariables.push('DB_USER');
if (databasePassword === undefined) missingDatabaseVariables.push('DB_PASSWORD');

if (missingDatabaseVariables.length > 0) {
  throw new Error(
    `[Config] Missing required database environment variable(s): ${missingDatabaseVariables.join(', ')}. ` +
    'Set them in backend/.env using backend/.env.example as a guide.'
  );
}

export const config = {
  env: process.env.NODE_ENV || 'development',
  port: getInteger('PORT', 5000, { max: 65535 }),
  frontendOrigin: process.env.FRONTEND_ORIGIN || 'http://localhost:3000',

  database: {
    host: process.env.DB_HOST?.trim() || 'localhost',
    port: getInteger('DB_PORT', 5432, { max: 65535 }),
    database: process.env.DB_NAME || 'campussignal_db',
    user: databaseUser,
    password: databasePassword,
    max: getInteger('DB_POOL_MAX', 10),
    idleTimeoutMillis: getInteger('DB_POOL_IDLE_TIMEOUT_MS', 30000, { min: 0 }),
    connectionTimeoutMillis: getInteger('DB_POOL_CONNECTION_TIMEOUT_MS', 2000, { min: 0 }),
  },
};

export default config;
