import React, { useState, useEffect } from 'react';
import { Calendar, CheckCircle, XCircle, Users, UserCircle, UserPlus } from 'lucide-react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';

const HRM = () => {
  const { user, hasRole } = useAuth();
  const [activeTab, setActiveTab] = useState('leaves'); 
  const [leaves, setLeaves] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Admin Staff Creation State
  const [showStaffForm, setShowStaffForm] = useState(false);
  const [staffFormData, setStaffFormData] = useState({ full_name: '', email: '', password: '', role: 'Employee', department: 'Sales', designation: 'Executive' });

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'leaves') {
        const res = await api.get('/hrm/leave-requests');
        setLeaves(res.data);
      } else {
        const res = await api.get('/hrm/employees');
        setEmployees(res.data);
      }
    } catch (err) {
      console.error("Failed to fetch HRM data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const handleAction = async (id, newStatus) => {
    try {
      await api.post(`/hrm/leave-requests/${id}/approve?status=${newStatus}`);
      fetchData();
    } catch (err) {
      console.error("Failed to update status", err);
      alert(err.response?.data?.detail || "Error updating leave status");
    }
  };
  
  const handleCreateStaff = async (e) => {
    e.preventDefault();
    try {
      await api.post('/auth/create-user', staffFormData);
      setShowStaffForm(false);
      setStaffFormData({ full_name: '', email: '', password: '', role: 'Employee', department: 'Sales', designation: 'Executive' });
      fetchData();
    } catch (err) {
      let errorMsg = "Failed to create staff";
      if (err.response?.data?.detail) {
        errorMsg = Array.isArray(err.response.data.detail) ? err.response.data.detail[0].msg : err.response.data.detail;
      }
      alert(errorMsg);
    }
  };

  const canApprove = hasRole(['Admin', 'HR Executive']);
  const isAdmin = user?.role === 'Admin';

  return (
    <div className="space-y-6 animate-slide-up">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">HRM Administration</h1>
          <p className="text-slate-500 dark:text-slate-400">Manage company employees and leave workflows.</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex space-x-2 bg-slate-200 dark:bg-slate-800 p-1 rounded-xl">
            <button 
              onClick={() => { setActiveTab('leaves'); setShowStaffForm(false); }} 
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${activeTab === 'leaves' ? 'bg-white dark:bg-slate-700 text-primary-600 shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'}`}
            >
              Leave Requests
            </button>
            <button 
              onClick={() => setActiveTab('employees')} 
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${activeTab === 'employees' ? 'bg-white dark:bg-slate-700 text-primary-600 shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'}`}
            >
              Employee List
            </button>
          </div>
          
          {isAdmin && activeTab === 'employees' && (
             <button 
               onClick={() => setShowStaffForm(!showStaffForm)} 
               className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition font-medium shadow-sm active:scale-95 text-sm"
             >
                <UserPlus className="w-4 h-4 mr-2" />
                New Staff
             </button>
          )}
        </div>
      </div>
      
      {/* Admin Creation Form */}
      {showStaffForm && activeTab === 'employees' && isAdmin && (
        <div className="glass rounded-2xl p-6 mb-8 animate-fade-in border-t-4 border-t-primary-500">
           <form onSubmit={handleCreateStaff} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
                <input required value={staffFormData.full_name} onChange={e=>setStaffFormData({...staffFormData, full_name: e.target.value})} className="w-full bg-white/50 border border-slate-300 dark:border-slate-600 dark:bg-slate-800 p-2.5 rounded-lg text-sm" placeholder="John Doe" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email</label>
                <input required type="email" value={staffFormData.email} onChange={e=>setStaffFormData({...staffFormData, email: e.target.value})} className="w-full bg-white/50 border border-slate-300 dark:border-slate-600 dark:bg-slate-800 p-2.5 rounded-lg text-sm" placeholder="staff@example.com" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Password</label>
                <input required type="password" value={staffFormData.password} onChange={e=>setStaffFormData({...staffFormData, password: e.target.value})} className="w-full bg-white/50 border border-slate-300 dark:border-slate-600 dark:bg-slate-800 p-2.5 rounded-lg text-sm" placeholder="••••••••" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Role Allocation</label>
                <select value={staffFormData.role} onChange={e=>setStaffFormData({...staffFormData, role: e.target.value})} className="w-full bg-white/50 border border-slate-300 dark:border-slate-600 dark:bg-slate-800 p-2.5 rounded-lg text-sm text-slate-800 dark:text-white">
                  {['Admin', 'Sales Manager', 'Sales Executive', 'HR Executive', 'Employee'].map(r => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Department</label>
                <select value={staffFormData.department} onChange={e=>setStaffFormData({...staffFormData, department: e.target.value})} className="w-full bg-white/50 border border-slate-300 dark:border-slate-600 dark:bg-slate-800 p-2.5 rounded-lg text-sm text-slate-800 dark:text-white">
                  {['Sales', 'HR', 'IT', 'Operations', 'Finance'].map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Designation</label>
                <select value={staffFormData.designation} onChange={e=>setStaffFormData({...staffFormData, designation: e.target.value})} className="w-full bg-white/50 border border-slate-300 dark:border-slate-600 dark:bg-slate-800 p-2.5 rounded-lg text-sm text-slate-800 dark:text-white">
                  {['Manager', 'Executive', 'Senior Developer', 'Analyst', 'Director'].map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
              <div className="lg:col-span-4 flex justify-end space-x-2 mt-2">
                 <button type="button" onClick={() => setShowStaffForm(false)} className="px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-sm font-medium hover:bg-slate-300 transition-colors">Cancel</button>
                 <button type="submit" className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 text-sm font-medium transition-colors cursor-pointer">Register User</button>
              </div>
           </form>
        </div>
      )}

      <div className="glass rounded-2xl overflow-hidden shadow-sm">
        <div className="p-6 border-b border-slate-200 dark:border-slate-700 bg-white/40 dark:bg-slate-800/40">
          <h2 className="text-lg font-bold text-slate-800 dark:text-white">
            {activeTab === 'leaves' ? 'Leave Workflow' : 'Company Staff'}
          </h2>
        </div>
        
        <div className="p-0 min-h-[400px]">
          {loading ? (
             <div className="p-8 text-center text-slate-500">Loading {activeTab}...</div>
          ) : activeTab === 'leaves' ? (
            <div className="divide-y divide-slate-200 dark:divide-slate-700">
              {leaves.length === 0 ? (
                <div className="p-8 text-center text-slate-500">No leave requests found.</div>
              ) : leaves.map((leave) => (
                <div key={leave.id} className="p-6 flex flex-col sm:flex-row sm:items-center justify-between hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                  <div className="flex items-start mb-4 sm:mb-0">
                    <div className="w-12 h-12 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-600 flex items-center justify-center mr-4 mt-1 font-bold">
                      {leave.employee_id}
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-slate-800 dark:text-white">Emp ID: {leave.employee_id}</h4>
                      <p className="text-slate-500 dark:text-slate-400 text-sm flex items-center mt-1">
                        <Calendar className="w-4 h-4 mr-1.5" />
                        {leave.leave_type} &bull; {new Date(leave.start_date).toLocaleDateString('en-GB')} to {new Date(leave.end_date).toLocaleDateString('en-GB')}
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
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/80 dark:bg-slate-800/80 text-slate-500 text-sm uppercase tracking-wider border-b border-slate-200 dark:border-slate-700">
                    <th className="p-4 font-semibold">Employee</th>
                    <th className="p-4 font-semibold">Department</th>
                    <th className="p-4 font-semibold">Role</th>
                    <th className="p-4 font-semibold">Joined Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                  {employees.map(emp => (
                    <tr key={emp.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                      <td className="p-4 font-medium text-slate-900 dark:text-white">
                        <div className="flex items-center">
                           <UserCircle className="w-8 h-8 text-slate-400 mr-3" />
                           <div>
                             <div>{emp.full_name}</div>
                             <div className="text-xs text-slate-500">{emp.email}</div>
                           </div>
                        </div>
                      </td>
                      <td className="p-4 text-slate-600 dark:text-slate-300">{emp.department || 'Pending Assignment'}</td>
                      <td className="p-4 text-slate-600 dark:text-slate-300">{emp.designation || 'Pending Assignment'}</td>
                      <td className="p-4 text-sm text-slate-500">{new Date(emp.joining_date).toLocaleDateString('en-GB')}</td>
                    </tr>
                  ))}
                  {employees.length === 0 && (
                    <tr><td colSpan="4" className="p-8 text-center text-slate-500">No employees registered.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HRM;
