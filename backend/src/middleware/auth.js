const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Role = require('../models/Role');

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      throw new Error();
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    
    if (!user || user.status !== 'active') {
      throw new Error();
    }

    req.user = user;
    req.user.permissions = JSON.parse(user.permissions);
    next();
  } catch (error) {
    res.status(401).json({ error: 'Please authenticate' });
  }
};

const requirePermission = (permission) => {
  return (req, res, next) => {
    if (!req.user || !req.user.permissions.includes(permission)) {
      return res.status(403).json({ error: 'Access denied. Insufficient permissions.' });
    }
    next();
  };
};

const requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role_name)) {
      return res.status(403).json({ error: 'Access denied. Invalid role.' });
    }
    next();
  };
};

module.exports = { authMiddleware, requirePermission, requireRole };