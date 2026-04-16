import React, { useState, useEffect } from 'react';
import { Search, Plus, Filter, MoreVertical, CheckCircle2, UserPlus } from 'lucide-react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';

const Leads = () => {
  const { hasRole } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [leads, setLeads] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  const canAssign = hasRole(['Admin', 'Sales Manager']);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    source: 'Website',
  });

  const fetchData = async () => {
    try {
      const res = await api.get('/leads/');
      setLeads(res.data);
      
      if (canAssign) {
        const uRes = await api.get('/auth/users');
        // Filter users that are sales executives
        setUsers(uRes.data.filter(u => ['Sales Executive', 'Sales Manager'].includes(u.role)));
      }
    } catch (err) {
      console.error("Failed to fetch leads", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await api.post('/leads/', formData);
      setShowForm(false);
      setFormData({ name: '', email: '', phone: '', company: '', source: 'Website' });
      fetchData();
    } catch (err) {
      console.error("Failed to create lead", err);
      alert("Failed to create lead.");
    }
  };

  const handleConvert = async (id) => {
    try {
      await api.post(`/leads/${id}/convert`);
      fetchData();
    } catch (err) {
      console.error("Failed to convert lead", err);
      alert(err.response?.data?.detail || "Error converting lead");
    }
  };

  const handleAssign = async (leadId, userId) => {
     if(!userId) return;
     try {
       await api.post(`/leads/${leadId}/assign?user_id=${userId}`);
       fetchData();
     } catch(err) {
       console.error("Failed to assign", err);
       alert("Failed to assign lead");
     }
  };

  // Filter leads based on live search term
  const filteredLeads = leads.filter(l => 
     (l.company?.toLowerCase() || '').includes(searchTerm.toLowerCase()) || 
     (l.name?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-slide-up">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Leads Management</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Track and convert your prospective clients.</p>
        </div>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="flex items-center px-4 py-2.5 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors font-medium shadow-sm active:scale-95"
        >
          <Plus className="w-5 h-5 mr-2" />
          New Lead
        </button>
      </div>

      {showForm && (
        <div className="glass rounded-2xl p-6 mb-8 animate-fade-in border-t-4 border-t-primary-500">
           <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
             {/* inputs are standard, skipped for brevity */}
             <div><label className="block text-sm">Company Name</label><input required value={formData.company} onChange={e=>setFormData({...formData, company: e.target.value})} className="w-full bg-white/50 border border-slate-300 dark:border-slate-600 dark:bg-slate-800 p-2.5 rounded-lg" /></div>
             <div><label className="block text-sm">Contact Name</label><input required value={formData.name} onChange={e=>setFormData({...formData, name: e.target.value})} className="w-full bg-white/50 border border-slate-300 dark:border-slate-600 dark:bg-slate-800 p-2.5 rounded-lg" /></div>
             <div><label className="block text-sm">Email</label><input required value={formData.email} onChange={e=>setFormData({...formData, email: e.target.value})} className="w-full bg-white/50 border border-slate-300 dark:border-slate-600 dark:bg-slate-800 p-2.5 rounded-lg" /></div>
             <div><label className="block text-sm">Phone</label><input value={formData.phone} onChange={e=>setFormData({...formData, phone: e.target.value})} className="w-full bg-white/50 border border-slate-300 dark:border-slate-600 dark:bg-slate-800 p-2.5 rounded-lg" /></div>
             <div>
                <label className="block text-sm">Source</label>
                <select value={formData.source} onChange={e=>setFormData({...formData, source: e.target.value})} className="w-full bg-white/50 border border-slate-300 dark:border-slate-600 dark:bg-slate-800 p-2.5 rounded-lg">
                  <option>Website</option><option>Referral</option><option>Cold Call</option>
                </select>
             </div>
             <div className="flex items-end space-x-2">
               <button type="submit" className="flex-1 bg-primary-600 text-white p-2.5 rounded-lg font-medium">Save Lead</button>
               <button type="button" onClick={() => setShowForm(false)} className="px-4 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 p-2.5 rounded-lg">Cancel</button>
             </div>
           </form>
        </div>
      )}

      <div className="glass rounded-2xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center bg-white/40 dark:bg-slate-800/40">
          <div className="relative max-w-sm w-full">
            <Search className="w-5 h-5 absolute left-3 top-2.5 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search leads..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-slate-200 dark:border-slate-700 rounded-lg bg-white/50 dark:bg-slate-900/50 focus:ring-2 focus:ring-primary-500 outline-none"
            />
          </div>
        </div>
        
        <div className="overflow-x-auto min-h-[300px]">
          {loading ? (
             <div className="p-8 text-center text-slate-500">Loading leads...</div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 dark:bg-slate-800/50 text-slate-500 text-sm uppercase tracking-wider border-b border-slate-200 dark:border-slate-700">
                  <th className="p-4 font-semibold">Company & Contact</th>
                  <th className="p-4 font-semibold">Status / Source</th>
                  <th className="p-4 font-semibold">Assignment</th>
                  <th className="p-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                {filteredLeads.length === 0 ? (
                  <tr><td colSpan="4" className="p-8 text-center text-slate-500">No leads match search.</td></tr>
                ) : filteredLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors group">
                    <td className="p-4">
                      <div className="font-medium text-slate-900 dark:text-white">{lead.company}</div>
                      <div className="text-slate-500 dark:text-slate-400 text-sm">{lead.name}</div>
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border
                        ${lead.status === 'New' ? 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400' : ''}
                        ${lead.status === 'Converted' ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-amber-50 text-amber-700 border-amber-200'}
                      `}>
                        {lead.status}
                      </span>
                      <div className="text-xs text-slate-400 mt-1">{lead.source}</div>
                    </td>
                    <td className="p-4">
                       {canAssign && lead.status !== 'Converted' ? (
                          <select 
                            value={lead.assigned_to || ''} 
                            onChange={(e) => handleAssign(lead.id, e.target.value)}
                            className="bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-md text-xs py-1 px-2 focus:ring-primary-500"
                          >
                            <option value="">Pending Assignment</option>
                            {users.map(u => <option key={u.id} value={u.id}>{u.full_name}</option>)}
                          </select>
                       ) : (
                          <span className="text-sm text-slate-500">
                             {lead.assigned_to ? `Assigned to ID: ${lead.assigned_to}` : 'Pending Assignment'}
                          </span>
                       )}
                    </td>
                    <td className="p-4 text-right flex justify-end space-x-2">
                      {lead.status !== 'Converted' ? (
                        <button 
                          onClick={() => handleConvert(lead.id)}
                          className="p-2 text-primary-600 bg-primary-50 dark:bg-primary-900/30 rounded-lg hover:bg-primary-100 dark:hover:bg-primary-900/50 transition-colors flex items-center"
                        >
                          <CheckCircle2 className="w-4 h-4 mr-1" /> <span className="text-xs font-medium">Convert</span>
                        </button>
                      ) : (
                        <span className="p-2 text-emerald-600 flex items-center text-xs font-medium"><CheckCircle2 className="w-4 h-4 mr-1"/> Done</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default Leads;
