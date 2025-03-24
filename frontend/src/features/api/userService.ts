import { API_ENDPOINTS } from '../../config/api';
import { baseService } from './baseService';

interface UserUpdateData {
  email?: string;
  first_name?: string;
  last_name?: string;
}

export const userService = {
  list: async () => {
    return baseService.request(API_ENDPOINTS.user.list, {
      method: 'GET',
    });
  },

  getDetails: async (userId: string) => {
    return baseService.request(API_ENDPOINTS.user.detail(userId), {
      method: 'GET',
    });
  },

  update: async (userId: string, data: UserUpdateData) => {
    return baseService.request(API_ENDPOINTS.user.update(userId), {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },
}; 