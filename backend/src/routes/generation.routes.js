'use strict';

const router = require('express').Router();
const generationController = require('../controllers/generation.controller');
const { generateRules, updateTitleRules, mongoIdParam } = require('../validators/generation.validator');
const { validate } = require('../middlewares/validate');
const { authenticate } = require('../middlewares/auth');
const { generationLimiter } = require('../middlewares/rateLimiter');

router.use(authenticate);

router.post('/', generationLimiter, ...generateRules, validate, generationController.generate);
router.get('/history', generationController.getHistory);
router.get('/saved', generationController.getSaved);
router.get('/:id', ...mongoIdParam, validate, generationController.getById);
router.patch('/:id/save', ...mongoIdParam, validate, generationController.toggleSave);
router.patch('/:id/title', ...mongoIdParam, ...updateTitleRules, validate, generationController.updateTitle);
router.delete('/:id', ...mongoIdParam, validate, generationController.deleteGeneration);

module.exports = router;
