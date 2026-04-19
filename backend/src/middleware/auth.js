/**
 * Authentication Middleware
 * Verifies Firebase tokens and attaches user to request
 */
const { verifyToken } = require('../services/firestore');

/**
 * Authenticate user from Bearer token
 */
async function authenticate(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Missing or invalid authorization header',
      });
    }

    const token = authHeader.split('Bearer ')[1];
    const user = await verifyToken(token);

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      error: 'Unauthorized',
      message: error.message || 'Invalid authentication token',
    });
  }
}

/**
 * Require admin role
 */
function requireAdmin(req, res, next) {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({
      error: 'Forbidden',
      message: 'Admin access required',
    });
  }
  next();
}

/**
 * Optional authentication - attaches user if token present but doesn't require it
 */
async function optionalAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split('Bearer ')[1];
      req.user = await verifyToken(token);
    }
  } catch (error) {
    // Silent fail - user just won't be authenticated
  }
  next();
}

module.exports = { authenticate, requireAdmin, optionalAuth };
