const Transaction = require('../models/Transaction');

class TransactionService {
  static async createTransaction(userId, transactionData) {
    return await Transaction.create({
      user_id: userId,
      ...transactionData
    });
  }
  
  static async getTransactions(user, filters) {
    // If user is viewer/analyst/admin with view_all_transactions, they can see all
    if (user.permissions.includes('view_all_transactions')) {
      return await Transaction.findAll(filters);
    }
    // Otherwise only see their own
    return await Transaction.findAll({ ...filters, user_id: user.id });
  }
  
  static async getTransactionById(user, transactionId) {
    const transaction = await Transaction.findById(transactionId);
    if (!transaction) {
      throw new Error('Transaction not found');
    }
    
    // Check if user has permission to view this transaction
    if (!user.permissions.includes('view_all_transactions') && transaction.user_id !== user.id) {
      throw new Error('Access denied');
    }
    
    return transaction;
  }
  
  static async updateTransaction(user, transactionId, updates) {
    const transaction = await this.getTransactionById(user, transactionId);
    
    // Check if user has permission to edit
    if (!user.permissions.includes('edit_transaction')) {
      throw new Error('Access denied');
    }
    
    return await Transaction.update(transactionId, updates);
  }
  
  static async deleteTransaction(user, transactionId) {
    const transaction = await this.getTransactionById(user, transactionId);
    
    // Check if user has permission to delete
    if (!user.permissions.includes('delete_transaction')) {
      throw new Error('Access denied');
    }
    
    return await Transaction.delete(transactionId);
  }
}

module.exports = TransactionService;