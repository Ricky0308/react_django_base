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

  passwordReset: async (email: string) => {
    return baseService.request(API_ENDPOINTS.auth.passwordReset, {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },

  passwordResetConfirm: async (uidb64: string, token: string, newPassword: string) => {
    return baseService.request(API_ENDPOINTS.auth.passwordResetConfirm, {
      method: 'POST',
      body: JSON.stringify({ uidb64, token, new_password: newPassword }),
    });
  },

  logout: async () => {
    return baseService.request(API_ENDPOINTS.auth.logout, {
      method: 'POST',
    });
  },

  activateUser: async (uidb64: string, token: string) => {
    return baseService.request(API_ENDPOINTS.auth.activateUser(uidb64, token), {
      method: 'GET',
    });
  },

  getUserInfo: async () => {
    return baseService.request(API_ENDPOINTS.auth.userInfo, {
      method: 'GET',
    });
  },

  // Add other auth-related API calls
};