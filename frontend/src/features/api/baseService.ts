import { fetchCSRFToken } from './csrfTokenManager';
import { MESSAGES } from '../../utils/messages';
import { authService } from '../auth/api/authService';

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

    let response = await fetch(url, {
      ...options,
      headers,
      credentials: 'include',
    });

    // If 401 is returned due to access token expiration etc.
    if (response.status === 401) {
      try {
        // Refresh token
        await authService.refresh();

        // Re-request after refresh
        const refreshedResponse = await fetch(url, {
          ...options,
          headers,
          credentials: 'include',
        });
        response = refreshedResponse;
      } catch (error) {
        // Add processing such as guiding to logout process when refresh fails
        // throw new Error('Refresh failed. Please login again.');
        console.error('Refresh token failed:');
        throw error;
      }
    }

    return this.handleResponse(response);
  },

  handleResponse: async (response: Response) => {
    if (!response.ok) {
      throw new Error(MESSAGES.general.apiError(response.status));
    }
    return response.json();
  },
}; 