const { getDb } = require('../config/database');

class DashboardService {
  static async getSummary(user, filters = {}) {
    const db = await getDb();
    
    let query = `
      SELECT 
        SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) as total_income,
        SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) as total_expenses,
        COUNT(*) as total_transactions
      FROM transactions
      WHERE deleted_at IS NULL
    `;
    
    const params = [];
    
    // Apply user filter if needed
    if (!user.permissions.includes('view_all_transactions')) {
      query += ' AND user_id = ?';
      params.push(user.id);
    }
    
    if (filters.start_date) {
      query += ' AND date >= ?';
      params.push(filters.start_date);
    }
    if (filters.end_date) {
      query += ' AND date <= ?';
      params.push(filters.end_date);
    }
    
    const result = await db.get(query, params);
    
    const total_income = result.total_income || 0;
    const total_expenses = result.total_expenses || 0;
    const net_balance = total_income - total_expenses;
    
    return {
      total_income,
      total_expenses,
      net_balance,
      total_transactions: result.total_transactions || 0
    };
  }
  
  static async getCategoryTotals(user, filters = {}) {
    const db = await getDb();
    
    let query = `
      SELECT 
        category,
        SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) as total_income,
        SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) as total_expenses,
        COUNT(*) as count
      FROM transactions
      WHERE deleted_at IS NULL
    `;
    
    const params = [];
    
    if (!user.permissions.includes('view_all_transactions')) {
      query += ' AND user_id = ?';
      params.push(user.id);
    }
    
    if (filters.start_date) {
      query += ' AND date >= ?';
      params.push(filters.start_date);
    }
    if (filters.end_date) {
      query += ' AND date <= ?';
      params.push(filters.end_date);
    }
    
    query += ' GROUP BY category ORDER BY category';
    
    const categories = await db.all(query, params);
    
    return categories;
  }
  
  static async getMonthlyTrends(user, filters = {}) {
    const db = await getDb();
    
    let query = `
      SELECT 
        strftime('%Y-%m', date) as month,
        SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) as total_income,
        SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) as total_expenses,
        COUNT(*) as transaction_count
      FROM transactions
      WHERE deleted_at IS NULL
    `;
    
    const params = [];
    
    if (!user.permissions.includes('view_all_transactions')) {
      query += ' AND user_id = ?';
      params.push(user.id);
    }
    
    if (filters.start_date) {
      query += ' AND date >= ?';
      params.push(filters.start_date);
    }
    if (filters.end_date) {
      query += ' AND date <= ?';
      params.push(filters.end_date);
    }
    
    query += ' GROUP BY strftime("%Y-%m", date) ORDER BY month DESC LIMIT 12';
    
    const trends = await db.all(query, params);
    
    return trends;
  }
  
  static async getRecentActivity(user, limit = 10) {
    const db = await getDb();
    
    let query = `
      SELECT t.*, u.username
      FROM transactions t
      JOIN users u ON t.user_id = u.id
      WHERE t.deleted_at IS NULL
    `;
    
    const params = [];
    
    if (!user.permissions.includes('view_all_transactions')) {
      query += ' AND t.user_id = ?';
      params.push(user.id);
    }
    
    query += ' ORDER BY t.created_at DESC LIMIT ?';
    params.push(limit);
    
    const activities = await db.all(query, params);
    
    return activities;
  }
}

module.exports = DashboardService;
