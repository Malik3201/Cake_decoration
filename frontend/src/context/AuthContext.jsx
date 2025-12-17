import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import api from '../utils/api.js';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true); // Wait for localStorage
  const [error, setError] = useState(null);

  // Load persisted user/token on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('db_user');
    const token = localStorage.getItem('db_access_token');
    if (storedUser && token) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        // Invalid stored data, clear it
        localStorage.removeItem('db_user');
        localStorage.removeItem('db_access_token');
      }
    }
    setInitialLoading(false); // Done loading from localStorage
  }, []);

  const login = async ({ email, password, admin = false }) => {
    setLoading(true);
    setError(null);
    try {
      const url = admin ? '/api/auth/admin/login' : '/api/auth/login';
      const { data } = await api.post(url, { email, password });
      
      // Ensure response has required fields
      if (!data || !data.user || !data.accessToken) {
        throw new Error('Invalid response from server');
      }
      
      const { user: u, accessToken } = data;
      
      // Ensure user has role field
      if (!u.role) {
        u.role = 'user'; // Default role if missing
      }
      
      localStorage.setItem('db_user', JSON.stringify(u));
      localStorage.setItem('db_access_token', accessToken);
      setUser(u);
      return u;
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || 'Unable to login';
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async ({ name, email, password }) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.post('/api/auth/register', { name, email, password });

      if (!data || !data.user) {
        throw new Error('Invalid response from server');
      }

      // Auto-login after register
      const loggedInUser = await login({ email, password });
      return loggedInUser || data.user;
    } catch (err) {
      const backendErrors = err?.response?.data?.errors;

      // Prefer detailed validation messages from backend if available
      if (Array.isArray(backendErrors) && backendErrors.length > 0) {
        const combined = backendErrors
          .map(e => e?.message)
          .filter(Boolean)
          .join(' ');
        setError(combined || 'Please check your details and try again.');
      } else {
        const msg = err?.response?.data?.message || err?.message || 'Unable to register';
        setError(msg);
      }
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await api.post('/api/auth/logout');
    } catch (err) {
      // ignore
    }
    localStorage.removeItem('db_user');
    localStorage.removeItem('db_access_token');
    setUser(null);
  };

  const value = useMemo(
    () => ({
      user,
      loading,
      initialLoading, // Expose this for ProtectedRoute
      error,
      login,
      register,
      logout,
      isAuthenticated: Boolean(user),
    }),
    [user, loading, initialLoading, error]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
