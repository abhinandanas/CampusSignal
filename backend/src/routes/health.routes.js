import { Router } from 'express';
import { getHealth } from '../controllers/health.controller.js';

const router = Router();

// GET /api/health — System health and database connectivity check
router.get('/', getHealth);

export default router;
