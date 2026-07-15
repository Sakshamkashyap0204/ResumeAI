'use strict';

const { body } = require('express-validator');

const registerRules = [
  body('name').trim().notEmpty().withMessage('Name is required')
    .isLength({ min: 2, max: 50 }).withMessage('Name must be 2–50 characters'),
  body('email').trim().notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Invalid email address').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain uppercase, lowercase, and a number'),
];

const verifyEmailRules = [
  body('email').trim().notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Invalid email').normalizeEmail(),
  body('otp').trim().notEmpty().withMessage('Verification code is required')
    .isLength({ min: 6, max: 6 }).withMessage('Code must be 6 digits')
    .isNumeric().withMessage('Code must be numeric'),
];

const loginRules = [
  body('email').trim().notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Invalid email address').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required'),
];

const forgotPasswordRules = [
  body('email').trim().notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Invalid email').normalizeEmail(),
];

const resetPasswordRules = [
  body('email').trim().notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Invalid email').normalizeEmail(),
  body('otp').trim().notEmpty().withMessage('Reset code is required')
    .isLength({ min: 6, max: 6 }).withMessage('Code must be 6 digits')
    .isNumeric().withMessage('Code must be numeric'),
  body('newPassword').notEmpty().withMessage('New password is required')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain uppercase, lowercase, and a number'),
];

module.exports = { registerRules, loginRules, verifyEmailRules, forgotPasswordRules, resetPasswordRules };
