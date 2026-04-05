const { getDb } = require('../config/database');
const bcrypt = require('bcryptjs');

class User {
  static async create(userData) {
    const db = await getDb();
    const { username, email, password, role_id } = userData;
    
    const password_hash = await bcrypt.hash(password, 10);
    
    const result = await db.run(
      'INSERT INTO users (username, email, password_hash, role_id) VALUES (?, ?, ?, ?)',
      [username, email, password_hash, role_id]
    );
    
    return this.findById(result.lastID);
  }

  static async findById(id) {
    const db = await getDb();
    return await db.get(
      `SELECT u.*, r.name as role_name, r.permissions 
       FROM users u 
       JOIN roles r ON u.role_id = r.id 
       WHERE u.id = ?`,
      [id]
    );
  }

  static async findByEmail(email) {
    const db = await getDb();
    return await db.get(
      `SELECT u.*, r.name as role_name, r.permissions 
       FROM users u 
       JOIN roles r ON u.role_id = r.id 
       WHERE u.email = ?`,
      [email]
    );
  }

  static async findByUsername(username) {
    const db = await getDb();
    return await db.get(
      `SELECT u.*, r.name as role_name, r.permissions 
       FROM users u 
       JOIN roles r ON u.role_id = r.id 
       WHERE u.username = ?`,
      [username]
    );
  }

  static async update(id, updates) {
    const db = await getDb();
    const fields = [];
    const values = [];

    if (updates.username) {
      fields.push('username = ?');
      values.push(updates.username);
    }
    if (updates.email) {
      fields.push('email = ?');
      values.push(updates.email);
    }
    if (updates.role_id) {
      fields.push('role_id = ?');
      values.push(updates.role_id);
    }
    if (updates.status) {
      fields.push('status = ?');
      values.push(updates.status);
    }
    
    fields.push('updated_at = CURRENT_TIMESTAMP');
    
    values.push(id);
    
    await db.run(
      `UPDATE users SET ${fields.join(', ')} WHERE id = ?`,
      values
    );
    
    return this.findById(id);
  }

  static async delete(id) {
    const db = await getDb();
    // First delete all user's transactions
    await db.run('DELETE FROM transactions WHERE user_id = ?', [id]);
    // Then delete the user
    await db.run('DELETE FROM users WHERE id = ?', [id]);
    return true;
  }

  static async findAll(filters = {}) {
    const db = await getDb();
    let query = `
      SELECT u.*, r.name as role_name, r.permissions 
      FROM users u 
      JOIN roles r ON u.role_id = r.id 
      WHERE 1=1
    `;
    const params = [];

    if (filters.status) {
      query += ' AND u.status = ?';
      params.push(filters.status);
    }
    if (filters.role_id) {
      query += ' AND u.role_id = ?';
      params.push(filters.role_id);
    }

    query += ' ORDER BY u.created_at DESC';
    
    return await db.all(query, params);
  }

  static async verifyPassword(user, password) {
    return await bcrypt.compare(password, user.password_hash);
  }
}

module.exports = User;