import { API_ENDPOINTS } from '../../../config/api';
import { baseService } from '../../api/baseService';

interface UserUpdateData {
  email?: string;
  first_name?: string;
  last_name?: string;
}

export const userService = {
  list: async () => {
    const response = await fetch(API_ENDPOINTS.user.list, {
      method: 'GET',
      headers: baseService.headers,
      credentials: 'include'
    });

    return baseService.handleResponse(response);
  },

  getDetails: async (userId: string) => {
    const response = await fetch(API_ENDPOINTS.user.detail(userId), {
      method: 'GET',
      headers: baseService.headers,
      credentials: 'include'
    });

    return baseService.handleResponse(response);
  },

  update: async (userId: string, data: UserUpdateData) => {
    const response = await fetch(API_ENDPOINTS.user.update(userId), {
      method: 'PATCH',
      headers: baseService.headers,
      body: JSON.stringify(data),
      credentials: 'include'
    });

    return baseService.handleResponse(response);
  },
}; 