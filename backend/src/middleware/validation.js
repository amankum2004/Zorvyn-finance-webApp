const { body, param, query, validationResult } = require('express-validator');

const validate = (validations) => {
  return async (req, res, next) => {
    await Promise.all(validations.map(validation => validation.run(req)));

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    res.status(400).json({ 
      errors: errors.array().map(err => ({
        field: err.param,
        message: err.msg
      }))
    });
  };
};

const userValidation = {
  register: [
    body('username').trim().isLength({ min: 3 }).withMessage('Username must be at least 3 characters'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('role_id').optional().isInt().withMessage('Valid role ID is required')
  ],
  create: [
    body('username').trim().isLength({ min: 3 }).withMessage('Username must be at least 3 characters'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('role_id').isInt().withMessage('Valid role ID is required')
  ],
  update: [
    param('id').isInt().withMessage('Valid user ID is required'),
    body('username').optional().trim().isLength({ min: 3 }),
    body('email').optional().isEmail(),
    body('role_id').optional().isInt(),
    body('status').optional().isIn(['active', 'inactive'])
  ]
};

const transactionValidation = {
  create: [
    body('amount').isFloat({ min: 0.01 }).withMessage('Amount must be positive'),
    body('type').isIn(['income', 'expense']).withMessage('Type must be income or expense'),
    body('category').trim().notEmpty().withMessage('Category is required'),
    body('date').isISO8601().withMessage('Valid date is required'),
    body('description').optional().trim()
  ],
  update: [
    param('id').isInt().withMessage('Valid transaction ID is required'),
    body('amount').optional().isFloat({ min: 0.01 }),
    body('type').optional().isIn(['income', 'expense']),
    body('category').optional().trim().notEmpty(),
    body('date').optional().isISO8601(),
    body('description').optional().trim()
  ]
};

const paginationValidation = [
  query('page').optional().isInt({ min: 1 }).toInt(),
  query('limit').optional().isInt({ min: 1, max: 100 }).toInt()
];

module.exports = { validate, userValidation, transactionValidation, paginationValidation };
