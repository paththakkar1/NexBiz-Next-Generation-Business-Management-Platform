import React, { useState } from 'react';
import { 
  Search, 
  Bell, 
  Plus, 
  ShieldCheck, 
  Activity, 
  Sun, 
  Moon, 
  CheckCircle2, 
  AlertTriangle,
  UserCheck,
  ChevronDown
} from 'lucide-react';

export default function Header({ apiStatus, onOpenQuickAction }) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showRoleSwitcher, setShowRoleSwitcher] = useState(false);
  const [darkMode, setDarkMode] = useState(true);

  const [currentRole, setCurrentRole] = useState({
    name: 'Rajesh Sharma',
    role: 'Admin CEO',
    initials: 'RS',
    badge: 'Super Admin',
    badgeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
  });

  const availableRoles = [
    { name: 'Rajesh Sharma', role: 'Admin CEO', initials: 'RS', badge: 'Super Admin', badgeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
    { name: 'Priya Patel', role: 'Sales Executive', initials: 'PP', badge: 'CRM Staff', badgeColor: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
    { name: 'Sneha Rao', role: 'Finance Lead', initials: 'SR', badge: 'Accounts Manager', badgeColor: 'bg-purple-500/10 text-purple-400 border-purple-500/20' }
  ];

  const notifications = [
    { id: 1, title: 'Invoice #INV-2026-001 Paid', time: '10m ago', type: 'success', text: '₹1,13,000 received via Razorpay UPI.' },
    { id: 2, title: 'Low Stock Threshold Warning', time: '1h ago', type: 'warning', text: 'Smart Thermal Invoice Printer down to 4 units.' },
    { id: 3, title: 'New Lead Added', time: '3h ago', type: 'info', text: 'Enterprise SaaS License Upgrade added to Qualified stage.' }
  ];

  return (
    <header className="sticky top-0 z-30 glass-panel border-b border-slate-800 px-6 py-3.5">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Global Search Bar */}
        <div className="flex items-center flex-1 max-w-md relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5" />
          <input
            type="text"
            placeholder="Search leads, GST invoices, SKUs, or employee directory..."
            className="w-full bg-slate-900/90 text-sm text-slate-200 pl-10 pr-4 py-2 rounded-xl border border-slate-800 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder:text-slate-500"
          />
        </div>

        {/* Action Controls & Health Status */}
        <div className="flex items-center gap-3">
          {/* Quick Action Button */}
          <button
            onClick={onOpenQuickAction}
            className="px-3.5 py-2 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white rounded-xl text-xs font-semibold shadow-md shadow-indigo-600/20 transition flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" /> Quick Action
          </button>

          {/* Theme Toggle Button */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 text-slate-400 hover:text-slate-200 bg-slate-900 hover:bg-slate-800 rounded-xl border border-slate-800 transition"
            title="Toggle Dark/Light mode"
          >
            {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-400" />}
          </button>

          {/* Notifications Button with Badge */}
          <div className="relative">
            <button
              onClick={() => { setShowNotifications(!showNotifications); setShowRoleSwitcher(false); }}
              className="p-2 text-slate-400 hover:text-slate-200 bg-slate-900 hover:bg-slate-800 rounded-xl border border-slate-800 transition relative"
            >
              <Bell className="w-4 h-4" />
              <span className="w-2 h-2 rounded-full bg-indigo-500 absolute top-1.5 right-1.5 ring-2 ring-slate-950" />
            </button>

            {/* Notifications Dropdown Drawer */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 rounded-2xl glass-panel border border-slate-800 shadow-2xl p-4 space-y-3 z-50">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <h4 className="font-display font-bold text-xs text-white">Notifications</h4>
                  <span className="text-[10px] text-indigo-400 cursor-pointer">Mark all as read</span>
                </div>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {notifications.map((n) => (
                    <div key={n.id} className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-slate-200">{n.title}</span>
                        <span className="text-[10px] text-slate-500">{n.time}</span>
                      </div>
                      <p className="text-slate-400 text-[11px] mt-1">{n.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* API Health Status Pill */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/90 border border-slate-800 text-xs">
            <span className={`w-2 h-2 rounded-full ${apiStatus === 'connected' ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
            <span className="text-slate-300 font-medium">
              API: <span className={apiStatus === 'connected' ? 'text-emerald-400 font-semibold' : 'text-amber-400 font-semibold'}>{apiStatus}</span>
            </span>
          </div>

          {/* User Profile & Role Switcher Dropdown */}
          <div className="relative">
            <button
              onClick={() => { setShowRoleSwitcher(!showRoleSwitcher); setShowNotifications(false); }}
              className="flex items-center gap-2 pl-2 border-l border-slate-800 hover:opacity-80 transition text-left"
            >
              <div className="w-8 h-8 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-300 font-semibold text-xs">
                {currentRole.initials}
              </div>
              <div className="hidden xl:block">
                <p className="text-xs font-semibold text-slate-200 leading-tight flex items-center gap-1">
                  {currentRole.name} <ChevronDown className="w-3 h-3 text-slate-400" />
                </p>
                <p className="text-[10px] text-emerald-400 flex items-center gap-1 font-medium">
                  <ShieldCheck className="w-3 h-3 inline text-emerald-400" /> {currentRole.role}
                </p>
              </div>
            </button>

            {showRoleSwitcher && (
              <div className="absolute right-0 mt-2 w-64 rounded-2xl glass-panel border border-slate-800 shadow-2xl p-3 space-y-2 z-50">
                <div className="border-b border-slate-800 pb-2">
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Switch RBAC User Session</p>
                </div>
                {availableRoles.map((r) => (
                  <button
                    key={r.name}
                    onClick={() => { setCurrentRole(r); setShowRoleSwitcher(false); }}
                    className={`w-full p-2 rounded-xl text-left text-xs transition flex items-center justify-between ${
                      currentRole.name === r.name ? 'bg-indigo-600/20 border border-indigo-500/30 text-indigo-200' : 'hover:bg-slate-900 text-slate-300'
                    }`}
                  >
                    <div>
                      <p className="font-semibold text-slate-100">{r.name}</p>
                      <p className="text-[10px] text-slate-400">{r.role}</p>
                    </div>
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${r.badgeColor}`}>
                      {r.badge}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
