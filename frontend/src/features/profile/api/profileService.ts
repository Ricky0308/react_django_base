import { API_ENDPOINTS } from '../../../config/api';
import { baseService } from '../../api/baseService';

export const profileService = {
  hello: async () => {
    return baseService.request(API_ENDPOINTS.profile.hello, {
      method: 'GET',
    });
  },
}; 