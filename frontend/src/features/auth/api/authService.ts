import { API_ENDPOINTS } from '../../../config/api';
import { baseService } from '../../api/baseService';
import { loginSuccess, logout } from '../authSlice';
import { store } from '../../../store';

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
      const userInfo = await authService.getUserInfo();
      store.dispatch(loginSuccess({ id: userInfo.id }));
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
      await baseService.request(API_ENDPOINTS.auth.refresh, {
        method: 'POST',
      });
      const userInfo = await authService.getUserInfo();
      store.dispatch(loginSuccess({ id: userInfo.id }));
    } catch (error) {
      store.dispatch(logout());
      throw error;
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
    store.dispatch(loginSuccess({
      id: response.id,
      email: response.email,
      username: response.username,
    }));
  },
};