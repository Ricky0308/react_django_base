export const API_BASE_URL = 'http://localhost:8000';

export const API_ENDPOINTS = {
  auth: {
    login: `${API_BASE_URL}/auth/token/`,
    refresh: `${API_BASE_URL}/auth/token/refresh/`,
    signup: `${API_BASE_URL}/auth/sign-up/`,
    userDelete: `${API_BASE_URL}/auth/user-delete/`,
    passwordReset: `${API_BASE_URL}/auth/password-reset/`,
    passwordResetConfirm: `${API_BASE_URL}/auth/password-reset-confirm/`,
    logout: `${API_BASE_URL}/auth/sign-out/`,
    activateUser: (uidb64: string, token: string) => `${API_BASE_URL}/auth/user-activate/${uidb64}/${token}/`,
    userInfo: `${API_BASE_URL}/auth/user-info/`,
    resetEmail: `${API_BASE_URL}/auth/reset-email/`,
  },
  csrf: {
    get: `${API_BASE_URL}/csrf/`,
  },
  user: {
    // From AuthUserViewSet
    list: `${API_BASE_URL}/auth/user/`,
    detail: (userId: string) => `${API_BASE_URL}/auth/user/${userId}/`,
    update: (userId: string) => `${API_BASE_URL}/auth/user/${userId}/`,
  },
  profile: {
    hello: `${API_BASE_URL}/profile/hello/`,
    // Add other profile endpoints
  },
  // Add other API endpoint categories
}; 