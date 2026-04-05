import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        setUser(response.data.user);
      }
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        setUser(response.data.user);
      }
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    toast.success('Logged out successfully');
    window.location.href = '/login';
  };

  const getCurrentUser = () => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      return JSON.parse(userStr);
    }
    return null;
  };

  const getToken = () => {
    return localStorage.getItem('token');
  };

  const isAuthenticated = () => {
    return !!getToken();
  };

  const hasPermission = (permissions) => {
    if (!user) return false;
    if (user.role === 'admin') return true;
    
    const rolePermissions = {
      analyst: [
        'create_transaction',
        'edit_transaction',
        'delete_transaction',
        'view_transactions',
        'view_all_transactions',
        'view_dashboard'
      ],
      viewer: ['view_dashboard']
    };
    
    return permissions.every(p => rolePermissions[user.role]?.includes(p));
  };

  const value = {
    user,
    setUser,
    login,
    register,
    logout,
    loading,
    hasPermission,
    isAdmin: user?.role === 'admin',
    isAnalyst: user?.role === 'analyst',
    isViewer: user?.role === 'viewer',
    isAuthenticated: isAuthenticated(),
    getToken
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
