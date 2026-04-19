/**
 * Events Routes
 * GET /api/events - List all events
 * GET /api/events/:id - Get event details
 * GET /api/events/:id/announcements - Get announcements
 */
const express = require('express');
const router = express.Router();
const { demoEvent } = require('../data/seedData');
const { asyncHandler } = require('../utils/helpers');

// In-memory events store (demo mode)
let events = [demoEvent];

// GET /api/events
router.get('/', asyncHandler(async (req, res) => {
  res.json({
    success: true,
    data: events.map(({ announcements, ...event }) => event),
    count: events.length,
  });
}));

// GET /api/events/:id
router.get('/:id', asyncHandler(async (req, res) => {
  const event = events.find((e) => e.id === req.params.id);
  if (!event) {
    return res.status(404).json({ error: 'Not Found', message: 'Event not found' });
  }
  res.json({ success: true, data: event });
}));

// GET /api/events/:id/announcements
router.get('/:id/announcements', asyncHandler(async (req, res) => {
  const event = events.find((e) => e.id === req.params.id);
  if (!event) {
    return res.status(404).json({ error: 'Not Found', message: 'Event not found' });
  }
  res.json({
    success: true,
    data: event.announcements.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)),
  });
}));

// Used by admin routes
router.addEvent = (event) => {
  events.push(event);
  return event;
};

router.updateEvent = (id, updates) => {
  const idx = events.findIndex((e) => e.id === id);
  if (idx === -1) return null;
  events[idx] = { ...events[idx], ...updates };
  return events[idx];
};

module.exports = router;
