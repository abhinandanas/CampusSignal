import { Router } from 'express';
import { createLocationsController } from '../controllers/locations.controller.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
export default function locationsRoutes(options) { const router = Router(); router.get('/', asyncHandler(createLocationsController(options?.service).list)); return router; }
