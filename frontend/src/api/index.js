import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || (window.location.hostname === 'localhost' ? 'http://localhost:5000/api' : '/api');

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authApi = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
};

export const userApi = {
  getAll: () => api.get('/users'),
  delete: (id) => api.delete(`/users/${id}`),
};

export const productApi = {
  getAll: () => api.get('/products'),
  create: (data) => api.post('/products', data),
  update: (id, data) => api.put(`/products/${id}`, data),
  delete: (id) => api.delete(`/products/${id}`),
  getLowStock: (threshold = 10) => api.get('/products', { params: { low_stock: true, threshold } }), // Assuming we might add this filter or just use filter on frontend
};

export const transactionApi = {
  create: (data) => api.post('/transactions', data),
  getAll: (limit = 10) => api.get('/transactions', { params: { limit } }),
  getSummary: (date) => api.get('/transactions/daily-summary', { params: { date } }),
};

export default api;
