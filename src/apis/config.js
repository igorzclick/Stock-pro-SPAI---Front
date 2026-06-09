// src/config.js
import axios from 'axios';
import { getToken } from '../utils/authToken';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL, 
  // fallback caso a variável de ambiente não esteja configurada
});

// Intercepta todas as requisições e adiciona o token JWT (se existir)
api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);
