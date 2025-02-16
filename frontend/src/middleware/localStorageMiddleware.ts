import { Middleware } from 'redux';
import { loginSuccess, logout } from '../features/auth/authSlice';

export const localStorageMiddleware: Middleware = store => next => action => {
  const result = next(action);

  if (loginSuccess.match(action)) {
    const user = store.getState().auth.user;
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    }
  }

  if (logout.match(action)) {
    localStorage.removeItem('user');
  }

  return result;
}; 