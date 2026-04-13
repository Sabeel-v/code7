import React, { useState, useEffect } from 'react';
import { UserCircle, Calendar, Briefcase, Plus, CalendarClock } from 'lucide-react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';

const EmployeePortal = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Form State
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    leave_type: 'Sick Leave',
    start_date: '',
    end_date: '',
    reason: ''
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [profileRes, leavesRes] = await Promise.all([
        api.get('/hrm/my-profile'),
        api.get('/hrm/leave-requests')
      ]);
      setProfile(profileRes.data);
      setLeaves(leavesRes.data);
    } catch (error) {
      console.error("Failed to fetch employee portal data", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/hrm/leave-requests', formData);
      setShowForm(false);
      setFormData({ leave_type: 'Sick Leave', start_date: '', end_date: '', reason: '' });
      fetchData(); // Refresh list
    } catch (err) {
      console.error("Failed to submit leave request", err);
      alert(err.response?.data?.detail || "Error submitting leave request");
    }
  };

  if (loading && !profile) {
    return <div className="p-8 text-center text-slate-500 animate-pulse">Loading Portal...</div>;
  }

  return (
    <div className="space-y-6 animate-slide-up">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">My Portal</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Manage your employee profile and leave requests.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Profile Card */}
        <div className="glass rounded-2xl p-6 lg:col-span-1 h-fit shadow-sm border-t-4 border-t-primary-500">
          <div className="flex flex-col items-center">
            <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-primary-600 to-purple-500 flex items-center justify-center text-white mb-4 shadow-lg transform hover:rotate-6 transition-transform">
              <UserCircle className="w-12 h-12" />
            </div>
            <h2 className="text-xl font-bold text-slate-800 dark:text-white text-center">{profile?.full_name}</h2>
            <p className="text-slate-500 text-sm mb-6">{profile?.email}</p>
            
            <div className="w-full space-y-4">
              <div className="flex items-center justify-between p-3 bg-white/50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-700">
                <span className="text-slate-500 text-sm flex items-center"><Briefcase className="w-4 h-4 mr-2"/> Dept</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{profile?.department}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-white/50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-700">
                <span className="text-slate-500 text-sm flex items-center"><Briefcase className="w-4 h-4 mr-2"/> Role</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{profile?.designation}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-white/50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-700">
                <span className="text-slate-500 text-sm flex items-center"><Calendar className="w-4 h-4 mr-2"/> Joined</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{new Date(profile?.joining_date).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Leaves Section */}
        <div className="lg:col-span-2 space-y-6">
          
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-800 dark:text-white flex items-center">
              <CalendarClock className="w-5 h-5 mr-2 text-primary-500"/>
              My Leave Requests
            </h2>
            <button 
              onClick={() => setShowForm(!showForm)}
              className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors font-medium shadow-sm active:scale-95 text-sm"
            >
              <Plus className="w-4 h-4 mr-1" />
              New Request
            </button>
          </div>

          {showForm && (
            <div className="glass rounded-2xl p-6 animate-fade-in border-t-2 border-primary-400">
              <h3 className="font-semibold mb-4 text-slate-800 dark:text-white">Submit Leave Application</h3>
              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Leave Type</label>
                  <select required value={formData.leave_type} onChange={e => setFormData({...formData, leave_type: e.target.value})} className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg p-2.5 focus:ring-2 focus:ring-primary-500 outline-none text-sm">
                    <option>Sick Leave</option>
                    <option>Vacation</option>
                    <option>Personal</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Reason</label>
                  <input required value={formData.reason} onChange={e => setFormData({...formData, reason: e.target.value})} type="text" className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 p-2.5 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none text-sm" placeholder="Reason for leave" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Start Date</label>
                  <input required value={formData.start_date} onChange={e => setFormData({...formData, start_date: e.target.value})} type="date" className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 p-2.5 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">End Date</label>
                  <input required value={formData.end_date} onChange={e => setFormData({...formData, end_date: e.target.value})} type="date" className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 p-2.5 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none text-sm" />
                </div>
                <div className="md:col-span-2 flex space-x-2 pt-2">
                  <button type="submit" className="px-5 py-2.5 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 text-sm">
                    Submit
                  </button>
                  <button type="button" onClick={() => setShowForm(false)} className="px-5 py-2.5 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg font-medium hover:bg-slate-300 dark:hover:bg-slate-600 text-sm">
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="glass rounded-2xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto min-h-[250px]">
              {leaves.length === 0 ? (
                 <div className="p-8 text-center text-slate-500 flex flex-col items-center">
                   <CalendarClock className="w-12 h-12 text-slate-300 dark:text-slate-600 mb-3"/>
                   <p>No leave requests found.</p>
                 </div>
              ) : (
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/80 dark:bg-slate-800/80 text-slate-500 text-xs uppercase tracking-wider border-b border-slate-200 dark:border-slate-700">
                      <th className="p-4 font-semibold">Leave Type</th>
                      <th className="p-4 font-semibold">Duration</th>
                      <th className="p-4 font-semibold">Reason</th>
                      <th className="p-4 font-semibold text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                    {leaves.map((leave) => (
                      <tr key={leave.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                        <td className="p-4 font-medium text-slate-900 dark:text-white">
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-2 text-slate-400"/>
                            {leave.leave_type}
                          </div>
                        </td>
                        <td className="p-4 text-sm text-slate-600 dark:text-slate-300">
                          {leave.start_date} <br/> <span className="text-xs text-slate-400">to</span> {leave.end_date}
                        </td>
                        <td className="p-4 text-sm text-slate-500 dark:text-slate-400 truncate max-w-xs">{leave.reason}</td>
                        <td className="p-4 text-right">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border
                            ${leave.status === 'Pending' ? 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400' : ''}
                            ${leave.status === 'Approved' ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400' : ''}
                            ${leave.status === 'Rejected' ? 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400' : ''}
                          `}>
                            {leave.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default EmployeePortal;
