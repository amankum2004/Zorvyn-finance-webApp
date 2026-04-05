const { getDb } = require('../config/database');

class Role {
  static async findAll() {
    const db = await getDb();
    return await db.all('SELECT * FROM roles ORDER BY id');
  }

  static async findById(id) {
    const db = await getDb();
    return await db.get('SELECT * FROM roles WHERE id = ?', [id]);
  }

  static async findByName(name) {
    const db = await getDb();
    return await db.get('SELECT * FROM roles WHERE name = ?', [name]);
  }

  static async getPermissions(roleId) {
    const role = await this.findById(roleId);
    if (!role) return [];
    return JSON.parse(role.permissions);
  }

  static async hasPermission(user, permission) {
    if (!user || !user.permissions) return false;
    const permissions = JSON.parse(user.permissions);
    return permissions.includes(permission);
  }
}

module.exports = Role;