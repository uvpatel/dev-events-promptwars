/**
 * Booths & Venue Locations Routes
 * GET /api/booths - List all venue locations
 * GET /api/booths/:id - Get specific location
 */
const express = require('express');
const router = express.Router();
const { venueLocations } = require('../data/seedData');
const { getCrowdDensity } = require('../services/crowdSimulator');
const { asyncHandler } = require('../utils/helpers');

let allLocations = [...venueLocations];

// GET /api/booths
router.get('/', asyncHandler(async (req, res) => {
  let filtered = [...allLocations];

  // Filter by type
  if (req.query.type) {
    filtered = filtered.filter((l) => l.type === req.query.type);
  }

  // Add nearby crowd info
  const crowdData = getCrowdDensity();
  const enriched = filtered.map((loc) => {
    // Find nearest crowd zone
    const nearestZone = crowdData.reduce((nearest, zone) => {
      const dist = Math.sqrt(
        Math.pow(loc.location.lat - zone.coordinates.lat, 2) +
        Math.pow(loc.location.lng - zone.coordinates.lng, 2)
      );
      const nearestDist = Math.sqrt(
        Math.pow(loc.location.lat - nearest.coordinates.lat, 2) +
        Math.pow(loc.location.lng - nearest.coordinates.lng, 2)
      );
      return dist < nearestDist ? zone : nearest;
    }, crowdData[0]);

    return {
      ...loc,
      nearbyDensity: nearestZone?.density || 'unknown',
      nearbyDensityPercentage: nearestZone?.percentage || 0,
    };
  });

  res.json({ success: true, data: enriched, count: enriched.length });
}));

// GET /api/booths/:id
router.get('/:id', asyncHandler(async (req, res) => {
  const location = allLocations.find((l) => l.id === req.params.id);
  if (!location) {
    return res.status(404).json({ error: 'Not Found', message: 'Location not found' });
  }
  res.json({ success: true, data: location });
}));

// Used by admin
router.addLocation = (location) => {
  allLocations.push(location);
  return location;
};

router.updateLocation = (id, updates) => {
  const idx = allLocations.findIndex((l) => l.id === id);
  if (idx === -1) return null;
  allLocations[idx] = { ...allLocations[idx], ...updates };
  return allLocations[idx];
};

module.exports = router;
