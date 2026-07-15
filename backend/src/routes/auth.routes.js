'use strict';

const router = require('express').Router();
const authController = require('../controllers/auth.controller');
const { registerRules, loginRules, verifyEmailRules, forgotPasswordRules, resetPasswordRules } = require('../validators/auth.validator');
const { validate } = require('../middlewares/validate');
const { authLimiter } = require('../middlewares/rateLimiter');

router.post('/register', authLimiter, ...registerRules, validate, authController.register);
router.post('/verify-email', authLimiter, ...verifyEmailRules, validate, authController.verifyEmail);
router.post('/resend-otp', authLimiter, validate, authController.resendOtp);
router.post('/login', authLimiter, ...loginRules, validate, authController.login);
router.post('/forgot-password', authLimiter, ...forgotPasswordRules, validate, authController.forgotPassword);
router.post('/reset-password', authLimiter, ...resetPasswordRules, validate, authController.resetPassword);
router.post('/refresh', authController.refresh);
router.post('/logout', authController.logout);

module.exports = router;
