import { Router } from 'express';
import { createDashboardController } from '../controllers/dashboard.controller.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
export default function dashboardRoutes(options) { const router = Router(); router.get('/summary', asyncHandler(createDashboardController(options?.service).summary)); return router; }
