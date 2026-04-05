import { format, parseISO, differenceInDays, subDays, startOfMonth, endOfMonth } from 'date-fns';
import { CURRENCY, DATE_FORMATS, VALIDATION_PATTERNS } from './constants';

// Format currency
export const formatCurrency = (amount, currencySymbol = CURRENCY.SYMBOL) => {
  if (amount === undefined || amount === null) return `${currencySymbol}0.00`;
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  return `${currencySymbol}${numAmount.toFixed(2)}`;
};

// Format date
export const formatDate = (date, formatStr = DATE_FORMATS.DISPLAY) => {
  if (!date) return '';
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, formatStr);
};

// Format date for API
export const formatDateForAPI = (date) => {
  if (!date) return '';
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, DATE_FORMATS.API);
};

// Get date range
export const getDateRange = (range) => {
  const today = new Date();
  switch (range) {
    case 'today':
      return {
        start_date: formatDateForAPI(today),
        end_date: formatDateForAPI(today)
      };
    case 'week':
      return {
        start_date: formatDateForAPI(subDays(today, 7)),
        end_date: formatDateForAPI(today)
      };
    case 'month':
      return {
        start_date: formatDateForAPI(startOfMonth(today)),
        end_date: formatDateForAPI(endOfMonth(today))
      };
    case 'year':
      return {
        start_date: formatDateForAPI(new Date(today.getFullYear(), 0, 1)),
        end_date: formatDateForAPI(new Date(today.getFullYear(), 11, 31))
      };
    default:
      return {
        start_date: formatDateForAPI(subDays(today, 30)),
        end_date: formatDateForAPI(today)
      };
  }
};

// Validate email
export const isValidEmail = (email) => {
  return VALIDATION_PATTERNS.EMAIL.test(email);
};

// Validate password
export const isValidPassword = (password) => {
  return VALIDATION_PATTERNS.PASSWORD.test(password);
};

// Validate username
export const isValidUsername = (username) => {
  return VALIDATION_PATTERNS.USERNAME.test(username);
};

// Validate amount
export const isValidAmount = (amount) => {
  return VALIDATION_PATTERNS.AMOUNT.test(amount) && parseFloat(amount) > 0;
};

// Truncate text
export const truncateText = (text, maxLength = 50) => {
  if (!text || text.length <= maxLength) return text;
  return `${text.substring(0, maxLength)}...`;
};

// Generate random ID
export const generateId = () => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

// Debounce function
export const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
};

// Throttle function
export const throttle = (func, limit) => {
  let inThrottle;
  return (...args) => {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

// Deep clone object
export const deepClone = (obj) => {
  return JSON.parse(JSON.stringify(obj));
};

// Get percentage
export const getPercentage = (value, total) => {
  if (!total || total === 0) return 0;
  return ((value / total) * 100).toFixed(1);
};

// Group transactions by category
export const groupByCategory = (transactions) => {
  return transactions.reduce((acc, transaction) => {
    const category = transaction.category;
    if (!acc[category]) {
      acc[category] = {
        category,
        total_income: 0,
        total_expenses: 0,
        count: 0
      };
    }
    if (transaction.type === 'income') {
      acc[category].total_income += transaction.amount;
    } else {
      acc[category].total_expenses += transaction.amount;
    }
    acc[category].count++;
    return acc;
  }, {});
};

// Group transactions by month
export const groupByMonth = (transactions) => {
  return transactions.reduce((acc, transaction) => {
    const month = formatDate(transaction.date, 'yyyy-MM');
    if (!acc[month]) {
      acc[month] = {
        month,
        total_income: 0,
        total_expenses: 0,
        count: 0
      };
    }
    if (transaction.type === 'income') {
      acc[month].total_income += transaction.amount;
    } else {
      acc[month].total_expenses += transaction.amount;
    }
    acc[month].count++;
    return acc;
  }, {});
};

// Calculate summary statistics
export const calculateSummary = (transactions) => {
  const summary = {
    total_income: 0,
    total_expenses: 0,
    net_balance: 0,
    total_transactions: transactions.length
  };
  
  transactions.forEach(transaction => {
    if (transaction.type === 'income') {
      summary.total_income += transaction.amount;
    } else {
      summary.total_expenses += transaction.amount;
    }
  });
  
  summary.net_balance = summary.total_income - summary.total_expenses;
  return summary;
};

// Filter transactions
export const filterTransactions = (transactions, filters) => {
  return transactions.filter(transaction => {
    if (filters.type && transaction.type !== filters.type) return false;
    if (filters.category && transaction.category !== filters.category) return false;
    if (filters.start_date && transaction.date < filters.start_date) return false;
    if (filters.end_date && transaction.date > filters.end_date) return false;
    if (filters.min_amount && transaction.amount < filters.min_amount) return false;
    if (filters.max_amount && transaction.amount > filters.max_amount) return false;
    return true;
  });
};

// Sort transactions
export const sortTransactions = (transactions, sortBy = 'date', sortOrder = 'desc') => {
  return [...transactions].sort((a, b) => {
    let aVal = a[sortBy];
    let bVal = b[sortBy];
    
    if (sortBy === 'date') {
      aVal = new Date(aVal);
      bVal = new Date(bVal);
    }
    
    if (sortOrder === 'asc') {
      return aVal > bVal ? 1 : -1;
    } else {
      return aVal < bVal ? 1 : -1;
    }
  });
};

// Paginate data
export const paginateData = (data, page = 1, limit = 20) => {
  const start = (page - 1) * limit;
  const end = start + limit;
  return {
    data: data.slice(start, end),
    pagination: {
      page,
      limit,
      total: data.length,
      totalPages: Math.ceil(data.length / limit)
    }
  };
};

// Download data as CSV
export const downloadAsCSV = (data, filename) => {
  if (!data || data.length === 0) return;
  
  const headers = Object.keys(data[0]);
  const csvRows = [
    headers.join(','),
    ...data.map(row => headers.map(header => JSON.stringify(row[header] || '')).join(','))
  ];
  
  const csvContent = csvRows.join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${filename}.csv`;
  a.click();
  window.URL.revokeObjectURL(url);
};

// Copy to clipboard
export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error('Failed to copy:', err);
    return false;
  }
};

// Get color for transaction type
export const getTransactionTypeColor = (type) => {
  return type === 'income' ? 'text-green-600' : 'text-red-600';
};

// Get icon for transaction category
export const getCategoryIcon = (category) => {
  const icons = {
    Food: '🍔',
    Transport: '🚗',
    Rent: '🏠',
    Utilities: '💡',
    Entertainment: '🎬',
    Shopping: '🛍️',
    Healthcare: '🏥',
    Salary: '💰',
    Investment: '📈',
    Freelance: '💻',
    Gift: '🎁',
    Refund: '🔄'
  };
  return icons[category] || '📝';
};

// Get status badge color
export const getStatusBadgeColor = (status) => {
  return status === 'active' 
    ? 'bg-green-100 text-green-800' 
    : 'bg-gray-100 text-gray-800';
};

// Get role badge color
export const getRoleBadgeColor = (role) => {
  const colors = {
    admin: 'bg-red-100 text-red-800',
    analyst: 'bg-blue-100 text-blue-800',
    viewer: 'bg-green-100 text-green-800'
  };
  return colors[role] || 'bg-gray-100 text-gray-800';
};

// Class name merger
export const cn = (...classes) => {
  return classes.filter(Boolean).join(' ');
};

// Check if object is empty
export const isEmpty = (obj) => {
  return obj && Object.keys(obj).length === 0 && obj.constructor === Object;
};

// Capitalize first letter
export const capitalize = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
};

// Convert to title case
export const toTitleCase = (str) => {
  if (!str) return '';
  return str.replace(/\w\S*/g, (txt) => {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
};

// Get relative time
export const getRelativeTime = (date) => {
  const now = new Date();
  const diffInDays = differenceInDays(now, new Date(date));
  
  if (diffInDays === 0) return 'Today';
  if (diffInDays === 1) return 'Yesterday';
  if (diffInDays < 7) return `${diffInDays} days ago`;
  if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
  if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} months ago`;
  return `${Math.floor(diffInDays / 365)} years ago`;
};

// Local storage helpers
export const storage = {
  set: (key, value) => {
    localStorage.setItem(key, JSON.stringify(value));
  },
  get: (key) => {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  },
  remove: (key) => {
    localStorage.removeItem(key);
  },
  clear: () => {
    localStorage.clear();
  }
};