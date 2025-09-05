// Simple helpers to build API URLs and call fetch with a base URL
// The base URL is configured via Vite env: VITE_API_BASE_URL

const API_BASE = (import.meta.env.VITE_API_BASE_URL || "").trim();

export function apiUrl(path = "") {
  if (!path) return API_BASE || "";
  // If full URL already, return as-is
  if (/^https?:\/\//i.test(path)) return path;
  // If no base configured, return the original path unchanged
  if (!API_BASE) return path;
  const base = API_BASE.replace(/\/+$/, "");
  const rel = String(path).replace(/^\/+/, "");
  return `${base}/${rel}`;
}

export function apiFetch(path, options) {
  return fetch(apiUrl(path), options);
}
