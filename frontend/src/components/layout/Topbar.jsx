import React from 'react';
import { Menu, Bell } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Topbar = ({ onMenuClick }) => {
  const { user } = useAuth();

  return (
    <header className="h-16 glass sticky top-0 z-10 border-b border-slate-200/50 dark:border-slate-700/50 px-4 lg:px-8 flex items-center justify-between transition-all duration-200">
      <div className="flex items-center">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 -ml-2 mr-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none"
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>

      <div className="flex items-center space-x-4">
        <button className="relative p-2 rounded-full text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
        </button>
        
        <div className="flex items-center pl-4 border-l border-slate-200 dark:border-slate-700">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary-600 to-purple-500 text-white flex items-center justify-center font-semibold text-sm shadow-sm cursor-pointer hover:shadow-md transition-shadow">
            {user?.name?.charAt(0) || 'U'}
          </div>
          <div className="ml-3 hidden md:block">
            <p className="text-sm font-medium text-slate-700 dark:text-slate-200 leading-tight">
              {user?.name || 'Unknown User'}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {user?.role?.replace('_', ' ')}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
