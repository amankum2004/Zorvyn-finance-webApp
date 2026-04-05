import React, { useState } from 'react';
import { format } from 'date-fns';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import TransactionForm from './TransactionForm';

const TransactionList = ({ transactions, loading, onDelete, onUpdate }) => {
  const [editingTransaction, setEditingTransaction] = useState(null);

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      onDelete(id);
    }
  };

  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map(i => (
          <div key={i} className="animate-pulse">
            <div className="h-16 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No transactions found</p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-3">
        {transactions.map((transaction) => (
          <div key={transaction.id} className="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <span className={`text-lg font-semibold ${
                    transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {transaction.type === 'income' ? '+' : '-'}${Math.abs(transaction.amount).toFixed(2)}
                  </span>
                  <span className="text-sm text-gray-600">{transaction.category}</span>
                  <span className="text-xs text-gray-400">
                    {format(new Date(transaction.date), 'MMM dd, yyyy')}
                  </span>
                </div>
                {transaction.description && (
                  <p className="text-sm text-gray-500 mt-1">{transaction.description}</p>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setEditingTransaction(transaction)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                >
                  <PencilIcon className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(transaction.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                >
                  <TrashIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {editingTransaction && (
        <TransactionForm
          transaction={editingTransaction}
          onSubmit={(data) => {
            onUpdate(editingTransaction.id, data);
            setEditingTransaction(null);
          }}
          onClose={() => setEditingTransaction(null)}
        />
      )}
    </>
  );
};

export default TransactionList;