'use strict';

const generationService = require('../services/generation.service');
const { sendSuccess } = require('../utils/apiResponse');

async function generate(req, res, next) {
  try {
    const { type, prompt, parameters = {}, attachmentIds = [], conversationId = null } = req.body;
    const generation = await generationService.generate(
      req.user._id,
      type,
      prompt,
      parameters,
      attachmentIds,
      conversationId
    );
    sendSuccess(res, 201, 'Content generated successfully', { generation });
  } catch (error) {
    next(error);
  }
}

async function getHistory(req, res, next) {
  try {
    const { page, type, search } = req.query;
    const result = await generationService.getHistory(req.user._id, {
      page: parseInt(page, 10) || 1,
      type,
      search,
    });
    sendSuccess(res, 200, 'History retrieved', result);
  } catch (error) {
    next(error);
  }
}

async function getSaved(req, res, next) {
  try {
    const { page, type } = req.query;
    const result = await generationService.getSaved(req.user._id, {
      page: parseInt(page, 10) || 1,
      type,
    });
    sendSuccess(res, 200, 'Saved content retrieved', result);
  } catch (error) {
    next(error);
  }
}

async function getById(req, res, next) {
  try {
    const generation = await generationService.getById(req.user._id, req.params.id);
    sendSuccess(res, 200, 'Generation retrieved', { generation });
  } catch (error) {
    next(error);
  }
}

async function toggleSave(req, res, next) {
  try {
    const generation = await generationService.toggleSave(req.user._id, req.params.id);
    const message = generation.isSaved ? 'Content saved' : 'Content unsaved';
    sendSuccess(res, 200, message, { generation });
  } catch (error) {
    next(error);
  }
}

async function updateTitle(req, res, next) {
  try {
    const generation = await generationService.updateTitle(
      req.user._id,
      req.params.id,
      req.body.title
    );
    sendSuccess(res, 200, 'Title updated', { generation });
  } catch (error) {
    next(error);
  }
}

async function deleteGeneration(req, res, next) {
  try {
    await generationService.deleteGeneration(req.user._id, req.params.id);
    sendSuccess(res, 200, 'Generation deleted');
  } catch (error) {
    next(error);
  }
}

module.exports = {
  generate,
  getHistory,
  getSaved,
  getById,
  toggleSave,
  updateTitle,
  deleteGeneration,
};
