/**
 * CampusSignal — Express Application Setup
 * Owner: Abhinandana S
 *
 * Responsibilities:
 * - Register global middleware (CORS, body parsing, security)
 * - Mount route modules (/api/dashboard, /api/health, /api/locations, /api/tests)
 * - Register 404 notFound and centralized errorHandler middleware
 * - Provide seamless integration hooks for teammate-owned route modules
 */

import express from 'express';
import cors from 'cors';
import dashboardRoutes from './routes/dashboard.routes.js';
import { testConnection } from './config/database.js';

const app = express();

// ── Global Middleware ────────────────────────────────────────────────────────
const allowedOrigin = process.env.FRONTEND_ORIGIN || 'http://localhost:3000';

app.use(cors({
  origin: allowedOrigin,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

// ── Dynamic Teammate Route Loader ────────────────────────────────────────────
// Allows teammate-owned files to be mounted automatically as soon as implemented
async function loadTeammateRouter(routePath, name, owner) {
  try {
    const mod = await import(routePath);
    const r = mod.default || mod.router;
    if (r && (typeof r === 'function' || typeof r.use === 'function')) {
      return r;
    }
  } catch {
    // Route file is currently an empty placeholder
  }

  // Graceful placeholder router until owner implements it
  const placeholderRouter = express.Router();
  placeholderRouter.isPlaceholder = true;
  placeholderRouter.all('*', (req, res) => {
    res.status(501).json({
      status: 'pending',
      message: `${name} endpoint is pending implementation by ${owner}.`,
    });
  });
  return placeholderRouter;
}

// ── Dynamic Teammate Middleware Loader ───────────────────────────────────────
async function loadTeammateMiddleware(path) {
  try {
    const mod = await import(path);
    if (mod.default && typeof mod.default === 'function') {
      return mod.default;
    }
  } catch {}
  return null;
}

// ── Root Info Route ──────────────────────────────────────────────────────────
app.get('/', (req, res) => {
  res.status(200).json({
    service: 'CampusSignal Backend API',
    version: '0.1.0',
    status: 'online',
    endpoints: {
      health: '/api/health',
      dashboard: '/api/dashboard/summary',
      locations: '/api/locations',
      tests: '/api/tests',
    },
    owner: 'SignalX Team',
    timestamp: new Date().toISOString(),
  });
});

// ── Route Registration ───────────────────────────────────────────────────────

// 1. Dashboard Routes (Owned & implemented by Abhinandana S)
app.use('/api/dashboard', dashboardRoutes);

// 2. Health Routes (Owned by Santosh)
const healthRouter = await loadTeammateRouter('./routes/health.routes.js', 'Health check', 'Santosh');
// Default health fallback if Santosh's health.routes.js is still a placeholder
app.get('/api/health', async (req, res, next) => {
  if (healthRouter && !healthRouter.isPlaceholder && healthRouter.stack?.length > 0) {
    return healthRouter(req, res, next);
  }
  const dbCheck = await testConnection();
  return res.status(dbCheck.ok ? 200 : 503).json({
    status: dbCheck.ok ? 'success' : 'error',
    data: {
      service: 'CampusSignal API',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      mode: process.env.NODE_ENV || 'development',
      database: dbCheck.ok ? 'connected' : 'disconnected',
      ...(dbCheck.ok
        ? { databaseName: dbCheck.database }
        : { databaseNotice: dbCheck.error }),
    },
  });
});
app.use('/api/health', healthRouter);

// 3. Locations Routes (Owned by Yashwanth)
const locationsRouter = await loadTeammateRouter('./routes/locations.routes.js', 'Locations', 'Yashwanth');
app.use('/api/locations', locationsRouter);

// 4. Tests Routes (Owned by Ankitha)
const testsRouter = await loadTeammateRouter('./routes/tests.routes.js', 'Network tests', 'Ankitha');
app.use('/api/tests', testsRouter);

// ── Centralized Error Handling ───────────────────────────────────────────────

// 404 Handler (Owned by Santosh)
const notFoundHandler = await loadTeammateMiddleware('./middleware/notFound.js');
if (notFoundHandler) {
  app.use(notFoundHandler);
} else {
  app.use((req, res) => {
    res.status(404).json({
      status: 'error',
      message: `Route not found: ${req.method} ${req.originalUrl}`,
    });
  });
}

// 500 Centralized Error Handler (Owned by Santosh)
const customErrorHandler = await loadTeammateMiddleware('./middleware/errorHandler.js');
if (customErrorHandler) {
  app.use(customErrorHandler);
} else {
  app.use((err, req, res, next) => {
    console.error('[CampusSignal API Error]:', err);
    res.status(err.status || 500).json({
      status: 'error',
      message: err.message || 'Internal Server Error',
    });
  });
}

export default app;
