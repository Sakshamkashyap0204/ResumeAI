'use strict';

const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema(
  {
    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Conversation',
      required: true,
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    role: {
      type: String,
      enum: ['user', 'assistant'],
      required: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
      maxlength: [10000, 'Message cannot exceed 10000 characters'],
    },
    sequence: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

messageSchema.index({ conversationId: 1, sequence: 1 }, { unique: true });

module.exports = mongoose.model('Message', messageSchema);