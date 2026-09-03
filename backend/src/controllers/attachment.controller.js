'use strict';

const attachmentService = require('../services/attachment.service');
const { sendSuccess } = require('../utils/apiResponse');

async function upload(req, res, next) {
  try {
    const attachment = await attachmentService.create(req.user._id, req.file);
    sendSuccess(res, 201, 'Attachment processed', { attachment });
  } catch (error) {
    next(error);
  }
}

module.exports = { upload };