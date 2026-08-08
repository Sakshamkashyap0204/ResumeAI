import axios from 'axios';

// Vite proxies this path to the local backend during development. A deployed
// frontend should still provide VITE_API_URL with its production API URL.
const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || '/api' });

// Attach token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auth APIs
export const signup = (data) => api.post('/auth/signup', data);
export const verifyOTP = (data) => api.post('/auth/verify-otp', data);
export const resendOTP = (data) => api.post('/auth/resend-otp', data);
export const login = (data) => api.post('/auth/login', data);
export const updateProfile = (data) => api.put('/auth/profile', data);
export const changePassword = (data) => api.put('/auth/change-password', data);
export const deleteAccount = () => api.delete('/auth/delete-account');

// Resume APIs
export const uploadResume = (formData) =>
  api.post('/resume/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
export const getUserResumes = () => api.get('/resume');
export const analyzeResume = (data) => api.post('/resume/analyze', data);

// Results APIs
export const getUserResults = () => api.get('/results');
export const getResult = (id) => api.get(`/results/${id}`);

export default api;
