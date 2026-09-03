'use strict';

const router = require('express').Router();
const chatController = require('../controllers/chat.controller');
const { conversationIdParam, messageRules } = require('../validators/chat.validator');
const { validate } = require('../middlewares/validate');
const { authenticate } = require('../middlewares/auth');
const { generationLimiter } = require('../middlewares/rateLimiter');

router.use(authenticate);

router.post('/conversations', chatController.createConversation);
router.get('/conversations', chatController.listConversations);
router.get('/conversations/:id', ...conversationIdParam, validate, chatController.getConversation);
router.post(
  '/conversations/:id/messages',
  generationLimiter,
  ...conversationIdParam,
  ...messageRules,
  validate,
  chatController.sendMessage
);
router.delete('/conversations/:id', ...conversationIdParam, validate, chatController.deleteConversation);

module.exports = router;