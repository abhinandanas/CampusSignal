/**
 * CampusSignal — Shared Frontend API Client Utility
 * Handles baseUrl resolution, JSON response unwrapping, and structured error propagation.
 */

const API_BASE_URL = (process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api').replace(/\/$/, '');

export async function request(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
  
  const headers = {
    Accept: 'application/json',
    ...(options.body ? { 'Content-Type': 'application/json' } : {}),
    ...(options.headers || {}),
  };

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    const body = await response.json().catch(() => null);

    if (!response.ok) {
      const details = Array.isArray(body?.details) ? body.details.join(' ') : '';
      const message = [body?.message, details].filter(Boolean).join(': ') || `Request failed with status ${response.status}`;
      const error = new Error(message);
      error.status = response.status;
      error.data = body;
      throw error;
    }

    return body;
  } catch (err) {
    if (err.name === 'AbortError') {
      throw err;
    }
    // Propagate already formatted error or wrap network disconnects
    if (err.status) throw err;
    const networkError = new Error(err.message || 'Unable to connect to the CampusSignal API service.');
    networkError.status = 0;
    throw networkError;
  }
}

export { API_BASE_URL };
