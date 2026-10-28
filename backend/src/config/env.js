// backend/src/config/env.js
const path = require('path');
const dotenv = require('dotenv');

// Load .env from backend directory first, then fallback to current working directory
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config();

const env = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT, 10) || 5000,
  FRONTEND_ORIGIN: process.env.FRONTEND_ORIGIN || process.env.CORS_ORIGIN || 'http://localhost:3000',

  database: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT, 10) || 5432,
    database: process.env.DB_NAME || '',
    user: process.env.DB_USER || '',
    password: process.env.DB_PASSWORD || '',
    connectionString: process.env.DATABASE_URL || null,
    max: parseInt(process.env.DB_POOL_MAX, 10) || 10,
    idleTimeoutMillis: parseInt(process.env.DB_POOL_IDLE_TIMEOUT_MS, 10) || 30000,
    connectionTimeoutMillis: parseInt(process.env.DB_POOL_CONNECTION_TIMEOUT_MS, 10) || 2000,

    get isConfigured() {
      if (this.connectionString) return true;
      const isPlaceholderUser = !this.user || this.user === 'your_database_user';
      return Boolean(this.host && this.database && this.user && !isPlaceholderUser);
    }
  }
};

module.exports = env;
