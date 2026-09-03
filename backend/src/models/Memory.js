'use strict';

const mongoose = require('mongoose');

const memorySchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    content: { type: String, required: true, trim: true, maxlength: 500 },
    category: { type: String, enum: ['preference', 'character', 'project', 'general'], default: 'general' },
    sourceConversationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Conversation', default: null },
  },
  { timestamps: true }
);

memorySchema.index({ userId: 1, updatedAt: -1 });

module.exports = mongoose.model('Memory', memorySchema);