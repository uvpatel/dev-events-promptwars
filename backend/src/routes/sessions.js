/**
 * Sessions Routes
 * GET /api/sessions - List all sessions
 * GET /api/sessions/:id - Get session details
 */
const express = require('express');
const router = express.Router();
const { sessions } = require('../data/seedData');
const { asyncHandler } = require('../utils/helpers');

let allSessions = [...sessions];

// GET /api/sessions
router.get('/', asyncHandler(async (req, res) => {
  let filtered = [...allSessions];

  // Filter by stage
  if (req.query.stage) {
    filtered = filtered.filter((s) => s.stage.toLowerCase().includes(req.query.stage.toLowerCase()));
  }

  // Filter by tag
  if (req.query.tag) {
    filtered = filtered.filter((s) => s.tags.some((t) => t.toLowerCase() === req.query.tag.toLowerCase()));
  }

  // Sort by start time
  filtered.sort((a, b) => new Date(a.startTime) - new Date(b.startTime));

  res.json({ success: true, data: filtered, count: filtered.length });
}));

// GET /api/sessions/:id
router.get('/:id', asyncHandler(async (req, res) => {
  const session = allSessions.find((s) => s.id === req.params.id);
  if (!session) {
    return res.status(404).json({ error: 'Not Found', message: 'Session not found' });
  }
  res.json({ success: true, data: session });
}));

// Used by admin
router.addSession = (session) => {
  allSessions.push(session);
  return session;
};

module.exports = router;
