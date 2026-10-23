export const API_ORIGIN = "https://dogandme.vercel.app";

export function apiUrl(path: string) {
  const normalizedPath = path.length > 1 && path.endsWith("/") ? path.slice(0, -1) : path;
  if (typeof window !== "undefined" && window.location.origin === API_ORIGIN) return normalizedPath;
  return `${API_ORIGIN}${normalizedPath}`;
}
