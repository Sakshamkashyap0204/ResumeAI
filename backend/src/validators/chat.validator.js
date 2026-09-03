'use strict';

const { body, param } = require('express-validator');

const conversationIdParam = [
  param('id').isMongoId().withMessage('Invalid conversation ID'),
];

const messageRules = [
  body('content')
    .trim()
    .notEmpty().withMessage('Message is required')
    .isLength({ max: 10000 }).withMessage('Message cannot exceed 10000 characters'),
];

module.exports = { conversationIdParam, messageRules };