import React from 'react';

const UserFilters = ({ filters, onFilterChange }) => {
  const handleChange = (e) => {
    onFilterChange({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  const handleReset = () => {
    onFilterChange({
      status: '',
      role_id: ''
    });
  };

  return (
    <div className="card">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <select
            name="status"
            value={filters.status}
            onChange={handleChange}
            className="input-field"
          >
            <option value="">All</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Role
          </label>
          <select
            name="role_id"
            value={filters.role_id}
            onChange={handleChange}
            className="input-field"
          >
            <option value="">All</option>
            <option value="1">Admin</option>
            <option value="2">Analyst</option>
            <option value="3">Viewer</option>
          </select>
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

export default UserFilters;