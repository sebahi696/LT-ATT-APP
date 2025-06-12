import axios from 'axios';

const isDevelopment = process.env.NODE_ENV === 'development';
const isNgrok = window.location.hostname.includes('ngrok-free.app');

// Configure the base URL for API requests
const baseURL = isNgrok 
  ? `${window.location.protocol}//${window.location.hostname}`  // Use the same ngrok domain
  : isDevelopment 
    ? 'http://localhost:5001' 
    : 'https://lt-att-backend.onrender.com';

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['x-auth-token'] = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;

// API Configuration
const API_BASE_URL = isNgrok
  ? window.location.href.replace(/https:\/\/[^/]+/, 'https://04f5-94-187-2-59.ngrok-free.app')
  : isDevelopment 
    ? 'http://localhost:5001'
    : 'https://lt-att-backend.onrender.com';

export const getApiUrl = (endpoint: string) => `${API_BASE_URL}${endpoint}`; 