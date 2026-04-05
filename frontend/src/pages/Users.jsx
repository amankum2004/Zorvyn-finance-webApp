import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout/Layout';
import UserList from '../components/Users/UserList';
import UserForm from '../components/Users/UserForm';
import UserFilters from '../components/Users/UserFilters';
import userService from '../services/userService';
import { useAuth } from '../contexts/AuthContext';
import { PlusIcon } from '@heroicons/react/24/outline';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [filters, setFilters] = useState({
    status: '',
    role_id: ''
  });
  const { user: currentUser } = useAuth();

  useEffect(() => {
    fetchUsers();
  }, [filters]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await userService.getUsers(filters);
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (userData) => {
    await userService.createUser(userData);
    fetchUsers();
    setShowForm(false);
  };

  const handleUpdate = async (id, userData) => {
    await userService.updateUser(id, userData);
    fetchUsers();
  };

  const handleDelete = async (id) => {
    await userService.deleteUser(id);
    fetchUsers();
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
          <button
            onClick={() => setShowForm(true)}
            className="btn-primary flex items-center gap-2"
          >
            <PlusIcon className="w-5 h-5" />
            Add User
          </button>
        </div>

        <UserFilters filters={filters} onFilterChange={setFilters} />
        
        <UserList
          users={users}
          loading={loading}
          onDelete={handleDelete}
          onUpdate={handleUpdate}
          currentUser={currentUser}
        />

        {showForm && (
          <UserForm
            onSubmit={handleCreate}
            onClose={() => setShowForm(false)}
          />
        )}
      </div>
    </Layout>
  );
};

export default Users;