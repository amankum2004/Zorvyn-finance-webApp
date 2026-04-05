import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout/Layout';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import dashboardService from '../services/dashboardService';
import { format, subMonths } from 'date-fns';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

const Reports = () => {
  const [categories, setCategories] = useState([]);
  const [trends, setTrends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState({
    start_date: format(subMonths(new Date(), 12), 'yyyy-MM-dd'),
    end_date: format(new Date(), 'yyyy-MM-dd')
  });

  useEffect(() => {
    fetchReportData();
  }, [dateRange]);

  const fetchReportData = async () => {
    setLoading(true);
    try {
      const [categoriesData, trendsData] = await Promise.all([
        dashboardService.getCategoryTotals(dateRange),
        dashboardService.getMonthlyTrends(dateRange)
      ]);
      setCategories(categoriesData);
      setTrends(trendsData);
    } catch (error) {
      console.error('Error fetching report data:', error);
    } finally {
      setLoading(false);
    }
  };

  const incomeData = categories
    .filter(c => c.total_income > 0)
    .map(c => ({ name: c.category, value: c.total_income }));

  const expenseData = categories
    .filter(c => c.total_expenses > 0)
    .map(c => ({ name: c.category, value: Math.abs(c.total_expenses) }));

  const trendData = trends.map(item => ({
    month: item.month,
    Income: item.total_income,
    Expenses: Math.abs(item.total_expenses),
    Profit: item.total_income - Math.abs(item.total_expenses)
  }));

  if (loading) {
    return (
      <Layout>
        <div className="space-y-6">
          <div className="animate-pulse">
            <div className="h-96 bg-gray-200 rounded"></div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Financial Reports</h1>
          <div className="flex gap-2">
            <input
              type="date"
              value={dateRange.start_date}
              onChange={(e) => setDateRange(prev => ({ ...prev, start_date: e.target.value }))}
              className="input-field w-auto"
            />
            <input
              type="date"
              value={dateRange.end_date}
              onChange={(e) => setDateRange(prev => ({ ...prev, end_date: e.target.value }))}
              className="input-field w-auto"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="card">
            <h3 className="text-lg font-semibold mb-4">Income by Category</h3>
            {incomeData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={incomeData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {incomeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-gray-500 text-center py-8">No income data available</p>
            )}
          </div>

          <div className="card">
            <h3 className="text-lg font-semibold mb-4">Expenses by Category</h3>
            {expenseData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={expenseData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {expenseData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-gray-500 text-center py-8">No expense data available</p>
            )}
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Income vs Expenses Trend</h3>
          {trendData.length > 0 ? (
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="Income" fill="#10B981" />
                <Bar dataKey="Expenses" fill="#EF4444" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-500 text-center py-8">No trend data available</p>
          )}
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Profit/Loss Analysis</h3>
          {trendData.length > 0 ? (
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="Profit" fill="#3B82F6">
                  {trendData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.Profit >= 0 ? '#10B981' : '#EF4444'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-500 text-center py-8">No profit/loss data available</p>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Reports;