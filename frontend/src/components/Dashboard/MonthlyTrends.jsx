import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

const MonthlyTrends = ({ data, loading }) => {
  if (loading) {
    return <div className="card h-96 animate-pulse bg-gray-200"></div>;
  }

  const chartData = data.map(item => ({
    month: item.month,
    Income: item.total_income,
    Expenses: Math.abs(item.total_expenses)
  }));

  if (chartData.length === 0) {
    return (
      <div className="card h-96 flex items-center justify-center">
        <p className="text-gray-500">No trend data available</p>
      </div>
    );
  }

  return (
    <div className="card">
      <h3 className="text-lg font-semibold mb-4">Monthly Trends</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="Income" stroke="#10B981" strokeWidth={2} />
          <Line type="monotone" dataKey="Expenses" stroke="#EF4444" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MonthlyTrends;