'use strict';

const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const compression = require('compression');
const cookieParser = require('cookie-parser');

const env = require('./config/env');
const globalErrorHandler = require('./middlewares/errorHandler');
const { apiLimiter } = require('./middlewares/rateLimiter');
const { sendError } = require('./utils/apiResponse');

const authRoutes = require('./routes/auth.routes');
const generationRoutes = require('./routes/generation.routes');
const userRoutes = require('./routes/user.routes');
const chatRoutes = require('./routes/chat.routes');
const attachmentRoutes = require('./routes/attachment.routes');
const memoryRoutes = require('./routes/memory.routes');

const app = express();

// ─── Security Headers ─────────────────────────────────────
app.use(helmet());

// ─── CORS ─────────────────────────────────────────────────
app.use(
  cors({
    origin: env.cors.clientOrigin,
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// ─── Request Parsing ──────────────────────────────────────
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());
app.use(compression());

// ─── Logging ──────────────────────────────────────────────
if (!env.isProduction) {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// ─── Health Check ─────────────────────────────────────────
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ─── API Routes ───────────────────────────────────────────
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/generations', apiLimiter, generationRoutes);
app.use('/api/v1/users', apiLimiter, userRoutes);
app.use('/api/v1/chat', apiLimiter, chatRoutes);
app.use('/api/v1/attachments', apiLimiter, attachmentRoutes);
app.use('/api/v1/memories', apiLimiter, memoryRoutes);

// ─── 404 Handler ──────────────────────────────────────────
app.use((req, res) => {
  sendError(res, 404, `Route ${req.originalUrl} not found`);
});

// ─── Global Error Handler ─────────────────────────────────
app.use(globalErrorHandler);

module.exports = app;
