import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour ajouter le token JWT
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Intercepteur pour gérer les erreurs
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Helper pour extraire les données d'une réponse API
const extractData = (response) => response?.data || response || [];

// Auth
export const authAPI = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
  getProfile: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/me', data),
  changePassword: (data) => api.post('/auth/change-password', data),
};

// Users
export const usersAPI = {
  getAll: () => api.get('/users').then(extractData),
  getById: (id) => api.get(`/users/${id}`).then(extractData),
  create: (data) => api.post('/users', data).then(extractData),
  update: (id, data) => api.put(`/users/${id}`, data).then(extractData),
  delete: (id) => api.delete(`/users/${id}`),
};

// Categories
export const categoriesAPI = {
  getAll: () => api.get('/categories').then(extractData),
  getById: (id) => api.get(`/categories/${id}`).then(extractData),
  create: (data) => api.post('/categories', data).then(extractData),
  update: (id, data) => api.put(`/categories/${id}`, data).then(extractData),
  delete: (id) => api.delete(`/categories/${id}`),
};

// Components
export const componentsAPI = {
  getAll: () => api.get('/components').then(extractData),
  getById: (id) => api.get(`/components/${id}`).then(extractData),
  create: (data) => api.post('/components', data).then(extractData),
  update: (id, data) => api.put(`/components/${id}`, data).then(extractData),
  delete: (id) => api.delete(`/components/${id}`),
};

// Partners
export const partnersAPI = {
  getAll: () => api.get('/partners').then(extractData),
  getById: (id) => api.get(`/partners/${id}`).then(extractData),
  create: (data) => api.post('/partners', data).then(extractData),
  update: (id, data) => api.put(`/partners/${id}`, data).then(extractData),
  delete: (id) => api.delete(`/partners/${id}`),
};

// Partner Prices
export const partnerPricesAPI = {
  getAll: () => api.get('/partner-prices').then(extractData),
  getByComponent: (componentId) => api.get(`/partner-prices/component/${componentId}`).then(extractData),
  create: (data) => api.post('/partner-prices', data).then(extractData),
  update: (id, data) => api.put(`/partner-prices/${id}`, data).then(extractData),
  delete: (id) => api.delete(`/partner-prices/${id}`),
};

// Configurations
export const configurationsAPI = {
  getAll: () => api.get('/configurations').then(extractData),
  getAllAdmin: () => api.get('/configurations/all').then(extractData),
  getById: (id) => api.get(`/configurations/${id}`).then(extractData),
  create: (data) => api.post('/configurations', data).then(extractData),
  update: (id, data) => api.put(`/configurations/${id}`, data).then(extractData),
  addComponent: (id, data) => api.post(`/configurations/${id}/components`, data).then(extractData),
  delete: (id) => api.delete(`/configurations/${id}`),
};

export default api;
