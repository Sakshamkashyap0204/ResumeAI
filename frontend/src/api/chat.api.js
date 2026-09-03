import api from '../lib/axios';

export const chatApi = {
  createConversation: () => api.post('/chat/conversations'),
  getConversations: () => api.get('/chat/conversations'),
  getConversation: (id) => api.get(`/chat/conversations/${id}`),
  sendMessage: (id, content) => api.post(`/chat/conversations/${id}/messages`, { content }),
  deleteConversation: (id) => api.delete(`/chat/conversations/${id}`),
};