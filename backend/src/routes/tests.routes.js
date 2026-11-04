import { Router } from 'express';
import { createTestsController } from '../controllers/tests.controller.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
export default function testsRoutes(options) { const router = Router(); const c = createTestsController(options?.service); router.get('/', asyncHandler(c.list)); router.post('/', asyncHandler(c.create)); router.get('/:id', asyncHandler(c.get)); return router; }
