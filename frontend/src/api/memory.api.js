import api from '../lib/axios';

export const memoryApi = {
  list: () => api.get('/memories'),
  create: (content, category = 'general') => api.post('/memories', { content, category }),
  remove: (id) => api.delete(`/memories/${id}`),
  clear: () => api.delete('/memories'),
};