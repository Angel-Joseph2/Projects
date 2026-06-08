import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080',
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

// Attach token/admin info from localStorage to every request if present
api.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  const admin = JSON.parse(localStorage.getItem('admin') || 'null');
  const token = user?.token || admin?.token;
  
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

// Global response error handler
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      // Only redirect if we are not already on the login page
      if (window.location.pathname !== '/login') {
        localStorage.removeItem('user');
        localStorage.removeItem('admin');
        window.location.href = '/login';
      }
    }
    return Promise.reject(err);
  }
);

export default api;
