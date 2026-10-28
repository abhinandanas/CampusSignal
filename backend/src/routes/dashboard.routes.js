/**
 * CampusSignal — Dashboard Routes
 * Owner: Abhinandana S
 *
 * Responsibilities:
 * - Route definitions for dashboard endpoints
 * - Mounted at /api/dashboard in app.js
 */

import { Router } from 'express';
import * as dashboardController from '../controllers/dashboard.controller.js';

const router = Router();

// GET /api/dashboard & GET /api/dashboard/summary -> Aggregated KPI summary
router.get('/', dashboardController.getDashboardSummary);
router.get('/summary', dashboardController.getDashboardSummary);

// GET /api/dashboard/comparison -> Location-wise performance comparison
router.get('/comparison', dashboardController.getLocationComparison);

// GET /api/dashboard/recent-tests -> Recent test submissions
router.get('/recent-tests', dashboardController.getRecentTests);

export default router;
