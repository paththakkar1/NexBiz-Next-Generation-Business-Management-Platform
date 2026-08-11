import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Receipt, 
  Package, 
  Briefcase, 
  Sparkles, 
  Building2, 
  ChevronLeft, 
  ChevronRight 
} from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab, isCollapsed, setIsCollapsed }) {
  const navItems = [
    { id: 'dashboard', label: 'Executive Dashboard', icon: LayoutDashboard, badge: null },
    { id: 'crm', label: 'CRM & Sales Pipeline', icon: Users, badge: 'Kanban' },
    { id: 'invoices', label: 'Invoices & Payments', icon: Receipt, badge: 'GST + RZP' },
    { id: 'inventory', label: 'Inventory & Stock', icon: Package, badge: 'Alerts' },
    { id: 'payroll', label: 'HR & Payroll System', icon: Briefcase, badge: null },
    { id: 'insights', label: 'AI Smart Insights', icon: Sparkles, badge: 'AI' }
  ];

  return (
    <aside className={`transition-all duration-300 ease-in-out glass-panel border-r border-slate-800 flex flex-col justify-between z-40 sticky top-0 h-screen ${isCollapsed ? 'w-20' : 'w-64'}`}>
      <div>
        {/* Top Header Logo */}
        <div className="p-4 flex items-center justify-between border-b border-slate-800/80">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-emerald-400 p-0.5 shadow-lg shadow-indigo-500/20 shrink-0">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Building2 className="w-5 h-5 text-indigo-400" />
              </div>
            </div>
            {!isCollapsed && (
              <div className="transition-opacity duration-200">
                <span className="font-display text-lg font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-indigo-200 bg-clip-text text-transparent">
                  NexBiz
                </span>
                <p className="text-[10px] text-emerald-400 font-semibold uppercase tracking-wider">Enterprise Suite</p>
              </div>
            )}
          </div>
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition"
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="p-3 space-y-1.5 mt-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3 py-3 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-lg shadow-indigo-600/30'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900/60'
                }`}
                title={isCollapsed ? item.label : ''}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  {!isCollapsed && <span>{item.label}</span>}
                </div>
                {!isCollapsed && item.badge && (
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    isActive ? 'bg-white/20 text-white' : 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer Info */}
      {!isCollapsed && (
        <div className="p-4 border-t border-slate-800/80">
          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-400">
            <p className="font-semibold text-slate-200">NexBiz IN-SaaS</p>
            <p className="text-[11px] mt-0.5">GST Compliant • Razorpay Ready</p>
          </div>
        </div>
      )}
    </aside>
  );
}
