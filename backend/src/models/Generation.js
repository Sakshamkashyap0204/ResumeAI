'use strict';

const mongoose = require('mongoose');

const CONTENT_TYPES = ['story', 'poem', 'joke'];

const generationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: CONTENT_TYPES,
      required: true,
    },
    prompt: {
      type: String,
      required: true,
      trim: true,
      maxlength: [1000, 'Prompt cannot exceed 1000 characters'],
    },
    content: {
      type: String,
      required: true,
    },
    parameters: {
      genre: { type: String, default: null },
      tone: { type: String, default: null },
      length: { type: String, enum: ['short', 'medium', 'long'], default: 'medium' },
      style: { type: String, default: null },
    },
    metadata: {
      model: { type: String, required: true },
      tokensUsed: { type: Number, default: 0 },
      generationTimeMs: { type: Number, default: 0 },
    },
    isSaved: {
      type: Boolean,
      default: false,
      index: true,
    },
    title: {
      type: String,
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
      default: null,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true, versionKey: false },
  }
);

generationSchema.index({ userId: 1, createdAt: -1 });
generationSchema.index({ userId: 1, type: 1 });
generationSchema.index({ userId: 1, isSaved: 1 });

module.exports = mongoose.model('Generation', generationSchema);
