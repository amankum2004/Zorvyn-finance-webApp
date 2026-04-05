import api from './api';

const transactionService = {
  async getTransactions(filters = {}) {
    const params = new URLSearchParams();
    Object.keys(filters).forEach(key => {
      if (filters[key]) {
        params.append(key, filters[key]);
      }
    });
    const response = await api.get(`/transactions?${params.toString()}`);
    return response.data;
  },

  async getTransaction(id) {
    const response = await api.get(`/transactions/${id}`);
    return response.data;
  },

  async createTransaction(transactionData) {
    const response = await api.post('/transactions', transactionData);
    return response.data;
  },

  async updateTransaction(id, transactionData) {
    const response = await api.put(`/transactions/${id}`, transactionData);
    return response.data;
  },

  async deleteTransaction(id) {
    const response = await api.delete(`/transactions/${id}`);
    return response.data;
  },

  async getCategories() {
    // You can also fetch from backend if you have categories endpoint
    return ['Food', 'Transport', 'Rent', 'Utilities', 'Entertainment', 'Shopping', 'Healthcare', 'Salary', 'Investment', 'Other'];
  }
};

export default transactionService;