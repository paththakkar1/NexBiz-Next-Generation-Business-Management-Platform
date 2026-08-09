import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import DashboardOverview from './components/DashboardOverview';
import ModuleCards from './components/ModuleCards';
import { Database, Server, Cpu, CheckCircle2, AlertCircle } from 'lucide-react';

export default function App() {
  const [apiStatus, setApiStatus] = useState('checking...');
  const [stats, setStats] = useState(null);

  useEffect(() => {
    // Fetch backend API health status
    fetch('/api/health')
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error('Server returned non-ok');
      })
      .then((data) => {
        setApiStatus('connected');
      })
      .catch(() => {
        setApiStatus('disconnected');
      });

    // Fetch dashboard stats from backend
    fetch('/api/dashboard/stats')
      .then((res) => res.json())
      .then((data) => setStats(data))
      .catch((err) => console.log('Backend stats offline, using defaults'));
  }, []);

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col">
      {/* Navigation Header */}
      <Header apiStatus={apiStatus} />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-8 space-y-8">
        {/* Dashboard Metrics */}
        <DashboardOverview stats={stats} />

        {/* System Architecture & Schema Status Card */}
        <div className="p-6 rounded-2xl glass-panel border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                <Server className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-display font-bold text-base text-white">System Architecture & Database Configuration</h3>
                <p className="text-xs text-slate-400">Node.js Express + MySQL Relational Database Pool</p>
              </div>
            </div>
            <span className="text-xs px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" /> Schema DDL Loaded
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
              <p className="text-slate-400 font-medium">Database Schema</p>
              <p className="text-slate-200 font-mono text-sm mt-1">server/config/schema.sql</p>
              <p className="text-[11px] text-slate-500 mt-1">7 Relational Tables with FK & Indexes</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
              <p className="text-slate-400 font-medium">Connection Utility</p>
              <p className="text-slate-200 font-mono text-sm mt-1">server/config/db.js</p>
              <p className="text-[11px] text-slate-500 mt-1">mysql2/promise connection pool</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
              <p className="text-slate-400 font-medium">Express Server Entry</p>
              <p className="text-slate-200 font-mono text-sm mt-1">server/index.js</p>
              <p className="text-[11px] text-slate-500 mt-1">CORS, Helmet, Dotenv, Error Middleware</p>
            </div>
          </div>
        </div>

        {/* Modules Navigation Cards */}
        <ModuleCards />
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 py-6 px-6 glass-panel text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 NexBiz Platform. Built for High-Growth Indian SaaS Enterprises.</p>
          <div className="flex items-center gap-4 text-slate-400">
            <span className="hover:text-slate-200 cursor-pointer">API Specs</span>
            <span>•</span>
            <span className="hover:text-slate-200 cursor-pointer">Database DDL</span>
            <span>•</span>
            <span className="hover:text-slate-200 cursor-pointer">Security & RBAC</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
