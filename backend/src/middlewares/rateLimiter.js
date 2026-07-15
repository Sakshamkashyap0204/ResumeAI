'use strict';

const rateLimit = require('express-rate-limit');
const { sendError } = require('../utils/apiResponse');

const rateLimitHandler = (req, res) => {
  sendError(res, 429, 'Too many requests. Please try again later.');
};

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  handler: rateLimitHandler,
  standardHeaders: true,
  legacyHeaders: false,
});

const apiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 60,
  handler: rateLimitHandler,
  standardHeaders: true,
  legacyHeaders: false,
});

const generationLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10,
  handler: rateLimitHandler,
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = { authLimiter, apiLimiter, generationLimiter };
