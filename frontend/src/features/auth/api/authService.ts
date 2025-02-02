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
    return baseService.request(API_ENDPOINTS.auth.login, {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },

  signup: async (credentials: SignUpCredentials) => {
    return baseService.request(API_ENDPOINTS.auth.signup, {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },

  refresh: async () => {
    return baseService.request(API_ENDPOINTS.auth.refresh, {
      method: 'POST',
    });
  },

  // Add other auth-related API calls
};