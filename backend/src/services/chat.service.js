'use strict';

const Conversation = require('../models/Conversation');
const Message = require('../models/Message');
const openaiService = require('./openai.service');
const AppError = require('../utils/AppError');
const memoryService = require('./memory.service');

const MAX_CONTEXT_MESSAGES = 20;
const MAX_CONTEXT_CHARS = 24000;

function titleFromMessage(content) {
  const title = content.replace(/\s+/g, ' ').trim();
  return title.length > 60 ? `${title.slice(0, 57)}...` : title;
}

class ChatService {
  async createConversation(userId) {
    return Conversation.create({ userId, title: 'New chat' });
  }

  async listConversations(userId) {
    return Conversation.find({ userId })
      .sort({ lastMessageAt: -1 })
      .lean();
  }

  async getConversation(userId, conversationId) {
    const conversation = await Conversation.findOne({ _id: conversationId, userId }).lean();
    if (!conversation) throw new AppError('Conversation not found', 404);

    const messages = await Message.find({ conversationId, userId })
      .sort({ sequence: 1 })
      .lean();

    return { conversation, messages };
  }

  async sendMessage(userId, conversationId, content) {
    const conversation = await Conversation.findOne({ _id: conversationId, userId });
    if (!conversation) throw new AppError('Conversation not found', 404);

    const previousMessages = await Message.find({ conversationId, userId })
      .sort({ sequence: -1 })
      .limit(MAX_CONTEXT_MESSAGES)
      .lean();
    const context = previousMessages.reverse();
    const memories = await memoryService.relevant(userId, content);
    let contextChars = 0;
    const boundedContext = [];
    for (let index = context.length - 1; index >= 0; index -= 1) {
      const message = context[index];
      if (contextChars + message.content.length > MAX_CONTEXT_CHARS) break;
      boundedContext.unshift(message);
      contextChars += message.content.length;
    }

    const sequence = await Message.countDocuments({ conversationId, userId });
    const userMessage = await Message.create({
      conversationId,
      userId,
      role: 'user',
      content,
      sequence,
    });

    const rememberMatch = content.match(/^remember(?: that)?\s*[:,-]?\s*(.+)$/i);
    if (rememberMatch) await memoryService.create(userId, rememberMatch[1], 'general', conversationId);

    try {
      const response = await openaiService.chat([
        ...(memories.length ? [{ role: 'system', content: `Relevant user memories:\n${memories.map((memory) => `- ${memory.content}`).join('\n')}` }] : []),
        ...boundedContext.map(({ role, content: messageContent }) => ({ role, content: messageContent })),
        { role: 'user', content },
      ]);
      const assistantMessage = await Message.create({
        conversationId,
        userId,
        role: 'assistant',
        content: response.content,
        sequence: sequence + 1,
      });

      if (conversation.title === 'New chat') conversation.title = titleFromMessage(content);
      conversation.lastMessageAt = new Date();
      await conversation.save();

      return { conversation, messages: [userMessage, assistantMessage] };
    } catch (error) {
      await Message.deleteOne({ _id: userMessage._id });
      throw error;
    }
  }

  async deleteConversation(userId, conversationId) {
    const result = await Conversation.findOneAndDelete({ _id: conversationId, userId });
    if (!result) throw new AppError('Conversation not found', 404);
    await Message.deleteMany({ conversationId, userId });
  }
}

module.exports = new ChatService();