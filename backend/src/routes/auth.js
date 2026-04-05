const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Role = require('../models/Role');
const { validate, userValidation } = require('../middleware/validation');
const router = express.Router();

router.post('/register', validate(userValidation.register), async (req, res) => {
  try {
    const { username, email, password, role_id } = req.body;

    // Only allow self-registration for non-admin roles (default: viewer)
    let role = null;
    if (role_id) {
      role = await Role.findById(role_id);
      if (!role) {
        return res.status(400).json({ error: 'Invalid role ID' });
      }
      if (role.name === 'admin') {
        return res.status(403).json({ error: 'Admin accounts must be created by an admin user' });
      }
    } else {
      role = await Role.findByName('viewer');
      if (!role) {
        return res.status(500).json({ error: 'Default viewer role not found' });
      }
    }

    const user = await User.create({ username, email, password, role_id: role.id });
    
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role_name },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE }
    );
    
    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role_name
      },
      token
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }
    
    const user = await User.findByEmail(email);
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const isValidPassword = await User.verifyPassword(user, password);
    
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    if (user.status !== 'active') {
      return res.status(401).json({ error: 'Account is inactive' });
    }
    
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role_name },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE }
    );
    
    res.json({
      message: 'Login successful',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role_name
      },
      token
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
