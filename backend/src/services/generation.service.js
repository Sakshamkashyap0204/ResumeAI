'use strict';

const Generation = require('../models/Generation');
const User = require('../models/User');
const openaiService = require('./openai.service');
const AppError = require('../utils/AppError');
const attachmentService = require('./attachment.service');
const Conversation = require('../models/Conversation');
const Message = require('../models/Message');
const memoryService = require('./memory.service');

const PAGE_SIZE = 10;

class GenerationService {
  async generate(userId, type, prompt, parameters, attachmentIds = [], conversationId = null) {
    const startTime = Date.now();
    const attachments = attachmentIds.length ? await attachmentService.getOwned(userId, attachmentIds) : [];
    const memories = await memoryService.relevant(userId, prompt);
    let conversationContext = [];
    if (conversationId) {
      const conversation = await Conversation.findOne({ _id: conversationId, userId }).lean();
      if (!conversation) throw new AppError('Conversation not found', 404);
      conversationContext = await Message.find({ conversationId, userId })
        .sort({ sequence: -1 })
        .limit(20)
        .select('role content -_id')
        .lean();
      conversationContext.reverse();
    }

    const { content, tokensUsed, model } = await openaiService.generate(
      type,
      prompt,
      parameters,
      attachments,
      conversationContext,
      memories
    );

    const generationTimeMs = Date.now() - startTime;

    const [generation] = await Promise.all([
      Generation.create({
        userId,
        type,
        prompt,
        content,
        parameters,
        metadata: { model, tokensUsed, generationTimeMs },
      }),
      User.findByIdAndUpdate(userId, { $inc: { generationCount: 1 } }),
    ]);

    return generation;
  }

  async getHistory(userId, { page = 1, type, search } = {}) {
    const filter = { userId };
    if (type) filter.type = type;
    if (search) filter.$text = { $search: search };

    const skip = (page - 1) * PAGE_SIZE;

    const [items, total] = await Promise.all([
      Generation.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(PAGE_SIZE)
        .lean(),
      Generation.countDocuments(filter),
    ]);

    return {
      items,
      pagination: {
        page,
        pageSize: PAGE_SIZE,
        total,
        totalPages: Math.ceil(total / PAGE_SIZE),
      },
    };
  }

  async getSaved(userId, { page = 1, type } = {}) {
    const filter = { userId, isSaved: true };
    if (type) filter.type = type;

    const skip = (page - 1) * PAGE_SIZE;

    const [items, total] = await Promise.all([
      Generation.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(PAGE_SIZE)
        .lean(),
      Generation.countDocuments(filter),
    ]);

    return {
      items,
      pagination: {
        page,
        pageSize: PAGE_SIZE,
        total,
        totalPages: Math.ceil(total / PAGE_SIZE),
      },
    };
  }

  async toggleSave(userId, generationId) {
    const generation = await Generation.findOne({ _id: generationId, userId });
    if (!generation) {
      throw new AppError('Generation not found', 404);
    }

    generation.isSaved = !generation.isSaved;
    await generation.save();
    return generation;
  }

  async updateTitle(userId, generationId, title) {
    const generation = await Generation.findOneAndUpdate(
      { _id: generationId, userId },
      { title },
      { new: true, runValidators: true }
    );

    if (!generation) throw new AppError('Generation not found', 404);
    return generation;
  }

  async deleteGeneration(userId, generationId) {
    const result = await Generation.findOneAndDelete({ _id: generationId, userId });
    if (!result) throw new AppError('Generation not found', 404);
  }

  async getById(userId, generationId) {
    const generation = await Generation.findOne({ _id: generationId, userId });
    if (!generation) throw new AppError('Generation not found', 404);
    return generation;
  }
}

module.exports = new GenerationService();
