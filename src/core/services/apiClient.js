import { API_BASE_URL } from '@/core/constants/api';

const CURRENT_TOKEN_KEY = 'auth_token';

export async function apiRequest(path, { method = 'GET', body, auth = true } = {}) {
  const token = localStorage.getItem(CURRENT_TOKEN_KEY);
  const headers = {};

  if (body !== undefined) {
    headers['Content-Type'] = 'application/json';
  }

  if (auth && token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error(`Request failed: ${method} ${path}`);
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}
