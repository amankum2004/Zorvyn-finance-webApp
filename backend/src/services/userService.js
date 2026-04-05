const User = require('../models/User');
const Role = require('../models/Role');

class UserService {
  static async createUser(userData) {
    // Check if user exists
    const existingUser = await User.findByEmail(userData.email);
    if (existingUser) {
      throw new Error('User with this email already exists');
    }
    
    const existingUsername = await User.findByUsername(userData.username);
    if (existingUsername) {
      throw new Error('Username already taken');
    }
    
    // Verify role exists
    const role = await Role.findById(userData.role_id);
    if (!role) {
      throw new Error('Invalid role ID');
    }
    
    return await User.create(userData);
  }
  
  static async getUsers(filters) {
    return await User.findAll(filters);
  }
  
  static async getUserById(id) {
    const user = await User.findById(id);
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }
  
  static async updateUser(id, updates) {
    const user = await User.findById(id);
    if (!user) {
      throw new Error('User not found');
    }
    
    if (updates.role_id) {
      const role = await Role.findById(updates.role_id);
      if (!role) {
        throw new Error('Invalid role ID');
      }
    }
    
    return await User.update(id, updates);
  }
  
  static async deleteUser(id) {
    const user = await User.findById(id);
    if (!user) {
      throw new Error('User not found');
    }
    return await User.delete(id);
  }
}

module.exports = UserService;