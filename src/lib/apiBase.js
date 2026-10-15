/**
 * Base URL for API routes. Empty string = same origin (Vercel / vercel dev).
 * Set VITE_API_BASE only if the API is hosted on another origin.
 */
export function getApiBase() {
  const base = import.meta.env.VITE_API_BASE;
  if (base === undefined || base === null || base === "") {
    return "";
  }
  return String(base).replace(/\/$/, "");
}

export function apiUrl(path) {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${getApiBase()}${normalized}`;
}
