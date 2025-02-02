import { fetchCSRFToken } from './csrfTokenManager';
import { MESSAGES } from '../../utils/messages';

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
      throw new Error(MESSAGES.general.apiError(response.status));
    }
    return response.json();
  },
}; 