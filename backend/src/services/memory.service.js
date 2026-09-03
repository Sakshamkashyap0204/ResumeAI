'use strict';

const Memory = require('../models/Memory');
const AppError = require('../utils/AppError');

function terms(value) {
  return new Set(value.toLowerCase().split(/[^a-z0-9]+/).filter((word) => word.length > 3));
}

class MemoryService {
  async list(userId) {
    return Memory.find({ userId }).sort({ updatedAt: -1 }).lean();
  }

  async relevant(userId, request) {
    const requestTerms = terms(request);
    const memories = await Memory.find({ userId }).sort({ updatedAt: -1 }).lean();
    return memories
      .map((memory) => ({ memory, score: [...terms(memory.content)].filter((term) => requestTerms.has(term)).length }))
      .filter(({ score }) => score > 0)
      .sort((left, right) => right.score - left.score)
      .slice(0, 5)
      .map(({ memory }) => memory);
  }

  async create(userId, content, category, sourceConversationId = null) {
    return Memory.create({ userId, content, category, sourceConversationId });
  }

  async remove(userId, id) {
    const result = await Memory.findOneAndDelete({ _id: id, userId });
    if (!result) throw new AppError('Memory not found', 404);
  }

  async clear(userId) {
    await Memory.deleteMany({ userId });
  }
}

module.exports = new MemoryService();