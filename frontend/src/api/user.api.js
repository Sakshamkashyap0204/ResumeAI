import api from '../lib/axios';

export const userApi = {
  getProfile: () => api.get('/users/me'),
  getStats: () => api.get('/users/me/stats'),
  updateProfile: (data) => api.patch('/users/me', data),
  changePassword: (data) => api.patch('/users/me/password', data),
};
