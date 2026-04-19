/**
 * Admin Routes
 * All routes require admin authentication
 */
const express = require('express');
const router = express.Router();
const { authenticate, requireAdmin } = require('../middleware/auth');
const { validators } = require('../middleware/validate');
const { updateZoneDensity } = require('../services/crowdSimulator');
const { asyncHandler, generateId } = require('../utils/helpers');

// Import route stores for data manipulation
const eventsRouter = require('./events');
const sessionsRouter = require('./sessions');
const boothsRouter = require('./booths');

// All admin routes require auth + admin role
router.use(authenticate);
router.use(requireAdmin);

// ─── Events ─────────────────────────────────────────────────
// POST /api/admin/events
router.post('/events', validators.createEvent, asyncHandler(async (req, res) => {
  const event = {
    id: generateId('evt'),
    ...req.body,
    announcements: req.body.announcements || [],
    createdBy: req.user.uid,
    createdAt: new Date().toISOString(),
  };

  eventsRouter.addEvent(event);
  res.status(201).json({ success: true, data: event, message: 'Event created' });
}));

// PUT /api/admin/events/:id
router.put('/events/:id', asyncHandler(async (req, res) => {
  const updated = eventsRouter.updateEvent(req.params.id, req.body);
  if (!updated) {
    return res.status(404).json({ error: 'Not Found', message: 'Event not found' });
  }
  res.json({ success: true, data: updated, message: 'Event updated' });
}));

// ─── Booths ─────────────────────────────────────────────────
// POST /api/admin/booths
router.post('/booths', validators.createBooth, asyncHandler(async (req, res) => {
  const booth = {
    id: generateId('loc'),
    eventId: req.body.eventId || 'evt-techconf-2026',
    ...req.body,
    createdAt: new Date().toISOString(),
  };

  boothsRouter.addLocation(booth);
  res.status(201).json({ success: true, data: booth, message: 'Booth/location added' });
}));

// PUT /api/admin/booths/:id
router.put('/booths/:id', asyncHandler(async (req, res) => {
  const updated = boothsRouter.updateLocation(req.params.id, req.body);
  if (!updated) {
    return res.status(404).json({ error: 'Not Found', message: 'Booth not found' });
  }
  res.json({ success: true, data: updated, message: 'Booth updated' });
}));

// ─── Sessions ───────────────────────────────────────────────
// POST /api/admin/sessions
router.post('/sessions', validators.createSession, asyncHandler(async (req, res) => {
  const session = {
    id: generateId('ses'),
    eventId: req.body.eventId || 'evt-techconf-2026',
    ...req.body,
    tags: req.body.tags || [],
    createdAt: new Date().toISOString(),
  };

  sessionsRouter.addSession(session);
  res.status(201).json({ success: true, data: session, message: 'Session added' });
}));

// ─── Crowd Density ──────────────────────────────────────────
// PUT /api/admin/crowd
router.put('/crowd', validators.updateCrowd, asyncHandler(async (req, res) => {
  const { zoneId, percentage } = req.body;
  const zone = updateZoneDensity(zoneId, percentage);

  if (!zone) {
    return res.status(404).json({ error: 'Not Found', message: 'Zone not found' });
  }

  res.json({ success: true, data: zone, message: 'Crowd density updated' });
}));

module.exports = router;
