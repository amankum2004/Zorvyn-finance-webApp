const express = require('express');
const UserService = require('../services/userService');
const { authMiddleware, requirePermission } = require('../middleware/auth');
const { validate, userValidation } = require('../middleware/validation');
const router = express.Router();

// Apply auth middleware to all user routes
router.use(authMiddleware);

// Get all users (Admin only)
router.get('/', requirePermission('create_user'), async (req, res) => {
  try {
    const { status, role_id } = req.query;
    const filters = {};
    if (status) filters.status = status;
    if (role_id) filters.role_id = parseInt(role_id);
    
    const users = await UserService.getUsers(filters);
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get user by ID
router.get('/:id', requirePermission('create_user'), async (req, res) => {
  try {
    const user = await UserService.getUserById(parseInt(req.params.id));
    res.json(user);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

// Create new user (Admin only)
router.post('/', requirePermission('create_user'), validate(userValidation.create), async (req, res) => {
  try {
    const user = await UserService.createUser(req.body);
    res.status(201).json({
      message: 'User created successfully',
      user
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update user (Admin only)
router.put('/:id', requirePermission('edit_user'), validate(userValidation.update), async (req, res) => {
  try {
    const user = await UserService.updateUser(parseInt(req.params.id), req.body);
    res.json({
      message: 'User updated successfully',
      user
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete user (Admin only)
router.delete('/:id', requirePermission('delete_user'), async (req, res) => {
  try {
    await UserService.deleteUser(parseInt(req.params.id));
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

module.exports = router;