/**
 * Crowd Density Routes
 * GET /api/crowd/density - Get all zone densities
 * GET /api/crowd/density/:zoneId - Get specific zone
 * GET /api/crowd/summary - Get crowd summary stats
 * POST /api/crowd/density - Admin update (handled in admin routes)
 */
const express = require('express');
const router = express.Router();
const { getCrowdDensity, getZoneDensity, getCrowdSummary } = require('../services/crowdSimulator');
const { asyncHandler } = require('../utils/helpers');

// GET /api/crowd/density
router.get('/density', asyncHandler(async (req, res) => {
  const density = getCrowdDensity();
  res.json({ success: true, data: density, timestamp: new Date().toISOString() });
}));

// GET /api/crowd/density/:zoneId
router.get('/density/:zoneId', asyncHandler(async (req, res) => {
  const zone = getZoneDensity(req.params.zoneId);
  if (!zone) {
    return res.status(404).json({ error: 'Not Found', message: 'Zone not found' });
  }
  res.json({ success: true, data: zone });
}));

// GET /api/crowd/summary
router.get('/summary', asyncHandler(async (req, res) => {
  const summary = getCrowdSummary();
  res.json({ success: true, data: summary });
}));

module.exports = router;
