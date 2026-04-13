import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, UserPlus, LogOut, UserCircle, Briefcase } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Sidebar = ({ isMobileOpen, setMobileOpen }) => {
  const { user, logout, hasRole } = useAuth();

  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard, roles: ['Admin', 'Sales Manager', 'Sales Executive', 'HR Executive', 'Employee'] },
    { name: 'Leads', path: '/leads', icon: Users, roles: ['Admin', 'Sales Manager', 'Sales Executive'] },
    { name: 'Customers', path: '/customers', icon: Briefcase, roles: ['Admin', 'Sales Manager', 'Sales Executive'] },
    { name: 'HRM', path: '/hrm', icon: UserPlus, roles: ['Admin', 'HR Executive'] },
    { name: 'My Portal', path: '/my-portal', icon: UserCircle, roles: ['Admin', 'Sales Manager', 'Sales Executive', 'HR Executive', 'Employee'] },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-20 lg:hidden transition-opacity"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar container */}
      <aside className={`fixed top-0 left-0 h-screen w-64 glass lg:border-r border-slate-200 dark:border-slate-800 z-30 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'} flex flex-col`}>
        <div className="h-16 flex items-center px-6 border-b border-slate-200/50 dark:border-slate-700/50">
          <div className="text-xl font-bold bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent">
            Business Pro
          </div>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            if (!hasRole(item.roles)) return null;
            
            return (
              <NavLink
                key={item.name}
                to={item.path}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `flex items-center px-3 py-2.5 rounded-xl transition-all duration-200 group ${
                    isActive
                      ? 'bg-primary-50 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400 shadow-sm'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/50 dark:hover:text-slate-200'
                  }`
                }
              >
                <item.icon className="w-5 h-5 mr-3 shrink-0" />
                <span className="font-medium text-sm">{item.name}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-200/50 dark:border-slate-700/50">
          <button
            onClick={logout}
            className="flex items-center w-full px-3 py-2.5 rounded-xl text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors group"
          >
            <LogOut className="w-5 h-5 mr-3" />
            <span className="font-medium text-sm">Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
