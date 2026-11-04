import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const currentFile = fileURLToPath(import.meta.url);
const currentDirectory = path.dirname(currentFile);
dotenv.config({ path: path.resolve(currentDirectory, '../../.env') });
dotenv.config();

export const config = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number.parseInt(process.env.PORT || '5000', 10),
  databaseUrl: process.env.DATABASE_URL,
  databaseHost: process.env.DB_HOST || 'localhost',
  databasePort: Number.parseInt(process.env.DB_PORT || '5432', 10),
  databaseName: process.env.DB_NAME || 'campussignal_db',
  databaseUser: process.env.DB_USER,
  databasePassword: process.env.DB_PASSWORD,
  poolMax: Number.parseInt(process.env.DB_POOL_MAX || '10', 10),
  poolIdleTimeoutMs: Number.parseInt(process.env.DB_POOL_IDLE_TIMEOUT_MS || '30000', 10),
  poolConnectionTimeoutMs: Number.parseInt(process.env.DB_POOL_CONNECTION_TIMEOUT_MS || '2000', 10),
  databaseSsl: process.env.DATABASE_SSL === 'true',
  frontendOrigin: process.env.FRONTEND_ORIGIN || 'http://localhost:3000',
};
