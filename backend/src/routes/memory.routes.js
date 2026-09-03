'use strict';

const router = require('express').Router();
const { body, param } = require('express-validator');
const memoryController = require('../controllers/memory.controller');
const { authenticate } = require('../middlewares/auth');
const { validate } = require('../middlewares/validate');

router.use(authenticate);
router.get('/', memoryController.list);
router.post('/', [body('content').trim().isLength({ min: 3, max: 500 }), body('category').optional().isIn(['preference', 'character', 'project', 'general'])], validate, memoryController.create);
router.delete('/', memoryController.clear);
router.delete('/:id', [param('id').isMongoId().withMessage('Invalid memory ID')], validate, memoryController.remove);

module.exports = router;