import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('sigedot_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// --- AUTH ---
export const loginService = async (email, password) => {
  const response = await api.post('/auth/login', { email, password });
  if (response.data.token) {
    localStorage.setItem('sigedot_token', response.data.token);
    localStorage.setItem('sigedot_user', JSON.stringify(response.data.user));
  }
  return response.data;
};

export const registerService = async (userData) => {
  const response = await api.post('/auth/register', userData);
  return response.data;
};

// --- CERTIFICADOS ---
export const getCertificatesService = async () => {
  const response = await api.get('/certificates');
  return response.data;
};

export const createCertificateService = async (data) => {
  const response = await api.post('/certificates', data);
  return response.data;
};

// --- USUARIOS ---
export const getUsersService = async () => {
  const response = await api.get('/users');
  return response.data;
};

// NUEVO: Función para editar usuario
export const updateUserService = async (id, data) => {
  const response = await api.put(`/users/${id}`, data);
  return response.data;
};

export const deleteUserService = async (id) => {
  const response = await api.delete(`/users/${id}`);
  return response.data;
};

export default api;