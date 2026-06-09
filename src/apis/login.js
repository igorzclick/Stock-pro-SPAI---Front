import { api } from './config';
import { clearToken, getToken, isAuthenticated, setToken } from '../utils/authToken';

export async function loginSeller({ email, password }) {
  const response = await api.post('/auth/login', {
    email,
    password,
  });
  return response.data;
}

export { setToken, getToken, isAuthenticated };

export function logout() {
  clearToken();
}
