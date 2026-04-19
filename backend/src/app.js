/**
 * EventFlow AI - Express Application
 * Main app configuration with middleware and route mounting
 */
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// ─── Security Middleware ──────────────────────────────────────
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}));

// ─── CORS ─────────────────────────────────────────────────────
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

// ─── Body Parsing ─────────────────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// ─── Logging ──────────────────────────────────────────────────
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// ─── Health Check ─────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'EventFlow AI Backend',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    demo: process.env.DEMO_MODE === 'true',
  });
});

// ─── API Routes ───────────────────────────────────────────────
app.use('/api/events', require('./routes/events'));
app.use('/api/crowd', require('./routes/crowd'));
app.use('/api/queue', require('./routes/queue'));
app.use('/api/sessions', require('./routes/sessions'));
app.use('/api/booths', require('./routes/booths'));
app.use('/api/chat', require('./routes/chat'));
app.use('/api/planner', require('./routes/planner'));
app.use('/api/admin', require('./routes/admin'));

// ─── 404 Handler ──────────────────────────────────────────────
app.use('/api/*', (req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.method} ${req.originalUrl} not found`,
  });
});

// ─── Global Error Handler ─────────────────────────────────────
app.use(errorHandler);

module.exports = app;
