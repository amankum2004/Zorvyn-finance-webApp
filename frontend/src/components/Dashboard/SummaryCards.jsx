import React from 'react';
import { ArrowUpIcon, ArrowDownIcon, CurrencyDollarIcon } from '@heroicons/react/24/outline';

const SummaryCards = ({ data, loading }) => {
  const cards = [
    {
      title: 'Total Income',
      value: `$${data?.total_income?.toFixed(2) || '0.00'}`,
      icon: ArrowUpIcon,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      title: 'Total Expenses',
      value: `$${data?.total_expenses?.toFixed(2) || '0.00'}`,
      icon: ArrowDownIcon,
      color: 'text-red-600',
      bgColor: 'bg-red-100'
    },
    {
      title: 'Net Balance',
      value: `$${data?.net_balance?.toFixed(2) || '0.00'}`,
      icon: CurrencyDollarIcon,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      title: 'Transactions',
      value: data?.total_transactions || 0,
      icon: CurrencyDollarIcon,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    }
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="card animate-pulse">
            <div className="h-24 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, index) => (
        <div key={index} className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">{card.title}</p>
              <p className="text-2xl font-bold mt-1">{card.value}</p>
            </div>
            <div className={`${card.bgColor} p-3 rounded-full`}>
              <card.icon className={`w-6 h-6 ${card.color}`} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SummaryCards;