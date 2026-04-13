import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('access_token');
      if (token) {
        try {
          const response = await api.get('/auth/me');
          setUser(response.data);
        } catch (err) {
          console.error("Token invalid or expired", err);
          localStorage.removeItem('access_token');
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    setError(null);
    try {
      // OAuth2PasswordRequestForm expects form data
      const formData = new URLSearchParams();
      formData.append('username', email); // Fastapi OAuth uses 'username' instead of email
      formData.append('password', password);

      const response = await api.post('/auth/login', formData, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      });
      
      const token = response.data.access_token;
      localStorage.setItem('access_token', token);
      
      // Fetch user data
      const meResponse = await api.get('/auth/me');
      setUser(meResponse.data);
      return true;
    } catch (err) {
      let errorMsg = "Login failed";
      if (err.response?.data?.detail) {
        errorMsg = Array.isArray(err.response.data.detail) ? err.response.data.detail[0].msg : err.response.data.detail;
      }
      setError(errorMsg);
      return false;
    }
  };

  const register = async (userData) => {
    setError(null);
    try {
      await api.post('/auth/register', userData);
      // Auto login after register
      return await login(userData.email, userData.password);
    } catch (err) {
      let errorMsg = "Registration failed";
      if (err.response?.data?.detail) {
        errorMsg = Array.isArray(err.response.data.detail) ? err.response.data.detail[0].msg : err.response.data.detail;
      }
      setError(errorMsg);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('access_token');
  };

  const hasRole = (allowedRoles) => {
    if (!user) return false;
    if (user.role === 'Admin') return true;
    return allowedRoles.includes(user.role);
  };

  const value = {
    user,
    login,
    register,
    logout,
    hasRole,
    loading,
    error,
    setError
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
