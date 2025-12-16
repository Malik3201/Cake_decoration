import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
  withCredentials: true, // allow refresh token cookie if used
  timeout: 10000, // 10 second timeout
});

// Attach access token if available
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('db_access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Handle response errors - production-ready token expiry handling
api.interceptors.response.use(
  response => response,
  error => {
    // Handle 401/403 - token expired or unauthorized
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      // Clear auth data
      localStorage.removeItem('db_access_token');
      localStorage.removeItem('db_user');
      
      // Only redirect if not already on login/register page
      const currentPath = window.location.pathname;
      if (!currentPath.includes('/login') && !currentPath.includes('/register') && !currentPath.includes('/admin/login')) {
        // Smooth redirect to login
        window.location.href = '/login';
      }
      
      // Return a clean error that won't show to user
      return Promise.reject(new Error('Session expired'));
    }
    
    // Handle network errors
    if (!error.response) {
      error.message = 'Network error. Please check your connection.';
    }
    
    return Promise.reject(error);
  }
);

export default api;


