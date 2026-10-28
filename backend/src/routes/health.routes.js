import { Router } from 'express';
import { createHealthController } from '../controllers/health.controller.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
export default function healthRoutes(options) { const router = Router(); router.get('/', asyncHandler(createHealthController(options?.pool))); return router; }
