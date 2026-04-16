import React, { useState, useEffect } from 'react';
import { Users, CalendarClock, TrendingUp, CheckCircle2, Activity, Bell, UserCheck, CalendarDays } from 'lucide-react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';

const StatCard = ({ title, value, icon: Icon, trend }) => (
  <div className="glass rounded-2xl p-6 dark:bg-slate-800/40 hover:transform hover:-translate-y-1 transition-all duration-300">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">{title}</p>
        <h3 className="text-3xl font-bold text-slate-800 dark:text-white">{value}</h3>
      </div>
      <div className="w-12 h-12 rounded-xl bg-primary-100 dark:bg-primary-900/30 text-primary-600 flex items-center justify-center">
        <Icon className="w-6 h-6" />
      </div>
    </div>
    {trend && (
      <div className="mt-4 flex items-center text-sm">
        <TrendingUp className="w-4 h-4 mr-1 text-emerald-500" />
        <span className="text-emerald-500 font-medium">{trend}</span>
        <span className="text-slate-500 dark:text-slate-400 ml-2">vs last month</span>
      </div>
    )}
  </div>
);

const Dashboard = () => {
  const { user } = useAuth();
  const isEmployee = user?.role === 'Employee';
  const isHR = user?.role === 'HR Executive';

  const [stats, setStats] = useState({
    total_leads: 0,
    pending_leaves: 0,
    converted: 0,
    revenue: "$0",
    total_employees: 0
  });
  const [recentActivities, setRecentActivities] = useState([]);
  const [hrActivities, setHrActivities] = useState([]);
  const [loading, setLoading] = useState(!isEmployee);

  // Standard Company Reminders
  const reminders = [
    { id: 1, name: 'Company Town Hall', time: 'Friday, 3:00 PM', priority: 'High' },
    { id: 2, name: 'Submit Timesheets', time: 'End of Week', priority: 'Medium' },
    { id: 3, name: 'Quarterly Review Prep', time: 'Next Tuesday', priority: 'Low' },
  ];

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/dashboard/stats');
        if(res.data && res.data.stats) {
            setStats(res.data.stats);
            setRecentActivities(res.data.recent_activities || []);
            setHrActivities(res.data.hr_activities || []);
        }
      } catch (err) {
        console.error("Failed to fetch dashboard stats", err);
      } finally {
        setLoading(false);
      }
    };
    
    // Only fetch rich CRM/sales stats if not a pure employee base role
    if (!isEmployee) {
      fetchStats();
    }
  }, [isEmployee]);

  // View Layout 1: Strict Minimum Employee Context
  if (isEmployee) {
    return (
      <div className="space-y-6 animate-slide-up max-w-4xl mx-auto">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Welcome, {user?.full_name}</h1>
            <p className="text-slate-500 dark:text-slate-400">View company announcements and your reminders.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="glass rounded-2xl p-8 flex flex-col justify-center items-center text-center shadow-sm border-t-4 border-t-primary-500">
             <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 mb-4">
               <UserCheck className="w-8 h-8" />
             </div>
             <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">My Portal</h3>
             <p className="text-slate-500 dark:text-slate-400 text-sm mb-4">Access your personal employee profile, submit leave applications, and view status history.</p>
             <a href="/my-portal" className="inline-block px-6 py-2.5 bg-primary-600 text-white rounded-xl font-medium hover:bg-primary-700 transition">Go to Portal &rarr;</a>
          </div>

          <div className="glass rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-800 dark:text-white mb-4 flex items-center">
              <Bell className="w-5 h-5 mr-2 text-primary-500" />
              Company Reminders
            </h2>
            <div className="space-y-4">
              {reminders.map((reminder) => (
                <div key={reminder.id} className="p-4 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-100 dark:border-slate-700 hover:border-primary-300 transition-colors group cursor-pointer">
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="font-semibold text-slate-800 dark:text-slate-200">{reminder.name}</h4>
                    <span className={`text-xs px-2 py-1 rounded-md font-medium
                      ${reminder.priority === 'High' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' : ''}
                      ${reminder.priority === 'Medium' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' : ''}
                      ${reminder.priority === 'Low' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : ''}
                    `}>
                      {reminder.priority}
                    </span>
                  </div>
                  <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center">
                    <CalendarClock className="w-3.5 h-3.5 mr-1" />
                    {reminder.time}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // View Layout 2: Strict HR Executive Context
  if (isHR) {
    return (
      <div className="space-y-6 animate-slide-up">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">HR Dashboard</h1>
            <p className="text-slate-500 dark:text-slate-400">Welcome back, {user?.full_name}. Here's your staff overview.</p>
          </div>
        </div>
  
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 max-w-4xl mx-auto mb-8">
          <StatCard title="Total Staff" value={loading ? "..." : stats.total_employees} icon={Users} trend="+2%" />
          <StatCard title="Pending Leave Requests" value={loading ? "..." : stats.pending_leaves} icon={CalendarClock} />
        </div>
  
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
          <div className="lg:col-span-2 glass rounded-2xl p-6 flex flex-col shadow-sm border-t-4 border-t-amber-500">
            <h2 className="text-lg font-bold text-slate-800 dark:text-white mb-4 flex items-center">
               <CalendarDays className="w-5 h-5 mr-2 text-amber-500" /> Action Required: Pending Leaves
            </h2>
            
            {loading ? (
               <div className="flex-1 flex justify-center items-center text-slate-500">Loading activities...</div>
            ) : hrActivities.length === 0 ? (
               <div className="flex-1 flex justify-center items-center border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl text-slate-500 mt-2">
                 Your approval queue is clear.
               </div>
            ) : (
              <div className="space-y-4">
                {hrActivities.map(activity => (
                  <div key={activity.id} className="flex items-center p-4 bg-white/50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-700 hover:border-amber-300 transition-colors">
                    <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-amber-600 mr-4">
                      <CalendarDays className="w-5 h-5"/>
                    </div>
                    <div className="flex-1 border-r border-slate-200 dark:border-slate-700 pr-4 mr-4">
                      <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200">{activity.title}</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{activity.time}</p>
                    </div>
                    <a href="/hrm" className="text-sm font-medium text-primary-600 hover:text-primary-800 py-2 border border-slate-200 dark:border-slate-700 px-3 rounded-lg bg-white dark:bg-slate-800">
                      View
                    </a>
                  </div>
                ))}
              </div>
            )}
          </div>
  
          <div className="glass rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-800 dark:text-white mb-4">Active Priorities</h2>
            <div className="space-y-4">
              {reminders.map((reminder) => (
                <div key={reminder.id} className="p-4 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-100 dark:border-slate-700 hover:border-primary-300 transition-colors group cursor-pointer">
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="font-semibold text-slate-800 dark:text-slate-200 transition-colors">{reminder.name}</h4>
                  </div>
                  <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center">
                    <CalendarClock className="w-3.5 h-3.5 mr-1" />
                    {reminder.time}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // View Layout 3: Standard Admin / Sales Dashboard
  return (
    <div className="space-y-6 animate-slide-up">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            {user?.role === 'Sales Executive' ? 'My Sales Performance' : 'Admin / Sales Overview'}
          </h1>
          <p className="text-slate-500 dark:text-slate-400">Welcome back, {user?.full_name}. Here's what's happening today.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard title="Total Leads" value={loading ? "..." : stats.total_leads} icon={Users} trend="+12%" />
        {user?.role === 'Sales Executive' ? (
          <StatCard title="My Conversion Rate" value={loading ? "..." : stats.conversion_rate} icon={Activity} />
        ) : (
          <StatCard title="Pending Leaves" value={loading ? "..." : stats.pending_leaves} icon={CalendarClock} />
        )}
        <StatCard title="Converted" value={loading ? "..." : stats.converted} icon={CheckCircle2} trend="+4%" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        <div className="lg:col-span-2 glass rounded-2xl p-6 flex flex-col">
          <h2 className="text-lg font-bold text-slate-800 dark:text-white mb-4">Recent Lead Activity</h2>
          
          {loading ? (
             <div className="flex-1 flex justify-center items-center text-slate-500">Loading activities...</div>
          ) : recentActivities.length === 0 ? (
             <div className="flex-1 flex justify-center items-center border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl text-slate-500">
               No recent activities
             </div>
          ) : (
            <div className="space-y-4">
              {recentActivities.map(activity => (
                <div key={activity.id} className="flex items-center p-4 bg-white/50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-700 hover:border-primary-300 transition-colors">
                  <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 mr-4">
                    <Activity className="w-5 h-5"/>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200">{activity.title}</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{activity.time}</p>
                  </div>
                  <span className={`text-xs px-2.5 py-1 rounded-md font-medium border
                    ${activity.status === 'New' ? 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400' : ''}
                    ${activity.status === 'System' ? 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-400' : ''}
                    ${activity.status === 'Converted' ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400' : ''}
                  `}>
                    {activity.status.replace('_', ' ')}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="glass rounded-2xl p-6">
          <h2 className="text-lg font-bold text-slate-800 dark:text-white mb-4">Follow-up Reminders</h2>
          <div className="space-y-4">
            {reminders.map((reminder) => (
              <div key={reminder.id} className="p-4 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-100 dark:border-slate-700 hover:border-primary-300 transition-colors group cursor-pointer">
                <div className="flex justify-between items-start mb-1">
                  <h4 className="font-semibold text-slate-800 dark:text-slate-200 group-hover:text-primary-600 transition-colors">{reminder.name}</h4>
                  <span className={`text-xs px-2 py-1 rounded-md font-medium
                    ${reminder.priority === 'High' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' : ''}
                    ${reminder.priority === 'Medium' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' : ''}
                    ${reminder.priority === 'Low' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : ''}
                  `}>
                    {reminder.priority}
                  </span>
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center">
                  <CalendarClock className="w-3.5 h-3.5 mr-1" />
                  {reminder.time}
                </p>
              </div>
            ))}
          </div>
          <button className="w-full mt-4 py-2 text-sm text-primary-600 font-medium hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors">
            View All Tasks
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
