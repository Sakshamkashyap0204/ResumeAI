'use strict';

const path = require('path');
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');
const Attachment = require('../models/Attachment');
const AppError = require('../utils/AppError');

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const MAX_TEXT_LENGTH = 12000;
const ALLOWED_TYPES = new Map([
  ['text/plain', { extension: '.txt', kind: 'text' }],
  ['application/pdf', { extension: '.pdf', kind: 'text' }],
  ['application/vnd.openxmlformats-officedocument.wordprocessingml.document', { extension: '.docx', kind: 'text' }],
  ['image/png', { extension: '.png', kind: 'image' }],
  ['image/jpeg', { extension: '.jpg', kind: 'image' }],
  ['image/webp', { extension: '.webp', kind: 'image' }],
]);

function hasValidSignature(buffer, mimeType) {
  if (mimeType === 'application/pdf') return buffer.subarray(0, 4).toString() === '%PDF';
  if (mimeType.includes('wordprocessingml')) return buffer.subarray(0, 2).toString('hex') === '504b';
  if (mimeType === 'image/png') return buffer.subarray(0, 8).toString('hex') === '89504e470d0a1a0a';
  if (mimeType === 'image/jpeg') return buffer.subarray(0, 3).toString('hex') === 'ffd8ff';
  if (mimeType === 'image/webp') return buffer.subarray(0, 4).toString() === 'RIFF' && buffer.subarray(8, 12).toString() === 'WEBP';
  return true;
}

async function extractText(file, mimeType) {
  if (mimeType === 'text/plain') return file.buffer.toString('utf8');
  if (mimeType === 'application/pdf') return (await pdfParse(file.buffer)).text;
  if (mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
    return (await mammoth.extractRawText({ buffer: file.buffer })).value;
  }
  throw new AppError('This document type is not supported for text extraction.', 415);
}

class AttachmentService {
  async create(userId, file) {
    if (!file) throw new AppError('Attachment is required', 400);
    if (file.size > MAX_FILE_SIZE) throw new AppError('Attachment cannot exceed 5 MB', 413);

    const definition = ALLOWED_TYPES.get(file.mimetype);
    const extension = path.extname(file.originalname).toLowerCase();
    if (!definition || definition.extension !== extension) {
      throw new AppError('Unsupported or mismatched attachment type', 415);
    }
    if (!hasValidSignature(file.buffer, file.mimetype)) {
      throw new AppError('Attachment content does not match its declared type', 415);
    }

    try {
      const values = {
        userId,
        filename: path.basename(file.originalname),
        mimeType: file.mimetype,
        size: file.size,
        kind: definition.kind,
        status: 'processed',
      };
      if (definition.kind === 'text') {
        values.extractedText = (await extractText(file, file.mimetype)).trim().slice(0, MAX_TEXT_LENGTH);
        if (!values.extractedText) throw new AppError('No readable text was found in this attachment', 422);
      } else {
        values.imageData = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
      }
      return Attachment.create(values);
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Attachment could not be processed', 422);
    }
  }

  async getOwned(userId, ids) {
    const attachments = await Attachment.find({ userId, _id: { $in: ids }, status: 'processed' })
      .select('+extractedText +imageData')
      .lean();
    if (attachments.length !== ids.length) throw new AppError('One or more attachments were not found', 404);
    return attachments;
  }
}

module.exports = new AttachmentService();