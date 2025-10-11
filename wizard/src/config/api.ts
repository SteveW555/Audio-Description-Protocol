const rawBaseUrl = (import.meta.env.VITE_API_BASE_URL || '').trim();
const sanitizedBaseUrl = rawBaseUrl.replace(/\/+$/, '');

function normalizePath(path: string): string {
  if (!path) {
    return '/';
  }
  return path.startsWith('/') ? path : `/${path}`;
}

export function buildApiUrl(path: string): string {
  const normalizedPath = normalizePath(path);

  if (!sanitizedBaseUrl) {
    return normalizedPath;
  }

  return `${sanitizedBaseUrl}${normalizedPath}`;
}

export const API_BASE_URL = sanitizedBaseUrl;
