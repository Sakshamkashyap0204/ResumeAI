'use strict';

const mongoose = require('mongoose');

const attachmentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    filename: { type: String, required: true, trim: true, maxlength: 255 },
    mimeType: { type: String, required: true },
    size: { type: Number, required: true, max: 5 * 1024 * 1024 },
    kind: { type: String, enum: ['text', 'image'], required: true },
    extractedText: { type: String, default: null, select: false },
    imageData: { type: String, default: null, select: false },
    status: { type: String, enum: ['processed', 'failed'], required: true },
    error: { type: String, default: null },
  },
  { timestamps: true }
);

attachmentSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('Attachment', attachmentSchema);