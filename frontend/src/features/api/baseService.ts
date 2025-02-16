import { fetchCSRFToken } from './csrfTokenManager';
import { MESSAGES } from '../../utils/messages';
import { authService } from '../auth/api/authService';
import { loginSuccess, logout } from '../auth/authSlice';
import { store } from '../../store';
import { API_ENDPOINTS } from '../../config/api';

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
        
        // proceed to get user info only if refresh is successful
        if (refreshedResponse.status === 200) {
          const userInfoResponse = await fetch(API_ENDPOINTS.auth.userInfo, {
            headers,
            credentials: 'include',
          });
          if (userInfoResponse.status === 200) {
            const userInfo = await userInfoResponse.json();
            store.dispatch(loginSuccess(userInfo));
          }
        } else {
          store.dispatch(logout());
        }

      } catch (error) {
        // Add processing such as guiding to logout process when refresh fails
        // throw new Error('Refresh failed. Please login again.');
        store.dispatch(logout());
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