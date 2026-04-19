/**
 * Planner Routes (User's personalized plan)
 * GET /api/planner - Get user's plan
 * POST /api/planner/save - Save item to plan
 * DELETE /api/planner/remove - Remove item from plan
 */
const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const { validators } = require('../middleware/validate');
const { getUserPlan, saveToUserPlan, removeFromUserPlan } = require('../services/firestore');
const { asyncHandler } = require('../utils/helpers');

// All planner routes require auth
router.use(authenticate);

// GET /api/planner
router.get('/', asyncHandler(async (req, res) => {
  const plan = await getUserPlan(req.user.uid);
  res.json({ success: true, data: plan });
}));

// POST /api/planner/save
router.post('/save', validators.savePlan, asyncHandler(async (req, res) => {
  const { type, itemId } = req.body;
  const plan = await saveToUserPlan(req.user.uid, type, itemId);
  res.json({ success: true, data: plan, message: `${type} saved to your plan` });
}));

// DELETE /api/planner/remove
router.delete('/remove', asyncHandler(async (req, res) => {
  const { type, itemId } = req.body;
  if (!type || !itemId) {
    return res.status(400).json({ error: 'Bad Request', message: 'type and itemId are required' });
  }
  const plan = await removeFromUserPlan(req.user.uid, type, itemId);
  res.json({ success: true, data: plan, message: `${type} removed from your plan` });
}));

module.exports = router;
