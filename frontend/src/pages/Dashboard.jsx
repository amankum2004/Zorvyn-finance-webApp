import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout/Layout';
import SummaryCards from '../components/Dashboard/SummaryCards';
import CategoryChart from '../components/Dashboard/CategoryChart';
import MonthlyTrends from '../components/Dashboard/MonthlyTrends';
import RecentActivity from '../components/Dashboard/RecentActivity';
import dashboardService from '../services/dashboardService';
import { format, subMonths } from 'date-fns';

const Dashboard = () => {
  const [summary, setSummary] = useState(null);
  const [categories, setCategories] = useState([]);
  const [trends, setTrends] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState({
    summary: true,
    categories: true,
    trends: true,
    activities: true
  });
  const [dateRange, setDateRange] = useState({
    start_date: format(subMonths(new Date(), 6), 'yyyy-MM-dd'),
    end_date: format(new Date(), 'yyyy-MM-dd')
  });

  useEffect(() => {
    fetchDashboardData();
  }, [dateRange]);

  const fetchDashboardData = async () => {
    // Fetch summary
    try {
      const summaryData = await dashboardService.getSummary(dateRange);
      setSummary(summaryData);
    } catch (error) {
      console.error('Error fetching summary:', error);
    } finally {
      setLoading(prev => ({ ...prev, summary: false }));
    }

    // Fetch categories
    try {
      const categoriesData = await dashboardService.getCategoryTotals(dateRange);
      setCategories(categoriesData);
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(prev => ({ ...prev, categories: false }));
    }

    // Fetch trends
    try {
      const trendsData = await dashboardService.getMonthlyTrends(dateRange);
      setTrends(trendsData);
    } catch (error) {
      console.error('Error fetching trends:', error);
    } finally {
      setLoading(prev => ({ ...prev, trends: false }));
    }

    // Fetch activities
    try {
      const activitiesData = await dashboardService.getRecentActivity(10);
      setActivities(activitiesData);
    } catch (error) {
      console.error('Error fetching activities:', error);
    } finally {
      setLoading(prev => ({ ...prev, activities: false }));
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
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

        <SummaryCards data={summary} loading={loading.summary} />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <CategoryChart data={categories} loading={loading.categories} />
          <MonthlyTrends data={trends} loading={loading.trends} />
        </div>
        
        <RecentActivity data={activities} loading={loading.activities} />
      </div>
    </Layout>
  );
};

export default Dashboard;