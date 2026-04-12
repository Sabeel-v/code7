import React, { useState, useEffect } from 'react';
import { Calendar, CheckCircle, XCircle, Plus } from 'lucide-react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';

const HRM = () => {
  const { user, hasRole } = useAuth();
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    leave_type: 'Sick Leave',
    start_date: '',
    end_date: '',
    reason: ''
  });

  const fetchLeaves = async () => {
    try {
      const res = await api.get('/hrm/leave-requests');
      setLeaves(res.data);
    } catch (err) {
      console.error("Failed to fetch leaves", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  const handleAction = async (id, newStatus) => {
    try {
      await api.post(`/hrm/leave-requests/${id}/approve?status=${newStatus}`);
      fetchLeaves();
    } catch (err) {
      console.error("Failed to update status", err);
      alert(err.response?.data?.detail || "Error updating leave status");
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await api.post('/hrm/leave-requests', formData);
      setShowForm(false);
      setFormData({ leave_type: 'Sick Leave', start_date: '', end_date: '', reason: '' });
      fetchLeaves();
    } catch (err) {
      console.error("Failed to create request", err);
      alert(err.response?.data?.detail || "Error creating leave request");
    }
  };

  // Only HR/Admin can approve.
  const canApprove = hasRole(['Admin', 'HR_Executive']);

  return (
    <div className="space-y-6 animate-slide-up">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">HRM Dashboard</h1>
          <p className="text-slate-500 dark:text-slate-400">Manage employee leave requests.</p>
        </div>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="flex items-center px-4 py-2.5 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors font-medium shadow-sm active:scale-95"
        >
          <Plus className="w-5 h-5 mr-2" />
          Request Leave
        </button>
      </div>

      {showForm && (
        <div className="glass rounded-2xl p-6 mb-8 animate-fade-in border-t-4 border-t-primary-500">
          <h2 className="text-lg font-bold mb-4">Request New Leave</h2>
          <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Leave Type</label>
              <select required value={formData.leave_type} onChange={e => setFormData({...formData, leave_type: e.target.value})} className="w-full bg-white/50 border border-slate-300 dark:border-slate-600 dark:bg-slate-800 p-2.5 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none">
                <option>Sick Leave</option>
                <option>Vacation</option>
                <option>Personal</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Reason (Optional)</label>
              <input value={formData.reason} onChange={e => setFormData({...formData, reason: e.target.value})} type="text" className="w-full bg-white/50 border border-slate-300 dark:border-slate-600 dark:bg-slate-800 p-2.5 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none" placeholder="Brief reason" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Start Date</label>
              <input required value={formData.start_date} onChange={e => setFormData({...formData, start_date: e.target.value})} type="date" className="w-full bg-white/50 border border-slate-300 dark:border-slate-600 dark:bg-slate-800 p-2.5 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">End Date</label>
              <input required value={formData.end_date} onChange={e => setFormData({...formData, end_date: e.target.value})} type="date" className="w-full bg-white/50 border border-slate-300 dark:border-slate-600 dark:bg-slate-800 p-2.5 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none" />
            </div>
            
            <div className="flex items-end space-x-2 md:col-span-2">
              <button type="submit" className="flex-1 bg-primary-600 text-white p-2.5 rounded-lg font-medium hover:bg-primary-700">
                Submit Request
              </button>
              <button type="button" onClick={() => setShowForm(false)} className="px-4 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 p-2.5 rounded-lg font-medium hover:bg-slate-300 dark:hover:bg-slate-600">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="glass rounded-2xl overflow-hidden shadow-sm">
        <div className="p-6 border-b border-slate-200 dark:border-slate-700 bg-white/40 dark:bg-slate-800/40">
          <h2 className="text-lg font-bold text-slate-800 dark:text-white">Leave Requests</h2>
        </div>
        
        <div className="p-0 min-h-[200px]">
          {loading ? (
             <div className="p-8 text-center text-slate-500">Loading requests...</div>
          ) : leaves.length === 0 ? (
            <div className="p-8 text-center text-slate-500">No leave requests found.</div>
          ) : (
            <div className="divide-y divide-slate-200 dark:divide-slate-700">
              {leaves.map((leave) => (
                <div key={leave.id} className="p-6 flex flex-col sm:flex-row sm:items-center justify-between hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                  <div className="flex items-start mb-4 sm:mb-0">
                    <div className="w-12 h-12 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-600 flex items-center justify-center mr-4 mt-1 font-bold">
                      {leave.employee_id} {/* Ideally we join user table for name */}
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-slate-800 dark:text-white">Emp ID: {leave.employee_id}</h4>
                      <p className="text-slate-500 dark:text-slate-400 text-sm flex items-center mt-1">
                        <Calendar className="w-4 h-4 mr-1.5" />
                        {leave.leave_type} &bull; {leave.start_date} to {leave.end_date}
                      </p>
                      {leave.reason && <p className="text-sm mt-1 text-slate-500 italic">"{leave.reason}"</p>}
                      <span className={`inline-block mt-2 text-xs px-2.5 py-1 rounded-md font-medium border
                        ${leave.status === 'Pending' ? 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400' : ''}
                        ${leave.status === 'Approved' ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400' : ''}
                        ${leave.status === 'Rejected' ? 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400' : ''}
                      `}>
                        {leave.status}
                      </span>
                    </div>
                  </div>

                  {leave.status === 'Pending' && canApprove && (
                    <div className="flex space-x-3 sm:ml-4">
                      <button 
                        onClick={() => handleAction(leave.id, 'Approved')}
                        className="flex items-center px-4 py-2 bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500 hover:text-white rounded-lg transition-colors font-medium border border-emerald-200 hover:border-transparent dark:border-emerald-800"
                      >
                        <CheckCircle className="w-4 h-4 mr-2" /> Approve
                      </button>
                      <button 
                        onClick={() => handleAction(leave.id, 'Rejected')}
                        className="flex items-center px-4 py-2 bg-red-500/10 text-red-600 hover:bg-red-500 hover:text-white rounded-lg transition-colors font-medium border border-red-200 hover:border-transparent dark:border-red-800"
                      >
                        <XCircle className="w-4 h-4 mr-2" /> Reject
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HRM;
