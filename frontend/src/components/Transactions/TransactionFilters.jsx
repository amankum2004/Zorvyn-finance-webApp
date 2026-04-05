import React from 'react';
import transactionService from '../../services/transactionService';
import { useState, useEffect } from 'react';

const TransactionFilters = ({ filters, onFilterChange }) => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    const cats = await transactionService.getCategories();
    setCategories(cats);
  };

  const handleChange = (e) => {
    onFilterChange({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  const handleReset = () => {
    onFilterChange({
      type: '',
      category: '',
      start_date: '',
      end_date: '',
      page: 1,
      limit: 20
    });
  };

  return (
    <div className="card">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Type
          </label>
          <select
            name="type"
            value={filters.type}
            onChange={handleChange}
            className="input-field"
          >
            <option value="">All</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Category
          </label>
          <select
            name="category"
            value={filters.category}
            onChange={handleChange}
            className="input-field"
          >
            <option value="">All</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Start Date
          </label>
          <input
            type="date"
            name="start_date"
            value={filters.start_date}
            onChange={handleChange}
            className="input-field"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            End Date
          </label>
          <input
            type="date"
            name="end_date"
            value={filters.end_date}
            onChange={handleChange}
            className="input-field"
          />
        </div>
      </div>

      <div className="mt-4 flex justify-end">
        <button onClick={handleReset} className="btn-secondary">
          Reset Filters
        </button>
      </div>
    </div>
  );
};

export default TransactionFilters;