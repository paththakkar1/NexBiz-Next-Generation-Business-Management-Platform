import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import ExecutiveDashboard from './views/ExecutiveDashboard';
import CrmView from './views/CrmView';
import InvoicesView from './views/InvoicesView';
import InventoryView from './views/InventoryView';
import PayrollView from './views/PayrollView';
import AiInsightsView from './views/AiInsightsView';
import { Plus, Users, Receipt, Package, CheckCircle2 } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [apiStatus, setApiStatus] = useState('checking...');
  const [showQuickActionModal, setShowQuickActionModal] = useState(false);

  useEffect(() => {
    fetch('/api/health')
      .then((res) => res.ok ? setApiStatus('connected') : setApiStatus('disconnected'))
      .catch(() => setApiStatus('disconnected'));
  }, []);

  const handleNavigate = (targetModule) => {
    setActiveTab(targetModule);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex font-sans antialiased">
      {/* Navigation Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isCollapsed={isSidebarCollapsed}
        setIsCollapsed={setIsSidebarCollapsed}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Sticky Header */}
        <Header 
          apiStatus={apiStatus} 
          onOpenQuickAction={() => setShowQuickActionModal(true)} 
        />

        {/* Dynamic View Body */}
        <main className="flex-1 max-w-7xl w-full mx-auto p-6 md:p-8">
          {activeTab === 'dashboard' && <ExecutiveDashboard onNavigate={handleNavigate} />}
          {activeTab === 'crm' && <CrmView />}
          {activeTab === 'invoices' && <InvoicesView />}
          {activeTab === 'inventory' && <InventoryView />}
          {activeTab === 'payroll' && <PayrollView />}
          {activeTab === 'insights' && <AiInsightsView onNavigate={handleNavigate} />}
        </main>

        {/* Global Footer */}
        <footer className="border-t border-slate-800/80 py-6 px-8 glass-panel text-center text-xs text-slate-500">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <p>© 2026 NexBiz Platform. Built for High-Growth Indian SaaS Enterprises.</p>
            <div className="flex items-center gap-4 text-slate-400 font-mono">
              <span>GSTIN Compliant</span>
              <span>•</span>
              <span>Razorpay SDK v1</span>
              <span>•</span>
              <span>MySQL 8.0 DDL</span>
            </div>
          </div>
        </footer>
      </div>

      {/* Global Quick Action Trigger Modal */}
      {showQuickActionModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel max-w-md w-full rounded-2xl border border-slate-800 p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-display font-bold text-base text-white flex items-center gap-2">
                <Plus className="w-5 h-5 text-indigo-400" /> NexBiz Quick Actions
              </h3>
              <button onClick={() => setShowQuickActionModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <p className="text-xs text-slate-400">Select a module shortcut to perform instant operational tasks:</p>

            <div className="space-y-2.5">
              <button
                onClick={() => { setShowQuickActionModal(false); setActiveTab('invoices'); }}
                className="w-full p-3 rounded-xl bg-slate-900 hover:bg-indigo-600/20 border border-slate-800 hover:border-indigo-500/50 text-left flex items-center gap-3 group transition"
              >
                <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 group-hover:bg-indigo-500 group-hover:text-white transition">
                  <Receipt className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-slate-200">Create New Invoice</h4>
                  <p className="text-[11px] text-slate-500">Itemized line items & 18% GST calculation</p>
                </div>
              </button>

              <button
                onClick={() => { setShowQuickActionModal(false); setActiveTab('crm'); }}
                className="w-full p-3 rounded-xl bg-slate-900 hover:bg-blue-600/20 border border-slate-800 hover:border-blue-500/50 text-left flex items-center gap-3 group transition"
              >
                <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition">
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-slate-200">Add Sales Lead</h4>
                  <p className="text-[11px] text-slate-500">Add opportunity to Kanban sales pipeline</p>
                </div>
              </button>

              <button
                onClick={() => { setShowQuickActionModal(false); setActiveTab('inventory'); }}
                className="w-full p-3 rounded-xl bg-slate-900 hover:bg-amber-600/20 border border-slate-800 hover:border-amber-500/50 text-left flex items-center gap-3 group transition"
              >
                <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 group-hover:bg-amber-500 group-hover:text-white transition">
                  <Package className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-slate-200">Log Stock Movement</h4>
                  <p className="text-[11px] text-slate-500">Record incoming shipment or outgoing sales</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
