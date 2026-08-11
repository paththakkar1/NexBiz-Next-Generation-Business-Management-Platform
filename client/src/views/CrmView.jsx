import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Plus, 
  Search, 
  Kanban, 
  Building, 
  Phone, 
  Mail, 
  Calendar, 
  ArrowRight, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  TrendingUp, 
  MoreHorizontal 
} from 'lucide-react';

export default function CrmView() {
  const [activeSubTab, setActiveSubTab] = useState('kanban'); // 'kanban' or 'customers'
  const [leads, setLeads] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddLeadModal, setShowAddLeadModal] = useState(false);

  // Form State
  const [newLead, setNewLead] = useState({
    title: '',
    company_name: '',
    value: '',
    status: 'Lead',
    contact_email: '',
    contact_phone: '',
    notes: ''
  });

  const stages = ['Lead', 'Contacted', 'Qualified', 'Won', 'Lost'];

  const fetchCrmData = () => {
    setLoading(true);
    fetch('/api/crm/leads')
      .then(res => res.json())
      .then(res => {
        if (res.data) setLeads(res.data);
      })
      .catch(err => console.log('Error fetching leads:', err));

    fetch('/api/crm/customers')
      .then(res => res.json())
      .then(res => {
        if (res.data) setCustomers(res.data);
        setLoading(false);
      })
      .catch(err => setLoading(false));
  };

  useEffect(() => {
    fetchCrmData();
  }, []);

  const handleStageChange = (leadId, newStage) => {
    fetch(`/api/crm/leads/${leadId}/stage`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStage })
    })
      .then(res => res.json())
      .then(res => {
        setLeads(prev => prev.map(l => l.id === leadId ? { ...l, status: newStage } : l));
      })
      .catch(err => console.log('Stage update error:', err));
  };

  const handleCreateLead = (e) => {
    e.preventDefault();
    fetch('/api/crm/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newLead)
    })
      .then(res => res.json())
      .then(res => {
        if (res.data) {
          setLeads(prev => [res.data, ...prev]);
          setShowAddLeadModal(false);
          setNewLead({ title: '', company_name: '', value: '', status: 'Lead', contact_email: '', contact_phone: '', notes: '' });
        }
      })
      .catch(err => console.log('Error creating lead:', err));
  };

  const getTotalPipelineValue = () => {
    return leads.reduce((sum, l) => sum + parseFloat(l.value || 0), 0);
  };

  return (
    <div className="space-y-6">
      {/* Top Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-panel p-5 rounded-2xl border border-slate-800">
        <div>
          <h1 className="font-display text-2xl font-bold text-white flex items-center gap-2">
            <Users className="w-6 h-6 text-indigo-400" /> CRM & Sales Pipeline
          </h1>
          <p className="text-slate-400 text-xs mt-1">
            Total Pipeline Value: <span className="text-emerald-400 font-bold font-mono">₹{getTotalPipelineValue().toLocaleString('en-IN')}</span> across {leads.length} deals
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Sub Tab Switcher */}
          <div className="p-1 bg-slate-900 rounded-xl border border-slate-800 flex items-center gap-1 text-xs">
            <button
              onClick={() => setActiveSubTab('kanban')}
              className={`px-3 py-1.5 rounded-lg font-medium transition ${activeSubTab === 'kanban' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}
            >
              Kanban Board
            </button>
            <button
              onClick={() => setActiveSubTab('customers')}
              className={`px-3 py-1.5 rounded-lg font-medium transition ${activeSubTab === 'customers' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}
            >
              Customer Directory
            </button>
          </div>

          <button
            onClick={() => setShowAddLeadModal(true)}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-indigo-600/30 flex items-center gap-1.5 transition"
          >
            <Plus className="w-4 h-4" /> Add Lead
          </button>
        </div>
      </div>

      {/* Kanban Board View */}
      {activeSubTab === 'kanban' && (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 overflow-x-auto pb-4">
          {stages.map((stage) => {
            const stageLeads = leads.filter(l => l.status === stage);
            const stageTotal = stageLeads.reduce((sum, l) => sum + parseFloat(l.value || 0), 0);

            const stageColors = {
              Lead: 'border-t-indigo-500 bg-indigo-500/5',
              Contacted: 'border-t-blue-500 bg-blue-500/5',
              Qualified: 'border-t-purple-500 bg-purple-500/5',
              Won: 'border-t-emerald-500 bg-emerald-500/5',
              Lost: 'border-t-red-500 bg-red-500/5'
            };

            return (
              <div
                key={stage}
                className={`p-3.5 rounded-2xl glass-panel border border-slate-800 border-t-4 ${stageColors[stage]} flex flex-col space-y-3 min-w-[240px]`}
              >
                {/* Stage Header */}
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="font-display text-xs font-bold text-slate-100">{stage}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-900 border border-slate-800 text-slate-400">
                      {stageLeads.length}
                    </span>
                  </div>
                  <span className="text-[11px] font-mono font-semibold text-emerald-400">
                    ₹{(stageTotal / 1000).toFixed(0)}k
                  </span>
                </div>

                {/* Cards List */}
                <div className="space-y-3 flex-1 overflow-y-auto max-h-[550px]">
                  {stageLeads.map((lead) => (
                    <div
                      key={lead.id}
                      className="p-3.5 rounded-xl glass-card border border-slate-800 space-y-2 hover:border-indigo-500/40 transition group relative"
                    >
                      <h4 className="font-bold text-xs text-slate-100 group-hover:text-indigo-300 transition leading-snug">
                        {lead.title}
                      </h4>
                      <p className="text-[11px] text-slate-400 flex items-center gap-1">
                        <Building className="w-3 h-3 text-slate-500" /> {lead.company_name}
                      </p>

                      <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
                        <span className="font-mono font-bold text-emerald-400">
                          ₹{parseFloat(lead.value).toLocaleString('en-IN')}
                        </span>
                        {lead.follow_up_date && (
                          <span className="text-[10px] text-slate-500 flex items-center gap-1">
                            <Calendar className="w-3 h-3" /> {lead.follow_up_date}
                          </span>
                        )}
                      </div>

                      {/* Quick Stage Move Dropdown/Buttons */}
                      <div className="pt-2 flex items-center justify-between gap-1 opacity-90 group-hover:opacity-100 transition">
                        <span className="text-[10px] text-slate-500">Move to:</span>
                        <div className="flex items-center gap-1">
                          {stages.filter(s => s !== stage).slice(0, 2).map(nextS => (
                            <button
                              key={nextS}
                              onClick={() => handleStageChange(lead.id, nextS)}
                              className="text-[9px] px-1.5 py-0.5 rounded bg-slate-900 hover:bg-indigo-600 hover:text-white border border-slate-800 text-slate-300 transition"
                            >
                              {nextS}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}

                  {stageLeads.length === 0 && (
                    <div className="p-4 text-center border border-dashed border-slate-800/80 rounded-xl text-xs text-slate-500">
                      No deals in {stage}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Customer Directory View */}
      {activeSubTab === 'customers' && (
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="font-display font-bold text-sm text-white">Client Accounts Directory</h3>
            <span className="text-xs text-slate-400">{customers.length} Accounts Registered</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-900/80 text-slate-400 uppercase font-mono border-b border-slate-800">
                <tr>
                  <th className="p-3">Company Name</th>
                  <th className="p-3">Contact Person</th>
                  <th className="p-3">Phone</th>
                  <th className="p-3">Email</th>
                  <th className="p-3">Source</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {customers.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-900/40 transition">
                    <td className="p-3 font-semibold text-slate-100 flex items-center gap-2">
                      <Building className="w-4 h-4 text-indigo-400" /> {c.company_name}
                    </td>
                    <td className="p-3">{c.contact_person}</td>
                    <td className="p-3 text-slate-400"><Phone className="w-3 h-3 inline mr-1" />{c.phone}</td>
                    <td className="p-3 text-slate-400"><Mail className="w-3 h-3 inline mr-1" />{c.email}</td>
                    <td className="p-3">{c.lead_source}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                        c.status === 'Active' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-slate-800 text-slate-400 border-slate-700'
                      }`}>
                        {c.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Lead Modal */}
      {showAddLeadModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel max-w-lg w-full rounded-2xl border border-slate-800 p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-display font-bold text-base text-white">Create Sales Opportunity Lead</h3>
              <button onClick={() => setShowAddLeadModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleCreateLead} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Deal Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Enterprise License Deal"
                  value={newLead.title}
                  onChange={e => setNewLead({ ...newLead, title: e.target.value })}
                  className="w-full bg-slate-900 text-slate-200 p-2.5 rounded-xl border border-slate-800 focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Company Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="Client Company"
                    value={newLead.company_name}
                    onChange={e => setNewLead({ ...newLead, company_name: e.target.value })}
                    className="w-full bg-slate-900 text-slate-200 p-2.5 rounded-xl border border-slate-800 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Deal Value (INR) *</label>
                  <input
                    type="number"
                    required
                    placeholder="500000"
                    value={newLead.value}
                    onChange={e => setNewLead({ ...newLead, value: e.target.value })}
                    className="w-full bg-slate-900 text-slate-200 p-2.5 rounded-xl border border-slate-800 focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Contact Email</label>
                  <input
                    type="email"
                    placeholder="email@company.com"
                    value={newLead.contact_email}
                    onChange={e => setNewLead({ ...newLead, contact_email: e.target.value })}
                    className="w-full bg-slate-900 text-slate-200 p-2.5 rounded-xl border border-slate-800 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Stage</label>
                  <select
                    value={newLead.status}
                    onChange={e => setNewLead({ ...newLead, status: e.target.value })}
                    className="w-full bg-slate-900 text-slate-200 p-2.5 rounded-xl border border-slate-800 focus:border-indigo-500"
                  >
                    {stages.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddLeadModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-900 text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold shadow-lg shadow-indigo-600/30"
                >
                  Save Lead
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
