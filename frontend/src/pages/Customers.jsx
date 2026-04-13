import React, { useState, useEffect } from 'react';
import { Users, History, Activity } from 'lucide-react';
import api from '../utils/api';

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const res = await api.get('/crm/customers');
        setCustomers(res.data);
      } catch (err) {
        console.error("Failed to fetch customers", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCustomers();
  }, []);

  return (
    <div className="space-y-6 animate-slide-up">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Customers</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">View converted clients and activity history.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Customer List */}
        <div className="lg:col-span-2 glass rounded-2xl overflow-hidden shadow-sm">
          <div className="p-4 border-b border-slate-200 dark:border-slate-700 font-semibold bg-white/40 dark:bg-slate-800/40">
            Active Accounts
          </div>
          <div className="overflow-x-auto min-h-[300px]">
            {loading ? (
               <div className="p-8 text-center text-slate-500">Loading customers...</div>
            ) : customers.length === 0 ? (
               <div className="p-8 text-center text-slate-500 flex flex-col items-center">
                 <Users className="w-10 h-10 mb-2 opacity-50"/>
                 No customers found yet. Convert a lead to see them here!
               </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 dark:bg-slate-800/50 text-slate-500 text-sm uppercase tracking-wider border-b border-slate-200 dark:border-slate-700">
                    <th className="p-4 font-semibold">Company</th>
                    <th className="p-4 font-semibold">Contact</th>
                    <th className="p-4 font-semibold">Converted On</th>
                    <th className="p-4 font-semibold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                  {customers.map((c) => (
                    <tr key={c.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors cursor-pointer" onClick={() => setSelectedCustomer(c)}>
                      <td className="p-4 font-medium text-slate-900 dark:text-white">{c.company || 'N/A'}</td>
                      <td className="p-4 text-slate-600 dark:text-slate-300">
                        <div>{c.name}</div>
                        <div className="text-xs text-slate-500">{c.email}</div>
                      </td>
                      <td className="p-4 text-sm text-slate-500">
                        {new Date(c.created_at).toLocaleDateString()}
                      </td>
                      <td className="p-4 text-right">
                         <button className="text-primary-600 hover:text-primary-800 text-sm font-medium">History &rarr;</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Activity Log Panel */}
        <div className="glass rounded-2xl p-6 shadow-sm border-t-4 border-t-purple-500 h-fit max-h-[600px] overflow-y-auto">
          <h2 className="text-lg font-bold text-slate-800 dark:text-white mb-4 flex items-center">
            <History className="w-5 h-5 mr-2 text-purple-500" />
            Activity History
          </h2>

          {!selectedCustomer ? (
            <div className="text-center text-slate-500 mt-10 italic">
              Select a customer to view their activity log.
            </div>
          ) : (
            <div className="space-y-4">
              <div className="mb-6 p-4 bg-slate-100 dark:bg-slate-800/80 rounded-xl">
                 <h3 className="font-semibold">{selectedCustomer.company || selectedCustomer.name}</h3>
                 <p className="text-sm text-slate-500">{selectedCustomer.activities?.length || 0} activities recorded</p>
              </div>
              
              <div className="relative border-l border-slate-200 dark:border-slate-700 ml-3 space-y-6 pb-4">
                 {selectedCustomer.activities?.map((activity) => (
                   <div key={activity.id} className="relative pl-6">
                     <span className="absolute -left-1.5 top-1 w-3 h-3 rounded-full bg-purple-500 ring-4 ring-white dark:ring-dark-bg"></span>
                     <p className="text-sm text-slate-800 dark:text-slate-200">{activity.description}</p>
                     <p className="text-xs text-slate-500 mt-1">{new Date(activity.created_at).toLocaleString()}</p>
                   </div>
                 ))}
                 
                 {(!selectedCustomer.activities || selectedCustomer.activities.length === 0) && (
                   <div className="pl-6 text-sm text-slate-500">No activity logged.</div>
                 )}
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default Customers;
