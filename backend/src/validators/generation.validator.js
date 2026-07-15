'use strict';

const { body, param } = require('express-validator');

const generateRules = [
  body('type')
    .notEmpty().withMessage('Content type is required')
    .isIn(['story', 'poem', 'joke']).withMessage('Type must be story, poem, or joke'),

  body('prompt')
    .trim()
    .notEmpty().withMessage('Prompt is required')
    .isLength({ min: 3, max: 1000 }).withMessage('Prompt must be 3–1000 characters'),

  body('parameters.length')
    .optional()
    .isIn(['short', 'medium', 'long']).withMessage('Length must be short, medium, or long'),

  body('parameters.genre')
    .optional()
    .trim()
    .isLength({ max: 50 }).withMessage('Genre cannot exceed 50 characters'),

  body('parameters.tone')
    .optional()
    .trim()
    .isLength({ max: 50 }).withMessage('Tone cannot exceed 50 characters'),

  body('parameters.style')
    .optional()
    .trim()
    .isLength({ max: 50 }).withMessage('Style cannot exceed 50 characters'),
];

const updateTitleRules = [
  body('title')
    .trim()
    .notEmpty().withMessage('Title is required')
    .isLength({ max: 100 }).withMessage('Title cannot exceed 100 characters'),
];

const mongoIdParam = [
  param('id').isMongoId().withMessage('Invalid ID format'),
];

module.exports = { generateRules, updateTitleRules, mongoIdParam };
