const { getDb } = require('../config/database');

class Transaction {
  static async create(transactionData) {
    const db = await getDb();
    const { user_id, amount, type, category, date, description } = transactionData;
    
    const result = await db.run(
      `INSERT INTO transactions (user_id, amount, type, category, date, description) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [user_id, amount, type, category, date, description]
    );
    
    return this.findById(result.lastID);
  }

  static async findById(id) {
    const db = await getDb();
    return await db.get('SELECT * FROM transactions WHERE id = ? AND deleted_at IS NULL', [id]);
  }

  static async findAll(filters = {}) {
    const db = await getDb();
    let query = 'SELECT * FROM transactions WHERE deleted_at IS NULL';
    const params = [];

    if (filters.user_id) {
      query += ' AND user_id = ?';
      params.push(filters.user_id);
    }
    if (filters.type) {
      query += ' AND type = ?';
      params.push(filters.type);
    }
    if (filters.category) {
      query += ' AND category = ?';
      params.push(filters.category);
    }
    if (filters.start_date) {
      query += ' AND date >= ?';
      params.push(filters.start_date);
    }
    if (filters.end_date) {
      query += ' AND date <= ?';
      params.push(filters.end_date);
    }

    query += ' ORDER BY date DESC, created_at DESC';

    // Add pagination
    if (filters.limit !== undefined) {
      query += ' LIMIT ?';
      params.push(filters.limit);
      if (filters.offset !== undefined) {
        query += ' OFFSET ?';
        params.push(filters.offset);
      }
    }
    
    const transactions = await db.all(query, params);
    
    // Get total count for pagination
    let countQuery = 'SELECT COUNT(*) as total FROM transactions WHERE deleted_at IS NULL';
    const countParams = [];
    // Apply same filters for count
    if (filters.user_id) {
      countQuery += ' AND user_id = ?';
      countParams.push(filters.user_id);
    }
    if (filters.type) {
      countQuery += ' AND type = ?';
      countParams.push(filters.type);
    }
    if (filters.category) {
      countQuery += ' AND category = ?';
      countParams.push(filters.category);
    }
    if (filters.start_date) {
      countQuery += ' AND date >= ?';
      countParams.push(filters.start_date);
    }
    if (filters.end_date) {
      countQuery += ' AND date <= ?';
      countParams.push(filters.end_date);
    }
    
    const { total } = await db.get(countQuery, countParams);
    
    return {
      transactions,
      pagination: {
        total,
        limit: filters.limit || total,
        offset: filters.offset || 0
      }
    };
  }

  static async update(id, updates) {
    const db = await getDb();
    const fields = [];
    const values = [];

    if (updates.amount !== undefined) {
      fields.push('amount = ?');
      values.push(updates.amount);
    }
    if (updates.type) {
      fields.push('type = ?');
      values.push(updates.type);
    }
    if (updates.category) {
      fields.push('category = ?');
      values.push(updates.category);
    }
    if (updates.date) {
      fields.push('date = ?');
      values.push(updates.date);
    }
    if (updates.description !== undefined) {
      fields.push('description = ?');
      values.push(updates.description);
    }
    
    fields.push('updated_at = CURRENT_TIMESTAMP');
    values.push(id);
    
    await db.run(
      `UPDATE transactions SET ${fields.join(', ')} WHERE id = ?`,
      values
    );
    
    return this.findById(id);
  }

  static async delete(id) {
    const db = await getDb();
    await db.run('UPDATE transactions SET deleted_at = CURRENT_TIMESTAMP WHERE id = ?', [id]);
    return true;
  }

  static async deleteByUser(userId) {
    const db = await getDb();
    await db.run('UPDATE transactions SET deleted_at = CURRENT_TIMESTAMP WHERE user_id = ?', [userId]);
    return true;
  }
}

module.exports = Transaction;
