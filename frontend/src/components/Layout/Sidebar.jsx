import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  HomeIcon, 
  CreditCardIcon, 
  UsersIcon, 
  ChartBarIcon,
  Cog6ToothIcon 
} from '@heroicons/react/24/outline';
import { useAuth } from '../../contexts/AuthContext';

const Sidebar = () => {
  const { user, hasPermission } = useAuth();

  const navigation = [
    { name: 'Dashboard', href: '/', icon: HomeIcon, permission: ['view_dashboard'] },
    { name: 'Transactions', href: '/transactions', icon: CreditCardIcon, permission: ['view_transactions'] },
    { name: 'Reports', href: '/reports', icon: ChartBarIcon, permission: ['view_dashboard'] },
  ];

  if (user?.role === 'admin') {
    navigation.push({ name: 'Users', href: '/users', icon: UsersIcon, permission: ['create_user'] });
  }

  return (
    <div className="w-64 bg-gray-900 text-white flex flex-col">
      <div className="p-4">
        <h1 className="text-xl font-bold">Finance Dashboard</h1>
      </div>
      <nav className="flex-1 px-2 space-y-1">
        {navigation.filter(item => hasPermission(item.permission)).map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            className={({ isActive }) =>
              `flex items-center px-4 py-2 text-sm rounded-lg transition-colors ${
                isActive
                  ? 'bg-primary-600 text-white'
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              }`
            }
          >
            <item.icon className="w-5 h-5 mr-3" />
            {item.name}
          </NavLink>
        ))}
      </nav>
      <div className="p-4 border-t border-gray-800">
        <div className="text-sm text-gray-400">
          <p>Logged in as</p>
          <p className="font-medium text-white">{user?.username}</p>
          <p className="text-xs capitalize">{user?.role}</p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
