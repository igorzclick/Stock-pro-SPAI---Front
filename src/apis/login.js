import { api } from './config';

export async function loginSeller({ email, password }) {
  const response = await api.post('/auth/login', {
    email,
    password,
  });
  return response.data;
}

export function isAuthenticated() {
  return localStorage.getItem('token') !== null;
}

export function getToken() {
  return localStorage.getItem('token');
}

export function logout() {
  localStorage.removeItem('token');
}
