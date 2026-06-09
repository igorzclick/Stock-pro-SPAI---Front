const TOKEN_KEY = 'token';
const DEFAULT_MAX_AGE_SECONDS = 60 * 60 * 24 * 7;

export function setTokenCookie(token, maxAgeSeconds = DEFAULT_MAX_AGE_SECONDS) {
  const secure = window.location.protocol === 'https:' ? '; Secure' : '';
  document.cookie = `${TOKEN_KEY}=${encodeURIComponent(token)}; path=/; max-age=${maxAgeSeconds}; SameSite=Lax${secure}`;
}

export function getTokenCookie() {
  const tokenCookie = document.cookie
    .split('; ')
    .find((row) => row.startsWith(`${TOKEN_KEY}=`));

  if (!tokenCookie) {
    return null;
  }

  return decodeURIComponent(tokenCookie.slice(TOKEN_KEY.length + 1));
}

export function removeTokenCookie() {
  const secure = window.location.protocol === 'https:' ? '; Secure' : '';
  document.cookie = `${TOKEN_KEY}=; path=/; max-age=0; SameSite=Lax${secure}`;
}
