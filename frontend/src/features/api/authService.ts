import { API_ENDPOINTS } from '../../config/api';
import { baseService } from './baseService';
import { loginSuccess, logout } from '../../features/auth/authSlice';
import { store } from '../../store';

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
    try {
      await baseService.request(API_ENDPOINTS.auth.login, {
        method: 'POST',
        body: JSON.stringify(credentials),
      });
      // store user info in redux
      const userInfo = await authService.getUserInfo();
      store.dispatch(loginSuccess(userInfo));
    } catch (error) {
      store.dispatch(logout());
      throw error;
    }
  },

  signup: async (credentials: SignUpCredentials) => {
    return baseService.request(API_ENDPOINTS.auth.signup, {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },

  refresh: async () => {
    try {
      const response = await fetch(API_ENDPOINTS.auth.refresh, {
        method: 'POST',
        credentials: 'include',
      });
      if (response.ok) {
        const userInfo = await authService.getUserInfo();
        store.dispatch(loginSuccess(userInfo));
      } else {
        store.dispatch(logout());
      }
    } catch (error) {
      store.dispatch(logout());
    }
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
    try {
      await baseService.request(API_ENDPOINTS.auth.logout, {
        method: 'POST',
      });
    } finally {
      store.dispatch(logout());
    }
  },

  activateUser: async (uidb64: string, token: string) => {
    return baseService.request(API_ENDPOINTS.auth.activateUser(uidb64, token), {
      method: 'GET',
    });
  },

  getUserInfo: async () => {
    const response = await baseService.request(API_ENDPOINTS.auth.userInfo, {
      method: 'GET',
    });
    return response;
  },

  deleteUser: async () => {
    try {
      await baseService.request(API_ENDPOINTS.auth.userDelete, {
        method: 'DELETE',
      });
      store.dispatch(logout());
    } catch (error) {
      console.log(error);
      throw new Error('Failed to delete user');
    }
  },

  confirmEmailReset: async (uidb64: string, token: string) => {
    return baseService.request(API_ENDPOINTS.auth.resetEmailConfirm(uidb64, token), {
      method: 'GET',
    });
  },
};