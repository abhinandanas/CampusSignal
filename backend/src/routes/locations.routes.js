import { Router } from 'express';
import { createLocationsController } from '../controllers/locations.controller.js';
import { asyncHandler } from '../middleware/asyncHandler.js';

/**
 * Express router factory for campus locations endpoints.
 *
 * GET /api/locations      - List locations (supports query params: building, floor, search)
 * GET /api/locations/:id  - Get single location by UUID
 *
 * @param {Object} [options]
 * @param {Object} [options.service] - Locations service instance
 * @returns {Router} Configured Express router
 */
export default function locationsRoutes(options = {}) {
  const router = Router();
  const controller = createLocationsController(options?.service);

  router.get('/', asyncHandler(controller.list));
  router.get('/:id', asyncHandler(controller.get));

  return router;
}
