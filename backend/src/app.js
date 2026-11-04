import express from 'express';
import cors from 'cors';
import { config } from './config/env.js';
import { pool } from './config/database.js';
import healthRoutes from './routes/health.routes.js';
import locationsRoutes from './routes/locations.routes.js';
import testsRoutes from './routes/tests.routes.js';
import dashboardRoutes from './routes/dashboard.routes.js';
import { notFound } from './middleware/notFound.js';
import { errorHandler } from './middleware/errorHandler.js';

export function createApp({ databasePool = pool, locationsService, testsService, dashboardService } = {}) {
  const app = express();
  app.use(cors({ origin: config.frontendOrigin }));
  app.use(express.json({ limit: '32kb' }));
  app.use('/api/health', healthRoutes({ pool: databasePool }));
  app.use('/api/locations', locationsRoutes({ service: locationsService }));
  app.use('/api/tests', testsRoutes({ service: testsService }));
  app.use('/api/dashboard', dashboardRoutes({ service: dashboardService }));
  app.use(notFound);
  app.use(errorHandler);
  return app;
}

export default createApp();
