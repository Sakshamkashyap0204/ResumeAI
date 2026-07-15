import api from '../lib/axios';

export const generationApi = {
  generate: (data) => api.post('/generations', data),
  getHistory: (params) => api.get('/generations/history', { params }),
  getSaved: (params) => api.get('/generations/saved', { params }),
  getById: (id) => api.get(`/generations/${id}`),
  toggleSave: (id) => api.patch(`/generations/${id}/save`),
  updateTitle: (id, title) => api.patch(`/generations/${id}/title`, { title }),
  delete: (id) => api.delete(`/generations/${id}`),
};
