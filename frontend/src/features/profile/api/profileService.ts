import { API_ENDPOINTS } from '../../../config/api';
import { baseService } from '../../api/baseService';

export const profileService = {
  hello: async () => {
    const response = await fetch(API_ENDPOINTS.profile.hello, {
      method: 'GET',
      headers: baseService.headers,
      credentials: 'include'
    });

    return baseService.handleResponse(response);
  },
}; 