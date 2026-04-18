const API_BASE_URL = 'http://localhost:3005/api/v1';

async function request(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'API Request failed' }));
    throw new Error(error.message || response.statusText);
  }

  return response.json();
}

export const api = {
  getJobs: () => request('/jobs'),
  createJob: (data) => request('/jobs', { method: 'POST', body: JSON.stringify(data) }),
  getApiKeys: () => request('/api-keys'),
  createApiKey: (data) => request('/api-keys', { method: 'POST', body: JSON.stringify(data) }),
  getStats: () => request('/stats'),
};
