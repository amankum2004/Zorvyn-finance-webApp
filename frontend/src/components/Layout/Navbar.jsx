import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-sm">
      <div className="px-4 py-3 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">
            Welcome back, {user?.username}!
          </h2>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center px-3 py-2 text-sm text-gray-700 hover:text-red-600 transition-colors"
        >
          <ArrowRightOnRectangleIcon className="w-5 h-5 mr-1" />
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;