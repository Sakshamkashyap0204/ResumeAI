'use strict';

const chatService = require('../services/chat.service');
const { sendSuccess } = require('../utils/apiResponse');

async function createConversation(req, res, next) {
  try {
    const conversation = await chatService.createConversation(req.user._id);
    sendSuccess(res, 201, 'Conversation created', { conversation });
  } catch (error) {
    next(error);
  }
}

async function listConversations(req, res, next) {
  try {
    const conversations = await chatService.listConversations(req.user._id);
    sendSuccess(res, 200, 'Conversations retrieved', { conversations });
  } catch (error) {
    next(error);
  }
}

async function getConversation(req, res, next) {
  try {
    const result = await chatService.getConversation(req.user._id, req.params.id);
    sendSuccess(res, 200, 'Conversation retrieved', result);
  } catch (error) {
    next(error);
  }
}

async function sendMessage(req, res, next) {
  try {
    const result = await chatService.sendMessage(req.user._id, req.params.id, req.body.content);
    sendSuccess(res, 201, 'Message sent', result);
  } catch (error) {
    next(error);
  }
}

async function deleteConversation(req, res, next) {
  try {
    await chatService.deleteConversation(req.user._id, req.params.id);
    sendSuccess(res, 200, 'Conversation deleted');
  } catch (error) {
    next(error);
  }
}

module.exports = { createConversation, listConversations, getConversation, sendMessage, deleteConversation };