import {
  getTokenCookie,
  removeTokenCookie,
  setTokenCookie,
} from './cookie';

export function setToken(token) {
  setTokenCookie(token);
}

export function getToken() {
  const tokenFromCookie = getTokenCookie();
  if (tokenFromCookie) {
    return tokenFromCookie;
  }

  const tokenFromStorage = localStorage.getItem('token');
  if (tokenFromStorage) {
    setTokenCookie(tokenFromStorage);
    localStorage.removeItem('token');
    return tokenFromStorage;
  }

  return null;
}

export function isAuthenticated() {
  return getToken() !== null;
}

export function clearToken() {
  removeTokenCookie();
  localStorage.removeItem('token');
}
