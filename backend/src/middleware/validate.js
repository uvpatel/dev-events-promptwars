/**
 * Input Validation Middleware
 * Uses express-validator for request validation
 */
const { validationResult, body, param, query } = require('express-validator');

/**
 * Check validation results and return errors if any
 */
function handleValidation(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Validation Error',
      details: errors.array().map((e) => ({ field: e.path, message: e.msg })),
    });
  }
  next();
}

// Validation chains for different routes
const validators = {
  chatMessage: [
    body('message').trim().notEmpty().withMessage('Message is required').isLength({ max: 500 }).withMessage('Message too long (max 500 chars)'),
    handleValidation,
  ],

  savePlan: [
    body('type').isIn(['session', 'booth']).withMessage('Type must be session or booth'),
    body('itemId').trim().notEmpty().withMessage('Item ID is required'),
    handleValidation,
  ],

  createEvent: [
    body('name').trim().notEmpty().withMessage('Event name is required'),
    body('date').trim().notEmpty().withMessage('Date is required'),
    body('venue.name').trim().notEmpty().withMessage('Venue name is required'),
    handleValidation,
  ],

  createBooth: [
    body('name').trim().notEmpty().withMessage('Booth name is required'),
    body('type').isIn(['booth', 'food_stall', 'washroom', 'entry_gate', 'exit', 'stage']).withMessage('Invalid booth type'),
    handleValidation,
  ],

  createSession: [
    body('title').trim().notEmpty().withMessage('Session title is required'),
    body('stage').trim().notEmpty().withMessage('Stage is required'),
    body('startTime').trim().notEmpty().withMessage('Start time is required'),
    body('endTime').trim().notEmpty().withMessage('End time is required'),
    handleValidation,
  ],

  updateCrowd: [
    body('zoneId').trim().notEmpty().withMessage('Zone ID is required'),
    body('percentage').isInt({ min: 0, max: 100 }).withMessage('Percentage must be 0-100'),
    handleValidation,
  ],

  idParam: [
    param('id').trim().notEmpty().withMessage('ID parameter is required'),
    handleValidation,
  ],
};

module.exports = { validators, handleValidation };
