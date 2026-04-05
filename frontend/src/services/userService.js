import api from './api';

const userService = {
  async getUsers(filters = {}) {
    const params = new URLSearchParams();
    Object.keys(filters).forEach(key => {
      if (filters[key]) {
        params.append(key, filters[key]);
      }
    });
    const response = await api.get(`/users?${params.toString()}`);
    return response.data;
  },

  async getUser(id) {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },

  async createUser(userData) {
    const response = await api.post('/users', userData);
    return response.data;
  },

  async updateUser(id, userData) {
    const response = await api.put(`/users/${id}`, userData);
    return response.data;
  },

  async deleteUser(id) {
    const response = await api.delete(`/users/${id}`);
    return response.data;
  },

  async getRoles() {
    // Return available roles
    return [
      { id: 1, name: 'admin', label: 'Admin' },
      { id: 2, name: 'analyst', label: 'Analyst' },
      { id: 3, name: 'viewer', label: 'Viewer' }
    ];
  }
};

export default userService;