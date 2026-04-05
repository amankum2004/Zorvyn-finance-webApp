import api from './api';

const authService = {
  async login(email, password) {
    const response = await api.post('/auth/login', { email, password });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  async register(userData) {
    const response = await api.post('/auth/register', userData);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  },

  getCurrentUser() {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      return JSON.parse(userStr);
    }
    return null;
  },

  getToken() {
    return localStorage.getItem('token');
  },

  isAuthenticated() {
    return !!this.getToken();
  },

  hasRole(role) {
    const user = this.getCurrentUser();
    return user && user.role === role;
  },

  hasPermission(permissions) {
    const user = this.getCurrentUser();
    if (!user) return false;
    
    // Admin has all permissions
    if (user.role === 'admin') return true;
    
    // Check specific permissions based on role
    if (user.role === 'analyst') {
      const analystPermissions = [
        'create_transaction',
        'edit_transaction',
        'delete_transaction',
        'view_transactions',
        'view_all_transactions',
        'view_dashboard'
      ];
      return permissions.every(p => analystPermissions.includes(p));
    }

    if (user.role === 'viewer') {
      const viewerPermissions = ['view_dashboard'];
      return permissions.every(p => viewerPermissions.includes(p));
    }
    
    return false;
  }
};

export default authService;
