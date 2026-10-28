// backend/src/app.js
const express = require('express');
const cors = require('cors');
const env = require('./config/env');

const healthRoutes = require('./routes/health.routes');
const locationsRoutes = require('./routes/locations.routes');
const testsRoutes = require('./routes/tests.routes');
const dashboardRoutes = require('./routes/dashboard.routes');

const notFound = require('./middleware/notFound');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// 1. CORS Configuration
app.use(cors({
  origin: env.FRONTEND_ORIGIN,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// 2. Request Parsers
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// 3. API Routes
app.use('/api/health', healthRoutes);
app.use('/api/locations', locationsRoutes);
app.use('/api/tests', testsRoutes);
app.use('/api/dashboard', dashboardRoutes);

// 4. 404 Route Not Found Middleware (catches unmatched routes)
app.use(notFound);

// 5. Centralized Error Handling Middleware (must be registered last)
app.use(errorHandler);

module.exports = app;
