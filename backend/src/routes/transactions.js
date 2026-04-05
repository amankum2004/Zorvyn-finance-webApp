const express = require('express');
const TransactionService = require('../services/transactionService');
const { authMiddleware, requirePermission } = require('../middleware/auth');
const { validate, transactionValidation, paginationValidation } = require('../middleware/validation');
const router = express.Router();

// Apply auth middleware to all transaction routes
router.use(authMiddleware);

// Get all transactions with filters
router.get('/', requirePermission('view_transactions'), validate(paginationValidation), async (req, res) => {
  try {
    const { type, category, start_date, end_date, page = 1, limit = 50 } = req.query;
    const filters = {
      type,
      category,
      start_date,
      end_date,
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit)
    };
    
    // Remove undefined filters
    Object.keys(filters).forEach(key => 
      filters[key] === undefined && delete filters[key]
    );
    
    const result = await TransactionService.getTransactions(req.user, filters);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single transaction
router.get('/:id', requirePermission('view_transactions'), async (req, res) => {
  try {
    const transaction = await TransactionService.getTransactionById(
      req.user,
      parseInt(req.params.id)
    );
    res.json(transaction);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

// Create transaction (requires create_transaction permission)
router.post('/', 
  requirePermission('create_transaction'),
  validate(transactionValidation.create),
  async (req, res) => {
    try {
      const transaction = await TransactionService.createTransaction(
        req.user.id,
        req.body
      );
      res.status(201).json({
        message: 'Transaction created successfully',
        transaction
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
);

// Update transaction (requires edit_transaction permission)
router.put('/:id',
  requirePermission('edit_transaction'),
  validate(transactionValidation.update),
  async (req, res) => {
    try {
      const transaction = await TransactionService.updateTransaction(
        req.user,
        parseInt(req.params.id),
        req.body
      );
      res.json({
        message: 'Transaction updated successfully',
        transaction
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
);

// Delete transaction (requires delete_transaction permission)
router.delete('/:id', requirePermission('delete_transaction'), async (req, res) => {
  try {
    await TransactionService.deleteTransaction(req.user, parseInt(req.params.id));
    res.json({ message: 'Transaction deleted successfully' });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

module.exports = router;
