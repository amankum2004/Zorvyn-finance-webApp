// API endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh'
  },
  USERS: {
    BASE: '/users',
    GET_ALL: '/users',
    GET_BY_ID: (id) => `/users/${id}`,
    CREATE: '/users',
    UPDATE: (id) => `/users/${id}`,
    DELETE: (id) => `/users/${id}`
  },
  TRANSACTIONS: {
    BASE: '/transactions',
    GET_ALL: '/transactions',
    GET_BY_ID: (id) => `/transactions/${id}`,
    CREATE: '/transactions',
    UPDATE: (id) => `/transactions/${id}`,
    DELETE: (id) => `/transactions/${id}`
  },
  DASHBOARD: {
    SUMMARY: '/dashboard/summary',
    CATEGORIES: '/dashboard/categories',
    TRENDS: '/dashboard/trends',
    RECENT: '/dashboard/recent'
  }
};

// Transaction types
export const TRANSACTION_TYPES = {
  INCOME: 'income',
  EXPENSE: 'expense'
};

// User roles
export const USER_ROLES = {
  ADMIN: 'admin',
  ANALYST: 'analyst',
  VIEWER: 'viewer'
};

// Role IDs mapping
export const ROLE_IDS = {
  [USER_ROLES.ADMIN]: 1,
  [USER_ROLES.ANALYST]: 2,
  [USER_ROLES.VIEWER]: 3
};

// User statuses
export const USER_STATUSES = {
  ACTIVE: 'active',
  INACTIVE: 'inactive'
};

// Transaction categories
export const TRANSACTION_CATEGORIES = {
  INCOME: ['Salary', 'Investment', 'Freelance', 'Gift', 'Refund', 'Other Income'],
  EXPENSE: ['Food', 'Transport', 'Rent', 'Utilities', 'Entertainment', 'Shopping', 'Healthcare', 'Education', 'Insurance', 'Other Expense']
};

// Date formats
export const DATE_FORMATS = {
  DISPLAY: 'MMM dd, yyyy',
  API: 'yyyy-MM-dd',
  MONTH_YEAR: 'MMM yyyy',
  FULL_DATE: 'EEEE, MMMM dd, yyyy'
};

// Currency settings
export const CURRENCY = {
  SYMBOL: '$',
  CODE: 'USD',
  LOCALE: 'en-US'
};

// Pagination defaults
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  LIMIT_OPTIONS: [10, 20, 50, 100]
};

// Chart colors
export const CHART_COLORS = {
  PRIMARY: '#0ea5e9',
  SUCCESS: '#10b981',
  DANGER: '#ef4444',
  WARNING: '#f59e0b',
  INFO: '#3b82f6',
  PURPLE: '#8b5cf6',
  PINK: '#ec4899',
  INDIGO: '#6366f1',
  COLORS: ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FF6B6B', '#4ECDC4']
};

// Local storage keys
export const STORAGE_KEYS = {
  TOKEN: 'token',
  USER: 'user',
  THEME: 'theme',
  LANGUAGE: 'language'
};

// HTTP status codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500
};

// Error messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  UNAUTHORIZED: 'Session expired. Please login again.',
  FORBIDDEN: 'You don\'t have permission to perform this action.',
  NOT_FOUND: 'Resource not found.',
  SERVER_ERROR: 'Server error. Please try again later.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  DUPLICATE_EMAIL: 'User with this email already exists.',
  DUPLICATE_USERNAME: 'Username already taken.',
  INVALID_CREDENTIALS: 'Invalid email or password.',
  INACTIVE_ACCOUNT: 'Your account is inactive. Please contact administrator.'
};

// Success messages
export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'Login successful!',
  LOGOUT_SUCCESS: 'Logged out successfully!',
  REGISTER_SUCCESS: 'Registration successful!',
  TRANSACTION_CREATED: 'Transaction created successfully!',
  TRANSACTION_UPDATED: 'Transaction updated successfully!',
  TRANSACTION_DELETED: 'Transaction deleted successfully!',
  USER_CREATED: 'User created successfully!',
  USER_UPDATED: 'User updated successfully!',
  USER_DELETED: 'User deleted successfully!'
};

// Validation patterns
export const VALIDATION_PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PASSWORD: /^.{6,}$/,
  USERNAME: /^[a-zA-Z0-9_]{3,20}$/,
  AMOUNT: /^\d+(\.\d{1,2})?$/
};

// Default date ranges
export const DATE_RANGES = {
  TODAY: 'today',
  WEEK: 'week',
  MONTH: 'month',
  QUARTER: 'quarter',
  YEAR: 'year',
  CUSTOM: 'custom'
};

// Theme options
export const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
  SYSTEM: 'system'
};

// Language options
export const LANGUAGES = {
  EN: 'en',
  ES: 'es',
  FR: 'fr'
};

// Chart types
export const CHART_TYPES = {
  LINE: 'line',
  BAR: 'bar',
  PIE: 'pie',
  AREA: 'area'
};