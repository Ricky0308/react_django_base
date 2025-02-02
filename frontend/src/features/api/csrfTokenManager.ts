import { API_ENDPOINTS } from '../../config/api';
import Cookies from 'js-cookie';

/**
 * CSRF Token Manager
 * 
 * This module handles CSRF token management for API requests.
 * It fetches a new CSRF token from the server only when necessary:
 * - When there is no CSRF token in the cookies
 * - When there is no ongoing CSRF token fetch request
 * 
 * The token is cached in memory (csrfToken) to avoid unnecessary requests.
 * A promise (csrfTokenPromise) is used to prevent multiple simultaneous fetch requests.
 */

let csrfToken: string | null = null;
let csrfTokenPromise: Promise<string | null> | null = null;

export const fetchCSRFToken = async (): Promise<string | null> => {

  // Check if token exists in cookies
  const csrfTokenCookie = Cookies.get('csrftoken');
  
  // If cookie exists, return it directly
  if (csrfTokenCookie) {
    csrfToken = csrfTokenCookie;
    return csrfToken;
  }

  // Clear memory token if cookie is missing
  csrfToken = null;

  // Return existing promise if there's an ongoing request
  if (csrfTokenPromise) return csrfTokenPromise;

  // Fetch new token only if needed
  csrfTokenPromise = (async () => {
    try {
      const response = await fetch(API_ENDPOINTS.csrf.get, {
        method: 'GET',
        credentials: 'include',
      });
      if (response.ok) {
        csrfToken = Cookies.get('csrftoken') || null;
      }
    } catch (error) {
      console.error('Failed to fetch CSRF token:');
    }
    csrfTokenPromise = null;
    return csrfToken;
  })();

  return csrfTokenPromise;
};