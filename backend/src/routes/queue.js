/**
 * Queue Time Routes
 * GET /api/queue/times - Get all queue times
 * GET /api/queue/times/:locationId - Get specific queue
 */
const express = require('express');
const router = express.Router();
const { queueData } = require('../data/seedData');
const { asyncHandler } = require('../utils/helpers');

// Simulate queue fluctuation
let currentQueues = JSON.parse(JSON.stringify(queueData));

function simulateQueues() {
  currentQueues = currentQueues.map((q) => {
    // Add small random fluctuation (±3 minutes)
    const fluctuation = Math.floor((Math.random() - 0.5) * 6);
    const newWait = Math.max(1, q.currentWaitMinutes + fluctuation);
    const newLength = Math.max(1, Math.round(newWait * 1.5));

    return {
      ...q,
      currentWaitMinutes: newWait,
      queueLength: newLength,
      lastUpdated: new Date().toISOString(),
    };
  });
  return currentQueues;
}

// GET /api/queue/times
router.get('/times', asyncHandler(async (req, res) => {
  const queues = simulateQueues();
  const { type } = req.query;

  let filtered = queues;
  if (type === 'food') {
    filtered = queues.filter((q) => q.locationId.startsWith('loc-food'));
  } else if (type === 'washroom') {
    filtered = queues.filter((q) => q.locationId.startsWith('loc-wash'));
  }

  // Sort by wait time ascending
  filtered.sort((a, b) => a.currentWaitMinutes - b.currentWaitMinutes);

  res.json({
    success: true,
    data: filtered,
    recommendation: filtered[0] ? `Shortest wait: ${filtered[0].name} (${filtered[0].currentWaitMinutes} min)` : null,
  });
}));

// GET /api/queue/times/:locationId
router.get('/times/:locationId', asyncHandler(async (req, res) => {
  simulateQueues();
  const queue = currentQueues.find((q) => q.locationId === req.params.locationId);
  if (!queue) {
    return res.status(404).json({ error: 'Not Found', message: 'Queue data not found for this location' });
  }
  res.json({ success: true, data: queue });
}));

module.exports = router;
