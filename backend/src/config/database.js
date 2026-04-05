const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
const path = require('path');

let dbInstance = null;

async function initializeDatabase() {
  const db = await open({
    filename: path.join(__dirname, '../../finance.db'),
    driver: sqlite3.Database
  });

  // Create tables
  await db.exec(`
    -- Roles table
    CREATE TABLE IF NOT EXISTS roles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT UNIQUE NOT NULL,
      permissions TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    -- Users table
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      role_id INTEGER NOT NULL,
      status TEXT DEFAULT 'active',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (role_id) REFERENCES roles(id)
    );

    -- Transactions table
    CREATE TABLE IF NOT EXISTS transactions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      amount DECIMAL(10,2) NOT NULL,
      type TEXT NOT NULL CHECK(type IN ('income', 'expense')),
      category TEXT NOT NULL,
      date DATE NOT NULL,
      description TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    );

    -- Create indexes for better performance
    CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);
    CREATE INDEX IF NOT EXISTS idx_transactions_date ON transactions(date);
    CREATE INDEX IF NOT EXISTS idx_transactions_category ON transactions(category);
    CREATE INDEX IF NOT EXISTS idx_users_role_id ON users(role_id);
  `);

  // Ensure default roles exist and match expected permissions
  const defaultRoles = [
    {
      name: 'admin',
      permissions: [
        'create_user',
        'edit_user',
        'delete_user',
        'create_transaction',
        'edit_transaction',
        'delete_transaction',
        'view_transactions',
        'view_all_transactions',
        'view_dashboard'
      ]
    },
    {
      name: 'analyst',
      permissions: [
        'create_transaction',
        'edit_transaction',
        'delete_transaction',
        'view_transactions',
        'view_all_transactions',
        'view_dashboard'
      ]
    },
    {
      name: 'viewer',
      permissions: [
        'view_dashboard'
      ]
    }
  ];

  for (const role of defaultRoles) {
    const existing = await db.get('SELECT id FROM roles WHERE name = ?', [role.name]);
    const permissions = JSON.stringify(role.permissions);
    if (existing) {
      await db.run('UPDATE roles SET permissions = ? WHERE id = ?', [permissions, existing.id]);
    } else {
      await db.run('INSERT INTO roles (name, permissions) VALUES (?, ?)', [role.name, permissions]);
    }
  }

  return db;
}

async function getDb() {
  if (!dbInstance) {
    dbInstance = await initializeDatabase();
  }
  return dbInstance;
}

module.exports = { getDb, initializeDatabase };
