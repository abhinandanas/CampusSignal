// backend/src/routes/health.routes.js
const express = require('express');
const router = express.Router();
const { getHealth } = require('../controllers/health.controller');

// GET /api/health — System health and database connectivity check
router.get('/', getHealth);

module.exports = router;
