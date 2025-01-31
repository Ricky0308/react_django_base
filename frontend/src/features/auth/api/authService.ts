import { API_ENDPOINTS } from '../../../config/api';
import { baseService } from '../../api/baseService';

interface LoginCredentials {
  email: string;
  password: string;
}

interface SignUpCredentials {
  email: string;
  password: string;
}

export const authService = {
  login: async (credentials: LoginCredentials) => {
    const response = await fetch(API_ENDPOINTS.auth.login, {
      method: 'POST',
      headers: baseService.headers,
      body: JSON.stringify(credentials),
      credentials: 'include'
    });

    return baseService.handleResponse(response);
  },

  signup: async (credentials: SignUpCredentials) => {
    const response = await fetch(API_ENDPOINTS.auth.signup, {
      method: 'POST',
      headers: baseService.headers,
      body: JSON.stringify(credentials),
    });

    return baseService.handleResponse(response);
  },

  refresh: async () => {
    const response = await fetch(API_ENDPOINTS.auth.refresh, {
      method: 'POST',
      headers: baseService.headers,
      credentials: 'include'
    });

    return baseService.handleResponse(response);
  },

  // Add other auth-related API calls
};