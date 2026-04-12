import React from 'react';
import { Users, CalendarClock, TrendingUp, CheckCircle2 } from 'lucide-react';

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
  const reminders = [
    { id: 1, name: 'Acme Corp Follow-up', time: 'Today, 2:00 PM', priority: 'High' },
    { id: 2, name: 'Stark Industries Proposal', time: 'Tomorrow, 10:00 AM', priority: 'Medium' },
    { id: 3, name: 'Wayne Ent Review', time: 'Wed, 3:30 PM', priority: 'Low' },
  ];

  return (
    <div className="space-y-6 animate-slide-up">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Dashboard Overview</h1>
          <p className="text-slate-500 dark:text-slate-400">Welcome back, here's what's happening today.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Leads" value="142" icon={Users} trend="+12%" />
        <StatCard title="Pending Leaves" value="5" icon={CalendarClock} />
        <StatCard title="Converted" value="28" icon={CheckCircle2} trend="+4%" />
        <StatCard title="Revenue" value="$42k" icon={TrendingUp} trend="+18%" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        <div className="lg:col-span-2 glass rounded-2xl p-6">
          <h2 className="text-lg font-bold text-slate-800 dark:text-white mb-4">Activity Overview</h2>
          <div className="h-64 flex items-center justify-center border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl">
            <span className="text-slate-400">Chart Placeholder</span>
          </div>
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
