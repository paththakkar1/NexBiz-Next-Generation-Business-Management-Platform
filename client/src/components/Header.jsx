import React from 'react';
import { Building2, ShieldCheck, Activity, Bell, Search, User } from 'lucide-react';

export default function Header({ apiStatus }) {
  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-slate-800 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-emerald-400 p-0.5 shadow-lg shadow-indigo-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Building2 className="w-5 h-5 text-indigo-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display text-xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-indigo-200 bg-clip-text text-transparent">
                NexBiz
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                IN-SaaS v1.0
              </span>
            </div>
            <p className="text-xs text-slate-400">Enterprise Business Suite</p>
          </div>
        </div>

        {/* Global Search Bar */}
        <div className="hidden md:flex items-center flex-1 max-w-md mx-8 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3" />
          <input
            type="text"
            placeholder="Search leads, GST invoices, customer accounts, or SKUs..."
            className="w-full bg-slate-900/80 text-sm text-slate-200 pl-10 pr-4 py-2 rounded-xl border border-slate-800 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder:text-slate-500"
          />
        </div>

        {/* Action Controls & Health Status */}
        <div className="flex items-center gap-4">
          {/* API Health Pill */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/90 border border-slate-800 text-xs">
            <span className={`w-2 h-2 rounded-full ${apiStatus === 'connected' ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
            <span className="text-slate-300 font-medium hidden sm:inline">
              Backend API: <span className={apiStatus === 'connected' ? 'text-emerald-400' : 'text-amber-400'}>{apiStatus}</span>
            </span>
          </div>

          <button className="p-2 text-slate-400 hover:text-slate-200 bg-slate-900 hover:bg-slate-800 rounded-xl border border-slate-800 transition">
            <Bell className="w-4 h-4" />
          </button>

          {/* User Profile Stub */}
          <div className="flex items-center gap-3 pl-2 border-l border-slate-800">
            <div className="w-9 h-9 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-indigo-300 font-semibold text-sm">
              AD
            </div>
            <div className="hidden xl:block text-left">
              <p className="text-xs font-semibold text-slate-200">Admin User</p>
              <p className="text-[11px] text-emerald-400 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 inline" /> Super Admin
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
