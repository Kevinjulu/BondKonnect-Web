import axios from 'axios';

const axiosServices = axios.create();

// Request Interceptor to add Auth Token
axiosServices.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('k-o-t='))
        ?.split('=')[1];

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor for handling errors globally
axiosServices.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Handle unauthorized session (session expired)
      if (typeof window !== 'undefined') {
        // Clear the cookie and redirect to login
        document.cookie = 'k-o-t=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        window.location.href = '/auth/login';
      }
    }
    return Promise.reject((error.response && error.response.data) || 'An unexpected error occurred');
  }
);

export default axiosServices;