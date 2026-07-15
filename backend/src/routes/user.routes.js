'use strict';

const router = require('express').Router();
const userController = require('../controllers/user.controller');
const { authenticate } = require('../middlewares/auth');
const { body } = require('express-validator');
const { validate } = require('../middlewares/validate');

router.use(authenticate);

router.get('/me', userController.getProfile);
router.get('/me/stats', userController.getStats);

router.patch(
  '/me',
  [
    body('name').optional().trim().isLength({ min: 2, max: 50 }).withMessage('Name must be 2–50 characters'),
    body('bio').optional().trim().isLength({ max: 200 }).withMessage('Bio cannot exceed 200 characters'),
  ],
  validate,
  userController.updateProfile
);

router.patch(
  '/me/password',
  [
    body('currentPassword').notEmpty().withMessage('Current password is required'),
    body('newPassword')
      .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
      .withMessage('Password must contain uppercase, lowercase, and a number'),
  ],
  validate,
  userController.changePassword
);

module.exports = router;
