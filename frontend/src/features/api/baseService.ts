import { fetchCSRFToken } from './csrfTokenManager';

export const baseService = {
  headers: {
    'Content-Type': 'application/json',
  },

  async request(url: string, options: RequestInit = {}) {
    const csrfToken = await fetchCSRFToken();
    const headers = {
      ...this.headers,
      'X-CSRFTOKEN': csrfToken || '',
      // 'X-CSRFTOKEN': '1234567890',
      ...options.headers,
    };

    const response = await fetch(url, {
      ...options,
      headers,
      credentials: 'include',
    });

    return this.handleResponse(response);
  },

  handleResponse: async (response: Response) => {
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    return response.json();
  },
}; 