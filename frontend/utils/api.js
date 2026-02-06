import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor to add token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Unauthorized - clear token and redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (data) => api.post('/api/auth/register', data),
  login: (data) => api.post('/api/auth/login', data),
  getCurrentUser: () => api.get('/api/auth/me')
};

// Notes API
export const notesAPI = {
  getAll: (params) => api.get('/api/notes', { params }),
  getOne: (id) => api.get(`/api/notes/${id}`),
  create: (data) => api.post('/api/notes', data),
  update: (id, data) => api.put(`/api/notes/${id}`, data),
  delete: (id) => api.delete(`/api/notes/${id}`)
};

// Bookmarks API
export const bookmarksAPI = {
  getAll: (params) => api.get('/api/bookmarks', { params }),
  getOne: (id) => api.get(`/api/bookmarks/${id}`),
  create: (data) => api.post('/api/bookmarks', data),
  update: (id, data) => api.put(`/api/bookmarks/${id}`, data),
  delete: (id) => api.delete(`/api/bookmarks/${id}`)
};

export default api;
