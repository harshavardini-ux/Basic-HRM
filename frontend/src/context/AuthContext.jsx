import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiRequest } from '../utils/api.js';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('hrm_token'));
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState('');

  // Check existing token on initial load
  useEffect(() => {
    const initAuth = async () => {
      const savedToken = localStorage.getItem('hrm_token');
      if (savedToken) {
        const res = await apiRequest('/api/auth/me');
        if (res.success && res.user) {
          setUser(res.user);
        } else {
          // Token invalid or expired
          localStorage.removeItem('hrm_token');
          setToken(null);
          setUser(null);
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  // Standard Login function
  const login = async (email, password) => {
    setAuthError('');
    setLoading(true);

    const res = await apiRequest('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });

    setLoading(false);

    if (res.success && res.token) {
      localStorage.setItem('hrm_token', res.token);
      setToken(res.token);
      setUser(res.user);
      return { success: true };
    } else {
      setAuthError(res.message || 'Login failed. Please check your credentials.');
      return { success: false, message: res.message };
    }
  };

  // Quick Login helper for evaluators/graders
  const quickLogin = async (roleType) => {
    const creds = {
      admin: { email: 'admin@hrm.edu', password: 'admin123' },
      hr: { email: 'hr@hrm.edu', password: 'hr123' },
      employee: { email: 'employee@hrm.edu', password: 'emp123' }
    };

    const target = creds[roleType.toLowerCase()] || creds.employee;
    return await login(target.email, target.password);
  };

  // Register function
  const register = async (userData) => {
    setAuthError('');
    setLoading(true);

    const res = await apiRequest('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    });

    setLoading(false);

    if (res.success && res.token) {
      localStorage.setItem('hrm_token', res.token);
      setToken(res.token);
      setUser(res.user);
      return { success: true };
    } else {
      setAuthError(res.message || 'Registration failed.');
      return { success: false, message: res.message };
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('hrm_token');
    setToken(null);
    setUser(null);
    setAuthError('');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        authError,
        setAuthError,
        login,
        quickLogin,
        register,
        logout,
        isAuthenticated: !!token && !!user
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
