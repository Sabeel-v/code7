import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate, useLocation } from 'react-router-dom';
import { ShieldCheck, UserPlus, LogIn } from 'lucide-react';

const Login = () => {
  const { user, login, register, error } = useAuth();
  const location = useLocation();
  const [isRegistering, setIsRegistering] = useState(false);
  
  // Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState('Employee');
  const [loading, setLoading] = useState(false);

  // If already logged in, redirect
  if (user) {
    return <Navigate to={location.state?.from?.pathname || '/'} replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    if (isRegistering) {
      await register({ full_name: fullName, email, password, role });
    } else {
      await login(email, password);
    }
    
    setLoading(false);
  };

  const roles = ['Admin', 'Sales_Manager', 'Sales_Executive', 'HR_Executive', 'Employee'];

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-primary-50 to-purple-50 dark:from-slate-900 dark:to-slate-800 p-4">
      <div className="glass rounded-3xl p-8 max-w-md w-full shadow-[0_8px_30px_rgb(0,0,0,0.12)] animate-slide-up border border-white/40 dark:border-slate-700/50">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-primary-600 to-purple-500 flex items-center justify-center shadow-lg transform rotate-3 hover:rotate-6 transition-transform">
            <ShieldCheck className="w-8 h-8 text-white" />
          </div>
        </div>
        
        <h2 className="text-2xl font-bold text-center text-slate-800 dark:text-white mb-2">
          {isRegistering ? 'Create your account' : 'Welcome back'}
        </h2>
        <p className="text-center text-slate-500 dark:text-slate-400 mb-8 text-sm">
          {isRegistering ? 'Sign up to access the system' : 'Sign in to your account'}
        </p>

        {error && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-sm rounded-xl text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {isRegistering && (
            <>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
                <input
                  required
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white text-sm rounded-xl focus:ring-primary-500 focus:border-primary-500 block p-3 transition-colors shadow-sm"
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Role</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white text-sm rounded-xl focus:ring-primary-500 focus:border-primary-500 block p-3 transition-colors shadow-sm"
                >
                  {roles.map((r) => (
                    <option key={r} value={r}>
                      {r.replace('_', ' ')}
                    </option>
                  ))}
                </select>
              </div>
            </>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email</label>
            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white text-sm rounded-xl focus:ring-primary-500 focus:border-primary-500 block p-3 transition-colors shadow-sm"
              placeholder="you@example.com"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Password</label>
            <input
              required
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white text-sm rounded-xl focus:ring-primary-500 focus:border-primary-500 block p-3 transition-colors shadow-sm"
              placeholder="••••••••"
            />
          </div>

          <button
            disabled={loading}
            type="submit"
            className="w-full mt-2 flex justify-center items-center text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:ring-primary-300 font-medium rounded-xl text-sm px-5 py-3 text-center transition-all duration-200 transform hover:scale-[1.02] shadow-md hover:shadow-lg disabled:opacity-50"
          >
            {loading ? 'Processing...' : (isRegistering ? <span className="flex items-center"><UserPlus className="w-4 h-4 mr-2"/> Sign Up</span> : <span className="flex items-center"><LogIn className="w-4 h-4 mr-2"/> Sign In</span>)}
          </button>
        </form>

        <div className="mt-6 text-center text-sm">
          <span className="text-slate-500 dark:text-slate-400">
            {isRegistering ? "Already have an account?" : "Don't have an account?"}
          </span>
          <button 
            type="button"
            onClick={() => setIsRegistering(!isRegistering)}
            className="ml-2 font-semibold text-primary-600 hover:text-primary-700 transition-colors"
          >
            {isRegistering ? 'Sign In' : 'Sign Up'}
          </button>
        </div>

      </div>
    </div>
  );
};

export default Login;
