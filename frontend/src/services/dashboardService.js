import api from './api';

const dashboardService = {
  async getSummary(filters = {}) {
    const params = new URLSearchParams();
    if (filters.start_date) params.append('start_date', filters.start_date);
    if (filters.end_date) params.append('end_date', filters.end_date);
    const response = await api.get(`/dashboard/summary?${params.toString()}`);
    return response.data;
  },

  async getCategoryTotals(filters = {}) {
    const params = new URLSearchParams();
    if (filters.start_date) params.append('start_date', filters.start_date);
    if (filters.end_date) params.append('end_date', filters.end_date);
    const response = await api.get(`/dashboard/categories?${params.toString()}`);
    return response.data;
  },

  async getMonthlyTrends(filters = {}) {
    const params = new URLSearchParams();
    if (filters.start_date) params.append('start_date', filters.start_date);
    if (filters.end_date) params.append('end_date', filters.end_date);
    const response = await api.get(`/dashboard/trends?${params.toString()}`);
    return response.data;
  },

  async getRecentActivity(limit = 10) {
    const response = await api.get(`/dashboard/recent?limit=${limit}`);
    return response.data;
  }
};

export default dashboardService;