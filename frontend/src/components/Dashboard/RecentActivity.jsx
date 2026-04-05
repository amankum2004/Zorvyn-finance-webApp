import React from 'react';
import { format } from 'date-fns';

const RecentActivity = ({ data, loading }) => {
  if (loading) {
    return <div className="card h-96 animate-pulse bg-gray-200"></div>;
  }

  return (
    <div className="card">
      <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
      <div className="space-y-3">
        {data.length === 0 ? (
          <p className="text-gray-500 text-center">No recent activity</p>
        ) : (
          data.map((activity, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className={`text-sm font-medium ${
                    activity.type === 'income' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {activity.type === 'income' ? '+' : '-'}${Math.abs(activity.amount).toFixed(2)}
                  </span>
                  <span className="text-sm text-gray-600">{activity.category}</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">{activity.description || 'No description'}</p>
                <p className="text-xs text-gray-400 mt-1">
                  {format(new Date(activity.date), 'MMM dd, yyyy')} • by {activity.username}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default RecentActivity;