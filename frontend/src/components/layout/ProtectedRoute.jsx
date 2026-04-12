import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, hasRole, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !hasRole(allowedRoles)) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-dark-bg p-4">
        <div className="glass rounded-2xl p-8 max-w-md w-full text-center shadow-xl animate-fade-in">
          <h1 className="text-2xl font-bold text-red-500 mb-2">Access Denied</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
            You do not have the required role to view this page.
          </p>
          <button 
            onClick={() => window.history.back()}
            className="w-full py-2 px-4 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors font-medium"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
