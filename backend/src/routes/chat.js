/**
 * Chat Routes (AI Assistant)
 * POST /api/chat/message - Send message to AI assistant
 */
const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const { generateResponse } = require('../services/gemini');
const { validators } = require('../middleware/validate');
const { asyncHandler } = require('../utils/helpers');

// Rate limiting for chat endpoint (30 requests per minute)
const chatLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 30,
  message: { error: 'Too many requests', message: 'Please wait before sending more messages' },
});

// POST /api/chat/message
router.post('/message', chatLimiter, validators.chatMessage, asyncHandler(async (req, res) => {
  const { message, history } = req.body;

  const response = await generateResponse(message, history || []);

  res.json({
    success: true,
    data: {
      reply: response.text,
      source: response.source,
      timestamp: new Date().toISOString(),
    },
  });
}));

module.exports = router;
