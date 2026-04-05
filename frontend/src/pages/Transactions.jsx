import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout/Layout';
import TransactionList from '../components/Transactions/TransactionList';
import TransactionForm from '../components/Transactions/TransactionForm';
import TransactionFilters from '../components/Transactions/TransactionFilters';
import transactionService from '../services/transactionService';
import { useAuth } from '../contexts/AuthContext';
import { PlusIcon } from '@heroicons/react/24/outline';

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [filters, setFilters] = useState({
    type: '',
    category: '',
    start_date: '',
    end_date: '',
    page: 1,
    limit: 20
  });
  const [pagination, setPagination] = useState({});
  const { hasPermission } = useAuth();

  const canCreate = hasPermission(['create_transaction']);

  useEffect(() => {
    fetchTransactions();
  }, [filters]);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const data = await transactionService.getTransactions(filters);
      setTransactions(data.transactions);
      setPagination(data.pagination);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (transactionData) => {
    await transactionService.createTransaction(transactionData);
    fetchTransactions();
    setShowForm(false);
  };

  const handleUpdate = async (id, transactionData) => {
    await transactionService.updateTransaction(id, transactionData);
    fetchTransactions();
  };

  const handleDelete = async (id) => {
    await transactionService.deleteTransaction(id);
    fetchTransactions();
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Transactions</h1>
          {canCreate && (
            <button
              onClick={() => setShowForm(true)}
              className="btn-primary flex items-center gap-2"
            >
              <PlusIcon className="w-5 h-5" />
              Add Transaction
            </button>
          )}
        </div>

        <TransactionFilters filters={filters} onFilterChange={setFilters} />
        
        <TransactionList
          transactions={transactions}
          loading={loading}
          onDelete={handleDelete}
          onUpdate={handleUpdate}
        />

        {pagination.total > filters.limit && (
          <div className="flex justify-center gap-2 mt-4">
            <button
              onClick={() => setFilters(prev => ({ ...prev, page: prev.page - 1 }))}
              disabled={filters.page === 1}
              className="btn-secondary disabled:opacity-50"
            >
              Previous
            </button>
            <span className="px-4 py-2">
              Page {filters.page} of {Math.ceil(pagination.total / filters.limit)}
            </span>
            <button
              onClick={() => setFilters(prev => ({ ...prev, page: prev.page + 1 }))}
              disabled={filters.page >= Math.ceil(pagination.total / filters.limit)}
              className="btn-secondary disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}

        {showForm && (
          <TransactionForm
            onSubmit={handleCreate}
            onClose={() => setShowForm(false)}
          />
        )}
      </div>
    </Layout>
  );
};

export default Transactions;