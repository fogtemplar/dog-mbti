const SESSION_KEY = "dogandme-session";

export function getSessionToken() {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(SESSION_KEY);
}

export function setSessionToken(token: string) {
  window.localStorage.setItem(SESSION_KEY, token);
}

export function clearSessionToken() {
  window.localStorage.removeItem(SESSION_KEY);
}

export function authHeaders(headers?: HeadersInit) {
  const result = new Headers(headers);
  const token = getSessionToken();
  if (token) result.set("Authorization", `Bearer ${token}`);
  return result;
}
