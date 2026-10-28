import dotenv from 'dotenv';

dotenv.config();

export const config = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number.parseInt(process.env.PORT || '5000', 10),
  databaseUrl: process.env.DATABASE_URL,
  databaseHost: process.env.DB_HOST || 'localhost',
  databasePort: Number.parseInt(process.env.DB_PORT || '5432', 10),
  databaseName: process.env.DB_NAME || 'campus_signal',
  databaseUser: process.env.DB_USER,
  databasePassword: process.env.DB_PASSWORD,
  poolMax: Number.parseInt(process.env.DB_POOL_MAX || '10', 10),
  poolIdleTimeoutMs: Number.parseInt(process.env.DB_POOL_IDLE_TIMEOUT_MS || '30000', 10),
  poolConnectionTimeoutMs: Number.parseInt(process.env.DB_POOL_CONNECTION_TIMEOUT_MS || '2000', 10),
  databaseSsl: process.env.DATABASE_SSL === 'true',
  frontendOrigin: process.env.FRONTEND_ORIGIN || 'http://localhost:3000',
};
